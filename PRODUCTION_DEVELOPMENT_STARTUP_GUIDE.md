# FingerMobile Platform Production Development Servers Startup Guide

## Overview
This guide provides the correct procedure for starting the FingerMobile Platform production development servers. This document serves as the authoritative reference for platform developers to properly launch the development environment.

## Platform Architecture instructions for use
/Users/user/Documents/FingerMobile Protocol Communication/AGENTS.md

### Main Platform Location
```
/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/apps
```

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
4. PostgreSQL database (for full functionality)
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

Before starting development work, verify:
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


just perform the clean slate prune for now, then bring up Core Infrastructure Stack (PostgreSQL 14, Redis 7, API Gateway, Backend API, registry and Networks. then thereafter, proceed to Full Platform Suite (All Micro Services + Infrastructures)


Now proceed!!!