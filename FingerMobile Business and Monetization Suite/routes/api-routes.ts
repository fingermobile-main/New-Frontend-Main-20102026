import express from 'express';
import businessSuiteRouter from './business-suite';

const router = express.Router();

// Mount all business suite routes
router.use('/', businessSuiteRouter);

export default router;