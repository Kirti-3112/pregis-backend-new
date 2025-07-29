const httpStatus = require('http-status');
const { configUnitConversionService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { UNIT_CONVERSION_MESSAGES } = require('../config/constants');
const ApiError = require('../utils/ApiError');

const commonErrorHandler = (req, res, error) => {
  if (error.statusCode === httpStatus.NOT_FOUND) {
    logger.error(UNIT_CONVERSION_MESSAGES.NOT_FOUND());
    return res.status(httpStatus.CONFLICT).send({
      status: 'error',
      message: UNIT_CONVERSION_MESSAGES.NOT_FOUND(),
    });
  }
  logger.error(
    `${UNIT_CONVERSION_MESSAGES.ATTACH_PREFIX_CODE_TO_MESSAGE(
      UNIT_CONVERSION_MESSAGES.INTERNAL_SERVER_ERROR
    )}`,
    error
  );
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    status: 'error',
    message: UNIT_CONVERSION_MESSAGES.INTERNAL_SERVER_ERROR,
  });
};

const createUnitConversion = catchAsync(async (req, res) => {
  try {
    await configUnitConversionService.createUnitConversion(req.body);

    logger.info(
      UNIT_CONVERSION_MESSAGES.ATTACH_PREFIX_CODE_TO_MESSAGE(
        UNIT_CONVERSION_MESSAGES.METHOD_EXECUTED('createUnitConversion')
      )
    );
    res.status(httpStatus.CREATED).send({
      message:
        UNIT_CONVERSION_MESSAGES.CREATED_SUCCESS_RESPONSE_UNIT_CONVERSION,
    });
  } catch (error) {
    if (
      error.statusCode === httpStatus.CONFLICT ||
      error.message.includes('E11000')
    ) {
      logger.error(
        UNIT_CONVERSION_MESSAGES.RECORD_ALREADY_EXISTS(req.body.machineId)
      );
      return res.status(httpStatus.CONFLICT).send({
        status: 'error',
        message: UNIT_CONVERSION_MESSAGES.RECORD_ALREADY_EXISTS(
          req.body.machineId
        ),
      });
    }
    commonErrorHandler(req, res, error);
  }
});

const updateUnitConversion = catchAsync(async (req, res) => {
  try {
    await configUnitConversionService.updateUnitConversion(
      req.params.unitConversionId,
      req.body
    );

    logger.info(
      UNIT_CONVERSION_MESSAGES.ATTACH_PREFIX_CODE_TO_MESSAGE(
        UNIT_CONVERSION_MESSAGES.METHOD_EXECUTED('updateUnitConversion')
      )
    );
    res.status(httpStatus.OK).send({
      message:
        UNIT_CONVERSION_MESSAGES.UPDATED_SUCCESS_RESPONSE_UNIT_CONVERSION(
          req.params.unitConversionId
        ),
    });
  } catch (error) {
    if (
      error.statusCode === httpStatus.CONFLICT ||
      error.message.includes('E11000')
    ) {
      logger.error(
        UNIT_CONVERSION_MESSAGES.RECORD_ALREADY_EXISTS(req.body.machineId)
      );
      return res.status(httpStatus.CONFLICT).send({
        status: 'error',
        message: UNIT_CONVERSION_MESSAGES.RECORD_ALREADY_EXISTS(
          req.body.machineId
        ),
      });
    }
    commonErrorHandler(req, res, error);
  }
});

const deleteUnitConversion = catchAsync(async (req, res) => {
  try {
    await configUnitConversionService.deleteUnitConversion(
      req.params.unitConversionId
    );

    logger.info(
      UNIT_CONVERSION_MESSAGES.ATTACH_PREFIX_CODE_TO_MESSAGE(
        UNIT_CONVERSION_MESSAGES.METHOD_EXECUTED('deleteUnitConversion')
      )
    );

    res.status(httpStatus.OK).send({
      message: `Unit conversion successfully deleted for id: ${req.params.unitConversionId}`,
    });
  } catch (error) {
    commonErrorHandler(req, res, error);
  }
});

const getUnitConversions = catchAsync(async (req, res) => {
  try {
    const unitConversions =
      await configUnitConversionService.getUnitConversions(req.body);
    res.status(httpStatus.OK).send(unitConversions);
  } catch (error) {
    commonErrorHandler(req, res, error);
  }
});

const getUnitConversionByFilter = catchAsync(async (req, res) => {
  try {
    const unitConversions =
      await configUnitConversionService.getUnitConversionByFilter({
        dbMathodName: req.body.dbMathodName,
        filter: req.body.filter,
      });
    res.status(httpStatus.OK).send(unitConversions);
  } catch (error) {
    commonErrorHandler(req, res, error);
  }
});

const getUnitConversionOptions = catchAsync(async (req, res) => {
  try {
    const unitConversions =
      await configUnitConversionService.getUnitConversionOptions(req);

    logger.info(
      `Running getUnitConversionOptions(),  fetched unitConversionOptions : ${JSON.stringify(
        unitConversions
      )}`
    );

    const isEmptyOrOnlyEmptyObjects =
      !unitConversions ||
      Object.values(unitConversions).every(
        (value) =>
          value == null || // null or undefined
          (typeof value === 'object' && Object.keys(value).length === 0)
      );

    if (isEmptyOrOnlyEmptyObjects) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `No unit conversion options found for categories: ${Object.values(
          req.body.measurementCategory
        ).join(', ')}`
      );
    }

    res.status(httpStatus.OK).send(unitConversions);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(httpStatus.CONFLICT).send({
        status: 'error',
        message:
          error.message || UNIT_CONVERSION_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
    commonErrorHandler(req, res, error);
  }
});

module.exports = {
  createUnitConversion,
  updateUnitConversion,
  deleteUnitConversion,
  getUnitConversions,
  getUnitConversionByFilter,
  getUnitConversionOptions,
};
