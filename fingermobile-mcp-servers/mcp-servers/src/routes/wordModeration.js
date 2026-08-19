const express = require("express");
const router = express.Router();
const {
  getBlockedWords,
  addBlockedWords,
  removeBlockedWords,
  updateBlockedWords
} = require("../controllers/wordModerationController");

// Route to get all blocked words
router.get("/", getBlockedWords);

// Route to add new blocked words
router.post("/", addBlockedWords);

// Route to remove blocked words
router.delete("/", removeBlockedWords);

// Route to update blocked words (e.g., replace a word)
router.put("/", updateBlockedWords);

module.exports = router;
