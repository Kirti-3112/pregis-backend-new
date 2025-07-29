const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { policyService } = require('../services');
const logger = require('../config/logger');
const { POLICY } = require('../config/constants');

const createPolicy = catchAsync(async (req, res) => {
  try {
    await policyService.createPolicy(req.body);
    logger.info(
      `${POLICY.POLICY_SUCCESS('createPolicy', req.body.policyName)}`
    );
    res.status(httpStatus.CREATED).send({ message: POLICY.POLICY_CREATE });
  } catch (error) {
    if (
      error.statusCode === httpStatus.CONFLICT ||
      error.message.includes('E11000')
    ) {
      logger.error(`${POLICY.POLICY_ALREADY_EXISTS(req.body.policyName)}`);
      return res.status(httpStatus.CONFLICT).send({
        status: 'error',
        message: POLICY.POLICY_ALREADY_EXISTS_MESSAGE,
      });
    }
    logger.error(`${POLICY.POLICY_INTERNAL_SERVER_ERROR}`, error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message: POLICY.POLICY_INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
});

const getPolicies = catchAsync(async (req, res) => {
  try {
    const policies = await policyService.getPolicies(req.body);
    logger.info(
      `${POLICY.POLICY_SUCCESS('getPolicies')}. Quantity - ${
        policies && policies.policiesData ? policies.policiesData.length : 0
      }`
    );

    res.status(httpStatus.OK).send(policies);
  } catch (error) {
    logger.error(`${POLICY.POLICY_INTERNAL_SERVER_ERROR}`, error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message: POLICY.POLICY_INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
});

const getPolicyById = catchAsync(async (req, res) => {
  try {
    const policyData = await policyService.getPolicyById(req.params.policyId);
    logger.info(
      `${POLICY.POLICY_SUCCESS('getPolicyById')}. PolicyData : ${policyData}`
    );
    if (!policyData) {
      return res.status(httpStatus.NOT_FOUND).send({
        message: POLICY.POLICY_NOT_FOUND_MESSAGE(req.params.policyId),
      });
    }
    res.status(httpStatus.OK).send({ policyData });
  } catch (error) {
    logger.error(`${POLICY.POLICY_INTERNAL_SERVER_ERROR}`, error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: 'error',
      message: POLICY.POLICY_INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
});

function commonErrorHandler(req, res, error, methodName) {
  if (error.statusCode === httpStatus.FORBIDDEN) {
    if (methodName === 'Delete') {
      logger.error(`${POLICY.POLICY_DELETE_FORBIDDEN}`, error);
      return res.status(httpStatus.FORBIDDEN).send({
        status: 'error',
        message: POLICY.POLICY_DELETE_FORBIDDEN,
      });
    }
    if (methodName === 'Update') {
      logger.error(`${POLICY.POLICY_UPDATE_FORBIDDEN}`, error);
      return res.status(httpStatus.FORBIDDEN).send({
        status: 'error',
        message: POLICY.POLICY_UPDATE_FORBIDDEN,
      });
    }
  }
  if (error.statusCode === httpStatus.NOT_FOUND) {
    logger.error(`${POLICY.POLICY_NOT_FOUND(req.params.policyId)}`);
    return res.status(httpStatus.NOT_FOUND).send({
      status: 'error',
      message: POLICY.POLICY_NOT_FOUND_MESSAGE(req.params.policyId),
    });
  }
  logger.error(`${POLICY.POLICY_INTERNAL_SERVER_ERROR}`, error);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    status: 'error',
    message: POLICY.POLICY_INTERNAL_SERVER_ERROR_MESSAGE,
  });
}

const updatePolicy = catchAsync(async (req, res) => {
  try {
    await policyService.updatePolicyById(req.params.policyId, req.body);
    logger.info(
      `${POLICY.POLICY_SUCCESS('updatePolicyById', req.params.policyId)}`
    );
    res
      .status(httpStatus.CREATED)
      .send({ message: POLICY.POLICY_UPDATE(req.params.policyId) });
  } catch (error) {
    commonErrorHandler(req, res, error, 'Update');
  }
});

const deletePolicy = catchAsync(async (req, res) => {
  try {
    await policyService.deletePolicyById(req.params.policyId);
    logger.info(
      `${POLICY.POLICY_SUCCESS('deletePolicyById', req.params.policyId)}`
    );
    res
      .status(httpStatus.OK)
      .send({ message: POLICY.POLICY_DELETE(req.params.policyId) });
  } catch (error) {
    commonErrorHandler(req, res, error, 'Delete');
  }
});

module.exports = {
  createPolicy,
  getPolicies,
  getPolicyById,
  updatePolicy,
  deletePolicy,
  commonErrorHandler,
};
