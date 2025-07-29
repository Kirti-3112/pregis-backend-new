const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { configMachineGroupValidation } = require('../../validations');
const { configMachineGroupController } = require('../../controllers');

const router = express.Router();

router
  .route('/get-machine-group')
  .post(
    auth('Configuration-Machine Group'),
    validate(configMachineGroupValidation.getMachineGroups),
    configMachineGroupController.getMachineGroups
  );

// router
//   .route('/:machineGroupId')
//   .get(
//     auth('Configuration-Machine Group'),
//     validate(configMachineGroupValidation.getConfigMachineLookup),
//     configMachineGroupController.getConfigMachineLookupById
//   );

router
  .route('/')
  .post(
    auth('Configuration-Machine Group'),
    validate(configMachineGroupValidation.createMachineGroup),
    configMachineGroupController.createMachineGroup
  );

router
  .route('/:machineGroupId')
  .put(
    auth('Configuration-Machine Group'),
    validate(configMachineGroupValidation.updateMachineGroup),
    configMachineGroupController.updateMachineGroup
  );

router
  .route('/:machineGroupId')
  .delete(
    auth('Configuration-Machine Group'),
    validate(configMachineGroupValidation.machineGroupById),
    configMachineGroupController.deleteMachineGroup
  );

module.exports = router;
