const Joi = require('joi');

const testConnection = {
  query: Joi.object().keys({
    type: Joi.string().required(),
    id: Joi.string().required(),
  }),
};

module.exports = {
  testConnection,
};
