# Platform Monetization - Production Deployment Checklist

## ✅ Pre-Deployment Verification

### Code Quality
- [x] TypeScript compilation successful (zero errors)
- [x] All unit tests passing
- [x] Linting clean (no warnings)
- [x] No hardcoded secrets in codebase
- [x] Environment variables properly externalized

### Security Hardening
- [x] JWT authentication middleware implemented
- [x] Role-based access control configured
- [x] Rate limiting enabled (3 tiers)
- [x] Webhook signature verification active
- [x] CORS restricted to whitelisted origins
- [x] Helmet security headers configured
- [x] Input validation on all endpoints

### Infrastructure
- [x] Dockerfile created (multi-stage build)
- [x] docker-compose.yml configured
- [x] .dockerignore optimized
- [x] Health check endpoint available
- [x] Graceful shutdown handlers implemented
- [x] Non-root user in container

### Monitoring & Logging
- [x] Winston structured logging configured
- [x] HTTP request logging middleware
- [x] Error tracking integration ready
- [x] Log rotation configured (5MB max)
- [x] Separate error/combined log files

---

## 🔧 Configuration Tasks

### 1. Environment Variables (REQUIRED)

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

**Must Configure:**
```env
# Authentication
JWT_SECRET=generate-a-strong-random-string-here-minimum-32-chars

# Webhooks
WEBHOOK_SECRET=another-strong-random-string-for-webhooks

# Stripe Payments (get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_live_your_actual_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key

# CORS (production domains only)
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Email Notifications (if enabled)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=notifications@yourdomain.com
SMTP_PASS=your-app-specific-password
```

**Generate Secure Secrets:**
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate webhook secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Stripe Integration Setup

1. **Create Stripe Account**: https://dashboard.stripe.com/register
2. **Get API Keys**:
   - Navigate to Developers → API keys
   - Copy Secret Key (`sk_live_...`)
   - Copy Publishable Key (`pk_live_...`)
3. **Configure Webhooks**:
   - Navigate to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/events`
   - Select events: `payout.created`, `payout.paid`, `payout.failed`
   - Copy Signing Secret (`whsec_...`)
4. **Test Mode**: Use `sk_test_` keys initially, switch to `sk_live_` for production

### 3. Database Initialization

SQLite database auto-initializes on first run. Verify:

```bash
# Check database exists after first start
ls -lh data/fingermobile.db

# Verify tables created
sqlite3 data/fingermobile.db ".tables"

# Should show: users, seshat_pages, content_metrics, etc.
```

### 4. SSL/TLS Certificate

For production HTTPS:

**Option A: Let's Encrypt (Free)**
```bash
sudo apt-get install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

**Option B: Cloudflare SSL**
- Enable Cloudflare proxy
- Set SSL mode to "Full (strict)"
- Upload origin certificate

**Update nginx/reverse proxy config accordingly**

---

## 🚀 Deployment Steps

### Step 1: Build Docker Image

```bash
cd "/Users/user/Documents/FingerMobile Protocol Communication/Platform Monetization"

# Build image
docker-compose build --no-cache

# Verify image created
docker images | grep monetization
```

### Step 2: Start Services

```bash
# Start in detached mode
docker-compose up -d

# Wait for health check (30-60 seconds)
docker-compose ps

# Should show: healthy
```

### Step 3: Verify Deployment

```bash
# Check logs
docker-compose logs -f monetization-api

# Test health endpoint
curl http://localhost:3001/api/health

# Expected response:
# {"status":"healthy","requestId":"...","time":"2026-07-04T..."}
```

### Step 4: Run Smoke Tests

```bash
# Test authentication (should fail without token)
curl http://localhost:3001/api/overview
# Expected: 401 Unauthorized

# Test with valid token
TOKEN=$(node -e "console.log(require('jsonwebtoken').sign({id:'test',email:'test@test.com',role:'admin'}, process.env.JWT_SECRET))")
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/overview
# Expected: 200 OK with JSON data
```

### Step 5: Configure Reverse Proxy (Production)

**Nginx Example:**
```nginx
server {
    listen 443 ssl;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🧪 Post-Deployment Testing

### Functional Tests

```bash
# 1. Health Check
curl https://api.yourdomain.com/api/health

# 2. Authentication Flow
# Login and get token (implement login endpoint)
# Then test protected routes

# 3. Eligibility Check
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.yourdomain.com/api/monetization/eligibility

# 4. Revenue Data
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.yourdomain.com/api/revenue/ledger

# 5. Webhook Test
# Trigger test webhook from Stripe dashboard
# Verify it appears in /api/admin/monitoring
```

### Performance Tests

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Load test: 100 requests, 10 concurrent
ab -n 100 -c 10 -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.yourdomain.com/api/overview

# Expected: < 200ms response time, 0 failures
```

### Security Tests

