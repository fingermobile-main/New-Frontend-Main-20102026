const express = require('express');
const messagesController = require('../controllers/messagesController.js');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

// Get member's conversations
router.get('/conversations', authenticate, messagesController.getConversations);

// Get messages with a specific member
router.get('/conversations/:otherMemberId', authenticate, messagesController.getConversationMessages);

// Delete an entire conversation channel
router.delete('/conversations/:otherMemberId', authenticate, messagesController.deleteConversation);

// Send a new message
router.post('/', authenticate, messagesController.create);

// Get unread message count
router.get('/unread-count', authenticate, messagesController.getUnreadCount);

// Mark messages as read
router.post('/mark-as-read', authenticate, messagesController.markAsRead);

// Get a specific message
router.get('/:messageId', authenticate, messagesController.getById);

// Update a message (for editing)
router.put('/:messageId', authenticate, messagesController.update);

// Delete a message
router.delete('/:messageId', authenticate, messagesController.delete);

module.exports = router;
