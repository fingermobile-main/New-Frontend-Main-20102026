const logger = require('../utils/logger');
const axios = require('axios');

class MoniepointService {
  constructor() {
    // Using the test credentials from the documentation
    this.apiKey = process.env.MONNIFY_APIKEY || 'MK_TEST_GC3B8XG2XX';
    this.secretKey =
      process.env.MONNIFY_SECRET_KEY || 'A663NRZA544DDPEM7KDN7Z8HRV6YXD8S';
    this.contractCode = process.env.MONNIFY_CONTRACT_CODE || '5867418298';
    this.baseUrl =
      process.env.MONNIFY_BASE_URL || 'https://sandbox.monnify.com';

    // Create the base64 encoded credentials for basic auth
    const credentials = `${this.apiKey}:${this.secretKey}`;
    this.authHeader = `Basic ${Buffer.from(credentials).toString('base64')}`;
  }

  /**
   * Get an access token for Moniepoint API
   * @returns {Promise<string>} - The access token
   */
  async getAccessToken() {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v1/auth/login`,
        {},
        {
          headers: {
            Authorization: this.authHeader,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.requestSuccessful) {
        this.accessToken = response.data.responseBody.accessToken;
        return this.accessToken;
      } else {
        throw new Error('Failed to get access token');
      }
    } catch (error) {
      logger.error(
        'Error getting access token:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Initialize a transaction
   * @param {Object} transactionData - Transaction details
   * @returns {Promise<Object>} - The response from Moniepoint API
   */
  async initTransaction(transactionData) {
    // Ensure we have a valid access token
    if (!this.accessToken) {
      await this.getAccessToken();
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v1/merchant/transactions/init-transaction`,
        transactionData,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error(
        'Error initializing transaction:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Process a payout to a member
   * @param {Object} payoutData - Payout details
   * @returns {Promise<Object>} - The response from Moniepoint API
   */
  async processPayout(payoutData) {
    // Ensure we have a valid access token
    if (!this.accessToken) {
      await this.getAccessToken();
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v2/disbursements/single`,
        payoutData,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error(
        'Error processing payout:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Validate an OTP for a payout transaction
   * @param {string} reference - Transaction reference
   * @param {string} otp - OTP to validate
   * @returns {Promise<Object>} - The response from Moniepoint API
   */
  async validatePayoutOtp(reference, otp) {
    // Ensure we have a valid access token
    if (!this.accessToken) {
      await this.getAccessToken();
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v2/disbursements/single/validate-otp`,
        {
          reference,
          otp
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error(
        'Error validating payout OTP:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Get wallet balance
   * @returns {Promise<Object>} - The response from Moniepoint API
   */
  async getWalletBalance() {
    // Ensure we have a valid access token
    if (!this.accessToken) {
      await this.getAccessToken();
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/api/v1/disbursements/wallet/balance`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error(
        'Error getting wallet balance:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}

module.exports = new MoniepointService();
