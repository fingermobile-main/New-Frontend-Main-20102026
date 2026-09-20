import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import apiRoutes from './routes/api-routes'; // Updated import path to point to the correct file
import './services/database'; // Import to initialize database connection

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware - using morgan instead of custom logger
app.use(morgan('combined'));

// API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware - removed unused _next parameter
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Using console.error directly instead of logger
  res.status(500).json({ error: 'Something went wrong!' });
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;