// Import necessary modules
import express from 'express';
import cors from 'cors';
import { router as businessSuiteRouter } from './business-suite-controller.js';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount the business suite routes under /api
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, _next: Response) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the app
export default app;