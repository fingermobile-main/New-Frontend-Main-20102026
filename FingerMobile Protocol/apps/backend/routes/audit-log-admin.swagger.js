/**
 * @swagger
 * tags:
 *   name: audit-log-admin
 *   description: Auto-generated endpoints for audit-log-admin
 */

/**
 * @swagger
 * /audit-log-admin:
 *   get:
 *     summary: GET /
 *     tags: [audit-log-admin]
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
 * /audit-log-admin/stats:
 *   get:
 *     summary: GET /stats
 *     tags: [audit-log-admin]
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
 * /audit-log-admin/export:
 *   post:
 *     summary: POST /export
 *     tags: [audit-log-admin]
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
 * /audit-log-admin/cleanup:
 *   delete:
 *     summary: DELETE /cleanup
 *     tags: [audit-log-admin]
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
 * /audit-log-admin/{id}:
 *   get:
 *     summary: GET /:id
 *     tags: [audit-log-admin]
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
 * /audit-log-admin/search:
 *   post:
 *     summary: POST /search
 *     tags: [audit-log-admin]
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
 * /audit-log-admin/trace/{traceId}:
 *   get:
 *     summary: GET /trace/:traceId
 *     tags: [audit-log-admin]
 *     parameters:
 *       - in: path
 *         name: traceId
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
 * /audit-log-admin/session/{sessionId}:
 *   get:
 *     summary: GET /session/:sessionId
 *     tags: [audit-log-admin]
 *     parameters:
 *       - in: path
 *         name: sessionId
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
