const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { wmsService } = require('../services');
const logger = require('../config/logger');
const { WMS } = require('../config/constants');

const createWMS = catchAsync(async (req, res) => {
  try {
    await wmsService.createWMS(req.body);
    logger.info(`${WMS.WMS_REGISTER_SUCCESS}`);
    res
      .status(httpStatus.CREATED)
      .send({ message: 'WMS configuration created successfully' });
  } catch (error) {
    if (
      error.statusCode === httpStatus.CONFLICT ||
      error.message.includes('E11000')
    ) {
      logger.error(`${WMS.WMS_EXITS}`);
      return res.status(409).send({
        status: 'error',
        message: 'WMS already exists',
      });
    }
    logger.error(`${WMS.WMS_INTERNAL_SERVER_ERROR}`, error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ status: 'error', message: 'Internal Server Error' });
  }
});

const getWMS = catchAsync(async (req, res) => {
  try {
    const wmsData = await wmsService.queryWMS(req.body);
    logger.info(`${WMS.WMS_FETCH_SUCCESS}`, `Quantity - ${wmsData.length}`);
    res.status(httpStatus.OK).send(wmsData);
  } catch (error) {
    logger.error(`${WMS.WMS_INTERNAL_SERVER_ERROR}`, error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ status: 'error', message: 'Internal Server Error' });
  }
});

const getWMSById = catchAsync(async (req, res) => {
  try {
    const wmsData = await wmsService.getWMSById(req.params.wmsId);
    logger.info(`${WMS.WMS_FETCH_SUCCESS}`, `Quantity - ${wmsData}`);
    if (!wmsData) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: WMS.WMS_NOT_FOUND });
    }
    res.status(httpStatus.OK).send({ wmsData });
  } catch (error) {
    logger.error(`${WMS.WMS_INTERNAL_SERVER_ERROR}`, error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ status: 'error', message: 'Internal Server Error' });
  }
});

const updateWMS = catchAsync(async (req, res) => {
  try {
    await wmsService.updateWMSById(req.params.wmsId, req.body);
    logger.info(`${WMS.WMS_UPDATE_SUCCESS}`);
    res
      .status(httpStatus.CREATED)
      .send({ message: 'WMS updated successfully' });
  } catch (error) {
    if (error.statusCode === 404) {
      logger.error(`${WMS.WMS_NOT_FOUND}`);
      return res.status(404).send({
        status: 'error',
        message: 'WMS Configuration Not Found',
      });
    }
    logger.error(`${WMS.WMS_INTERNAL_SERVER_ERROR}`, error);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
});

const deleteWMS = catchAsync(async (req, res) => {
  try {
    await wmsService.deleteWMSById(req.params.wmsId);
    logger.info(`${WMS.WMS_DELETE_SUCCESS}`);
    res.status(httpStatus.OK).send({ message: 'WMS deleted successfully' });
  } catch (error) {
    if (error.statusCode === 404) {
      logger.error(`${WMS.WMS_NOT_FOUND}`);
      return res.status(404).send({
        status: 'error',
        message: 'WMS Configuration Not Found',
      });
    }
    logger.error(`${WMS.WMS_INTERNAL_SERVER_ERROR}`, error);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
});

module.exports = {
  createWMS,
  getWMS,
  getWMSById,
  updateWMS,
  deleteWMS,
};
