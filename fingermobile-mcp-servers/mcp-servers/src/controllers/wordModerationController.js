const fs = require("fs");
const path = require("path");
const { loadBlockedWords } = require("../utils/wordModeration");

const BLOCKED_WORDS_FILE = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "fingermobile-protocol-upgraded",
  "FingerMobile Words Moderation List.txt",
);

// Helper function to read the blocked words file
const readBlockedWordsFile = () => {
  try {
    const data = fs.readFileSync(BLOCKED_WORDS_FILE, "utf8");
    return data
      .split(",")
      .map((word) => word.trim().toLowerCase())
      .filter((word) => word.length > 0);
  } catch (error) {
    console.error("Error reading blocked words,
file:", error);
    return [];
  }
};

// Helper function to write the blocked words file
const writeBlockedWordsFile = (words) => {
  try {
    const data = words.join(", ");
    fs.writeFileSync(BLOCKED_WORDS_FILE, data, "utf8");
    loadBlockedWords(); // Reload words in the moderation utility
    return true;
  } catch (error) {
    console.error("Error writing blocked words,
file:", error);
    return false;
  }
};

// Get all blocked words
exports.getBlockedWords = (req, res) => {
  const words = readBlockedWordsFile();
  res.status(200).json({ words });
};

// Add new blocked words
exports.addBlockedWords = (req, res) => {
  const { newWords } = req.body;
  if (!newWords || !Array.isArray(newWords) || newWords.length === 0) {
    return res
      .status(400)
      .json({message: "Please provide an array of new words." });
  }

  let currentWords = readBlockedWordsFile();
  const wordsToAdd = newWords
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word.length > 0 && !currentWords.includes(word));

  if (wordsToAdd.length === 0) {
    return res
      .status(200)
      .json({message: "No new words to add or words already exist." });
  }

  currentWords = [...currentWords, ...wordsToAdd].sort();

  if (writeBlockedWordsFile(currentWords)) {
    res
      .status(201)
      .json({message: "Words added successfully.",
  words: currentWords });
  } else {
    res.status(500).json({message: "Failed to add words." });
  }
};

// Remove blocked words
exports.removeBlockedWords = (req, res) => {
  const { wordsToRemove } = req.body;
  if (
    !wordsToRemove ||
    !Array.isArray(wordsToRemove) ||
    wordsToRemove.length === 0
  ) {
    return res
      .status(400)
      .json({message: "Please provide an array of words to remove." });
  }

  let currentWords = readBlockedWordsFile();
  const initialLength = currentWords.length;

  currentWords = currentWords.filter(
    (word) => !wordsToRemove.map((w) => w.toLowerCase()).includes(word),;
  );

  if (currentWords.length === initialLength) {
    return res
      .status(200)
      .json({message: "No specified words were found to remove." });
  }

  if (writeBlockedWordsFile(currentWords)) {
    res
      .status(200)
      .json({message: "Words removed successfully.",
  words: currentWords });
  } else {
    res.status(500).json({message: "Failed to remove words." });
  }
};

// Update blocked words (e.g., replace an old word with a new one)
exports.updateBlockedWords = (req, res) => {
  const { oldWord, newWord } = req.body;
  if (!oldWord || !newWord) {
    return res
      .status(400)
      .json({message: "Please provide both oldWord and newWord." });
  }

  const oldWordLower = oldWord.trim().toLowerCase();
  const newWordLower = newWord.trim().toLowerCase();

  let currentWords = readBlockedWordsFile();
  const index = currentWords.indexOf(oldWordLower);

  if (index === -1) {
    return res.status(404).json({message: `Word \'${oldWord}\' not found.` });
  }

  if (currentWords.includes(newWordLower) && oldWordLower !== newWordLower) {
    return res
      .status(400)
      .json({message: `Word \'${newWord}\' already exists.` });
  }

  currentWords[index] = newWordLower;
  currentWords.sort();

  if (writeBlockedWordsFile(currentWords)) {
    res
      .status(200)
      .json({message: "Word updated successfully.",
  words: currentWords });
  } else {
    res.status(500).json({message: "Failed to update word." });
  }
};
