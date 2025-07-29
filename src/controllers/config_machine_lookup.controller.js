const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { configMachineLookupService } = require('../services');
const logger = require('../config/logger');
const { CONFIG_MACHINE_LOOKUP } = require('../config/constants');

const getAllConfigMachineLookup = catchAsync(async (req, res) => {
  try {
    const configMachineLookupData =
      await configMachineLookupService.getAllConfigMachineLookup(req.body);
    logger.info(
      `${CONFIG_MACHINE_LOOKUP.ML_SUCCESS('getAllConfigMachinesLookup')}`,
      `Quantity - ${configMachineLookupData.machineData.length}`
    );
    res.status(httpStatus.OK).send(configMachineLookupData);
  } catch (error) {
    logger.error(`${CONFIG_MACHINE_LOOKUP.ML_INTERNAL_SERVER_ERROR}`, error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message: CONFIG_MACHINE_LOOKUP.ML_INTERNAL_SERVER_ERROR,
    });
  }
});

const getConfigMachineLookupById = catchAsync(async (req, res) => {
  try {
    const machineData =
      await configMachineLookupService.getConfigMachineLookupById(
        req.params.machineId
      );
    logger.info(
      `${CONFIG_MACHINE_LOOKUP.ML_SUCCESS(
        'getConfigMachinesLookupById',
        req.params.machineId
      )}`,
      `${machineData}`
    );
    if (!machineData) {
      return res.status(httpStatus.NOT_FOUND).send({
        message: CONFIG_MACHINE_LOOKUP.ML_NOT_FOUND(req.params.machineId),
      });
    }
    res.status(httpStatus.OK).send({ machineData });
  } catch (error) {
    logger.error(`${CONFIG_MACHINE_LOOKUP.ML_INTERNAL_SERVER_ERROR}`, error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message: CONFIG_MACHINE_LOOKUP.ML_INTERNAL_SERVER_ERROR,
    });
  }
});

const createConfigMachineLookup = catchAsync(async (req, res) => {
  try {
    await configMachineLookupService.createConfigMachineLookup(req.body);
    logger.info(
      `${CONFIG_MACHINE_LOOKUP.ML_SUCCESS(
        'createConfigMachinesLookup',
        req.body.machine
      )}`
    );
    res
      .status(httpStatus.CREATED)
      .send({ message: CONFIG_MACHINE_LOOKUP.ML_CREATE });
  } catch (error) {
    if (error.message.includes('machineName')) {
      return res.status(httpStatus.CONFLICT).send({
        status: 'error',
        message: CONFIG_MACHINE_LOOKUP.ML_MACHINE_NAME_ALREADY_EXISTS(
          req.body.machineId
        ),
      });
    }
    if (error.statusCode === httpStatus.CONFLICT || error.code === 11000) {
      logger.error(
        `${CONFIG_MACHINE_LOOKUP.ML_ALREADY_EXISTS(req.body.machineId)}`
      );
      return res.status(httpStatus.CONFLICT).send({
        status: 'error',
        message: CONFIG_MACHINE_LOOKUP.ML_ALREADY_EXISTS(req.body.machineId),
      });
    }
    logger.error(`${CONFIG_MACHINE_LOOKUP.ML_INTERNAL_SERVER_ERROR}`, error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message: CONFIG_MACHINE_LOOKUP.ML_INTERNAL_SERVER_ERROR,
    });
  }
});

const customErrorHandler = (req, res, error) => {
  if (error.statusCode === httpStatus.BAD_REQUEST) {
    logger.error(error.message);
    return res.status(httpStatus.BAD_REQUEST).send({
      status: 'error',
      message: error.message,
    });
  }
  if (
    error.statusCode === httpStatus.CONFLICT ||
    error.message.includes('E11000')
  ) {
    logger.error(
      `${CONFIG_MACHINE_LOOKUP.ML_ALREADY_EXISTS(req.body.machine)}`
    );
    return res.status(httpStatus.NOT_FOUND).send({
      status: 'error',
      message: CONFIG_MACHINE_LOOKUP.ML_ALREADY_EXISTS(req.body.machine),
    });
  }
  if (error.statusCode === 404) {
    logger.error(`${CONFIG_MACHINE_LOOKUP.ML_NOT_FOUND(req.params.machineId)}`);
    return res.status(httpStatus.NOT_FOUND).send({
      status: 'error',
      message: CONFIG_MACHINE_LOOKUP.ML_NOT_FOUND(req.params.machineId),
    });
  }
  logger.error(`${CONFIG_MACHINE_LOOKUP.ML_INTERNAL_SERVER_ERROR}`, error);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    status: 'error',
    message: CONFIG_MACHINE_LOOKUP.ML_INTERNAL_SERVER_ERROR,
  });
};

const updateConfigMachineLookup = catchAsync(async (req, res) => {
  try {
    await configMachineLookupService.updateConfigMachineLookup(
      req.params.machineId,
      req.body
    );
    logger.info(
      `${CONFIG_MACHINE_LOOKUP.ML_SUCCESS(
        'updateConfigMachinesLookup',
        req.params.machineId
      )}`
    );
    res
      .status(httpStatus.OK)
      .send({ message: CONFIG_MACHINE_LOOKUP.ML_UPDATE(req.params.machineId) });
  } catch (error) {
    customErrorHandler(req, res, error);
  }
});

const deleteConfigMachineLookup = catchAsync(async (req, res) => {
  try {
    await configMachineLookupService.deleteConfigMachineLookup(
      req.params.machineId
    );
    logger.info(
      `${CONFIG_MACHINE_LOOKUP.ML_SUCCESS(
        'deleteConfigMachinesLookup',
        req.params.machineId
      )}`
    );
    return res
      .status(httpStatus.OK)
      .send({ message: CONFIG_MACHINE_LOOKUP.ML_DELETE(req.params.machineId) });
  } catch (error) {
    return customErrorHandler(req, res, error);
  }
});

module.exports = {
  createConfigMachineLookup,
  getConfigMachineLookupById,
  getAllConfigMachineLookup,
  updateConfigMachineLookup,
  deleteConfigMachineLookup,
};
