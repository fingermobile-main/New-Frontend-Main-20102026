/**
 * @swagger
 * tags:
 *   name: mii
 *   description: Auto-generated endpoints for mii
 */

/**
 * @swagger
 * /mii/updates:
 *   get:
 *     summary: GET /updates
 *     tags: [mii]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   post:
 *     summary: POST /updates
 *     tags: [mii]
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
 * /mii/updates/{updateId}/like:
 *   post:
 *     summary: POST /updates/:updateId/like
 *     tags: [mii]
 *     parameters:
 *       - in: path
 *         name: updateId
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
 * /mii/updates/{updateId}/view:
 *   post:
 *     summary: POST /updates/:updateId/view
 *     tags: [mii]
 *     parameters:
 *       - in: path
 *         name: updateId
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
 * /mii/stats:
 *   get:
 *     summary: GET /stats
 *     tags: [mii]
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
 * /mii/profile/{memberId}:
 *   get:
 *     summary: GET /profile/:memberId
 *     tags: [mii]
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
 * /mii/profile:
 *   put:
 *     summary: PUT /profile
 *     tags: [mii]
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
 * /mii/voice-line/trigger:
 *   post:
 *     summary: POST /voice-line/trigger
 *     tags: [mii]
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
 * /mii/analytics:
 *   get:
 *     summary: GET /analytics
 *     tags: [mii]
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
 * /mii/monetization:
 *   get:
 *     summary: GET /monetization
 *     tags: [mii]
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
 * /mii/follow/{targetMemberId}:
 *   post:
 *     summary: POST /follow/:targetMemberId
 *     tags: [mii]
 *     parameters:
 *       - in: path
 *         name: targetMemberId
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
 * /mii/recommendations:
 *   get:
 *     summary: GET /recommendations
 *     tags: [mii]
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
 * /mii/metrics/algorithm:
 *   get:
 *     summary: GET /metrics/algorithm
 *     tags: [mii]
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
 * /mii/track-interaction:
 *   post:
 *     summary: POST /track-interaction
 *     tags: [mii]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
