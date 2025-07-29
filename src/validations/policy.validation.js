const Joi = require('joi');

const createPolicy = {
  body: Joi.object().keys({
    policyName: Joi.string().required(),
    description: Joi.string().optional().allow(''),
    isActive: Joi.boolean().required().valid(true, false),
    userId: Joi.string().required(),
  }),
};

const getPolicies = {
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

const getPolicyById = {
  params: Joi.object().keys({
    policyId: Joi.string().required(),
  }),
};
const updatePolicy = {
  body: Joi.object()
    .keys({
      description: Joi.string().optional().allow(''),
      isActive: Joi.boolean().required().valid(true, false),
      userId: Joi.string().required(),
    })
    .min(1),
};

const deletePolicy = {
  params: Joi.object().keys({
    policyId: Joi.string().required(),
  }),
};

module.exports = {
  getPolicyById,
  getPolicies,
  createPolicy,
  updatePolicy,
  deletePolicy,
};
