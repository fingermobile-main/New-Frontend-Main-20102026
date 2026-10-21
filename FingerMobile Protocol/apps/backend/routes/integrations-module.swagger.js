/**
 * @swagger
 * tags:
 *   name: integrations-module
 *   description: Auto-generated endpoints for integrations-module
 */

/**
 * @swagger
 * /integrations-module:
 *   get:
 *     summary: GET /
 *     tags: [integrations-module]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   post:
 *     summary: POST /
 *     tags: [integrations-module]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /integrations-module/{integrationId}:
 *   get:
 *     summary: GET /:integrationId
 *     tags: [integrations-module]
 *     parameters:
 *       - in: path
 *         name: integrationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   put:
 *     summary: PUT /:integrationId
 *     tags: [integrations-module]
 *     parameters:
 *       - in: path
 *         name: integrationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   delete:
 *     summary: DELETE /:integrationId
 *     tags: [integrations-module]
 *     parameters:
 *       - in: path
 *         name: integrationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /integrations-module/user/{userId}:
 *   get:
 *     summary: GET /user/:userId
 *     tags: [integrations-module]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /integrations-module/{integrationId}/toggle:
 *   patch:
 *     summary: PATCH /:integrationId/toggle
 *     tags: [integrations-module]
 *     parameters:
 *       - in: path
 *         name: integrationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /integrations-module/{integrationId}/test:
 *   post:
 *     summary: POST /:integrationId/test
 *     tags: [integrations-module]
 *     parameters:
 *       - in: path
 *         name: integrationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
