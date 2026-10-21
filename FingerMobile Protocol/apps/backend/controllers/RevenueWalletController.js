/* eslint-disable no-console */
const db = require('../db');

class RevenueWalletController {
  // Get the wallet balance and recent transactions
  static async getWalletBalance(req, res) {
    try {
      const userId = req.user?.id || req.params.userId;
      if (!userId) return res.status(400).json({ error: 'User ID is required' });

      let walletResult = await db.query('SELECT * FROM user_wallets WHERE user_id = $1', [userId]);
      let wallet = walletResult.rows[0];

      if (!wallet) {
        const newWallet = await db.query(
          'INSERT INTO user_wallets (user_id) VALUES ($1) RETURNING *',
          [userId]
        );
        wallet = newWallet.rows[0];
      }

      const txResult = await db.query('SELECT * FROM transactions WHERE wallet_id = $1 ORDER BY created_at DESC LIMIT 20', [wallet.wallet_id]);

      res.status(200).json({
        wallet,
        recentTransactions: txResult.rows
      });
    } catch (error) {
      console.error('Error fetching wallet:', error);
      res.status(500).json({ error: 'Failed to fetch wallet' });
    }
  }

  // Deposit funds to wallet (simulated)
  static async depositFunds(req, res) {
    try {
      const { userId, amount } = req.body;
      const walletResult = await db.query('SELECT wallet_id FROM user_wallets WHERE user_id = $1', [userId]);

      if (walletResult.rows.length === 0) {
        return res.status(404).json({ error: 'Wallet not found' });
      }

      const walletId = walletResult.rows[0].wallet_id;

      await db.query('UPDATE user_wallets SET balance = balance + $1 WHERE wallet_id = $2', [amount, walletId]);
      await db.query(`
        INSERT INTO transactions (wallet_id, user_id, type, amount, status, description)
        VALUES ($1, $2, 'DEPOSIT', $3, 'COMPLETED', 'Simulated deposit')
      `, [walletId, userId, amount]);

      res.status(200).json({ message: 'Funds deposited successfully' });
    } catch (error) {
      console.error('Error depositing funds:', error);
      res.status(500).json({ error: 'Failed to deposit funds' });
    }
  }

  // Peer-to-peer tip from one user to a creator
  static async sendTip(req, res) {
    try {
      const { senderId, creatorId, amount } = req.body;

      const senderWalletResult = await db.query('SELECT wallet_id, balance FROM user_wallets WHERE user_id = $1', [senderId]);
      if (senderWalletResult.rows.length === 0 || senderWalletResult.rows[0].balance < amount) {
        return res.status(400).json({ error: 'Insufficient funds or wallet not found' });
      }

      const senderWalletId = senderWalletResult.rows[0].wallet_id;

      let creatorWalletResult = await db.query('SELECT wallet_id FROM user_wallets WHERE user_id = $1', [creatorId]);
      if (creatorWalletResult.rows.length === 0) {
        const newWallet = await db.query('INSERT INTO user_wallets (user_id) VALUES ($1) RETURNING *', [creatorId]);
        creatorWalletResult = { rows: [newWallet.rows[0]] };
      }
      const creatorWalletId = creatorWalletResult.rows[0].wallet_id;

      // Execute transfer
      await db.query('BEGIN');
      await db.query('UPDATE user_wallets SET balance = balance - $1 WHERE wallet_id = $2', [amount, senderWalletId]);
      await db.query('UPDATE user_wallets SET balance = balance + $1 WHERE wallet_id = $2', [amount, creatorWalletId]);

      // Log transactions
      await db.query('INSERT INTO transactions (wallet_id, user_id, type, amount, status, description) VALUES ($1, $2, \'TIP\', $3, \'COMPLETED\', \'Sent tip\')', [senderWalletId, senderId, -amount]);
      await db.query('INSERT INTO transactions (wallet_id, user_id, type, amount, status, description) VALUES ($1, $2, \'TIP\', $3, \'COMPLETED\', \'Received tip\')', [creatorWalletId, creatorId, amount]);

      await db.query('COMMIT');
      res.status(200).json({ message: 'Tip sent successfully' });
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error sending tip:', error);
      res.status(500).json({ error: 'Failed to send tip' });
    }
  }
}

module.exports = RevenueWalletController;
