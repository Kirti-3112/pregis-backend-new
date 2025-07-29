const Joi = require('joi');

const commanMachineTypesValidation = {
  description: Joi.string().allow(''),
  userId: Joi.string().required(),
  jobImportTopic: Joi.boolean(),
  jobExportTopic: Joi.boolean(),
  wmsImportTopic: Joi.boolean(),
  wmsExportTopic: Joi.boolean(),
  barcode: Joi.boolean(),
  heartBeat: Joi.boolean(),
  wmsTestConnection: Joi.boolean(),
  machineTestConnection: Joi.boolean(),
  isActive: Joi.boolean().required(),
};

const createMachineType = {
  body: Joi.object().keys({
    ...commanMachineTypesValidation,
    machineType: Joi.string().required(),
  }),
};
const getMachineType = {
  params: Joi.object().keys({
    machineTypeId: Joi.string().required(),
  }),
};

const getMachineTypeAll = {
  body: Joi.object().keys({
    pagination: Joi.object().keys({
      page: Joi.number().required(),
      limit: Joi.number().required(),
    }),
  }),
};

const updateMachineType = {
  body: Joi.object().keys(commanMachineTypesValidation).min(1),
};

module.exports = {
  getMachineType,
  createMachineType,
  updateMachineType,
  getMachineTypeAll,
};
