const express = require('express');
const helpcenterController = require('../controllers/helpcenterController');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

// FAQ Routes (Public)
router.get('/faqs', helpcenterController.getFAQs.bind(helpcenterController));
router.get('/categories', helpcenterController.getCategories.bind(helpcenterController));

// FAQ Feedback (Protected)
router.post('/faqs/:id/feedback', authenticate, helpcenterController.submitFeedback.bind(helpcenterController));

// Support Ticket Routes (Protected)
router.post('/tickets', authenticate, helpcenterController.createTicket.bind(helpcenterController));
router.get('/tickets', authenticate, helpcenterController.getAllTickets.bind(helpcenterController));
router.get('/tickets/:id', authenticate, helpcenterController.getTicketById.bind(helpcenterController));
router.post('/tickets/:id/messages', authenticate, helpcenterController.addMessage.bind(helpcenterController));
router.put('/tickets/:id/status', authenticate, helpcenterController.updateStatus.bind(helpcenterController));

// Statistics (Admin only - add admin middleware as needed)
router.get('/stats', authenticate, helpcenterController.getStats.bind(helpcenterController));

module.exports = router;