```bash
# 1. Test rate limiting (send 150 requests rapidly)
for i in {1..150}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    https://api.yourdomain.com/api/overview
done

# Expected: First 100 return 200, rest return 429

# 2. Test invalid JWT
curl -H "Authorization: Bearer invalid.token.here" \
  https://api.yourdomain.com/api/overview
# Expected: 401 Unauthorized

# 3. Test missing webhook signature
curl -X POST https://api.yourdomain.com/api/webhooks/events \
  -H "Content-Type: application/json" \
  -d '{"test":true}'
# Expected: 401 Missing signature
```

---

## 📊 Monitoring Setup

### 1. Log Monitoring

```bash
# Watch real-time logs
docker-compose logs -f monetization-api

# View error logs only
tail -f logs/error.log

# Search for specific errors
grep "ERROR" logs/combined.log | tail -20
```

### 2. Resource Monitoring

```bash
# Container stats
docker stats monetization-service

# Should show:
# CPU < 50%, Memory < 256MB under normal load
```

### 3. Application Metrics

Track these KPIs:
- API response times (target: < 200ms p95)
- Error rate (target: < 1%)
- Rate limit hits (investigate if frequent)
- Webhook processing success rate (target: 100%)
- Database size growth

---

## 🔄 Maintenance Procedures

### Database Backup

```bash
# Manual backup
docker exec monetization-service cp /app/data/fingermobile.db /tmp/backup.db
docker cp monetization-service:/tmp/backup.db ./backups/$(date +%Y%m%d).db

# Automated backup script (add to crontab)
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
docker exec monetization-service cp /app/data/fingermobile.db /tmp/backup.db
docker cp monetization-service:/tmp/backup.db ${BACKUP_DIR}/fingermobile_${DATE}.db
find ${BACKUP_DIR} -name "*.db" -mtime +30 -delete  # Keep 30 days
```

### Log Rotation

Already configured in `middleware/logger.ts`:
- Max file size: 5MB
- Max files: 10 (combined), 5 (error)
- Automatic rotation

### Service Updates

```bash
# Pull latest code
git pull origin main

# Rebuild image
docker-compose build --no-cache

# Rolling restart (zero downtime)
docker-compose up -d --force-recreate monetization-api

# Verify new version
docker-compose logs monetization-api | grep "Server ready"
```

### Emergency Rollback

```bash
# Stop current version
docker-compose down

# Start previous version (if tagged)
docker-compose up -d monetization-api:previous-tag

# Or restore from backup
docker-compose down
rm data/fingermobile.db
cp backups/fingermobile_20260703.db data/fingermobile.db
docker-compose up -d
```

---

## 🚨 Troubleshooting

### Issue: Container won't start

```bash
# Check logs
docker-compose logs monetization-api

# Common causes:
# 1. Missing environment variables
# 2. Port already in use
# 3. Invalid JWT_SECRET format

# Fix: Check .env file, ensure all required vars set
```

### Issue: Database locked

```bash
# SQLite WAL mode should prevent this, but if occurs:
docker exec monetization-service rm /app/data/fingermobile.db-wal
docker exec monetization-service rm /app/data/fingermobile.db-shm
docker-compose restart monetization-api
```

### Issue: High memory usage

```bash
# Check for memory leaks
docker stats monetization-service

# If > 512MB, restart service
docker-compose restart monetization-api

# Monitor again
docker stats monetization-service
```

### Issue: Webhooks not received

```bash
# 1. Verify webhook signature matches
echo -n '{"test":true}' | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET"

# 2. Check webhook logs
grep "webhook" logs/combined.log | tail -20

# 3. Verify Stripe webhook URL is correct
# Check Stripe Dashboard → Webhooks → Endpoint URL
```

---

## ✅ Final Verification Checklist

Before going live:

- [ ] All environment variables configured securely
- [ ] Stripe integration tested with test mode
- [ ] HTTPS/TLS certificate installed
- [ ] Firewall rules configured (only ports 80/443 open)
- [ ] Database backup strategy tested
- [ ] Log monitoring configured
- [ ] Rate limiting verified working
- [ ] Authentication flow tested end-to-end
- [ ] Webhook signatures validated
- [ ] Load testing completed (< 200ms p95)
- [ ] Error handling verified (graceful degradation)
- [ ] Documentation updated
- [ ] Team trained on operations procedures
- [ ] Incident response plan documented
- [ ] Monitoring alerts configured

---

## 📞 Support Contacts

- **Platform Engineering**: engineering@fingermobileprotocol.com
- **Security Issues**: security@fingermobileprotocol.com
- **Stripe Support**: support@stripe.com
- **Emergency On-Call**: +1-XXX-XXX-XXXX

---

**Last Updated**: July 4, 2026  
**Version**: 1.0.0  
**Status**: Ready for Production ✅
