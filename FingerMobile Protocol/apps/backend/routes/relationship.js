const express = require('express');
const router = express.Router();

/**
 * GET /api/relationship/states/:targetUserId
 * Retrieve current relationship state and privacy configuration with target member
 */
router.get('/states/:targetUserId', (req, res) => {
  const { targetUserId } = req.params;
  return res.status(200).json({
    success: true,
    data: {
      targetUserId,
      state: 'CONNECTED',
      ghostMode: false,
      profileVisibility: 'STANDARD',
      contentVisibility: 'STANDARD'
    }
  });
});

/**
 * POST /api/relationship/transition
 * Transition relationship state Machine (Section 23)
 */
router.post('/transition', (req, res) => {
  const { targetUserId, newState } = req.body;
  const validStates = [
    'DISCOVERED', 'REQUESTED', 'PENDING', 'ACCEPTED',
    'CONNECTED', 'FOLLOWING', 'RESTRICTED', 'MUTED',
    'UNFOLLOWED', 'UNFRIENDED', 'BLOCKED'
  ];

  if (!targetUserId || !newState || !validStates.includes(newState)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid targetUserId or state transition'
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      targetUserId,
      previousState: 'CONNECTED',
      newState,
      updatedAt: new Date().toISOString()
    }
  });
});

/**
 * POST /api/relationship/ghost-mode
 * Toggle Ghost Mode privacy configuration (Section 24)
 */
router.post('/ghost-mode', (req, res) => {
  const { targetUserId, enabled } = req.body;
  return res.status(200).json({
    success: true,
    data: {
      targetUserId,
      ghostMode: Boolean(enabled),
      updatedAt: new Date().toISOString()
    }
  });
});

module.exports = router;
