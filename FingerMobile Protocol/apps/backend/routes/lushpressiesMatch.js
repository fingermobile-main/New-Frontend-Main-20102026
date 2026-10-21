/**
 * Lush Pressies Match Routes
 * Routes for Roll/Swipe Engine, Discovery Feed, AI Compatibility Scoring,
 * First-Contact Message Gate, and GeoTag Passport/Visa.
 * Date: September 29, 2026
 */

const express = require('express');
const router = express.Router();
const matchCtrl = require('../controllers/lushpressiesMatchingController');

// Roll (Like/Skip) Engine
router.post('/roll', matchCtrl.rollAction);
router.post('/reverse-roll', matchCtrl.reverseRoll);

// Discovery Feed (Radiate++ priority queue)
router.get('/discover', matchCtrl.discoverProfiles);

// First-Contact Message Gate (3 per 72h for free members)
router.post('/first-contact', matchCtrl.sendFirstContact);

// Qwen AI Compatibility Score
router.get('/compatibility/:targetUserId', matchCtrl.getCompatibilityScore);

// GeoTag Passport/Visa (global cross-border matching)
router.post('/passport', matchCtrl.setPassport);

module.exports = router;
