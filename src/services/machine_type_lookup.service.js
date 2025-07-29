const httpStatus = require('http-status');
const { MachineType, ConfigMachine, WMS } = require('../models');
const ApiError = require('../utils/ApiError');
const { MACHINE_TYPE } = require('../config/constants');

const getAllMachineTypes = async (options) => {
  const { page, limit } = options.pagination;
  const count = await MachineType.countDocuments();
  const machineTypeData = await MachineType.find()
    .select()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();

  return {
    machineTypeData,
    rowsPerPage: limit,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalRecords: count,
  };
};

const getAllMachineTypesByFilters = async (body) => {
  const { filters } = body;

  const machineTypesData = await MachineType.find(filters);

  return {
    machineTypesData,
  };
};

const getMachineTypesById = async (machineTypeId) => {
  const machineTypeData = await MachineType.findById(machineTypeId);
  return machineTypeData;
};

const createMachineType = async (machineTypeData) => {
  const machineTypeToAdd = {
    ...machineTypeData,
    createdBy: machineTypeData.userId,
  };
  return MachineType.create(machineTypeToAdd);
};

const updateMachineType = async (machineTypeId, updateBody) => {
  const machineTypeData = await getMachineTypesById(machineTypeId);
  if (!machineTypeData) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Machine type configuration not found'
    );
  }
  const machineTypeToUpdate = { ...updateBody, updatedBy: updateBody.userId };
  Object.assign(machineTypeData, machineTypeToUpdate);
  try {
    await machineTypeData.save();
    return machineTypeData;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteMachineType = async (machineTypeId) => {
  const machineTypeData = await getMachineTypesById(machineTypeId);
  if (!machineTypeData) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Machine type configuration not found'
    );
  }
  const typeName = machineTypeData.machineType;
  const machines = await ConfigMachine.find(
    { machineType: machineTypeId },
    { machineName: 1 }
  ).lean();
  const wmsEntries = await WMS.find(
    { machineType: machineTypeId },
    { wmsName: 1 }
  ).lean();

  if (machines.length || wmsEntries.length) {
    const listOfMachinesorWMS = [];
    if (machines.length) {
      const listOfMachines = machines.map((m) => m.machineName).join(', ');
      listOfMachinesorWMS.push(`Machine: ${listOfMachines}`);
    }
    if (wmsEntries.length) {
      const listOfWms = wmsEntries.map((w) => w.wmsName).join(', ');
      listOfMachinesorWMS.push(`WMS: ${listOfWms}`);
    }
    const depsList = listOfMachinesorWMS.join(' & ');
    const msg = MACHINE_TYPE.MT_DETACH_DEPENDENCIES(typeName, depsList);

    throw new ApiError(httpStatus.BAD_REQUEST, msg);
  }

  const deleted = await MachineType.deleteOne({ _id: machineTypeId });
  return deleted;
};

module.exports = {
  createMachineType,
  getMachineTypesById,
  getAllMachineTypes,
  updateMachineType,
  deleteMachineType,
  getAllMachineTypesByFilters,
};
