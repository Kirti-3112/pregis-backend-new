const mongoose = require('mongoose');
const http = require('http');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { seedData } = require('./seed/seed_data_import');
const initializeSocketServer = require('./utils/socketHandler');

let server;
let isShuttingDown = false;

// ✅ Log the validated config value, not raw env
logger.info(`mongo url --- ${config.mongoose.url}`);
logger.info(`db name --- ${JSON.stringify(config.mongoose)}`);

// ✅ Use validated config
mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    logger.info('Connected to MongoDB');
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  })
  .catch((err) => {
    logger.error(`❌ Failed to connect to MongoDB: ${err}`);
    server = app.listen(config.port, () => {
      logger.info(`⚠️ Still starting server on port ${config.port} without DB`);
    });
  });

async function gracefulShutdown(error) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  if (error) {
    logger.error('Unexpected error occurred:', error);
  }

  logger.info('Starting graceful shutdown...');

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            logger.error('Error during server close:', err);
            return reject(err);
          }
          logger.info('HTTP server closed.');
          resolve();
        });
      });
    }

    await mongoose.connection.close(false); // false = don't force close, wait for operations
    logger.info('MongoDB connection closed.');

    logger.info('Shutdown complete. Exiting process.');
    process.exit(error ? 1 : 0);
  } catch (shutdownError) {
    logger.error('Error during shutdown:', shutdownError);
    process.exit(1);
  }
}

// Signal and exception handlers
process.on('SIGTERM', () => {
  logger.info('SIGTERM received.');
  gracefulShutdown();
});

process.on('SIGINT', () => {
  logger.info('SIGINT (Ctrl+C) received.');
  gracefulShutdown();
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown(error);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  gracefulShutdown(reason instanceof Error ? reason : new Error(reason));
});

// Start server
async function startServer() {
  try {
    logger.info(`Connecting to MongoDB at: ${process.env.MONGODB_URL}`);
    await mongoose.connect(process.env.MONGODB_URL);
    logger.info('Connected to MongoDB');

    await seedData();

    server = http.createServer(app);
    initializeSocketServer(server);

    server.listen(config.port, () => {
      logger.info(`Server is listening on port ${config.port}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    gracefulShutdown(err);
  }
}

startServer();
