const Joi = require('joi');

const cloudAzurePushValidator = {
  body: Joi.object().keys({
    pagination: Joi.object().keys({
      pageSize: Joi.number().required(),
      pageLimit: Joi.number().required(),
    }),
    filters: Joi.object().keys({
      ProductionStatus: Joi.string()
        .required()
        .valid('Completed', 'InProgress', 'All'),
      Barcode: Joi.string().optional(),
    }),
    extension: Joi.string().required().valid('json', 'xlsx'),
    fileName: Joi.string().optional(),
  }),
};

module.exports = {
  cloudAzurePushValidator,
};
