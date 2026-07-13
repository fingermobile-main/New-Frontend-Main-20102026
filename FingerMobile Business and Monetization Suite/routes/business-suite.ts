import { Router } from 'express'
import { businessSuiteController } from '../business-suite-controller.js'

const router = Router()

// Health check
router.get('/health', businessSuiteController.health)

// Overview
router.get('/overview', businessSuiteController.getOverview)

// Seshat
router.get('/seshat', businessSuiteController.getSeshat)
router.post('/seshat', businessSuiteController.createSeshat)
router.put('/seshat/:id', businessSuiteController.updateSeshat)

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

// ============================================================
// NEW ROUTES - Week 1 Implementation
// ============================================================

// Guardian AI Services
router.post('/guardian/access-key', businessSuiteController.generateAccessKey)
router.post('/guardian/coupon', businessSuiteController.generateCoupon)
router.post('/guardian/validate-name', businessSuiteController.validateName)
router.post('/guardian/biometric-hash', businessSuiteController.generateBiometricHash)

// KYC/KYB Verification
router.post('/kyc/submit', businessSuiteController.submitKYC)
router.get('/kyc/status/:userId', businessSuiteController.getKYCStatus)
router.post('/kyb/submit', businessSuiteController.submitKYB)
router.get('/kyb/status/:userId', businessSuiteController.getKYBStatus)

// Admin KYC/KYB Management
router.post('/admin/kyc/approve', businessSuiteController.approveKYC)
router.post('/admin/kyc/reject', businessSuiteController.rejectKYC)
router.post('/admin/kyb/approve', businessSuiteController.approveKYB)
router.post('/admin/kyb/reject', businessSuiteController.rejectKYB)

// Access Key Management
router.get('/access-keys/:seshatPageId', businessSuiteController.getAccessKeys)
router.post('/access-keys', businessSuiteController.createAccessKey)
router.delete('/access-keys/:id', businessSuiteController.revokeAccessKey)

// Coupon Management
router.get('/coupons/:seshatPageId', businessSuiteController.getCoupons)
router.post('/coupons', businessSuiteController.createCoupon)
router.post('/coupons/:code/redeem', businessSuiteController.redeemCoupon)

export default router
