/**
 * Verification test suite for Cluster 12: Legal, Compliance, Governance & Support
 */

const http = require('http');
const app = require('../app');
const pool = require('../database/connection') || require('../db');

const TEST_PORT = 5012;

function request(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: TEST_PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed, raw: body });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, data: body, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting Cluster 12 Integration Tests ---');
  const server = app.listen(TEST_PORT, () => {
    console.log(`Test server running on port ${TEST_PORT}`);
  });

  let passed = 0;
  let failed = 0;

  try {
    // 1. POST /api/legal/dsr
    const dsrRes = await request('POST', '/api/legal/dsr', {
      name: 'John Doe',
      email: 'johndoe.dsr@example.com',
      requestType: 'access',
      message: 'Requesting export of my personal data under NDPA 2023.'
    });
    if (dsrRes.status === 201 && dsrRes.data?.success && dsrRes.data?.data?.id) {
      console.log('  PASS: 1. POST /api/legal/dsr submits DSR');
      passed++;
    } else {
      console.log('  FAIL: 1. POST /api/legal/dsr failed:', dsrRes.data);
      failed++;
    }

    // 2. GET /api/legal/dsr
    const dsrListRes = await request('GET', '/api/legal/dsr');
    if (dsrListRes.status === 200 && dsrListRes.data?.success && Array.isArray(dsrListRes.data?.data)) {
      console.log('  PASS: 2. GET /api/legal/dsr returns requests');
      passed++;
    } else {
      console.log('  FAIL: 2. GET /api/legal/dsr failed:', dsrListRes.data);
      failed++;
    }

    // 3. POST /api/legal/account-deletion
    const delRes = await request('POST', '/api/legal/account-deletion', {
      email: 'johndoe.dsr@example.com',
      reason: 'Relocating and closing account',
      confirmDeletion: true
    });
    if (delRes.status === 201 && delRes.data?.success && delRes.data?.data?.id) {
      console.log('  PASS: 3. POST /api/legal/account-deletion queues deletion');
      passed++;
    } else {
      console.log('  FAIL: 3. POST /api/legal/account-deletion failed:', delRes.data);
      failed++;
    }

    // 4. GET /api/legal/account-deletion/status
    const delStatusRes = await request('GET', '/api/legal/account-deletion/status?email=johndoe.dsr@example.com');
    if (delStatusRes.status === 200 && delStatusRes.data?.success && delStatusRes.data?.pending === true) {
      console.log('  PASS: 4. GET /api/legal/account-deletion/status returns pending flag');
      passed++;
    } else {
      console.log('  FAIL: 4. GET /api/legal/account-deletion/status failed:', delStatusRes.data);
      failed++;
    }

    // 5. POST /api/legal/contact
    const contactRes = await request('POST', '/api/legal/contact', {
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      subject: 'Protocol Partnership Inquiry',
      message: 'Interested in integrating our node with FingerMobile FIC Vault.',
      department: 'business'
    });
    if (contactRes.status === 201 && contactRes.data?.success && contactRes.data?.data?.id) {
      console.log('  PASS: 5. POST /api/legal/contact registers inquiry');
      passed++;
    } else {
      console.log('  FAIL: 5. POST /api/legal/contact failed:', contactRes.data);
      failed++;
    }

    // 6. GET /api/legal/contact
    const contactListRes = await request('GET', '/api/legal/contact');
    if (contactListRes.status === 200 && contactListRes.data?.success && Array.isArray(contactListRes.data?.data)) {
      console.log('  PASS: 6. GET /api/legal/contact returns messages');
      passed++;
    } else {
      console.log('  FAIL: 6. GET /api/legal/contact failed:', contactListRes.data);
      failed++;
    }

    // 7. POST /api/legal/feedback
    const feedbackRes = await request('POST', '/api/legal/feedback', {
      category: 'ui_ux',
      rating: 5,
      comment: 'Super fast settlement experience!',
      pageUrl: '/wallet'
    });
    if (feedbackRes.status === 201 && feedbackRes.data?.success && feedbackRes.data?.data?.id) {
      console.log('  PASS: 7. POST /api/legal/feedback stores rating');
      passed++;
    } else {
      console.log('  FAIL: 7. POST /api/legal/feedback failed:', feedbackRes.data);
      failed++;
    }

    // 8. GET /api/legal/feedback
    const feedbackListRes = await request('GET', '/api/legal/feedback');
    if (feedbackListRes.status === 200 && feedbackListRes.data?.success && Array.isArray(feedbackListRes.data?.data)) {
      console.log('  PASS: 8. GET /api/legal/feedback returns feedbacks');
      passed++;
    } else {
      console.log('  FAIL: 8. GET /api/legal/feedback failed:', feedbackListRes.data);
      failed++;
    }

    // 9. GET /api/legal/documents
    const docsRes = await request('GET', '/api/legal/documents');
    if (docsRes.status === 200 && docsRes.data?.success && docsRes.data?.data?.length >= 5) {
      console.log('  PASS: 9. GET /api/legal/documents returns active platform policies');
      passed++;
    } else {
      console.log('  FAIL: 9. GET /api/legal/documents failed:', docsRes.data);
      failed++;
    }

    // 10. GET /api/legal/documents/privacy-policy
    const ppRes = await request('GET', '/api/legal/documents/privacy-policy');
    if (ppRes.status === 200 && ppRes.data?.success && ppRes.data?.data?.slug === 'privacy-policy') {
      console.log('  PASS: 10. GET /api/legal/documents/privacy-policy returns document');
      passed++;
    } else {
      console.log('  FAIL: 10. GET /api/legal/documents/privacy-policy failed:', ppRes.data);
      failed++;
    }

    // 11. GET /api/legal/documents/csae-policy
    const csaeRes = await request('GET', '/api/legal/documents/csae-policy');
    if (csaeRes.status === 200 && csaeRes.data?.success && csaeRes.data?.data?.slug === 'csae-policy') {
      console.log('  PASS: 11. GET /api/legal/documents/csae-policy returns child safety policy');
      passed++;
    } else {
      console.log('  FAIL: 11. GET /api/legal/documents/csae-policy failed:', csaeRes.data);
      failed++;
    }

    // 12. GET /api/legal/documents/whitepaper
    const wpRes = await request('GET', '/api/legal/documents/whitepaper');
    if (wpRes.status === 200 && wpRes.data?.success && wpRes.data?.data?.slug === 'whitepaper') {
      console.log('  PASS: 12. GET /api/legal/documents/whitepaper returns whitepaper');
      passed++;
    } else {
      console.log('  FAIL: 12. GET /api/legal/documents/whitepaper failed:', wpRes.data);
      failed++;
    }

    // 13. POST /api/legal/dmca
    const dmcaRes = await request('POST', '/api/legal/dmca', {
      claimant_name: 'Studio X Copyright Trust',
      claimant_email: 'legal@studiox.com',
      infringing_url: 'https://fingermobile.io/posts/108',
      original_work_url: 'https://studiox.com/original-artwork',
      description: 'Unauthorized reproduction of studio brand asset.',
      signature: 'Studio X Legal Counsel'
    });
    if (dmcaRes.status === 201 && dmcaRes.data?.success && dmcaRes.data?.data?.id) {
      console.log('  PASS: 13. POST /api/legal/dmca records infringement claim');
      passed++;
    } else {
      console.log('  FAIL: 13. POST /api/legal/dmca failed:', dmcaRes.data);
      failed++;
    }

    // 14. POST /api/support/tickets
    const ticketCreateRes = await request('POST', '/api/support/tickets', {
      subject: 'Transaction dispute on merchant order #884',
      description: 'The order status did not transition to confirmed after FIC deduction.',
      priority: 'high',
      category: 'billing',
      ticketType: 'complaint'
    });
    const ticketId = ticketCreateRes.data?.data?.id;
    if (ticketCreateRes.status === 201 && ticketCreateRes.data?.success && ticketId) {
      console.log('  PASS: 14. POST /api/support/tickets creates support ticket');
      passed++;
    } else {
      console.log('  FAIL: 14. POST /api/support/tickets failed:', ticketCreateRes.data);
      failed++;
    }

    // 15. GET /api/support/tickets
    const ticketsRes = await request('GET', '/api/support/tickets');
    if (ticketsRes.status === 200 && ticketsRes.data?.success && Array.isArray(ticketsRes.data?.data)) {
      console.log('  PASS: 15. GET /api/support/tickets returns tickets list');
      passed++;
    } else {
      console.log('  FAIL: 15. GET /api/support/tickets failed:', ticketsRes.data);
      failed++;
    }

    // 16. GET /api/support/tickets/:id
    const ticketDetailRes = await request('GET', `/api/support/tickets/${ticketId}`);
    if (ticketDetailRes.status === 200 && ticketDetailRes.data?.success && ticketDetailRes.data?.data?.subject) {
      console.log('  PASS: 16. GET /api/support/tickets/:id returns thread details');
      passed++;
    } else {
      console.log('  FAIL: 16. GET /api/support/tickets/:id failed:', ticketDetailRes.data);
      failed++;
    }

    // 17. POST /api/support/tickets/:id/messages
    const replyRes = await request('POST', `/api/support/tickets/${ticketId}/messages`, {
      message: 'Support team has acknowledged your dispute and initiated escrow review.',
      isInternal: false
    });
    if (replyRes.status === 201 && replyRes.data?.success && replyRes.data?.data?.text) {
      console.log('  PASS: 17. POST /api/support/tickets/:id/messages adds reply');
      passed++;
    } else {
      console.log('  FAIL: 17. POST /api/support/tickets/:id/messages failed:', replyRes.data);
      failed++;
    }

    // 18. PUT /api/support/tickets/:id/status
    const statusUpdateRes = await request('PUT', `/api/support/tickets/${ticketId}/status`, {
      status: 'resolved'
    });
    if (statusUpdateRes.status === 200 && statusUpdateRes.data?.success && statusUpdateRes.data?.data?.status === 'resolved') {
      console.log('  PASS: 18. PUT /api/support/tickets/:id/status updates status');
      passed++;
    } else {
      console.log('  FAIL: 18. PUT /api/support/tickets/:id/status failed:', statusUpdateRes.data);
      failed++;
    }

    // 19. GET /api/support/stats
    const statsRes = await request('GET', '/api/support/stats');
    if (statsRes.status === 200 && statsRes.data?.success && typeof statsRes.data?.data?.total === 'number') {
      console.log('  PASS: 19. GET /api/support/stats returns operational metrics');
      passed++;
    } else {
      console.log('  FAIL: 19. GET /api/support/stats failed:', statsRes.data);
      failed++;
    }

    // 20. GET /api/v1/vault/dpo/audit/car-report
    const carRes = await request('GET', '/api/v1/vault/dpo/audit/car-report');
    if (carRes.status === 200 && (carRes.data?.car_report_id || carRes.data?.carReport)) {
      console.log('  PASS: 20. GET /api/v1/vault/dpo/audit/car-report returns CAR compliance packet');
      passed++;
    } else {
      console.log('  FAIL: 20. GET /api/v1/vault/dpo/audit/car-report failed:', carRes.data);
      failed++;
    }

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    server.close();
    console.log(`\nCluster 12 Results: ${passed} Passed, ${failed} Failed\n`);
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
