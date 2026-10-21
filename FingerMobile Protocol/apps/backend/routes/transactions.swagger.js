/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transactions API for gifting and transfers
 *
 * /api/transactions/gift:
 *   post:
 *     summary: Gift a product to another user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - recipientUsername
 *             properties:
 *               productId:
 *                 type: string
 *               recipientUsername:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gift sent successfully
 *       500:
 *         description: Internal server error
 */
