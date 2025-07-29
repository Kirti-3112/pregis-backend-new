const Joi = require('joi');

const getMachineGroups = {
  body: Joi.object().keys({
    pagination: Joi.object().keys({
      page: Joi.number().required(),
      limit: Joi.number().required(),
    }),
    filters: Joi.object().keys({
      status: Joi.string().optional().valid('Active', 'Inactive'),
    }),
  }),
};

const commanMachineGroupValidation = {
  name: Joi.string().required(),
  description: Joi.string().optional().allow(''),
  machines: Joi.array()
    .min(1)
    .items(Joi.string())
    .required()
    .unique((a, b) => a === b),
  userId: Joi.string().required(),
  status: Joi.string().required().valid('Active', 'Inactive'),
};

const createMachineGroup = {
  body: Joi.object().keys(commanMachineGroupValidation),
};

const updateMachineGroup = {
  params: Joi.object().keys({
    machineGroupId: Joi.string().required(),
  }),
  body: Joi.object().keys(commanMachineGroupValidation),
};

const machineGroupById = {
  params: Joi.object().keys({
    machineGroupId: Joi.string().required(),
  }),
};

module.exports = {
  getMachineGroups,
  machineGroupById,
  createMachineGroup,
  updateMachineGroup,
};
