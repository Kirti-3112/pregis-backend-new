const Joi = require('joi');
const { password } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    displayName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().optional(),
    role: Joi.string().optional().valid('user', 'admin'),
    roles: Joi.string().required(),
    policies: Joi.array()
      .items(Joi.string().allow(''))
      .unique((a, b) => a === b),
    machineGroups: Joi.array()
      .items(Joi.string())
      .min(1)
      .required()
      .unique((a, b) => a === b),
    isActive: Joi.boolean().required().valid(true, false),
    userId: Joi.string().required(),
  }),
};
const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    password: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateUser = {
  body: Joi.object()
    .keys({
      displayName: Joi.string().optional(),
      email: Joi.string().optional().email(),
      password: Joi.string().optional().custom(password),
      roles: Joi.string().optional(),
      policies: Joi.array()
        .items(Joi.string().allow(''))
        .unique((a, b) => a === b),
      machineGroups: Joi.array()
        .items(Joi.string())
        .min(1)
        .optional()
        .unique((a, b) => a === b),
      isActive: Joi.boolean().valid(true, false),
      isDeleted: Joi.boolean().valid(true, false),
      userId: Joi.string().optional(),
      machineWishList: Joi.object()
        .keys({
          machineGroup: Joi.string().optional(),
          machineId: Joi.string().optional(),
        })
        .optional(),
      preferences: Joi.object()
        .keys({
          dateAndTime: Joi.object()
            .keys({
              dateFormat: Joi.string().optional(),
              timeFormat: Joi.string().optional(),
              timeZone: Joi.string().optional(),
            })
            .optional(),
          authSession: Joi.object()
            .keys({
              accessTokenTTL: Joi.number().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .min(1),
};

const getUserById = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  getUserById,
};
