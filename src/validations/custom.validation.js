const Joi = require('joi');

const password = (value, helpers) => {
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      'Password must contain at least one letter and one number'
    );
  }
  if (value.length < 5) {
    return helpers.message('Password must be at least 5 characters');
  }
  return value;
};

const tableValidator = {
  body: Joi.object().keys({
    range: Joi.object().keys({
      from: Joi.number().optional(),
      to: Joi.number().optional(),
    }),
    pagination: Joi.object().keys({
      pageSize: Joi.number().required(),
      page: Joi.number().required(),
    }),
    filters: Joi.object().optional(),
    extension: Joi.string().required(),
    fileName: Joi.string().when('extension', {
      is: 'xlsx',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  }),
};

module.exports = {
  password,
  tableValidator,
};
