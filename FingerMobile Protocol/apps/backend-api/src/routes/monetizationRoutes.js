const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const lushMonetizationController = require('../controllers/lushMonetizationController');

// Get available products for purchase
router.get('/products', authenticateToken, async (req, res) => {
  try {
    const result = await lushMonetizationController.getAvailableProducts();

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Process a product purchase
router.post('/purchase', authenticateToken, async (req, res) => {
  try {
    const { productId, paymentMethodId } = req.body;
    const userId = req.user.id;

    const result = await lushMonetizationController.processPurchase(userId, productId, paymentMethodId);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send a gift to another user
router.post('/gift/send', authenticateToken, async (req, res) => {
  try {
    const { recipientId, giftId } = req.body;
    const userId = req.user.id;

    const result = await lushMonetizationController.sendGift(userId, recipientId, giftId);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's credit balance
router.get('/credits', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushMonetizationController.getUserCredits(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's purchase history
router.get('/purchases', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;

    const result = await lushMonetizationController.getUserPurchaseHistory(userId, parseInt(limit), parseInt(offset));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Spend user's credits on a feature
router.post('/credits/spend', authenticateToken, async (req, res) => {
  try {
    const { featureId, amount } = req.body;
    const userId = req.user.id;

    const result = await lushMonetizationController.spendCredits(userId, featureId, amount);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's gift inventory
router.get('/gifts/inventory', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await lushMonetizationController.getUserGiftInventory(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's received gifts
router.get('/gifts/received', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;

    const result = await lushMonetizationController.getReceivedGifts(userId, parseInt(limit), parseInt(offset));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a custom gift
router.post('/gifts/custom', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;
    const userId = req.user.id;

    const giftDetails = { name, description, price, imageUrl };

    const result = await lushMonetizationController.createCustomGift(userId, giftDetails);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trending gifts
router.get('/gifts/trending', authenticateToken, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await lushMonetizationController.getTrendingGifts(parseInt(limit));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Apply promo code
router.post('/promo/apply', authenticateToken, async (req, res) => {
  try {
    const { promoCode } = req.body;
    const userId = req.user.id;

    const result = await lushMonetizationController.applyPromoCode(userId, promoCode);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get monetization statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const result = await lushMonetizationController.getMonetizationStats();

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