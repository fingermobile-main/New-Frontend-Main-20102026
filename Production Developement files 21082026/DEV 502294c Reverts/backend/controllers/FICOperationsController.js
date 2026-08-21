/**
 * FIC Operations Controller
 * Handles wallet, transactions, payments, biometric operations
 */

const FICService = require("../services/fic_service");

class FICOperationsController {
  /**
   * Initialize FIC wallet
   */
  async initializeWallet(req, res) {
    try {
      const result = await FICService.initializeWallet(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get wallet by member ID
   */
  async getWallet(req, res) {
    try {
      const { memberId } = req.params;
      const wallet = await FICService.getWallet(memberId);
      res.json({ success: true, data: wallet });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Create transaction
   */
  async createTransaction(req, res) {
    try {
      const transaction = await FICService.createTransaction(req.body);
      res.json({ success: true, data: transaction });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Exchange currencies
   */
  async exchange(req, res) {
    try {
      const result = await FICService.exchange(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Process payment
   */
  async payment(req, res) {
    try {
      const result = await FICService.processPayment(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Process payout
   */
  async payout(req, res) {
    try {
      const result = await FICService.processPayout(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Register biometric
   */
  async registerBiometric(req, res) {
    try {
      const result = await FICService.registerBiometric(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Verify biometric
   */
  async verifyBiometric(req, res) {
    try {
      const result = await FICService.verifyBiometric(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get anonymity settings
   */
  async getAnonymity(req, res) {
    try {
      const { memberId } = req.params;
      const settings = await FICService.getAnonymity(memberId);
      res.json({ success: true, data: settings });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Update anonymity settings
   */
  async updateAnonymity(req, res) {
    try {
      const { memberId } = req.params;
      const result = await FICService.updateAnonymity(memberId, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Create paylink
   */
  async createPaylink(req, res) {
    try {
      const paylink = await FICService.createPaylink(req.body);
      res.json({ success: true, data: paylink });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Redeem paylink
   */
  async redeemPaylink(req, res) {
    try {
      const result = await FICService.redeemPaylink(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get paylink
   */
  async getPaylink(req, res) {
    try {
      const { memberId } = req.params;
      const paylink = await FICService.getPaylink(memberId);
      res.json({ success: true, data: paylink });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Cancel paylink
   */
  async cancelPaylink(req, res) {
    try {
      const { paylinkId } = req.params;
      const result = await FICService.cancelPaylink(paylinkId);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get transactions
   */
  async getTransactions(req, res) {
    try {
      const { memberId } = req.params;
      const transactions = await FICService.getTransactions(memberId);
      res.json({ success: true, data: transactions });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get all exchange rates
   */
  async getExchangeRates(req, res) {
    try {
      const rates = await FICService.getExchangeRates();
      res.json({ success: true, data: rates });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get payment gateways
   */
  async getPaymentGateways(req, res) {
    try {
      const gateways = await FICService.getPaymentGateways();
      res.json({ success: true, data: gateways });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get biometric info
   */
  async getBiometric(req, res) {
    try {
      const { memberId } = req.params;
      const info = await FICService.getBiometric(memberId);
      res.json({ success: true, data: info });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new FICOperationsController();
