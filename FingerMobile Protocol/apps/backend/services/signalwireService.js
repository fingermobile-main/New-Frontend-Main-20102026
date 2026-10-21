const logger = require('../utils/logger');
const axios = require('axios');

class SignalwireService {
  constructor() {
    this.baseUrl = 'https://fingermobile.signalwire.com';
    this.projectId = 'ca9df120-a7fe-48f9-8bbe-ac2363b09b69';
    this.signingKey = 'PSK_jUmAfA2QJjfD2efg1bNJ4U7E';
    // Create the base64 encoded credentials for basic auth
    const credentials = `${this.projectId}:${this.signingKey}`;
    this.authHeader = `Basic ${Buffer.from(credentials).toString('base64')}`;
  }

  /**
   * Send an SMS message
   * @param {string} to - The recipient's phone number
   * @param {string} message - The message to send
   * @returns {Promise<Object>} - The response from Signalwire API
   */
  async sendSMS(to, message) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/laml/2010-04-01/Accounts/${this.projectId}/Messages`,
        {
          To: to,
          From: process.env.SIGNALWIRE_FROM_NUMBER || '+1234567890', // Default from number
          Body: message
        },
        {
          headers: {
            Authorization: this.authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error(
        'Error sending SMS:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Send OTP via SMS
   * @param {string} phoneNumber - The recipient's phone number
   * @param {string} otp - The OTP to send
   * @returns {Promise<Object>} - The response from Signalwire API
   */
  async sendOTP(phoneNumber, otp) {
    const message = `Your FingerMobile OTP is: ${otp}. Valid for 10 minutes.`;
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Make a phone call
   * @param {string} to - The recipient's phone number
   * @param {string} message - The message to speak in the call
   * @returns {Promise<Object>} - The response from Signalwire API
   */
  async makeCall(to, message) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/laml/2010-04-01/Accounts/${this.projectId}/Calls`,
        {
          To: to,
          From: process.env.SIGNALWIRE_FROM_NUMBER || '+1234567890',
          Url: `http://demo.signalwire.com/your-messaging-application/${encodeURIComponent(message)}`
        },
        {
          headers: {
            Authorization: this.authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error(
        'Error making call:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}

module.exports = new SignalwireService();
