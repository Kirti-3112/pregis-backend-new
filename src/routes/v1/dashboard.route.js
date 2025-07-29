const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const dashboardValidation = require('../../validations/dashboard.validation');
const dashboardController = require('../../controllers/dashboard.controller');
const paperSenseAndDispenseRoute = require('./sense_and_dispense/paper/dashboard.route');
const airPillowSenseAndDispenseRoute = require('./sense_and_dispense/air_pillow/dashboard.route');

const router = express.Router();

router
  .route('/')
  .post(
    auth('Dashboard'),
    validate(dashboardValidation.dashboardValidator),
    dashboardController.getDashboard
  );

router.use('/sense-and-dispense/paper', paperSenseAndDispenseRoute);
router.use('/sense-and-dispense/air-pillow', airPillowSenseAndDispenseRoute);

module.exports = router;
