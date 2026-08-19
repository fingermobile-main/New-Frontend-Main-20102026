const fs = require("fs");
const path = require("path");

// Try multiple possible paths for the word list file
const possiblePaths = [
  path.join(__dirname, "..", "..", "FingerMobile Words Moderation List.txt"), // Current approach
  path.join(
    __dirname,
    "..",
    "..",
    "..",
    "FingerMobile Words Moderation List.txt",
  ), // From project root
  path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "FingerMobile Words Moderation List.txt",
  ), // From deeper
  path.join(process.cwd(), "FingerMobile Words Moderation List.txt"), // From current working directory
];

let BLOCKED_WORDS_FILE = "";
let found = false;

for (const filePath of possiblePaths) {
  if (fs.existsSync(filePath)) {
    BLOCKED_WORDS_FILE = filePath;
    found = true;
    break;
  }
}

// If no file is found, we'll use an empty list
if (!found) {
  console.log(
    "Word moderation file not found in any expected location. Using empty list.",
  );
  BLOCKED_WORDS_FILE = null; // Will result in empty list
}

let blockedWords = [];

// Load blocked words from the file
const loadBlockedWords = () => {
  if (!BLOCKED_WORDS_FILE) {
    console.log("Using empty blocked words list.");
    blockedWords = []; // Initialize with empty array if file doesn\'t exist
    return;
  }

  try {
    const data = fs.readFileSync(BLOCKED_WORDS_FILE, "utf8");
    blockedWords = data
      .split(",")
      .map((word) => word.trim().toLowerCase());
      .filter((word) => word.length > 0);
    console.log(`Loaded ${blockedWords.length} blocked words.`);
  } catch (error) {
    console.error("Error loading blocked words,
file:", error);
    console.log("Using empty blocked words list.");
    blockedWords = []; // Initialize with empty array if file doesn\'t exist
  }
};

// Initialize blocked words on module load
loadBlockedWords();

// Function to check if text contains blocked words
const containsBlockedWords = (text) => {
  if (!text) return false;
  const lowerCaseText = text.toLowerCase();
  for (const word of blockedWords) {
    if (lowerCaseText.includes(word)) {
      return true;
    }
  }
  return false;
};

// Function to sanitize text by replacing blocked words
const sanitizeText = (text, replacement = "***") => {
  if (!text) return "";
  let sanitizedText = text;
  const lowerCaseText = text.toLowerCase();
  for (const word of blockedWords) {
    const regex = new RegExp(`\b${word}\b`, "gi"); // 'gi' for global and case-insensitive
    sanitizedText = sanitizedText.replace(regex, replacement);
  }
  return sanitizedText;
};

module.exports = {
  containsBlockedWords,
  sanitizeText,
  loadBlockedWords, // Export for potential reloading if the file changes
};
