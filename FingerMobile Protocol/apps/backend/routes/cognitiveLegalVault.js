/**
 * Cognitive-Legal Vault Router
 * FingerMobile Protocol™ - Cognitive-Legal OS, Feedback Anticipation, NDPA/Cybercrimes Vault & BeatwaveNG Tax-Shield
 * Routes mounted at /api/v1/vault
 */

const express = require('express');
const feedbackAnticipationController = require('../controllers/feedbackAnticipationController');
const legalVaultController = require('../controllers/legalVaultController');
const beatwaveTaxController = require('../controllers/beatwaveTaxController');

const router = express.Router();

// ============================================================================
// 1. Feedback Anticipation & Cognitive Optimization
// ============================================================================
router.post('/anticipation/interactions', feedbackAnticipationController.recordInteraction);
router.get('/anticipation/stochastic-reward', feedbackAnticipationController.getStochasticReward);
router.post('/anticipation/cognitive-load', feedbackAnticipationController.evaluateCognitiveLoad);
router.get('/anticipation/notifications/peripheral', feedbackAnticipationController.getPeripheralNotifications);

// ============================================================================
// 2. Legal Vault: Defamation & Content ID (Cybercrimes Act 2024)
// ============================================================================
router.post('/legal/defamation-score', legalVaultController.scoreDefamationRisk);
router.post('/legal/content-id/fingerprint', legalVaultController.registerContentFingerprint);
router.post('/legal/notice-action/takedown', legalVaultController.submitNoticeTakedown);
router.post('/legal/notice-action/appeal', legalVaultController.appealNoticeTakedown);

// ============================================================================
// 3. Child Protection Layer (NDPA 2023 Sec 31)
// ============================================================================
router.post('/legal/child-protection/consent', legalVaultController.recordChildConsent);
router.get('/legal/child-protection/status/:userId', legalVaultController.getChildProtectionStatus);

// ============================================================================
// 4. Data Portability & Cascading Erasure (NDPA Sec 34)
// ============================================================================
router.post('/archive/request', legalVaultController.requestDataPortability);
router.get('/archive/status/:requestId', legalVaultController.getDataPortabilityStatus);
router.get('/archive/download/:requestId', legalVaultController.downloadDataPortabilityArchive);
router.post('/archive/erasure', legalVaultController.requestDataErasure);

// ============================================================================
// 5. DPO Circuit Breaker Kill-Switch & CAR Audit
// ============================================================================
router.post('/dpo/killswitch/trigger', legalVaultController.triggerKillSwitch);
router.post('/dpo/killswitch/recover', legalVaultController.recoverKillSwitch);
router.get('/dpo/audit/car-report', legalVaultController.getCARAuditReport);

// ============================================================================
// 6. BeatwaveNG Proof of Play & 2026 Fiscal Tax Shield
// ============================================================================
router.post('/beatwave/pop/pulse', beatwaveTaxController.recordStreamPulse);
router.post('/beatwave/curation/mine', beatwaveTaxController.mineCuration);
router.get('/beatwave/tax/summary/:creatorId', beatwaveTaxController.getTaxSummary);

module.exports = router;
