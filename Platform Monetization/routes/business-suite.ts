import { Router } from 'express'
import { businessSuiteController } from '../business-suite-controller.js'

const router = Router()

// Health check
router.get('/health', businessSuiteController.health)

// Overview
router.get('/overview', businessSuiteController.getOverview)

// Hallmarks
router.get('/hallmarks', businessSuiteController.getHallmarks)
router.post('/hallmarks', businessSuiteController.createHallmark)
router.put('/hallmarks/:id', businessSuiteController.updateHallmark)

// Programs & Eligibility
router.get('/programs', businessSuiteController.getPrograms)
router.get('/eligibility', businessSuiteController.getEligibility)

// Applications
router.post('/applications', businessSuiteController.submitApplication)

// Revenue Estimation
router.post('/estimate', businessSuiteController.estimate)

// Verification
router.get('/verification', businessSuiteController.getVerificationStatus)
router.put('/verification', businessSuiteController.updateBusinessVerification)

// Payout
router.put('/payout', businessSuiteController.updatePayoutAccount)

// Revenue & Affiliate
router.get('/revenue', businessSuiteController.getRevenue)
router.get('/affiliate', businessSuiteController.getAffiliate)

// Policy & Admin
router.get('/policy', businessSuiteController.getPolicy)
router.get('/admin', businessSuiteController.getAdmin)
router.put('/config', businessSuiteController.updateConfig)

// Webhooks
router.post('/webhook', businessSuiteController.trackWebhook)

export default router
