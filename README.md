# �� FingerMobile Protocol

> A comprehensive mobile-first communication and commerce platform with end-to-end encryption, decentralized identity, and integrated marketplace.

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D14-blue.svg)](https://www.postgresql.org/)
[![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen.svg)]()

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

FingerMobile Protocol is a next-generation communication platform that combines secure messaging, digital identity management, and e-commerce capabilities into a unified ecosystem. Built with security-first principles, it offers:

- 🔐 **End-to-End Encryption** - Sealed sender technology for private communications
- 🆔 **Decentralized Identity** - Self-sovereign identity with OAuth2 integration
- 💰 **Integrated Marketplace** - Digital goods, services, and payment processing
- 🌐 **Real-time Communication** - WebSocket-based instant messaging
- 📱 **Mobile-First Design** - Optimized for iOS and Android
- ☁️ **Cloud-Native Architecture** - Scalable microservices on Docker/Kubernetes

---

## ✨ Key Features

### Communication
- Encrypted direct messaging
- Group chats with role-based access
- Disappearing messages
- Voice and video calling (planned)
- File sharing with encryption

### Identity & Authentication
- Multi-factor authentication
- OAuth2 social login (Google, Facebook, Apple)
- Biometric authentication support
- Decentralized identity verification
- Session management

### Commerce
- Digital marketplace for apps and services
- Secure payment processing (Stripe, Paystack)
- Wallet system with multi-currency support
- Transaction history and receipts
- Vendor management tools

### Security
- End-to-end encryption (E2EE)
- Perfect forward secrecy
- Certificate rotation
- Rate limiting and DDoS protection
- GDPR compliance tools

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Client Applications                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │   Web    │  │  Mobile  │  │  Desktop (Electron)│  │
│  │ (React)  │  │(Flutter) │  │                    │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS/WSS
┌──────────────────────▼──────────────────────────────┐
│              API Gateway / Load Balancer             │
│                   (Nginx/Cloudflare)                 │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│               Backend Services                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │   Auth   │  │  Messaging│  │   Marketplace    │  │
│  │ Service  │  │  Service  │  │    Service       │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Wallet  │  │Notification│  │   Analytics     │  │
│  │ Service  │  │  Service  │  │    Service       │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                Data Layer                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │PostgreSQL│  │  Redis   │  │   Object Storage │  │
│  │ (Primary)│  │ (Cache)  │  │   (S3/MinIO)     │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Microservices Structure

```
apps/
├── backend/              # Main API server (Express.js)
├── frontend-main/        # Web application (React/Vite)
├── camus/                # Video streaming service
├── mystorefront/         # E-commerce storefront
├── SuperVi-Game/         # Gaming platform
└── ...                   # Additional microservices
```

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js 18+ with Express.js
- **Database:** PostgreSQL 14+ with Sequelize ORM
- **Cache:** Redis for sessions and rate limiting
- **Authentication:** Passport.js with OAuth2 strategies
- **WebSocket:** ws library for real-time communication
- **Logging:** Winston with daily rotation
- **Security:** Helmet, CORS, rate limiting, XSS protection

### Frontend
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **State Management:** Redux Toolkit / Context API
- **Styling:** Tailwind CSS / Styled Components
- **HTTP Client:** Axios
- **Testing:** Jest + React Testing Library

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Orchestration:** Kubernetes (production)
- **Reverse Proxy:** Nginx
- **CI/CD:** GitHub Actions
- **Monitoring:** Winston logs, health checks
- **Backup:** Automated PostgreSQL backups

### Security
- **Encryption:** libsodium for E2EE
- **Certificates:** Automatic rotation for sealed sender
- **Compliance:** GDPR-ready with data export/deletion

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- PostgreSQL 14 or higher
- Redis 6 or higher
- Docker & Docker Compose (optional)

### 5-Minute Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd FingerMobile-Protocol

# 2. Install dependencies
cd apps/backend
npm install

cd ../frontend-main
npm install

# 3. Configure environment
cd ../backend
cp .env.example .env
# Edit .env with your database credentials

# 4. Start database (using Docker)
docker-compose up -d postgres redis

# 5. Run database migrations
npm run migrate

# 6. Start development servers
npm run dev  # Starts both backend and frontend
```

Visit `http://localhost:3000` to see the application!

---

## 💻 Development Setup

### Backend Development

```bash
cd apps/backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Configure database connection in .env

# Run database migrations
npm run migrate

# Start development server with hot reload
npm run dev

# Run tests
npm test

# Run linter
npm run lint
```

### Frontend Development

```bash
cd apps/frontend-main

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Database Setup

```bash
# Using Docker (recommended)
docker-compose up -d postgres

# Or local installation
createdb fingermobile_dev
psql fingermobile_dev < database/schema.sql
```

### Environment Variables

Create `.env` file in `apps/backend/`:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fingermobile_dev
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Session
SESSION_SECRET=your_32_character_secret_key_here

# Logging
LOG_LEVEL=info

# Frontend URL
FRONTEND_URL=http://localhost:3000

# OAuth2 (Social Login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Payment Processing
STRIPE_SECRET_KEY=sk_test_your_stripe_key
PAYSTACK_SECRET_KEY=sk_test_your_paystack_key

# WebSocket
ENABLE_WEBSOCKET=true

# Backup
ENABLE_AUTO_BACKUP=true
BACKUP_SCHEDULE=0 2 * * *  # Daily at 2 AM
```

See `.env.example` for complete list of variables.

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:5000/api
Production: https://api.fingermobile.com/api
```

### Authentication

All authenticated endpoints require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Key Endpoints

#### Authentication
```
POST   /auth/register          # User registration
POST   /auth/login             # User login
POST   /auth/logout            # User logout
GET    /auth/me                # Get current user
POST   /auth/refresh           # Refresh access token
```

#### Messaging
```
GET    /api/messages           # List conversations
POST   /api/messages/send      # Send message
GET    /api/messages/:id       # Get conversation
DELETE /api/messages/:id       # Delete conversation
```

#### Marketplace
```
GET    /api/marketplace/items  # List items
POST   /api/marketplace/items  # Create item
GET    /api/marketplace/items/:id  # Get item details
POST   /api/marketplace/purchase   # Purchase item
```

#### Wallet
```
GET    /api/wallet/balance     # Get wallet balance
POST   /api/wallet/deposit     # Deposit funds
POST   /api/wallet/withdraw    # Withdraw funds
GET    /api/wallet/transactions # Transaction history
```

### API Documentation Tools

- **Swagger/OpenAPI:** Available at `/api-docs` (development)
- **Postman Collection:** See `docs/postman-collection.json`
- **API Tests:** Run `npm run test:api` for endpoint tests

For complete API documentation, see:
- [API Reference Guide](docs/API_REFERENCE.md)
- [Authentication Guide](docs/AUTHENTICATION.md)
- [WebSocket Protocol](docs/WEBSOCKET_PROTOCOL.md)

---

## 🚢 Deployment

### Production Requirements

- Node.js 18+ LTS
- PostgreSQL 14+
- Redis 6+
- Nginx (reverse proxy)
- SSL/TLS certificates
- Domain name

### Docker Deployment

```bash
# Build production images
docker-compose -f docker-compose.production.yml build

# Start services
docker-compose -f docker-compose.production.yml up -d

# View logs
docker-compose -f docker-compose.production.yml logs -f
```

### Manual Deployment

```bash
# 1. Install dependencies
NODE_ENV=production npm install --production

# 2. Build frontend
cd apps/frontend-main
npm run build

# 3. Run database migrations
cd ../backend
npm run migrate:prod

# 4. Start with PM2
pm2 start ecosystem.config.js --env production

# 5. Configure Nginx (see nginx/nginx.conf)
sudo nginx -t && sudo systemctl reload nginx
```

### Environment-Specific Configs

- **Development:** `docker-compose.yml`
- **Staging:** `docker-compose.staging.yml`
- **Production:** `docker-compose.production.yml`

### Monitoring & Logging

```bash
# View application logs
tail -f apps/backend/logs/combined-$(date +%Y-%m-%d).log

# Monitor error logs
tail -f apps/backend/logs/error-$(date +%Y-%m-%d).log

# Check service health
curl http://localhost:5000/health

# View PM2 status
pm2 status
pm2 monit
```

### Backup Strategy

Automated backups run daily at 2 AM:

```bash
# Manual backup
npm run backup

# Restore from backup
npm run restore -- --file backup-2026-06-22.sql.gz

# List backups
ls -lh backups/
```

See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

---

## 🧪 Testing

### Running Tests

```bash
# All tests
npm test

# Backend tests only
cd apps/backend
npm test

# Frontend tests only
cd apps/frontend-main
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Structure

```
apps/backend/
├── tests/
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── e2e/           # End-to-end tests
├── jest.config.js      # Jest configuration
└── setup-tests.js      # Test setup
```

### Test Coverage Goals

- **Unit Tests:** 80%+ coverage
- **Integration Tests:** All API endpoints
- **E2E Tests:** Critical user journeys

Current test files: 47 tests found

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Write tests for new features
- Update documentation as needed
- Use conventional commits
- Ensure CI passes before merging

### Code Style

- **JavaScript/TypeScript:** ESLint + Prettier
- **Commits:** Conventional Commits specification
- **Branch Naming:** `feature/`, `bugfix/`, `hotfix/`, `docs/`

See [Contributing Guide](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is proprietary software. All rights reserved.

Unauthorized copying, distribution, or modification is strictly prohibited.

---

## 📞 Support

- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](../../issues)
- **Email:** support@fingermobile.com
- **Status Page:** [status.fingermobile.com](https://status.fingermobile.com)

---

## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- PostgreSQL community for robust database technology
- React team for the powerful UI library
- All open-source contributors

---

**Built with ❤️ by the FingerMobile Team**

*Last Updated: June 22, 2026*
