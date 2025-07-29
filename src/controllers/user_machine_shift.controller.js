const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userMachineShiftService } = require('../services');
const logger = require('../config/logger');
const { USER_MACHINE_SHIFT } = require('../config/constants');

const createUserMachineShift = catchAsync(async (req, res) => {
  try {
    await userMachineShiftService.createUserMachineShift(req);

    logger.info(USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_CREATE);
    res.status(httpStatus.CREATED).send({
      status: 201,
      message: USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_CREATE,
    });
  } catch (error) {
    logger.error(USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR);
    res.status(500).send({
      status: 'error',
      message: USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR,
    });
  }
});

const updateUserMachineShift = catchAsync(async (req, res) => {
  try {
    await userMachineShiftService.updateUserMachineShift(req.params.userId);

    logger.info(USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_UPDATE);
    res.status(httpStatus.CREATED).send({
      status: 201,
      message: USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_UPDATE,
    });
  } catch (error) {
    logger.error(USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR);
    res.status(500).send({
      status: 'error',
      message: USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR,
    });
  }
});

const startUserShift = catchAsync(async (req, res) => {
  try {
    await userMachineShiftService.startShift(req);
    res.status(httpStatus.CREATED).send({
      status: 201,
      message: USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_STARTED,
    });
  } catch (error) {
    logger.error(
      `${USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR}: ${error}`
    );
    res.status(500).send({
      status: 'error',
      message: `${USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR}: ${error}`,
    });
  }
});

const endUserShift = catchAsync(async (req, res) => {
  try {
    await userMachineShiftService.endShift(req);
    res.status(httpStatus.CREATED).send({
      status: 201,
      message: USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_ENDED,
    });
  } catch (error) {
    logger.error(
      `${USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR}: ${error}`
    );
    res.status(500).send({
      status: 'error',
      message: `${USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR}: ${error}`,
    });
  }
});

const addMachineToWishlist = catchAsync(async (req, res) => {
  try {
    await userMachineShiftService.addMachineToWishList(req);
    res.status(httpStatus.OK).send({ status: 'done' });
  } catch (error) {
    logger.error(USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR);
    res.status(500).send({
      status: 'error',
      message: USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR,
    });
  }
});

const getShifts = catchAsync(async (req, res) => {
  try {
    const shifts = await userMachineShiftService.getShifts(req);
    logger.info(
      `${USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_SUCCESS(
        'getShifts'
      )}. Quantity - ${
        shifts && shifts.shiftsData ? shifts.shiftsData.length : 0
      }`
    );
    res.status(httpStatus.OK).send(shifts);
  } catch (error) {
    logger.error(USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR);
    res.status(500).send({
      status: 'error',
      message: USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR,
    });
  }
});

const getShiftById = catchAsync(async (req, res) => {
  try {
    const shiftDetails = await userMachineShiftService.getShiftById(req);
    logger.info(
      `${USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_SUCCESS('getShiftById')}. Id - ${
        shiftDetails._id
      }`
    );
    res.status(httpStatus.OK).send(shiftDetails);
  } catch (error) {
    logger.error(USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR);
    res.status(500).send({
      status: 'error',
      message: USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR,
    });
  }
});

const getOngoingShift = catchAsync(async (req, res) => {
  try {
    const filterOptions = req.body;
    const { userId } = filterOptions;
    const shiftDetails =
      await userMachineShiftService.getUserMachineGroupCurrentDayShift({
        userId,
        shiftActivity: { $elemMatch: { clockOut: { $exists: false } } },
      });
    const ongoingShiftStatus = {
      isShiftOngoing: shiftDetails && shiftDetails.shiftActivity.length > 0,
    };
    logger.info(
      `${USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_SUCCESS('getOngoingShift')}`
    );
    res.status(httpStatus.OK).send(ongoingShiftStatus);
  } catch (error) {
    logger.error(USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR);
    res.status(500).send({
      status: 'error',
      message: USER_MACHINE_SHIFT.USER_MACHINE_SHIFT_INTERNAL_SERVER_ERROR,
    });
  }
});
module.exports = {
  createUserMachineShift,
  updateUserMachineShift,
  startUserShift,
  endUserShift,
  getShifts,
  getShiftById,
  getOngoingShift,
  addMachineToWishlist,
};
