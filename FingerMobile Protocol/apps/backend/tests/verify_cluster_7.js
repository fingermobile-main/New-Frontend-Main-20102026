/**
 * Verification Test Suite for Cluster 7: Real-Time Communication, Chat, Messaging & Voice
 */

const http = require('http');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

// Create test JWT for user 4 (moderator)
const token = jwt.sign(
  { id: 4, userId: 4, username: 'moderator', role: 'moderator', email: 'mod@example.com' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

const app = require('../app');
const server = http.createServer(app);
const TEST_PORT = 3097; // Ephemeral test port

async function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: TEST_PORT,
      path,
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('========================================');
  console.log('Running Cluster 7 Verification Tests...');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message, details = '') {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message} - ${details}`);
      failed++;
    }
  }

  server.listen(TEST_PORT, async () => {
    try {
      // 1. GET /api/messages/conversations
      const resConvs = await request('GET', '/api/messages/conversations');
      assert(resConvs.status === 200 && resConvs.body.success, 'GET /api/messages/conversations -> HTTP 200', JSON.stringify(resConvs.body));

      // 2. GET /api/messages/conversations/1 (messages with user 1)
      const resMsg1 = await request('GET', '/api/messages/conversations/1');
      assert(resMsg1.status === 200 && resMsg1.body.success && Array.isArray(resMsg1.body.data), 'GET /api/messages/conversations/:otherMemberId -> HTTP 200', JSON.stringify(resMsg1.body));

      // 3. POST /api/messages (send message to user 1)
      const resSend = await request('POST', '/api/messages', {
        recipient_id: 1,
        content: 'Automated test message for Cluster 7 verification',
        subject: 'Cluster 7 Live Verification'
      });
      assert(resSend.status === 201 && resSend.body.success && resSend.body.data?.id, 'POST /api/messages -> HTTP 201', JSON.stringify(resSend.body));

      const createdMessageId = resSend.body.data?.id;

      // 4. GET /api/messages/:messageId
      if (createdMessageId) {
        const resGetMsg = await request('GET', `/api/messages/${createdMessageId}`);
        assert(resGetMsg.status === 200 && resGetMsg.body.success, 'GET /api/messages/:messageId -> HTTP 200', JSON.stringify(resGetMsg.body));

        // 5. PUT /api/messages/:messageId (edit message)
        const resUpdateMsg = await request('PUT', `/api/messages/${createdMessageId}`, {
          content: 'Updated test message for Cluster 7 verification',
          subject: 'Cluster 7 Live Verification (Edited)'
        });
        assert(resUpdateMsg.status === 200 && resUpdateMsg.body.success, 'PUT /api/messages/:messageId -> HTTP 200', JSON.stringify(resUpdateMsg.body));
      } else {
        assert(false, 'GET & PUT /api/messages/:messageId skipped because message was not created');
      }

      // 6. POST /api/messages/mark-as-read
      const resMark = await request('POST', '/api/messages/mark-as-read', {
        conversation_partner_id: 1
      });
      assert(resMark.status === 200 && resMark.body.success, 'POST /api/messages/mark-as-read -> HTTP 200', JSON.stringify(resMark.body));

      // 7. GET /api/messages/unread-count
      const resUnread = await request('GET', '/api/messages/unread-count');
      assert(resUnread.status === 200 && resUnread.body.success && typeof resUnread.body.unread_count === 'number', 'GET /api/messages/unread-count -> HTTP 200', JSON.stringify(resUnread.body));

      // 8. DELETE /api/messages/:messageId
      if (createdMessageId) {
        const resDel = await request('DELETE', `/api/messages/${createdMessageId}`);
        assert(resDel.status === 200 && resDel.body.success, 'DELETE /api/messages/:messageId -> HTTP 200', JSON.stringify(resDel.body));
      }

      console.log('\n========================================');
      console.log(`Cluster 7 Test Suite Results: ${passed} Passed, ${failed} Failed (${passed + failed} total)`);
      console.log('========================================\n');

      server.close(() => {
        process.exit(failed > 0 ? 1 : 0);
      });
    } catch (err) {
      console.error('Fatal error during test run:', err);
      server.close(() => {
        process.exit(1);
      });
    }
  });
}

runTests();
