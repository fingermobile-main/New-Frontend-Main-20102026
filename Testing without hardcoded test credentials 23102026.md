# FingerMobile Platform: Clean Testing Architecture & LAN Connectivity Standard

This operational guide details the transition from hardcoded demo credentials to live database-driven authentication, the dual-mode environment feature toggle, credential backups, and multi-device LAN configuration.

---

## 1. Architectural Motivation: Why Clean Testing Is Mandatory

Relying on hardcoded credentials (such as 1-click pills on the login screen and bypass rules in backend routes) created blind spots during testing. Moving to clean database-backed authentication guarantees production fidelity:

* **Cryptographic & Database Authenticity:**
  * Hardcoded passwords bypassed `bcrypt.compare` via string matches (e.g., `mastercontrol123`, `admin123`).
  * Clean mode ensures every request executes real bcrypt salt/hash verification against the `users` table in PostgreSQL (`fingermobile_platform_db`).
* **Genuine User Onboarding & State Persistence:**
  * Mock accounts injected artificial state (`onboardingComplete: true`, pre-assigned roles).
  * Real testing exercises the blank-slate journey: registration, avatar upload, initial preference selection, and default permissions (`Member`).
* **Role-Based Access Control (RBAC) Validation:**
  * Tests that unauthorized regular accounts are denied access to `/admin/dashboard`, `StercsControlCenter`, and financial consoles.
* **Edge Case & Error Handling Coverage:**
  * Validates email/phone collisions, password complexity policies, rate-limiting, and JWT refresh cycles.

---

## 2. Dual-Mode Environment Feature Toggle

The platform implements a non-destructive feature flag enabling instantaneous switching between **Clean Testing Mode** (production behavior) and **Demo Prototyping Mode** (rapid testing with sample profiles).

### Configuration Variables

| Scope | File | Variable | Values |
| :--- | :--- | :--- | :--- |
| **Backend** | `FingerMobile Protocol/apps/backend/.env` | `ENABLE_DEMO_CREDENTIALS` | `false` (Clean) / `true` (Demo) |
| **Frontend** | `FingerMobile Protocol/apps/frontend-main/.env` | `REACT_APP_ENABLE_DEMO_CREDENTIALS` | `false` (Clean) / `true` (Demo) |

### Mode Comparison

```
+------------------------------------+------------------------------------------+
| Clean Testing Mode (Default)       | Demo / Prototyping Mode                  |
| ENABLE_DEMO_CREDENTIALS=false      | ENABLE_DEMO_CREDENTIALS=true             |
+------------------------------------+------------------------------------------+
| - Login pills completely hidden    | - 1-click demo pills displayed           |
| - Password bypasses deactivated    | - Quick-fill credentials enabled         |
| - TOTP / SMS bypass deactivated    | - Demo OTP codes (123456, 000000) active |
| - Real PostgreSQL lookup required  | - In-memory fallback allowed if DB down  |
| - Real bcrypt comparison enforced  | - Instant role & state injection         |
+------------------------------------+------------------------------------------+
```

---

## 3. Fast Switching Quick Reference

### To Switch to Clean Testing Mode (Recommended for QA & Production)
1. In `FingerMobile Protocol/apps/backend/.env`:
   ```bash
   ENABLE_DEMO_CREDENTIALS=false
   ```
2. In `FingerMobile Protocol/apps/frontend-main/.env`:
   ```bash
   REACT_APP_ENABLE_DEMO_CREDENTIALS=false
   ```
3. Restart frontend and backend services.

### To Switch to Demo / Prototyping Mode
1. In `FingerMobile Protocol/apps/backend/.env`:
   ```bash
   ENABLE_DEMO_CREDENTIALS=true
   ```
2. In `FingerMobile Protocol/apps/frontend-main/.env`:
   ```bash
   REACT_APP_ENABLE_DEMO_CREDENTIALS=true
   ```
3. Restart frontend and backend services. The 1-click login pills will reappear immediately.

---

## 4. Preservation & Restoration of Legacy Test Accounts

All legacy mock accounts and configurations have been isolated and preserved across three safeguards:

1. **Dedicated Git Snapshot Branch:**
   ```bash
   git checkout backup/hardcoded-test-credentials
   ```
