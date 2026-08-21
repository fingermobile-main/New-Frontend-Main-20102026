import express from "express";
import { body, param } from "express-validator";
import authMiddleware from "../middleware/auth";
import { authLimiter, emailLimiter } from "../middleware/rateLimiter";
import AuthController from "../controllers/AuthController";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "SecurePass123!"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 *       429:
 *         description: Rate limit exceeded (5 attempts per 15 minutes)
 */
router.post(
  "/register",
  authLimiter,
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("firstName").optional().isString().trim(),
    body("lastName").optional().isString().trim(),
    body("username").optional().isString().trim(),
    body("phone").optional().isString().trim()
  ],
  AuthController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "SecurePass123!"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       423:
 *         description: Account locked
 *       429:
 *         description: Rate limit exceeded (5 attempts per 15 minutes)
 */
router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  AuthController.login
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       400:
 *         description: Invalid email
 *       429:
 *         description: Rate limit exceeded (3 attempts per hour)
 */
router.post(
  "/forgot-password",
  emailLimiter,
  [body("email").isEmail().normalizeEmail().withMessage("Valid email is required")],
  AuthController.forgotPassword
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token:
 *                 type: string
 *                 example: "reset-token-here"
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 example: "NewSecurePass456!"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid token or weak password
 *       404:
 *         description: Invalid or expired token
 */
router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters long")
  ],
  AuthController.resetPassword
);

/**
 * @swagger
 * /api/auth/verify-email/{token}:
 *   get:
 *     summary: Verify email address
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get("/verify-email/:token", AuthController.verifyEmail);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", authMiddleware, AuthController.logout);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid or expired token
 */
router.post("/refresh-token", authMiddleware, AuthController.refreshToken);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authMiddleware, AuthController.getProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Jane"
 *               lastName:
 *                 type: string
 *                 example: "Smith"
 *               username:
 *                 type: string
 *                 example: "janesmith"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Username already taken
 */
router.put("/profile", authMiddleware, AuthController.updateProfile);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "OldPass123!"
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 example: "NewPass456!"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid current password or weak new password
 *       401:
 *         description: Unauthorized
 */
router.post("/change-password", authMiddleware, AuthController.changePassword);

export default router;
