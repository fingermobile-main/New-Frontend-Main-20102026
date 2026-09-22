import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { 
  getApplications,
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
  getOverview,
  getPlatformConfig,
  updatePlatformConfig,
  estimate
} from './controllers/business-suite-controller';

const app = express();

// Middleware
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.get('/applications', getApplications);
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

app.get('/overview', getOverview);
app.get('/config', getPlatformConfig);
app.put('/config', updatePlatformConfig);

// Additional routes
app.post('/estimate', estimate);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: unknown) => {
  void _next;
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Catch-all route for undefined endpoints
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;