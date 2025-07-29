const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { configWorkGroupService } = require('../services');
const logger = require('../config/logger');
const { CONFIG_WORK_GROUP } = require('../config/constants');

const getWorkGroups = catchAsync(async (req, res) => {
  try {
    const workGroups = await configWorkGroupService.getWorkGroups(req.body);
    logger.info(
      `${CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_SUCCESS(
        'getWorkGroups'
      )}. Quantity - ${
        workGroups && workGroups.workGroupsData
          ? workGroups.workGroupsData.length
          : 0
      }`
    );
    res.status(httpStatus.OK).send(workGroups);
  } catch (error) {
    logger.error(
      `${CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_INTERNAL_SERVER_ERROR}`,
      error
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message:
        CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
});

const getWorkGroupById = catchAsync(async (req, res) => {
  try {
    const workGroupData =
      await configWorkGroupService.getConfigMachineLookupById(
        req.params.workGroupId
      );
    logger.info(
      `${CONFIG_WORK_GROUP.ML_SUCCESS(
        'getConfigMachinesLookupById',
        req.params.workGroupId
      )}`,
      `${workGroupData}`
    );
    if (!workGroupData) {
      return res.status(httpStatus.NOT_FOUND).send({
        message: CONFIG_WORK_GROUP.ML_NOT_FOUND(req.params.workGroupId),
      });
    }
    res.status(httpStatus.OK).send({ workGroupData });
  } catch (error) {
    logger.error(`${CONFIG_WORK_GROUP.ML_INTERNAL_SERVER_ERROR}`, error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message: CONFIG_WORK_GROUP.ML_INTERNAL_SERVER_ERROR,
    });
  }
});

const createWorkGroup = catchAsync(async (req, res) => {
  try {
    await configWorkGroupService.createWorkGroup(req.body);
    logger.info(
      `${CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_SUCCESS(
        'createWorkGroup',
        req.body.name
      )}`
    );
    res
      .status(httpStatus.CREATED)
      .send({ message: CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_CREATE });
  } catch (error) {
    if (error.statusCode === httpStatus.CONFLICT || error.code === 11000) {
      logger.error(
        `${CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_ALREADY_EXISTS(req.body.name)}`
      );
      return res.status(httpStatus.CONFLICT).send({
        status: 'error',
        message: CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_ALREADY_EXISTS_MESSAGE,
      });
    }
    logger.error(
      `${CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_INTERNAL_SERVER_ERROR}`,
      error
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message:
        CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
});

const customErrorHandler = (req, res, error) => {
  if (
    error.statusCode === httpStatus.CONFLICT ||
    error.message.includes('E11000')
  ) {
    logger.error(
      `${CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_ALREADY_EXISTS(req.body.name)}`
    );
    return res.status(httpStatus.CONFLICT).send({
      status: 'error',
      message: CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_ALREADY_EXISTS_MESSAGE,
    });
  }
  if (error.statusCode === httpStatus.NOT_FOUND) {
    logger.error(
      `${CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_NOT_FOUND(req.params.workGroupId)}`
    );
    return res.status(httpStatus.NOT_FOUND).send({
      status: 'error',
      message: CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_NOT_FOUND_MESSAGE(
        req.params.workGroupId
      ),
    });
  }
  logger.error(
    `${CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_INTERNAL_SERVER_ERROR}`,
    error
  );
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    status: 'error',
    message: CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_INTERNAL_SERVER_ERROR_MESSAGE,
  });
};

const updateWorkGroup = catchAsync(async (req, res) => {
  try {
    await configWorkGroupService.updateWorkGroup(
      req.params.workGroupId,
      req.body
    );
    logger.info(
      `${CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_SUCCESS(
        'updateMachineGroup',
        req.params.workGroupId
      )}`
    );
    res.status(httpStatus.OK).send({
      message: CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_UPDATE(
        req.params.workGroupId
      ),
    });
  } catch (error) {
    customErrorHandler(req, res, error);
  }
});

const deleteWorkGroup = catchAsync(async (req, res) => {
  try {
    await configWorkGroupService.deleteWorkGroup(req.params.workGroupId);
    logger.info(
      `${CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_SUCCESS(
        'deleteWorkGroup',
        req.params.workGroupId
      )}`
    );
    res.status(httpStatus.OK).send({
      message: CONFIG_WORK_GROUP.CONFIG_WORK_GROUP_DELETE(
        req.params.workGroupId
      ),
    });
  } catch (error) {
    customErrorHandler(req, res, error);
  }
});

module.exports = {
  getWorkGroups,
  getWorkGroupById,
  createWorkGroup,
  updateWorkGroup,
  deleteWorkGroup,
};
