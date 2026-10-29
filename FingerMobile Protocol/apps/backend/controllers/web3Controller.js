/**
 * Web3 & MetaMask Sovereign Authentication Controller - FingerMobile Protocol™
 * Provides cryptographic challenge-response authentication, EIP-1193 signature verification,
 * and multi-chain wallet binding grounded in PostgreSQL.
 */

const { ethers } = require('ethers');
const crypto = require('crypto');
const db = require('../db');
const pool = db ? db.pool : null;
const logger = require('../utils/logger');

class Web3Controller {
  /**
   * GET /api/web3/nonce
   * Generates a cryptographically random, timestamped challenge nonce for MetaMask signing
   */
  async getNonce(req, res) {
    try {
      const walletAddress = (req.query.walletAddress || req.query.address || '').trim();

      if (!walletAddress) {
        return res.status(400).json({
          success: false,
          message: 'walletAddress query parameter is required.'
        });
      }

      if (!ethers.isAddress(walletAddress)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Ethereum/EVM wallet address format.'
        });
      }

      const checksumAddress = ethers.getAddress(walletAddress);
      const rawNonce = crypto.randomBytes(16).toString('hex');
      const nonce = `fm_auth_${rawNonce}`;
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      const challengeMessage = 
`FingerMobile Protocol™ — Sovereign Web3 Authentication

Please sign this one-time cryptographic challenge to verify wallet ownership and securely bind your MetaMask wallet to your sovereign account.

• Wallet: ${checksumAddress}
• Nonce: ${nonce}
• Timestamp: ${new Date().toISOString()}

No gas fees or blockchain transaction will be incurred.`;

      // Store or update nonce in database if available
      if (pool) {
        await pool.query(
          `INSERT INTO user_web3_wallets (wallet_address, nonce, nonce_expires_at, updated_at)
           VALUES ($1, $2, $3, NOW())
           ON CONFLICT (wallet_address)
           DO UPDATE SET nonce = $2, nonce_expires_at = $3, updated_at = NOW()`,
          [checksumAddress, nonce, expiresAt]
        );
      }

      return res.status(200).json({
        success: true,
        data: {
          walletAddress: checksumAddress,
          nonce,
          message: challengeMessage,
          expiresAt: expiresAt.toISOString()
        }
      });
    } catch (error) {
      if (logger && typeof logger.error === 'function') logger.error('Error generating Web3 nonce:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate Web3 challenge nonce',
        error: error.message
      });
    }
  }

  /**
   * POST /api/web3/verify
   * Verifies personal_sign signature using ethers.verifyMessage and binds wallet to user
   */
  async verifySignature(req, res) {
    try {
      const { walletAddress, signature, message, chainId = 1, walletType = 'metamask' } = req.body;

      if (!walletAddress || !signature || !message) {
        return res.status(400).json({
          success: false,
          message: 'walletAddress, signature, and message are required in request body.'
        });
      }

      if (!ethers.isAddress(walletAddress)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Ethereum/EVM wallet address format.'
        });
      }

      const checksumAddress = ethers.getAddress(walletAddress);

      // Verify the cryptographic signature against the original message
      let recoveredAddress;
      try {
        recoveredAddress = ethers.verifyMessage(message, signature);
      } catch (signErr) {
        return res.status(400).json({
          success: false,
          message: 'Invalid cryptographic signature format.',
          error: signErr.message
        });
      }

      if (recoveredAddress.toLowerCase() !== checksumAddress.toLowerCase()) {
        return res.status(401).json({
          success: false,
          message: 'Signature verification failed. Recovered address does not match claimed wallet address.',
          recoveredAddress,
          claimedAddress: checksumAddress
        });
      }

      // Check nonce expiration if stored in database
      const userId = req.user ? req.user.id : null;

      if (pool) {
        const nonceCheck = await pool.query(
          `SELECT nonce, nonce_expires_at FROM user_web3_wallets WHERE wallet_address = $1`,
          [checksumAddress]
        );

        if (nonceCheck.rows.length > 0) {
          const row = nonceCheck.rows[0];
          if (row.nonce_expires_at && new Date() > new Date(row.nonce_expires_at)) {
            return res.status(400).json({
              success: false,
              message: 'Authentication nonce has expired. Please request a fresh challenge.'
            });
          }
        }

        // Upsert verified wallet record
        await pool.query(
          `INSERT INTO user_web3_wallets (user_id, wallet_address, chain_id, wallet_type, verified, signature_proof, updated_at)
           VALUES ($1, $2, $3, $4, TRUE, $5, NOW())
           ON CONFLICT (wallet_address)
           DO UPDATE SET user_id = COALESCE($1, user_web3_wallets.user_id),
                         chain_id = $3,
                         wallet_type = $4,
                         verified = TRUE,
                         signature_proof = $5,
                         nonce = NULL,
                         nonce_expires_at = NULL,
                         updated_at = NOW()`,
          [userId, checksumAddress, parseInt(chainId, 10) || 1, walletType, signature]
        );

        // Update user's primary wallet address if user is logged in
        if (userId) {
          await pool.query(
            `UPDATE users SET wallet_address = $1, updated_at = NOW() WHERE id = $2`,
            [checksumAddress, userId]
          ).catch(() => {});
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          verified: true,
          walletAddress: checksumAddress,
          chainId: parseInt(chainId, 10) || 1,
          walletType,
          verifiedAt: new Date().toISOString(),
          message: 'MetaMask wallet successfully authenticated and bound to FingerMobile Protocol Sovereign Account.'
        }
      });
    } catch (error) {
      if (logger && typeof logger.error === 'function') logger.error('Error verifying Web3 signature:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify Web3 signature',
        error: error.message
      });
    }
  }

  /**
   * GET /api/web3/wallets
   * Lists verified Web3 wallets connected to the active user
   */
  async getWallets(req, res) {
    try {
      const userId = req.user ? req.user.id : null;
      if (!userId || !pool) {
        return res.status(200).json({
          success: true,
          data: []
        });
      }

      const result = await pool.query(
        `SELECT id, wallet_address, chain_id, wallet_type, verified, created_at, updated_at
         FROM user_web3_wallets
         WHERE user_id = $1 AND verified = TRUE
         ORDER BY updated_at DESC`,
        [userId]
      );

      return res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      if (logger && typeof logger.error === 'function') logger.error('Error fetching Web3 wallets:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve Web3 wallets',
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/web3/wallets/:address
   * Disconnects and unlinks a Web3 wallet from the user's account
   */
  async unlinkWallet(req, res) {
    try {
      const userId = req.user ? req.user.id : null;
      const walletAddress = req.params.address;

      if (!walletAddress || !ethers.isAddress(walletAddress)) {
        return res.status(400).json({
          success: false,
          message: 'Valid wallet address is required.'
        });
      }

      const checksumAddress = ethers.getAddress(walletAddress);

      if (pool && userId) {
        await pool.query(
          `DELETE FROM user_web3_wallets WHERE user_id = $1 AND wallet_address = $2`,
          [userId, checksumAddress]
        );
      }

      return res.status(200).json({
        success: true,
        message: 'Web3 wallet unlinked successfully.',
        unlinkedAddress: checksumAddress
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to unlink Web3 wallet',
        error: error.message
      });
    }
  }
}

module.exports = new Web3Controller();

