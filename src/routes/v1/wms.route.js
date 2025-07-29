const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const wmsValidation = require('../../validations/wms.validation');
const wmsController = require('../../controllers/wms.controller');

const router = express.Router();

router
  .route('/get-wms')
  .post(
    auth('Configuration-WMS'),
    validate(wmsValidation.getWMSAll),
    wmsController.getWMS
  );

router
  .route('/:wmsId')
  .get(
    auth('Configuration-WMS'),
    validate(wmsValidation.getWMS),
    wmsController.getWMSById
  );

router
  .route('/')
  .post(
    auth('Configuration-WMS'),
    validate(wmsValidation.createWMS),
    wmsController.createWMS
  );

router
  .route('/:wmsId')
  .put(
    auth('Configuration-WMS'),
    validate(wmsValidation.updateWMS),
    wmsController.updateWMS
  );

router
  .route('/:wmsId')
  .delete(
    auth('Configuration-WMS'),
    validate(wmsValidation.getWMS),
    wmsController.deleteWMS
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: WMS Machine
 *   description: WMS Machine API
 */
/**
 * @swagger
 * /wms:
 *   post:
 *     summary: WMS Machine
 *     description: Create WMS Machine.
 *     tags: [WMS Machine]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                -user_id
 *                -job_import
 *                -job_export
 *                -email
 *             properties:
 *               user_id:
 *                 type: string
 *               job_import:
 *                 type: string
 *               job_export:
 *                  type: string
 *               email:
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *             example:
 *                    user_id: 79725,
 *                    job_import: test import,
 *                    job_export: test export,
 *                    email: test@gmail.com
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/WMSMachine'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /wms/get-wms:
 *   get:
 *     summary: Get WMS Machine
 *     description: Get WMS Machine Data.
 *     tags: [WMS Machine]
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
 *                 WmsConfigMachine:
 *                     $ref: '#/components/responses/GetAllWMSConfig'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /wms/{wmsId}:
 *   put:
 *     summary: Update a WMS Machine
 *     description: Update a WMS Machine data.
 *     tags: [WMS Machine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: wmsId
 *         required: true
 *         schema:
 *           type: string
 *         description: WMS Machine ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                -user_id
 *                -job_import
 *                -job_export
 *                -email
 *             properties:
 *               user_id:
 *                 type: string
 *               job_import:
 *                 type: string
 *               job_export:
 *                  type: string
 *               email:
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *             example:
 *                    user_id: 79725,
 *                    job_import: test import,
 *                    job_export: test export,
 *                    email: test@gmail.com
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ConfigMachine'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a WMS Machine
 *     description: Delete WMS Machine.
 *     tags: [WMS Machine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: wmsId
 *         required: true
 *         schema:
 *           type: string
 *         description: WMS Machine ID
 *     responses:
 *       "200":
 *         description: WMS Machine Delete Successful
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
