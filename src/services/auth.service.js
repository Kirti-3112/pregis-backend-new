const httpStatus = require('http-status');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const tokenService = require('./token.service');
const { tokenTypes } = require('../config/tokens');
const {
  getUnitConversionByFilter,
} = require('./config_unit_conversion.service');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'We cannot find an user with that email address'
    );
  }
  if (!user.isActive) {
    throw new ApiError(
      httpStatus.METHOD_NOT_ALLOWED,
      'Registered email is inactive, to activate contact administrator'
    );
  }
  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  // add machineLevelUnitConversion in user response
  if (user.machineGroups.length) {
    const machineIds = user.machineGroups.flatMap((machineGroup) =>
      machineGroup.machines.map((machine) => machine.machineId)
    );

    const input = {
      body: {
        dbMathodName: 'find',
        filter: {
          'machineId.machineName': {
            $in: machineIds,
          },
        },
      },
    };
    // fetch unit conversions only if there are machineIds
    const filteredUnitConversionsByMachine = machineIds.length
      ? await getUnitConversionByFilter(input)
      : [];

    let machineToUnitConversionMap = [];
    if (machineIds.length && filteredUnitConversionsByMachine.length) {
      machineToUnitConversionMap = machineIds.reduce(
        (accumulator, currentValue) => {
          // filter out the unit conversion data based on the currentValue
          const filteredUnitConversion = filteredUnitConversionsByMachine.find(
            (result) =>
              // here machineId.machineName (means. machineId field of unit conversion data and machineName field is of configMachine as its ref. to machineId)
              result.machineId &&
              result.machineId.machineName.toLowerCase() ===
                currentValue.toLowerCase()
          );

          if (
            filteredUnitConversion &&
            Object.keys(filteredUnitConversion).length
          ) {
            const {
              importDimension,
              importVolume,
              importWeight,
              exportDimension,
              exportVolume,
              exportWeight,
            } = filteredUnitConversion;

            accumulator[currentValue.toLowerCase()] = {
              importDimension,
              importVolume,
              importWeight,
              exportDimension,
              exportVolume,
              exportWeight,
            };
          }

          return accumulator;
        },
        {}
      );
    }

    user.machineLevelUnitConversion = machineToUnitConversionMap;
  }

  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async () => {
  const refreshTokenDoc = true;
  logger.debug(`findOne method executed successfully.`);
  if (!refreshTokenDoc) {
    logger.debug(`refreshToken  Not Found.`);
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const userId = await tokenService.verifyToken(refreshToken);
    const user = await userService.getUserById(userId);
    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `Access token generation failed, User not found for userId: ${userId}`
      );
    }

    const accessTokenExpires = tokenService.generateAccessTokenExpiration(
      user.preferences.authSession.accessTokenTTL
    );

    const accessToken = tokenService.generateToken(
      userId,
      accessTokenExpires,
      tokenTypes.ACCESS
    );
    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
    };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
};
