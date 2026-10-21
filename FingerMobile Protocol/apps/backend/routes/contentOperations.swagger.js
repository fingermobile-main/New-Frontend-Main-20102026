/**
 * @swagger
 * tags:
 *   name: contentOperations
 *   description: Auto-generated endpoints for contentOperations
 */

/**
 * @swagger
 * /contentOperations/upload:
 *   post:
 *     summary: POST /upload
 *     tags: [contentOperations]
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
 * /contentOperations/trending:
 *   get:
 *     summary: GET /trending
 *     tags: [contentOperations]
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
 * /contentOperations/recommended:
 *   get:
 *     summary: GET /recommended
 *     tags: [contentOperations]
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
 * /contentOperations/{id}/report:
 *   post:
 *     summary: POST /:id/report
 *     tags: [contentOperations]
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
 * /contentOperations/{id}/analytics:
 *   get:
 *     summary: GET /:id/analytics
 *     tags: [contentOperations]
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
