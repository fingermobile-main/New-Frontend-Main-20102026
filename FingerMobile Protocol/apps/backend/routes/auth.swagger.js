/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration, login, and verification flows
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Initial registration creates a pending account.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered (pending verification)
 *       400:
 *         description: Missing fields
 *       409:
 *         description: Email or phone already exists
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user using email/phone and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Email or phone number
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful (returns JWT token or requires 2FA)
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account locked
 */

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email address
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid code or expired
 */

/**
 * @swagger
 * /auth/verify-phone:
 *   post:
 *     summary: Verify phone number
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, code]
 *             properties:
 *               phone:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Phone verified successfully
 *       400:
 *         description: Invalid code or expired
 */

/**
 * @swagger
 * /auth/setup-2fa:
 *   post:
 *     summary: Setup Two-Factor Authentication
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns 2FA secret and QR code URL
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/verify-2fa-login:
 *   post:
 *     summary: Verify 2FA token during login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, token]
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: 2FA verified, returns JWT token
 *       401:
 *         description: Invalid 2FA token
 */

/**
 * @swagger
 * /auth/forgot-password/request:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier]
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Email or phone number
 *     responses:
 *       200:
 *         description: Reset code sent
 *       404:
 *         description: User not found
 */
