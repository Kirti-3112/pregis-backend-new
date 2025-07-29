const Joi = require('joi');

const jobsValidator = {
  body: Joi.object().keys({
    pagination: Joi.object().keys({
      pageSize: Joi.number().required(),
      pageLimit: Joi.number().required(),
    }),
    filters: Joi.object().keys({
      Barcode: Joi.string().optional(),
      ID: Joi.string().optional(),
      productionStatus: Joi.string().optional().allow(null),
      machineId: Joi.string().optional().allow(null),
    }),
    selectionFieldString: Joi.string().optional().allow(''),
  }),
};

const jobByIdValidator = {
  body: Joi.object().keys({
    filters: Joi.object().keys({
      Barcode: Joi.string().optional(),
      ID: Joi.string().optional(),
      productionStatus: Joi.string().optional().allow(null),
      machineId: Joi.string().optional().allow(null),
    }),
    conversionFactor: Joi.object()
      .keys({
        importDimension: Joi.string().optional(),
        exportDimension: Joi.string().optional(),
        importVolume: Joi.string().optional(),
        exportVolume: Joi.string().optional(),
        importWeight: Joi.string().optional(),
        exportWeight: Joi.string().optional(),
      })
      .required(),
  }),
};

module.exports = {
  jobsValidator,
  jobByIdValidator,
};
