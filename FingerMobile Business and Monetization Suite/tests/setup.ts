// Import is not needed since we're mocking the database
jest.mock('../database', () => ({
  db: {
    prepare: jest.fn(() => ({
      get: jest.fn(),
      all: jest.fn(),
      run: jest.fn(),
    })),
    pragma: jest.fn(),
    exec: jest.fn(),
    transaction: jest.fn((fn) => fn),
  },
}))

beforeAll(() => {
  // Setup test environment
  process.env.NODE_ENV = 'test'
  process.env.JWT_SECRET = 'test-secret-key'
  process.env.WEBHOOK_SECRET = 'test-webhook-secret'
})

afterAll(() => {
  // Cleanup
  jest.clearAllMocks()
})