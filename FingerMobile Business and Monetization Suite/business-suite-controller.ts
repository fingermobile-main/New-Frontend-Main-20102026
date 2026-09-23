import express, { Request, Response } from 'express';
import { BusinessSuiteService } from './services/business-suite-service';
import { 
  parseApplicationPayload, 
  parseBusinessVerificationPayload,
  parsePayoutAccountPayload,
  parsePlatformConfigPayload,
  parseEstimatePayload
} from './parsers';
import { sendOk, sendCreated } from './utils/response-utils';
import { EstimateRequest } from './types'; // Added missing import

// Initialize the service
const businessSuiteService = new BusinessSuiteService();

// Remove the unused getBusinessSuiteService function
// const getBusinessSuiteService = (): BusinessSuiteService => {
//   return new BusinessSuiteService();
// };

export const getOverview = async (_req: Request, res: Response) => {
  const result = await businessSuiteService.getOverview();
  sendOk(res, result);
};

export const getSeshat = async (_req: Request, res: Response) => {
  const result = await businessSuiteService.getSeshat();
  sendOk(res, result);
};

export const getPrograms = async (_req: Request, res: Response) => {
  const result = await businessSuiteService.getPrograms();
  sendOk(res, result);
};

export const getEligibility = async (_req: Request, res: Response) => {
  const result = await businessSuiteService.getEligibility();
  sendOk(res, result);
};

export const estimateRevenue = async (req: Request, res: Response) => {
  const request = parseEstimatePayload(req.body) as EstimateRequest;
  const result = await businessSuiteService.estimateRevenue(request);
  sendOk(res, result);
};

export const submitApplication = async (req: Request, res: Response) => {
  const application = parseApplicationPayload(req.body);
  const result = await businessSuiteService.createApplication(application);
  sendCreated(res, result);
};

export const getApplication = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await businessSuiteService.getApplication(id);
  if (result) {
    sendOk(res, result);
  } else {
    res.status(404).send({ error: 'Application not found' });
  }
};

export const getBusinessVerifications = async (_req: Request, res: Response) => {
  const result = await businessSuiteService.getBusinessVerifications();
  sendOk(res, result);
};

export const getBusinessVerification = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await businessSuiteService.getBusinessVerification(id);
  if (result) {
    sendOk(res, result);
  } else {
    res.status(404).send({ error: 'Verification not found' });
  }
};

export const submitBusinessVerification = async (req: Request, res: Response) => {
  const verification = parseBusinessVerificationPayload(req.body);
  const result = await businessSuiteService.createBusinessVerification(verification);
  sendCreated(res, result);
};

export const getPayoutAccounts = async (_req: Request, res: Response) => {
  const result = await businessSuiteService.getPayoutAccountByUserId(''); // Need to pass userId
  sendOk(res, result);
};

export const getPayoutAccount = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await businessSuiteService.getPayoutAccountById(id);
  if (result) {
    sendOk(res, result);
  } else {
    res.status(404).send({ error: 'Payout account not found' });
  }
};

export const createPayoutAccount = async (req: Request, res: Response) => {
  const account = parsePayoutAccountPayload(req.body);
  const result = await businessSuiteService.createPayoutAccount(account);
  sendCreated(res, result);
};

export const getPlatformConfig = async (_req: Request, res: Response) => {
  const result = await businessSuiteService.getPlatformConfig();
  sendOk(res, result);
};

export const updatePlatformConfig = async (req: Request, res: Response) => {
  const config = parsePlatformConfigPayload(req.body);
  const result = await businessSuiteService.updatePlatformConfig(config);
  sendOk(res, result);
};

export const getAffiliateEvents = async (_req: Request, res: Response) => {
  const result = await businessSuiteService.getAffiliateEvents();
  sendOk(res, result);
};

export const getAffiliateMetrics = async (_req: Request, res: Response) => {
  const result = await businessSuiteService.getAffiliateMetrics();
  sendOk(res, result);
};

export const getRevenueLedgerEntries = async (_req: Request, res: Response) => {
  const result = await businessSuiteService.getRevenueLedgerEntries();
  sendOk(res, result);
};

// Export the router
export const router = (() => {

  const router = express.Router();
  
  router.get('/overview', getOverview);
  router.get('/seshat', getSeshat);
  router.get('/programs', getPrograms);
  router.get('/eligibility', getEligibility);
  router.post('/estimate-revenue', estimateRevenue);
  router.post('/application', submitApplication);
  router.get('/application/:id', getApplication);
  router.get('/verifications', getBusinessVerifications);
  router.get('/verification/:id', getBusinessVerification);
  router.post('/verification', submitBusinessVerification);
  router.get('/payout-accounts', getPayoutAccounts);
  router.get('/payout-account/:id', getPayoutAccount);
  router.post('/payout-account', createPayoutAccount);
  router.get('/config', getPlatformConfig);
  router.put('/config', updatePlatformConfig);
  router.get('/affiliate/events', getAffiliateEvents);
  router.get('/affiliate/metrics', getAffiliateMetrics);
  router.get('/revenue-ledger', getRevenueLedgerEntries);

  return router;
})();