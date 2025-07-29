const Joi = require('joi');

const configMachineValidation = {
  machineName: Joi.string().required(),
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
  userName: Joi.string().optional().allow(''),
  password: Joi.string().optional().allow(''),
  jobImportTopic: Joi.string().when('communicationType', {
    is: 'MQTT',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  machineImportTopic: Joi.string().when('communicationType', {
    is: 'MQTT',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  jobExportTopic: Joi.string().when('communicationType', {
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
  //   importDimension: Joi.string()
  //     .valid('centimeter', 'millimeter', 'inch', 'foot')
  //     .when('communicationType', {
  //       is: 'MQTT',
  //       then: Joi.required(),
  //       otherwise: Joi.optional(),
  //     }),
  //   importVolume: Joi.string()
  //     .valid('cubic_centimeter', 'cubic_inch', 'cubic_foot', 'cubic_meter')
  //     .when('communicationType', {
  //       is: 'MQTT',
  //       then: Joi.required(),
  //       otherwise: Joi.optional(),
  //     }),
  //   importWeight: Joi.string()
  //     .valid('pound', 'gram', 'kilogram')
  //     .when('communicationType', {
  //       is: 'MQTT',
  //       then: Joi.required(),
  //       otherwise: Joi.optional(),
  //     }),
  //   exportDimensions: Joi.array()
  //     .items(Joi.string().valid('centimeter', 'millimeter', 'inch', 'foot'))
  //     .min(1)
  //     .when('communicationType', {
  //       is: 'MQTT',
  //       then: Joi.required(),
  //       otherwise: Joi.optional(),
  //     }),
  //   exportVolumes: Joi.array()
  //     .items(
  //       Joi.string().valid(
  //         'cubic_centimeter',
  //         'cubic_inch',
  //         'cubic_feet',
  //         'cubic_meter'
  //       )
  //     )
  //     .min(1)
  //     .when('communicationType', {
  //       is: 'MQTT',
  //       then: Joi.required(),
  //       otherwise: Joi.optional(),
  //     }),
  //   exportWeights: Joi.array()
  //     .items(Joi.string().valid('pound', 'gram', 'kilogram'))
  //     .min(1)
  //     .when('communicationType', {
  //       is: 'MQTT',
  //       then: Joi.required(),
  //       otherwise: Joi.optional(),
  //     }),
};

const createConfigMachine = {
  body: Joi.object().keys(configMachineValidation),
};

const getConfigMachineById = {
  params: Joi.object().keys({
    configMachineId: Joi.string().required(),
  }),
};

const getConfigMachine = {
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

const updateConfigMachine = {
  body: Joi.object().keys(configMachineValidation).min(1),
  params: Joi.object().keys({
    configMachineId: Joi.string().required(),
  }),
};

const deleteConfigMachine = {
  params: Joi.object().keys({
    configMachineId: Joi.string().required(),
  }),
};

const getConfigMachineByFilter = {
  body: Joi.object().keys({
    filters: Joi.object(),
    selectFields: Joi.array(),
  }),
};

module.exports = {
  getConfigMachineById,
  getConfigMachine,
  createConfigMachine,
  updateConfigMachine,
  deleteConfigMachine,
  getConfigMachineByFilter,
};
