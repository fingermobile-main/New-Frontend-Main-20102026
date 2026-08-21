import express from "express";
import { body } from "express-validator";
import authMiddleware from "../middleware/auth";
import { paymentLimiter, walletLimiter, stakeLimiter } from "../middleware/rateLimiter";
import WalletController from "../controllers/WalletController";

const router = express.Router();

/**
 * @swagger
 * /api/enhanced-wallet:
 *   get:
 *     summary: Get user wallet details
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 wallet:
 *                   $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded
 */
router.get(
  "/enhanced-wallet",
  authMiddleware,
  walletLimiter,
  WalletController.getWalletDetails
);

/**
 * @swagger
 * /api/enhanced-wallet/distribute-earnings:
 *   post:
 *     summary: Distribute earnings to wallet
 *     tags: [Earnings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 50.00
 *               source:
 *                 type: string
 *                 enum: [views, subscriptions, gems, ads, donations, tips, affiliate, merchandise, other]
 *                 example: views
 *               description:
 *                 type: string
 *                 example: "Earnings from video views"
 *     responses:
 *       201:
 *         description: Earnings distributed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded (10 requests per minute)
 */
router.post(
  "/enhanced-wallet/distribute-earnings",
  authMiddleware,
  paymentLimiter,
  [
    body("amount")
      .isFloat({ min: 0.01 })
      .withMessage("Amount must be a positive number"),
    body("source")
      .optional()
      .isString()
      .withMessage("Source must be a string"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string")
  ],
  WalletController.distributeEarnings
);

/**
 * @swagger
 * /api/enhanced-wallet/stake:
 *   post:
 *     summary: Stake tokens for rewards
 *     tags: [Staking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 100.00
 *     responses:
 *       201:
 *         description: Tokens staked successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded (5 stakes per hour)
 */
router.post(
  "/enhanced-wallet/stake",
  authMiddleware,
  stakeLimiter,
  [
    body("amount")
      .isFloat({ min: 0.01 })
      .withMessage("Amount must be a positive number")
  ],
  WalletController.stakeTokens
);

/**
 * @swagger
 * /api/enhanced-wallet/stakes:
 *   get:
 *     summary: Get all user stakes
 *     tags: [Staking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stakes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stakes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Stake'
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/enhanced-wallet/stakes",
  authMiddleware,
  walletLimiter,
  WalletController.getStakes
);

/**
 * @swagger
 * /api/enhanced-wallet/distribution-history:
 *   get:
 *     summary: Get earnings distribution history
 *     tags: [Earnings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Distribution history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/enhanced-wallet/distribution-history",
  authMiddleware,
  walletLimiter,
  WalletController.getDistributionHistory
);

/**
 * @swagger
 * /api/enhanced-wallet/process-payment:
 *   post:
 *     summary: Process payment to recipient
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, recipientId]
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 25.00
 *               recipientId:
 *                 type: string
 *                 format: uuid
 *                 example: "recipient-uuid-here"
 *               description:
 *                 type: string
 *                 example: "Payment for services"
 *     responses:
 *       201:
 *         description: Payment processed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded (10 payments per minute)
 */
router.post(
  "/api/enhanced-wallet/process-payment",
  authMiddleware,
  paymentLimiter,
  [
    body("amount")
      .isFloat({ min: 0.01 })
      .withMessage("Amount must be a positive number"),
    body("recipientId")
      .isString()
      .notEmpty()
      .withMessage("Recipient ID is required"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string")
  ],
  WalletController.processPayment
);

export default router;
