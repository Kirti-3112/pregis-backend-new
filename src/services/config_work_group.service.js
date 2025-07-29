const httpStatus = require('http-status');
const { ConfigWorkGroup } = require('../models');
const ApiError = require('../utils/ApiError');

const getWorkGroups = async (options) => {
  const { page, limit } = options.pagination;

  const { filters } = options;
  let filterToApply = {};
  if (filters && Object.hasOwn(filters, 'status')) {
    filterToApply = filters;
  }

  const count = await ConfigWorkGroup.countDocuments(filterToApply);
  const workGroupsData = await ConfigWorkGroup.find(filterToApply)
    .populate({
      path: 'machineGroups',
      select: 'name description status id',
      populate: {
        path: 'machines',
        populate: {
          path: 'machineType',
        },
      },
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();

  return {
    workGroupsData,
    rowsPerPage: limit,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalRecords: count,
  };
};

const getWorkGroupById = async (workGroupId) => {
  const workGroupData = await ConfigWorkGroup.findById(workGroupId).populate({
    path: 'machineGroups',
    select: 'name description status id',
    populate: {
      path: 'machines',
      populate: {
        path: 'machineType',
      },
    },
  });
  return workGroupData;
};

const createWorkGroup = async (workGroupData) => {
  const workGroupToAdd = {
    ...workGroupData,
    createdBy: workGroupData.userId,
  };
  return ConfigWorkGroup.create(workGroupToAdd);
};

const updateWorkGroup = async (workGroupId, updateBody) => {
  const workGroupData = await getWorkGroupById(workGroupId);
  if (!workGroupData) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  const workGroupToUpdate = { ...updateBody, updatedBy: updateBody.userId };
  Object.assign(workGroupData, workGroupToUpdate);
  try {
    await workGroupData.save();
    return workGroupData;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteWorkGroup = async (workGroupId) => {
  const workGroupData = await getWorkGroupById(workGroupId);
  if (!workGroupData) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  const deleted = await ConfigWorkGroup.deleteOne({ _id: workGroupId });
  return deleted;
};

module.exports = {
  getWorkGroups,
  getWorkGroupById,
  createWorkGroup,
  updateWorkGroup,
  deleteWorkGroup,
};
