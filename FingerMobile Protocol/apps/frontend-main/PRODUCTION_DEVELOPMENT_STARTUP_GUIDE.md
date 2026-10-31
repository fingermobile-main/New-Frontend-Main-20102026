# FingerMobile Platform Production Development Servers Startup Guide

## Overview
This guide provides the correct procedure for starting the FingerMobile Platform production development servers. This document serves as the authoritative reference for platform developers to properly launch the development environment.

## Platform Architecture instructions for use
/Users/user/Documents/FingerMobile Protocol Communication/AGENTS.md

### Main Platform Location
```
/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps
```
## Git 
https://github.com/fingermobile-main/New-Frontend-Main-20102026

### Key Components
- **Backend**: `.../apps/backend` (Node.js/Express server running on port 5001)
- **Frontend**: `.../apps/frontend-main` (React/Next.js application running on port 3000)
- **Admin Dashboard**: `.../apps/admin-dashboard`
- **Mobile Apps**: `.../apps/fingermobile-mobile-apps`
- **Desktop**: `.../apps/fingermobile-desktop`

### Standalone Entities (NOT Part of Main Platform)
- **FingerMobile Business and Monetization Suite**: Independent microservice located at
  ```
  /Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Business and Monetization Suite
  ```

## Prerequisites

Before starting the development servers, ensure you have:

1. Node.js (v18 or higher)
2. npm package manager
3. Docker Desktop (if planning to use Docker Compose for production)
4. PostgreSQL database (for full functionality), Initialize all 15 platform databases specified in POSTGRES_MULTIPLE_DATABASES directly in fingermobile_postgres (including fingermobile_comms, fingermobile_business_db, fingermobile_identity_db, etc.). Both communications_service and business_suite_api reconnected immediately.
5. Redis server (for caching and session management)

## Startup Procedures

### Step 1: Initialize Auto-Commit Watcher (Mandatory)
At every new session start, run the auto-commit watcher service:
```bash
cd "/Users/user/Documents/FingerMobile Protocol Communication"
node auto commit watcher-git-commit-watcher.js
```
This service automatically commits changes in `./src/pages` every 10 minutes locally.

#### Important: ensure that upon starting the Production Development Servers and Services that you Start the Backend API Server., Launch the backend Node/Express server in apps/backend so it listens on the right available port XXXX and connects to PostgreSQL on right available port XXXX. Ensure Frontend Endpoints Route to the Backend (wired frontend to backend)., make sure the Decommissioned LocalStorage Shim is not what is persisting and ensure to Remove the client-only localStorage fallback so that when you upload media., Browser sends multipart/form-data to Express backend. start the backend API and connect the upload and feed services directly to PostgreSQL now so all data saves to the database and always verify and confirm that the Backend Express API Started & Connected to PostgreSQL before proceeding and starting the Frontend.

### Step 2: Start Backend Server
Open a terminal and navigate to the backend directory:
```bash
cd "/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/backend"
```

Install dependencies (if not already installed):
```bash
npm install
```

Start the backend server:
```bash
npm run dev
```

Expected output: Server running on `http://localhost:5001`

### Step 3: Start Frontend Server
Open a new terminal and navigate to the frontend directory:
```bash
cd "/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/frontend-main"
```

Install dependencies (if not already installed):
```bash
npm install
```

Start the frontend development server:
```bash
npm start
```

Expected output: Development server running on `http://localhost:3000` with proxy to backend

