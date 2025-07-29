const httpStatus = require('http-status');
const { WMS } = require('../models');
const ApiError = require('../utils/ApiError');

const createWMS = async (wmsData) => {
  const newCreatedWMS = {
    ...wmsData,
    createdBy: wmsData.userId,
  };
  return WMS.create(newCreatedWMS);
};

const queryWMS = async (options) => {
  const { page, limit } = options.pagination;
  const filter = options.filters;

  const count = await WMS.countDocuments(filter);

  const wmsData = await WMS.find(filter)
    .populate('machineType')
    .select()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();

  return {
    wmsData,
    rowsPerPage: limit,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalRecords: count,
  };
};

const getWMSById = async (wmsId) => {
  const wmsDeatils = await WMS.findById(wmsId);
  if (wmsDeatils && wmsDeatils.password) {
    const decryptedPassword = await wmsDeatils.decryptPassword(
      wmsDeatils.password
    );
    wmsDeatils.password = decryptedPassword;
  }
  return wmsDeatils;
};

const updateWMSById = async (wmsId, updateBody) => {
  const wms = await getWMSById(wmsId);
  if (!wms) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WMS configuration not found');
  }
  const modifyUpdateBody = {
    ...updateBody,
    updatedBy: updateBody.userId,
  };
  Object.assign(wms, modifyUpdateBody);
  try {
    await wms.save();
    return wms;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteWMSById = async (wmsId) => {
  const wms = await getWMSById(wmsId);
  if (!wms) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WMS configuration not found');
  }
  const deleted = await WMS.deleteOne({ _id: wmsId });
  return deleted;
};

module.exports = {
  createWMS,
  queryWMS,
  getWMSById,
  updateWMSById,
  deleteWMSById,
};
