# FingerMobile Platform Structure 19082026

## Overview
This document provides a high-level overview of the FingerMobile Protocol Communication platform's directory structure and key technologies used, to aid in navigation and development.

## Root Directory
The project root contains various configuration files (`.env.*`, `.git`, `.vscode`), documentation files (`.md`), and a main application directory.

### Key Directories at Root
- `.dart_tool/`, `pubspec.yaml`, `pubspec.lock`: Indicate potential Flutter elements.
- `ARCHIVES/`: Contains archived versions of frontend/backend code.
- `FingerMobile Business and Monetization Suite/`: Separate business suite codebase.
- `FingerMobile Protocol/`: **Main application directory (explored below).**
- `Optimized FingerMobile/`: Potentially optimized version of the platform.
- `config/`, `node_modules/`: Global configuration and modules (likely for scripts/tools).

## Main Application: `FingerMobile Protocol/`
Located at `/path/to/FingerMobile Protocol Communication/FingerMobile Protocol/`

### Key Files
- `docker-compose.yml`: Docker Compose configuration for the platform.
- `Start Up Instructions new 17082026.md`: Startup instructions.
- `README.md`: High-level project overview.

### Key Subdirectories
- `apps/`: Contains numerous sub-applications, including the main backend and frontend.
- `nginx/`: Nginx configuration.
- `database/`: Database-related scripts.
- `backups/`: Backup directory.

## Core Applications: `FingerMobile Protocol/apps/`
This directory houses multiple applications, but the core platform consists of:

### Backend: `backend/`
- **Type:** Node.js application
- **Framework:** Express.js with Sequelize ORM
- **Language:** JavaScript/TypeScript
- **Entry Point:** `server.js`
- **Configuration:**
  - `package.json`: Dependencies and scripts (`npm run dev`, `npm run start`).
  - `tsconfig.json`: TypeScript compiler options.
  - `.env*`: Environment configuration files.
- **Key Directories:**
  - `routes/`: API route definitions (e.g., `auth.js`).
  - `controllers/`: Request handling logic.
  - `models/`: Database models (Sequelize).
  - `services/`: Business logic modules.
  - `middleware/`: Express middleware.
  - `db/`: Database connection pools (`db.js` defines `identityDb`, `contentDb`, etc.).
  - `utils/`: Utility functions.
  - `config/`: Configuration modules.

### Frontend: `frontend-main/`
- **Type:** React application
- **Framework:** React with `react-router-dom` for routing
- **Build Tool:** `react-scripts` (Create React App)
- **Language:** TypeScript
- **Configuration:**
  - `package.json`: Dependencies and scripts (`npm start`, `npm run build`).
  - `tsconfig.json`: TypeScript options, defines path alias `@/*` -> `./src/*`.
  - `tailwind.config.js`: Tailwind CSS configuration.
  - `.eslintrc.json`: ESLint configuration.
- **Key Directories:**
  - `public/`: Static assets.
  - `src/`: Source code (explored below).
  - `node_modules/`: Installed dependencies.

#### Frontend Source: `frontend-main/src/`
- **Routing:** `App.tsx` uses `react-router-dom` and lazy loads pages from the `routes/` directory.
- **Key Directories:**
  - `routes/`: Contains the active `LoginPage.tsx` and `ChangePasswordPage.tsx`.
  - `pages/`: Contains an alternative set of pages (currently only `ChangePasswordPage.tsx` and `_app.tsx`).
  - `components/`: Reusable UI components.
  - `contexts/`: React Context providers (e.g., `AuthContext.tsx`).
  - `services/`: API and business logic services (e.g., `authService.ts`, `api.ts`).
  - `icons/`: Icon components.
  - `types/`: TypeScript type definitions.
  - `utils/`: Utility functions.

## Key Integration Points
- **Authentication Flow:** The `LoginPage.tsx` in `routes/` is responsible for collecting credentials (email, phone, password) and sending them to the backend's `/api/auth/login` endpoint (handled by `routes/auth.js`).
- **Database Access:** The backend's `routes/auth.js` was modified to use the shared `identityDb` pool from `db/db.js` to ensure it queries the correct database where user accounts are stored.
- **Import Paths:** The frontend uses absolute import paths prefixed with `@/` (e.g., `@/components/...`, `@/services/...`) based on the `tsconfig.json` alias.