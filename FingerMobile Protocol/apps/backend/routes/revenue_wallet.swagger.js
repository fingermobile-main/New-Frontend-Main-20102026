/**
 * @swagger
 * tags:
 *   name: revenue_wallet
 *   description: Auto-generated endpoints for revenue_wallet
 */

/**
 * @swagger
 * /revenue_wallet/{userId}/balance:
 *   get:
 *     summary: GET /:userId/balance
 *     tags: [revenue_wallet]
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
 * /revenue_wallet/deposit:
 *   post:
 *     summary: POST /deposit
 *     tags: [revenue_wallet]
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
 * /revenue_wallet/tip:
 *   post:
 *     summary: POST /tip
 *     tags: [revenue_wallet]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
