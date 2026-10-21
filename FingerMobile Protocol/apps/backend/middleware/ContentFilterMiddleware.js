/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

const configPath = path.join(__dirname, '../config/banned_words.json');
let filterConfig = { banned_words: [], banned_phrases: [], exempt_roles: [] };

try {
  const data = fs.readFileSync(configPath, 'utf8');
  filterConfig = JSON.parse(data);
} catch (error) {
  logger.logError(error, { action: 'load_banned_words_config', filePath: configPath });
}

const isExempt = (user) => {
  if (!user || !user.role) return false;
  return filterConfig.exempt_roles.includes(user.role);
};

// Advanced masking function that preserves punctuation but replaces letters with asterisks
const censorContent = (text) => {
  if (!text) return text;
  let censoredText = text;

  // Process phrases first
  for (const phrase of filterConfig.banned_phrases) {
    if (!phrase) continue;
    // escape regex characters in phrase just in case
    const safePhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${safePhrase}\\b`, 'gi');
    censoredText = censoredText.replace(regex, (match) => '*'.repeat(match.length));
  }

  // Process individual words
  for (const word of filterConfig.banned_words) {
    if (!word || word.trim().length === 0) continue;
    try {
      const safeWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${safeWord}\\b`, 'gi');
      censoredText = censoredText.replace(regex, (match) => '*'.repeat(match.length));
    } catch {
      // Skip invalid regex pattern safely
    }
  }

  return censoredText;
};

const contentFilterMiddleware = (req, res, next) => {
  // If the user has an exempt role, skip the filter
  if (isExempt(req.user)) {
    return next();
  }

  // Censor common content fields before they hit the database
  if (req.body.content) req.body.content = censorContent(req.body.content);
  if (req.body.text) req.body.text = censorContent(req.body.text);
  if (req.body.description) req.body.description = censorContent(req.body.description);
  if (req.body.title) req.body.title = censorContent(req.body.title);
  if (req.body.message) req.body.message = censorContent(req.body.message);

  next();
};

module.exports = {
  contentFilterMiddleware,
  censorContent
};
