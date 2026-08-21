import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.routes';

// Mock auth controller methods
const mockAuthController = {
register: jest.fn((req, res) => {
    res.status(201).json({
message: 'User registered successfully',
user: {
id: 'user-123',
email: req.body.email },
token: 'mock-jwt-token'
    })
  }),
login: jest.fn((req, res) => {
    res.json({
message: 'Login successful',
user: {
id: 'user-123',
email: req.body.email },
token: 'mock-jwt-token'
    })
  }),
logout: jest.fn((req, res) => {
    res.json({
message: 'Logout successful' })
  }),
refreshToken: jest.fn((req, res) => {
    res.json({
message: 'Token refreshed',
token: 'new-token' })
  }),
forgotPassword: jest.fn((req, res) => {
    res.json({
message: 'Password reset link sent' });
  }),
resetPassword: jest.fn((req, res) => {
    res.json({
message: 'Password reset successful' });
  }),
verifyEmail: jest.fn((req, res) => {
    res.json({
message: 'Email verified successfully' });
  }),
getProfile: jest.fn((req, res) => {
    res.json({
user: {
id: 'user-123',
email: 'test@example.com' } });
  }),
updateProfile: jest.fn((req, res) => {
    res.json({
message: 'Profile updated',
user: {
id: 'user-123' } });
  }),
changePassword: jest.fn((req, res) => {
    res.json({
message: 'Password changed successfully' });
  })
};

jest.mock('../controllers/AuthController', () => mockAuthController);

// Mock auth middleware
jest.mock('../middleware/auth', () => {
  return jest.fn((req, res, next) => {
    req.user = {
id: 'user-123',
email: 'test@example.com' }
    next()
  })
})

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  describe('POST /register', () => {
    it('should register user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
email: 'test@example.com',
password: process.env.TEST_USER_PASSWORD || 'secure_test_password',
firstName: 'Test',
lastName: 'User'
        })
        .expect(201);

      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.token).toBeDefined();
    });

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
email: 'invalid-email',
password: process.env.TEST_USER_PASSWORD || 'secure_test_password'
        })
        .expect(400);
    });

    it('should reject weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
email: 'test@example.com',
password: '123'
        })
        .expect(400);
    });
  });

  describe('POST /login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
email: 'test@example.com',
password: process.env.TEST_USER_PASSWORD || 'secure_test_password'
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
      expect(mockAuthController.login).toHaveBeenCalled();
    });

    it('should reject missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
email: 'test@example.com' })
        .expect(400);
    });
  });

  describe('GET /profile', () => {
    it('should return user profile', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(response.body.user).toBeDefined();
      expect(mockAuthController.getProfile).toHaveBeenCalled();
    });
  });

  describe('PUT /profile', () => {
    it('should update user profile', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', 'Bearer mock-token')
        .send({
firstName: 'Updated',
lastName: 'Name' })
        .expect(200);

      expect(response.body.message).toBe('Profile updated');
    });
  });

  describe('POST /change-password', () => {
    it('should change password', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', 'Bearer mock-token')
        .send({
currentpassword: process.env.TEST_USER_PASSWORD || 'secure_test_password',
newpassword: process.env.TEST_USER_PASSWORD || 'secure_test_password'
        })
        .expect(200);

      expect(response.body.message).toBe('Password changed successfully');
    });
  });

  describe('POST /forgot-password', () => {
    it('should request password reset', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
email: 'test@example.com' })
        .expect(200);

      expect(response.body.message).toBe('Password reset link sent');
    });
  });

  describe('POST /reset-password', () => {
    it('should reset password with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
token: 'reset-token-123',
newpassword: process.env.TEST_USER_PASSWORD || 'secure_test_password'
        })
        .expect(200);

      expect(response.body.message).toBe('Password reset successful');
    });
  });
});
