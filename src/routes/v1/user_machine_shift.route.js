const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userMachineShiftValidation = require('../../validations/user_machine_shift.validation');
const userMachineShiftController = require('../../controllers/user_machine_shift.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('Welcome Page'),
    validate(userMachineShiftValidation.createUserMachineShift),
    userMachineShiftController.createUserMachineShift
  );

router
  .route('/:userId')
  .put(
    auth('Welcome Page'),
    validate(userMachineShiftValidation.updateUserMachineShift),
    userMachineShiftController.updateUserMachineShift
  );

router
  .route('/start')
  .post(
    auth('Welcome Page'),
    validate(userMachineShiftValidation.startShift),
    userMachineShiftController.startUserShift
  );

router
  .route('/end')
  .post(
    validate(userMachineShiftValidation.endShift),
    userMachineShiftController.endUserShift
  );

router
  .route('/get-shifts')
  .post(
    auth('Welcome Page'),
    validate(userMachineShiftValidation.getShifts),
    userMachineShiftController.getShifts
  );

router
  .route('/get-shifts/:id')
  .post(
    auth('Welcome Page'),
    validate(userMachineShiftValidation.getShiftById),
    userMachineShiftController.getShiftById
  );

router
  .route('/get-ongoing-shift')
  .post(
    auth('Welcome Page'),
    validate(userMachineShiftValidation.getOngoingShift),
    userMachineShiftController.getOngoingShift
  );

router
  .route('/add-machine-to-wishlist')
  .post(
    auth('Welcome Page'),
    validate(userMachineShiftValidation.addMachineToWishList),
    userMachineShiftController.addMachineToWishlist
  );

module.exports = router;
