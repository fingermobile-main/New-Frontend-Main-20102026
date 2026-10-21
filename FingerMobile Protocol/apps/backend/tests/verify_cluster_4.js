/* eslint-disable no-console */
/**
 * Verification Script for Cluster 4: Gifting, Social Influence, Rewards & Community
 * Tests all endpoints mounted in app.js against PostgreSQL
 */

const http = require('http');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');
const token = jwt.sign(
  { id: 4, userId: 4, username: 'moderator', role: 'admin' },
  JWT_SECRET,
  { expiresIn: '2h' }
);

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  const app = require('../app');
  const server = http.createServer(app);

  await new Promise(resolve => server.listen(3094, resolve));
  console.log('Test server running on port 3094');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const tests = [
    // LushPressies
    { name: 'GET /api/lushpressies/posts', method: 'GET', path: '/api/lushpressies/posts', auth: false },
    { name: 'GET /api/lushpressies/lapidaires', method: 'GET', path: '/api/lushpressies/lapidaires', auth: false },
    { name: 'POST /api/lushpressies/pins/generate', method: 'POST', path: '/api/lushpressies/pins/generate', body: { targetMemberId: '1' }, auth: true },

    // Creator Influence
    { name: 'GET /api/creator-influence/tiers', method: 'GET', path: '/api/creator-influence/tiers', auth: false },
    { name: 'POST /api/creator-influence/recommend/4', method: 'POST', path: '/api/creator-influence/recommend/4', body: { followers_count: 5000, engagement_rate: 4.5 }, auth: true },
    { name: 'POST /api/creator-influence', method: 'POST', path: '/api/creator-influence', body: { member_id: 4, subscription_level: 'rising_creator', subscription_type: 'monthly', auto_renew: true }, auth: true },
    { name: 'GET /api/creator-influence/member/4', method: 'GET', path: '/api/creator-influence/member/4', auth: true },

    // KYC / Verification
    { name: 'POST /api/kyc/submit', method: 'POST', path: '/api/kyc/submit', body: { legalName: 'Test Creator', nationality: 'NG', passportNumber: 'A12345678' }, auth: true },

    // Ownit
    { name: 'GET /api/ownit/orders', method: 'GET', path: '/api/ownit/orders', auth: false },
    { name: 'GET /api/ownit/categories', method: 'GET', path: '/api/ownit/categories', auth: false },

    // Flamingo
    { name: 'GET /api/flamingo/categories', method: 'GET', path: '/api/flamingo/categories', auth: false },

    // Publicitee
    { name: 'GET /api/publicitee/feed', method: 'GET', path: '/api/publicitee/feed', auth: false },
    { name: 'GET /api/publicitee/subscription/status', method: 'GET', path: '/api/publicitee/subscription/status', auth: true },

    // Permanence
    { name: 'GET /api/permanence/challenges', method: 'GET', path: '/api/permanence/challenges', auth: false },
    { name: 'GET /api/permanence/streams', method: 'GET', path: '/api/permanence/streams', auth: false },

    // Mii
    { name: 'GET /api/mii/avatars', method: 'GET', path: '/api/mii/avatars', auth: true },
    { name: 'GET /api/mii/templates', method: 'GET', path: '/api/mii/templates', auth: true },
    { name: 'GET /api/mii/items', method: 'GET', path: '/api/mii/items', auth: true },
    { name: 'GET /api/mii/activity/presence', method: 'GET', path: '/api/mii/activity/presence', auth: true },

    // Members & Community
    { name: 'GET /api/members', method: 'GET', path: '/api/members', auth: true },
    { name: 'GET /api/communities', method: 'GET', path: '/api/communities', auth: false },
    { name: 'GET /api/clubs', method: 'GET', path: '/api/clubs', auth: false },
    { name: 'GET /api/events', method: 'GET', path: '/api/events', auth: false },

    // Polls & Forums
    { name: 'GET /api/polls', method: 'GET', path: '/api/polls', auth: false },
    { name: 'POST /api/polls/1/vote', method: 'POST', path: '/api/polls/1/vote', body: { optionIndex: 0 }, auth: true },
    { name: 'GET /api/forums/categories', method: 'GET', path: '/api/forums/categories', auth: false }
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const opts = {
        hostname: 'localhost',
        port: 3094,
        path: t.path,
        method: t.method,
        headers: t.auth ? headers : { 'Content-Type': 'application/json' }
      };

      const res = await request(opts, t.body);
      const isOk = res.status >= 200 && res.status < 300;
      if (isOk) {
        console.log(`[PASS] ${t.name} -> HTTP ${res.status}`);
        passed++;
      } else {
        console.error(`[FAIL] ${t.name} -> HTTP ${res.status}:`, JSON.stringify(res.data || res.text));
        failed++;
      }
    } catch (err) {
      console.error(`[ERROR] ${t.name}:`, err.message);
      failed++;
    }
  }

  console.log('\n========================================');
  console.log(`Cluster 4 Test Suite Results: ${passed} Passed, ${failed} Failed (${tests.length} total)`);
  console.log('========================================\n');

  server.close();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
