import express, { Request, Response } from 'express';
import EcommerceController from '../controllers/EcommerceController';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// Product routes
router.get('/products', EcommerceController.getAllProducts);
router.get('/products/:id', EcommerceController.getProductById);
router.post('/products', EcommerceController.createProduct);
router.put('/products/:id', EcommerceController.updateProduct);
router.delete('/products/:id', EcommerceController.deleteProduct);

// Order routes
router.get('/orders', EcommerceController.getAllOrders);
router.get('/orders/:id', EcommerceController.getOrderById);
router.put('/orders/:id', EcommerceController.updateOrder);
router.post('/orders/:id/process', EcommerceController.processOrder);
router.post('/orders/:id/fulfill', EcommerceController.fulfillOrder);

// Inventory routes
router.get('/inventory', EcommerceController.getInventoryLevels);

export default router;