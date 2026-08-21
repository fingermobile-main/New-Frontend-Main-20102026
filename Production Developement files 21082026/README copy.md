# 📱 FingerMobile Protocol
#     Date: 18-08-2026D
> A comprehensive mobile-first communication and commerce platform with end-to-end encryption, decentralized identity, and integrated marketplace.

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D14-blue.svg)](https://www.postgresql.org/)
[![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen.svg)]() 

--- /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/docker-compose.yml

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
FingerMobile Protocol FingerMobile Protocol ( (FingerMobile) Website, IOS, Android ) is a decentralized, peer-to-peer, end-to-end encrypted, social network platform that is designed to be used by anyone, anywhere in the world. It is built on top of the Ethereum blockchain and uses the Ethereum Virtual Machine (EVM) to run smart contracts.

Platform Location: The main platform is correctly identified in /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/.
Development Servers: Both the backend (npm run dev in apps/backend) and frontend (npm run dev in apps/frontend-main) development servers are configured and can be started. The platform is designed for deployment using Docker Compose.

Note: FingerMobile Business and Monetization Suite is "NOT" the main focus of this project or the platform but the platforms monetization business suite, a standalone Content developers Monitization, and a standalone Business Suite. It is integrated with the platform and also as a standalone platform/application that can be downloaded and used independently by the palatform members and can be downloaded independently from either the Google Play Store or the Apple App Store or the Microsoft App Store (Including Desktop version for Windows, MacOS, Linux, and Android).

FingerMobile Protocol is a next-generation communication platform that combines secure messaging, digital identity management, and e-commerce capabilities into a unified ecosystem. Built with security-first principles, it offers:

- 🔐 **End-to-End Encryption** - Sealed sender technology for private communications
- 🆔 **Decentralized Identity** - Self-sovereign identity with OAuth2 integration
- 💰 **Integrated Marketplace** - Digital goods, services, and payment processing
- 🌐 **Real-time Communication** - WebSocket-based instant messaging
- 📱 **Mobile-First Design** - Optimized for iOS and Android
- ☁️ **Cloud-Native Architecture** - Scalable microservices on Docker/Kubernetes

@@@fingermobile-main@@@
Start Up Instruction:- /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/README.md.
Now see /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps
check that file for general instructions.,read the below instructions properly. open all the paths and study them to have a better understanding of the FingerMobile Social Media Platform.

App/Website: do not start docker compose up,. unless specifically asked to start docker compose up.
only start the production development servers: open the FingerMobile Website/App., on google chrome browser and IDE Preview so we can start testing the develeopment live, tessting, and debugging pages, pages, and features, compilation and runtime errors, and bugs etc.

##### SECTION 2: FingerMobile Business and Monetization Suite ##################################
The main platform (Website and App) is located here /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps and never /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Business and Monetization Suite do not get confused 

/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Business and Monetization Suite/db/init-database.ts

Analysis of the FingerMobile Business and Monetization Suite
What is the FingerMobile Business and Monetization Suite?
The FingerMobile Business and Monetization Suite is an independent standalone microservice that provides monetization and revenue management features for creators, businesses, and affiliates. It is connected to the main platform for member use cases but operates as a separate system with its own database, API, and UI. But the main platform is located here /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps

/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/README.md 

FingerMobile Protocol/README.md	Full README Shows the overall architecture, the exact directory for the main platform (…/FingerMobile Protocol/apps), and the dev‑server start command: cd …/apps/backend && npm run dev. Also clarifies that the Business & Monetization Suite lives elsewhere and should not be confused with the main platform.

ONLY focus on the main platform located at /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps.
the structure of the main platform at /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps is clear. It contains numerous subdirectories, likely representing various microservices, games, or features. 

Crucially, see the following directories that are candidates for the main platform's core frontend and backend:

backend/: This directory contains 74 items and is the main backend service.
frontend-main/: This directory contains 38 items and is the main frontend application.
fingermobile-mobile-apps/: This contain the mobile app code.
admin-dashboard/: This is a separate admin frontend.
fingermobile-desktop/:This is the desktop application.

the correct location of the main platform. The frontend is at FingerMobile Protocol/apps/frontend-main/ and the backend is at 

please Note that /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Business and Monetization Suite *"is not"* the platform website etc but a standalone, independent entity like 43 others services and entities also connected to the plaform for its members use case. 

The main platform (Website and App) is located here /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps (Frontend-Main) and never /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Business and Monetization Suite OR /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Business, please Note that /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Business and Monetization Suite is not the platform website etc but a standalone, independent entity also connected to the plaform for its members use case and Monetization Suite/db/init-database.ts SO do not get confused.

What is the FingerMobile Business and Monetization Suite?
Analysis of the FingerMobile Business and Monetization Suite.
The FingerMobile Business and Monetization Suite is an independent standalone microservice that provides monetization and revenue management features for creators, businesses, and affiliates. It is connected to the main platform for member use cases but operates as a separate system with its own database, API, and UI.


##### SECTION 3: GIT WATCHER SERVICE #############################
Based Node.js script specifically designed for the purpose you described: auto_commit_watcher.js. This script automatically monitors changes in your source code files and commits them according to a 5 - 20 minutes schedule.

Here's how i need you always run it to automate your commits at every new session reset:-
Navigate to the directory containing the script: cd "/Users/user/Documents/FingerMobile Protocol Communication/Optimized FingerMobile"
Execute the script using Node.js: node auto_commit_watcher.js

This script will: Monitor .tsx and .ts files in the ./src/pages directory.
Check for changes every 5 seconds.
Automatically stage and commit changes every 20 minutes with a message like auto: Source code changes - X file(s) modified at YYYY-MM-DD HH:MM:SS.
Allow you to stop it safely with Ctrl+C, which will trigger a final commit of any pending changes.
This should automate the committing of your recent work as you requested. Remember, this script only commits locally; you will still need to manually push to the remote repository on GitHub when desired using git push origin main (or your default branch).

#### DOCKER INFORMATION ########################################
App/Website: do not start the docker compose up,. only start the production development servers: open the FingerMobile Website/App., 
So we can test with google chrome, while you use the System IDE Preview to monitor the build testing development errors and logs etc.
Now to start see /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps

FingerMobile Protocol/apps/backend/.
START THE PRODUCTION DEVELOPMENT SERVER AND SERVICES, USING GOOGLE CHROME/IDE PREVIEW, LETS TEXT THE LOGIN  PAGE: SIGNUP, REGISTER AND COMMUNITY PAGES INCLUDING MARKETPLACES  AND COMMUNITY FEATURES.

the main docker-compose.yml file for the FingerMobile Protocol platform in the root directory /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/. This file defines the core services:

backend: The main backend API service.
frontend-main: The main frontend application.
postgres: The PostgreSQL database.
redis: The Redis cache.
pgadmin: A management tool for PostgreSQL.
This is the correct file to use for starting the main platform with Docker Compose.

Here's a summary of the main compose file and its services:

backend:
Builds from ./apps/backend using Dockerfile.
Expects package.json and source code in ./apps/backend.
The Dockerfile uses a multi-stage build with npm ci --only=production and runs node app.js.
Dependencies in package.json are extensive (Node.js, Express, PostgreSQL, Redis, etc.), matching a full backend stack.
Uses volumes for persistent uploads and for live code reloading during development (./apps/backend:/app).
frontend-main:

Builds from ./apps/frontend-main using Dockerfile.
Expects package.json, Next.js config files (next.config.js, tsconfig.json, tailwind.config.js, postcss.config.js), and source code in ./apps/frontend-main.
The Dockerfile uses a multi-stage build, runs npm run build (specifically for Next.js), and serves the static output with node server.js (standalone mode).
Dependencies in package.json are consistent with a modern Next.js application (React, Next.js, Material UI, Radix UI, Tailwind CSS, etc.).
postgres, redis, pgadmin:

Standard service definitions pulling official images, using environment variables from .env, and defining volumes for persistence.
The environment variables in the root .env file seem compatible with the ones referenced in docker-compose.yml.

No obvious errors requiring fixes were found in the main docker-compose.yml file or the primary Dockerfiles for the backend and frontend-main services based on the standard project structure. The services depend on each other correctly (e.g., backend waits for postgres and redis, frontend-main waits for backend).

If and when the Development is over and Production is next phase., the command to start the main platform should be:
docker-compose -f /Users/user/Documents/FingerMobile\ Protocol\ Communication/FingerMobile\ Protocol/docker-compose.yml up

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

Contents

1. [Architecture Overview](#architecture-overview)
2. [Phase 1: Foundation Setup](#phase-1-foundation-setup)
3. [Phase 2: Core Services](#phase-2-core-services)
4. [Phase 3: API Endpoints](#phase-3-api-endpoints)
5. [Phase 4: Frontend Dashboard](#phase-4-frontend-dashboard)
6. [Phase 5: Integration](#phase-5-integration)
7. [Phase 6: Testing & Deployment](#phase-6-testing--deployment)
8. [Maintenance & Operations](#maintenance--operations)

---

## Architecture Overview

### Standalone Microservice Design

```
STERCS Service (Isolated Infrastructure)
├── PostgreSQL 15 (Dedicated Database)
├── Redis 7 (Caching & Queues)
├── Node.js Backend (Express API)
├── React Frontend (Admin Dashboard)
└── Prometheus (Optional Monitoring)

Communication with FingerMobile Platform
├── REST API Calls (Outbound)
├── Webhook Notifications (Inbound/Outbound)
└── JWT/API Key Authentication
```

### Security Isolation Benefits

✅ **Separate Attack Surface** - Compromise doesn't affect main platform  
✅ **Independent Scaling** - Scale based on audit load  
✅ **Fault Isolation** - Audit failures don't impact platform  
✅ **Compliance Certification** - Easier to certify isolated service  
✅ **Technology Flexibility** - Can use different stack if needed  

---

## Phase 1: Foundation Setup (Week 1)

### Day 1-2: Environment Setup

```bash
# 1. Navigate to STERCS directory
cd /path/to/FingerMobile Protocol/apps/stercs

# 2. Copy environment template
cp .env.example .env

# 3. Edit environment variables with secure values
nano .env

# IMPORTANT: Change these defaults!
DB_PASSWORD=YourSecurePassword123!
REDIS_PASSWORD=YourRedisPassword456!
JWT_SECRET=YourJWTSecretKey789!
ENCRYPTION_KEY=YourEncryptionKey012!
FINGERMOBILE_API_KEY=GenerateUniqueAPIKey345!
```

### Day 3-4: Database Initialization

```bash
# 1. Start database container only
docker-compose up -d stercs-db

# 2. Wait for database to be ready
docker-compose logs -f stercs-db

# 3. Run schema initialization
docker-compose exec stercs-db psql -U stercs_admin -d stercs_audit_db -f /docker-entrypoint-initdb.d/01_schema.sql

# 4. Verify tables created
docker-compose exec stercs-db psql -U stercs_admin -d stercs_audit_db -c "\dt"

# Expected output: 14 tables listed
```

### Day 5-7: Backend Dependencies

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Verify installation
npm list --depth=0

# 3. Test server startup
npm run dev

# Expected: Server running on port 3022
```

**Deliverables:**
- ✅ Docker Compose running
- ✅ Database schema initialized (14 tables)
- ✅ Backend server starting successfully
- ✅ Health endpoint responding

---

## Phase 2: Core Services (Week 2-3)

### Priority Order for Service Implementation

#### Week 2: Essential Services

**Day 1-2: Reporting Service** ✅ (Already Created)
- File: `backend/src/services/reporting.service.js`
- Features: Grant approvals, key changes, payout approvals, uploads reports
- Status: ✅ Complete

**Day 3-4: Session Trace Service** ✅ (Already Created)
- File: `backend/src/services/session-trace.service.js`
- Features: Session tracking, active sessions, cleanup
- Status: ✅ Complete

**Day 5-7: Module Access Tracker Service**
```javascript
// Create: backend/src/services/module-access.service.js
class ModuleAccessService {
  async trackModuleAccess(data) { /* ... */ }
  async getModuleAccessLog(panel, time) { /* ... */ }
  async getAdminPanelActivity(panel, dateRange) { /* ... */ }
}
```

#### Week 3: Advanced Services

**Day 1-2: System State Service**
```javascript
// Create: backend/src/services/system-state.service.js
class SystemStateService {
  async captureSnapshot(eventName, snapshotType, stateData) { /* ... */ }
  async compareStates(eventName) { /* ... */ }
  async getStateHistory(eventName) { /* ... */ }
}
```

**Day 3-4: Lockdown Simulation Service**
```javascript
// Create: backend/src/services/lockdown-simulation.service.js
class LockdownSimulationService {
  async simulateLockdown(config) { /* ... */ }
  async getSimulationHistory() { /* ... */ }
  async triggerEmergencyLockdown(reason) { /* ... */ }
}
```

**Day 5-7: Access Violation Service**
```javascript
// Create: backend/src/services/access-violation.service.js
class AccessViolationService {
  async flagViolation(userId, resource, violationType) { /* ... */ }
  async getViolations(resource, timeframe) { /* ... */ }
  async resolveViolation(violationId, resolvedBy) { /* ... */ }
}
```

**Deliverables:**
- ✅ 5 core services implemented
- ✅ All services tested individually
- ✅ Service integration verified

---

## Phase 3: API Endpoints (Week 4-5)

### Route Implementation Priority

#### Week 4: Core Routes

**Completed Routes:**
- ✅ `health.routes.js` - Health checks
- ✅ `reporting.routes.js` - Report generation
- ✅ `session-trace.routes.js` - Session tracking

**Routes to Implement:**

**Day 1-2: Module Access Routes**
```javascript
// backend/src/routes/module-access.routes.js
router.get('/:panel/:time', getModuleAccessLog);
router.get('/admin-panels/:panel/activity', getAdminPanelActivity);
router.post('/track', trackModuleAccess);
```

**Day 3-4: System State Routes**
```javascript
// backend/src/routes/system-state.routes.js
router.get('/snapshots/:eventName', getStateSnapshots);
router.post('/capture', captureSnapshot);
router.get('/compare/:eventName', compareSystemStates);
```

**Day 5-7: Lockdown Routes**
```javascript
// backend/src/routes/lockdown.routes.js
router.post('/simulate', simulateLockdown);
router.get('/history', getLockdownHistory);
router.get('/status', getCurrentLockdownStatus);
router.post('/emergency', triggerEmergencyLockdown);
```

#### Week 5: Security Routes

**Day 1-2: Access Violation Routes**
```javascript
// backend/src/routes/access-violation.routes.js
router.get('/:resource/:timeframe', getViolations);
router.post('/flag', flagViolation);
router.put('/:id/resolve', resolveViolation);
```

**Day 3-4: Transaction Verification Routes**
```javascript
// backend/src/routes/transaction-verification.routes.js
router.get('/unverified/:type/:module/:event', getUnverifiedTransactions);
router.post('/verify/:id', verifyTransaction);
router.get('/invalid-payouts/:event', getInvalidPayouts);
```

**Day 5-7: Injection Detection Routes**
```javascript
// backend/src/routes/injection-detection.routes.js
router.get('/attempts/:timeframe', getInjectionAttempts);
router.post('/detect', detectInjection);
router.get('/stats', getInjectionStats);
```

**Deliverables:**
- ✅ 13 route modules complete
- ✅ All endpoints tested with Postman/curl
- ✅ Authentication working on all routes

---

## Phase 4: Frontend Dashboard (Week 6-7)

### React Application Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   ├── Reports/
│   │   ├── SessionTraces/
│   │   ├── LockdownSimulator/
│   │   └── ComplianceReports/
│   ├── pages/
│   │   ├── SecurityAuditDashboard.tsx
│   │   ├── SessionTraceViewer.tsx
│   │   ├── LockdownSimulator.tsx
│   │   ├── ComplianceReports.tsx
│   │   └── LegalNoticeManager.tsx
│   ├── services/
│   │   └── api.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   └── App.tsx
```

### Day 1-3: Project Setup

```bash
# 1. Create React app
cd frontend
npx create-react-app . --template typescript

# 2. Install dependencies
npm install axios react-router-dom @mui/material @mui/icons-material recharts date-fns react-query

# 3. Setup TypeScript config
npx tsc --init
```

### Day 4-7: Core Components

**Security Audit Dashboard** (`pages/SecurityAuditDashboard.tsx`)
```typescript
import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import api from '../services/api';

const SecurityAuditDashboard: React.FC = () => {
  const { data: reports } = useQuery('reports', () => 
    api.get('/api/reports/grant-approvals/SouthHub/24hrs')
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Grant Approvals</Typography>
            {/* Report data visualization */}
          </CardContent>
        </Card>
      </Grid>
      {/* More cards... */}
    </Grid>
  );
};

export default SecurityAuditDashboard;
```

**Session Trace Viewer** (`pages/SessionTraceViewer.tsx`)
```typescript
const SessionTraceViewer: React.FC = () => {
  const [module, setModule] = useState('PhotoCredits');
  const [userId, setUserId] = useState('');
  
  const { data: trace } = useQuery(
    ['sessionTrace', module, userId],
    () => api.get(`/api/session-traces/${module}/${userId}`),
    { enabled: !!userId }
  );

  return (
    // Session trace UI with filters and timeline
  );
};
```

**Deliverables:**
- ✅ React app running on port 3080
- ✅ 5 main dashboard pages
- ✅ API integration working
- ✅ Responsive design

---

## Phase 5: Integration (Week 8)

### FingerMobile Platform Integration

#### Step 1: Configure Webhooks in STERCS

```bash
# Add webhook configurations via API
curl -X POST http://localhost:3022/api/webhooks/configure \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "critical_security_alert",
    "webhook_url": "http://fingermobile-platform/api/webhooks/security",
    "secret": "webhook_secret_2026",
    "headers": {"Content-Type": "application/json"}
  }'
```

#### Step 2: Update FingerMobile Backend

Add session tracking middleware in FingerMobile backend:

```javascript
// apps/backend/middleware/stercsTracker.js
const axios = require('axios');

async function trackSessionToSTERCS(req, res, next) {
  try {
    if (!req.user?.id) return next();
    
    // Don't block response - fire and forget
    axios.post('http://stercs-backend:3022/api/session-traces/track', {
      userId: req.user.id,
      username: req.user.username,
      moduleName: extractModuleName(req),
      sessionId: req.sessionID,
      actionType: determineAction(req.method, req.path),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      requestPath: req.originalUrl,
      requestMethod: req.method,
      statusCode: res.statusCode,
      responseTimeMs: res.responseTime || 0,
    }, {
      headers: {
        'X-API-Key': process.env.FINGERMOBILE_API_KEY
      },
      timeout: 1000, // 1 second timeout
    }).catch(err => {
      console.error('Failed to track session to STERCS:', err.message);
    });
    
    next();
  } catch (error) {
    next(); // Never block main flow
  }
}

module.exports = trackSessionToSTERCS;
```

#### Step 3: Add to FingerMobile Routes

```javascript
// apps/backend/app.js or similar
const trackSessionToSTERCS = require('./middleware/stercsTracker');

// Apply to all authenticated routes
app.use('/api/', authenticate, trackSessionToSTERCS);
```

**Deliverables:**
- ✅ Webhooks configured
- ✅ FingerMobile sending session data
- ✅ Real-time alerts working
- ✅ End-to-end integration tested

---

## Phase 6: Testing & Deployment (Week 9-10)

### Testing Checklist

#### Unit Tests
```bash
# Run all tests
npm test

# Expected: All tests passing
# Coverage: >80%
```

#### Integration Tests
```bash
# Test API endpoints
npm run test:integration

# Test database operations
npm run test:db
```

#### E2E Tests
```bash
# Full workflow tests
npm run test:e2e

# Scenarios:
# 1. Generate report
# 2. Track session
# 3. Simulate lockdown
# 4. Flag violation
# 5. Draft legal notice
```

### Production Deployment

```bash
# 1. Build production images
docker-compose build

# 2. Start all services
docker-compose up -d

# 3. Verify health
curl http://localhost:3022/health

# 4. Check logs
docker-compose logs -f

# 5. Monitor resources
docker stats
```

### Performance Optimization

```bash
# 1. Enable query caching
# Already implemented in services

# 2. Add database indexes
# Already in schema

# 3. Configure connection pooling
# DB_POOL_MAX=20 in .env

# 4. Enable compression
# Already in server.js

# 5. Set up CDN for frontend assets
# Optional: CloudFront, Cloudflare
```

**Deliverables:**
- ✅ All tests passing
- ✅ Production deployment successful
- ✅ Performance benchmarks met
- ✅ Monitoring dashboards active

---

## Maintenance & Operations

### Daily Tasks

```bash
# Check service health
curl http://localhost:3022/health

# View recent logs
docker-compose logs --tail=100 stercs-backend

# Check disk usage
docker system df
```

### Weekly Tasks

```bash
# Clean old session traces
curl -X POST http://localhost:3022/api/session-traces/cleanup \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"retentionDays": 90}'

# Archive compliance summaries
# Automated via cron job

# Review access violations
# Via dashboard or API
```

### Monthly Tasks

```bash
# Database backup
docker-compose exec stercs-db pg_dump -U stercs_admin stercs_audit_db > backup_$(date +%Y%m%d).sql

# Rotate logs
docker-compose exec stercs-backend logrotate /etc/logrotate.conf

# Review and optimize indexes
docker-compose exec stercs-db psql -U stercs_admin -d stercs_audit_db -c "SELECT * FROM pg_stat_user_indexes ORDER idx_scan ASC;"

# Security audit
# Review webhook configs
# Check API key rotation
# Update dependencies
```

### Quarterly Tasks

```bash
# Full disaster recovery test
# 1. Stop all services
# 2. Restore from backup
# 3. Verify data integrity
# 4. Test all endpoints

# Performance review
# Analyze slow queries
# Optimize cache strategies
# Scale if needed

# Compliance review
# Export all reports
# Review legal notices
# Update policies
```

---

## Troubleshooting Guide

### Common Issues

**Issue: Database Connection Failed**
```bash
# Check database status
docker-compose ps stercs-db

# View database logs
docker-compose logs stercs-db

# Restart database
docker-compose restart stercs-db

# Test connection
docker-compose exec stercs-db psql -U stercs_admin -d stercs_audit_db -c "SELECT 1"
```

**Issue: High Memory Usage**
```bash
# Check memory usage
docker stats

# Scale backend
docker-compose up -d --scale stercs-backend=3

# Clear Redis cache
docker-compose exec stercs-redis redis-cli -a $REDIS_PASSWORD FLUSHDB
```

**Issue: Slow API Responses**
```bash
# Check database performance
docker-compose exec stercs-db psql -U stercs_admin -d stercs_audit_db -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10"

# Check Redis hit rate
docker-compose exec stercs-redis redis-cli -a $REDIS_PASSWORD INFO stats

# Review slow queries in logs
docker-compose logs stercs-backend | grep "slow query"
```

**Issue: Webhook Delivery Failures**
```bash
# Check webhook delivery logs
curl -H "Authorization: Bearer TOKEN" http://localhost:3022/api/webhooks/delivery-logs

# Test webhook endpoint
curl -X POST http://localhost:3022/api/webhooks/test/WEBHOOK_ID \
  -H "Authorization: Bearer TOKEN"
```

---

## Success Metrics

### KPIs to Track

1. **Report Generation Time**: < 5 seconds
2. **API Response Time**: < 200ms (p95)
3. **Cache Hit Rate**: > 80%
4. **Database Query Time**: < 100ms (avg)
5. **Webhook Delivery Success**: > 99%
6. **Uptime**: > 99.9%
7. **Error Rate**: < 0.1%

### Monitoring Dashboard

Set up Grafana/Prometheus dashboard tracking:
- API request rate
- Error rate by endpoint
- Database connection pool usage
- Redis memory usage
- Active sessions count
- Violation detection rate
- Report generation latency

**IMPORTANT:** This document reflects the structure and configuration as of August 17, 2026. 

### Root Directory
Path: `/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/`
- `README.md` - Main project documentation
- `package.json` - Root package file
- `lerna.json` - Monorepo configuration
- `docker-compose.yml` - Container orchestration
- `ARCHIVES/` - Archive directory (as described above)
- `apps/` - Main application directory (contains active frontend and backend)

### Active Application Directory
Path: `/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/`
- `backend/` - Active backend service
- `frontend-main/` - Active frontend service (restored from archive)
- `database/` - Database configurations
- `docker/` - Docker configurations

### Active Backend Service
Path: `/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/backend/`
- `package.json` - Backend dependencies
- `server.js` - Main server entry point
- `routes/` - API route definitions
- `models/` - Database models
- `controllers/` - Request handlers
- `middleware/` - Middleware functions
- `utils/` - Utility functions
- `config/` - Configuration files
- `tests/` - Backend tests

### Active Frontend Service
Path: `/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/frontend-main/`
- `package.json` - Frontend dependencies
- `vite.config.js` - Vite build configuration
- `index.html` - Main HTML file
- `src/` - Source code (restored from archive)
  - `main.tsx` - Main entry point
  - `App.tsx` - Root component
  - `components/` - UI components
  - `pages/` - Page components
  - `services/` - API service calls
  - `contexts/` - React contexts
  - `hooks/` - Custom hooks
  - `types/` - Type definitions
  - `assets/` - Static assets
  - `styles/` - CSS stylesheets

## Recommendations

### 1. Consolidate Codebases
- Identify the canonical versions of frontend and backend code
- Merge duplicate codebases to reduce confusion
- Establish a single source of truth for the codebase

### 2. Update Documentation
- Reflect the current structure in platform structure documents
- Update README files to point to correct locations
- Document the relationship between different codebase versions

## Conclusion
The current archive structure reveals a complex history of development, cleanup, and restructuring activities. The original platform structure document does not reflect the current reality due to these changes. This documentation provides a clear map of the current state and recommendations for moving forward with a consolidated, well-documented codebase.

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
│                  Client Applications                │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │   Web    │  │  Mobile  │  │  Desktop (Electron)│ │
│  │ (React)  │  │(Flutter) │  │                    │ │
│  └──────────┘  └──────────┘  └──────────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS/WSS
┌──────────────────────▼──────────────────────────────┐
│              API Gateway / Load Balancer            │
│                   (Nginx/Cloudflare)                │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│               Backend Services                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │   Auth   │  │  Messaging│  │   Marketplace   │   │
│  │ Service  │  │  Service  │  │    Service      │   │
│  └──────────┘  └──────────┘  └──────────────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │  Wallet  │  │Notification│  │   Analytics    │   │
│  │ Service  │  │  Service  │  │    Service      │   │
│  └──────────┘  └──────────┘  └──────────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                Data Layer                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │PostgreSQL│  │  Redis   │  │   Object Storage │   │
│  │ (Primary)│  │ (Cache)  │  │   (S3/MinIO)     │   │
│  └──────────┘  └──────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Microservices Structure

```
apps/
├── admin-dashboard/ (with Dockerfile - IMPLEMENTED)
├── backend/ (Core backend API server)
│   ├── (Controllers, Services, Models, Routes, Middleware, DB, Utils, Migrations)
│   ├── Dockerfile
│   ├── package.json
│   └── server.js (Main entry point)
├── beatwaveng/ (with Dockerfile - IMPLEMENTED
├── camus/ (with Dockerfile - IMPLEMENTED
├── cmap/ (with Dockerfile - IMPLEMENTED)
├── dancia4tv/ (with Dockerfile - IMPLEMENTED)
├── database/ (Empty migrations folder)
├── elearning/ (with Dockerfile - IMPLEMENTED)
├── FingerLux/ (Full-stack service with compose file)
│   ├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose-fingerlux.main.yml
│   ├── backend/, frontend/, database/
├── FingerWars/ (Full-stack service with compose file)
│   ├── docker-compose.yml
│   ├── docker-compose-fingerwars.main.yml
│   ├── backend/, frontend/, database/
├── gems-backend/ (JS project with compose file)
├── gems-database/ (Compose file)
├── gems-docker/ (Compose file)
├── gems-frontend/ (JS/Vite project with compose file)
├── fingermobile-desktop/ (with Dockerfile - IMPLEMENTED)
├── fingermobile-mcp-servers/ (Contains vault-service with fixed tsconfig)
├── fingermobile-ml-services/ (with Dockerfile IMPLEMENTED)
├── fingermobile-mobile-apps/ (with Dockerfile - IMPLEMENTED)
├── Flamingo/ (Full-stack service with compose file)
│   ├── docker-compose.yml
│   ├── docker-compose-flamingo.main.yml
│   ├── backend/, frontend/, database/
├── frontend-main/ (Core React/Next.js web app)
│   ├── (Components, Pages, Services, Hooks, Contexts, Utils)
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json (Fixed for TS 6)
│   └── next.config.js
├── GameOn/ (Full-stack service with compose file)
│   ├── docker-compose.yml
│   ├── docker-compose-simple.yml
│   ├── docker/
│   ├── backend/, frontend/, database/, docker/
├── hallmarks/ (with Dockerfile - IMPLEMENTED)
├── load-balancer/ (Nginx config)
├── LendSqr/ (with Dockerfile - IMPLEMENTED)
├── LuminaGallery/ (with Dockerfile - IMPLEMENTED)
├── lushpressies/ (with Dockerfile - IMPLEMENTED)
├── marketplace/ (with Dockerfile - IMPLEMENTED
├── mii/ (Placeholder with Dockerfile - IMPLEMENTED)
├── monitoring/ (with Dockerfile - IMPLEMENTED)
├── MyLearning/ (with Dockerfile - IMPLEMENTED)
├── mystorefront/ (with Dockerfile - IMPLEMENTED)
├── Nysc/ (with Dockerfile - IMPLEMENTED)
├── ownit/ (with Dockerfile - IMPLEMENTED)
├── permanence/ (with Dockerfile - IMPLEMENTED)
├── photocredits/ (with Dockerfile - IMPLEMENTED)
├── SLEEPER/ (with Dockerfile - IMPLEMENTED)
├── stercs/ (with Dockerfile - IMPLEMENTED)
├── storefront/ (with Dockerfile - IMPLEMENTED)
├── supervi/ (with Dockerfile - IMPLEMENTED
├── SuperVi-Game/ (with Dockerfile - IMPLEMENTED)
├── SuperVi-Web/ (with fixed tsconfig in client/)
├── tms/ (with Dockerfile - IMPLEMENTED
├── trends/ (Full-stack JS project with compose file)
└── (Many other service directories)
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

- **Docker** 20.10+
- **Docker Compose** v2+
- **Node.js** 18.x or higher (for local development, not Docker)
- **PostgreSQL** 14.x or higher (for local development, not Docker)

### Docker Compose Setup
/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/docker-compose.yml

**Using the master `docker-compose.yml` file.**

```bash
# Clone the repo and navigate to the project root
cd FingerMobile\ Protocol/

# Copy the example environment file and adjust values as needed
cp .env.example .env
# Edit .env to set your environment-specific variables

# Start all services defined in docker-compose.yml
docker-compose up -d --build
```

### 5-Minute Setup (Alternative - Manual)

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
#    Terminal 1:
cd apps/backend
npm run dev

#    Terminal 2:
cd apps/frontend-main
npm run dev # This starts the Next.js development server on port 3000

# 7. Visit the application
#    Backend: http://localhost:3001
#    Frontend: http://localhost:3000
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
npm run dev # Starts the Next.js development server on http://localhost:3000

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

## 🔧 Current Tasks

- [x] Create master `docker-compose.yml` file.
- [ ] Implement placeholder services marked as "READY FOR IMPLEMENTATION".
- [ ] Integrate placeholder services into the master compose file.
- [ ] Finalize database initialization scripts for the main platform.
- [ ] Conduct end-to-end testing of the orchestrated platform.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](../../issues)
- **Email:** support@fingermobile.com
- **Status Page:** [status.fingermobile.com](https://status.fingermobile.com)

---

## Overview

This guide explains how to integrate the **STERCS standalone security audit service** with the main **FingerMobile Platform**. The integration enables:

✅ Real-time session tracking from platform to STERCS  
✅ Webhook alerts from STERCS to platform  
✅ Unified security monitoring across both systems  
✅ Automated compliance reporting  

---

## Architecture

```
┌─────────────────────────────────────┐
│   FingerMobile Main Platform        │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Backend (Node.js/Express)    │  │
│  │                              │  │
│  │ • stercsTracker middleware   │──┼── Sends session data
│  │ • Webhook route handler      │◄─┼── Receives alerts
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
            ↕ HTTP API Calls
┌─────────────────────────────────────┐
│   STERCS Standalone Service         │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Backend API (Port 3022)      │  │
│  │                              │  │
│  │ • Session tracking endpoint  │◄─┼── Receives data
│  │ • Webhook delivery           │──┼── Sends alerts
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## Step 1: Environment Configuration

### Add to FingerMobile Backend `.env`

```env
# STERCS Integration
STERCS_API_URL=http://stercs-backend:3022
STERCS_API_KEY=your_unique_api_key_here
STERCS_WEBHOOK_SECRET=webhook_secret_2026

# Optional: Enable/disable tracking
ENABLE_STERCS_TRACKING=true
```

### Add to STERCS `.env`

```env
# FingerMobile Platform Integration
FINGERMOBILE_API_URL=http://backend:3000
FINGERMOBILE_API_KEY=your_unique_api_key_here

# Webhook Configuration
WEBHOOK_SECRET=webhook_secret_2026
```

**Important:** Generate unique API keys for both directions. Never use the same key.

---

## Step 2: Install Dependencies

### In FingerMobile Backend

```bash
cd /path/to/FingerMobile Protocol/apps/backend
npm install axios crypto
```

---

## Step 3: Add STERCS Middleware

### Copy Middleware File

The file `/apps/backend/middleware/stercsTracker.js` has been created. Verify it exists:

```bash
ls -la /path/to/FingerMobile Protocol/apps/backend/middleware/stercsTracker.js
```

### Register Middleware in App

Edit `/apps/backend/app.js` (or your main Express app file):

```javascript
const express = require('express');
const app = express();

// ... existing middleware ...

// Import STERCS tracker
const { trackSessionToSTERCS } = require('./middleware/stercsTracker');

// Apply STERCS tracking to all authenticated API routes
// Place AFTER authentication middleware
app.use('/api/', authenticate, trackSessionToSTERCS);

// ... rest of your routes ...
```

**Placement is critical:** Must be after `authenticate` middleware so `req.user` is available.

---

## Step 4: Add Webhook Route Handler

### Create Webhook Route

Create `/apps/backend/routes/stercs-webhooks.js`:

```javascript
const express = require('express');
const router = express.Router();
const { stercsWebhookHandler } = require('../middleware/stercsTracker');

// STERCS webhook endpoint
router.post('/', stercsWebhookHandler);

module.exports = router;
```

### Register Webhook Route

In `/apps/backend/app.js`:

```javascript
const stercsWebhookRoutes = require('./routes/stercs-webhooks');

// Mount webhook route (no auth required - uses signature verification)
app.use('/webhooks/stercs', express.json(), stercsWebhookRoutes);
```

---

## Step 5: Configure STERCS Webhooks

### Send Webhook Configuration to STERCS

Use curl or Postman to configure webhooks in STERCS:

```bash
curl -X POST http://localhost:3022/api/webhooks/configure \
  -H "Authorization: Bearer YOUR_STERCS_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "critical_security_alert",
    "webhook_url": "http://backend:3000/webhooks/stercs",
    "secret": "webhook_secret_2026",
    "headers": {"Content-Type": "application/json"},
    "retry_count": 3,
    "timeout_ms": 5000
  }'
```

Configure all event types:

```bash
# Critical security alerts
curl -X POST http://localhost:3022/api/webhooks/configure \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"event_type":"critical_security_alert","webhook_url":"http://backend:3000/webhooks/stercs","secret":"webhook_secret_2026"}'

# Lockdown triggers
curl -X POST http://localhost:3022/api/webhooks/configure \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"event_type":"lockdown_triggered","webhook_url":"http://backend:3000/webhooks/stercs","secret":"webhook_secret_2026"}'

# Compliance reports ready
curl -X POST http://localhost:3022/api/webhooks/configure \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"event_type":"compliance_report_ready","webhook_url":"http://backend:3000/webhooks/stercs","secret":"webhook_secret_2026"}'
```

---

## Step 6: Test Integration

### Test Session Tracking

1. Start both services:
```bash
# Terminal 1: STERCS
cd /path/to/FingerMobile Protocol/apps/stercs
docker-compose up -d

# Terminal 2: FingerMobile Backend
cd /path/to/FingerMobile Protocol/apps/backend
npm run dev
```

2. Make an authenticated request to FingerMobile:
```bash
curl -H "Authorization: Bearer USER_JWT_TOKEN" \
  http://localhost:3000/api/photocredits
```

3. Check STERCS logs:
```bash
docker-compose logs -f stercs-backend | grep "Session tracked"
```

Expected output:
```
info: Session tracked: user-123 -> PhotoCredits
```

4. Query STERCS to verify data:
```bash
curl -H "Authorization: Bearer STERCS_ADMIN_TOKEN" \
  http://localhost:3022/api/session-traces/PhotoCredits/user-123
```

### Test Webhook Delivery

1. Trigger a test webhook from STERCS:
```bash
# First, get webhook ID
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3022/api/webhooks/configs

# Then test it
curl -X POST http://localhost:3022/api/webhooks/test/WEBHOOK_ID \
  -H "Authorization: Bearer TOKEN"
```

2. Check FingerMobile backend logs:
```bash
tail -f /path/to/FingerMobile Protocol/apps/backend/logs/app.log | grep "STERCS"
```

Expected output:
```
info: Received STERCS webhook: test_webhook
```

---

## Step 7: Production Deployment

### Docker Compose Integration

If using Docker Compose for the entire platform, add STERCS to your main compose file:

```yaml
version: '3.8'

services:
  # Existing services...
  
  stercs-db:
    image: postgres:15
    environment:
      POSTGRES_DB: stercs_audit_db
      POSTGRES_USER: stercs_admin
      POSTGRES_PASSWORD: ${STERCS_DB_PASSWORD}
    volumes:
      - stercs_db_data:/var/lib/postgresql/data
    networks:
      - fingermobile-network

  stercs-redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${STERCS_REDIS_PASSWORD}
    networks:
      - fingermobile-network

  stercs-backend:
    build: ./apps/stercs/backend
    ports:
      - "3022:3022"
    environment:
      DB_HOST: stercs-db
      DB_PASSWORD: ${STERCS_DB_PASSWORD}
      REDIS_HOST: stercs-redis
      REDIS_PASSWORD: ${STERCS_REDIS_PASSWORD}
      FINGERMOBILE_API_URL: http://backend:3000
      FINGERMOBILE_API_KEY: ${STERCS_API_KEY}
    depends_on:
      - stercs-db
      - stercs-redis
    networks:
      - fingermobile-network

  backend:
    # Your existing backend service
    environment:
      STERCS_API_URL: http://stercs-backend:3022
      STERCS_API_KEY: ${FINGERMOBILE_API_KEY}
      STERCS_WEBHOOK_SECRET: ${WEBHOOK_SECRET}
    networks:
      - fingermobile-network

networks:
  fingermobile-network:
    driver: bridge

volumes:
  stercs_db_data:
```

### Environment Variables in Production

Create a `.env.production` file:

```env
# Generate secure keys
STERCS_DB_PASSWORD=$(openssl rand -base64 32)
STERCS_REDIS_PASSWORD=$(openssl rand -base64 32)
STERCS_API_KEY=$(openssl rand -base64 32)
FINGERMOBILE_API_KEY=$(openssl rand -base64 32)
WEBHOOK_SECRET=$(openssl rand -base64 32)

# URLs (use internal Docker network names)
STERCS_API_URL=http://stercs-backend:3022
FINGERMOBILE_API_URL=http://backend:3000
```

---

## Step 8: Monitoring & Maintenance

### Health Checks

Add health check endpoints to monitor integration:

```javascript
// In FingerMobile backend
app.get('/health/integrations', async (req, res) => {
  try {
    // Check STERCS connectivity
    const stercsHealth = await axios.get(`${process.env.STERCS_API_URL}/health`, {
      timeout: 2000,
    });

    res.json({
      status: 'healthy',
      integrations: {
        stercs: {
          status: stercsHealth.data.status,
          response_time_ms: stercsHealth.config.timeout,
        },
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      integrations: {
        stercs: {
          status: 'unreachable',
          error: error.message,
        },
      },
    });
  }
});
```

### Logging Best Practices

1. **Track failed deliveries:**
```javascript
// Already implemented in stercsTracker.js
logger.error('Failed to send session data to STERCS:', err.message);
```

2. **Monitor webhook failures:**
```bash
# Check STERCS webhook delivery logs
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3022/api/webhooks/delivery-logs?success=false
```

3. **Set up alerts:**
```javascript
// Alert if >10 consecutive failures
if (consecutiveFailures > 10) {
  alertTeam('STERCS integration degraded');
}
```

### Performance Optimization

1. **Batch session tracking (optional):**
```javascript
// Instead of sending every request, batch them
const sessionBuffer = [];
const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 5000; // 5 seconds

setInterval(async () => {
  if (sessionBuffer.length > 0) {
    await axios.post(`${STERCS_API_URL}/api/session-traces/batch`, {
      sessions: [...sessionBuffer]
    });
    sessionBuffer.length = 0;
  }
}, FLUSH_INTERVAL);
```

2. **Use message queue (advanced):**
```javascript
// Use Bull/RabbitMQ for reliable delivery
const Queue = require('bull');
const sessionQueue = new Queue('session-tracking', process.env.REDIS_URL);

sessionQueue.process(async (job) => {
  await sendToSTERCS(job.data);
});

// In middleware
sessionQueue.add(sessionData, { attempts: 3, backoff: 1000 });
```

---

## Troubleshooting

### Issue: Sessions Not Being Tracked

**Check:**
1. Is middleware registered after authentication?
2. Is `req.user` populated?
3. Check backend logs for errors
4. Verify STERCS_API_URL is correct

**Debug:**
```javascript
// Add temporary logging in middleware
console.log('STERCS Tracking:', {
  userId: req.user?.id,
  moduleName,
  url: `${STERCS_API_URL}/api/session-traces/track`,
});
```

### Issue: Webhooks Not Received

**Check:**
1. Is webhook route mounted correctly?
2. Is firewall blocking port 3000?
3. Verify webhook URL in STERCS config
4. Check webhook delivery logs in STERCS

**Debug:**
```bash
# Check STERCS webhook configs
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3022/api/webhooks/configs

# Check delivery logs
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3022/api/webhooks/delivery-logs
```

### Issue: Authentication Failures

**Check:**
1. Are API keys matching in both `.env` files?
2. Is JWT token valid for STERCS admin endpoints?
3. Verify CORS settings allow cross-origin requests

**Fix:**
```bash
# Regenerate API keys
openssl rand -base64 32

# Update both .env files
# Restart both services
docker-compose restart
```

---

## Security Considerations

### API Key Management

✅ **Do:**
- Use different keys for each direction
- Rotate keys quarterly
- Store keys in environment variables
- Use strong random values

❌ **Don't:**
- Hardcode keys in source code
- Share keys across environments
- Commit keys to version control
- Use weak/predictable keys

### Webhook Security

✅ **Do:**
- Verify webhook signatures
- Use HTTPS in production
- Implement rate limiting
- Log all webhook events

❌ **Don't:**
- Accept unsigned webhooks
- Process webhooks without validation
- Expose webhook URLs publicly
- Ignore failed signature checks

### Data Privacy

✅ **Do:**
- Minimize data sent to STERCS
- Anonymize sensitive fields if needed
- Implement data retention policies
- Comply with GDPR/privacy laws

❌ **Don't:**
- Send passwords or tokens
- Include PII without consent
- Store data longer than necessary
- Share audit data externally

---

## API Reference

### Session Tracking Endpoint

**POST** `/api/session-traces/track`

**Headers:**
```
X-API-Key: your_api_key_here
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "user-123",
  "username": "john.doe",
  "moduleName": "PhotoCredits",
  "sessionId": "sess_abc123",
  "actionType": "read",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "requestPath": "/api/photocredits/list",
  "requestMethod": "GET",
  "statusCode": 200,
  "responseTimeMs": 45,
  "metadata": {
    "query_params": {"page": 1},
    "body_keys": []
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session tracked successfully"
}
```

### Webhook Payload Format

**Event:** `critical_security_alert`

```json
{
  "eventType": "critical_security_alert",
  "severity": "high",
  "timestamp": "2026-07-04T18:30:00Z",
  "details": {
    "userId": "user-123",
    "violationType": "repeated_access",
    "resource": "Wallet",
    "occurrenceCount": 15
  }
}
``` 



## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- PostgreSQL community for robust database technology
- React team for the powerful UI library
- All open-source contributors

---

**Built with ❤️ by the FingerMobile Team**

*Last Updated: August 17, 2026* 12:58pm WAT