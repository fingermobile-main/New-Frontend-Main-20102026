const express = require('express');
const router = express.Router();

// Rate limit configuration routes
router.get('/', (req, res) => {
  res.json({
    success: true, message: 'Rate limit configuration endpoint', data: {
      global: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
      }
    }
  });
});

router.put('/', (req, res) => {
  res.json({
    success: true, message: 'Rate limit configuration updated'
  });
});

module.exports = router;
