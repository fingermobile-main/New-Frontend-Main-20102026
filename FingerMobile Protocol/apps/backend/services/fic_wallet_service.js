const FICWallet = require('../models/FICWallet');
const { logSecurityEvent } = require('../utils/securityLogger');

class FICWalletService {
  /**
   * Create a new FIC wallet for a member.
   * Throws if a wallet already exists for the memberId (unique constraint).
   */
  static async createWallet(memberId) {
    const wallet = await FICWallet.create({
      memberId,
      balance: 0.0,
      lockedBalance: 0.0,
      status: 'active'
    });

    await logSecurityEvent({
      memberId,
      eventType: 'WALLET_CREATED',
      ipAddress: null,
      memberAgent: null,
      success: true,
      severity: 'LOW',
      description: `FIC wallet created for member ${memberId}`,
      sourceModule: 'FICWalletService',
      details: { walletId: wallet.id }
    });

    return wallet.toJSON();
  }

  /**
   * Retrieve a member's FIC wallet by memberId.
   * Returns the plain object or undefined if not found.
   */
  static async getWalletBymemberId(memberId) {
    const wallet = await FICWallet.findOne({ where: { memberId } });
    return wallet ? wallet.toJSON() : undefined;
  }

  /**
   * Retrieve a FIC wallet by its primary key (walletId).
   * Returns the plain object or undefined if not found.
   */
  static async getWalletById(walletId) {
    const wallet = await FICWallet.findByPk(walletId);
    return wallet ? wallet.toJSON() : undefined;
  }

  /**
   * Update balance and lockedBalance on a wallet by its primary key.
   */
  static async updateWalletBalance(walletId, newBalance, newLockedBalance) {
    const [affectedRows, updated] = await FICWallet.update(
      { balance: newBalance, lockedBalance: newLockedBalance },
      { where: { id: walletId }, returning: true }
    );

    if (affectedRows === 0) {
      throw new Error(`Wallet ${walletId} not found`);
    }

    return updated[0].toJSON();
  }
}

module.exports = FICWalletService;

