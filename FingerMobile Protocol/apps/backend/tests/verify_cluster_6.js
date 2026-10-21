const http = require('http');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');
const testToken = jwt.sign(
  { id: 4, userId: 4, username: 'moderator', role: 'admin' },
  JWT_SECRET,
  { expiresIn: '2h' }
);

const app = require('../app');

const PORT = 3096;

const makeRequest = (method, path, body = null, token = testToken) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, data: parsed });
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTests() {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(PORT, resolve));

  console.log('========================================');
  console.log('Running Cluster 6 Verification Tests...');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  let createdGroupId = null;
  let testCommunityId = null;

  // 1. GET /api/groups
  try {
    const res = await makeRequest('GET', '/api/groups');
    if (res.status === 200) {
      console.log('[PASS] GET /api/groups -> HTTP', res.status);
      passed++;
    } else {
      console.error('[FAIL] GET /api/groups -> HTTP', res.status, res.data);
      failed++;
    }
  } catch (err) {
    console.error('[FAIL] GET /api/groups -> Error', err.message);
    failed++;
  }

  // 2. POST /api/groups
  try {
    const res = await makeRequest('POST', '/api/groups', {
      name: `Test Group ${Date.now()}`,
      description: 'A test group created for Cluster 6 remediation verification',
      category: 'Tech & Innovation',
      privacy_level: 'public'
    });
    if (res.status === 200 || res.status === 201) {
      console.log('[PASS] POST /api/groups -> HTTP', res.status);
      createdGroupId = res.data?.data?.id;
      passed++;
    } else {
      console.error('[FAIL] POST /api/groups -> HTTP', res.status, res.data);
      failed++;
    }
  } catch (err) {
    console.error('[FAIL] POST /api/groups -> Error', err.message);
    failed++;
  }

  // 3. GET /api/groups/:id
  try {
    const targetId = createdGroupId || 1;
    const res = await makeRequest('GET', `/api/groups/${targetId}`);
    if (res.status === 200) {
      console.log('[PASS] GET /api/groups/:id -> HTTP', res.status);
      passed++;
    } else {
      console.error('[FAIL] GET /api/groups/:id -> HTTP', res.status, res.data);
      failed++;
    }
  } catch (err) {
    console.error('[FAIL] GET /api/groups/:id -> Error', err.message);
    failed++;
  }

  // 4. POST /api/groups/:id/join
  try {
    const targetId = createdGroupId || 1;
    const res = await makeRequest('POST', `/api/groups/${targetId}/join`, {});
    if (res.status === 200) {
      console.log('[PASS] POST /api/groups/:id/join -> HTTP', res.status);
      passed++;
    } else {
      console.error('[FAIL] POST /api/groups/:id/join -> HTTP', res.status, res.data);
      failed++;
    }
  } catch (err) {
    console.error('[FAIL] POST /api/groups/:id/join -> Error', err.message);
    failed++;
  }

  // 5. POST /api/groups/:id/leave
  try {
    const targetId = createdGroupId || 1;
    const res = await makeRequest('POST', `/api/groups/${targetId}/leave`, {});
    if (res.status === 200) {
      console.log('[PASS] POST /api/groups/:id/leave -> HTTP', res.status);
      passed++;
    } else {
      console.error('[FAIL] POST /api/groups/:id/leave -> HTTP', res.status, res.data);
      failed++;
    }
  } catch (err) {
    console.error('[FAIL] POST /api/groups/:id/leave -> Error', err.message);
    failed++;
  }

  // 6. GET /api/communities
  try {
    const res = await makeRequest('GET', '/api/communities');
    if (res.status === 200) {
      console.log('[PASS] GET /api/communities -> HTTP', res.status);
      if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
        testCommunityId = res.data.data[0].id;
      }
      passed++;
    } else {
      console.error('[FAIL] GET /api/communities -> HTTP', res.status, res.data);
      failed++;
    }
  } catch (err) {
    console.error('[FAIL] GET /api/communities -> Error', err.message);
    failed++;
  }

  // 7. GET /api/communities/:id
  try {
    const targetId = testCommunityId || 1;
    const res = await makeRequest('GET', `/api/communities/${targetId}`);
    if (res.status === 200) {
      console.log('[PASS] GET /api/communities/:id -> HTTP', res.status);
      passed++;
    } else {
      console.error('[FAIL] GET /api/communities/:id -> HTTP', res.status, res.data);
      failed++;
    }
  } catch (err) {
    console.error('[FAIL] GET /api/communities/:id -> Error', err.message);
    failed++;
  }

  // 8. POST /api/communities
  try {
    const res = await makeRequest('POST', '/api/communities', {
      name: `Community ${Date.now()}`,
      description: 'A test community for Cluster 6 verification',
      category: 'General',
      is_private: false
    });
    if (res.status === 200 || res.status === 201) {
      console.log('[PASS] POST /api/communities -> HTTP', res.status);
      passed++;
    } else {
      console.error('[FAIL] POST /api/communities -> HTTP', res.status, res.data);
      failed++;
    }
  } catch (err) {
    console.error('[FAIL] POST /api/communities -> Error', err.message);
    failed++;
  }

  // 9. GET /api/hallmarks
  try {
    const res = await makeRequest('GET', '/api/hallmarks');
    if (res.status === 200) {
      console.log('[PASS] GET /api/hallmarks -> HTTP', res.status);
      passed++;
    } else {
      console.error('[FAIL] GET /api/hallmarks -> HTTP', res.status, res.data);
      failed++;
    }
  } catch (err) {
    console.error('[FAIL] GET /api/hallmarks -> Error', err.message);
    failed++;
  }

  // 10. GET /api/hallmarks/user/:userId
  try {
    const res = await makeRequest('GET', '/api/hallmarks/user/4');
    if (res.status === 200) {
      console.log('[PASS] GET /api/hallmarks/user/:userId -> HTTP', res.status);
      passed++;
    } else {
      console.error('[FAIL] GET /api/hallmarks/user/:userId -> HTTP', res.status, res.data);
      failed++;
    }
  } catch (err) {
    console.error('[FAIL] GET /api/hallmarks/user/:userId -> Error', err.message);
    failed++;
  }

  // 11. POST /api/hallmarks/award
  try {
    const res = await makeRequest('POST', '/api/hallmarks/award', {
      userId: 4,
      hallmarkId: 1,
      reason: 'Automated verification test award'
    });
    if (res.status === 200 || res.status === 201) {
      console.log('[PASS] POST /api/hallmarks/award -> HTTP', res.status);
      passed++;
    } else {
      console.error('[FAIL] POST /api/hallmarks/award -> HTTP', res.status, res.data);
      failed++;
    }
  } catch (err) {
    console.error('[FAIL] POST /api/hallmarks/award -> Error', err.message);
    failed++;
  }

  // 12. GET /api/gems/balance
  try {
    const res = await makeRequest('GET', '/api/gems/balance');
    if (res.status === 200) {
      console.log('[PASS] GET /api/gems/balance -> HTTP', res.status);
      passed++;
    } else {
      console.error('[FAIL] GET /api/gems/balance -> HTTP', res.status, res.data);
      failed++;
    }
  } catch (err) {
    console.error('[FAIL] GET /api/gems/balance -> Error', err.message);
    failed++;
  }

  // 13. GET /api/gems/balance/4
  try {
    const res = await makeRequest('GET', '/api/gems/balance/4');
    if (res.status === 200) {
      console.log('[PASS] GET /api/gems/balance/4 -> HTTP', res.status);
      passed++;
    } else {
      console.error('[FAIL] GET /api/gems/balance/4 -> HTTP', res.status, res.data);
      failed++;
    }
  } catch (err) {
    console.error('[FAIL] GET /api/gems/balance/4 -> Error', err.message);
    failed++;
  }

  // 14. POST /api/gems/award
  try {
    const res = await makeRequest('POST', '/api/gems/award', {
      userId: 4,
      amount: 50,
      reason: 'Automated test reward'
    });
    if (res.status === 200 || res.status === 201) {
      console.log('[PASS] POST /api/gems/award -> HTTP', res.status);
      passed++;
    } else {
      console.error('[FAIL] POST /api/gems/award -> HTTP', res.status, res.data);
      failed++;
    }
  } catch (err) {
    console.error('[FAIL] POST /api/gems/award -> Error', err.message);
    failed++;
  }

  console.log('\n========================================');
  console.log(`Cluster 6 Test Suite Results: ${passed} Passed, ${failed} Failed (${passed + failed} total)`);
  console.log('========================================\n');

  server.close();

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
