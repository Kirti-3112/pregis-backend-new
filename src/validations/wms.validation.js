const Joi = require('joi');

const commanWmsValidation = {
  wmsName: Joi.string().required(),
  communicationType: Joi.string().required().valid('MQTT', 'webService'),
  hostName: Joi.string().when('communicationType', {
    is: 'MQTT',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  portNumber: Joi.number().when('communicationType', {
    is: 'MQTT',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  userName: Joi.string().allow('').optional(),
  password: Joi.string().allow('').optional(),
  jobImport: Joi.string().when('communicationType', {
    is: 'MQTT',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  jobExport: Joi.string().when('communicationType', {
    is: 'MQTT',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  feature: Joi.string().required().valid('Enable', 'Disable'),
  url: Joi.string().when('communicationType', {
    is: 'webService',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  userId: Joi.string().required(),
  webserviceType: Joi.string()
    .when('communicationType', {
      is: 'webService',
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .valid('Soap', 'Restful'),
  communicationVia: Joi.string().when('communicationType', {
    is: 'webService',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  machineType: Joi.string().when('communicationType', {
    is: 'MQTT',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
};

const createWMS = {
  body: Joi.object().keys(commanWmsValidation),
};

const getWMSAll = {
  body: Joi.object().keys({
    pagination: Joi.object().keys({
      page: Joi.number().required(),
      limit: Joi.number().required(),
    }),
    filters: Joi.object().keys({
      communicationType: Joi.string().required().valid('MQTT', 'webService'),
    }),
  }),
};

const getWMS = {
  params: Joi.object().keys({
    wmsId: Joi.string().required(),
  }),
};
const updateWMS = {
  body: Joi.object().keys(commanWmsValidation).min(1),
};

module.exports = {
  getWMS,
  getWMSAll,
  createWMS,
  updateWMS,
};
