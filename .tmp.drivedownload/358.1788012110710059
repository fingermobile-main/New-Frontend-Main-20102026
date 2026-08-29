# Platform Monetization Service

FingerMobile's independent monetization and revenue management system for creators, businesses, and affiliates.

## 🎯 Overview

A complete standalone microservice providing:
- **5 Monetization Products**: In-Stream Ads, Gifts, Subscriptions, Reels Ads, Affiliate Commerce
- **Eligibility Engine**: Automated qualification checking with configurable rules
- **Revenue Tracking**: Real-time ledger, payout processing, and financial reporting
- **Business Verification**: KYC/KYB compliance and payout account management
- **Affiliate System**: Partner tracking, commission calculations, and performance analytics

## 📊 Features

### Backend
- ✅ Express.js REST API with 20+ endpoints
- ✅ SQLite database with better-sqlite3 (12 tables)
- ✅ JWT authentication & role-based access control
- ✅ Rate limiting & security headers
- ✅ Webhook signature verification
- ✅ Structured logging with Winston
- ✅ TypeScript throughout

### Frontend
- ✅ React 18 with TypeScript
- ✅ Vite build tooling
- ✅ Tailwind CSS styling
- ✅ 8 dashboard pages
- ✅ Real-time data visualization
- ✅ Earnings calculator with RPM/CPM/CPC formulas

### Business Logic
- ✅ Eligibility evaluation engine
- ✅ Revenue estimation calculator
- ✅ Payout scheduling & processing
- ✅ Audit trail & compliance logging
- ✅ Policy acknowledgements

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose (optional)

### Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Set JWT_SECRET, WEBHOOK_SECRET, STRIPE keys, etc.

# Run development server (backend + frontend)
npm run dev

# Or run separately:
# Backend only
npm run start

# Frontend only (in another terminal)
cd ../frontend && npm run dev
```

### Docker Deployment

```bash
# Build image
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f monetization-api

# Stop services
docker-compose down
```

## 📁 Project Structure

```
Platform Monetization/
├── middleware/           # Auth, rate limiting, logging, webhook verification
│   ├── auth.ts
│   ├── rate-limiter.ts
│   ├── logger.ts
│   └── webhook-auth.ts
├── tests/               # Unit & integration tests
│   ├── setup.ts
│   └── unit/
├── *.ts                 # Backend services, controllers, routes
├── *.tsx                # React frontend components
├── schema.sql           # Database schema
├── package.json         # Dependencies & scripts
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite bundler config
├── docker-compose.yml   # Docker orchestration
├── Dockerfile           # Container build instructions
└── .env.example         # Environment template
```

## 🔑 API Endpoints

### Overview & Dashboard
- `GET /api/overview` - Complete monetization overview
- `GET /api/hallmarks` - HallMarks page details
- `POST /api/hallmarks` - Create new page
- `PATCH /api/hallmarks/:id` - Update page

### Monetization Programs
- `GET /api/monetization/programs` - List all programs
- `GET /api/monetization/eligibility` - Check eligibility status
- `POST /api/monetization/applications` - Submit application
- `POST /api/monetization/estimate` - Calculate earnings estimate

### Verification
- `GET /api/verification/status` - Get verification status
- `POST /api/verification/business` - Submit business verification
- `POST /api/verification/payout-account` - Link payout account

### Revenue & Payouts
- `GET /api/revenue/ledger` - Revenue ledger entries
- `GET /api/revenue/payouts` - Payout history

### Affiliate
- `GET /api/affiliate/performance` - Partner performance metrics

### Admin
- `GET /api/admin/config` - Platform configuration
- `PATCH /api/admin/config` - Update configuration
- `GET /api/admin/monitoring` - System monitoring data

### Webhooks
- `POST /api/webhooks/events` - Receive webhook events

### Health
- `GET /api/health` - Health check endpoint

## 🔐 Security

### Authentication
All API endpoints require JWT authentication:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3001/api/overview
```