### Step 4: Verify Platform Operation
1. Open Google Chrome and navigate to `http://localhost:3000`
2. Verify the platform loads correctly
3. Check that API calls to the backend (http://localhost:5001) are functioning
4. Confirm all platform features are accessible

## Development vs Production Execution

### Development Mode (Current Setup)
- Start development servers manually using `npm run dev` in `apps/backend` and `npm start` in `apps/frontend-main`
- Use ports 5001 (backend) and 3000 (frontend)
- Access via Google Chrome and IDE Preview for real-time testing

### Production Mode (When deploying)
- Deployed via Docker using `docker compose up` (only when transitioning fully to production)
- Do NOT run `docker compose up` during development

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - These appear as "ECONNREFUSED" errors during development
   - This is expected in development mode and doesn't prevent the server from starting
   - The server continues in development mode without database connection

2. **Port Already in Use**
   - If port 3000 or 5001 is already in use, terminate the existing processes
   - Use `lsof -ti:3000` or `lsof -ti:5001` to identify processes and `kill` to terminate

3. **Missing Dependencies**
   - Run `npm install` in both backend and frontend directories if encountering module errors

### Health Checks
- Backend health endpoint: `http://localhost:5001/health`
- Frontend should load at: `http://localhost:3000`

## Platform Policy: Zero Error Margin
- No TypeScript errors
- No syntax errors
- No lint errors
- No problems or warnings whatsoever
- No trailing spaces
- No whitespaces at the end of lines

#### CSS Issues: 
/Users/user/Documents/FingerMobile Protocol Communication/TEXT CSS Rule Persistence & Component Refactoring 14102026.md

## Web Testing with Chrome

To set up automated web testing with Chrome:
```bash
cd "/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps/frontend-main"
npm install --save-dev puppeteer
```

Create test files in the `tests/` directory to automate browser interactions and verify platform functionality.

## Key Architecture Guidelines

1. **Main Platform Scope** (`/FingerMobile Protocol/apps/`)
   - Main web application: `apps/frontend-main/` (React/Next.js)
   - Core API server: `apps/backend/` (Node.js/Express)
   - Microservices & entities: GameOn, FingerLux, Flamingo, FingerWars, trends, gems, beatwaveng, camus, etc.

2. **Standalone Monetization Suite Isolation**
   - `FingerMobile Business and Monetization Suite/` is an independent standalone entity
   - Should not be confused with the core platform backend/frontend codebase

## Verification Checklist

Before starting development work, verify: Initialized all 15 platform databases specified in POSTGRES_MULTIPLE_DATABASES directly in fingermobile_postgres (including fingermobile_comms, fingermobile_business_db, fingermobile_identity_db, etc.). Both communications_service and business_suite_api reconnected immediately.
- [ ] Backend server running on `http://localhost:5001`
- [ ] Frontend server running on `http://localhost:3000`
- [ ] Platform loads correctly in Chrome
- [ ] Auto-commit watcher service running
- [ ] API endpoints accessible
- [ ] Backend is Connected to PostgreSQL and confirmed persisting data to PostgreSQL
- [ ] All core features and microservices are fully functional
- [ ] Remove the client-only localStorage fallback so that when you upload media., Browser sends multipart/form-data to Express backend.
- [ ] Ensure Frontend and Backend wire up correctly with API Calls and Communication. Make sure all endpoints route correctly.
- [ ] Always verify and confirm that the Backend Express API Started & Connected to PostgreSQL before proceeding and starting the Frontend.



## Notes

- This startup procedure is for development purposes only
- For production deployments, follow the Docker Compose procedures
- Always refer to this document for the correct startup sequence
- The FingerMobile Business and Monetization Suite is a separate entity and not part of the main platform
- Maintain separation between development and production workflows

## Document Version
- Last Updated: October 10, 2026
- Authoritative Reference: CRITICAL NEW SESSION STARTUP PROCEDURE INFORMATION INSTRUCTIONS 30092026.md


FingerMobile Platform: Harmonized Authentication & LAN Connectivity Guide
The documentation has been consolidated and structured into your active document: 

Testing without hardcoded test credentials 23102026.md
.

Below is the harmonized operational reference.

1. Dual-Mode Feature Flag Reference
The platform supports switching between Clean Testing Mode (authentic database operations) and Demo Prototyping Mode (sample pills and rapid-test fallbacks) via environment variables without code modifications.

Mode	Backend (apps/backend/.env)	Frontend (apps/frontend-main/.env)	Behavior
Clean Testing Mode (Recommended)	ENABLE_DEMO_CREDENTIALS=false	REACT_APP_ENABLE_DEMO_CREDENTIALS=false	Pills hidden; password bypasses disabled; real bcrypt & PostgreSQL validation enforced.
Demo Prototyping Mode	ENABLE_DEMO_CREDENTIALS=true	REACT_APP_ENABLE_DEMO_CREDENTIALS=true	1-click pills appear; quick demo accounts active; demo OTP codes (123456, 000000) allowed.

2. Code Safeguards & Credential Backups
All original demo accounts and configuration bypasses are preserved:

Snapshot Git Branch:
bash
git checkout backup/hardcoded-test-credentials
Git Patch File: 

restore-hardcoded-test-credentials.patch
bash
git apply restore-hardcoded-test-credentials.patch
JSON Profile Backup: 

hardcoded-test-credentials-backup.json
 (contains all 6 profiles: SuperAdmin, Admin, System Admin, Test User, Luxury Creator, Premier Merchant).
Isolated Modular Loader: 

demoUsers.js
 (exports empty array when ENABLE_DEMO_CREDENTIALS=false, preventing inline dictionary bloat in 

auth.js
).

3. Dynamic LAN & Multi-Device Access
External devices on the local area network connect directly without hardcoding IPs:

0.0.0.0 Interface Binding:
Backend Express listens on 0.0.0.0:5001 in 

server.js
.
Frontend listens on 0.0.0.0:3000 (HOST=0.0.0.0 in .env).
Dynamic CORS Subnet Validator: Allows RFC 1918 subnets (192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12), localhost, and .local mDNS domains with credentials enabled.
Dynamic Client-Side Hostname Resolution:

api.ts

authService.ts

apiService.ts
Automatically detects window.location.hostname (e.g., 192.168.1.15) and directs API traffic to port 5001.

4. Health & Verification Status
Service / Test	Target URL	Expected Result	Verified Status
Backend Express Health	http://192.168.1.15:5001/api/health	{"success":true,"message":"API is running smoothly"}	Passed (200 OK)
Backend Express Local	http://localhost:5001/api/health	{"success":true,"message":"API is running smoothly"}	Passed (200 OK)
LAN CORS Preflight	OPTIONS http://192.168.1.15:5001/api/auth/login	Header Access-Control-Allow-Origin: http://192.168.1.15:3000	Passed (200 OK)
Authentic Password Login	POST http://192.168.1.15:5001/api/auth/login	Real token + PostgreSQL user record	Passed (200 OK)
Invalid Password Rejection	POST http://192.168.1.15:5001/api/auth/login	{"success":false,"message":"Invalid password"}	Passed (401 Unauthorized)
Frontend UI (LAN)	http://192.168.1.15:3000/login	Clean Login UI (Pills Hidden)	Passed (200 OK)
Frontend UI (Local)	http://localhost:3000/login	Clean Login UI (Pills Hidden)	Passed (200 OK)
PostgreSQL Database	Port 5433 (fingermobile_platform_db)	Authentic accounts validated with bcrypt	Active & Connected
Auto-Commit Watcher	Background Process	Real-time code change tracking	Active

5. External Device Connection Checklist
To connect from any external PC, smartphone, or tablet on the same Wi-Fi:

Web App: Navigate to http://192.168.1.15:3000/login
Registration: Navigate to http://192.168.1.15:3000/register
API Diagnostics: Navigate to http://192.168.1.15:5001/api/health


#### STARTUP INSTRUCTION SCRIPT 26.10.2026
Yes, absolutely! You can run it directly in your IDE Terminal right now.
/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Startup Script 26102026
Make sure you do not paste the code of the script into the terminal. Instead, simply enter this single command:

bash
./"FingerMobile Startup Script 26102026"
Other Handy Ways to Run It
Using npm:

bash
npm run startup
Using the .sh alias:

bash
./"FingerMobile Startup Script 26102026.sh"
Via the IDE Menu (No typing needed):

Press Cmd + Shift + P
Type Tasks: Run Task and press Enter
Select FingerMobile: Start Development Platform (26102026)
Useful Flags:

Quick health audit without starting:
bash
./"FingerMobile Startup Script 26102026" --status
Stop running dev servers and watcher:
bash
./"FingerMobile Startup Script 26102026" --stop
1:38 PM

or in the mac terminal type the below: - cd "/Users/user/Documents/FingerMobile Protocol Communication" ./start-dev-lan.sh

Now proceed!!!
