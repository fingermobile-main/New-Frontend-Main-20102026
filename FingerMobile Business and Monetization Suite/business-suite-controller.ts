import { Request, Response } from 'express';
import { BusinessSuiteService } from './business-suite-service';
import { 
  parseApplicationPayload, 
  parseBusinessVerificationPayload,
  parsePayoutAccountPayload,
  parsePlatformConfigPayload,
  parseEstimatePayload
} from './parsers';
import { sendOk, sendCreated, sendNoContent } from './utils/response-utils';
import { ApplicationPayload, BusinessVerificationPayload, PayoutAccountPayload, PlatformConfigPayload, EstimatePayload } from './requests';
import { EstimateRequest } from './types';

const businessSuiteService = new BusinessSuiteService();

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

export const estimate = async (_req: Request, res: Response) => {
  const payload = _req.body as EstimatePayload;
  const request: EstimateRequest = parseEstimatePayload(payload);
  
  const result = await businessSuiteService.estimateRevenue(request);
  sendOk(res, result);
};

export const createApplication = async (_req: Request, res: Response) => {
  const payload = _req.body as ApplicationPayload;
  const application = parseApplicationPayload(payload);
  
  const result = await businessSuiteService.createApplication(application);
  sendCreated(res, result);
};

export const getApplicationById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await businessSuiteService.getApplicationById(id);
  sendOk(res, result);
};

export const updateApplication = async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body as ApplicationPayload;
  const application = parseApplicationPayload(payload);
  
  const result = await businessSuiteService.updateApplication(id, application);
  sendOk(res, result);
};

export const deleteApplication = async (req: Request, res: Response) => {
  const id = req.params.id;
  await businessSuiteService.deleteApplication(id);
  sendNoContent(res);
};

export const getBusinessVerifications = async (_req: Request, res: Response) => {
  const result = await businessSuiteService.getBusinessVerifications();
  sendOk(res, result);
};

export const createBusinessVerification = async (_req: Request, res: Response) => {
  const payload = _req.body as BusinessVerificationPayload;
  const verification = parseBusinessVerificationPayload(payload);
  
  const result = await businessSuiteService.createBusinessVerification(verification);
  sendCreated(res, result);
};

export const getBusinessVerificationById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await businessSuiteService.getBusinessVerificationById(id);
  sendOk(res, result);
};

export const updateBusinessVerification = async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body as BusinessVerificationPayload;
  const verification = parseBusinessVerificationPayload(payload);
  
  const result = await businessSuiteService.updateBusinessVerification(id, verification);
  sendOk(res, result);
};

export const deleteBusinessVerification = async (req: Request, res: Response) => {
  const id = req.params.id;
  await businessSuiteService.deleteBusinessVerification(id);
  sendNoContent(res);
};

export const getPayoutAccounts = async (_req: Request, res: Response) => {
  const result = await businessSuiteService.getPayoutAccounts();
  sendOk(res, result);
};

export const createPayoutAccount = async (_req: Request, res: Response) => {
  const payload = _req.body as PayoutAccountPayload;
  const account = parsePayoutAccountPayload(payload);
  
  const result = await businessSuiteService.createPayoutAccount(account);
  sendCreated(res, result);
};

export const getPayoutAccountById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await businessSuiteService.getPayoutAccountById(id);
  sendOk(res, result);
};

export const updatePayoutAccount = async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body as PayoutAccountPayload;
  const account = parsePayoutAccountPayload(payload);
  
  const result = await businessSuiteService.updatePayoutAccount(id, account);
  sendOk(res, result);
};

export const deletePayoutAccount = async (req: Request, res: Response) => {
  const id = req.params.id;
  await businessSuiteService.deletePayoutAccount(id);
  sendNoContent(res);
};

export const getPlatformConfig = async (_req: Request, res: Response) => {
  const result = await businessSuiteService.getPlatformConfig();
  sendOk(res, result);
};

export const updatePlatformConfig = async (_req: Request, res: Response) => {
  const payload = _req.body as PlatformConfigPayload;
  const config = parsePlatformConfigPayload(payload);
  
  const result = await businessSuiteService.updatePlatformConfig(config);
  sendOk(res, result);
};