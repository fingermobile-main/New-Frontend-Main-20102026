import { sequelize } from '../database/connection';

// Mock database connection for tests
jest.mock('../database/connection', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true)
  }
}));

// Global test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(async () => {
  jest.clearAllMocks();
});

// Close database connection after all tests
afterAll(async () => {
  await sequelize.close();
});
