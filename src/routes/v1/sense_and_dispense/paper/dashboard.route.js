const express = require('express');
const auth = require('../../../../middlewares/auth');
const validate = require('../../../../middlewares/validate');
const dashboardValidation = require('../../../../validations/dashboard.validation');
const {
  paperSenseAndDispenseDashboardController,
} = require('../../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth('Dashboard'),
    validate(dashboardValidation.dashboardValidator),
    paperSenseAndDispenseDashboardController.getSenseAndDispenseDashboard
  );

module.exports = router;
