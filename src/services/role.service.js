const httpStatus = require('http-status');
const { User, Role } = require('../models');
const ApiError = require('../utils/ApiError');

const createRole = async (roleData) => {
  const RoleToCreate = {
    ...roleData,
    createdBy: roleData.userId,
  };
  return Role.create(RoleToCreate);
};

const getRoles = async (options) => {
  const { page, limit } = options.pagination;

  const { filters } = options;
  let filterToApply = {};
  if (filters && Object.hasOwn(filters, 'isActive')) {
    filterToApply = filters;
  }

  const count = await Role.countDocuments(filterToApply);
  const rolesData = await Role.find(filterToApply)
    .populate('policies')
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();

  return {
    rolesData,
    rowsPerPage: limit,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalRecords: count,
  };
};
const getRoleById = async (roleId) => {
  const roleData = await Role.findById(roleId).populate('policies');
  return roleData;
};

const updateRoleById = async (roleId, updateBody) => {
  const roleData = await getRoleById(roleId);

  if (!roleData) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }

  if (roleData.isActive && !updateBody.isActive) {
    const roleWithPolicy = await Role.find({ policies: roleId });

    if (roleWithPolicy.length > 0) {
      throw new ApiError(httpStatus.FORBIDDEN);
    }
  }
  const newUpdatedWMS = { ...updateBody, updatedBy: updateBody.userId };
  Object.assign(roleData, newUpdatedWMS);

  await roleData.save();
  return roleData;
};

const deleteRoleById = async (roleId) => {
  const roleData = await getRoleById(roleId);

  if (!roleData) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  const connectedRolesToUser = await User.find({ roles: roleId });

  if (connectedRolesToUser.length > 0) {
    throw new ApiError(httpStatus.FORBIDDEN);
  }
  const deleted = await Role.deleteOne({ _id: roleId });
  return deleted;
};

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
};
