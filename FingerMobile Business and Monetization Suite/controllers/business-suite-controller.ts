import { Request, Response } from 'express';
import { 
  BusinessSuiteOverview, 
  EstimateRequest, 
  EstimateResponse,
  ConfigUpdate,
  ApplicationRequest
} from '../shared/types';
import { getBusinessSuiteOverview } from '../services/business-suite-service';
import { getEligibility } from '../services/eligibility-service';
import { getEstimate } from '../services/estimate-service';
import { getVerification as getVerificationService } from '../services/verification-service';
import { getPayoutAccount as getPayoutAccountService } from '../services/payout-service';
import { getPlatformConfig, updatePlatformConfig } from '../services/config-service';
import { getAffiliateData } from '../services/affiliate-service';
import { getProgramDefinitions } from '../services/program-service';

// Define custom request type locally
interface BusinessSuiteRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Controller functions
export const getOverview = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const overview: BusinessSuiteOverview = await getBusinessSuiteOverview(userId);
    res.json(overview);
  } catch (error) {
    console.error('Error in getOverview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const calculateEligibility = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const eligibility = await getEligibility(userId);
    res.json(eligibility);
  } catch (error) {
    console.error('Error in calculateEligibility:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const calculateEstimate = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const { productKey, region, projectedVolume }: EstimateRequest = req.body;

    if (!productKey || !region || !projectedVolume) {
      return res.status(400).json({ error: 'Missing required fields: productKey, region, projectedVolume' });
    }

    const estimate: EstimateResponse = await getEstimate({
      productKey,
      region,
      projectedVolume
    });

    res.json(estimate);
  } catch (error) {
    console.error('Error in calculateEstimate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fixed: Removed unused req parameter
export const getVerification = async (_req: BusinessSuiteRequest, res: Response) => {
  try {
    // In a real implementation, you'd fetch the verification status
    // For now, returning a mock response
    const verification = await getVerificationService(); // Using aliased import
    res.json(verification);
  } catch (error) {
    console.error('Error in getVerification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fixed: Removed unused req parameter
export const getPayoutAccount = async (_req: BusinessSuiteRequest, res: Response) => {
  try {
    // In a real implementation, you'd fetch the payout account details
    // For now, returning a mock response
    const payoutAccount = await getPayoutAccountService(); // Using aliased import
    res.json(payoutAccount);
  } catch (error) {
    console.error('Error in getPayoutAccount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fixed: Removed unused req parameter
export const getConfig = async (_req: BusinessSuiteRequest, res: Response) => {
  try {
    const config = await getPlatformConfig();
    res.json(config);
  } catch (error) {
    console.error('Error in getConfig:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateConfig = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const configUpdate: ConfigUpdate = req.body;
    const updatedConfig = await updatePlatformConfig(configUpdate);
    res.json(updatedConfig);
  } catch (error) {
    console.error('Error in updateConfig:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fixed: Removed unused req parameter
export const getPrograms = async (_req: BusinessSuiteRequest, res: Response) => {
  try {
    const programs = await getProgramDefinitions();
    res.json(programs);
  } catch (error) {
    console.error('Error in getPrograms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fixed: Removed unused req parameter
export const getAffiliate = async (_req: BusinessSuiteRequest, res: Response) => {
  try {
    // In a real implementation, you'd fetch the affiliate data for the user
    // For now, returning a mock response
    const affiliateData = await getAffiliateData(); // Assuming this service function exists
    res.json(affiliateData);
  } catch (error) {
    console.error('Error in getAffiliate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitApplication = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { productKey }: ApplicationRequest = req.body;
    
    if (!productKey) {
      return res.status(400).json({ error: 'Missing productKey' });
    }

    // In a real implementation, you'd submit the application
    // For now, returning a mock response
    res.json({ success: true, message: 'Application submitted successfully', productKey });
  } catch (error) {
    console.error('Error in submitApplication:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  getOverview,
  calculateEligibility,
  calculateEstimate,
  getVerification,
  getPayoutAccount,
  getConfig,
  updateConfig,
  getPrograms,
  getAffiliate,
  submitApplication
};