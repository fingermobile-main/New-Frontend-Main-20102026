import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { 
  getOverview, 
  getSeshat, 
  getPrograms, 
  getEligibility, 
  estimate, 
  createApplication,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getBusinessVerifications,
  createBusinessVerification,
  getBusinessVerificationById,
  updateBusinessVerification,
  deleteBusinessVerification,
  getPayoutAccounts,
  createPayoutAccount,
  getPayoutAccountById,
  updatePayoutAccount,
  deletePayoutAccount,
  getPlatformConfig,
  updatePlatformConfig
} from './business-suite-controller';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.get('/overview', getOverview);
app.get('/seshat', getSeshat);
app.get('/programs', getPrograms);
app.get('/eligibility', getEligibility);
app.post('/estimate', estimate);
app.post('/application', createApplication);
app.get('/application/:id', getApplicationById);
app.put('/application/:id', updateApplication);
app.delete('/application/:id', deleteApplication);
app.get('/verifications', getBusinessVerifications);
app.post('/verification', createBusinessVerification);
app.get('/verification/:id', getBusinessVerificationById);
app.put('/verification/:id', updateBusinessVerification);
app.delete('/verification/:id', deleteBusinessVerification);
app.get('/payout-accounts', getPayoutAccounts);
app.post('/payout-account', createPayoutAccount);
app.get('/payout-account/:id', getPayoutAccountById);
app.put('/payout-account/:id', updatePayoutAccount);
app.delete('/payout-account/:id', deletePayoutAccount);
app.get('/config', getPlatformConfig);
app.put('/config', updatePlatformConfig);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;

// Export all controller functions
export {
  getOverview,
  getSeshat,
  getPrograms,
  getEligibility,
  estimate,
  createApplication,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getBusinessVerifications,
  createBusinessVerification,
  getBusinessVerificationById,
  updateBusinessVerification,
  deleteBusinessVerification,
  getPayoutAccounts,
  createPayoutAccount,
  getPayoutAccountById,
  updatePayoutAccount,
  deletePayoutAccount,
  getPlatformConfig,
  updatePlatformConfig
};