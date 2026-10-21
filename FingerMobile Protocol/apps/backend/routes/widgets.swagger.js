/**
 * @swagger
 * tags:
 *   name: widgets
 *   description: Auto-generated endpoints for widgets
 */

/**
 * @swagger
 * /widgets/{type}:
 *   get:
 *     summary: GET /:type
 *     tags: [widgets]
 *     parameters:
 *       - in: path
 *         name: type
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
 * /widgets/batch:
 *   post:
 *     summary: POST /batch
 *     tags: [widgets]
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
 * /widgets/invalidate-cache:
 *   post:
 *     summary: POST /invalidate-cache
 *     tags: [widgets]
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
 * /widgets/types:
 *   get:
 *     summary: GET /types
 *     tags: [widgets]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
