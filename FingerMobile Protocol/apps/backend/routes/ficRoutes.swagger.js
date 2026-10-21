/**
 * @swagger
 * tags:
 *   name: ficRoutes
 *   description: Auto-generated endpoints for ficRoutes
 */

/**
 * @swagger
 * /ficRoutes/wallet/initialize:
 *   post:
 *     summary: POST /wallet/initialize
 *     tags: [ficRoutes]
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
 * /ficRoutes/wallet/{memberId}:
 *   get:
 *     summary: GET /wallet/:memberId
 *     tags: [ficRoutes]
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
 * /ficRoutes/transaction:
 *   post:
 *     summary: POST /transaction
 *     tags: [ficRoutes]
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
 * /ficRoutes/exchange:
 *   post:
 *     summary: POST /exchange
 *     tags: [ficRoutes]
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
 * /ficRoutes/payment:
 *   post:
 *     summary: POST /payment
 *     tags: [ficRoutes]
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
 * /ficRoutes/payout:
 *   post:
 *     summary: POST /payout
 *     tags: [ficRoutes]
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
 * /ficRoutes/biometric/register:
 *   post:
 *     summary: POST /biometric/register
 *     tags: [ficRoutes]
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
 * /ficRoutes/biometric/verify:
 *   post:
 *     summary: POST /biometric/verify
 *     tags: [ficRoutes]
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
 * /ficRoutes/anonymity/{memberId}:
 *   get:
 *     summary: GET /anonymity/:memberId
 *     tags: [ficRoutes]
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
 *   put:
 *     summary: PUT /anonymity/:memberId
 *     tags: [ficRoutes]
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
 * /ficRoutes/subscription/payment:
 *   post:
 *     summary: POST /subscription/payment
 *     tags: [ficRoutes]
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
 * /ficRoutes/paylink:
 *   post:
 *     summary: POST /paylink
 *     tags: [ficRoutes]
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
 * /ficRoutes/paylink/redeem:
 *   post:
 *     summary: POST /paylink/redeem
 *     tags: [ficRoutes]
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
 * /ficRoutes/paylink/{memberId}:
 *   get:
 *     summary: GET /paylink/:memberId
 *     tags: [ficRoutes]
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
 * /ficRoutes/paylink/cancel/{paylinkId}:
 *   put:
 *     summary: PUT /paylink/cancel/:paylinkId
 *     tags: [ficRoutes]
 *     parameters:
 *       - in: path
 *         name: paylinkId
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
 * /ficRoutes/transactions/{memberId}:
 *   get:
 *     summary: GET /transactions/:memberId
 *     tags: [ficRoutes]
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
 * /ficRoutes/exchange-rate:
 *   get:
 *     summary: GET /exchange-rate
 *     tags: [ficRoutes]
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
 * /ficRoutes/payment-gateways:
 *   get:
 *     summary: GET /payment-gateways
 *     tags: [ficRoutes]
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
 * /ficRoutes/biometric/{memberId}:
 *   get:
 *     summary: GET /biometric/:memberId
 *     tags: [ficRoutes]
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
