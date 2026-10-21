/**
 * @swagger
 * tags:
 *   name: externalServices
 *   description: Auto-generated endpoints for externalServices
 */

/**
 * @swagger
 * /externalServices/signalwire/send-sms:
 *   post:
 *     summary: POST /signalwire/send-sms
 *     tags: [externalServices]
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
 * /externalServices/signalwire/send-otp:
 *   post:
 *     summary: POST /signalwire/send-otp
 *     tags: [externalServices]
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
 * /externalServices/moniepoint/init-transaction:
 *   post:
 *     summary: POST /moniepoint/init-transaction
 *     tags: [externalServices]
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
 * /externalServices/moniepoint/process-payout:
 *   post:
 *     summary: POST /moniepoint/process-payout
 *     tags: [externalServices]
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
 * /externalServices/moniepoint/wallet-balance:
 *   get:
 *     summary: GET /moniepoint/wallet-balance
 *     tags: [externalServices]
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
 * /externalServices/opay/process-payout:
 *   post:
 *     summary: POST /opay/process-payout
 *     tags: [externalServices]
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
 * /externalServices/opay/validate-payment:
 *   post:
 *     summary: POST /opay/validate-payment
 *     tags: [externalServices]
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
 * /externalServices/photocredits/create:
 *   post:
 *     summary: POST /photocredits/create
 *     tags: [externalServices]
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
 * /externalServices/photocredits/add-to-board:
 *   post:
 *     summary: POST /photocredits/add-to-board
 *     tags: [externalServices]
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
 * /externalServices/photocredits/record-download:
 *   post:
 *     summary: POST /photocredits/record-download
 *     tags: [externalServices]
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
 * /externalServices/photocredits/trending:
 *   get:
 *     summary: GET /photocredits/trending
 *     tags: [externalServices]
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
 * /externalServices/photocredits/recommended/{memberId}:
 *   get:
 *     summary: GET /photocredits/recommended/:memberId
 *     tags: [externalServices]
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
 * /externalServices/supersix/session:
 *   post:
 *     summary: POST /supersix/session
 *     tags: [externalServices]
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
 * /externalServices/supersix/session/{sessionId}:
 *   put:
 *     summary: PUT /supersix/session/:sessionId
 *     tags: [externalServices]
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

/**
 * @swagger
 * /externalServices/supersix/session/{sessionId}/end:
 *   put:
 *     summary: PUT /supersix/session/:sessionId/end
 *     tags: [externalServices]
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

/**
 * @swagger
 * /externalServices/supersix/member/{memberId}/stats:
 *   get:
 *     summary: GET /supersix/member/:memberId/stats
 *     tags: [externalServices]
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
 * /externalServices/supersix/leaderboards:
 *   get:
 *     summary: GET /supersix/leaderboards
 *     tags: [externalServices]
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
 * /externalServices/supersix/daily-challenges:
 *   get:
 *     summary: GET /supersix/daily-challenges
 *     tags: [externalServices]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
