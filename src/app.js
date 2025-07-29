const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const hpp = require('hpp');
const nocache = require('nocache');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const logger = require('./config/logger');

const app = express();

logger.info(`application running env : ${config.env}`);
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Protect against HPP, should come before any routes
app.use(hpp());

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);

/**
 * This sets four headers
 * Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
 * Pragma: no-cache
 * Expires: 0
 * Surrogate-Control: no-store
 */
app.use(nocache());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// Use helmet middleware with CSP configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", `${process.env.SECURE_URL}`],
    },
  })
);

// Middleware for IP address white-listing
app.use((req, res, next) => {
  const allowedIPs = ['192.168.1.1', '10.0.0.1']; // Example IP addresses
  if (allowedIPs.includes(req.ip)) {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
});

// Middleware to set CORS headers
app.use((req, res, next) => {
  // Allow requests only from a specific domain
  res.header('Access-Control-Allow-Origin', `${process.env.SECURE_URL}`);
  // Additional CORS headers can be added as needed
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Set this header to 'true' if credentials (like cookies) are allowed
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Middleware to set security headers, including Content-Security-Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        frameAncestors: ["'self'"], // Adjust as needed
      },
    },
  })
);

// Middleware to set X-Frame-Options header
app.use((req, res, next) => {
  res.header('X-Frame-Options', 'DENY'); // or 'SAMEORIGIN' based on your needs
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: false, // Disable default CSP if not needed
    nosniff: true, // Enable X-Content-Type-Options: nosniff
  })
);

module.exports = app;
