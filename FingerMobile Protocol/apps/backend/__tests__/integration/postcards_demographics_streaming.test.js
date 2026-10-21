/**
 * Postcards, Demographic Heatmaps, Creator Subscriptions & Live Streaming Test Suite
 * Date: September 29, 2026
 */

const request = require('supertest');
const app = require('../../app');
const { pool } = require('../../db');

describe('Postcards, Demographics, Creator Subscriptions & Live Streaming Integration Suite', () => {
  let testUserId = null;
  let createdPostcardId = null;
  let chunkSessionId = null;
  let liveStreamId = null;

  beforeAll(async () => {
    // Ensure test user exists in PostgreSQL
    const res = await pool.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ('postcard_tester', 'postcard_tester@fingermobileprotocol.com', 'hashed_pass_123', 'member')
       ON CONFLICT (email) DO UPDATE SET username = EXCLUDED.username
       RETURNING id`
    );
    testUserId = res.rows[0].id;
  });

  afterAll(async () => {
    // Clean up test data
    if (createdPostcardId) {
      await pool.query('DELETE FROM postcards WHERE id = $1', [createdPostcardId]);
    }
    if (chunkSessionId) {
      await pool.query('DELETE FROM postcard_chunked_uploads WHERE upload_session_id = $1', [chunkSessionId]);
    }
    if (liveStreamId) {
      await pool.query('DELETE FROM live_streams WHERE id = $1', [liveStreamId]);
    }
  });

  // ==========================================================================
  // TASK 2: POSTCARDS ENGINE & MANDATORY VALIDATION
  // ==========================================================================
  describe('Task 2: Advanced Postcard Media & Attachment Engine', () => {
    it('should reject postcard creation when caption is missing or empty', async () => {
      const res = await request(app)
        .post('/api/postcards')
        .send({
          user_id: testUserId,
          caption: '   ',
          is_ai_generated: false
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('VALIDATION_FAILED');
    });

    it('should reject postcard creation when is_ai_generated boolean is missing', async () => {
      const res = await request(app)
        .post('/api/postcards')
        .send({
          user_id: testUserId,
          caption: 'Hello Lagos!'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/is_ai_generated must be true or false/);
    });

    it('should successfully create postcard with AI badge and rich attachments payload', async () => {
      const payload = {
        user_id: testUserId,
        caption: 'Exploring futuristic digital architecture in Lagos #FingerMobile',
        is_ai_generated: true,
        ai_badge_label: 'Synthesized with Vertex AI',
        category: 'architecture',
        visibility: 'public',
        attachments: [
          { type: 'gift_tip', amount_gems: 50, note: 'Early supporter bonus' },
          { type: 'fic_transfer', amount_fic: 100, recipient_id: testUserId, memo: 'Protocol reward' },
          { type: 'commerce_embed', provider: 'Marketplace', product_id: 'prod_99', product_name: 'Smart Watch', price: 99.99, currency: 'USD', image_url: 'https://cdn.fingermobileprotocol.com/watch.jpg' },
          { type: 'audio_embed', provider: 'BeatwaveNG', track_id: 'bw_track_42', title: 'Afro Beats 2026', artist: 'Burna Boy', audio_url: 'https://cdn.fingermobileprotocol.com/audio.mp3', duration_seconds: 180 },
          { type: 'voice_note', audio_url: 'https://cdn.fingermobileprotocol.com/voice.aac', duration_seconds: 45 },
          { type: 'uhd_media', media_type: 'image', url: 'https://cdn.fingermobileprotocol.com/uhd.png', resolution: '4K', aspect_ratio: '16:9', file_size_bytes: 12000000 },
          { type: 'social_link', platform: 'youtube', url: 'https://youtube.com/watch?v=demo', title: 'Exclusive Premiere' },
          { type: 'uhd_sticker', sticker_id: 'stk_fire_01', sticker_pack: 'CyberLagos', animated: true, url: 'https://cdn.fingermobileprotocol.com/fire.webp' }
        ],
        privacy_settings: {
          allow_comments: 'everyone',
          gender_target: 'all',
          age_range_min: 18,
          age_range_max: 99
        }
      };

      const res = await request(app)
        .post('/api/postcards')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.is_ai_generated).toBe(true);
      expect(res.body.data.ai_badge_label).toBe('Synthesized with Vertex AI');

      createdPostcardId = res.body.data.id;
    });

    it('should retrieve postcards feed with viewer demographic attributes', async () => {
      const res = await request(app)
        .get('/api/postcards')
        .query({
          category: 'architecture',
          gender: 'female',
          age: 26,
          country: 'Nigeria',
          city: 'Lagos'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      const found = res.body.data.find(p => p.id === createdPostcardId);
      expect(found).toBeDefined();
    });

    it('should like a postcard', async () => {
      const res = await request(app)
        .post(`/api/postcards/${createdPostcardId}/like`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.likes_count).toBeGreaterThanOrEqual(1);
    });

    it('should initiate, upload chunks, and assemble a 2GB document', async () => {
      // 1. Initiate chunk upload
      const initRes = await request(app)
        .post('/api/postcards/chunks/initiate')
        .send({
          user_id: testUserId,
          file_name: 'FingerMobile_Architecture_Spec_v3.pdf',
          mime_type: 'application/pdf',
          total_size_bytes: 104857600, // 100MB
          total_chunks: 2
        });

      expect(initRes.status).toBe(201);
      expect(initRes.body.success).toBe(true);
      chunkSessionId = initRes.body.data.upload_session_id;

      // 2. Upload Chunk 1
      const chunk1Res = await request(app)
        .post('/api/postcards/chunks/upload')
        .send({
          upload_session_id: chunkSessionId,
          chunk_index: 0,
          chunk_hash: 'sha256_mock_chunk_0'
        });
      expect(chunk1Res.status).toBe(200);
      expect(chunk1Res.body.data.is_complete).toBe(false);

      // 3. Upload Chunk 2
      const chunk2Res = await request(app)
        .post('/api/postcards/chunks/upload')
        .send({
          upload_session_id: chunkSessionId,
          chunk_index: 1,
          chunk_hash: 'sha256_mock_chunk_1'
        });
      expect(chunk2Res.status).toBe(200);
      expect(chunk2Res.body.data.is_complete).toBe(true);

      // 4. Assemble
      const assembleRes = await request(app)
        .post('/api/postcards/chunks/assemble')
        .send({
          upload_session_id: chunkSessionId
        });

      expect(assembleRes.status).toBe(200);
      expect(assembleRes.body.success).toBe(true);
      expect(assembleRes.body.data.final_file_url).toContain(chunkSessionId);
    });
  });

  // ==========================================================================
  // TASK 3: DEMOGRAPHIC & LOCATION HEATMAP FILTERING
  // ==========================================================================
  describe('Task 3: Demographic & Location Heatmap Filtering Service', () => {
    it('should enforce geofenced polygon and excluded country filtering', async () => {
      const ugcPrivacyService = require('../../services/ugcPrivacyService');

      const settings = {
        gender_target: 'female',
        allowed_genders: ['female'],
        age_range_min: 22,
        age_range_max: 60,
        allowed_locations: {
          countries: ['nigeria', 'ghana', 'kenya'],
          regions: [],
          cities: ['lagos', 'accra', 'nairobi'],
          polygons: [
            // Triangular geofence around Lagos Victoria Island / Lekki
            [[6.42, 3.40], [6.45, 3.50], [6.40, 3.55]]
          ]
        },
        excluded_locations: {
          countries: ['restricted_state'],
          regions: [],
          cities: [],
          polygons: []
        }
      };

      // 1. Valid viewer matching female, age 28, Lagos city
      const validViewer = {
        gender: 'female',
        age: 28,
        country: 'Nigeria',
        city: 'Lagos',
        lat: 6.43,
        lng: 6.48
      };
      const validCheck = ugcPrivacyService.checkDemographicAccess(settings, validViewer);
      expect(validCheck.allowed).toBe(true);

      // 2. Gender mismatch (male viewer)
      const maleViewer = { ...validViewer, gender: 'male' };
      const maleCheck = ugcPrivacyService.checkDemographicAccess(settings, maleViewer);
      expect(maleCheck.allowed).toBe(false);
      expect(maleCheck.reason).toContain('female');

      // 3. Age under 22
      const youngViewer = { ...validViewer, age: 19 };
      const ageCheck = ugcPrivacyService.checkDemographicAccess(settings, youngViewer);
      expect(ageCheck.allowed).toBe(false);
      expect(ageCheck.reason).toContain('between 22 and 60');

      // 4. Excluded country
      const excludedViewer = { ...validViewer, country: 'restricted_state' };
      const countryCheck = ugcPrivacyService.checkDemographicAccess(settings, excludedViewer);
      expect(countryCheck.allowed).toBe(false);
      expect(countryCheck.reason).toContain('excluded');
    });
  });

  // ==========================================================================
  // TASK 4: CREATOR INFLUENCE & VIP SUBSCRIPTIONS
  // ==========================================================================
  describe('Task 4: Creator Influence & VIP Subscriptions', () => {
    it('should configure tier perks for a creator', async () => {
      const res = await request(app)
        .post('/api/creator-subscriptions/perks')
        .send({
          creator_id: testUserId,
          tier: 'tier1',
          tier_name: 'VIP Bronze Fan Club',
          monthly_price: 4.99,
          currency: 'USD',
          perks: ['Exclusive badge', 'Early post access', 'Direct chat'],
          badge_icon: 'badge_bronze_star'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tier).toBe('tier1');
    });

    it('should fetch configured tier perks for creator', async () => {
      const res = await request(app)
        .get(`/api/creator-subscriptions/perks/${testUserId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should get subscriber roster analytics for creator', async () => {
      const res = await request(app)
        .get(`/api/creator-subscriptions/roster/${testUserId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.roster).toBeDefined();
    });
  });

  // ==========================================================================
  // TASK 5: LIVE STREAMING & REAL-TIME WEBRTC STUDIO
  // ==========================================================================
  describe('Task 5: Live Streaming & Real-Time Conference Studio', () => {
    it('should check if user can go live', async () => {
      const res = await request(app)
        .get('/api/live-stream/can-go-live')
        .query({ user_id: testUserId });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.canGoLive).toBe(true);
    });

    it('should create live stream with RTMP stream key', async () => {
      const res = await request(app)
        .post('/api/live-stream')
        .send({
          user_id: testUserId,
          title: 'FingerMobile Global Keynote 2026',
          description: 'Broadcasting next generation protocol features',
          category: 'Technology',
          privacy: 'public'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.streamKey).toMatch(/^sk_live_/);
      expect(res.body.data.ingressUrl).toContain('rtmp://live.fingermobileprotocol.com/app/');

      liveStreamId = res.body.data.id;
    });

    it('should start broadcast and update live state', async () => {
      const res = await request(app)
        .post(`/api/live-stream/${liveStreamId}/start`)
        .send({ user_id: testUserId });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.streamIsLive).toBe(true);
      expect(res.body.data.streamStatus).toBe('live');
    });

    it('should record viewer presence heartbeat', async () => {
      const res = await request(app)
        .post(`/api/live-stream/${liveStreamId}/heartbeat`)
        .send({ delta: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.viewerCount).toBeGreaterThanOrEqual(5);
    });

    it('should send real-time tip in Gems', async () => {
      const res = await request(app)
        .post(`/api/live-stream/${liveStreamId}/tip`)
        .send({
          sender_id: testUserId,
          amount: 100,
          currency: 'gems',
          message: 'Incredible broadcast! Keep building!'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.amount).toBe(100);
      expect(res.body.data.currency).toBe('gems');
    });

    it('should end live stream', async () => {
      const res = await request(app)
        .post(`/api/live-stream/${liveStreamId}/end`)
        .send({ user_id: testUserId });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.streamIsLive).toBe(false);
      expect(res.body.data.streamStatus).toBe('ended');
    });
  });
});
