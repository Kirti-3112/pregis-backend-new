const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const cloudAzurePushController = require('../../controllers/cloud_azure_push.controller');
const { cloudAzurePushValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(
    auth('read'),
    validate(cloudAzurePushValidation.cloudAzurePushValidator),
    cloudAzurePushController.pushData
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Azure
 *   description: Cloud Azure Data
 */
/**
 * @swagger
 * /cloud-azure-push:
 *   post:
 *     summary: Get Azure Data
 *     description: Get Azure Data.
 *     tags: [Azure]
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
 *               {"filters": {"Barcode":"LP","ProductionStatus": "All"},"pagination": {"pageSize": "1","pageLimit": "10" },"extension": "json"}
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobData:
 *                     $ref: '#/components/responses/AzurePush'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
