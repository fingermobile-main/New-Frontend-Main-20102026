/**
 * @swagger
 * tags:
 *   name: blocking
 *   description: Auto-generated endpoints for blocking
 */

/**
 * @swagger
 * /blocking:
 *   get:
 *     summary: GET /
 *     tags: [blocking]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   post:
 *     summary: POST /
 *     tags: [blocking]
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
 * /blocking/{blockedmemberId}:
 *   delete:
 *     summary: DELETE /:blockedmemberId
 *     tags: [blocking]
 *     parameters:
 *       - in: path
 *         name: blockedmemberId
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
 * /blocking/check/{memberId}:
 *   get:
 *     summary: GET /check/:memberId
 *     tags: [blocking]
 *     parameters:
 *       - in: path
 *         name: memberId
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
 * /blocking/blocked-by:
 *   get:
 *     summary: GET /blocked-by
 *     tags: [blocking]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
