const express = require('express');
const authRoute = require('./auth.route');
const docsRoute = require('./docs.route');
const userRoute = require('./user.route');
const jobsRoute = require('./job.route');
const historyRoute = require('./history.route');
const machineRoute = require('./machine_event.route');
const config = require('../../config/config');
const wmsRoute = require('./wms.route');
const configMachine = require('./config_machine.route');
const dashboardRoute = require('./dashboard.route');
const cloudAzurePush = require('./cloud_azure_push.route');
const machineTypeLookupRoute = require('./machine_type_lookup.route');
const policyRoute = require('./policy.route');
const roleRoute = require('./role.route');
const accessConfigurationConstantRoute = require('./access_configuration_constants.route');
const configMachineLookupRoute = require('./config_machine_lookup.route');
const configMachineGroupRoute = require('./config_machine_group.route');
const configWorkGroupRoute = require('./config_work_group.route');
const configUnitConversionRoute = require('./config_unit_conversion.route');
const userMachineShiftRoute = require('./user_machine_shift.route');
const messageLookupRoute = require('./config_message_lookup.route');
const connectToServer = require('../../config/tcpSocketConnection');
const logger = require('../../config/logger');
const { TEST_CONNECTION_TYPE } = require('../../config/constants');
const validate = require('../../middlewares/validate');
const { testConnectionValidation } = require('../../validations');

const router = express.Router();

// Service healthCheck
router.get('/healthCheck', async (req, res) => {
  const healthCheck = {
    uptime: `${Math.floor(process.uptime())} seconds`,
    responseTime: process.hrtime(),
    message: 'OK',
    timestamp: Date.now(),
  };
  try {
    res.status(200).send(healthCheck);
  } catch (error) {
    healthCheck.message = error;
    res.status(503).send('Service Unavailable');
  }
});

router.get(
  '/test-connection',
  validate(testConnectionValidation.testConnection),
  (req, res) => {
    try {
      let tcpClient;
      let eventInput = '';
      const { type, id } = req.query;
      // Emit a message event to the server
      if (type === TEST_CONNECTION_TYPE.CONFIG_WMS) {
        const { serverAddressWMS, serverPortWMS } = config.tcpSocketConnection;
        tcpClient = connectToServer(serverAddressWMS, serverPortWMS);
        eventInput = `WMSID=${id}`.replace(/"/g, '');
        logger.info(`Connection Check for WMSID : ${id}`);
      } else if (type === TEST_CONNECTION_TYPE.CONFIG_MACHINE) {
        const { serverAddressMachine, serverPortMachine } =
          config.tcpSocketConnection;
        tcpClient = connectToServer(serverAddressMachine, serverPortMachine);
        eventInput = `PLCID=${id}`.replace(/"/g, '');
        logger.info(`Connection Check for MchineID : ${id}`);
      } else {
        logger.warn(
          `Facing some issue while connecting to tcpSocket for Type: ${type} and Id : ${id}`
        );
      }
      // emit the event with input data
      tcpClient.write(eventInput);
      // Listen for response from the server
      tcpClient.once('data', (data) => {
        const receivedData = data.toString();
        logger.info(`received response from TCP Socket: ${receivedData}`);
        res.send(receivedData);
      });
    } catch (error) {
      res.status(500).send('Tcp Socket Connection Failed');
    }
  }
);

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/jobs',
    route: jobsRoute,
  },
  {
    path: '/history',
    route: historyRoute,
  },
  {
    path: '/machine',
    route: machineRoute,
  },
  {
    path: '/wms',
    route: wmsRoute,
  },
  {
    path: '/config-machine',
    route: configMachine,
  },
  {
    path: '/cloud-azure-push',
    route: cloudAzurePush,
  },
  {
    path: '/dashboard',
    route: dashboardRoute,
  },
  {
    path: '/config-machine-type',
    route: machineTypeLookupRoute,
  },
  {
    path: '/policy',
    route: policyRoute,
  },
  {
    path: '/role',
    route: roleRoute,
  },
  {
    path: '/access-configuration-constant',
    route: accessConfigurationConstantRoute,
  },

  {
    path: '/config-machine-lookup',
    route: configMachineLookupRoute,
  },
  {
    path: '/config-machine-group',
    route: configMachineGroupRoute,
  },
  {
    path: '/config-work-group',
    route: configWorkGroupRoute,
  },
  {
    path: '/user-machine-shift',
    route: userMachineShiftRoute,
  },
  {
    path: '/config-unit-conversion',
    route: configUnitConversionRoute,
  },
  {
    path: '/message-lookup',
    route: messageLookupRoute,
  },
];

const devRoutes = [
  // routes available only in development mode (swagger UI)
  {
    path: '/docs',
    route: docsRoute,
  },
];
// route registration
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// dev env
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
