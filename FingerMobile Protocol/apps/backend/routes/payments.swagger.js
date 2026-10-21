/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Endpoints for payments, invoices, and subscriptions
 */

/**
 * @swagger
 * /payments/create-intent:
 *   post:
 *     summary: Create a payment intent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *               currency:
 *                 type: string
 *                 description: Payment currency (e.g., USD)
 *               description:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/confirm:
 *   post:
 *     summary: Confirm a payment intent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentIntentId
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/history:
 *   get:
 *     summary: Get payment history
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/refund:
 *   post:
 *     summary: Process a refund
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentIntentId
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *               amount:
 *                 type: number
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refund processed successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/invoices:
 *   get:
 *     summary: Get invoices
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoices retrieved successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice retrieved successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/invoices/{id}/download:
 *   get:
 *     summary: Download an invoice
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice download started
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Handle payment webhooks
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook received
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/subscriptions/create:
 *   post:
 *     summary: Create a subscription
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription created successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/subscriptions/cancel:
 *   post:
 *     summary: Cancel a subscription
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriptionId
 *             properties:
 *               subscriptionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subscription cancelled successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments/subscriptions/status:
 *   get:
 *     summary: Get subscription status
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription status retrieved successfully
 *       500:
 *         description: Internal server error
 */
