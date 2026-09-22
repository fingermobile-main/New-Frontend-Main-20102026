import express from 'express';
import type { Request, Response } from 'express';

const app = express();
const PORT = 3003;

app.use(express.json());

// Import service classes we created earlier
import { VerificationService } from './services/verification-service.js';
import { RevenueService } from './services/revenue-service.js';
import { AffiliateService } from './services/affiliate-service.js';
import { AdminService } from './services/admin-service.js';

// Verification routes
app.get('/api/verification/status/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const status = await VerificationService.getStatus(userId);
    res.status(200).json({ success: true, data: status });
  } catch (error) {
    console.error('Error in getVerificationStatus:', error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, message });
  }
});

app.post('/api/verification/update', async (req: Request, res: Response) => {
  try {
    const { userId, status, notes } = req.body;
    await VerificationService.updateStatus(userId, status, notes);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in updateVerificationStatus:', error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, message });
  }
});

// Revenue routes
app.get('/api/revenue/report', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await RevenueService.generateReport(startDate as string, endDate as string);
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error in getRevenueReport:', error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, message });
  }
});

app.get('/api/revenue/by-source', async (_req: Request, res: Response) => {
  try {
    const sources = await RevenueService.getRevenueBySource();
    res.status(200).json({ success: true, data: sources });
  } catch (error) {
    console.error('Error in getRevenueBySource:', error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, message });
  }
});

// Affiliate routes
app.get('/api/affiliate/stats/:affiliateId', async (req: Request, res: Response) => {
  try {
    const { affiliateId } = req.params;
    const stats = await AffiliateService.getStats(affiliateId);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('Error in getAffiliateStats:', error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, message });
  }
});

// Admin routes
app.get('/api/admin/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await AdminService.getPlatformStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('Error in getAdminStats:', error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, message });
  }
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Business Suite is running on port ${PORT}`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔐 Verification API available at http://localhost:${PORT}/api/verification`);
  console.log(`💰 Revenue API available at http://localhost:${PORT}/api/revenue`);
  console.log(`🤝 Affiliate API available at http://localhost:${PORT}/api/affiliate`);
  console.log(`⚙️  Admin API available at http://localhost:${PORT}/api/admin`);
});