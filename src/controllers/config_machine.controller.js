const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { configMachineService } = require('../services');
const logger = require('../config/logger');
const { CONFIGURATION_MACHINE } = require('../config/constants');

const createConfigMachine = catchAsync(async (req, res) => {
  try {
    await configMachineService.createConfigMachine(req.body);
    logger.info(
      `${CONFIGURATION_MACHINE.MACHINE_CONFIG_SUCCESS(
        'createConfigMachine',
        req.body.machineName
      )}`
    );
    res
      .status(httpStatus.CREATED)
      .send({ message: CONFIGURATION_MACHINE.MACHINE_CONFIG_CREATE });
  } catch (error) {
    if (
      error.statusCode === httpStatus.CONFLICT ||
      error.message.includes('E11000')
    ) {
      logger.error(
        `${CONFIGURATION_MACHINE.MACHINE_CONFIG_ALREADY_EXISTS(
          req.body.communicationType,
          req.body
        )} Error : ${error}`
      );
      return res.status(httpStatus.CONFLICT).send({
        status: 'error',
        message: CONFIGURATION_MACHINE.MACHINE_CONFIG_ALREADY_EXISTS_MESSAGE(
          req.body.communicationType,
          req.body
        ),
      });
    }
    logger.error(
      `${CONFIGURATION_MACHINE.MACHINE_CONFIG_INTERNAL_SERVER_ERROR}`,
      error
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message:
        CONFIGURATION_MACHINE.MACHINE_CONFIG_INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
});

const getConfigMachine = catchAsync(async (req, res) => {
  try {
    const configMachines = await configMachineService.getMachineConfigs(
      req.body
    );

    logger.info(
      `${CONFIGURATION_MACHINE.MACHINE_CONFIG_SUCCESS(
        'getMachineConfigs'
      )}. Quantity - ${
        configMachines && configMachines.machineConfigData.length > 0
          ? configMachines.machineConfigData.length
          : 0
      }`
    );
    res.status(httpStatus.OK).send(configMachines);
  } catch (error) {
    logger.error(
      `${CONFIGURATION_MACHINE.MACHINE_CONFIG_INTERNAL_SERVER_ERROR}`,
      error
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message:
        CONFIGURATION_MACHINE.MACHINE_CONFIG_INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
});

const getConfigMachineById = catchAsync(async (req, res) => {
  try {
    const machineConfigData = await configMachineService.getConfigMachineById(
      req.params.configMachineId
    );
    logger.info(
      `${CONFIGURATION_MACHINE.MACHINE_CONFIG_SUCCESS(
        'getConfigMachineById',
        req.params.configMachineId
      )}`
    );
    if (!machineConfigData) {
      return res.status(httpStatus.NOT_FOUND).send({
        message: CONFIGURATION_MACHINE.MACHINE_CONFIG_NOT_FOUND_MESSAGE(
          req.params.configMachineId
        ),
      });
    }
    res.status(httpStatus.OK).send({ machineConfigData });
  } catch (error) {
    logger.error(
      `${CONFIGURATION_MACHINE.MACHINE_CONFIG_INTERNAL_SERVER_ERROR}`,
      error
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message:
        CONFIGURATION_MACHINE.MACHINE_CONFIG_INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
});

const commonErrorHandler = (req, res, error) => {
  if (error.statusCode === httpStatus.BAD_REQUEST) {
    logger.error(error.message);
    return res.status(httpStatus.BAD_REQUEST).send({
      status: 'error',
      message: error.message,
    });
  }
  if (error.statusCode === httpStatus.NOT_FOUND) {
    logger.error(
      `${CONFIGURATION_MACHINE.MACHINE_CONFIG_NOT_FOUND(
        req.params.configMachineId
      )}`
    );
    return res.status(httpStatus.NOT_FOUND).send({
      message: CONFIGURATION_MACHINE.MACHINE_CONFIG_NOT_FOUND_MESSAGE(
        req.params.configMachineId
      ),
    });
  }
  logger.error(
    `${CONFIGURATION_MACHINE.MACHINE_CONFIG_INTERNAL_SERVER_ERROR}`,
    error
  );
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    status: 'error',
    message: CONFIGURATION_MACHINE.MACHINE_CONFIG_INTERNAL_SERVER_ERROR_MESSAGE,
  });
};

const updateConfigMachine = catchAsync(async (req, res) => {
  try {
    await configMachineService.updateConfigMachineById(
      req.params.configMachineId,
      req.body
    );
    logger.info(
      `${CONFIGURATION_MACHINE.MACHINE_CONFIG_SUCCESS(
        'updateConfigMachineById',
        req.params.configMachineId
      )}`
    );
    res.status(httpStatus.OK).send({
      message: CONFIGURATION_MACHINE.MACHINE_CONFIG_UPDATE(
        req.params.configMachineId
      ),
    });
  } catch (error) {
    if (
      error.statusCode === httpStatus.CONFLICT ||
      error.message.includes('E11000')
    ) {
      logger.error(
        `${CONFIGURATION_MACHINE.MACHINE_CONFIG_ALREADY_EXISTS(
          req.body.communicationType,
          req.body
        )} Error : ${error}`
      );
      return res.status(httpStatus.CONFLICT).send({
        status: 'error',
        message: CONFIGURATION_MACHINE.MACHINE_CONFIG_ALREADY_EXISTS_MESSAGE(
          req.body.communicationType,
          req.body
        ),
      });
    }
    commonErrorHandler(req, res, error);
  }
});

const deleteConfigMachine = catchAsync(async (req, res) => {
  try {
    await configMachineService.deleteConfigMachineById(
      req.params.configMachineId
    );
    logger.info(
      `${CONFIGURATION_MACHINE.MACHINE_CONFIG_SUCCESS(
        'deleteConfigMachineById',
        req.params.configMachineId
      )}`
    );
    return res.status(httpStatus.OK).send({
      message: CONFIGURATION_MACHINE.MACHINE_CONFIG_DELETE(
        req.params.configMachineId
      ),
    });
  } catch (error) {
    return commonErrorHandler(req, res, error);
  }
});

const getConfigMachineByFilter = catchAsync(async (req, res) => {
  try {
    const configMachines = await configMachineService.getConfigMachinesByFilter(
      req
    );

    logger.info(
      `${CONFIGURATION_MACHINE.MACHINE_CONFIG_SUCCESS(
        'getConfigMachineByFilter',
        JSON.stringify(req.body)
      )}`
    );
    res.status(httpStatus.OK).send({ configMachines });
  } catch (error) {
    logger.error(
      `${CONFIGURATION_MACHINE.MACHINE_CONFIG_INTERNAL_SERVER_ERROR}`,
      error
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message:
        CONFIGURATION_MACHINE.MACHINE_CONFIG_INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
});

module.exports = {
  createConfigMachine,
  getConfigMachine,
  getConfigMachineById,
  updateConfigMachine,
  deleteConfigMachine,
  getConfigMachineByFilter,
};
