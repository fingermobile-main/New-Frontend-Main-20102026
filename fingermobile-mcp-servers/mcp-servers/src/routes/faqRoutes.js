const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Route to get all FAQ articles
router.get("/", faqController.getAllFaqs);

// Route to get a specific FAQ article by ID
router.get("/:id", faqController.getFaqById);

// Route to create a new FAQ article (admin only)
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin"]),
  faqController.createFaq,
);

// Route to update an FAQ article (admin only)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  faqController.updateFaq,
);

// Route to delete an FAQ article (admin only)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  faqController.deleteFaq,
);

module.exports = router;
