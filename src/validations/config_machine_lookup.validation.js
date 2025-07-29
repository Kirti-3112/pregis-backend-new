const Joi = require('joi');

const commanMachineLookupValidation = {
  machineName: Joi.string().required(),
  description: Joi.string().optional().allow(''),
  maxThroughPut: Joi.string().required(),
  status: Joi.string().required().valid('Active', 'Inactive'),
  machineType: Joi.string().required(),
  userId: Joi.string().required(),
  currency: Joi.object({
    name: Joi.string().required(),
    symbol: Joi.string().required(),
  }),
  dimWeightFactor: Joi.number().required(),
  costMultiplier: Joi.number().required(),
};

const createConfigMachineLookup = {
  body: Joi.object().keys({
    machineId: Joi.string().required(),
    ...commanMachineLookupValidation,
  }),
};

const updateConfigMachineLookup = {
  body: Joi.object().keys(commanMachineLookupValidation).min(1),
};

const getConfigMachineLookup = {
  params: Joi.object().keys({
    machineId: Joi.string().required(),
  }),
};

const getAllConfigMachineLookup = {
  body: Joi.object().keys({
    pagination: Joi.object().keys({
      page: Joi.number().required(),
      limit: Joi.number().required(),
    }),
  }),
};

module.exports = {
  getConfigMachineLookup,
  createConfigMachineLookup,
  updateConfigMachineLookup,
  getAllConfigMachineLookup,
};
