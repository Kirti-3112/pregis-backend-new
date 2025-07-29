const express = require('express');
const auth = require('../../../../middlewares/auth');
const validate = require('../../../../middlewares/validate');
const jobsValidation = require('../../../../validations/jobs.validation');
const {
  airPillowSenseAndDispenseJobsController,
} = require('../../../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth('Jobs & Status'),
    validate(jobsValidation.jobsValidator),
    airPillowSenseAndDispenseJobsController.getJobData
  );

router
  .route('/:id')
  .post(
    auth('Jobs & Status'),
    validate(jobsValidation.jobByIdValidator),
    airPillowSenseAndDispenseJobsController.getJobDataById
  );

module.exports = router;
