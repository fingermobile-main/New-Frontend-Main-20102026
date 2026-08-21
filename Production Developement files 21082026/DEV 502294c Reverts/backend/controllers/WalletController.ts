import { Request, Response } from "express";
import logger from '../utils/logger';
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import Wallet from "../models/WalletModel";
import Transaction from "../models/TransactionModel";
import Stake from "../models/StakeModel";
import Earnings from "../models/EarningsModel";
import { v4 as uuidv4 } from "uuid";

class WalletController {
  /**
   * Get wallet details for authenticated user
   */
  getWalletDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const userId = req.user.id;

      // Find or create wallet for user
      let wallet = await Wallet.findOne({ where: { userId } });

      if (!wallet) {
        wallet = await Wallet.create({
          userId,
          balance: 0.00,
          currency: "USD",
          status: "active"
        });
      }

      // Get recent transactions
      const transactions = await Transaction.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
        limit: 10
      });

      // Get total earnings
      const totalEarnings = await Earnings.sum("amount", {
        where: { userId, status: "available" }
      });

      res.status(200).json({
        wallet: {
          id: wallet.id,
          balance: wallet.balance,
          currency: wallet.currency,
          status: wallet.status
        },
        totalEarnings: totalEarnings || 0,
        recentTransactions: transactions
      });
    } catch (error) {
      logger.error("Error fetching wallet details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Distribute earnings to user wallet
   */
  distributeEarnings = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { amount, source, description } = req.body;
      const userId = req.user.id;

      // Validate amount
      if (!amount || amount <= 0) {
        res.status(400).json({ error: "Invalid amount" });
        return;
      }

      // Get user's wallet
      let wallet = await Wallet.findOne({ where: { userId } });

      if (!wallet) {
        wallet = await Wallet.create({
          userId,
          balance: 0.00,
          currency: "USD",
          status: "active"
        });
      }

      // Create earnings record
      const earning = await Earnings.create({
        userId,
        source: source || "other",
        amount,
        currency: wallet.currency,
        status: "available",
        description: description || "Earnings distribution"
      });

      // Update wallet balance
      await wallet.update({
        balance: wallet.balance + amount
      });

      // Create transaction record
      await Transaction.create({
        walletId: wallet.id,
        userId,
        type: "credit",
        amount,
        currency: wallet.currency,
        status: "completed",
        description: description || "Earnings distribution",
        reference: `earn_${uuidv4()}`
      });

      res.status(200).json({
        message: "Earnings distributed successfully",
        earning,
        newBalance: wallet.balance
      });
    } catch (error) {
      logger.error("Error distributing earnings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Stake tokens from wallet
   */
  stakeTokens = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { amount } = req.body;
      const userId = req.user.id;

      // Validate amount
      if (!amount || amount <= 0) {
        res.status(400).json({ error: "Invalid staking amount" });
        return;
      }

      // Get user's wallet
      const wallet = await Wallet.findOne({ where: { userId } });

      if (!wallet) {
        res.status(404).json({ error: "Wallet not found" });
        return;
      }

      // Check sufficient balance
      if (wallet.balance < amount) {
        res.status(400).json({ error: "Insufficient balance" });
        return;
      }

      // Create stake record
      const stake = await Stake.create({
        userId,
        walletId: wallet.id,
        amount,
        currency: wallet.currency,
        status: "active",
        rewardRate: 5.0, // Default 5% annual reward rate,
        stakedAt: new Date()
      });

      // Deduct from wallet balance
      await wallet.update({
        balance: wallet.balance - amount
      });

      // Create transaction record
      await Transaction.create({
        walletId: wallet.id,
        userId,
        type: "stake",
        amount,
        currency: wallet.currency,
        status: "completed",
        description: "Token staking",
        reference: `stake_${uuidv4()}`
      });

      res.status(200).json({
        message: "Tokens staked successfully",
        stake,
        newBalance: wallet.balance
      });
    } catch (error) {
      logger.error("Error staking tokens:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Get all stakes for user
   */
  getStakes = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const userId = req.user.id;

      const stakes = await Stake.findAll({
        where: { userId },
        order: [["stakedAt", "DESC"]]
      });

      res.status(200).json({ stakes });
    } catch (error) {
      logger.error("Error fetching stakes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Get distribution history
   */
  getDistributionHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const userId = req.user.id;

      const distributions = await Transaction.findAll({
        where: {
          userId,
          type: {
            [Op.in]: ["credit", "distribution"]
          }
        },
        order: [["createdAt", "DESC"]],
        limit: 50
      });

      res.status(200).json({ distributions });
    } catch (error) {
      logger.error("Error fetching distribution history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * Process payment
   */
  processPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { amount, recipientId, description } = req.body;
      const userId = req.user.id;

      // Validate amount
      if (!amount || amount <= 0) {
        res.status(400).json({ error: "Invalid payment amount" });
        return;
      }

      // Get sender's wallet
      const senderWallet = await Wallet.findOne({ where: { userId } });

      if (!senderWallet) {
        res.status(404).json({ error: "Wallet not found" });
        return;
      }

      // Check sufficient balance
      if (senderWallet.balance < amount) {
        res.status(400).json({ error: "Insufficient balance" });
        return;
      }

      // Get recipient's wallet
      let recipientWallet = await Wallet.findOne({ where: { userId: recipientId } });

      if (!recipientWallet) {
        recipientWallet = await Wallet.create({
          userId: recipientId,
          balance: 0.00,
          currency: "USD",
          status: "active"
        });
      }

      // Deduct from sender
      await senderWallet.update({
        balance: senderWallet.balance - amount
      });

      // Add to recipient
      await recipientWallet.update({
        balance: recipientWallet.balance + amount
      });

      // Create transaction records
      await Transaction.create({
        walletId: senderWallet.id,
        userId,
        type: "debit",
        amount,
        currency: senderWallet.currency,
        status: "completed",
        description: description || "Payment sent",
        reference: `pay_${uuidv4()}`
      });

      await Transaction.create({
        walletId: recipientWallet.id,
        userId: recipientId,
        type: "credit",
        amount,
        currency: recipientWallet.currency,
        status: "completed",
        description: description || "Payment received",
        reference: `pay_${uuidv4()}`
      });

      res.status(200).json({
        message: "Payment processed successfully",
        transaction: {
          amount,
          senderId: userId,
          recipientId,
          description
        }
      });
    } catch (error) {
      logger.error("Error processing payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

export default new WalletController();
