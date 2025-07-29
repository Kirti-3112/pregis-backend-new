const httpStatus = require('http-status');
const { ConfigMachineLookup, ConfigMachineGroup } = require('../models');
const ApiError = require('../utils/ApiError');
const { CONFIG_MACHINE_LOOKUP } = require('../config/constants');

const getAllConfigMachineLookup = async (options) => {
  const { page, limit } = options.pagination;
  const count = await ConfigMachineLookup.countDocuments();
  const machineData = await ConfigMachineLookup.find()
    .populate('machineType')
    .select()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();

  return {
    machineData,
    rowsPerPage: limit,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalRecords: count,
  };
};

const getConfigMachineLookupByMachineId = async (machineId) => {
  const machineData = await ConfigMachineLookup.findOne({ machineId }).populate(
    'machineType'
  );
  return machineData;
};

const getConfigMachineLookupById = async (machineId) => {
  const machineData = await ConfigMachineLookup.findById(machineId).populate(
    'machineType'
  );
  return machineData;
};

const createConfigMachineLookup = async (machineData) => {
  const machineToAdd = {
    ...machineData,
    createdBy: machineData.userId,
  };
  return ConfigMachineLookup.create(machineToAdd);
};

const updateConfigMachineLookup = async (machineId, updateBody) => {
  const machineData = await getConfigMachineLookupById(machineId);
  if (!machineData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Config machine lookup not found');
  }
  const machineToUpdate = { ...updateBody, updatedBy: updateBody.userId };
  Object.assign(machineData, machineToUpdate);
  try {
    await machineData.save();
    return machineData;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteConfigMachineLookup = async (machineId) => {
  const machineData = await getConfigMachineLookupById(machineId);
  if (!machineData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Config machine lookup not found');
  }
  const { machineName } = machineData;

  const machineGroup = await ConfigMachineGroup.findOne(
    { machines: machineData._id },
    { name: 1, _id: 0 }
  ).lean();
  if (machineGroup) {
    const msg = CONFIG_MACHINE_LOOKUP.MT_DETACH_DEPENDENCIES(
      machineName,
      machineGroup.name
    );
    throw new ApiError(httpStatus.BAD_REQUEST, msg);
  }

  const result = await ConfigMachineLookup.deleteOne({ _id: machineId });
  return result;
};

module.exports = {
  createConfigMachineLookup,
  getConfigMachineLookupById,
  getAllConfigMachineLookup,
  updateConfigMachineLookup,
  deleteConfigMachineLookup,
  getConfigMachineLookupByMachineId,
};
