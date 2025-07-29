const express = require('express');

const router = express.Router();
const { messageLookupController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { messageLookupValidation } = require('../../validations');
const auth = require('../../middlewares/auth');
const uploadExcel = require('../../middlewares/uploadExcel');

router
  .route('/')
  .get(
    auth('Configuration-Message Lookup'),
    validate(messageLookupValidation.getAllMessageLookup, 'query'),
    messageLookupController.get
  );

router
  .route('/')
  .post(
    auth('Configuration-Message Lookup'),
    validate(messageLookupValidation.createMessageLookup, 'body'),
    messageLookupController.create
  );

router
  .route('/')
  .put(
    auth('Configuration-Message Lookup'),
    validate(messageLookupValidation.updateMessageLookup, 'body'),
    messageLookupController.update
  );

router
  .route('/:id')
  .delete(
    auth('Configuration-Message Lookup'),
    validate(messageLookupValidation.deleteMessageLookup, 'params'),
    messageLookupController.remove
  );

router
  .route('/bulk-create')
  .post(
    auth('Configuration-Message Lookup'),
    uploadExcel.single('file'),
    messageLookupController.bulkUpload
  );

router.get(
  '/bulk-create-error-report/:reportId',
  auth('Configuration-Message Lookup'),
  messageLookupController.downloadErrorReport
);

router
  .route('/download/bulk-insertion-template')
  .get(
    auth('Configuration-Message Lookup'),
    messageLookupController.downloadBulkInsertionTemplate
  );

module.exports = router;
