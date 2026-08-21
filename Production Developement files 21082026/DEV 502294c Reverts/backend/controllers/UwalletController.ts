import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';
import crypto from 'crypto';

/**
 * UwalletController
 * Wallet management - Get wallet, create wallet, check balance, transactions
 */

class UwalletController {
  private monetizationDb: Pool;

  constructor() {
    // Initialize database connection (should be injected in production)
    this.monetizationDb = new Pool({
      connectionString: process.env.MONETIZATION_DATABASE_URL
    });
  }

  /**
   * Helper function to generate unique wallet address
   */
  private generateWalletAddress(): string {
    return "fm_" + crypto.randomBytes(16).toString('hex');
  }

  /**
   * GET /api/wallet
   * Get user's wallet information
   */
  async getWallet(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const walletQuery = `
        SELECT id, user_id, wallet_address, balance, currency, is_active, created_at, updated_at
        FROM fic_wallets
        WHERE user_id = $1
      `;
      
      const walletResult = await this.monetizationDb.query(walletQuery, [userId]);

      if (walletResult.rows.length === 0) {
        res.json({
          success: true,
          message: 'User does not have a wallet yet',
          data: null
        });
        return;
      }

      res.json({
        success: true,
        message: 'Wallet retrieved successfully',
        data: walletResult.rows[0]
      });
    } catch (error) {
      logger.error('UwalletController.getWallet error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error retrieving wallet'
      });
    }
  }

  /**
   * POST /api/wallet
   * Create user's wallet
   */
  async createWallet(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const { currency = 'FIC' } = req.body;

      // Check if user already has a wallet
      const checkWalletQuery = 'SELECT id FROM fic_wallets WHERE user_id = $1';
      const checkWalletResult = await this.monetizationDb.query(checkWalletQuery, [userId]);

      if (checkWalletResult.rows.length > 0) {
        res.status(409).json({
          success: false,
          message: 'User already has a wallet'
        });
        return;
      }

      // Generate unique wallet address
      const walletAddress = this.generateWalletAddress();

      // Create wallet
      const createWalletQuery = `
        INSERT INTO fic_wallets (user_id, wallet_address, balance, currency)
        VALUES ($1, $2, $3, $4)
        RETURNING id, user_id, wallet_address, balance, currency, is_active, created_at, updated_at
      `;
      
      const walletResult = await this.monetizationDb.query(createWalletQuery, [
        userId,
        walletAddress,
        0.00,
        currency
      ]);

      res.status(201).json({
        success: true,
        message: 'Wallet created successfully',
        data: walletResult.rows[0]
      });
    } catch (error) {
      logger.error('UwalletController.createWallet error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error creating wallet'
      });
    }
  }

  /**
   * GET /api/wallet/balance
   * Get wallet balance
   */
  async getBalance(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const balanceQuery = 'SELECT wallet_address, balance, currency FROM fic_wallets WHERE user_id = $1';
      const balanceResult = await this.monetizationDb.query(balanceQuery, [userId]);

      if (balanceResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Wallet not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Balance retrieved successfully',
        data: balanceResult.rows[0]
      });
    } catch (error) {
      logger.error('UwalletController.getBalance error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error retrieving balance'
      });
    }
  }

  /**
   * GET /api/wallet/transactions
   * Get wallet transactions with pagination and filtering
   */
  async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = (page - 1) * limit;
      
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const { type, status, date_from, date_to } = req.query;

      let whereClause = 'WHERE w.user_id = $1';
      const params: any[] = [userId];
      let paramIndex = 2;

      if (type) {
        whereClause += ` AND t.type = $${paramIndex}`;
        params.push(type);
        paramIndex++;
      }

      if (status) {
        whereClause += ` AND t.status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      if (date_from) {
        whereClause += ` AND t.created_at >= $${paramIndex}`;
        params.push(date_from);
        paramIndex++;
      }

      if (date_to) {
        whereClause += ` AND t.created_at <= $${paramIndex}`;
        params.push(date_to);
        paramIndex++;
      }

      // Get transactions
      const transactionsQuery = `
        SELECT t.*, 
               CASE 
                 WHEN t.sender_wallet_id = w.id THEN 'debit'
                 ELSE 'credit'
               END as transaction_type
        FROM fic_transactions t
        JOIN fic_wallets w ON (t.sender_wallet_id = w.id OR t.receiver_wallet_id = w.id)
        ${whereClause}
        ORDER BY t.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      params.push(limit, offset);
      const transactionsResult = await this.monetizationDb.query(transactionsQuery, params);

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM fic_transactions t
        JOIN fic_wallets w ON (t.sender_wallet_id = w.id OR t.receiver_wallet_id = w.id)
        ${whereClause}
      `;
      
      const countResult = await this.monetizationDb.query(countQuery, params.slice(0, -2));
      const total = parseInt(countResult.rows[0]?.total || '0');

      res.json({
        success: true,
        message: 'Transactions retrieved successfully',
        data: {
          transactions: transactionsResult.rows,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit
          }
        }
      });
    } catch (error) {
      logger.error('UwalletController.getTransactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error retrieving transactions'
      });
    }
  }

  /**
   * POST /api/wallet/transfer
   * Transfer funds between wallets
   */
  async transfer(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const { receiver_wallet_id, amount, description } = req.body;

      if (!receiver_wallet_id || !amount || amount <= 0) {
        res.status(400).json({
          success: false,
          message: 'Receiver wallet ID and valid amount are required'
        });
        return;
      }

      const client = await this.monetizationDb.connect();

      try {
        await client.query('BEGIN');

        // Get sender wallet
        const senderWalletQuery = 'SELECT * FROM fic_wallets WHERE user_id = $1 FOR UPDATE';
        const senderWalletResult = await client.query(senderWalletQuery, [userId]);

        if (senderWalletResult.rows.length === 0) {
          await client.query('ROLLBACK');
          res.status(404).json({
            success: false,
            message: 'Sender wallet not found'
          });
          return;
        }

        const senderWallet = senderWalletResult.rows[0];

        // Check sufficient balance
        if (senderWallet.balance < amount) {
          await client.query('ROLLBACK');
          res.status(400).json({
            success: false,
            message: 'Insufficient balance'
          });
          return;
        }

        // Get receiver wallet
        const receiverWalletQuery = 'SELECT * FROM fic_wallets WHERE id = $1 FOR UPDATE';
        const receiverWalletResult = await client.query(receiverWalletQuery, [receiver_wallet_id]);

        if (receiverWalletResult.rows.length === 0) {
          await client.query('ROLLBACK');
          res.status(404).json({
            success: false,
            message: 'Receiver wallet not found'
          });
          return;
        }

        const receiverWallet = receiverWalletResult.rows[0];

        // Update sender balance
        await client.query(
          'UPDATE fic_wallets SET balance = balance - $1, updated_at = NOW() WHERE id = $2',
          [amount, senderWallet.id]
        );

        // Update receiver balance
        await client.query(
          'UPDATE fic_wallets SET balance = balance + $1, updated_at = NOW() WHERE id = $2',
          [amount, receiverWallet.id]
        );

        // Create transaction record
        const transactionQuery = `
          INSERT INTO fic_transactions (
            sender_wallet_id, receiver_wallet_id, amount, type, status, description
          ) VALUES ($1, $2, $3, 'transfer', 'completed', $4)
          RETURNING *
        `;
        
        const transactionResult = await client.query(transactionQuery, [
          senderWallet.id,
          receiverWallet.id,
          amount,
          description || 'Wallet transfer'
        ]);

        await client.query('COMMIT');

        res.json({
          success: true,
          message: 'Transfer completed successfully',
          data: transactionResult.rows[0]
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('UwalletController.transfer error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error processing transfer'
      });
    }
  }

  /**
   * GET /api/wallet/stats
   * Get wallet statistics
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const statsQuery = `
        SELECT 
          w.balance,
          w.currency,
          COUNT(t.id) FILTER (WHERE t.status = 'completed') as total_transactions,
          COALESCE(SUM(t.amount) FILTER (WHERE t.sender_wallet_id = w.id), 0) as total_sent,
          COALESCE(SUM(t.amount) FILTER (WHERE t.receiver_wallet_id = w.id), 0) as total_received
        FROM fic_wallets w
        LEFT JOIN fic_transactions t ON (t.sender_wallet_id = w.id OR t.receiver_wallet_id = w.id)
        WHERE w.user_id = $1
        GROUP BY w.id, w.balance, w.currency
      `;
      
      const statsResult = await this.monetizationDb.query(statsQuery, [userId]);

      if (statsResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Wallet not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Wallet statistics retrieved successfully',
        data: statsResult.rows[0]
      });
    } catch (error) {
      logger.error('UwalletController.getStats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error retrieving statistics'
      });
    }
  }
}

export default new UwalletController();
