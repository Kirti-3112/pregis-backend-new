const Joi = require('joi');

const getAllMessageLookup = {
  query: Joi.object({
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required(),
  }),
};

const createMessageLookup = {
  body: Joi.object({
    Expression: Joi.string().trim().allow('').optional(),
    Area: Joi.string().trim().required(),
    Message: Joi.string().trim().required(),
    AreaNumber: Joi.string().trim().allow('').optional(),
    MessageNumber: Joi.alternatives()
      .try(Joi.number(), Joi.string().valid(''))
      .optional(),
    MessageBitString: Joi.string().trim().required(),
  }),
};

const updateMessageLookup = {
  body: Joi.object({
    id: Joi.string().required(),
    Expression: Joi.string().trim().allow('').optional(),
    Area: Joi.string().trim().required(),
    Message: Joi.string().trim().required(),
    AreaNumber: Joi.string().trim().allow('').optional(),
    MessageNumber: Joi.alternatives()
      .try(Joi.number(), Joi.string().valid(''))
      .optional(),
    MessageBitString: Joi.string().trim().required(),
  }),
};

const deleteMessageLookup = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

module.exports = {
  getAllMessageLookup,
  createMessageLookup,
  updateMessageLookup,
  deleteMessageLookup,
};
