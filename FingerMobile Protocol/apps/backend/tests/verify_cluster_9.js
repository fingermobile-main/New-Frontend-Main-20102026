/**
 * Cluster 9 Verification Tests
 * FingerMobile Protocol™ - Advertising, Marketing & Canary Ads (11 Screens)
 */

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { pool } = require('../db');
const { JWT_SECRET } = require('../config');

async function runCluster9Tests() {
  console.log('========================================');
  console.log('Running Cluster 9 Verification Tests...');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  const testUserId = 4; // Integer user ID for dev/test user
  const token = jwt.sign(
    { id: testUserId, userId: testUserId, username: 'testuser', email: 'test@fingermobileprotocol.com' },
    JWT_SECRET || 'dev-secret-key',
    { expiresIn: '1h' }
  );

  let createdCampaignId;
  let createdAnnouncementId;

  // 1. GET /api/canary/campaigns
  try {
    const res = await request(app)
      .get('/api/canary/campaigns?all=true')
      .set('Authorization', `Bearer ${token}`);

    if (res.status === 200 && (Array.isArray(res.body.campaigns) || Array.isArray(res.body.data))) {
      console.log('✅ PASS: GET /api/canary/campaigns returns campaigns array');
      passed++;
    } else {
      console.error('❌ FAIL: GET /api/canary/campaigns', res.status, res.body);
      failed++;
    }
  } catch (err) {
    console.error('❌ FAIL: GET /api/canary/campaigns with error:', err.message);
    failed++;
  }

  // 2. GET /api/ads (root ads listing for useAds hook)
  try {
    const res = await request(app)
      .get('/api/ads')
      .set('Authorization', `Bearer ${token}`);

    if (res.status === 200 && Array.isArray(res.body.ads) && res.body.ads.length > 0) {
      console.log('✅ PASS: GET /api/ads returns live creatives formatted for useAds hook');
      passed++;
    } else {
      console.error('❌ FAIL: GET /api/ads', res.status, res.body);
      failed++;
    }
  } catch (err) {
    console.error('❌ FAIL: GET /api/ads with error:', err.message);
    failed++;
  }

  // 3. POST /api/campaigns (create campaign with auto advertiser resolution)
  try {
    const res = await request(app)
      .post('/api/campaigns')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Cluster 9 Automated Test Campaign',
        campaign_type: 'video',
        total_budget: 1500,
        daily_budget: 150,
        currency: 'FIC',
        description: 'Automated test campaign for cluster 9 verification'
      });

    if (res.status === 201 && res.body.success && res.body.campaign?.id) {
      createdCampaignId = res.body.campaign.id;
      console.log('✅ PASS: POST /api/campaigns creates and activates campaign in PostgreSQL');
      passed++;
    } else {
      console.error('❌ FAIL: POST /api/campaigns', res.status, res.body);
      failed++;
    }
  } catch (err) {
    console.error('❌ FAIL: POST /api/campaigns with error:', err.message);
    failed++;
  }

  // 4. GET /api/campaigns/:id
  try {
    const targetId = createdCampaignId || 'c1000000-0000-0000-0000-000000000001';
    const res = await request(app)
      .get(`/api/campaigns/${targetId}`)
      .set('Authorization', `Bearer ${token}`);

    if (res.status === 200 && res.body.success && res.body.campaign) {
      console.log('✅ PASS: GET /api/campaigns/:id returns campaign details');
      passed++;
    } else {
      console.error('❌ FAIL: GET /api/campaigns/:id', res.status, res.body);
      failed++;
    }
  } catch (err) {
    console.error('❌ FAIL: GET /api/campaigns/:id with error:', err.message);
    failed++;
  }

  // 5. PUT /api/campaigns/:id/status
  try {
    const targetId = createdCampaignId || 'c1000000-0000-0000-0000-000000000001';
    const res = await request(app)
      .put(`/api/campaigns/${targetId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'paused' });

    if (res.status === 200 && res.body.success && res.body.campaign?.status === 'paused') {
      console.log('✅ PASS: PUT /api/campaigns/:id/status updates campaign status');
      passed++;
    } else {
      console.error('❌ FAIL: PUT /api/campaigns/:id/status', res.status, res.body);
      failed++;
    }
  } catch (err) {
    console.error('❌ FAIL: PUT /api/campaigns/:id/status with error:', err.message);
    failed++;
  }

  // 6. GET /api/campaigns/:id/analytics
  try {
    const targetId = createdCampaignId || 'c1000000-0000-0000-0000-000000000001';
    const res = await request(app)
      .get(`/api/campaigns/${targetId}/analytics`)
      .set('Authorization', `Bearer ${token}`);

    if (res.status === 200 && res.body.success && res.body.reach?.data && res.body.engagement?.data) {
      console.log('✅ PASS: GET /api/campaigns/:id/analytics returns rich reach and engagement chart series');
      passed++;
    } else {
      console.error('❌ FAIL: GET /api/campaigns/:id/analytics', res.status, res.body);
      failed++;
    }
  } catch (err) {
    console.error('❌ FAIL: GET /api/campaigns/:id/analytics with error:', err.message);
    failed++;
  }

  // 7. GET /api/marketing/overview
  try {
    const res = await request(app)
      .get('/api/marketing/overview')
      .set('Authorization', `Bearer ${token}`);

    if (res.status === 200 && res.body.success && res.body.stats?.reach) {
      console.log('✅ PASS: GET /api/marketing/overview returns aggregate reach, spend & conversions');
      passed++;
    } else {
      console.error('❌ FAIL: GET /api/marketing/overview', res.status, res.body);
      failed++;
    }
  } catch (err) {
    console.error('❌ FAIL: GET /api/marketing/overview with error:', err.message);
    failed++;
  }

  // 8. GET /api/canary/announcements (CanaryPage.tsx feed)
  try {
    const res = await request(app)
      .get('/api/canary/announcements')
      .set('Authorization', `Bearer ${token}`);

    if (res.status === 200 && res.body.success && Array.isArray(res.body.posts) && res.body.posts.length > 0) {
      console.log('✅ PASS: GET /api/canary/announcements returns active security & platform alerts');
      passed++;
    } else {
      console.error('❌ FAIL: GET /api/canary/announcements', res.status, res.body);
      failed++;
    }
  } catch (err) {
    console.error('❌ FAIL: GET /api/canary/announcements with error:', err.message);
    failed++;
  }

  // 9. POST /api/canary/announcements
  try {
    const res = await request(app)
      .post('/api/canary/announcements')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Cluster 9 Security Node Verified',
        content: 'Automated cryptographic handshake verified for all advertising distribution channels.',
        category: 'security',
        status: 'active'
      });

    if (res.status === 201 && res.body.success && res.body.announcement?.id) {
      createdAnnouncementId = res.body.announcement.id;
      console.log('✅ PASS: POST /api/canary/announcements publishes new platform alert');
      passed++;
    } else {
      console.error('❌ FAIL: POST /api/canary/announcements', res.status, res.body);
      failed++;
    }
  } catch (err) {
    console.error('❌ FAIL: POST /api/canary/announcements with error:', err.message);
    failed++;
  }

  // 10. POST /api/canary/announcements/:id/like
  try {
    const targetId = createdAnnouncementId || 1;
    const res = await request(app)
      .post(`/api/canary/announcements/${targetId}/like`)
      .set('Authorization', `Bearer ${token}`);

    if (res.status === 200 && res.body.success && typeof res.body.liked === 'boolean') {
      console.log('✅ PASS: POST /api/canary/announcements/:id/like toggles like on alert');
      passed++;
    } else {
      console.error('❌ FAIL: POST /api/canary/announcements/:id/like', res.status, res.body);
      failed++;
    }
  } catch (err) {
    console.error('❌ FAIL: POST /api/canary/announcements/:id/like with error:', err.message);
    failed++;
  }

  // 11. GET /api/canary/admin/queue (SuperAdmin moderation queue)
  try {
    const res = await request(app)
      .get('/api/canary/admin/queue')
      .set('Authorization', `Bearer ${token}`);

    if (res.status === 200 && res.body.success && Array.isArray(res.body.queue)) {
      console.log('✅ PASS: GET /api/canary/admin/queue returns creatives awaiting moderation');
      passed++;
    } else {
      console.error('❌ FAIL: GET /api/canary/admin/queue', res.status, res.body);
      failed++;
    }
  } catch (err) {
    console.error('❌ FAIL: GET /api/canary/admin/queue with error:', err.message);
    failed++;
  }

  // 12. POST /api/canary/track/impression
  try {
    const res = await request(app)
      .post('/api/canary/track/impression')
      .send({
        creative_id: 'e1000000-0000-0000-0000-000000000001',
        placement: 'h2_banner',
        view_duration_seconds: 5.5
      });

    if (res.status === 200 && res.body.success && res.body.recorded) {
      console.log('✅ PASS: POST /api/canary/track/impression records anti-fraud hashed impression');
      passed++;
    } else {
      console.error('❌ FAIL: POST /api/canary/track/impression', res.status, res.body);
      failed++;
    }
  } catch (err) {
    console.error('❌ FAIL: POST /api/canary/track/impression with error:', err.message);
    failed++;
  }

  // 13. POST /api/canary/track/click
  try {
    const res = await request(app)
      .post('/api/canary/track/click')
      .send({
        creative_id: 'e1000000-0000-0000-0000-000000000001'
      });

    if (res.status === 200 && res.body.success && res.body.recorded) {
      console.log('✅ PASS: POST /api/canary/track/click records anti-fraud hashed click');
      passed++;
    } else {
      console.error('❌ FAIL: POST /api/canary/track/click', res.status, res.body);
      failed++;
    }
  } catch (err) {
    console.error('❌ FAIL: POST /api/canary/track/click with error:', err.message);
    failed++;
  }

  console.log('\n========================================');
  console.log(`Cluster 9 Verification Results: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================\n');

  // Close database pool connection so test process exits cleanly
  await pool.end();

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runCluster9Tests();
