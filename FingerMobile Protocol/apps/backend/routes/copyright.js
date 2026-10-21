const express = require('express');
const router = express.Router();

/**
 * POST /api/copyright/evaluate
 * Evaluate 4-Factor Fair Use Index and return DMCA Disclaimer
 */
router.post('/evaluate', (req, res) => {
  const { contentId, purposeCharacter = 0.5, natureOfWork = 0.5, amountSubstantiality = 0.5, marketEffect = 0.5 } = req.body;

  const fairUseIndex = Number(
    (0.3 * Number(purposeCharacter) + 0.2 * Number(natureOfWork) + 0.25 * Number(amountSubstantiality) + 0.25 * Number(marketEffect)).toFixed(2)
  );

  const disclaimerText = `No copyright is claimed in [${contentId || 'content copied'}] and to the extent that material may appear to be infringed, I assert that such alleged infringement is permissible under fair use principles in U.S. copyright laws. If you believe material has been used in an unauthorized manner, please contact the poster.`;

  return res.status(200).json({
    success: true,
    data: {
      contentId: contentId || 'demo-content',
      fairUseIndex,
      qualifiesFairUse: fairUseIndex >= 0.60,
      disclaimerText,
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * POST /api/copyright/accept-policy
 * Log user acceptance of Copyright & AI Fair Use Compliance Policy
 */
router.post('/accept-policy', (req, res) => {
  const { userId } = req.body;
  return res.status(200).json({
    success: true,
    data: {
      userId: userId || 'demo-user',
      accepted: true,
      agreedAt: new Date().toISOString()
    }
  });
});

module.exports = router;
