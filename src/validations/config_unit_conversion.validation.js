const Joi = require('joi');

const createUnitConversion = {
  body: Joi.object().keys({
    machineId: Joi.string().required(),
    userId: Joi.string().required(),
    importDimension: Joi.string().required(),
    importVolume: Joi.string().required(),
    importWeight: Joi.string().required(),
    exportDimension: Joi.string().required(),
    exportVolume: Joi.string().required(),
    exportWeight: Joi.string().required(),
    status: Joi.string().required().valid('Active', 'Inactive'),
  }),
};

const updateUnitConversion = {
  body: Joi.object().keys({
    machineId: Joi.string().optional(),
    userId: Joi.string().required(),
    importDimension: Joi.string().optional(),
    importVolume: Joi.string().optional(),
    importWeight: Joi.string().optional(),
    exportDimension: Joi.string().optional(),
    exportVolume: Joi.string().optional(),
    exportWeight: Joi.string().optional(),
    status: Joi.string().optional(),
  }),
  params: Joi.object().keys({
    unitConversionId: Joi.string().required(),
  }),
};

const deleteUnitConversion = {
  params: Joi.object().keys({
    unitConversionId: Joi.string().required(),
  }),
};

const getUnitConversions = {
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

const getUnitConversionOptions = {
  body: Joi.object().keys({
    measurementCategory: Joi.array()
      .items(Joi.string().valid('volume', 'dimension', 'weight'))
      .required(),
  }),
};

const getUnitConversionByFilter = {
  body: Joi.object().keys({
    dbMathodName: Joi.string().required(),
    filter: Joi.alternatives().try(Joi.string(), Joi.object()).required(),
  }),
};

module.exports = {
  createUnitConversion,
  getUnitConversionByFilter,
  getUnitConversions,
  deleteUnitConversion,
  updateUnitConversion,
  getUnitConversionOptions,
};
