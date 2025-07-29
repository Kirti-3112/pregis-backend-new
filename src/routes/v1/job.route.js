const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const jobsValidation = require('../../validations/jobs.validation');
const jobsController = require('../../controllers/jobs.controller');
const paperSenseAndDispenseRoute = require('./sense_and_dispense/paper/job.route');
const airPillowSenseAndDispenseRoute = require('./sense_and_dispense/air_pillow/job.route');

const router = express.Router();

router
  .route('/get-job')
  .post(
    auth('Jobs & Status'),
    validate(jobsValidation.jobsValidator),
    jobsController.getJobData
  );

router
  .route('/get-job/:id')
  .post(
    auth('Jobs & Status'),
    validate(jobsValidation.jobByIdValidator),
    jobsController.getJobDataById
  );

module.exports = router;

router.use('/sense-and-dispense/paper', paperSenseAndDispenseRoute);
router.use('/sense-and-dispense/air-pillow', airPillowSenseAndDispenseRoute);

/**
 * @swagger
 * tags:
 *   name: Job Status
 *   description: Job Status Data
 */
/**
 * @swagger
 * /jobs/get-job:
 *   post:
 *     summary: Get Job Status Data
 *     description: Get Job Status Data.
 *     tags: [Job Status]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               range:
 *                 type: object
 *                 properties:
 *                   from:
 *                     type: string
 *                   to:
 *                     type: string
 *               pagination:
 *                 type: object
 *                 properties:
 *                    pageSize:
 *                      type: number
 *                    page:
 *                      type: number
 *               filters:
 *                 type: object
 *             example:
 *               {"filters": {"Barcode":"LP","ProductionStatus": "All"},"pagination": {"pageSize": "1","pageLimit": "10" }}
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobData:
 *                     $ref: '#/components/responses/JobsStatus'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
