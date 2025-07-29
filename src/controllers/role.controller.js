const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { roleService } = require('../services');
const logger = require('../config/logger');
const { ROLE } = require('../config/constants');

const createRole = catchAsync(async (req, res) => {
  try {
    await roleService.createRole(req.body);
    logger.info(`${ROLE.ROLE_SUCCESS('createRole', req.body.roleName)}`);
    res.status(httpStatus.CREATED).send({ message: ROLE.ROLE_CREATE });
  } catch (error) {
    if (
      error.statusCode === httpStatus.CONFLICT ||
      error.message.includes('E11000')
    ) {
      logger.error(`${ROLE.ROLE_ALREADY_EXISTS(req.body.roleName)}`);
      return res.status(httpStatus.CONFLICT).send({
        status: 'error',
        message: ROLE.ROLE_ALREADY_EXISTS_MESSAGE,
      });
    }
    logger.error(`${ROLE.ROLE_INTERNAL_SERVER_ERROR}`, error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message: ROLE.ROLE_INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
});

const getRoles = catchAsync(async (req, res) => {
  try {
    const roles = await roleService.getRoles(req.body);
    logger.info(
      `${ROLE.ROLE_SUCCESS('getRoles')}. Quantity - ${
        roles && roles.rolesData ? roles.rolesData.length : 0
      }`
    );

    res.status(httpStatus.OK).send(roles);
  } catch (error) {
    logger.error(`${ROLE.ROLE_INTERNAL_SERVER_ERROR}`, error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message: ROLE.ROLE_INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
});

const getRoleById = catchAsync(async (req, res) => {
  try {
    const roleData = await roleService.getRoleById(req.params.roleId);
    logger.info(`${ROLE.ROLE_SUCCESS('getRoleById')}. RoleData : ${roleData}`);
    if (!roleData) {
      return res.status(httpStatus.NOT_FOUND).send({
        message: ROLE.ROLE_NOT_FOUND_MESSAGE(req.params.roleId),
      });
    }
    res.status(httpStatus.OK).send({ roleData });
  } catch (error) {
    logger.error(`${ROLE.ROLE_INTERNAL_SERVER_ERROR}`, error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message: ROLE.ROLE_INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
});

const commonErrorHandler = (req, res, error, methodName) => {
  if (error.statusCode === httpStatus.FORBIDDEN) {
    if (methodName === 'Delete') {
      logger.error(`${ROLE.ROLE_DELETE_FORBIDDEN}`, error);
      return res.status(httpStatus.FORBIDDEN).send({
        status: 'error',
        message: ROLE.ROLE_DELETE_FORBIDDEN,
      });
    }
    if (methodName === 'Update') {
      logger.error(`${ROLE.ROLE_UPDATE_FORBIDDEN}`, error);
      return res.status(httpStatus.FORBIDDEN).send({
        status: 'error',
        message: ROLE.ROLE_UPDATE_FORBIDDEN,
      });
    }
  }

  if (error.statusCode === httpStatus.NOT_FOUND) {
    logger.error(`${ROLE.ROLE_NOT_FOUND(req.params.roleId)}`);
    return res.status(httpStatus.NOT_FOUND).send({
      status: 'error',
      message: ROLE.ROLE_NOT_FOUND_MESSAGE(req.params.roleId),
    });
  }
  logger.error(`${ROLE.ROLE_INTERNAL_SERVER_ERROR}`, error);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    status: 'error',
    message: ROLE.ROLE_INTERNAL_SERVER_ERROR_MESSAGE,
  });
};

const updateRole = catchAsync(async (req, res) => {
  try {
    await roleService.updateRoleById(req.params.roleId, req.body);
    logger.info(`${ROLE.ROLE_SUCCESS('updateRoleById', req.params.roleId)}`);
    res
      .status(httpStatus.CREATED)
      .send({ message: ROLE.ROLE_UPDATE(req.params.roleId) });
  } catch (error) {
    commonErrorHandler(req, res, error, 'Update');
  }
});

const deleteRole = catchAsync(async (req, res) => {
  try {
    await roleService.deleteRoleById(req.params.roleId);
    logger.info(`${ROLE.ROLE_SUCCESS('deleteRole', req.params.roleId)}`);
    res
      .status(httpStatus.OK)
      .send({ message: ROLE.ROLE_DELETE(req.params.roleId) });
  } catch (error) {
    commonErrorHandler(req, res, error, 'Delete');
  }
});

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
