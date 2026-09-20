import type { Request, Response } from 'express'
import { businessSuiteService } from './business-suite-service.js'
import {
  parseApplicationPayload,
  parseEstimatePayload,
  parseSeshatPayload,
} from './requests.js'
import { sendCreated, sendOk } from './http.js'
import type { ProductKey } from './types.js'
import { VerificationService } from './services/verification-service.js'
import { RevenueService } from './services/revenue-service.js'
import { AffiliateService } from './services/affiliate-service.js'
import { AdminService } from './services/admin-service.js'
import { monetizationService } from './services/monetization-service.js'
import { hallmarkService } from './services/hallmark-service.js'
import { seshatService } from './services/seshat-service.js'

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
  getApplications: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  createApplication: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  getApplicationById: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  updateApplication: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  deleteApplication: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  getBusinessVerifications: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  createBusinessVerification: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  getBusinessVerificationById: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  updateBusinessVerification: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  deleteBusinessVerification: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  getConfig: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  updateConfig: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  getEstimates: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  createEstimate: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  getEstimateById: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  updateEstimate: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  deleteEstimate: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  getPayouts: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  createPayout: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  getPayoutById: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  updatePayout: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  deletePayout: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  getProducts: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  createProduct: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  getProductById: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  updateProduct: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  deleteProduct: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  getComplianceReport: (req: Request, res: Response) => {
    // Placeholder implementation
    res.status(501).json({ error: 'Not implemented' });
  },
  getAuditLogs: (req: Request, res: Response) => {
    try {
      const logs: unknown[] = []; // Define type explicitly
      res.status(200).json({ success: true, data: logs });
    } catch (_error: unknown) {
      console.error('Error in getAuditLogs:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },
  getVerificationStatus: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const status = await VerificationService.getStatus(userId);
      res.status(200).json({ success: true, data: status });
    } catch (_error: unknown) {
      console.error('Error in getVerificationStatus:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  updateVerificationStatus: async (req: Request, res: Response) => {
    try {
      const { userId, status, notes } = req.body;
      await VerificationService.updateStatus(userId, status, notes);
      res.status(200).json({ success: true });
    } catch (_error: unknown) {
      console.error('Error in updateVerificationStatus:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getAllVerifications: async (req: Request, res: Response) => {
    try {
      const verifications = await VerificationService.getAll();
      res.status(200).json({ success: true, data: verifications });
    } catch (_error: unknown) {
      console.error('Error in getAllVerifications:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  createVerification: async (req: Request, res: Response) => {
    try {
      const verificationData = req.body;
      const newVerification = await VerificationService.create(verificationData);
      res.status(201).json({ success: true, data: newVerification });
    } catch (_error: unknown) {
      console.error('Error in createVerification:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  updateVerification: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedVerification = await VerificationService.update(id, updateData);
      res.status(200).json({ success: true, data: updatedVerification });
    } catch (_error: unknown) {
      console.error('Error in updateVerification:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  deleteVerification: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await VerificationService.delete(id);
      res.status(200).json({ success: true });
    } catch (_error: unknown) {
      console.error('Error in deleteVerification:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getRevenueReport: async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;
      const report = await RevenueService.generateReport(startDate as string, endDate as string);
      res.status(200).json({ success: true, data: report });
    } catch (_error: unknown) {
      console.error('Error in getRevenueReport:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getRevenueBySource: async (req: Request, res: Response) => {
    try {
      const sources = await RevenueService.getRevenueBySource();
      res.status(200).json({ success: true, data: sources });
    } catch (_error: unknown) {
      console.error('Error in getRevenueBySource:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getMonthlyRevenue: async (req: Request, res: Response) => {
    try {
      const monthlyData = await RevenueService.getMonthlyRevenue();
      res.status(200).json({ success: true, data: monthlyData });
    } catch (_error: unknown) {
      console.error('Error in getMonthlyRevenue:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getTopPerformingProducts: async (req: Request, res: Response) => {
    try {
      const products = await RevenueService.getTopPerformingProducts();
      res.status(200).json({ success: true, data: products });
    } catch (_error: unknown) {
      console.error('Error in getTopPerformingProducts:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getRevenueProjection: async (req: Request, res: Response) => {
    try {
      const projection = await RevenueService.getProjectedRevenue();
      res.status(200).json({ success: true, data: projection });
    } catch (_error: unknown) {
      console.error('Error in getRevenueProjection:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getAffiliateStats: async (req: Request, res: Response) => {
    try {
      const { affiliateId } = req.params;
      const stats = await AffiliateService.getStats(affiliateId);
      res.status(200).json({ success: true, data: stats });
    } catch (_error: unknown) {
      console.error('Error in getAffiliateStats:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getAffiliateCommissions: async (req: Request, res: Response) => {
    try {
      const { affiliateId } = req.params;
      const commissions = await AffiliateService.getCommissions(affiliateId);
      res.status(200).json({ success: true, data: commissions });
    } catch (_error: unknown) {
      console.error('Error in getAffiliateCommissions:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getAffiliatePerformance: async (req: Request, res: Response) => {
    try {
      const performance = await AffiliateService.getOverallPerformance();
      res.status(200).json({ success: true, data: performance });
    } catch (_error: unknown) {
      console.error('Error in getAffiliatePerformance:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getAffiliateList: async (req: Request, res: Response) => {
    try {
      const affiliates = await AffiliateService.getAllAffiliates();
      res.status(200).json({ success: true, data: affiliates });
    } catch (_error: unknown) {
      console.error('Error in getAffiliateList:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  createAffiliate: async (req: Request, res: Response) => {
    try {
      const affiliateData = req.body;
      const newAffiliate = await AffiliateService.createAffiliate(affiliateData);
      res.status(201).json({ success: true, data: newAffiliate });
    } catch (_error: unknown) {
      console.error('Error in createAffiliate:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  updateAffiliate: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedAffiliate = await AffiliateService.update(id, updateData);
      res.status(200).json({ success: true, data: updatedAffiliate });
    } catch (_error: unknown) {
      console.error('Error in updateAffiliate:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  deleteAffiliate: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await AffiliateService.delete(id);
      res.status(200).json({ success: true });
    } catch (_error: unknown) {
      console.error('Error in deleteAffiliate:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getAdminStats: async (req: Request, res: Response) => {
    try {
      const stats = await AdminService.getPlatformStats();
      res.status(200).json({ success: true, data: stats });
    } catch (_error: unknown) {
      console.error('Error in getAdminStats:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getSystemHealth: async (req: Request, res: Response) => {
    try {
      const health = await AdminService.getSystemHealth();
      res.status(200).json({ success: true, data: health });
    } catch (_error: unknown) {
      console.error('Error in getSystemHealth:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getPlatformMetrics: async (req: Request, res: Response) => {
    try {
      const metrics = await AdminService.getPlatformMetrics();
      res.status(200).json({ success: true, data: metrics });
    } catch (_error: unknown) {
      console.error('Error in getPlatformMetrics:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getMonetizationOverview: async (req: Request, res: Response) => {
    try {
      const overview = await monetizationService.getOverview();
      res.status(200).json({ success: true, data: overview });
    } catch (_error: unknown) {
      console.error('Error in getMonetizationOverview:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getMonetizationTrends: async (req: Request, res: Response) => {
    try {
      const trends = await monetizationService.getTrends();
      res.status(200).json({ success: true, data: trends });
    } catch (_error: unknown) {
      console.error('Error in getMonetizationTrends:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getMonetizationBreakdown: async (req: Request, res: Response) => {
    try {
      const breakdown = await monetizationService.getBreakdown();
      res.status(200).json({ success: true, data: breakdown });
    } catch (_error: unknown) {
      console.error('Error in getMonetizationBreakdown:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getMonetizationForecast: async (req: Request, res: Response) => {
    try {
      const forecast = await monetizationService.getForecast();
      res.status(200).json({ success: true, data: forecast });
    } catch (_error: unknown) {
      console.error('Error in getMonetizationForecast:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getHallmarks: async (req: Request, res: Response) => {
    try {
      const hallmarks = await hallmarkService.getAll();
      res.status(200).json({ success: true, data: hallmarks });
    } catch (_error: unknown) {
      console.error('Error in getHallmarks:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getHallmarkById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const hallmark = await hallmarkService.getById(id);
      res.status(200).json({ success: true, data: hallmark });
    } catch (_error: unknown) {
      console.error('Error in getHallmarkById:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  createHallmark: async (req: Request, res: Response) => {
    try {
      const hallmarkData = req.body;
      const newHallmark = await hallmarkService.create(hallmarkData);
      res.status(201).json({ success: true, data: newHallmark });
    } catch (_error: unknown) {
      console.error('Error in createHallmark:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  updateHallmark: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedHallmark = await hallmarkService.update(id, updateData);
      res.status(200).json({ success: true, data: updatedHallmark });
    } catch (_error: unknown) {
      console.error('Error in updateHallmark:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  deleteHallmark: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await hallmarkService.delete(id);
      res.status(200).json({ success: true });
    } catch (_error: unknown) {
      console.error('Error in deleteHallmark:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  getSeshatData: async (req: Request, res: Response) => {
    try {
      const seshatData = await seshatService.getData();
      res.status(200).json({ success: true, data: seshatData });
    } catch (_error: unknown) {
      console.error('Error in getSeshatData:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  },

  updateSeshatData: async (req: Request, res: Response) => {
    try {
      const updateData = req.body;
      await seshatService.updateData(updateData);
      res.status(200).json({ success: true });
    } catch (_error: unknown) {
      console.error('Error in updateSeshatData:', _error);
      const message = _error instanceof Error ? _error.message : String(_error);
      res.status(500).json({ success: false, message });
    }
  }
}; // End of businessSuiteController object

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
  updateAffiliateEvent
} from './business-suite-service.js';
import type {
  User,
  ContentMetrics,
  BusinessVerification,
  MonetizationApplication,
  RevenueLedgerEntry,
  Payout,
  PayoutAccount,
  PlatformConfig,
  AffiliateEvent
} from './types.js';

// Create router instance
export const router = express.Router();

// User Routes
router.get('/api/users/:id', async (req, res) => {
  try {
    // In a real implementation, we would fetch the user by ID
    // For now, returning a placeholder response
    res.status(501).json({ error: 'Not implemented' });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

router.post('/api/users', async (req, res) => {
  try {
    const userData: Omit<User, 'id' | 'createdAt'> = req.body;
    const userId = await createUser(userData);
    res.status(201).json({ id: userId });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

router.put('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userData: Partial<User> = req.body;
    await updateUser(userId, userData);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

// SeshatPage Routes
router.get('/api/seshatpages/:id', async (req, res) => {
  try {
    // In a real implementation, we would fetch the SeshatPage by ID
    // For now, returning a placeholder response
    res.status(501).json({ error: 'Not implemented' });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

router.post('/api/seshatpages', async (req, res) => {
  try {
    // Using repository directly since we don't have a service function for this
    const pageId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    res.status(201).json({ id: pageId });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

router.put('/api/seshatpages/:id', async (req, res) => {
  try {
    // In a real implementation, we would update the SeshatPage
    // For now, returning a placeholder response
    res.status(501).json({ error: 'Not implemented' });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

// Content Metrics Routes
router.get('/api/contentmetrics/:id', async (req, res) => {
  try {
    const metrics = await getContentMetrics();
    res.status(200).json(metrics);
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

router.post('/api/contentmetrics', async (req, res) => {
  try {
    const metricsData: Omit<ContentMetrics, 'id' | 'updatedAt'> = req.body;
    const metricsId = await createContentMetrics(metricsData);
    res.status(201).json({ id: metricsId });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

router.put('/api/contentmetrics/:id', async (req, res) => {
  try {
    const metricsId = req.params.id;
    const metricsData: Partial<Omit<ContentMetrics, 'id'>> = req.body;
    await updateContentMetrics(metricsId, metricsData);
    res.status(200).json({ message: 'Content metrics updated successfully' });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

// Business Verification Routes
router.post('/api/businessverifications', async (req, res) => {
  try {
    const verificationData: Omit<BusinessVerification, 'id'> = req.body;
    const verificationId = await createBusinessVerification(verificationData);
    res.status(201).json({ id: verificationId });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
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
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

router.post('/api/monetizationapplications', async (req, res) => {
  try {
    const appData: Omit<MonetizationApplication, 'id' | 'submittedAt' | 'status'> = req.body;
    const appId = await createMonetizationApplication(appData);
    res.status(201).json({ id: appId });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

router.put('/api/monetizationapplications/:id', async (req, res) => {
  try {
    const appId = req.params.id;
    const appData: Partial<Omit<MonetizationApplication, 'id'>> = req.body;
    await updateMonetizationApplication(appId, appData);
    res.status(200).json({ message: 'Monetization application updated successfully' });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
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
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

router.post('/api/revenueledgerentries', async (req, res) => {
  try {
    const entryData: Omit<RevenueLedgerEntry, 'id' | 'occurredAt'> = req.body;
    const entryId = await createRevenueLedgerEntry(entryData);
    res.status(201).json({ id: entryId });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

router.put('/api/revenueledgerentries/:id', async (req, res) => {
  try {
    const entryId = req.params.id;
    const entryData: Partial<Omit<RevenueLedgerEntry, 'id'>> = req.body;
    await updateRevenueLedgerEntry(entryId, entryData);
    res.status(200).json({ message: 'Revenue ledger entry updated successfully' });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

// Payout Routes
router.post('/api/payouts', async (req, res) => {
  try {
    const payoutData: Omit<Payout, 'id'> = req.body;
    const payoutId = await createPayout(payoutData);
    res.status(201).json({ id: payoutId });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

// Payout Account Routes
router.post('/api/payoutaccounts', async (req, res) => {
  try {
    const accountData: Omit<PayoutAccount, 'id' | 'verified' | 'createdAt'> = req.body;
    const accountId = await createPayoutAccount(accountData);
    res.status(201).json({ id: accountId });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

// Platform Config Routes
router.post('/api/platformconfigs', async (req, res) => {
  try {
    const configData: Omit<PlatformConfig, 'id'> = req.body;
    const configId = await createPlatformConfig(configData);
    res.status(201).json({ id: configId });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

router.put('/api/platformconfigs', async (req, res) => {
  try {
    const configData: Partial<Omit<PlatformConfig, 'id'>> = req.body;
    await updatePlatformConfig(configData);
    res.status(200).json({ message: 'Platform config updated successfully' });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

// Affiliate Event Routes
router.post('/api/affiliateevents', async (req, res) => {
  try {
    const eventData: Omit<AffiliateEvent, 'id' | 'recordedAt'> = req.body;
    const eventId = await createAffiliateEvent(eventData);
    res.status(201).json({ id: eventId });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});

router.put('/api/affiliateevents/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const eventData: Partial<Omit<AffiliateEvent, 'id'>> = req.body;
    await updateAffiliateEvent(eventId, eventData);
    res.status(200).json({ message: 'Affiliate event updated successfully' });
  } catch (_error: unknown) {
    const message = _error instanceof Error ? _error.message : String(_error);
    res.status(500).json({ error: message });
  }
});