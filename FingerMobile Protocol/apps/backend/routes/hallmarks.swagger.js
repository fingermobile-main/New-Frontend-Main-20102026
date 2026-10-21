/**
 * @swagger
 * tags:
 *   name: hallmarks
 *   description: Auto-generated endpoints for hallmarks
 */

/**
 * @swagger
 * /hallmarks:
 *   get:
 *     summary: GET /
 *     tags: [hallmarks]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   post:
 *     summary: POST /
 *     tags: [hallmarks]
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
 * /hallmarks/user/{userId}:
 *   get:
 *     summary: GET /user/:userId
 *     tags: [hallmarks]
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
 * /hallmarks/award:
 *   post:
 *     summary: POST /award
 *     tags: [hallmarks]
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
 * /hallmarks/check-milestones:
 *   post:
 *     summary: POST /check-milestones
 *     tags: [hallmarks]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
