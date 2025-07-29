const httpStatus = require('http-status');
const logger = require('../config/logger');
const catchAsync = require('../utils/catchAsync');
const { accessConfigurationConstantsService } = require('../services');
const { ACCESS_CONFIG } = require('../config/constants');

const getAccessConfigurationConstants = catchAsync(async (req, res) => {
  try {
    const accessConfigurationConstantsData =
      await accessConfigurationConstantsService.getAccessConfigurationConstantsByCategory(
        req.body
      );

    const accessConfigurationConstants = accessConfigurationConstantsData.map(
      (accessConfig) => accessConfig.name
    );

    logger.info(
      `${ACCESS_CONFIG.ACCESS_CONFIG_SUCCESS(
        'getAccessConfigurationConstantsByCategory'
      )}. Quantity - ${accessConfigurationConstants.length}`
    );
    res.status(httpStatus.OK).send({ accessConfigurationConstants });
  } catch (error) {
    logger.error(
      `${ACCESS_CONFIG.ACCESS_CONFIG_INTERNAL_SERVER_ERROR_MESSAGE} - ${error}`
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message: ACCESS_CONFIG.ACCESS_CONFIG_INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
});

module.exports = {
  getAccessConfigurationConstants,
};
