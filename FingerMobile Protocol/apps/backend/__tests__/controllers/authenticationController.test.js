/**
 * Unit Tests for Authentication Controllers (Authenticator, Biometric, Security)
 *,
Date: June 11, 2026
 */

const request = require('supertest');
const express = require('express');

// Mock database pool
jest.mock('../../db', () => ({
  pool: { query: jest.fn() },
  query: jest.fn()
}));

const authenticatorController = require('../../controllers/authenticatorController');
const biometricController = require('../../controllers/biometricController');
const securityController = require('../../controllers/securityController.js');
const { pool } = require('../../db');

describe('Authentication Controllers Tests', () => {
  let app

  beforeEach(() => {
    app = express()
    app.use(express.json());
    
    // Mock authentication middleware
    app.use((req, res, next) => {
      req.user = { id: 'test-user-id' }
      next()
    })

    jest.clearAllMocks()
  });

  describe('Authenticator Controller - 2FA Setup', () => {
    beforeEach(() => {
      // Routes
      app.post('/api/authenticator/setup', authenticatorController.setup2FA.bind(authenticatorController))
      app.post('/api/authenticator/verify', authenticatorController.verify2FA.bind(authenticatorController))
      app.get('/api/authenticator/status', authenticatorController.get2FAStatus.bind(authenticatorController))
    })

    it('should setup 2FA and return QR code', async () => {
      const mockSetup = { rows: [{ secret: process.env.JWT_SECRET || 'default-secret-for-development',
qr_code_url: 'otpauth://test' }]
      }

      pool.query.mockResolvedValue(mockSetup)

      const response = await request(app)
        .post('/api/authenticator/setup')
        .send({ method: 'totp' })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true);
      expect(response.body.data.qr_code_url).toBeDefined();
    });

    it('should verify 2FA token', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/api/authenticator/verify')
        .send({ token: '123456' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 2FA status', async () => {
      const mockStatus = { rows: [{ is_enabled: true,
methods: ['totp'] }]
      };

      pool.query.mockResolvedValue(mockStatus);

      const response = await request(app).get('/api/authenticator/status');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.is_enabled).toBe(true);
    });
  });

  describe('Biometric Controller', () => {
    beforeEach(() => {
      // Routes
      app.post('/api/biometric/register', biometricController.registerBiometric.bind(biometricController))
      app.post('/api/biometric/authenticate', biometricController.authenticateBiometric.bind(biometricController))
      app.delete('/api/biometric/remove', biometricController.removeBiometric.bind(biometricController))
    })

    it('should register biometric credential', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/api/biometric/register')
        .send({ credential_id: 'cred-123',
public_key: 'public-key-data',
device_name: 'iPhone 13'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should authenticate with biometric', async () => {
      const mockCredential = { rows: [{ id: 'cred-123',
public_key: 'public-key-data' }]
      };

      pool.query
        .mockResolvedValueOnce(mockCredential)
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/biometric/authenticate')
        .send({ credential_id: 'cred-123',
signature: 'signature-data'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should remove biometric credential', async () => {
      pool.query.mockResolvedValue({ rowCount: 1 });

      const response = await request(app)
        .delete('/api/biometric/remove')
        .send({ credential_id: 'cred-123' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Security Controller', () => {
    beforeEach(() => {
      // Routes
      app.get('/api/security/audit-log', securityController.getAuditLog.bind(securityController))
      app.get('/api/security/sessions', securityController.getActiveSessions.bind(securityController))
      app.post('/api/security/sessions/:id/revoke', securityController.revokeSession.bind(securityController))
      app.get('/api/security/settings', securityController.getSecuritySettings.bind(securityController))
    });

    it('should get audit log', async () => {
      const mockLogs = { rows: [
          { event_type: 'login',
ip_address: '192.168.1.1',
created_at: new Date() }
        ]
      };

      pool.query.mockResolvedValue(mockLogs);

      const response = await request(app).get('/api/security/audit-log?limit=50');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });

    it('should get active sessions', async () => {
      const mockSessions = { rows: [
          { id: 'session-1',
device_name: 'Chrome on Windows',
last_activity_at: new Date() }
        ]
      };

      pool.query.mockResolvedValue(mockSessions);

      const response = await request(app).get('/api/security/sessions');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });

    it('should revoke session', async () => {
      pool.query.mockResolvedValue({ rowCount: 1 });

      const response = await request(app)
        .post('/api/security/sessions/session-123/revoke');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should get security settings', async () => {
      const mockSettings = { rows: [{ two_factor_enabled: true,
biometric_enabled: false,
login_notifications: true
        }]
      };

      pool.query.mockResolvedValue(mockSettings);

      const response = await request(app).get('/api/security/settings');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.two_factor_enabled).toBe(true);
    });
  });
});
