const Joi = require('joi');

const createRole = {
  body: Joi.object().keys({
    roleName: Joi.string().required(),
    description: Joi.string().optional().allow(''),
    policies: Joi.array()
      .min(1)
      .items(Joi.string())
      .required()
      .unique((a, b) => a === b),
    isActive: Joi.boolean().required().valid(true, false),
    userId: Joi.string().required(),
  }),
};

const getRoles = {
  body: Joi.object().keys({
    pagination: Joi.object().keys({
      page: Joi.number().required(),
      limit: Joi.number().required(),
    }),
    filters: Joi.object().keys({
      isActive: Joi.boolean().optional().valid(true, false),
    }),
  }),
};

const getRoleById = {
  params: Joi.object().keys({
    roleId: Joi.string().required(),
  }),
};
const updateRole = {
  body: Joi.object()
    .keys({
      policies: Joi.array()
        .min(1)
        .items(Joi.string())
        .required()
        .unique((a, b) => a === b),
      description: Joi.string().optional().allow(''),
      isActive: Joi.boolean().required().valid(true, false),
      userId: Joi.string().required(),
    })
    .min(1),
};

const deleteRole = {
  params: Joi.object().keys({
    roleId: Joi.string().required(),
  }),
};

module.exports = {
  getRoleById,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
};
