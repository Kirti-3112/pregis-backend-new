const express = require('express');
const auth = require('../../../../middlewares/auth');
const validate = require('../../../../middlewares/validate');
const historyValidation = require('../../../../validations/history.validation');
const {
  paperSenseAndDispenseHistoryController,
} = require('../../../../controllers');

const router = express.Router();

router
  .route('/paperDispensedByDay')
  .post(
    auth('History-Graphs'),
    validate(historyValidation.getHistory),
    paperSenseAndDispenseHistoryController.getPaperLengthDispensedByTimerange
  );

module.exports = router;
