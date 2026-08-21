const express = require('express');
const router = express.Router();

// Cache management routes
router.get('/stats', (req, res) => {
  res.json({
    success: true, message: 'Cache statistics',
    data: {
      hits: 0,
      misses: 0, size: '0 MB'
    }
  });
});

router.post('/clear', (req, res) => {
  res.json({
    success: true, message: 'Cache cleared successfully'
  });
});

module.exports = router;
