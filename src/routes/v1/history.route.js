const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const historyValidation = require('../../validations/history.validation');
const historyController = require('../../controllers/history.controller');
const paperSenseAndDispenseRoute = require('./sense_and_dispense/paper/history.route');
const airPillowSenseAndDispenseRoute = require('./sense_and_dispense/air_pillow/history.route');

const router = express.Router();

router
  .route('/logged_event')
  .post(
    auth('History-Logged Events'),
    validate(historyValidation.getHistory),
    historyController.getLoggedEventsHistory
  );

router
  .route('/averageVolumeReduction')
  .post(
    auth('History-Graphs'),
    validate(historyValidation.getHistory),
    historyController.getReportsForGraph
  );

router
  .route('/productionByDay')
  .post(
    auth('History-Graphs'),
    validate(historyValidation.getHistory),
    historyController.getProductionByDay
  );

router
  .route('/countMachineEvent')
  .post(
    auth('History-Graphs'),
    validate(historyValidation.getHistory),
    historyController.getCountOfMachineEvent
  );

router
  .route('/job-completed')
  .post(
    auth('History-Graphs'),
    validate(historyValidation.getJobByHour),
    historyController.getJobCompletedByHour
  );

router
  .route('/get-distinct-areas')
  .post(
    auth('History-Graphs'),
    validate(historyValidation.getDistinctAreas),
    historyController.getDistinctAreas
  );

router
  .route('/void-volume-minimum-by-day')
  .post(
    auth('History-Graphs'),
    validate(historyValidation.getHistory),
    historyController.getVoidVolumeMinimumByDay
  );

router.use('/sense-and-dispense/paper', paperSenseAndDispenseRoute);
router.use('/sense-and-dispense/air-pillow', airPillowSenseAndDispenseRoute);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: History
 *   description: History API
 */

/**
 * @swagger
 * /history/get-distinct-areas:
 *   get:
 *     summary: Get History - Distinct Area
 *     description: Get History - Distinct Area.
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 area:
 *                     $ref: '#/components/responses/GetArea'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /history/job-completed:
 *   get:
 *     summary: Get History - Job Completed
 *     description: Get History - Job Completed.
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *        - in: query
 *          name: timeRange
 *          required: true
 *          schema:
 *            type: string
 *            description: hourly / daily
 *        - in: query
 *          name: extension
 *          required: true
 *          schema:
 *            type: string
 *            description: JSON / XLSX
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobCount:
 *                     $ref: '#/components/responses/GetJobCount'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /history/averageVolumeReduction:
 *   get:
 *     summary: Get History - Average Volume Reduction
 *     description: Get History - Average Volume Reduction.
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *        - in: query
 *          name: from
 *          required: true
 *          schema:
 *            type: string
 *            description: From Date
 *        - in: query
 *          name: to
 *          required: true
 *          schema:
 *            type: string
 *            description: To Date
 *        - in: query
 *          name: extension
 *          required: true
 *          schema:
 *            type: string
 *            description: JSON / XLSX
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageVolume:
 *                     $ref: '#/components/responses/GetAverageVolumeReduction'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /history/productionByDay:
 *   get:
 *     summary: Get History - Production By Day
 *     description: Get History - Production By Day.
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *        - in: query
 *          name: from
 *          required: true
 *          schema:
 *            type: string
 *            description: From Date
 *        - in: query
 *          name: to
 *          required: true
 *          schema:
 *            type: string
 *            description: To Date
 *        - in: query
 *          name: extension
 *          required: true
 *          schema:
 *            type: string
 *            description: JSON / XLSX
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productionByDay:
 *                     $ref: '#/components/responses/GetProductionByDay'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /history/countMachineEvent:
 *   get:
 *     summary: Get History - Count Machine Event
 *     description: Get History - Count Machine Event.
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *        - in: query
 *          name: area
 *          required: true
 *          schema:
 *            type: string
 *            description: Mention Machine Area
 *        - in: query
 *          name: extension
 *          required: true
 *          schema:
 *            type: string
 *            description: JSON / XLSX
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 countMachine:
 *                     $ref: '#/components/responses/GetCountMachineEvent'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /history/logged_event:
 *   post:
 *     summary: Get History - Logged Event
 *     description: Get History - Logged Event.
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pagination:
 *                 type: object
 *                 properties:
 *                    pageLimit:
 *                      type: number
 *                    page:
 *                      type: number
 *             example:
 *                 {pagination: {page: 1, pageLimit: 12}}
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loggedEvents:
 *                     $ref: '#/components/responses/GetLoggedEvent'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
