/**
 * @swagger
 * tags:
 *   name: discover
 *   description: Auto-generated endpoints for discover
 */

/**
 * @swagger
 * /discover/content:
 *   get:
 *     summary: GET /content
 *     tags: [discover]
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
 * /discover/featured:
 *   get:
 *     summary: GET /featured
 *     tags: [discover]
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
 * /discover/categories/{category}:
 *   get:
 *     summary: GET /categories/:category
 *     tags: [discover]
 *     parameters:
 *       - in: path
 *         name: category
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
 * /discover/creators:
 *   get:
 *     summary: GET /creators
 *     tags: [discover]
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
 * /discover/suggested/{memberId}:
 *   get:
 *     summary: GET /suggested/:memberId
 *     tags: [discover]
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
 * /discover/broadcasts:
 *   get:
 *     summary: GET /broadcasts
 *     tags: [discover]
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
 * /discover/personalized:
 *   get:
 *     summary: GET /personalized
 *     tags: [discover]
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
 * /discover/metrics/algorithm:
 *   get:
 *     summary: GET /metrics/algorithm
 *     tags: [discover]
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
 * /discover/track-interaction:
 *   post:
 *     summary: POST /track-interaction
 *     tags: [discover]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
