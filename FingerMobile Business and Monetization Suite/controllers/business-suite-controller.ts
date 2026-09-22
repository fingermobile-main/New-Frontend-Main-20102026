import { Request, Response } from 'express';
import { BusinessSuiteService } from '../services/business-suite-service';
import { 
  MonetizationApplication,
  BusinessVerification,
  PayoutAccount,
  PlatformConfig,
  EstimateRequest,
  EstimateResponse,
  OverviewResponse
} from '../shared/types';

// Initialize the service
const businessSuiteService = new BusinessSuiteService();

// Get all applications
export const getApplications = async (_req: Request, res: Response) => {
  try {
    const applications = await businessSuiteService.getApplications();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Create a new application
export const createApplication = async (req: Request, res: Response) => {
  try {
    const application: MonetizationApplication = req.body;
    const result = await businessSuiteService.submitApplication(application);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get application by ID
export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const application = await businessSuiteService.getApplication(id);
    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Update application
export const updateApplication = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const application: MonetizationApplication = req.body;
    const result = await businessSuiteService.updateApplication(id, application);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Delete application
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await businessSuiteService.deleteApplication(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get all business verifications
export const getBusinessVerifications = async (_req: Request, res: Response) => {
  try {
    const verifications = await businessSuiteService.getVerifications();
    res.json(verifications);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Create a new business verification
export const createBusinessVerification = async (req: Request, res: Response) => {
  try {
    const verification: BusinessVerification = req.body;
    const result = await businessSuiteService.submitVerification(verification);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get business verification by ID
export const getBusinessVerificationById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const verification = await businessSuiteService.getVerification(id);
    if (!verification) {
      res.status(404).json({ error: 'Verification not found' });
      return;
    }
    res.json(verification);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Update business verification
export const updateBusinessVerification = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const verification: BusinessVerification = req.body;
    const result = await businessSuiteService.updateVerification(id, verification);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Delete business verification
export const deleteBusinessVerification = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await businessSuiteService.deleteVerification(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get all payout accounts
export const getPayoutAccounts = async (_req: Request, res: Response) => {
  try {
    const accounts = await businessSuiteService.getPayoutAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Create a new payout account
export const createPayoutAccount = async (req: Request, res: Response) => {
  try {
    const account: PayoutAccount = req.body;
    const result = await businessSuiteService.createPayoutAccount(account);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get payout account by ID
export const getPayoutAccountById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const account = await businessSuiteService.getPayoutAccount(id);
    if (!account) {
      res.status(404).json({ error: 'Payout account not found' });
      return;
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Update payout account
export const updatePayoutAccount = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const account: PayoutAccount = req.body;
    const result = await businessSuiteService.updatePayoutAccount(id, account);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Delete payout account
export const deletePayoutAccount = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await businessSuiteService.deletePayoutAccount(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get overview data
export const getOverview = async (_req: Request, res: Response) => {
  try {
    const overview: OverviewResponse = await businessSuiteService.getOverview();
    res.json(overview);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get platform config
export const getPlatformConfig = async (_req: Request, res: Response) => {
  try {
    const config: PlatformConfig = await businessSuiteService.getConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Update platform config
export const updatePlatformConfig = async (req: Request, res: Response) => {
  try {
    const config: Partial<PlatformConfig> = req.body;
    const updatedConfig: PlatformConfig = await businessSuiteService.updateConfig(config);
    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Estimate revenue
export const estimate = async (req: Request, res: Response) => {
  try {
    const request: EstimateRequest = req.body;
    const result: EstimateResponse = await businessSuiteService.estimateRevenue(request);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};