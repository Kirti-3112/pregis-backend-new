const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { configWorkGroupValidation } = require('../../validations');
const { configWorkGroupController } = require('../../controllers');

const router = express.Router();

router
  .route('/get-work-group')
  .post(
    auth('Configuration-Workgroup'),
    validate(configWorkGroupValidation.getWorkGroups),
    configWorkGroupController.getWorkGroups
  );

router
  .route('/')
  .post(
    auth('Configuration-Workgroup'),
    validate(configWorkGroupValidation.createWorkGroup),
    configWorkGroupController.createWorkGroup
  );

router
  .route('/:workGroupId')
  .put(
    auth('Configuration-Workgroup'),
    validate(configWorkGroupValidation.updateWorkGroup),
    configWorkGroupController.updateWorkGroup
  );

router
  .route('/:workGroupId')
  .delete(
    auth('Configuration-Workgroup'),
    validate(configWorkGroupValidation.workGroupById),
    configWorkGroupController.deleteWorkGroup
  );

module.exports = router;
