// Mock Sequelize instance for frontend models (likely used for type definitions or testing)
// This avoids importing the real backend connection into the frontend.
import { Sequelize } from 'sequelize';

// A mock connection string or memory-based instance for frontend compilation
const mockSequelize = new Sequelize('sqlite::memory:', {
  logging: false, // Disable logging for mock
});

export default mockSequelize;
