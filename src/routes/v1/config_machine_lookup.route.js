const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { configMachineLookupValidation } = require('../../validations');
const { configMachineLookupController } = require('../../controllers');

const router = express.Router();

router
  .route('/get-machine')
  .post(
    auth('Configuration-Machine Lookup'),
    validate(configMachineLookupValidation.getAllConfigMachineLookup),
    configMachineLookupController.getAllConfigMachineLookup
  );

router.route('/:machineId').get(
  // auth('Configuration-Machine Lookup'),
  validate(configMachineLookupValidation.getConfigMachineLookup),
  configMachineLookupController.getConfigMachineLookupById
);

router
  .route('/')
  .post(
    auth('Configuration-Machine Lookup'),
    validate(configMachineLookupValidation.createConfigMachineLookup),
    configMachineLookupController.createConfigMachineLookup
  );

router
  .route('/:machineId')
  .put(
    auth('Configuration-Machine Lookup'),
    validate(configMachineLookupValidation.updateConfigMachineLookup),
    configMachineLookupController.updateConfigMachineLookup
  );

router
  .route('/:machineId')
  .delete(
    auth('Configuration-Machine Lookup'),
    validate(configMachineLookupValidation.getConfigMachineLookup),
    configMachineLookupController.deleteConfigMachineLookup
  );

module.exports = router;
