/**
 * Transactional Email Dispatch Route - FingerMobile Protocol™
 * Provides real email dispatch backed by Unified Enterprise EmailService
 */

const express = require('express');
const router = express.Router();
const EmailService = require('../services/EmailService');
const logger = require('../utils/logger');

router.post('/send', async (req, res) => {
  try {
    const { to, subject, body, templateSlug = 'welcome', data = {} } = req.body;

    if (!to || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Recipient "to" and "subject" are required.'
      });
    }

    const result = await EmailService.sendTransactionalEmail(to, subject, templateSlug, {
      ...data,
      bodyText: body || data.bodyText || '',
      firstName: data.firstName || 'Sovereign Member'
    });

    return res.status(200).json({
      success: true,
      message: 'Email dispatched successfully via FingerMobile Protocol™ Unified Email Service',
      data: result
    });
  } catch (err) {
    if (logger && typeof logger.error === 'function') {
      logger.error('Error dispatching transactional email:', err);
    }
    return res.status(500).json({
      success: false,
      message: 'Email dispatch failed',
      error: err.message
    });
  }
});

module.exports = router;

