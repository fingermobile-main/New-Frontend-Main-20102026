const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const lushVerificationController = require('../controllers/lushVerificationController');

// Submit verification documents
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { verificationType, documents } = req.body;
    const userId = req.user.id;

    const result = await lushVerificationController.submitVerification(userId, verificationType, documents);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's verification status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushVerificationController.getUserVerificationStatus(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Initiate phone verification
router.post('/phone/initiate', authenticateToken, async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const userId = req.user.id;

    const result = await lushVerificationController.initiatePhoneVerification(userId, phoneNumber);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify phone number with code
router.post('/phone/verify', authenticateToken, async (req, res) => {
  try {
    const { phoneNumber, verificationCode } = req.body;
    const userId = req.user.id;

    const result = await lushVerificationController.verifyPhoneNumber(userId, phoneNumber, verificationCode);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Initiate email verification
router.post('/email/initiate', authenticateToken, async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user.id;

    const result = await lushVerificationController.initiateEmailVerification(userId, email);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify email with code
router.post('/email/verify', authenticateToken, async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    const userId = req.user.id;

    const result = await lushVerificationController.verifyEmail(userId, email, verificationCode);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get verification requirements
router.get('/requirements', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushVerificationController.getVerificationRequirements(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin route: Review verification
router.patch('/:verificationId/review', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { verificationId } = req.params;
    const { approve, notes = '' } = req.body;
    const adminId = req.user.id;

    const result = await lushVerificationController.reviewVerification(adminId, verificationId, approve, notes);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin route: Get verification requests for review
router.get('/pending', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await lushVerificationController.getVerificationRequestsForReview(parseInt(limit), parseInt(offset));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Resubmit verification after rejection
router.post('/resubmit', authenticateToken, async (req, res) => {
  try {
    const { verificationType, documents } = req.body;
    const userId = req.user.id;

    const result = await lushVerificationController.resubmitVerification(userId, verificationType, documents);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;