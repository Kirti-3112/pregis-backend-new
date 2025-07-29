const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { configMachineGroupService } = require('../services');
const logger = require('../config/logger');
const { CONFIG_MACHINE_GROUP } = require('../config/constants');

const getMachineGroups = catchAsync(async (req, res) => {
  try {
    const machineGroups = await configMachineGroupService.getMachineGroups(
      req.body
    );
    logger.info(
      `${CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_SUCCESS(
        'getMachineGroups'
      )}. Quantity - ${
        machineGroups && machineGroups.machineGroupsData
          ? machineGroups.machineGroupsData.length
          : 0
      }`
    );
    res.status(httpStatus.OK).send(machineGroups);
  } catch (error) {
    logger.error(
      `${CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_INTERNAL_SERVER_ERROR}`,
      error
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message:
        CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
});

const getMachineGroupById = catchAsync(async (req, res) => {
  try {
    const machineData = await configMachineGroupService.getMachineGroupById(
      req.params.machineId
    );
    logger.info(
      `${CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_SUCCESS(
        'getConfigMachinesLookupById',
        req.params.machineId
      )}`,
      `${machineData}`
    );
    if (!machineData) {
      return res.status(httpStatus.NOT_FOUND).send({
        message: CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_NOT_FOUND(
          req.params.machineId
        ),
      });
    }
    res.status(httpStatus.OK).send({ machineData });
  } catch (error) {
    logger.error(
      `${CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_INTERNAL_SERVER_ERROR}`,
      error
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message: CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_INTERNAL_SERVER_ERROR,
    });
  }
});

const createMachineGroup = catchAsync(async (req, res) => {
  try {
    await configMachineGroupService.createMachineGroup(req.body);
    logger.info(
      `${CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_SUCCESS(
        'createMachineGroup',
        req.body.name
      )}`
    );
    res
      .status(httpStatus.CREATED)
      .send({ message: CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_CREATE });
  } catch (error) {
    if (error.message.includes('machines')) {
      logger.error('Machines are already assigned to MachineGroup .');
      return res.status(httpStatus.CONFLICT).send({
        status: 'error',
        message: 'Machines are already assigned to MachineGroup .',
      });
    }

    if (error.statusCode === httpStatus.CONFLICT || error.code === 11000) {
      logger.error(
        `${CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_ALREADY_EXISTS(
          req.body.name
        )}`
      );
      return res.status(httpStatus.CONFLICT).send({
        status: 'error',
        message:
          CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_ALREADY_EXISTS_MESSAGE,
      });
    }
    logger.error(
      `${CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_INTERNAL_SERVER_ERROR}`,
      error
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message:
        CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_INTERNAL_SERVER_ERROR_MESSAGE,
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
      `${CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_ALREADY_EXISTS(
        req.body.name
      )}`
    );
    return res.status(httpStatus.CONFLICT).send({
      status: 'error',
      message: CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_ALREADY_EXISTS_MESSAGE,
    });
  }
  if (error.statusCode === httpStatus.NOT_FOUND) {
    logger.error(
      `${CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_NOT_FOUND(
        req.params.machineGroupId
      )}`
    );
    return res.status(httpStatus.NOT_FOUND).send({
      status: 'error',
      message: CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_NOT_FOUND_MESSAGE(
        req.params.machineGroupId
      ),
    });
  }
  logger.error(
    `${CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_INTERNAL_SERVER_ERROR}`,
    error
  );
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    status: 'error',
    message:
      CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_INTERNAL_SERVER_ERROR_MESSAGE,
  });
};

const updateMachineGroup = catchAsync(async (req, res) => {
  try {
    await configMachineGroupService.updateMachineGroup(
      req.params.machineGroupId,
      req.body
    );
    logger.info(
      `${CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_SUCCESS(
        'updateMachineGroup',
        req.params.machineGroupId
      )}`
    );
    res.status(httpStatus.OK).send({
      message: CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_UPDATE(
        req.params.machineGroupId
      ),
    });
  } catch (error) {
    customErrorHandler(req, res, error);
  }
});

const deleteMachineGroup = catchAsync(async (req, res) => {
  try {
    await configMachineGroupService.deleteMachineGroup(
      req.params.machineGroupId
    );
    logger.info(
      `${CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_SUCCESS(
        'deleteMachineGroup',
        req.params.machineGroupId
      )}`
    );
    res.status(httpStatus.OK).send({
      message: CONFIG_MACHINE_GROUP.CONFIG_MACHINE_GROUP_DELETE(
        req.params.machineGroupId
      ),
    });
  } catch (error) {
    customErrorHandler(req, res, error);
  }
});

module.exports = {
  getMachineGroups,
  getMachineGroupById,
  createMachineGroup,
  updateMachineGroup,
  deleteMachineGroup,
};