2. **Portable Git Patch File:**
   Located at `restore-hardcoded-test-credentials.patch`. Apply at any time with:
   ```bash
   git apply restore-hardcoded-test-credentials.patch
   ```
3. **Structured JSON Backup:**
   Located at `hardcoded-test-credentials-backup.json`. Contains complete profiles for all 6 demo identities:
   * Mr. Mbah Israel Obinna (SuperAdmin)
   * Mrs. Mbah Eunice Emonena (Admin)
   * System Admin
   * Test User
   * Luxury Creator
   * Premier Merchant
4. **Isolated Demo Module:**
   Maintained in `FingerMobile Protocol/apps/backend/config/demoUsers.js`. Only exports accounts when `ENABLE_DEMO_CREDENTIALS === 'true'`, keeping `auth.js` clean.

---

## 5. Dynamic LAN Hostname & Multi-Device Access Architecture

To enable external devices (PCs, laptops, tablets, smartphones) on the local area network to connect seamlessly without hardcoded IP overrides:

### A. Network Interface Binding (0.0.0.0)
* **Express Backend:** Binds to `0.0.0.0:5001`.
* **Webpack Frontend:** Configured in `.env` with `HOST=0.0.0.0` and `DANGEROUSLY_DISABLE_HOST_CHECK=true` on port `3000`.

### B. Dynamic LAN Subnet CORS Policy
`server.js` dynamically validates incoming origin requests against RFC 1918 private subnets:
* `192.168.0.0/16` (Home & Office standard LAN)
* `10.0.0.0/8` (Enterprise intranets)
* `172.16.0.0/12` (Private subnets)
* `localhost`, `127.0.0.1`, and `*.local` mDNS domains
* Credentials support: `Access-Control-Allow-Credentials: true`

### C. Client-Side Dynamic Hostname Detection
The frontend services dynamically query `window.location.hostname` instead of fixing `localhost`:
* `src/services/api.ts`
* `src/services/authService.ts`
* `src/services/apiService.ts`

When a client accesses `http://192.168.1.15:3000`, the frontend automatically routes all API requests to `http://192.168.1.15:5001/api`.

---

## 6. Verification & Health Audit Status

| Service / Test | Target URL | Expected Response | Verified Status |
| :--- | :--- | :--- | :--- |
| **Backend API Health (LAN)** | `http://192.168.1.15:5001/api/health` | `{"success":true,"message":"API is running smoothly"}` | Passed (200 OK) |
| **Backend API Health (Local)** | `http://localhost:5001/api/health` | `{"success":true,"message":"API is running smoothly"}` | Passed (200 OK) |
| **CORS Preflight (LAN)** | `OPTIONS http://192.168.1.15:5001/api/auth/login` | Header `Access-Control-Allow-Origin: http://192.168.1.15:3000` | Passed (200 OK) |
| **Authentic Password Login** | `POST .../api/auth/login` (Valid DB user) | Real JWT token + PostgreSQL user record | Passed (200 OK) |
| **Invalid Password Rejection** | `POST .../api/auth/login` (Wrong pass) | `{"success":false,"message":"Invalid password"}` | Passed (401 Unauthorized) |
| **Frontend Web App (LAN)** | `http://192.168.1.15:3000/login` | Clean Login UI (Pills Hidden) | Passed (200 OK) |
| **Frontend Web App (Local)** | `http://localhost:3000/login` | Clean Login UI (Pills Hidden) | Passed (200 OK) |
| **PostgreSQL Persistence** | Port `5433` (`fingermobile_platform_db`) | Authentic accounts validated with bcrypt | Active & Verified |
| **Auto-Commit Watcher** | Background Service | Continuous change tracking and safeguards | Active |

---

## 7. External Device Connection Quick-Start

To access the platform from any external PC, smartphone, or tablet on the same Wi-Fi / Local Network:

1. **Confirm Host IP:** Verify the host machine IP (e.g., `192.168.1.15`).
2. **Access Frontend Portal:** Open any modern browser on the client device and navigate to:
   * **Login:** `http://192.168.1.15:3000/login`
   * **Register New User:** `http://192.168.1.15:3000/register`
3. **API Health Check (Diagnostic):**
   * `http://192.168.1.15:5001/api/health`
