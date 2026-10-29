/**
 * FingerMobile Protocol™ - Universal QR Code Engine Service
 * High-performance, offline-capable QR generation service using Node.js 'qrcode'
 * Supports SVG, PNG Data URLs, and direct image streaming.
 */

const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const logger = require('../utils/logger');

/**
 * GET /api/qr/generate
 * Query params: text (required), size (default: 256), format ('svg' | 'png' | 'dataurl')
 */
router.get('/generate', async (req, res) => {
  try {
    const text = req.query.text || req.query.data;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Missing required "text" or "data" query parameter.' });
    }

    const size = Math.min(Math.max(parseInt(req.query.size, 10) || 256, 64), 1024);
    const format = (req.query.format || 'svg').toLowerCase();
    const margin = parseInt(req.query.margin, 10) || 2;

    const options = {
      width: size,
      margin: margin,
      color: {
        dark: req.query.dark || '#0f172a',
        light: req.query.light || '#ffffff'
      },
      errorCorrectionLevel: req.query.ecl || 'M'
    };

    if (format === 'svg') {
      const svg = await QRCode.toString(text, { ...options, type: 'svg' });
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(svg);
    }

    if (format === 'png') {
      const buffer = await QRCode.toBuffer(text, options);
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(buffer);
    }

    // Default to JSON with DataURL
    const dataUrl = await QRCode.toDataURL(text, options);
    return res.status(200).json({
      success: true,
      text,
      size,
      format,
      dataUrl,
      fallbackUrl: `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`
    });
  } catch (error) {
    if (logger && typeof logger.error === 'function') logger.error('QR Generation Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate QR code',
      error: error.message
    });
  }
});

/**
 * POST /api/qr/generate
 * Body params: { text, size, format, dark, light, ecl }
 */
router.post('/generate', async (req, res) => {
  try {
    const { text, data, size = 256, format = 'dataurl', dark = '#0f172a', light = '#ffffff', ecl = 'M' } = req.body;
    const payload = text || data;

    if (!payload) {
      return res.status(400).json({ success: false, message: 'Missing required payload in body (text or data).' });
    }

    const qrSize = Math.min(Math.max(parseInt(size, 10) || 256, 64), 1024);
    const options = {
      width: qrSize,
      margin: 2,
      color: { dark, light },
      errorCorrectionLevel: ecl
    };

    const dataUrl = await QRCode.toDataURL(payload, options);
    const svgString = await QRCode.toString(payload, { ...options, type: 'svg' });

    return res.status(200).json({
      success: true,
      text: payload,
      size: qrSize,
      dataUrl,
      svg: svgString,
      fallbackUrl: `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(payload)}`
    });
  } catch (error) {
    if (logger && typeof logger.error === 'function') logger.error('POST QR Generation Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate QR code',
      error: error.message
    });
  }
});

module.exports = router;

