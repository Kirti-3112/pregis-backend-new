const httpStatus = require('http-status');
const { Policy } = require('../models');
const ApiError = require('../utils/ApiError');
const { Role } = require('../models');

const createPolicy = async (policyData) => {
  const policyToCreate = {
    ...policyData,
    createdBy: policyData.userId,
  };
  return Policy.create(policyToCreate);
};

const getPolicies = async (options) => {
  const { page, limit } = options.pagination;
  const { filters } = options;
  let filterToApply = {};
  if (filters && Object.hasOwn(filters, 'isActive')) {
    filterToApply = filters;
  }
  const count = await Policy.countDocuments(filterToApply);

  const policiesData = await Policy.find(filterToApply)
    .select()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();

  return {
    policiesData,
    rowsPerPage: limit,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalRecords: count,
  };
};

const getPolicyById = async (policyId) => {
  const policyData = await Policy.findById(policyId);
  return policyData;
};

const updatePolicyById = async (policyId, updateBody) => {
  const policyData = await getPolicyById(policyId);
  if (!policyData) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  if (policyData.isActive && !updateBody.isActive) {
    const roleWithPolicy = await Role.find({ policies: policyId });

    if (roleWithPolicy.length > 0) {
      throw new ApiError(httpStatus.FORBIDDEN);
    }
  }
  const newUpdatedWMS = { ...updateBody, updatedBy: updateBody.userId };
  Object.assign(policyData, newUpdatedWMS);

  await policyData.save();
  return policyData;
};

const deletePolicyById = async (policyId) => {
  const policyData = await getPolicyById(policyId);

  if (!policyData) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  const connectedPoliciesToRole = await Role.find({ policies: policyId });

  if (connectedPoliciesToRole.length > 0) {
    throw new ApiError(httpStatus.FORBIDDEN);
  }

  const deleted = await Policy.deleteOne({ _id: policyId });
  return deleted;
};

module.exports = {
  createPolicy,
  getPolicies,
  getPolicyById,
  updatePolicyById,
  deletePolicyById,
};
