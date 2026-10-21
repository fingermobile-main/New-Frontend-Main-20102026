/**
 * Unit Tests for Commerce Controller
 * FingerMobile Protocol™
 */

jest.mock('../../db', () => ({
  pool: { query: jest.fn() },
  query: jest.fn()
}));

const request = require('supertest');
const express = require('express');
const { pool } = require('../../db');
const commerceController = require('../../controllers/commerceController');

const app = express();
app.use(express.json());

// Mock authentication middleware
app.use((req, res, next) => {
  req.user = { id: 'test-user-id' };
  next();
});

// Routes
app.get('/api/commerce/products', commerceController.getProducts.bind(commerceController));
app.post('/api/commerce/products', commerceController.createProduct.bind(commerceController));
app.get('/api/commerce/cart', commerceController.getCart.bind(commerceController));
app.post('/api/commerce/cart/add', commerceController.addToCart.bind(commerceController));
app.post('/api/commerce/orders', commerceController.createOrder.bind(commerceController));
app.get('/api/commerce/orders', commerceController.getOrders.bind(commerceController));

describe('Commerce Controller Tests', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  describe('GET /api/commerce/products', () => {
    it('should return products with pagination', async () => {
      const mockProducts = {
        rows: [
          { id: '1', name: 'Product 1', price: 5000, stock_quantity: 10 },
          { id: '2', name: 'Product 2', price: 7500, stock_quantity: 5 }
        ]
      };

      pool.query.mockResolvedValue(mockProducts);

      const response = await request(app).get('/api/commerce/products?limit=10&offset=0');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    it('should filter products by category', async () => {
      const mockProducts = { rows: [] };
      pool.query.mockResolvedValue(mockProducts);

      const response = await request(app).get('/api/commerce/products?category=electronics');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/commerce/products', () => {
    it('should create a new product', async () => {
      const mockProduct = {
        rows: [{ id: 'new-product-id', name: 'New Product', price: 10000 }]
      };

      pool.query.mockResolvedValue(mockProduct);

      const response = await request(app)
        .post('/api/commerce/products')
        .send({
          name: 'New Product',
          description: 'Test product',
          price: 10000,
          stock_quantity: 20
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('New Product');
    });

    it('should return 400 if required fields missing', async () => {
      const response = await request(app)
        .post('/api/commerce/products')
        .send({ description: 'No name or price' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/commerce/cart', () => {
    it('should return user cart items', async () => {
      const mockCart = {
        rows: [
          { product_id: '1', product_name: 'Product 1', quantity: 2, price: 5000 }
        ]
      };

      pool.query.mockResolvedValue(mockCart);

      const response = await request(app).get('/api/commerce/cart');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });
  });

  describe('POST /api/commerce/cart/add', () => {
    it('should add item to cart', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ id: 'product-123', stock_quantity: 10 }] })
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/commerce/cart/add')
        .send({ product_id: 'product-123', quantity: 1 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 400 if product_id not provided', async () => {
      const response = await request(app)
        .post('/api/commerce/cart/add')
        .send({ quantity: 1 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/commerce/orders', () => {
    it('should create a new order', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ product_id: 'p1', quantity: 1, price: 15000, stock_quantity: 10 }] }) // Cart check
        .mockResolvedValueOnce({ rows: [{ id: 'order-123', total: 15000, status: 'pending' }] }) // Order insert
        .mockResolvedValueOnce({ rows: [] }) // Item insert
        .mockResolvedValueOnce({ rows: [] }) // Stock update
        .mockResolvedValueOnce({ rows: [] }); // Cart delete

      const response = await request(app)
        .post('/api/commerce/orders')
        .send({
          shipping_address: { street: '123 Main St', city: 'Lagos' },
          payment_method: 'card'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('pending');
    });
  });

  describe('GET /api/commerce/orders', () => {
    it('should return user orders', async () => {
      const mockOrders = {
        rows: [
          { id: 'order-1', total_amount: 15000, status: 'delivered' },
          { id: 'order-2', total_amount: 8000, status: 'shipped' }
        ]
      };

      pool.query.mockResolvedValue(mockOrders);

      const response = await request(app).get('/api/commerce/orders');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
    });
  });
});
