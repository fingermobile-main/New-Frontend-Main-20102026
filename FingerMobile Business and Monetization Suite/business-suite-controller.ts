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
    try {
      const userId = req.params.userId;
      const status = await VerificationService.getStatus(userId);
      res.status(200).json({ success: true, data: status });
    } catch (error: any) {
      console.error('Error in getVerificationStatus:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateVerificationStatus(req: Request, res: Response) {
    try {
      const { userId, status, notes } = req.body;
      await VerificationService.updateStatus(userId, status, notes);
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error in updateVerificationStatus:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllVerifications(req: Request, res: Response) {
    try {
      const verifications = await VerificationService.getAll();
      res.status(200).json({ success: true, data: verifications });
    } catch (error: any) {
      console.error('Error in getAllVerifications:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createVerification(req: Request, res: Response) {
    try {
      const verificationData = req.body;
      const newVerification = await VerificationService.create(verificationData);
      res.status(201).json({ success: true, data: newVerification });
    } catch (error: any) {
      console.error('Error in createVerification:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateVerification(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedVerification = await VerificationService.update(id, updateData);
      res.status(200).json({ success: true, data: updatedVerification });
    } catch (error: any) {
      console.error('Error in updateVerification:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteVerification(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await VerificationService.delete(id);
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error in deleteVerification:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getRevenueReport(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const report = await RevenueService.generateReport(startDate as string, endDate as string);
      res.status(200).json({ success: true, data: report });
    } catch (error: any) {
      console.error('Error in getRevenueReport:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getRevenueBySource(req: Request, res: Response) {
    try {
      const sources = await RevenueService.getRevenueBySource();
      res.status(200).json({ success: true, data: sources });
    } catch (error: any) {
      console.error('Error in getRevenueBySource:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getMonthlyRevenue(req: Request, res: Response) {
    try {
      const monthlyData = await RevenueService.getMonthlyRevenue();
      res.status(200).json({ success: true, data: monthlyData });
    } catch (error: any) {
      console.error('Error in getMonthlyRevenue:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getTopPerformingProducts(req: Request, res: Response) {
    try {
      const products = await RevenueService.getTopPerformingProducts();
      res.status(200).json({ success: true, data: products });
    } catch (error: any) {
      console.error('Error in getTopPerformingProducts:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getRevenueProjection(req: Request, res: Response) {
    try {
      const projection = await RevenueService.getProjectedRevenue();
      res.status(200).json({ success: true, data: projection });
    } catch (error: any) {
      console.error('Error in getRevenueProjection:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAffiliateStats(req: Request, res: Response) {
    try {
      const { affiliateId } = req.params;
      const stats = await AffiliateService.getStats(affiliateId);
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      console.error('Error in getAffiliateStats:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAffiliateCommissions(req: Request, res: Response) {
    try {
      const { affiliateId } = req.params;
      const commissions = await AffiliateService.getCommissions(affiliateId);
      res.status(200).json({ success: true, data: commissions });
    } catch (error: any) {
      console.error('Error in getAffiliateCommissions:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAffiliatePerformance(req: Request, res: Response) {
    try {
      const performance = await AffiliateService.getOverallPerformance();
      res.status(200).json({ success: true, data: performance });
    } catch (error: any) {
      console.error('Error in getAffiliatePerformance:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAffiliateList(req: Request, res: Response) {
    try {
      const affiliates = await AffiliateService.getAllAffiliates();
      res.status(200).json({ success: true, data: affiliates });
    } catch (error: any) {
      console.error('Error in getAffiliateList:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createAffiliate(req: Request, res: Response) {
    try {
      const affiliateData = req.body;
      const newAffiliate = await AffiliateService.create(affiliateData);
      res.status(201).json({ success: true, data: newAffiliate });
    } catch (error: any) {
      console.error('Error in createAffiliate:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateAffiliate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedAffiliate = await AffiliateService.update(id, updateData);
      res.status(200).json({ success: true, data: updatedAffiliate });
    } catch (error: any) {
      console.error('Error in updateAffiliate:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteAffiliate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await AffiliateService.delete(id);
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error in deleteAffiliate:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAdminStats(req: Request, res: Response) {
    try {
      const stats = await AdminService.getPlatformStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      console.error('Error in getAdminStats:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getSystemHealth(req: Request, res: Response) {
    try {
      const health = await AdminService.getSystemHealth();
      res.status(200).json({ success: true, data: health });
    } catch (error: any) {
      console.error('Error in getSystemHealth:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getPlatformMetrics(req: Request, res: Response) {
    try {
      const metrics = await AdminService.getPlatformMetrics();
      res.status(200).json({ success: true, data: metrics });
    } catch (error: any) {
      console.error('Error in getPlatformMetrics:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getMonetizationOverview(req: Request, res: Response) {
    try {
      const overview = await MonetizationService.getOverview();
      res.status(200).json({ success: true, data: overview });
    } catch (error: any) {
      console.error('Error in getMonetizationOverview:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getMonetizationTrends(req: Request, res: Response) {
    try {
      const trends = await MonetizationService.getTrends();
      res.status(200).json({ success: true, data: trends });
    } catch (error: any) {
      console.error('Error in getMonetizationTrends:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getMonetizationBreakdown(req: Request, res: Response) {
    try {
      const breakdown = await MonetizationService.getBreakdown();
      res.status(200).json({ success: true, data: breakdown });
    } catch (error: any) {
      console.error('Error in getMonetizationBreakdown:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getMonetizationForecast(req: Request, res: Response) {
    try {
      const forecast = await MonetizationService.getForecast();
      res.status(200).json({ success: true, data: forecast });
    } catch (error: any) {
      console.error('Error in getMonetizationForecast:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getHallmarks(req: Request, res: Response) {
    try {
      const hallmarks = await HallmarkService.getAll();
      res.status(200).json({ success: true, data: hallmarks });
    } catch (error: any) {
      console.error('Error in getHallmarks:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getHallmarkById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const hallmark = await HallmarkService.getById(id);
      res.status(200).json({ success: true, data: hallmark });
    } catch (error: any) {
      console.error('Error in getHallmarkById:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createHallmark(req: Request, res: Response) {
    try {
      const hallmarkData = req.body;
      const newHallmark = await HallmarkService.create(hallmarkData);
      res.status(201).json({ success: true, data: newHallmark });
    } catch (error: any) {
      console.error('Error in createHallmark:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateHallmark(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedHallmark = await HallmarkService.update(id, updateData);
      res.status(200).json({ success: true, data: updatedHallmark });
    } catch (error: any) {
      console.error('Error in updateHallmark:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteHallmark(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await HallmarkService.delete(id);
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error in deleteHallmark:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getSeshatData(req: Request, res: Response) {
    try {
      const seshatData = await SeshatService.getData();
      res.status(200).json({ success: true, data: seshatData });
    } catch (error: any) {
      console.error('Error in getSeshatData:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateSeshatData(req: Request, res: Response) {
    try {
      const updateData = req.body;
      await SeshatService.updateData(updateData);
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error in updateSeshatData:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
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
