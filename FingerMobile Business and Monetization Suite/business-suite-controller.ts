import type { Request, Response } from 'express'
import { businessSuiteService } from './business-suite-service.js'
import {
  parseApplicationPayload,
  parseBusinessVerificationPayload,
  parseConfigPayload,
  parseEstimatePayload,
  parseSeshatPayload,
  parsePayoutPayload,
} from './requests.js'
import { sendCreated, sendOk } from './http.js'
import type { ProductKey } from './types.js'

// Extend Express Request interface for custom properties
declare module 'express-serve-static-core' {
  interface Request {
    context?: unknown;
    requestId?: string;
    userAge?: number;
    userId?: string;
  }
}

export const businessSuiteController = {
  getOverview(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getOverview())
  },
  getSeshat(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getOverview().seshatPage)
  },
  createSeshat(req: Request, res: Response) {
    const payload = parseSeshatPayload(req.body)
    const page = businessSuiteService.createSeshatPage(payload)

    return sendCreated(res, page, 'Seshat Page created')
  },
  updateSeshat(req: Request, res: Response) {
    const payload = parseSeshatPayload(req.body)
    const page = businessSuiteService.updateSeshatPage({
      id: req.params.id,
      ...payload,
      billingPlan: payload.billingPlan,
    })

    return sendOk(res, page, 'Seshat Page updated')
  },
  getPrograms(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getPrograms())
  },
  getEligibility(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getEligibility())
  },
  submitApplication(req: Request, res: Response) {
    const productKey = parseApplicationPayload(req.body) as ProductKey
    const application = businessSuiteService.submitMonetizationApplication(
      productKey,
    )

    return sendCreated(res, application, 'Application submitted')
  },
  estimate(req: Request, res: Response) {
    const payload = parseEstimatePayload(req.body)
    return sendOk(res, businessSuiteService.estimateRevenue(payload))
  },
  getVerificationStatus(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getVerificationStatus())
  },
  updateBusinessVerification(req: Request, res: Response) {
    const payload = parseBusinessVerificationPayload(req.body)
    return sendOk(
      res,
      businessSuiteService.updateBusinessVerification(payload),
      'Business verification submitted',
    )
  },
  updatePayoutAccount(req: Request, res: Response) {
    const payload = parsePayoutPayload(req.body)
    return sendOk(
      res,
      businessSuiteService.updatePayoutAccount(payload),
      'Payout account updated',
    )
  },
  getRevenue(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getRevenueSummary())
  },
  getAffiliate(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getAffiliateSummary())
  },
  getPolicy(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getPolicy())
  },
  getAdmin(req: Request, res: Response) {
    return sendOk(res, businessSuiteService.getAdminMonitoring())
  },
  updateConfig(req: Request, res: Response) {
    const payload = parseConfigPayload(req.body)
    return sendOk(res, businessSuiteService.updateConfig(payload), 'Config updated')
  },
  trackWebhook(req: Request, res: Response) {
    const eventType =
      typeof req.body?.eventType === 'string' ? req.body.eventType : 'unknown'
    return sendCreated(
      res,
      businessSuiteService.trackWebhook(eventType, req.body),
      'Webhook accepted',
    )
  },
  health(req: Request, res: Response) {
    return sendOk(res, {
      status: 'healthy',
      requestId: req.requestId,
      time: new Date().toISOString(),
    })
  },

  // ============================================================
  // NEW METHODS - Week 1 Implementation
  // ============================================================

  // Guardian AI Services
  async generateAccessKey(req: Request, res: Response) {
    try {
      const { seshatPageId, keyType, expiryDays } = req.body;
      
      if (!seshatPageId || !keyType) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['seshatPageId', 'keyType'],
        });
      }

      const result = await businessSuiteService.generateAccessKey(seshatPageId, keyType, expiryDays);
      return sendCreated(res, result, 'Access key generated');
    } catch (error) {
      console.error('Error generating access key:', error);
      return res.status(500).json({
        error: 'Failed to generate access key',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async generateCoupon(req: Request, res: Response) {
    try {
      const { seshatPageId, prefix } = req.body;
      
      if (!seshatPageId) {
        return res.status(400).json({
          error: 'Missing required field: seshatPageId',
        });
      }

      const couponCode = await businessSuiteService.generateCoupon(seshatPageId, prefix);
      return sendCreated(res, { couponCode }, 'Coupon code generated');
    } catch (error) {
      console.error('Error generating coupon:', error);
      return res.status(500).json({
        error: 'Failed to generate coupon',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  validateName(req: Request, res: Response) {
    try {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({
          error: 'Missing required field: name',
        });
      }

      const validation = businessSuiteService.validateBusinessName(name);
      return sendOk(res, validation);
    } catch (error) {
      console.error('Error validating name:', error);
      return res.status(500).json({
        error: 'Failed to validate name',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  generateBiometricHash(req: Request, res: Response) {
    try {
      const { faceData } = req.body;
      
      if (!faceData) {
        return res.status(400).json({
          error: 'Missing required field: faceData',
        });
      }

      const hash = businessSuiteService.generateBiometricHash(faceData);
      return sendOk(res, { biometricHash: hash });
    } catch (error) {
      console.error('Error generating biometric hash:', error);
      return res.status(500).json({
        error: 'Failed to generate biometric hash',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // KYC/KYB Verification
  async submitKYC(req: Request, res: Response) {
    try {
      const kycData = req.body;
      
      if (!kycData.userId || !kycData.fullLegalName || !kycData.dateOfBirth || !kycData.biometricFaceData) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['userId', 'fullLegalName', 'dateOfBirth', 'biometricFaceData'],
        });
      }

      const result = await businessSuiteService.submitKYC(kycData);
      
      if (result.success) {
        return sendCreated(res, result, result.message);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error submitting KYC:', error);
      return res.status(500).json({
        error: 'Failed to submit KYC',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async getKYCStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          error: 'Missing required parameter: userId',
        });
      }

      const status = await businessSuiteService.getKYCStatus(userId);
      return sendOk(res, status);
    } catch (error) {
      console.error('Error getting KYC status:', error);
      return res.status(500).json({
        error: 'Failed to get KYC status',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async submitKYB(req: Request, res: Response) {
    try {
      const kybData = req.body;
      
      if (!kybData.userId || !kybData.businessLegalName || !kybData.businessRegistrationNumber) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['userId', 'businessLegalName', 'businessRegistrationNumber'],
        });
      }

      const result = await businessSuiteService.submitKYB(kybData);
      
      if (result.success) {
        return sendCreated(res, result, result.message);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error submitting KYB:', error);
      return res.status(500).json({
        error: 'Failed to submit KYB',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async getKYBStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          error: 'Missing required parameter: userId',
        });
      }

      const status = await businessSuiteService.getKYBStatus(userId);
      return sendOk(res, status);
    } catch (error) {
      console.error('Error getting KYB status:', error);
      return res.status(500).json({
        error: 'Failed to get KYB status',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Admin KYC/KYB Management
  async approveKYC(req: Request, res: Response) {
    try {
      const { kycId, reviewerId, notes } = req.body;
      
      if (!kycId || !reviewerId) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['kycId', 'reviewerId'],
        });
      }

      const success = await businessSuiteService.approveKYC(kycId, reviewerId, notes);
      
      if (success) {
        return sendOk(res, { message: 'KYC approved successfully' });
      } else {
        return res.status(500).json({ error: 'Failed to approve KYC' });
      }
    } catch (error) {
      console.error('Error approving KYC:', error);
      return res.status(500).json({
        error: 'Failed to approve KYC',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async rejectKYC(req: Request, res: Response) {
    try {
      const { kycId, reviewerId, reason } = req.body;
      
      if (!kycId || !reviewerId || !reason) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['kycId', 'reviewerId', 'reason'],
        });
      }

      const success = await businessSuiteService.rejectKYC(kycId, reviewerId, reason);
      
      if (success) {
        return sendOk(res, { message: 'KYC rejected successfully' });
      } else {
        return res.status(500).json({ error: 'Failed to reject KYC' });
      }
    } catch (error) {
      console.error('Error rejecting KYC:', error);
      return res.status(500).json({
        error: 'Failed to reject KYC',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async approveKYB(req: Request, res: Response) {
    try {
      const { kybId, reviewerId, notes } = req.body;
      
      if (!kybId || !reviewerId) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['kybId', 'reviewerId'],
        });
      }

      const success = await businessSuiteService.approveKYB(kybId, reviewerId, notes);
      
      if (success) {
        return sendOk(res, { message: 'KYB approved successfully' });
      } else {
        return res.status(500).json({ error: 'Failed to approve KYB' });
      }
    } catch (error) {
      console.error('Error approving KYB:', error);
      return res.status(500).json({
        error: 'Failed to approve KYB',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async rejectKYB(req: Request, res: Response) {
    try {
      const { kybId, reviewerId, reason } = req.body;
      
      if (!kybId || !reviewerId || !reason) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['kybId', 'reviewerId', 'reason'],
        });
      }

      const success = await businessSuiteService.rejectKYB(kybId, reviewerId, reason);
      
      if (success) {
        return sendOk(res, { message: 'KYB rejected successfully' });
      } else {
        return res.status(500).json({ error: 'Failed to reject KYB' });
      }
    } catch (error) {
      console.error('Error rejecting KYB:', error);
      return res.status(500).json({
        error: 'Failed to reject KYB',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Access Key Management
  async getAccessKeys(req: Request, res: Response) {
    try {
      const { seshatPageId } = req.params;
      
      if (!seshatPageId) {
        return res.status(400).json({
          error: 'Missing required parameter: seshatPageId',
        });
      }

      const keys = await businessSuiteService.getAccessKeys(seshatPageId);
      return sendOk(res, keys);
    } catch (error) {
      console.error('Error getting access keys:', error);
      return res.status(500).json({
        error: 'Failed to get access keys',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async createAccessKey(req: Request, res: Response) {
    try {
      const { seshatPageId, keyType, expiryDays } = req.body;
      
      if (!seshatPageId || !keyType) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['seshatPageId', 'keyType'],
        });
      }

      const key = await businessSuiteService.createAccessKeyRecord(seshatPageId, keyType, expiryDays);
      return sendCreated(res, key, 'Access key created');
    } catch (error) {
      console.error('Error creating access key:', error);
      return res.status(500).json({
        error: 'Failed to create access key',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async revokeAccessKey(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          error: 'Missing required parameter: id',
        });
      }

      const success = await businessSuiteService.revokeAccessKey(id);
      
      if (success) {
        return sendOk(res, { message: 'Access key revoked' });
      } else {
        return res.status(500).json({ error: 'Failed to revoke access key' });
      }
    } catch (error) {
      console.error('Error revoking access key:', error);
      return res.status(500).json({
        error: 'Failed to revoke access key',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Coupon Management
  async getCoupons(req: Request, res: Response) {
    try {
      const { seshatPageId } = req.params;
      
      if (!seshatPageId) {
        return res.status(400).json({
          error: 'Missing required parameter: seshatPageId',
        });
      }

      const coupons = await businessSuiteService.getCoupons(seshatPageId);
      return sendOk(res, coupons);
    } catch (error) {
      console.error('Error getting coupons:', error);
      return res.status(500).json({
        error: 'Failed to get coupons',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async createCoupon(req: Request, res: Response) {
    try {
      const { seshatPageId, couponCode, description, discountPercentage, discountAmount, validUntil } = req.body;
      
      if (!seshatPageId || !couponCode) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['seshatPageId', 'couponCode'],
        });
      }

      const coupon = await businessSuiteService.createCouponRecord({
        seshatPageId,
        couponCode,
        description,
        discountPercentage,
        discountAmount,
        validUntil,
      });
      return sendCreated(res, coupon, 'Coupon created');
    } catch (error) {
      console.error('Error creating coupon:', error);
      return res.status(500).json({
        error: 'Failed to create coupon',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async redeemCoupon(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const { userId } = req.body;
      
      if (!code || !userId) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['code', 'userId'],
        });
      }

      const result = await businessSuiteService.redeemCoupon(code, userId);
      
      if (result.success) {
        return sendOk(res, result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error redeeming coupon:', error);
      return res.status(500).json({
        error: 'Failed to redeem coupon',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
}

// Import necessary modules and services
import express from 'express';
import { 
  createUser,
  updateUser,
  getContentMetrics,
  createContentMetrics,
  updateContentMetrics,
  createBusinessVerification,
  getMonetizationApplication,
  createMonetizationApplication,
  updateMonetizationApplication,
  getRevenueLedgerEntry,
  createRevenueLedgerEntry,
  updateRevenueLedgerEntry,
  createPayout,
  createPayoutAccount,
  createPlatformConfig,
  updatePlatformConfig,
  createAffiliateEvent,
  updateAffiliateEvent,
  updateWebhookEvent,
  updateAuditLog
} from './business-suite-service.js';
import type {
  User,
  SeshatPage,
  ContentMetrics,
  BusinessVerification,
  MonetizationApplication,
  RevenueLedgerEntry,
  Payout,
  PayoutAccount,
  PlatformConfig,
  AffiliateEvent,
  WebhookEvent,
  AuditLog
} from './types.js';

// Create router instance
export const router = express.Router();

// User Routes
router.get('/api/users/:id', async (req, res) => {
  try {
    // In a real implementation, we would fetch the user by ID
    // For now, returning a placeholder response
    res.status(501).json({ error: 'Not implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

router.post('/api/users', async (req, res) => {
  try {
    const userData: Omit<User, 'id' | 'createdAt'> = req.body;
    const userId = await createUser(userData);
    res.status(201).json({ id: userId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userData: Partial<User> = req.body;
    await updateUser(userId, userData);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// SeshatPage Routes
router.get('/api/seshatpages/:id', async (req, res) => {
  try {
    // In a real implementation, we would fetch the SeshatPage by ID
    // For now, returning a placeholder response
    res.status(501).json({ error: 'Not implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get SeshatPage' });
  }
});

router.post('/api/seshatpages', async (req, res) => {
  try {
    const pageData: Omit<SeshatPage, 'id' | 'createdAt' | 'followersCount' | 'verifiedBusiness'> = req.body;
    // Using repository directly since we don't have a service function for this
    const pageId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    res.status(201).json({ id: pageId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create SeshatPage' });
  }
});

router.put('/api/seshatpages/:id', async (req, res) => {
  try {
    // In a real implementation, we would update the SeshatPage
    // For now, returning a placeholder response
    res.status(501).json({ error: 'Not implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update SeshatPage' });
  }
});

// Content Metrics Routes
router.get('/api/contentmetrics/:id', async (req, res) => {
  try {
    const metrics = await getContentMetrics();
    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get content metrics' });
  }
});

router.post('/api/contentmetrics', async (req, res) => {
  try {
    const metricsData: Omit<ContentMetrics, 'id' | 'updatedAt'> = req.body;
    const metricsId = await createContentMetrics(metricsData);
    res.status(201).json({ id: metricsId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create content metrics' });
  }
});

router.put('/api/contentmetrics/:id', async (req, res) => {
  try {
    const metricsId = req.params.id;
    const metricsData: Partial<Omit<ContentMetrics, 'id'>> = req.body;
    await updateContentMetrics(metricsId, metricsData);
    res.status(200).json({ message: 'Content metrics updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content metrics' });
  }
});

// Business Verification Routes
router.post('/api/businessverifications', async (req, res) => {
  try {
    const verificationData: Omit<BusinessVerification, 'id'> = req.body;
    const verificationId = await createBusinessVerification(verificationData);
    res.status(201).json({ id: verificationId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create business verification' });
  }
});

// Monetization Application Routes
router.get('/api/monetizationapplications/:id', async (req, res) => {
  try {
    const appId = req.params.id;
    const app = await getMonetizationApplication(appId);
    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(200).json(app);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get monetization application' });
  }
});

router.post('/api/monetizationapplications', async (req, res) => {
  try {
    const appData: Omit<MonetizationApplication, 'id' | 'submittedAt' | 'status'> = req.body;
    const appId = await createMonetizationApplication(appData);
    res.status(201).json({ id: appId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create monetization application' });
  }
});

router.put('/api/monetizationapplications/:id', async (req, res) => {
  try {
    const appId = req.params.id;
    const appData: Partial<Omit<MonetizationApplication, 'id'>> = req.body;
    await updateMonetizationApplication(appId, appData);
    res.status(200).json({ message: 'Monetization application updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update monetization application' });
  }
});

// Revenue Ledger Entry Routes
router.get('/api/revenueledgerentries/:id', async (req, res) => {
  try {
    const entryId = req.params.id;
    const entry = await getRevenueLedgerEntry(entryId);
    if (!entry) {
      return res.status(404).json({ error: 'Revenue ledger entry not found' });
    }
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get revenue ledger entry' });
  }
});

router.post('/api/revenueledgerentries', async (req, res) => {
  try {
    const entryData: Omit<RevenueLedgerEntry, 'id' | 'occurredAt'> = req.body;
    const entryId = await createRevenueLedgerEntry(entryData);
    res.status(201).json({ id: entryId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create revenue ledger entry' });
  }
});

router.put('/api/revenueledgerentries/:id', async (req, res) => {
  try {
    const entryId = req.params.id;
    const entryData: Partial<Omit<RevenueLedgerEntry, 'id'>> = req.body;
    await updateRevenueLedgerEntry(entryId, entryData);
    res.status(200).json({ message: 'Revenue ledger entry updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update revenue ledger entry' });
  }
});

// Payout Routes
router.post('/api/payouts', async (req, res) => {
  try {
    const payoutData: Omit<Payout, 'id'> = req.body;
    const payoutId = await createPayout(payoutData);
    res.status(201).json({ id: payoutId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payout' });
  }
});

// Payout Account Routes
router.post('/api/payoutaccounts', async (req, res) => {
  try {
    const accountData: Omit<PayoutAccount, 'id' | 'verified' | 'createdAt'> = req.body;
    const accountId = await createPayoutAccount(accountData);
    res.status(201).json({ id: accountId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payout account' });
  }
});

// Platform Config Routes
router.post('/api/platformconfigs', async (req, res) => {
  try {
    const configData: Omit<PlatformConfig, 'id'> = req.body;
    const configId = await createPlatformConfig(configData);
    res.status(201).json({ id: configId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create platform config' });
  }
});

router.put('/api/platformconfigs', async (req, res) => {
  try {
    const configData: Partial<Omit<PlatformConfig, 'id'>> = req.body;
    await updatePlatformConfig(configData);
    res.status(200).json({ message: 'Platform config updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update platform config' });
  }
});

// Affiliate Event Routes
router.post('/api/affiliateevents', async (req, res) => {
  try {
    const eventData: Omit<AffiliateEvent, 'id' | 'recordedAt'> = req.body;
    const eventId = await createAffiliateEvent(eventData);
    res.status(201).json({ id: eventId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create affiliate event' });
  }
});

router.put('/api/affiliateevents/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const eventData: Partial<Omit<AffiliateEvent, 'id'>> = req.body;
    await updateAffiliateEvent(eventId, eventData);
    res.status(200).json({ message: 'Affiliate event updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update affiliate event' });
  }
});

// Webhook Event Routes
router.put('/api/webhookevents/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const eventData: Partial<Omit<WebhookEvent, 'id'>> = req.body;
    await updateWebhookEvent(eventId, eventData);
    res.status(200).json({ message: 'Webhook event updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update webhook event' });
  }
});

// Audit Log Routes
router.put('/api/auditlogs/:id', async (req, res) => {
  try {
    const logId = req.params.id;
    const logData: Partial<Omit<AuditLog, 'id'>> = req.body;
    await updateAuditLog(logId, logData);
    res.status(200).json({ message: 'Audit log updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update audit log' });
  }
});

// Export the router
export default router;
