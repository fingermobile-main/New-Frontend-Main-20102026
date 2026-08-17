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
app.use('/api', businessSuiteRouter);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch-all handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the app
export default app;