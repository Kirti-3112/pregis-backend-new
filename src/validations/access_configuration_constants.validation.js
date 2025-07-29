const Joi = require('joi');

const getAccessConfigurationConstantValidator = {
  body: Joi.object().keys({
    category: Joi.string().required(),
  }),
};

module.exports = {
  getAccessConfigurationConstantValidator,
};
