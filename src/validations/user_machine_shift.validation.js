const Joi = require('joi');

const createUserMachineShift = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    machineGroup: Joi.string().required(),
    machineId: Joi.string().required(),
    addMachineToWishlist: Joi.boolean().required(),
  }),
};
const updateUserMachineShift = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const startShift = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    currentMachineGroupId: Joi.string().required(),
    clockIn: Joi.string().required(),
    machineId: Joi.string().optional(),
  }),
};

const endShift = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    clockOut: Joi.string().required(),
  }),
};

const addMachineToWishList = {
  body: Joi.object().keys({
    machineGroup: Joi.string().optional(),
    machineId: Joi.string().optional(),
    addMachineToWishlist: Joi.boolean().required(),
    userId: Joi.string().required(),
  }),
};

const getShifts = {
  body: Joi.object().keys({
    pagination: Joi.object().keys({
      page: Joi.number().required(),
      limit: Joi.number().required(),
    }),
    filters: Joi.object().keys({
      status: Joi.string().optional(),
    }),
    userId: Joi.string().required(),
  }),
};

const getShiftById = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: {
    userId: Joi.string().required(),
  },
};

const getOngoingShift = {
  body: {
    userId: Joi.string().required(),
  },
};

module.exports = {
  createUserMachineShift,
  updateUserMachineShift,
  startShift,
  endShift,
  addMachineToWishList,
  getShifts,
  getShiftById,
  getOngoingShift,
};
