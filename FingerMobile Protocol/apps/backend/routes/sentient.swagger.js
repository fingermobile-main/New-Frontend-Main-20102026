/**
 * @swagger
 * tags:
 *   name: sentient
 *   description: Auto-generated endpoints for sentient
 */

/**
 * @swagger
 * /sentient/analyze:
 *   post:
 *     summary: POST /analyze
 *     tags: [sentient]
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
 * /sentient/baseline/{memberId}:
 *   get:
 *     summary: GET /baseline/:memberId
 *     tags: [sentient]
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
 * /sentient/baseline:
 *   put:
 *     summary: PUT /baseline
 *     tags: [sentient]
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
 * /sentient/anomalies:
 *   get:
 *     summary: GET /anomalies
 *     tags: [sentient]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
