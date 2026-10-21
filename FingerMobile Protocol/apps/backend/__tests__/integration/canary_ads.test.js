const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const { pool } = require('../../db');
const { JWT_SECRET } = require('../../config');

describe('Canary Internal Advertising Engine Integration Tests', () => {
  let token;
  const testUserId = 'a0000000-0000-0000-0000-000000000001';
  let advertiserId;
  let campaignId;
  let adGroupId;
  let creativeId;

  beforeAll(async () => {
    token = jwt.sign(
      { id: testUserId, userId: testUserId, email: 'canary_merchant@example.com' },
      JWT_SECRET || 'dev-secret-key',
      { expiresIn: '1h' }
    );

    // Clean up existing test data
    await pool.query('DELETE FROM canary_advertisers WHERE user_id = $1', [testUserId]);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM canary_advertisers WHERE user_id = $1', [testUserId]);
    await pool.end();
  });

  // ==========================================================================
  // 1. ADVERTISER REGISTRATION & DISCLAIMER ACCEPTANCE
  // ==========================================================================
  describe('Advertiser Registration & Disclaimer', () => {
    it('should reject registration if privacy & disclaimer agreement is not accepted', async () => {
      const res = await request(app)
        .post('/api/canary/advertiser/register')
        .set('Authorization', `Bearer ${token}`)
        .send({
          user_id: testUserId,
          company_name: 'Test Merchant Ltd',
          billing_email: 'billing@merchant.com',
          disclaimer_accepted: false
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/disclaimer/i);
    });

    it('should register advertiser and record accepted disclaimer with digital signature', async () => {
      const res = await request(app)
        .post('/api/canary/advertiser/register')
        .set('Authorization', `Bearer ${token}`)
        .send({
          user_id: testUserId,
          company_name: 'FingerMobile Global Merchant',
          billing_email: 'canary_billing@fingermobileprotocol.com',
          tax_id: 'TAX-NG-2026-001',
          website_url: 'https://store.fingermobileprotocol.com',
          disclaimer_accepted: true,
          digital_signature: 'John Doe, Managing Director',
          legal_declaration_text: 'I acknowledge the Canary Non-Refundable Payment terms and Ad Specs.'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.advertiser).toBeDefined();
      expect(res.body.advertiser.company_name).toBe('FingerMobile Global Merchant');
      advertiserId = res.body.advertiser.id;
    });

    it('GET /api/canary/advertiser/me - should retrieve advertiser profile and disclaimers', async () => {
      const res = await request(app)
        .get(`/api/canary/advertiser/me?user_id=${testUserId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.advertiser.id).toBe(advertiserId);
      expect(Array.isArray(res.body.advertiser.disclaimers)).toBe(true);
      expect(res.body.advertiser.disclaimers.length).toBeGreaterThan(0);
    });
  });

  // ==========================================================================
  // 2. CAMPAIGN CREATION (1 OF 10 CAMPAIGN TYPES)
  // ==========================================================================
  describe('Canary Campaigns (10 Campaign Types)', () => {
    it('should reject invalid campaign type', async () => {
      const res = await request(app)
        .post('/api/canary/campaigns')
        .set('Authorization', `Bearer ${token}`)
        .send({
          advertiser_id: advertiserId,
          title: 'Invalid Campaign',
          campaign_type: 'unknown_type'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('campaign_type');
    });

    it('should create valid Canary campaign (e.g. video campaign)', async () => {
      const res = await request(app)
        .post('/api/canary/campaigns')
        .set('Authorization', `Bearer ${token}`)
        .send({
          advertiser_id: advertiserId,
          title: 'Spring Season Video Launch',
          campaign_type: 'video',
          daily_budget: 50.00,
          total_budget: 500.00,
          currency: 'FIC',
          bid_strategy: 'auto_cpc'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.campaign.status).toBe('pending_payment');
      campaignId = res.body.campaign.id;
    });

    it('GET /api/canary/campaigns - should list campaigns for advertiser', async () => {
      const res = await request(app)
        .get(`/api/canary/campaigns?advertiser_id=${advertiserId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.campaigns.length).toBeGreaterThan(0);
      expect(res.body.campaigns[0].id).toBe(campaignId);
    });
  });

  // ==========================================================================
  // 3. AD GROUP & CREATIVE WITH STRICT SPECIFICATIONS
  // ==========================================================================
  describe('Ad Groups & Placement Creative Specifications', () => {
    it('POST /api/canary/campaigns/:id/ad-groups - should create ad group with placement', async () => {
      const res = await request(app)
        .post(`/api/canary/campaigns/${campaignId}/ad-groups`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Feed Video Target Group',
          placement: 'feed_video',
          target_locations: ['Nigeria', 'United Kingdom', 'United States'],
          target_genders: ['all'],
          target_age_min: 18,
          target_age_max: 55,
          target_keywords: ['fashion', 'music', 'lifestyle']
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.ad_group.placement).toBe('feed_video');
      adGroupId = res.body.ad_group.id;
    });

    it('should reject creative exceeding 100MB file limit', async () => {
      const res = await request(app)
        .post(`/api/canary/ad-groups/${adGroupId}/creatives`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          format: 'single_video',
          media_url: 'https://cdn.fingermobileprotocol.com/ads/huge_video.mp4',
          headline: 'Ultra Big Video Ad',
          destination_url: 'https://store.fingermobileprotocol.com',
          file_size_bytes: 150000000 // 150 MB (exceeds 100MB limit)
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('100 MB');
    });

    it('should reject creative exceeding 40-character headline limit', async () => {
      const res = await request(app)
        .post(`/api/canary/ad-groups/${adGroupId}/creatives`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          format: 'single_video',
          media_url: 'https://cdn.fingermobileprotocol.com/ads/video.mp4',
          headline: 'This headline has way too many characters and violates the Canary limit',
          destination_url: 'https://store.fingermobileprotocol.com',
          file_size_bytes: 20000000
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('40 characters');
    });

    it('should reject stories ad if safe area padding is disabled', async () => {
      // Create Stories ad group
      const groupRes = await request(app)
        .post(`/api/canary/campaigns/${campaignId}/ad-groups`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Stories Group',
          placement: 'stories'
        });

      const storiesGroupId = groupRes.body.ad_group.id;

      const res = await request(app)
        .post(`/api/canary/ad-groups/${storiesGroupId}/creatives`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          format: 'single_video',
          media_url: 'https://cdn.fingermobileprotocol.com/ads/story_no_padding.mp4',
          headline: 'Story Promo',
          destination_url: 'https://store.fingermobileprotocol.com',
          has_safe_area_padding: false
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('safe area');
    });

    it('should upload valid feed video creative and pass specs validation', async () => {
      const res = await request(app)
        .post(`/api/canary/ad-groups/${adGroupId}/creatives`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          format: 'single_video',
          media_url: 'https://cdn.fingermobileprotocol.com/ads/canary_feed_ad.mp4',
          thumbnail_url: 'https://cdn.fingermobileprotocol.com/ads/thumb1.jpg',
          headline: 'BeatwaveNG Premium Drops',
          description: 'Stream exclusive audio with high fidelity.',
          primary_text: 'Discover hottest tracks on FingerMobile.',
          destination_url: 'https://fingermobileprotocol.com/beatwaveng',
          call_to_action: 'Listen Now',
          video_duration_seconds: 30.0,
          file_size_bytes: 45000000, // 45 MB
          aspect_ratio: '9:16',
          has_safe_area_padding: true,
          thumbnail_text_percentage: 12.0
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.creative).toBeDefined();
      expect(res.body.creative.ai_policy_passed).toBe(true);
      expect(res.body.creative.moderation_status).toBe('pending');
      creativeId = res.body.creative.id;
    });

    it('should create carousel video ad with 2 to 10 cards', async () => {
      const groupRes = await request(app)
        .post(`/api/canary/campaigns/${campaignId}/ad-groups`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Carousel Group',
          placement: 'carousel_video'
        });

      const carouselGroupId = groupRes.body.ad_group.id;

      const res = await request(app)
        .post(`/api/canary/ad-groups/${carouselGroupId}/creatives`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          format: 'carousel',
          media_url: 'https://cdn.fingermobileprotocol.com/ads/carousel_main.mp4',
          headline: 'Lush Pressies Collection',
          destination_url: 'https://fingermobileprotocol.com/lushpressies',
          carousel_cards: [
            {
              media_url: 'https://cdn.fingermobileprotocol.com/ads/card1.mp4',
              headline: 'Luxury Roses $2',
              destination_url: 'https://fingermobileprotocol.com/lushpressies/roses'
            },
            {
              media_url: 'https://cdn.fingermobileprotocol.com/ads/card2.mp4',
              headline: 'Golden Ticket $20',
              destination_url: 'https://fingermobileprotocol.com/lushpressies/golden'
            },
            {
              media_url: 'https://cdn.fingermobileprotocol.com/ads/card3.mp4',
              headline: 'Mystery Box $10',
              destination_url: 'https://fingermobileprotocol.com/lushpressies/mystery'
            }
          ]
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.creative.format).toBe('carousel');
    });
  });

  // ==========================================================================
  // 4. NON-REFUNDABLE PAYMENT CONFIRMATION
  // ==========================================================================
  describe('Non-Refundable Payment & Escrow Hold', () => {
    it('POST /api/canary/campaigns/:id/checkout - should process non-refundable payment and move campaign to review', async () => {
      const res = await request(app)
        .post(`/api/canary/campaigns/${campaignId}/checkout`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          advertiser_id: advertiserId,
          amount: 500.00,
          payment_method: 'fic',
          currency: 'FIC'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.payment.is_non_refundable).toBe(true);
      expect(res.body.campaign_status).toBe('pending_review');
    });
  });

  // ==========================================================================
  // 5. SUPERADMIN RBAC REVIEW QUEUE & MODERATION
  // ==========================================================================
  describe('SuperAdmin RBAC Moderation', () => {
    it('GET /api/canary/admin/queue - should list pending creative in moderation queue', async () => {
      const res = await request(app)
        .get('/api/canary/admin/queue')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBeGreaterThan(0);
      const target = res.body.queue.find((item) => item.id === creativeId);
      expect(target).toBeDefined();
      expect(target.company_name).toBe('FingerMobile Global Merchant');
    });

    it('PUT /api/canary/admin/moderate/:creativeId - should approve creative and activate campaign', async () => {
      const res = await request(app)
        .put(`/api/canary/admin/moderate/${creativeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          action: 'approve',
          admin_user_id: testUserId
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.creative.moderation_status).toBe('approved');

      // Verify campaign status is now active
      const campRes = await request(app)
        .get(`/api/canary/campaigns/${campaignId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(campRes.body.campaign.status).toBe('active');
    });
  });

  // ==========================================================================
  // 6. CLIENT AD DELIVERY PIPELINE
  // ==========================================================================
  describe('Canary Ad Delivery Pipeline', () => {
    it('GET /api/canary/delivery/:placement - should deliver approved ad for feed_video', async () => {
      const res = await request(app).get('/api/canary/delivery/feed_video?limit=5');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.ads.length).toBeGreaterThan(0);
      expect(res.body.ads[0].headline).toBe('BeatwaveNG Premium Drops');
    });
  });

  // ==========================================================================
  // 7. IMPRESSION & CLICK TRACKING WITH ANTI-FRAUD IP HASHING
  // ==========================================================================
  describe('Impression & Click Tracking & Analytics', () => {
    it('POST /api/canary/track/impression - should record view impression', async () => {
      const res = await request(app)
        .post('/api/canary/track/impression')
        .send({
          creative_id: creativeId,
          placement: 'feed_video',
          view_duration_seconds: 15.5
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.recorded).toBe(true);
    });

    it('POST /api/canary/track/click - should record click event', async () => {
      const res = await request(app)
        .post('/api/canary/track/click')
        .send({
          creative_id: creativeId
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.recorded).toBe(true);
    });

    it('GET /api/canary/advertiser/analytics/:campaignId - should compute impressions, clicks, CTR, and spend', async () => {
      const res = await request(app)
        .get(`/api/canary/advertiser/analytics/${campaignId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.analytics.impressions).toBeGreaterThanOrEqual(1);
      expect(res.body.analytics.clicks).toBeGreaterThanOrEqual(1);
      expect(res.body.analytics.ctr_percent).toBeGreaterThan(0);
      expect(res.body.analytics.total_spend).toBeGreaterThan(0);
    });
  });

  // ==========================================================================
  // 8. PUBLISHER WHITELIST FOR INSTANT ARTICLES
  // ==========================================================================
  describe('Publisher Whitelist Management', () => {
    it('POST /api/canary/publishers/whitelist - should whitelist publisher badge', async () => {
      const res = await request(app)
        .post('/api/canary/publishers/whitelist')
        .set('Authorization', `Bearer ${token}`)
        .send({
          user_id: testUserId,
          role_or_badge: 'superadmin',
          approved_by: testUserId
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.publisher.status).toBe('active');
    });

    it('GET /api/canary/publishers/whitelist - should return whitelisted publishers list', async () => {
      const res = await request(app).get('/api/canary/publishers/whitelist');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.publishers.length).toBeGreaterThan(0);
    });
  });
});
