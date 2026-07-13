# FingerMobile Protocol Platform - Deployment Guide

**Version**: 1.0  
**Date**: April 13, 2026  
**Status**: ✅ Ready for Deployment

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ running on port 5434
- Git (optional)

### One-Command Deploy

```bash
# Clone or navigate to the platform directory
cd "FINGERMOBILE HTML/platform pages html"

# Run the quick start script
chmod +x start.sh
./start.sh
```

That's it! The server will start on `http://localhost:3002`

---

## 📋 Detailed Deployment Steps

### Step 1: Database Setup

#### Option A: Automated Setup (Recommended)

```bash
# Make script executable
chmod +x setup-database.sh

# Run database setup
./setup-database.sh
```

This will:
1. Create the database `fingermobile_platform_db`
2. Apply the consolidated schema (tables: members, sessions, messages, fics_wallets)
3. Create all API functions and stored procedures
4. Create a test user with 1000 FIC

#### Option B: Manual Setup

```bash
# Create database
psql -h localhost -p 5434 -U postgres -c "CREATE DATABASE fingermobile_platform_db;"

# Apply schema
psql -h localhost -p 5434 -U postgres -d fingermobile_platform_db -f platform_consolidated_schema.sql

# Apply functions
psql -h localhost -p 5434 -U postgres -d fingermobile_platform_db -f api_database_functions.sql
```

#### Verify Database

```bash
psql -h localhost -p 5434 -U postgres -d fingermobile_platform_db -c "\dt"
psql -h localhost -p 5434 -U postgres -d fingermobile_platform_db -c "\df"
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- **express** - Web framework
- **pg** - PostgreSQL client
- **bcrypt** - Password hashing
- **jsonwebtoken** - Authentication tokens
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **helmet** - Security headers
- **morgan** - HTTP request logging
- **compression** - Response compression
- **express-rate-limit** - API rate limiting
- **express-validator** - Input validation

### Step 3: Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit with your values
nano .env  # or use your preferred editor
```

#### Required Environment Variables

```env
# Database (must match your PostgreSQL setup)
DB_HOST=localhost
DB_PORT=5434
DB_NAME=fingermobile_platform_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Secret (change in production!)
JWT_SECRET=your-secret-key-change-this

# Server
PORT=3002
NODE_ENV=development
```

### Step 4: Start Server

#### Development Mode (with auto-reload)

```bash
npm run dev
```

#### Production Mode

```bash
npm start
```

#### Verify Server

```bash
# Health check
curl http://localhost:3002/health

# Expected response:
# {"status":"ok","timestamp":"...","uptime":...,"environment":"development"}
```

### Step 5: Test API

```bash
# Register a test user
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "membername": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User"
  }'

# Login
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Save the session_token from response, then:
export TOKEN = process.env.TOKEN || "placeholder-TOKEN"

# Get wallet balance
curl http://localhost:3002/api/wallet/balance \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🌐 Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3002

# Use strong passwords
DB_PASSWORD=strong-random-password-here
JWT_SECRET=64-character-random-string-here

# Restrict CORS
CORS_ORIGIN=https://fingermobile.com

# Stricter rate limiting
RATE_LIMIT_MAX_REQUESTS=50
```

### Using PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start server.js --name fingermobile-api

# Save process list
pm2 save

# Setup startup script
pm2 startup
```

### Using Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3002

CMD ["node", "server.js"]
```

```bash
# Build image
docker build -t fingermobile-api .

# Run container
docker run -d \
  --name fingermobile-api \
  -p 3002:3002 \
  --env-file .env \
  fingermobile-api
```

### Using Docker Compose

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3002:3002"
    env_file: .env
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: fingermobile_platform_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5434:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./platform_consolidated_schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./api_database_functions.sql:/docker-entrypoint-initdb.d/02-functions.sql
    restart: unless-stopped

volumes:
  postgres_data:
```

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api
```

---

## 🔒 Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use strong database password
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (use nginx or cloud provider)
- [ ] Restrict CORS origins to your domain
- [ ] Set up rate limiting
- [ ] Enable helmet security headers
- [ ] Use environment variables for secrets (never commit .env)
- [ ] Set up database backups
- [ ] Monitor logs for errors
- [ ] Keep dependencies updated

---

## 📊 Monitoring

### Health Check Endpoint

```bash
curl http://localhost:3002/health
```

### View Logs

```bash
# Development
npm run dev

# Production with PM2
pm2 logs fingermobile-api

# Docker
docker logs -f fingermobile-api
```

### Database Stats

```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check active sessions
SELECT COUNT(*) FROM sessions WHERE expires_at > NOW();

-- Check wallet balances
SELECT COUNT(*), SUM(balance) FROM fics_wallets;
```

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5434

# Check connection
psql -h localhost -p 5434 -U postgres -c "SELECT 1;"
```

### Port Already in Use

```bash
# Find process using port 3002
lsof -i :3002

# Kill it
kill -9 <PID>
```

### Dependencies Installation Failed

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Returns 500 Error

```bash
# Check server logs
tail -f logs/error.log  # if configured

# Check database connection
npm run setup-db
```

---

## 📁 Project Structure

```
platform pages html/
├── server.js                    # Main server entry point
├── api-routes.js                # API route definitions
├── api-client.js                # Frontend API client
├── data-models.js               # Frontend data models
├── fm-utils.js                  # Frontend utilities
├── package.json                 # Node.js dependencies
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Environment template
├── setup-database.sh            # Database setup script
├── start.sh                     # Quick start script
├── platform_consolidated_schema.sql  # Database schema
├── api_database_functions.sql   # Stored procedures
└── DEPLOYMENT.md                # This file
```

---

## 🚀 Deployment Platforms

### Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create fingermobile-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### AWS EC2

```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone repo
git clone your-repo
cd fingermobile-api

# Install and start
npm install
npm start
```

---

## 📞 Support

### Documentation
- `API_INTEGRATION_GUIDE.md` - API usage guide
- `ROUTING_MAP.md` - Page routing
- `STYLE_GUIDE.md` - Design system
- `README.md` - Quick reference

### Common Commands

```bash
# Setup database
npm run setup-db

# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

---

## ✅ Deployment Verification Checklist

- [ ] PostgreSQL database created
- [ ] Schema applied successfully
- [ ] API functions created
- [ ] Dependencies installed
- [ ] .env configured
- [ ] Server starts without errors
- [ ] Health check responds
- [ ] Can register user
- [ ] Can login
- [ ] Can get wallet balance
- [ ] Can send message
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Error handling working
- [ ] Logs accessible
- [ ] Backups configured (production)

---

**Status**: ✅ Production Ready  
**Version**: 1.0  
**Last Updated**: April 13, 2026
