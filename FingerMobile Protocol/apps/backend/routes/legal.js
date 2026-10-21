/**
 * Legal & Compliance Router
 * FingerMobile Protocol™ - Legal, Compliance, Governance, Data Privacy & Support
 * Routes mounted at /api/legal
 */

const express = require('express');
const router = express.Router();
const LegalController = require('../controllers/LegalController');

// 1. Data Subject Requests (DSR - GDPR / NDPA 2023)
router.post('/dsr', LegalController.submitDSR);
router.get('/dsr', LegalController.getDSRs);
router.get('/dsr/:id', LegalController.getDSRById);

// 2. Account Deletion Requests
router.post('/account-deletion', LegalController.requestAccountDeletion);
router.get('/account-deletion', LegalController.getAccountDeletions);
router.get('/account-deletion/status', LegalController.getAccountDeletionStatus);

// 3. Contact Submissions
router.post('/contact', LegalController.submitContactMessage);
router.get('/contact', LegalController.getContactMessages);

// 4. Feedback Submissions
router.post('/feedback', LegalController.submitFeedback);
router.get('/feedback', LegalController.getFeedbackList);

// 5. Legal Documents & Platform Policies
router.get('/documents', LegalController.getLegalDocuments);
router.get('/documents/:slug', LegalController.getLegalDocumentBySlug);
router.put('/documents/:slug', LegalController.updateLegalDocument);

// 6. DMCA Takedown Requests
router.post('/dmca', LegalController.submitDMCARequest);
router.put('/dmca/:id/status', LegalController.updateDMCAStatus);

module.exports = router;
