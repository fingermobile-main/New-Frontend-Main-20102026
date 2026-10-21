const express = require('express');
const router = express.Router();

/**
 * GET /api/organize-these/items
 * Retrieve member organized items by category
 */
router.get('/items', (req, res) => {
  const { category } = req.query;
  return res.status(200).json({
    success: true,
    data: {
      category: category || 'all',
      items: [
        {
          id: 'item-101',
          category: category || 'invoices',
          itemId: 'inv_001',
          itemMetadata: { amount: 150.0, currency: 'USD', status: 'UNPAID' },
          isPinned: true,
          priority: 1,
          createdAt: new Date().toISOString()
        }
      ]
    }
  });
});

/**
 * POST /api/organize-these/pin
 * Toggle pin status for a personal command center item
 */
router.post('/pin', (req, res) => {
  const { category, itemId, isPinned } = req.body;
  if (!category || !itemId) {
    return res.status(400).json({
      success: false,
      error: 'category and itemId are required'
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      category,
      itemId,
      isPinned: Boolean(isPinned),
      updatedAt: new Date().toISOString()
    }
  });
});

/**
 * POST /api/organize-these/otp-cleanup
 * Schedule automatic OTP / temporary item cleanup
 */
router.post('/otp-cleanup', (req, res) => {
  const { itemId, cleanupInHours = 24 } = req.body;
  const cleanupDate = new Date(Date.now() + cleanupInHours * 3600 * 1000).toISOString();

  return res.status(200).json({
    success: true,
    data: {
      itemId,
      autoCleanupScheduledAt: cleanupDate
    }
  });
});

module.exports = router;
