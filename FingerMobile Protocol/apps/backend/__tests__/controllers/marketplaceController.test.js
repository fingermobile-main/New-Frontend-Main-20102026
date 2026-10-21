/**
 * Unit Tests for Marketplace Controllers
 * FingerMobile Protocol™
 */

jest.mock('../../db', () => ({
  pool: { query: jest.fn() },
  query: jest.fn()
}));

const request = require('supertest');
const express = require('express');
const fingerluxController = require('../../controllers/fingerluxController');
const storefrontController = require('../../controllers/storefrontController');
const { pool } = require('../../db');

describe('Marketplace Controllers Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.user = { id: 'test-user-id' };
      next();
    });
    pool.query.mockReset();
  });

  describe('FingerLux Controller', () => {
    beforeEach(() => {
      app.get('/api/fingerlux/items', fingerluxController.getItems.bind(fingerluxController));
      app.post('/api/fingerlux/items', fingerluxController.createItem.bind(fingerluxController));
      app.post('/api/fingerlux/items/:id/review', fingerluxController.addReview.bind(fingerluxController));
    });

    it('should get luxury items', async () => {
      const mockItems = {
        rows: [
          { id: '1', title: 'Designer Watch', price: 150000, brand: 'Rolex' }
        ]
      };
      pool.query.mockResolvedValue(mockItems);

      const response = await request(app).get('/api/fingerlux/items?category=watches');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });

    it('should create luxury item listing', async () => {
      const mockItem = {
        rows: [{ id: 'new-item-id', title: 'New Luxury Item' }]
      };
      pool.query.mockResolvedValue(mockItem);

      const response = await request(app)
        .post('/api/fingerlux/items')
        .send({
          title: 'Designer Handbag',
          description: 'Authentic Louis Vuitton',
          price: 250000,
          brand: 'Louis Vuitton',
          condition: 'new'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should add review to item', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/api/fingerlux/items/item-123/review')
        .send({
          rating: 5,
          review_text: 'Excellent product!'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Storefront Controller', () => {
    beforeEach(() => {
      app.get('/api/storefront/stores', storefrontController.getStores.bind(storefrontController));
      app.post('/api/storefront/stores', storefrontController.createStore.bind(storefrontController));
      app.get('/api/storefront/stores/:storeId/products', storefrontController.getStoreProducts.bind(storefrontController));
    });

    it('should get all stores', async () => {
      const mockStores = {
        rows: [
          { id: '1', store_name: 'Fashion Hub', owner_username: 'john_doe' }
        ]
      };
      pool.query.mockResolvedValue(mockStores);

      const response = await request(app).get('/api/storefront/stores');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });

    it('should create new store', async () => {
      const mockStore = {
        rows: [{ id: 'new-store-id', store_name: 'My Store' }]
      };
      pool.query.mockResolvedValue(mockStore);

      const response = await request(app)
        .post('/api/storefront/stores')
        .send({
          store_name: 'My Store',
          description: 'Best products in town'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should get store products', async () => {
      const mockProducts = {
        rows: [
          { id: '1', name: 'Product A', price: 5000 }
        ]
      };
      pool.query.mockResolvedValue(mockProducts);

      const response = await request(app).get('/api/storefront/stores/store-123/products');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });
  });
});
