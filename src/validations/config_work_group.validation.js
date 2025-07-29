const Joi = require('joi');

const getWorkGroups = {
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

const commanWorkGroupValidation = {
  name: Joi.string().required(),
  description: Joi.string().optional().allow(''),
  machineGroups: Joi.array()
    .min(1)
    .items(Joi.string())
    .required()
    .unique((a, b) => a === b),
  userId: Joi.string().required(),
  status: Joi.string().required().valid('Active', 'Inactive'),
};

const createWorkGroup = {
  body: Joi.object().keys(commanWorkGroupValidation),
};

const updateWorkGroup = {
  params: Joi.object().keys({
    workGroupId: Joi.string().required(),
  }),
  body: Joi.object().keys(commanWorkGroupValidation),
};

const workGroupById = {
  params: Joi.object().keys({
    workGroupId: Joi.string().required(),
  }),
};

module.exports = {
  getWorkGroups,
  workGroupById,
  createWorkGroup,
  updateWorkGroup,
};
