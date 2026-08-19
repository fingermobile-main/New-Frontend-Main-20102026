const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Create a new event
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  eventController.createEvent,
);

// Get all events with optional search, filter, and pagination
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  eventController.getAllEvents,
);

// Get a single event by ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  eventController.getEventById,
);

// Update an event by ID
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  eventController.updateEvent,
);

// Delete an event by ID
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  eventController.deleteEvent,
);

module.exports = router;
