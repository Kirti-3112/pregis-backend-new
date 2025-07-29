/* eslint-disable no-restricted-syntax */
const httpStatus = require('http-status');
const {
  ConfigMachine,
  ConfigUnitConversion,
  User,
  Role,
  ConfigMachineLookup,
} = require('../models');
const ApiError = require('../utils/ApiError');
const { USER_ROLES, CONFIGURATION_MACHINE } = require('../config/constants');

const {
  modifyReferenceDependencies,
  withTransaction,
} = require('../utils/common');

const createConfigMachine = async (ConfigMachineData) => {
  const newCreatedWMS = {
    ...ConfigMachineData,
    createdBy: ConfigMachineData.userId,
  };
  return ConfigMachine.create(newCreatedWMS);
};

const getMachineConfigs = async (options) => {
  const { page, limit } = options.pagination;
  const filter = options.filters;

  const count = await ConfigMachine.countDocuments(filter);

  const machineConfigData = await ConfigMachine.find(filter)
    .populate('machineType')
    .select()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();
  // let machineConfigData = [];
  // if (filter.communicationType === 'MQTT') {
  //   machineConfigData = machineConfigs.map((machineConfig) => ({
  //     ...machineConfig,
  //     portNumber: machineConfig.portNumber.toString(),
  //     id: machineConfig._id,
  //   }));
  // } else {
  //   machineConfigData = machineConfigs.map((machineConfig) => ({
  //     ...machineConfig,
  //     id: machineConfig._id,
  //   }));
  // }

  return {
    machineConfigData,
    rowsPerPage: limit,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalRecords: count,
  };
};

const getConfigMachineById = async (id) => {
  const configMachineData = await ConfigMachine.findById(id).populate(
    'machineType'
  );

  if (configMachineData && configMachineData.password) {
    const decryptedPassword = await configMachineData.decryptPassword(
      configMachineData.password
    );
    configMachineData.password = decryptedPassword;
  }

  return configMachineData;
};

const updateConfigMachineById = async (ConfigMachineId, updateBody) => {
  const ConfigMachineData = await getConfigMachineById(ConfigMachineId);
  if (!ConfigMachineData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Config Machine not found');
  }
  const newUpdatedConfigMachine = {
    ...updateBody,
    updatedBy: updateBody.userId,
  };
  Object.assign(ConfigMachineData, newUpdatedConfigMachine);
  try {
    await ConfigMachineData.save();
    return ConfigMachineData;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteConfigMachineById = async (ConfigMachineId) => {
  const ConfigMachineData = await getConfigMachineById(ConfigMachineId);
  if (!ConfigMachineData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Config Machine not found');
  }
  const { machineName } = ConfigMachineData;

  const machineLookup = await ConfigMachineLookup.find(
    { machineId: ConfigMachineData.machineName },
    { machineName: 1, _id: 0 }
  ).lean();

  if (machineLookup.length > 0) {
    const lookupList = machineLookup.map((l) => l.machineName).join(', ');
    const msg = CONFIGURATION_MACHINE.MT_DETACH_DEPENDENCIES(
      machineName,
      lookupList
    );
    throw new ApiError(httpStatus.BAD_REQUEST, msg);
  }

  // fetch Administration _id from Roles
  const excludeRoles = await Role.find({
    roleName: { $in: [USER_ROLES.ADMINISTRATOR] },
  }).select('_id');

  const excludeRoleIds = excludeRoles.map((role) => role && role._id);

  return withTransaction(async () => {
    const modifyDependencies = [
      /** delete the Unit Conversion for that configMachine when configMachine is deleted */
      {
        collectionName: ConfigUnitConversion,
        operation: 'deleteOne',
        filter: { machineId: ConfigMachineData._id },
      },
      /** clear the User's wishlist which matches with ConfigMachineData.machineName when configMachine is deleted */
      {
        collectionName: User,
        operation: 'updateMany',

        // Except Administration user, update the User's wishlist which matches with ConfigMachineData.machineName
        filter: {
          roles: {
            $nin: excludeRoleIds,
          },
          'machineWishList.machineId': ConfigMachineData.machineName,
        },
        update: {
          $set: {
            'machineWishList.machineGroup': '',
            'machineWishList.machineId': '',
          },
        },
        // options: { session },
      },
    ];
    await modifyReferenceDependencies(modifyDependencies);

    const deleted = await ConfigMachine.deleteOne({ _id: ConfigMachineId });

    return deleted;
  });
};

const getConfigMachinesByFilter = async (req) => {
  const { filters, selectFields } = req.body;
  const configMachinesByFilterData = await ConfigMachine.find(filters)
    .lean()
    .populate('machineType', 'machineType')
    .select(selectFields)
    .exec();
  return configMachinesByFilterData;
};

module.exports = {
  createConfigMachine,
  getMachineConfigs,
  getConfigMachineById,
  updateConfigMachineById,
  deleteConfigMachineById,
  getConfigMachinesByFilter,
};
