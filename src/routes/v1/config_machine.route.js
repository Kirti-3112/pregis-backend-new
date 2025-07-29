const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const configMachineValidation = require('../../validations/config_machine.validation');
const configMachineController = require('../../controllers/config_machine.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('Configuration-Machine'),
    validate(configMachineValidation.createConfigMachine),
    configMachineController.createConfigMachine
  );

router
  .route('/get-machine')
  .post(
    auth('Configuration-Machine'),
    validate(configMachineValidation.getConfigMachine),
    configMachineController.getConfigMachine
  );

router
  .route('/:configMachineId')
  .get(
    auth('Configuration-Machine'),
    validate(configMachineValidation.getConfigMachineById),
    configMachineController.getConfigMachineById
  );

router
  .route('/:configMachineId')
  .put(
    auth('Configuration-Machine'),
    validate(configMachineValidation.updateConfigMachine),
    configMachineController.updateConfigMachine
  );

router
  .route('/:configMachineId')
  .delete(
    auth('Configuration-Machine'),
    validate(configMachineValidation.getConfigMachine),
    configMachineController.deleteConfigMachine
  );

router
  .route('/get-machines/filters')
  .post(
    auth('Configuration-Machine'),
    validate(configMachineValidation.getConfigMachineByFilter),
    configMachineController.getConfigMachineByFilter
  );

module.exports = router;
