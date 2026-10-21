/**
 * @swagger
 * tags:
 *   name: fraud-alerts
 *   description: Auto-generated endpoints for fraud-alerts
 */

/**
 * @swagger
 * /fraud-alerts:
 *   get:
 *     summary: GET /
 *     tags: [fraud-alerts]
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
 * /fraud-alerts/{id}/resolve:
 *   post:
 *     summary: POST /:id/resolve
 *     tags: [fraud-alerts]
 *     parameters:
 *       - in: path
 *         name: id
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
 * /fraud-alerts/unblock-user:
 *   post:
 *     summary: POST /unblock-user
 *     tags: [fraud-alerts]
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
 * /fraud-alerts/stats:
 *   get:
 *     summary: GET /stats
 *     tags: [fraud-alerts]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
