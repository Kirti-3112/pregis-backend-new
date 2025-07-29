const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { accessConfigurationConstantsController } = require('../../controllers');
const { accessConfigurationConstantValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(
    auth('Public'),
    validate(
      accessConfigurationConstantValidation.getAccessConfigurationConstantValidator
    ),
    accessConfigurationConstantsController.getAccessConfigurationConstants
  );

module.exports = router;
