const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const lushChatController = require('../controllers/lushChatController');

// Create a new conversation
router.post('/conversations', authenticateToken, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const userId = req.user.id;

    const result = await lushChatController.createConversation(userId, targetUserId);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send a message
router.post('/messages', authenticateToken, async (req, res) => {
  try {
    const { conversationId, content, type = 'text' } = req.body;
    const userId = req.user.id;

    const result = await lushChatController.sendMessage(userId, conversationId, content, type);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get conversation history
router.get('/conversations/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const result = await lushChatController.getConversationHistory(userId, conversationId, parseInt(limit), parseInt(offset));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's conversations
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0 } = req.query;

    const result = await lushChatController.getUserConversations(userId, parseInt(limit), parseInt(offset));

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a message
router.delete('/messages/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const result = await lushChatController.deleteMessage(userId, messageId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Block/unblock a conversation
router.patch('/conversations/:conversationId/block', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { block = true } = req.body;
    const userId = req.user.id;

    const result = await lushChatController.toggleBlockConversation(userId, conversationId, block);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Archive/unarchive a conversation
router.patch('/conversations/:conversationId/archive', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { archive = true } = req.body;
    const userId = req.user.id;

    const result = await lushChatController.toggleArchiveConversation(userId, conversationId, archive);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark messages as read
router.patch('/conversations/:conversationId/read', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const result = await lushChatController.markMessagesAsRead(userId, conversationId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user's online status
router.patch('/online-status', authenticateToken, async (req, res) => {
  try {
    const { isOnline } = req.body;
    const userId = req.user.id;

    const result = await lushChatController.updateUserOnlineStatus(userId, isOnline);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send typing indicator
router.post('/conversations/:conversationId/typing', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { isTyping } = req.body;
    const userId = req.user.id;

    const result = await lushChatController.sendTypingIndicator(userId, conversationId, isTyping);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get conversation statistics
router.get('/conversations/:conversationId/stats', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const result = await lushChatController.getConversationStats(userId, conversationId);

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