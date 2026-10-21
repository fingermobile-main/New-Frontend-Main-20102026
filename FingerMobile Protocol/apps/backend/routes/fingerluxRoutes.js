const express = require('express');
const controller = require('../controllers/fingerluxController');
const router = express.Router();

// --- Auctions & Marketplace Fallbacks ---
router.get('/auctions', controller.getAll);
router.get('/auctions/:auctionId', controller.getById);
router.post('/auctions', controller.create);
router.post('/auctions/:auctionId/bids', controller.create);
router.get('/wishlist', controller.getAll);
router.post('/wishlist', controller.create);
router.get('/cart', controller.getAll);
router.post('/cart', controller.create);

// --- FingerLux All-In-One Scheduling & Booking Engine ---
// Services & Offerings
router.get('/services', (req, res) => controller.getServices(req, res));
router.post('/services', (req, res) => controller.createService(req, res));

// Bookings & Calendar
router.get('/bookings', (req, res) => controller.getBookings(req, res));
router.post('/bookings', (req, res) => controller.createBooking(req, res));
router.patch('/bookings/:id/attendance', (req, res) => controller.updateAttendance(req, res));

// Staff & Working Hours
router.get('/staff', (req, res) => controller.getStaff(req, res));
router.patch('/staff/:id/hours', (req, res) => controller.updateStaffHours(req, res));

// Resources & Locations
router.get('/resources', (req, res) => controller.getResources(req, res));
router.get('/locations', (req, res) => controller.getLocations(req, res));

// Blocked Time & Availability
router.get('/blocked-slots', (req, res) => controller.getBlockedSlots(req, res));
router.post('/blocked-slots', (req, res) => controller.createBlockedSlot(req, res));

// Waitlists
router.get('/waitlist', (req, res) => controller.getWaitlist(req, res));
router.post('/waitlist', (req, res) => controller.addToWaitlist(req, res));
router.post('/waitlist/:id/promote', (req, res) => controller.promoteWaitlist(req, res));

// Payments, POS & Invoicing
router.post('/pos/charge', (req, res) => controller.processPOS(req, res));
router.post('/invoices', (req, res) => controller.createInvoice(req, res));

// AI Assistant Operations
router.post('/ai-setup', (req, res) => controller.generateAISetup(req, res));

// Digital Programs & Memberships
router.get('/programs', (req, res) => controller.getPrograms(req, res));

// Legacy compatibility
router.get('/categories', controller.getAll);

module.exports = router;
