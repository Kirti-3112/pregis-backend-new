const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { policyValidation } = require('../../validations');
const { policyController } = require('../../controllers');

const router = express.Router();

router
  .route('/get-policy')
  .post(
    auth('User Management-Policies'),
    validate(policyValidation.getPolicies),
    policyController.getPolicies
  );

router
  .route('/:policyId')
  .get(
    auth('User Management-Policies'),
    validate(policyValidation.getPolicyById),
    policyController.getPolicyById
  );

router
  .route('/')
  .post(
    auth('User Management-Policies'),
    validate(policyValidation.createPolicy),
    policyController.createPolicy
  );

router
  .route('/:policyId')
  .put(
    auth('User Management-Policies'),
    validate(policyValidation.updatePolicy),
    policyController.updatePolicy
  );

router
  .route('/:policyId')
  .delete(
    auth('User Management-Policies'),
    validate(policyValidation.deletePolicy),
    policyController.deletePolicy
  );

module.exports = router;
