const express = require('express');
const auth = require('../../../../middlewares/auth');
const validate = require('../../../../middlewares/validate');
const historyValidation = require('../../../../validations/history.validation');
const {
  airPillowSenseAndDispenseHistoryController,
} = require('../../../../controllers');

const router = express.Router();

router
  .route('/airPillowsDispensedByDay')
  .post(
    auth('History-Graphs'),
    validate(historyValidation.getHistory),
    airPillowSenseAndDispenseHistoryController.getAirPillowsDispensedByTimerange
  );

module.exports = router;
