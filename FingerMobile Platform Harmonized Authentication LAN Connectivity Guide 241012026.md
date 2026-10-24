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