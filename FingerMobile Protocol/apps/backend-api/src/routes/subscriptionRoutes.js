const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const lushSubscriptionController = require('../controllers/lushSubscriptionController');

// Get available subscription plans
router.get('/plans', authenticateToken, async (req, res) => {
  try {
    const result = await lushSubscriptionController.getSubscriptionPlans();

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Subscribe user to a plan
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { planId, paymentMethodId } = req.body;
    const userId = req.user.id;

    const result = await lushSubscriptionController.subscribeUser(userId, planId, paymentMethodId);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's subscription details
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushSubscriptionController.getUserSubscription(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cancel user's subscription
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushSubscriptionController.cancelSubscription(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Change subscription plan (upgrade/downgrade)
router.patch('/plan', authenticateToken, async (req, res) => {
  try {
    const { newPlanId } = req.body;
    const userId = req.user.id;

    const result = await lushSubscriptionController.changeSubscriptionPlan(userId, newPlanId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check if user has specific subscription features
router.get('/features/:feature', authenticateToken, async (req, res) => {
  try {
    const { feature } = req.params;
    const userId = req.user.id;

    const result = await lushSubscriptionController.checkUserSubscriptionFeatures(userId, feature);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get subscription statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const result = await lushSubscriptionController.getSubscriptionStats();

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