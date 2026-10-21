# 🧪 Testing Guide

## Overview

The FingerMobile Protocol backend uses **Jest** as the testing framework with support for both JavaScript and TypeScript tests.

---

## 📊 Current Test Status

- **Total Test Files:** 23 tests discovered
- **Test Types:** Unit, Integration, Controller, Service, Route tests
- **Framework:** Jest with ts-jest for TypeScript support
- **Coverage Target:** 70% (configurable)

---

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- path/to/test.test.js

# Run tests matching pattern
npm test -- --testNamePattern="user authentication"

# Run only failed tests
npm test -- --onlyFailures
```

### Test Categories

```bash
# Run unit tests only
npm test -- tests/unit/

# Run integration tests only
npm test -- tests/integration/

# Run controller tests
npm test -- __tests__/controllers/

# Run service tests
npm test -- __tests__/services/

# Run route tests
npm test -- __tests__/routes/
```

---

## 📁 Test Structure

```
apps/backend/
├── __tests__/                 # Primary test directory
│   ├── controllers/          # Controller tests
│   │   ├── authenticationController.test.js
│   │   ├── marketplaceController.test.js
│   │   └── ...
│   ├── services/             # Service tests
│   │   ├── PaymentService.test.ts
│   │   └── OpenAIService.test.ts
│   ├── routes/               # Route tests
│   │   ├── auth.routes.test.ts
│   │   └── wallet.routes.test.ts
│   ├── middleware/           # Middleware tests
│   │   └── errorHandler.test.ts
│   ├── models/               # Model tests
│   │   └── database.test.ts
│   └── integration/          # Integration tests
│       └── api.test.js
├── tests/                     # Additional test directory
│   ├── unit/                 # Unit tests
│   │   ├── community_service.test.js
│   │   ├── marketplace_service.test.js
│   │   ├── commission_service.test.js
│   │   ├── payment_service.test.js
│   │   └── ugc_media_service.test.js
│   └── integration/          # Integration tests
│       ├── phase1_phase2_endpoints.test.js
│       └── critical_workflows.test.js
├── jest.config.json          # Jest configuration
├── jest.setup.js             # Test environment setup
└── tsconfig.test.json        # TypeScript test config
```

---

## ✍️ Writing Tests

### Unit Test Example

```javascript
const { calculateCommission } = require('../../services/commission_service');

describe('Commission Service', () => {
  describe('calculateCommission', () => {
    it('should calculate 5% commission for standard transactions', () => {
      const amount = 100;
      const commission = calculateCommission(amount);
      
      expect(commission).toBe(5);
    });

    it('should handle zero amount', () => {
      const commission = calculateCommission(0);
      expect(commission).toBe(0);
    });

    it('should handle negative amounts gracefully', () => {
      expect(() => calculateCommission(-10)).toThrow('Invalid amount');
    });
  });
});
```

### Integration Test Example

```javascript
const request = require('supertest');
const app = require('../../server');

describe('Authentication API', () => {
  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });
  });
});
```

### TypeScript Test Example

```typescript
import { UserService } from '../../services/UserService';
import { User } from '../../models/User';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'securepassword'
      };

      const user = await userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.id).toBeDefined();
    });
  });
});
```

---

## 🔧 Configuration

### Jest Configuration (jest.config.json)

```json
{
  "testEnvironment": "node",
  "roots": ["<rootDir>/__tests__", "<rootDir>/tests"],
  "testMatch": [
    "**/__tests__/**/*.test.js",
    "**/__tests__/**/*.test.ts",
    "**/tests/**/*.test.js",
    "**/tests/**/*.test.ts"
  ],
  "collectCoverageFrom": [
    "controllers/**/*.{js,ts}",
    "services/**/*.{js,ts}",
    "!**/node_modules/**"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 70,
      "lines": 70,
      "statements": 70
    }
  },
  "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
  "testTimeout": 30000
}
```

### Test Setup (jest.setup.js)

Configures test environment with:
- Environment variables
- Global timeouts
- Mock configurations
- Database test connections

---

## 📊 Coverage Reports

### Generate Coverage

```bash
npm run test:coverage
```

### Coverage Output

```
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   72.5  |    68.3  |   71.2  |   73.1  |
 controllers/         |   75.0  |    70.5  |   73.8  |   76.2  |
 services/            |   68.9  |    65.2  |   67.5  |   69.8  |
 middleware/          |   80.1  |    75.0  |   78.3  |   81.5  |
----------------------|---------|----------|---------|---------|
```

### Coverage Thresholds

Current targets (adjustable in jest.config.json):
- **Statements:** 70%
- **Branches:** 70%
- **Functions:** 70%
- **Lines:** 70%

---

## 🎯 Best Practices

### DO ✅

- Write tests before implementing features (TDD)
- Use descriptive test names
- Test both success and failure cases
- Mock external dependencies
- Keep tests independent and isolated
- Use beforeEach/afterEach for setup/cleanup
- Test edge cases and boundary conditions
- Maintain test coverage above 70%

### DON'T ❌

- Don't test implementation details
- Don't write tests that depend on each other
- Don't skip error case testing
- Don't hardcode test data (use factories)
- Don't ignore failing tests
- Don't commit tests without running them
- Don't test third-party libraries
- Don't use console.log in production tests

---

## �� Debugging Tests

### Run with Verbose Output

```bash
npm test -- --verbose
```

### Run Single Test

```bash
npm test -- -t "specific test name"
```

### Debug Mode

```bash
# Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Then open Chrome DevTools at chrome://inspect
```

### Common Issues

**Issue:** Test timeout
```javascript
// Increase timeout for specific test
it('should complete long operation', async () => {
  // test code
}, 60000); // 60 seconds
```

**Issue:** Database connection
```javascript
// Use test database
beforeAll(async () => {
  await connectToTestDatabase();
});

afterAll(async () => {
  await disconnectFromDatabase();
});
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: test_password
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/)
- [Jest Best Practices](https://github.com/goldberd/best-practices-for-jest)
- [Node.js Testing Guide](https://nodejs.org/en/learn/test-runner/using-test-runner)

---

**Last Updated:** June 22, 2026  
**Status:** Active - 23 Tests Configured
