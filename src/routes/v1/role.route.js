const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { roleValidation } = require('../../validations');
const { roleController } = require('../../controllers');

const router = express.Router();

router
  .route('/get-role')
  .post(
    auth('User Management-Roles'),
    validate(roleValidation.getRoles),
    roleController.getRoles
  );

router
  .route('/:roleId')
  .get(
    auth('User Management-Roles'),
    validate(roleValidation.getRoleById),
    roleController.getRoleById
  );

router
  .route('/')
  .post(
    auth('User Management-Roles'),
    validate(roleValidation.createRole),
    roleController.createRole
  );

router
  .route('/:roleId')
  .put(
    auth('User Management-Roles'),
    validate(roleValidation.updateRole),
    roleController.updateRole
  );

router
  .route('/:roleId')
  .delete(
    auth('User Management-Roles'),
    validate(roleValidation.deleteRole),
    roleController.deleteRole
  );

module.exports = router;
