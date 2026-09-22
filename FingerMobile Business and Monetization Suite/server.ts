import express from 'express';
import { router } from './business-suite-controller.js';

const app = express();
const PORT = 3003;

app.use(express.json());

// Mount the business suite routes
app.use(router);

// Add a basic health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Business Suite Controller is running' });
});

// Basic error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  void _next;
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404s
app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Business Suite Controller is running on port ${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/docs`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
});