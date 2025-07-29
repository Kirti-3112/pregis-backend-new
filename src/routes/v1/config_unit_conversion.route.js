const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { unitConversionController } = require('../../controllers');
const { configUnitConversionValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(
    auth('Configuration-Unit Conversion'),
    validate(configUnitConversionValidation.createUnitConversion),
    unitConversionController.createUnitConversion
  );
router
  .route('/get-unit-conversions')
  .post(
    auth('Configuration-Unit Conversion'),
    validate(configUnitConversionValidation.getUnitConversions),
    unitConversionController.getUnitConversions
  );

router
  .route('/get-unit-conversion-options')
  .post(
    auth('Configuration-Unit Conversion'),
    validate(configUnitConversionValidation.getUnitConversionOptions),
    unitConversionController.getUnitConversionOptions
  );

router
  .route('/filter')
  .post(
    auth('Configuration-Unit Conversion'),
    validate(configUnitConversionValidation.getUnitConversionByFilter),
    unitConversionController.getUnitConversionByFilter
  );

router
  .route('/:unitConversionId')
  .delete(
    auth('Configuration-Unit Conversion'),
    validate(configUnitConversionValidation.deleteUnitConversion),
    unitConversionController.deleteUnitConversion
  );
router
  .route('/:unitConversionId')
  .patch(
    auth('Configuration-Unit Conversion'),
    validate(configUnitConversionValidation.updateUnitConversion),
    unitConversionController.updateUnitConversion
  );

module.exports = router;