### Rate Limiting
- Default: 100 requests per 15 minutes per IP
- Sensitive operations: 10 requests per minute
- Webhooks: 100 requests per minute

### Webhook Verification
Webhooks must include HMAC-SHA256 signature:

```bash
curl -X POST http://localhost:3001/api/webhooks/events \
  -H "X-Webhook-Signature: GENERATED_HMAC_SIGNATURE" \
  -H "Content-Type: application/json" \
  -d '{"eventType":"payout.updated","data":{...}}'
```

## 💰 Monetization Products

### 1. In-Stream Ads
- **Requirements**: 10K followers, 100K watch minutes (60d), 35 active videos
- **Revenue Share**: 55% to creator
- **RPM**: Configurable (default $2.50)

### 2. Gifts
- **Requirements**: 500 followers (60 days), gift purchase eligible
- **Cash Value**: $0.01 per gift (configurable)

### 3. Subscriptions
- **Requirements**: 50K followers OR 500 returning viewers
- **Engagement**: 100K engagements OR 180K watch minutes (30d)

### 4. Reels Ads
- **Requirements**: 20K followers, 350K unique views (30d)
- **Originality Score**: >70 required

### 5. Affiliate Commerce
- **Requirements**: Business verified, payout account linked
- **Commission**: Configurable per partner (default 5%)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

## 📝 Configuration

See `.env.example` for all available environment variables:

**Required:**
- `JWT_SECRET` - JWT signing key
- `WEBHOOK_SECRET` - Webhook HMAC secret
- `STRIPE_SECRET_KEY` - Stripe API key (for payouts)

**Optional:**
- `REDIS_URL` - Redis cache connection string
- `SMTP_*` - Email notification settings
- `SENTRY_DSN` - Error tracking

## 🗄️ Database

SQLite database with WAL mode enabled. Schema includes:
- `users` - User accounts
- `hallmark_pages` - Creator pages
- `content_metrics` - Performance analytics
- `monetization_applications` - Product applications
- `revenue_ledger` - Financial transactions
- `payouts` - Payout records
- `business_verifications` - KYC/KYB data
- `affiliate_events` - Partner tracking
- `platform_config` - System settings
- `webhook_events` - Event log
- `audit_logs` - Compliance trail
- `policy_acknowledgements` - Policy acceptance

## 📈 Monitoring

Logs are written to `./logs/`:
- `error.log` - Error-level messages only
- `combined.log` - All log levels

Health check: `GET /api/health`

## 🔄 Deployment Checklist

Before deploying to production:

- [ ] Set strong `JWT_SECRET` (32+ characters)
- [ ] Configure `WEBHOOK_SECRET` for external integrations
- [ ] Add Stripe API keys for payment processing
- [ ] Set `ALLOWED_ORIGINS` to production domains
- [ ] Enable HTTPS/TLS
- [ ] Configure SMTP for email notifications
- [ ] Set up log rotation
- [ ] Enable Redis caching (optional)
- [ ] Run load tests
- [ ] Configure backup strategy for SQLite database
- [ ] Set up monitoring alerts

## 🛠️ Maintenance

### Database Backup
```bash
# Manual backup
cp data/fingermobile.db backups/fingermobile-$(date +%Y%m%d).db

# Automated (add to cron)
0 2 * * * cp /app/data/fingermobile.db /backups/fingermobile-$(date +\%Y\%m\%d).db
```

### Log Rotation
Logs automatically rotate at 5MB. Configure in `middleware/logger.ts`.

### Scaling
The service is stateless except for the SQLite database. For horizontal scaling:
1. Use shared storage for `data/` directory
2. Configure Redis for session/cache sharing
3. Use load balancer with sticky sessions

## 📄 License

Proprietary - FingerMobile Platform

## 👥 Support

For issues or questions:
- Check documentation in `/docs`
- Review API tests in `/tests`
- Contact platform engineering team

---

**Version**: 1.0.0  
**Last Updated**: July 4, 2026  
**Status**: Production Ready ✅
