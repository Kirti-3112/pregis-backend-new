const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { machineTypeLookupService } = require('../services');
const logger = require('../config/logger');
const { MACHINE_TYPE } = require('../config/constants');

const getAllMachineTypes = catchAsync(async (req, res) => {
  try {
    const machineTypeDeatils =
      await machineTypeLookupService.getAllMachineTypes(req.body);
    logger.info(
      `${MACHINE_TYPE.MT_SUCCESS('getAllMachineTypes')}`,
      `Quantity - ${machineTypeDeatils.length}`
    );
    res.status(httpStatus.OK).send(machineTypeDeatils);
  } catch (error) {
    logger.error(`${MACHINE_TYPE.MT_INTERNAL_SERVER_ERROR}`, error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message: MACHINE_TYPE.MT_INTERNAL_SERVER_ERROR,
    });
  }
});

const getAllMachineTypesByFilters = catchAsync(async (req, res) => {
  try {
    const machineTypes =
      await machineTypeLookupService.getAllMachineTypesByFilters(req.body);
    logger.info(
      `${MACHINE_TYPE.MT_SUCCESS('getAllMachineTypesByFilters')}`,
      `Quantity - ${machineTypes.length}`
    );
    res.status(httpStatus.OK).send(machineTypes);
  } catch (error) {
    logger.error(`${MACHINE_TYPE.MT_INTERNAL_SERVER_ERROR}`, error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message: MACHINE_TYPE.MT_INTERNAL_SERVER_ERROR,
    });
  }
});

const getMachineTypesById = catchAsync(async (req, res) => {
  try {
    const machineTypeData = await machineTypeLookupService.getMachineTypesById(
      req.params.machineTypeId
    );
    logger.info(
      `${MACHINE_TYPE.MT_SUCCESS(
        'getMachineTypesById',
        req.params.machineTypeId
      )}`,
      `${machineTypeData}`
    );
    if (!machineTypeData) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: MACHINE_TYPE.MT_NOT_FOUND(req.params.machineTypeId) });
    }
    res.status(httpStatus.OK).send({ machineTypeData });
  } catch (error) {
    logger.error(`${MACHINE_TYPE.MT_INTERNAL_SERVER_ERROR}`, error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message: MACHINE_TYPE.MT_INTERNAL_SERVER_ERROR,
    });
  }
});

const createMachineType = catchAsync(async (req, res) => {
  try {
    await machineTypeLookupService.createMachineType(req.body);
    logger.info(
      `${MACHINE_TYPE.MT_SUCCESS('createMachineType', req.body.machineType)}`
    );
    res.status(httpStatus.CREATED).send({ message: MACHINE_TYPE.MT_CREATE });
  } catch (error) {
    if (error.code === 11000) {
      logger.error(`${MACHINE_TYPE.MT_ALREADY_EXISTS(req.body.machineType)}`);
      return res.status(httpStatus.CONFLICT).send({
        status: 'error',
        message: MACHINE_TYPE.MT_ALREADY_EXISTS(req.body.machineType),
      });
    }
    logger.error(`${MACHINE_TYPE.MT_INTERNAL_SERVER_ERROR}`, error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message: MACHINE_TYPE.MT_INTERNAL_SERVER_ERROR,
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
  if (error.message.includes('E11000')) {
    logger.error(`${MACHINE_TYPE.MT_ALREADY_EXISTS(req.body.machineType)}`);
    return res.status(httpStatus.NOT_FOUND).send({
      status: 'error',
      message: MACHINE_TYPE.MT_ALREADY_EXISTS(req.body.machineType),
    });
  }
  if (error.statusCode === 404) {
    logger.error(`${MACHINE_TYPE.MT_NOT_FOUND(req.params.machineTypeId)}`);
    return res.status(httpStatus.NOT_FOUND).send({
      status: 'error',
      message: MACHINE_TYPE.MT_NOT_FOUND(req.params.machineTypeId),
    });
  }
  logger.error(`${MACHINE_TYPE.MT_INTERNAL_SERVER_ERROR}`, error);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    status: 'error',
    message: MACHINE_TYPE.MT_INTERNAL_SERVER_ERROR,
  });
};

const updateMachineType = catchAsync(async (req, res) => {
  try {
    await machineTypeLookupService.updateMachineType(
      req.params.machineTypeId,
      req.body
    );
    logger.info(
      `${MACHINE_TYPE.MT_SUCCESS(
        'updateMachineType',
        req.params.machineTypeId
      )}`
    );
    res
      .status(httpStatus.CREATED)
      .send({ message: MACHINE_TYPE.MT_UPDATE(req.params.machineTypeId) });
  } catch (error) {
    customErrorHandler(req, res, error);
  }
});

const deleteMachineType = catchAsync(async (req, res) => {
  try {
    await machineTypeLookupService.deleteMachineType(req.params.machineTypeId);
    logger.info(
      `${MACHINE_TYPE.MT_SUCCESS(
        'deleteMachineType',
        req.params.machineTypeId
      )}`
    );
    return res
      .status(httpStatus.OK)
      .send({ message: MACHINE_TYPE.MT_DELETE(req.params.machineTypeId) });
  } catch (error) {
    return customErrorHandler(req, res, error);
  }
});

module.exports = {
  createMachineType,
  getMachineTypesById,
  getAllMachineTypes,
  updateMachineType,
  deleteMachineType,
  getAllMachineTypesByFilters,
};
