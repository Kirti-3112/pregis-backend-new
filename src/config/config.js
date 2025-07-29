const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(3001),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),

    MONGODB_URL: Joi.string().required().description('MONGO URL'),

    TCP_SERVER_ADDRESS_WMS: Joi.string()
      .required()
      .description('TCP SERVER ADDRESS'),
    SERVER_PORT_WMS: Joi.number().required().description('SERVER PORT'),
    TCP_SERVER_ADDRESS_MACHINE: Joi.string()
      .required()
      .description('TCP SERVER ADDRESS'),
    SERVER_PORT_MACHINE: Joi.number().required().description('SERVER PORT'),

    JOBS_PRODUCTION_STATUS_TODO: Joi.string()
      .required()
      .description('JOBS PRODUCTION STATUS TODO'),
    JOBS_PRODUCTION_STATUS_IN_PROGRESS: Joi.string()
      .required()
      .description('JOBS PRODUCTION STATUS IN_PROGRESS'),
    JOBS_PRODUCTION_STATUS_COMPLETED: Joi.string()
      .required()
      .description('JOBS PRODUCTION STATUS COMPLETED'),
    JOBS_PRODUCTION_STATUS_REMOVED: Joi.string()
      .required()
      .description('JOBS PRODUCTION STATUS REMOVED'),
    JOBS_PRODUCTION_STATUS_ERROR: Joi.string()
      .required()
      .description('JOBS PRODUCTION STATUS ERROR'),
    JOBS_PRODUCTION_STATUS_NOT_HANDLED: Joi.string()
      .required()
      .description('JOBS PRODUCTION STATUS NOT_HANDLED'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  tcpSocketConnection: {
    serverAddressWMS: envVars.TCP_SERVER_ADDRESS_WMS,
    serverPortWMS: envVars.SERVER_PORT_WMS,
    serverAddressMachine: envVars.TCP_SERVER_ADDRESS_MACHINE,
    serverPortMachine: envVars.SERVER_PORT_MACHINE,
  },

  jobsProductionStatus: {
    TODO: envVars.JOBS_PRODUCTION_STATUS_TODO,
    IN_PROGRESS: envVars.JOBS_PRODUCTION_STATUS_IN_PROGRESS,
    COMPLETED: envVars.JOBS_PRODUCTION_STATUS_COMPLETED,
    REMOVED: envVars.JOBS_PRODUCTION_STATUS_REMOVED,
    ERROR: envVars.JOBS_PRODUCTION_STATUS_ERROR,
    NOT_HANDLED: envVars.JOBS_PRODUCTION_STATUS_NOT_HANDLED,
  },
};
