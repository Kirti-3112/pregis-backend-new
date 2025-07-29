const express = require('express');
const auth = require('../../middlewares/auth');
const { machineController } = require('../../controllers');

const router = express.Router();

router
  .route('/machine_events')
  .post(
    auth('Dashboard', 'Machine &  Status'),
    machineController.getMachineDetails
  );

// router
//   .route('/check_machine_uptime')
//   .post(
//     auth('Dashboard', 'Machine &  Status'),
//     machineController.checkCurrentMachineUpTime
//   );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Machine Event
 *   description: Machine Event API
 */

/**
 * @swagger
 * /machine/check_machine_uptime:
 *   post:
 *     summary: Get Machine Event - Check Machine Uptime
 *     description: Get Machine Event - Check Machine Uptime.
 *     tags: [Machine Event]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                -pageName
 *             properties:
 *               pageName:
 *                 type: string
 *             example:
 *                 pageName: machine
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 machineData:
 *                     $ref: '#/components/responses/GetMachineUptime'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /machine/machine_events:
 *   get:
 *     summary: Get Machine Event - Machine Data
 *     description: Get Machine Event - Machine Data.
 *     tags: [Machine Event]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 machineData:
 *                     $ref: '#/components/responses/GetMachineEvent'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
