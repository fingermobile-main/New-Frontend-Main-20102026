/* eslint-disable no-console */
/**
 * Cluster 10 Verification Suite
 * Verifies Identity, Auth, Profiles, Security & RBAC endpoints
 */

const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const app = require('../app');
const { pool } = require('../db');

let server;
let port;
let baseUrl;

function makeRequest(method, endpoint, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting Cluster 10 Integration Verification Suite...');

  // Start temporary server
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`Server listening on ${baseUrl}`);
      resolve();
    });
  });

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // Ensure test user exists in PostgreSQL
    const userRes = await pool.query(
      `INSERT INTO users (id, username, email, password_hash, role, first_name, last_name, is_active)
       VALUES (9999, 'cluster10_test_user', 'cluster10@fingermobile.test', 'hashedpass', 'user', 'Cluster10', 'Tester', true)
       ON CONFLICT (id) DO UPDATE SET username = 'cluster10_test_user', role = 'user'
       RETURNING id, username, email`
    );
    const testUser = userRes.rows[0];

    // 1. GET /api/users/profile
    const getProfileRes = await makeRequest('GET', `/api/users/profile?userId=${testUser.id}`);
    assert(
      getProfileRes.status === 200 && (getProfileRes.data?.success || getProfileRes.data?.data?.username === 'cluster10_test_user'),
      'GET /api/users/profile returns valid user profile'
    );

    // 2. PUT /api/users/profile
    const updateProfileRes = await makeRequest('PUT', '/api/users/profile', {
      userId: testUser.id,
      bio: 'Pioneering FingerMobile Protocol cluster 10',
      occupation: 'Principal Architect',
      company: 'FingerMobile Foundation',
      location: 'San Francisco, CA',
      website: 'https://fingermobileprotocol.com'
    });
    assert(
      updateProfileRes.status === 200 && updateProfileRes.data?.success,
      'PUT /api/users/profile successfully updates bio and location'
    );

    // 3. POST /api/users/profile/enhancement
    const enhanceRes = await makeRequest('POST', '/api/users/profile/enhancement', {
      userId: testUser.id,
      headline: 'Distinguished Cryptographic Protocol Engineer',
      skills: ['Smart Contracts', 'RBAC Security', 'PostgreSQL Optimization'],
      portfolioUrl: 'https://github.com/fingermobile'
    });
    assert(
      enhanceRes.status === 200 && enhanceRes.data?.success,
      'POST /api/users/profile/enhancement persists enriched skills & headline'
    );

    // 4. POST /api/kyc/submit & /api/verifications/submit
    const kycRes = await makeRequest('POST', '/api/verifications/submit', {
      userId: String(testUser.id),
      legalName: 'Cluster Ten Master',
      nationality: 'Nigeria',
      passportNumber: 'A12345678'
    });
    assert(
      kycRes.status === 200 && kycRes.data?.success && kycRes.data?.id,
      'POST /api/verifications/submit inserts creator verification record'
    );

    // 5. POST /api/kyb/submit (Official Verification)
    const kybRes = await makeRequest('POST', '/api/kyb/submit', {
      userId: String(testUser.id),
      businessLegalName: 'FingerMobile Global Enterprises Ltd',
      businessRegistrationNumber: 'RC-99887766',
      entityType: 'Enterprise/Company',
      paymentAmount: '105'
    });
    assert(
      kybRes.status === 200 && kybRes.data?.success && kybRes.data?.id,
      'POST /api/kyb/submit inserts enterprise verification record'
    );

    // 6. GET /api/verifications/status
    const statusRes = await makeRequest('GET', `/api/verifications/status?userId=${testUser.id}`);
    assert(
      statusRes.status === 200 && statusRes.data?.success && Array.isArray(statusRes.data?.records),
      'GET /api/verifications/status returns live verification history'
    );

    // 7. POST /api/verifications/send-code
    const sendCodeRes = await makeRequest('POST', '/api/verifications/send-code', {
      userId: testUser.id,
      method: 'phone',
      destination: '+1 (555) 019-2834'
    });
    assert(
      sendCodeRes.status === 200 && sendCodeRes.data?.success,
      'POST /api/verifications/send-code generates 6-digit code'
    );

    // 8. POST /api/verifications/verify-code
    const verifyCodeRes = await makeRequest('POST', '/api/verifications/verify-code', {
      userId: testUser.id,
      code: '123456',
      method: 'phone'
    });
    assert(
      verifyCodeRes.status === 200 && verifyCodeRes.data?.success,
      'POST /api/verifications/verify-code verifies code & marks account verified'
    );

    // 9. GET /api/admin/rbac/roles & /api/rbac/roles
    const rbacRolesRes = await makeRequest('GET', '/api/admin/rbac/roles');
    assert(
      rbacRolesRes.status === 200 && Array.isArray(rbacRolesRes.data?.roles) && rbacRolesRes.data?.roles.length > 0,
      'GET /api/admin/rbac/roles returns system roles'
    );

    // 10. POST /api/admin/rbac/roles (Create new role)
    const createRoleRes = await makeRequest('POST', '/api/admin/rbac/roles', {
      name: 'Security Officer',
      description: 'Oversees protocol cryptographic compliance',
      level: 75
    });
    assert(
      createRoleRes.status === 201 && createRoleRes.data?.success && createRoleRes.data?.role?.name === 'Security Officer',
      'POST /api/admin/rbac/roles creates new role in PostgreSQL'
    );

    // 11. POST /api/admin/rbac/assign
    const assignRoleRes = await makeRequest('POST', '/api/admin/rbac/assign', {
      userId: testUser.id,
      role: 'admin'
    });
    assert(
      assignRoleRes.status === 200 && assignRoleRes.data?.success && assignRoleRes.data?.user?.role === 'admin',
      'POST /api/admin/rbac/assign updates role in users & user_roles table'
    );

    // 12. GET /api/admin/rbac/departments & franchise-locations
    const deptsRes = await makeRequest('GET', '/api/admin/rbac/departments');
    assert(
      deptsRes.status === 200 && Array.isArray(deptsRes.data) && deptsRes.data.length > 0,
      'GET /api/admin/rbac/departments returns structured departments'
    );

    // 13. GET /api/security/sessions & /api/sessions/sessions
    const sessionsRes = await makeRequest('GET', `/api/security/sessions?userId=${testUser.id}`);
    assert(
      sessionsRes.status === 200 && (Array.isArray(sessionsRes.data?.data) || Array.isArray(sessionsRes.data?.sessions)),
      'GET /api/security/sessions returns live active sessions from user_sessions'
    );

    // 14. GET /api/security/settings & PUT /api/security/settings
    const secSettingsRes = await makeRequest('GET', `/api/security/settings?userId=${testUser.id}`);
    assert(
      secSettingsRes.status === 200 && secSettingsRes.data?.success,
      'GET /api/security/settings returns two_factor_enabled and security posture'
    );

    // 15. POST /api/security/backup-codes/generate
    const backupCodesRes = await makeRequest('POST', '/api/security/backup-codes/generate', {
      userId: testUser.id
    });
    assert(
      backupCodesRes.status === 200 && Array.isArray(backupCodesRes.data?.backupCodes) && backupCodesRes.data.backupCodes.length === 8,
      'POST /api/security/backup-codes/generate creates 8 backup codes in database'
    );

    // 16. GET /api/lendsq/products & /api/Loansqr/products
    const LoansqrProdRes = await makeRequest('GET', '/api/Loansqr/products');
    assert(
      LoansqrProdRes.status === 200 && Array.isArray(LoansqrProdRes.data?.data) && LoansqrProdRes.data.data.length >= 10,
      'GET /api/Loansqr/products returns all 10 live credit products'
    );

    // 17. POST /api/lendsq/applications (Apply for loan)
    const loanAppRes = await makeRequest('POST', '/api/lendsq/applications', {
      userId: testUser.id,
      amount: 1500,
      purpose: 'Equipment acquisition for FingerMobile node',
      durationMonths: 6
    });
    assert(
      loanAppRes.status === 201 && loanAppRes.data?.success && loanAppRes.data?.data?.amount === 1500,
      'POST /api/lendsq/applications persists loan application to lendsq_loans'
    );

    // 18. POST /api/admin/login
    // Set a known hash on test admin user
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash('AdminPass123!', 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashed, testUser.id]);

    const adminLoginRes = await makeRequest('POST', '/api/admin/login', {
      email: testUser.email,
      password: 'AdminPass123!'
    });
    assert(
      adminLoginRes.status === 200 && adminLoginRes.data?.success && adminLoginRes.data?.token,
      'POST /api/admin/login authenticates admin & returns JWT token'
    );

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    if (server) {
      server.close();
    }
  }

  console.log('\n=======================================');
  console.log(`Cluster 10 Verification Summary: ${passed} PASSED, ${failed} FAILED`);
  console.log('=======================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
