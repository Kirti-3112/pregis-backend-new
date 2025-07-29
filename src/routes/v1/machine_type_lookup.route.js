const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const machineTypeLokkupValidation = require('../../validations/machine_type_lookup.validation');
const { machineTypeLookupController } = require('../../controllers');

const router = express.Router();

router
  .route('/get-machine-type')
  .post(
    auth('Configuration-Machine Type'),
    validate(machineTypeLokkupValidation.getMachineTypeAll),
    machineTypeLookupController.getAllMachineTypes
  );

router
  .route('/machine-types')
  .post(
    auth('Configuration-Machine Type'),
    machineTypeLookupController.getAllMachineTypesByFilters
  );

router
  .route('/:machineTypeId')
  .get(
    auth('Configuration-Machine Type'),
    validate(machineTypeLokkupValidation.getMachineType),
    machineTypeLookupController.getMachineTypesById
  );

router
  .route('/')
  .post(
    auth('Configuration-Machine Type'),
    validate(machineTypeLokkupValidation.createMachineType),
    machineTypeLookupController.createMachineType
  );

router
  .route('/:machineTypeId')
  .put(
    auth('Configuration-Machine Type'),
    validate(machineTypeLokkupValidation.updateMachineType),
    machineTypeLookupController.updateMachineType
  );

router
  .route('/:machineTypeId')
  .delete(
    auth('Configuration-Machine Type'),
    validate(machineTypeLokkupValidation.getMachineType),
    machineTypeLookupController.deleteMachineType
  );

module.exports = router;
