const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
const logger = require('../config/logger');
const { AUTH, USER_DEFAULT_ROLENAME } = require('../config/constants');
const { Role } = require('../models');

const register = catchAsync(async (req, res) => {
  try {
    // TODO - if role script not available user can't register him self. need to provide proepr message to him .
    // make role optional at the time of registration
    const defaultRolesData = await Role.findOne({
      roleName: USER_DEFAULT_ROLENAME,
    });
    req.body.roles = defaultRolesData._id;
    await userService.createUser(req.body);
    logger.info(`${AUTH.AUTH_REGISTER_SUCCESS}`);
    res
      .status(httpStatus.CREATED)
      .send({ status: 201, message: 'register successfully' });
  } catch (error) {
    if (error.statusCode === 409) {
      logger.error(`${AUTH.AUTH_EXITS}`);
      return res.status(409).send({
        status: 'error',
        message: 'User already exists',
      });
    }
    logger.error(`${AUTH.AUTH_INTERNAL_SERVER_ERROR}`, error);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
});

const login = catchAsync(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(
      email,
      password
    );

    /* first check for that user if refresh-token exist 
      ? then use that refresh-token to generate the new access token and return that 
      : generateAuthTokens */
    const refreshToken = await tokenService.checkRefreshTokenAvailable(
      user._id
    );
    let tokens;

    if (refreshToken) {
      const newAccessToken = await authService.refreshAuth(refreshToken.token);

      tokens = {
        access: newAccessToken.access,
        refresh: {
          token: refreshToken.token,
          expires: refreshToken.expires,
        },
      };
    } else {
      tokens = await tokenService.generateAuthTokens(user);
    }

    delete user.password;
    delete user.isEmailVerified;

    // extract all unique policyNames from user.policy & user.role.policy
    const allowedPolicyNames = [...user.policies, ...user.roles.policies].map(
      (policy) => policy.policyName
    );

    // Generate SideMenuConfiguration for the user
    const userSideMenuConfiguration =
      userService.generateUserSideMenuConfiguration(allowedPolicyNames);

    logger.info(`${AUTH.AUTH_LOGIN_SUCCESS}`);
    res
      .status(httpStatus.OK)
      .send({ user, tokens, sideMenuConfiguration: userSideMenuConfiguration });
  } catch (error) {
    if (error.statusCode === 404) {
      logger.error(`${AUTH.AUTH_NOT_FOUND}`);
      return res.status(404).send({
        status: 'error',
        message: 'User Not Found',
      });
    }

    if (error.statusCode === 405) {
      return res.status(405).send({
        status: 'error',
        message:
          'Registered email is inactive, to activate contact administrator',
      });
    }
    logger.error(`${AUTH.AUTH_INTERNAL_SERVER_ERROR}`, error);
    res.status(500).send({ status: 'error', message: error.message });
  }
});

const logout = catchAsync(async (req, res) => {
  try {
    await authService.logout(req.body.token);
    res
      .status(httpStatus.OK)
      .send({ status: 200, message: 'logged-out successful' });
  } catch (error) {
    logger.error(`Error While User Logout.`, error);
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
  }
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
};
