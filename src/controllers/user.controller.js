const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const logger = require('../config/logger');
const { USER } = require('../config/constants');

const createUser = catchAsync(async (req, res) => {
  try {
    await userService.createUser(req.body);
    logger.info(`${USER.USER_REGISTER_SUCCESS}`);
    res
      .status(httpStatus.CREATED)
      .send({ status: 201, message: 'User created successfully' });
  } catch (error) {
    if (error.statusCode === 409) {
      logger.error(`${USER.USER_EXITS}`);
      return res.status(409).send({
        status: 'error',
        message: 'User already exists',
      });
    }
    logger.error(`${USER.USER_INTERNAL_SERVER_ERROR}`, error);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
});

const getUsers = catchAsync(async (req, res) => {
  try {
    const userData = await userService.queryUsers(req.body);
    logger.info(
      `${USER.USER_FETCH_SUCCESS} -  Quantity : ${userData.users.length}`
    );
    res.status(200).send({
      userData,
    });
  } catch (error) {
    logger.error(`${USER.USER_INTERNAL_SERVER_ERROR}`, error);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
});

const getUserById = catchAsync(async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.status(httpStatus.OK).send(user);
  } catch (error) {
    logger.error(`${USER.USER_INTERNAL_SERVER_ERROR}`, error);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
});

const commonErrorHandler = (req, res, error) => {
  if (error.statusCode === httpStatus.CONFLICT) {
    logger.error(`${USER.USER_ALREADY_EXISTS}`);
    return res.status(httpStatus.CONFLICT).send({
      status: 'error',
      message: `${USER.USER_ALREADY_EXISTS_MESSAGE}`,
    });
  }
  if (error.statusCode === httpStatus.NOT_FOUND) {
    logger.error(`${USER.USER_NOT_FOUND(req.params.userId)}`);
    return res.status(httpStatus.NOT_FOUND).send({
      status: 'error',
      message: USER.USER_NOT_FOUND_MESSAGE(req.params.userId),
    });
  }
  logger.error(`${USER.USER_INTERNAL_SERVER_ERROR}`, error);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    status: 'error',
    message: USER.USER_INTERNAL_SERVER_ERROR_MESSAGE,
  });
};

const updateUser = catchAsync(async (req, res) => {
  try {
    await userService.updateUserById(req.params.userId, req.body);
    logger.info(`${USER.USER_UPDATE(req.params.userId)}`);
    res
      .status(httpStatus.CREATED)
      .send({ message: `${USER.USER_UPDATE(req.params.userId)}` });
  } catch (error) {
    commonErrorHandler(req, res, error);
  }
});

const deleteUser = catchAsync(async (req, res) => {
  try {
    await userService.deleteUserById(req.params.userId);
    logger.info(`${USER.USER_DELETE(req.params.userId)}`);
    res
      .status(httpStatus.OK)
      .send({ message: `${USER.USER_DELETE(req.params.userId)}` });
  } catch (error) {
    commonErrorHandler(req, res, error);
  }
});

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
