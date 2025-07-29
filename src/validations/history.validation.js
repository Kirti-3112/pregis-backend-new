const Joi = require('joi');

const getHistory = {
  eventCount: Joi.object().keys({
    eventType: Joi.string().required(),
    machineArea: Joi.string().required(),
    machineStatus: Joi.string().required(),
    message: Joi.string().required(),
    date: Joi.string().isoDate().required(),
    time: Joi.string().required(),
  }),
  body: Joi.object().keys({
    machineId: Joi.string().required(),
    from: Joi.string().optional(),
    to: Joi.string().optional(),
    timeRange: Joi.string().optional(),
    extension: Joi.string().optional(),
    productionStatus: Joi.string().optional(),
    area: Joi.string().optional(),
    responseType: Joi.string().optional(),
    pagination: Joi.object().keys({
      page: Joi.number().required(),
      pageLimit: Joi.number().required(),
    }),
    filters: Joi.object().keys({
      machineId: Joi.string().optional().allow(null),
      'Event Count': Joi.string().optional(),
      'Event Area': Joi.string().optional(),
    }),
  }),
};
const getJobByHour = {
  body: Joi.object().keys({
    from: Joi.string().optional(),
    to: Joi.string().optional(),
    timeRange: Joi.string().optional(),
    extension: Joi.string().optional(),
    productionStatus: Joi.string().optional(),
    machineId: Joi.string().required(),
    reponseType: Joi.string().optional(),
  }),
};
const getDistinctAreas = {};

module.exports = {
  getHistory,
  getJobByHour,
  getDistinctAreas,
};
