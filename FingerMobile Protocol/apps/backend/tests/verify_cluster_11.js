/**
 * Cluster 11 Integration Verification Suite
 * Admin, Moderation, Guardian & Operations
 */

const http = require('http');
const app = require('../app');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

let server;
let adminToken;
let moderatorToken;

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, headers: res.headers, body: parsed, rawBody: body });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: null, rawBody: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting Cluster 11 Integration Tests ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  PASS: ${message}`);
      passed++;
    } else {
      console.error(`  FAIL: ${message}`);
      failed++;
    }
  }

  const port = 5011;
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(port, resolve));
  console.log(`Test server running on port ${port}`);

  // Create test tokens
  adminToken = jwt.sign(
    { id: '11111111-1111-1111-1111-111111111111', username: 'admin_cluster11', role: 'super_admin', isAdmin: true, isModerator: true },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  moderatorToken = jwt.sign(
    { id: '22222222-2222-2222-2222-222222222222', username: 'mod_cluster11', role: 'moderator', isModerator: true },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const adminHeaders = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  };

  try {
    // 1. Prometheus / Metrics Endpoint
    const resMetrics = await request({
      hostname: 'localhost',
      port,
      path: '/metrics',
      method: 'GET'
    });
    assert(resMetrics.status === 200 && (resMetrics.rawBody.includes('http_') || resMetrics.rawBody.length > 0), '1. /metrics returns Prometheus metric data');

    // 2. Cache Management Stats
    const resCache = await request({
      hostname: 'localhost',
      port,
      path: '/api/cache-management/stats',
      method: 'GET'
    });
    assert(resCache.status === 200 && resCache.body && resCache.body.success, '2. /api/cache-management/stats returns cache telemetry');

    // 3. Cache Clear Action
    const resCacheClear = await request({
      hostname: 'localhost',
      port,
      path: '/api/cache-management/clear',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { pattern: '/*' });
    assert(resCacheClear.status === 200 && resCacheClear.body && resCacheClear.body.success, '3. /api/cache-management/clear triggers cache purge');

    // 4. Rate Limit Config
    const resRateLimit = await request({
      hostname: 'localhost',
      port,
      path: '/api/admin/rate-limits',
      method: 'GET'
    });
    assert(resRateLimit.status === 200 && resRateLimit.body && resRateLimit.body.success, '4. /api/admin/rate-limits returns rate limit configuration');

    // 5. Operations System Health Status
    const resHealth = await request({
      hostname: 'localhost',
      port,
      path: '/api/operations/system-status',
      method: 'GET'
    });
    assert(resHealth.status === 200 && resHealth.body && Array.isArray(resHealth.body.data) && resHealth.body.data.length > 0, '5. /api/operations/system-status returns system nodes');

    // 6. Operations Dashboard Aggregated Stats
    const resDashStats = await request({
      hostname: 'localhost',
      port,
      path: '/api/operations/dashboard-stats',
      method: 'GET'
    });
    assert(resDashStats.status === 200 && resDashStats.body && resDashStats.body.data.systemUptime >= 99, '6. /api/operations/dashboard-stats returns platform metrics');

    // 7. Moderation Queue
    const resModQueue = await request({
      hostname: 'localhost',
      port,
      path: '/api/moderation/queue',
      method: 'GET',
      headers: adminHeaders
    });
    assert(resModQueue.status === 200 && resModQueue.body && resModQueue.body.success, '7. /api/moderation/queue returns items');

    // 8. Moderation Stats
    const resModStats = await request({
      hostname: 'localhost',
      port,
      path: '/api/moderation/stats',
      method: 'GET',
      headers: adminHeaders
    });
    assert(resModStats.status === 200 && resModStats.body && resModStats.body.success, '8. /api/moderation/stats returns moderation metrics');

    // 9. Moderation Flamingo Approval items
    const resFlm = await request({
      hostname: 'localhost',
      port,
      path: '/api/moderation/flamingos',
      method: 'GET',
      headers: adminHeaders
    });
    assert(resFlm.status === 200 && resFlm.body && Array.isArray(resFlm.body.data), '9. /api/moderation/flamingos returns flamingo queue');

    // 10. Moderation Gem Approval items
    const resGems = await request({
      hostname: 'localhost',
      port,
      path: '/api/moderation/gems',
      method: 'GET',
      headers: adminHeaders
    });
    assert(resGems.status === 200 && resGems.body && Array.isArray(resGems.body.data), '10. /api/moderation/gems returns gem queue');

    // 11. Moderation Hallmark Approval items
    const resHallmarks = await request({
      hostname: 'localhost',
      port,
      path: '/api/moderation/hallmarks',
      method: 'GET',
      headers: adminHeaders
    });
    assert(resHallmarks.status === 200 && resHallmarks.body && Array.isArray(resHallmarks.body.data), '11. /api/moderation/hallmarks returns hallmark queue');

    // 12. User Reports
    const resReports = await request({
      hostname: 'localhost',
      port,
      path: '/api/moderation/reports',
      method: 'GET',
      headers: adminHeaders
    });
    assert(resReports.status === 200 && resReports.body && Array.isArray(resReports.body.data), '12. /api/moderation/reports returns user reports');

    // 13. Guardian Status
    const resGuardianStatus = await request({
      hostname: 'localhost',
      port,
      path: '/api/guardian/status',
      method: 'GET',
      headers: adminHeaders
    });
    assert(resGuardianStatus.status === 200 && resGuardianStatus.body && resGuardianStatus.body.data.status === 'operational', '13. /api/guardian/status returns sentinel status');

    // 14. Guardian Rules
    const resGuardianRules = await request({
      hostname: 'localhost',
      port,
      path: '/api/guardian/rules',
      method: 'GET',
      headers: adminHeaders
    });
    assert(resGuardianRules.status === 200 && resGuardianRules.body && Array.isArray(resGuardianRules.body.data) && resGuardianRules.body.data.length > 0, '14. /api/guardian/rules returns security rules');

    // 15. Sentient AI Status
    const resSentientStatus = await request({
      hostname: 'localhost',
      port,
      path: '/api/sentient/status',
      method: 'GET',
      headers: adminHeaders
    });
    assert(resSentientStatus.status === 200 && resSentientStatus.body && resSentientStatus.body.data.telemetryOnline, '15. /api/sentient/status returns behavioral engine status');

    // 16. Sentient AI Configs
    const resSentientConfigs = await request({
      hostname: 'localhost',
      port,
      path: '/api/sentient/configs',
      method: 'GET',
      headers: adminHeaders
    });
    assert(resSentientConfigs.status === 200 && resSentientConfigs.body && Array.isArray(resSentientConfigs.body.data), '16. /api/sentient/configs returns modules');

    // 17. Sentient AI Kill Switch Toggle
    const resKillSwitch = await request({
      hostname: 'localhost',
      port,
      path: '/api/sentient/toggle-kill-switch',
      method: 'POST',
      headers: adminHeaders
    }, { moduleKey: 'behavior_analyzer', engage: false });
    assert(resKillSwitch.status === 200 && resKillSwitch.body && resKillSwitch.body.success, '17. /api/sentient/toggle-kill-switch alters backend flag');

    // 18. Site Menus & Pages
    const resMenus = await request({
      hostname: 'localhost',
      port,
      path: '/api/operations/site/menus',
      method: 'GET'
    });
    const resPages = await request({
      hostname: 'localhost',
      port,
      path: '/api/operations/site/pages',
      method: 'GET'
    });
    assert(resMenus.status === 200 && resPages.status === 200 && Array.isArray(resMenus.body.data) && Array.isArray(resPages.body.data), '18. /api/operations/site/menus and pages return CMS records');

    // 19. Domains & Franchises
    const resDomains = await request({
      hostname: 'localhost',
      port,
      path: '/api/operations/domains',
      method: 'GET'
    });
    const resFranchises = await request({
      hostname: 'localhost',
      port,
      path: '/api/operations/franchises',
      method: 'GET'
    });
    assert(resDomains.status === 200 && resFranchises.status === 200 && Array.isArray(resDomains.body.data) && Array.isArray(resFranchises.body.data), '19. /api/operations/domains and franchises return active records');

    // 20. General Settings & Platform Billing
    const resSettings = await request({
      hostname: 'localhost',
      port,
      path: '/api/operations/settings',
      method: 'GET'
    });
    const resBilling = await request({
      hostname: 'localhost',
      port,
      path: '/api/operations/billing',
      method: 'GET'
    });
    assert(resSettings.status === 200 && resBilling.status === 200 && Array.isArray(resBilling.body.data), '20. /api/operations/settings and billing return operational data');

  } catch (error) {
    console.error('Test execution error:', error);
    failed++;
  } finally {
    server.close();
  }

  console.log(`\nCluster 11 Results: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
