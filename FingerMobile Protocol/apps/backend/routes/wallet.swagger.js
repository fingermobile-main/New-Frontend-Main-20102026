/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Endpoints for managing user wallets, balances, deposits, and transfers
 */

/**
 * @swagger
 * /wallet:
 *   get:
 *     summary: Get user's wallet information
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet information retrieved successfully
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create user's wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Wallet created successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /wallet/balance:
 *   get:
 *     summary: Get wallet balance
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet balance retrieved successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /wallet/transactions:
 *   get:
 *     summary: Get wallet transactions
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet transactions retrieved successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /wallet/deposit:
 *   post:
 *     summary: Deposit funds to wallet
 *     tags: [Wallet]
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
 *               currency:
 *                 type: string
 *     responses:
 *       200:
 *         description: Deposit successful
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /wallet/withdraw:
 *   post:
 *     summary: Withdraw funds from wallet
 *     tags: [Wallet]
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
 *               - destination
 *             properties:
 *               amount:
 *                 type: number
 *               destination:
 *                 type: string
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /wallet/transfer:
 *   post:
 *     summary: Transfer funds to another wallet
 *     tags: [Wallet]
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
 *               - recipientId
 *             properties:
 *               amount:
 *                 type: number
 *               recipientId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transfer successful
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /wallet/exchange-rates:
 *   get:
 *     summary: Get current exchange rates
 *     tags: [Wallet]
 *     responses:
 *       200:
 *         description: Exchange rates retrieved successfully
 *       500:
 *         description: Internal server error
 */
