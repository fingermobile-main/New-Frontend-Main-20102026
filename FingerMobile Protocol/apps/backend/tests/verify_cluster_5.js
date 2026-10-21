/* eslint-disable no-console */
/**
 * Verification Script for Cluster 5: Forums, Posts, Blogs & Content Creation Studio
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

  await new Promise(resolve => server.listen(3095, resolve));
  console.log('Test server running on port 3095');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const tests = [
    // 1. Forum Categories
    { name: 'GET /api/forums/categories', path: '/api/forums/categories', method: 'GET', auth: false },
    // 2. Forum Censor
    { name: 'POST /api/forums/censor', path: '/api/forums/censor', method: 'POST', body: { text: 'Testing clean forum text' }, auth: false },
    // 3. Forum Posts
    { name: 'GET /api/forums/posts', path: '/api/forums/posts', method: 'GET', auth: true },
    // 4. Posts Feed
    { name: 'GET /api/posts', path: '/api/posts', method: 'GET', auth: true },
    // 5. Create Post
    { name: 'POST /api/posts', path: '/api/posts', method: 'POST', body: { title: 'Cluster 5 Test Post', content: 'Test post for Cluster 5 verification' }, auth: true },
    // 6. Blogs Feed
    { name: 'GET /api/blogs', path: '/api/blogs', method: 'GET', auth: false },
    // 7. Create Blog
    { name: 'POST /api/blogs', path: '/api/blogs', method: 'POST', body: { title: 'Test Blog Post', content: 'Comprehensive content for automated testing.', status: 'published' }, auth: true },
    // 8. Blog Templates
    { name: 'GET /api/blog-templates', path: '/api/blog-templates', method: 'GET', auth: false },
    // 9. Trends Feed
    { name: 'GET /api/trends', path: '/api/trends', method: 'GET', auth: false },
    // 10. Trending Hashtags
    { name: 'GET /api/trends/hashtags', path: '/api/trends/hashtags', method: 'GET', auth: false },
    // 11. Trending Topics
    { name: 'GET /api/trends/topics', path: '/api/trends/topics', method: 'GET', auth: false },
    // 12. Content Management
    { name: 'GET /api/content-management', path: '/api/content-management', method: 'GET', auth: true },
    // 13. Studio Editor Status
    { name: 'GET /api/editor/status', path: '/api/editor/status', method: 'GET', auth: true },
    // 14. Studio Editor Member Projects
    { name: 'GET /api/editor/projects', path: '/api/editor/projects', method: 'GET', auth: true }
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const opts = {
        hostname: 'localhost',
        port: 3095,
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
        console.log(`[FAIL] ${t.name} -> HTTP ${res.status}:`, res.data || res.text);
        failed++;
      }
    } catch (err) {
      console.log(`[ERROR] ${t.name} ->`, err.message);
      failed++;
    }
  }

  console.log('\n========================================');
  console.log(`Cluster 5 Test Suite Results: ${passed} Passed, ${failed} Failed (${tests.length} total)`);
  console.log('========================================\n');

  server.close();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
