/**
 * @swagger
 * tags:
 *   name: apiKeys
 *   description: Auto-generated endpoints for apiKeys
 */

/**
 * @swagger
 * /apiKeys:
 *   post:
 *     summary: POST /
 *     tags: [apiKeys]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   get:
 *     summary: GET /
 *     tags: [apiKeys]
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
 * /apiKeys/{apiKeyId}:
 *   get:
 *     summary: GET /:apiKeyId
 *     tags: [apiKeys]
 *     parameters:
 *       - in: path
 *         name: apiKeyId
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
 *     summary: DELETE /:apiKeyId
 *     tags: [apiKeys]
 *     parameters:
 *       - in: path
 *         name: apiKeyId
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
 * /apiKeys/{apiKeyId}/rotate:
 *   put:
 *     summary: PUT /:apiKeyId/rotate
 *     tags: [apiKeys]
 *     parameters:
 *       - in: path
 *         name: apiKeyId
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
 * /apiKeys/verify:
 *   post:
 *     summary: POST /verify
 *     tags: [apiKeys]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
