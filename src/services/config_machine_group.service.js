const httpStatus = require('http-status');
const { ConfigMachineGroup, User, Role } = require('../models');
const ApiError = require('../utils/ApiError');
const {
  modifyReferenceDependencies,
  withTransaction,
} = require('../utils/common');
const { USER_ROLES, CONFIG_MACHINE_GROUP } = require('../config/constants');

const getMachineGroups = async (options) => {
  const { page, limit } = options.pagination;

  const { filters } = options;
  let filterToApply = {};
  if (filters && Object.hasOwn(filters, 'status')) {
    filterToApply = filters;
  }

  const count = await ConfigMachineGroup.countDocuments(filterToApply);
  const machineGroupsData = await ConfigMachineGroup.find(filterToApply)
    .populate({
      path: 'machines',
      populate: {
        path: 'machineType',
      },
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();
  const assignedMachinesToMachineGroups = new Set(
    machineGroupsData
      .map((group) => group.machines.map((machine) => machine.machineName))
      .flat()
  );
  return {
    machineGroupsData,
    assignedMachinesToMachineGroups: [...assignedMachinesToMachineGroups],
    rowsPerPage: limit,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalRecords: count,
  };
};

const getMachineGroupById = async (machineId) => {
  const machineData = await ConfigMachineGroup.findById(machineId).populate({
    path: 'machines',
    populate: {
      path: 'machineType',
    },
  });
  return machineData;
};

const createMachineGroup = async (machineData) => {
  const machineToAdd = {
    ...machineData,
    createdBy: machineData.userId,
  };
  return ConfigMachineGroup.create(machineToAdd);
};

const updateMachineGroup = async (machineId, updateBody) => {
  const machineData = await getMachineGroupById(machineId);
  if (!machineData) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }

  // fetch Administration _id from Roles
  const excludeRoles = await Role.find({
    roleName: { $in: [USER_ROLES.ADMINISTRATOR] },
  }).select('_id');

  const excludeRoleIds = excludeRoles.map((role) => role && role._id);

  return withTransaction(async () => {
    const modifyDependencies = [
      /** update the User's wishlist which matches with machine group when machineGroup.name changes  */
      {
        collectionName: User,
        operation: 'updateMany',
        // Except Administration user, update the User's wishlist which matches with machineData.name
        filter: {
          roles: {
            $nin: excludeRoleIds,
          },
          'machineWishList.machineGroup': machineData.name,
        },
        update: {
          $set: {
            'machineWishList.machineGroup': updateBody.name
              ? updateBody.name
              : machineData.name,
          },
        },
        options: {
          // session,
        },
      },
    ];
    await modifyReferenceDependencies(modifyDependencies);

    const machineToUpdate = { ...updateBody, updatedBy: updateBody.userId };

    Object.assign(machineData, machineToUpdate);

    await machineData.save();

    return machineData;
  });
};

const deleteMachineGroup = async (machineGroupId) => {
  const machineData = await getMachineGroupById(machineGroupId);
  if (!machineData) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  const associatedUsers = await User.find({
    machineGroups: machineGroupId,
  });
  if (associatedUsers.length > 0) {
    const mapedUsers = associatedUsers.map((l) => l.displayName).join(', ');
    const msg = CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_DETACH_DEPENDENCIES(
      machineData.name,
      mapedUsers
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
      /** clear the User's wishlist which matches with machine group when machineGroup is deleted  */
      {
        collectionName: User,
        operation: 'updateMany',
        // Except Administration user, update the User's wishlist which matches with machineData.name
        filter: {
          roles: {
            $nin: excludeRoleIds,
          },
          'machineWishList.machineGroup': machineData.name,
        },
        update: {
          $set: {
            'machineWishList.machineGroup': '',
            'machineWishList.machineId': '',
          },
        },
        options: {
          // session,
        },
      },
    ];
    await modifyReferenceDependencies(modifyDependencies);

    const deleted = await ConfigMachineGroup.deleteOne({ _id: machineGroupId });

    return deleted;
  });
};

const getMachineGroupByName = async (machineGroupName) => {
  const machineGroup = await ConfigMachineGroup.findOne({
    name: machineGroupName,
  }).populate({
    path: 'machines',
    populate: {
      path: 'machineType',
    },
  });
  if (!machineGroup) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }

  return machineGroup;
};

module.exports = {
  getMachineGroups,
  getMachineGroupById,
  createMachineGroup,
  updateMachineGroup,
  deleteMachineGroup,
  getMachineGroupByName,
};
