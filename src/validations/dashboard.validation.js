const Joi = require('joi');

const dashboardValidator = {
  body: Joi.object().keys({
    filters: Joi.object()
      .keys({
        date: Joi.date().required(),
        machineId: Joi.string().required(),
        averageCostSavingsDate: Joi.object()
          .keys({
            from: Joi.date().required(),
            to: Joi.date().required(),
          })
          .required(),
        conversionFactor: Joi.object()
          .keys({
            importDimension: Joi.string().optional(),
            exportDimension: Joi.string().optional(),
            importVolume: Joi.string().optional(),
            exportVolume: Joi.string().optional(),
            importWeight: Joi.string().optional(),
            exportWeight: Joi.string().optional(),
          })
          .optional(),
      })
      .required(),
  }),
};

module.exports = {
  dashboardValidator,
};

// conversionFactor = {
//   importDimension: 'millimeter',
//   exportDimensions: 'foot',
//   importVolume: 'cubic_centimeter',
//   exportVolumes: 'cubic_meter',
// };
