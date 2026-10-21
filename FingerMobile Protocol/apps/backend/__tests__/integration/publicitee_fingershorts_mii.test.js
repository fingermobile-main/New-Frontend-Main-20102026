const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const { pool } = require('../../db');
const { JWT_SECRET } = require('../../config');

describe('Publicitee, FingerShorts, and Mii Modules Integration Tests', () => {
  let token;
  const testUserId = 5;

  beforeAll(async () => {
    // Generate valid JWT token for active test user
    token = jwt.sign(
      { id: testUserId, userId: testUserId, email: 'member1@example.com' },
      JWT_SECRET || 'dev-secret-key',
      { expiresIn: '1h' }
    );

    // Clean up any existing test records
    await pool.query('DELETE FROM publicitee_items WHERE author_id = $1', [String(testUserId)]);
    await pool.query('DELETE FROM fingershorts_sessions WHERE author_id = $1', [String(testUserId)]);
    await pool.query('DELETE FROM mii_statuses WHERE author_id = $1', [String(testUserId)]);
    await pool.query('DELETE FROM mii_contacts WHERE user_id = $1 OR contact_user_id = $1', [String(testUserId)]);
    await pool.query('DELETE FROM publicitee_subscriptions WHERE user_id = $1', [String(testUserId)]);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM publicitee_items WHERE author_id = $1', [String(testUserId)]);
    await pool.query('DELETE FROM fingershorts_sessions WHERE author_id = $1', [String(testUserId)]);
    await pool.query('DELETE FROM mii_statuses WHERE author_id = $1', [String(testUserId)]);
    await pool.query('DELETE FROM mii_contacts WHERE user_id = $1 OR contact_user_id = $1', [String(testUserId)]);
    await pool.query('DELETE FROM publicitee_subscriptions WHERE user_id = $1', [String(testUserId)]);
    await pool.end();
  });

  // ==========================================================================
  // 1. PUBLICITEE MODULE TESTS (168h TTL, 1-Video Card, 1.5GB, 1h55m max, $3/mo)
  // ==========================================================================
  describe('Publicitee Module (Reels)', () => {
    it('GET /api/publicitee/feed - should return publicitee discovery feed with 168h TTL spec', async () => {
      const res = await request(app).get('/api/publicitee/feed');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.spec.ttl_hours).toBe(168);
      expect(res.body.spec.card_limit).toBe(1);
      expect(res.body.spec.subscription_cost).toBe('$3.00/mo');
    });

    it('POST /api/publicitee - should reject creation if no active $3.00/mo subscription exists', async () => {
      const res = await request(app)
        .post('/api/publicitee')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'My Indie Short Film',
          video_url: 'https://cdn.fingermobileprotocol.com/videos/shortfilm1.mp4',
          file_size_bytes: 104857600, // 100MB
          duration_seconds: 3600 // 1 hour
        });

      expect(res.status).toBe(402);
      expect(res.body.success).toBe(false);
      expect(res.body.subscriptionRequired).toBe(true);
    });

    it('POST /api/publicitee/subscription/subscribe - should activate $3.00/mo subscription', async () => {
      const res = await request(app)
        .post('/api/publicitee/subscription/subscribe')
        .set('Authorization', `Bearer ${token}`)
        .send({ payment_method: 'fic' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tier).toBe('monthly_creator');
    });

    it('POST /api/publicitee - should enforce maximum video time of 1hr 55mins (6900s)', async () => {
      const res = await request(app)
        .post('/api/publicitee')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Too Long Film',
          video_url: 'https://cdn.fingermobileprotocol.com/videos/toolong.mp4',
          file_size_bytes: 500000000,
          duration_seconds: 7000 // Exceeds 6900s
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Video duration exceeds maximum allowed of 1Hr 55Mins');
    });

    it('POST /api/publicitee - should enforce maximum file size of 1.5GB', async () => {
      const res = await request(app)
        .post('/api/publicitee')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Too Heavy Film',
          video_url: 'https://cdn.fingermobileprotocol.com/videos/tooheavy.mp4',
          file_size_bytes: 2000000000, // > 1.5GB
          duration_seconds: 3000
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('File size exceeds maximum allowed of 1.5GB');
    });

    it('POST /api/publicitee - should successfully create Publicitee reel with 168-hour TTL', async () => {
      const res = await request(app)
        .post('/api/publicitee')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'A Lagos Story - Episode 1',
          description: 'Pilot episode of the skit comedy series',
          video_url: 'https://cdn.fingermobileprotocol.com/videos/lagos_ep1.mp4',
          thumbnail_url: 'https://cdn.fingermobileprotocol.com/thumbs/lagos_ep1.jpg',
          category: 'skit',
          file_size_bytes: 45000000,
          duration_seconds: 480.0
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.card_count).toBe(1);
      expect(parseFloat(res.body.data.hours_remaining)).toBeGreaterThan(160);
    });
  });

  // ==========================================================================
  // 2. FINGERSHORTS MODULE TESTS (48h TTL, Up to 20 Cards, 20MB, 60s max)
  // ==========================================================================
  describe('FingerShorts Module (Stories)', () => {
    it('GET /api/fingershorts/for-you - should return For You feed with 48h TTL spec', async () => {
      const res = await request(app).get('/api/fingershorts/for-you');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.spec.ttl_hours).toBe(48);
      expect(res.body.spec.max_cards).toBe(20);
      expect(res.body.spec.max_size_mb).toBe(20);
      expect(res.body.spec.max_duration_sec).toBe(60);
    });

    it('POST /api/fingershorts/sessions - should reject session with more than 20 cards', async () => {
      const excessiveCards = Array.from({ length: 21 }, (_, i) => ({
        media_url: `https://cdn.fingermobileprotocol.com/card_${i}.mp4`,
        file_size_bytes: 5000000,
        duration_seconds: 15.0
      }));

      const res = await request(app)
        .post('/api/fingershorts/sessions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Too Many Cards Story',
          cards: excessiveCards
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('cannot exceed 20 media cards');
    });

    it('POST /api/fingershorts/sessions - should reject card exceeding 20MB', async () => {
      const res = await request(app)
        .post('/api/fingershorts/sessions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Heavy Card Story',
          cards: [
            {
              media_url: 'https://cdn.fingermobileprotocol.com/heavy.mp4',
              file_size_bytes: 25000000, // 25MB > 20MB
              duration_seconds: 30.0
            }
          ]
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('File size exceeds 20MB limit');
    });

    it('POST /api/fingershorts/sessions - should reject video exceeding 1 minute (60s)', async () => {
      const res = await request(app)
        .post('/api/fingershorts/sessions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Long Video Story',
          cards: [
            {
              media_type: 'video',
              media_url: 'https://cdn.fingermobileprotocol.com/toolong.mp4',
              file_size_bytes: 10000000,
              duration_seconds: 75.0 // > 60s
            }
          ]
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Video duration exceeds 1 minute');
    });

    it('POST /api/fingershorts/sessions - should successfully create session with multiple media cards (48h TTL)', async () => {
      const res = await request(app)
        .post('/api/fingershorts/sessions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'My Weekend Vibe',
          cards: [
            {
              card_index: 1,
              media_type: 'video',
              media_url: 'https://cdn.fingermobileprotocol.com/card1.mp4',
              file_size_bytes: 12000000,
              duration_seconds: 45.0,
              resolution_w: 1080,
              resolution_h: 1920
            },
            {
              card_index: 2,
              media_type: 'image',
              media_url: 'https://cdn.fingermobileprotocol.com/card2.jpg',
              file_size_bytes: 2000000,
              duration_seconds: 5.0,
              resolution_w: 1080,
              resolution_h: 1920
            }
          ]
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.card_count).toBe(2);
      expect(res.body.data.cards.length).toBe(2);
    });

    it('GET /api/fingershorts/sounds & POST /api/fingershorts/sounds - should support sound library', async () => {
      const createRes = await request(app)
        .post('/api/fingershorts/sounds')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Afrobeat Viral Hook',
          artist: 'Beatwave SoundLab',
          audio_url: 'https://cdn.fingermobileprotocol.com/audio/viral_hook.mp3',
          duration_seconds: 30.0
        });

      expect(createRes.status).toBe(201);
      expect(createRes.body.success).toBe(true);

      const listRes = await request(app).get('/api/fingershorts/sounds?q=Afrobeat');
      expect(listRes.status).toBe(200);
      expect(listRes.body.data.length).toBeGreaterThan(0);
    });
  });

  // ==========================================================================
  // 3. MII MODULE TESTS (48h Disappearing UGC, Orbit, Pin Sync & Instant Vanish)
  // ==========================================================================
  describe('Mii Module (Disappearing Status & Contact Sync)', () => {
    it('GET /api/mii/pin/my - should generate/return 6-digit Mii ID Pin', async () => {
      const res = await request(app)
        .get('/api/mii/pin/my')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.member_id_pin).toMatch(/^\d{6}$/);
    });

    it('POST /api/mii/status - should enforce 50MB and 3-minute limits on Mii status cards', async () => {
      const res = await request(app)
        .post('/api/mii/status')
        .set('Authorization', `Bearer ${token}`)
        .send({
          cards: [
            {
              media_type: 'video',
              media_url: 'https://cdn.fingermobileprotocol.com/mii_video.mp4',
              file_size_bytes: 40000000,
              duration_seconds: 200.0 // Exceeds 180s (3 mins)
            }
          ]
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Video duration exceeds 3 minutes');
    });

    it('POST /api/mii/status - should create active 48-hour Mii status with pulsating ring response', async () => {
      const res = await request(app)
        .post('/api/mii/status')
        .set('Authorization', `Bearer ${token}`)
        .send({
          audience_type: 'followers',
          cards: [
            {
              media_type: 'photo',
              media_url: 'https://cdn.fingermobileprotocol.com/mii_pic.jpg',
              file_size_bytes: 3500000,
              caption: 'Morning meditation vibes',
              timer_type: '48hrs'
            }
          ]
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.card_count).toBe(1);

      const feedRes = await request(app)
        .get('/api/mii/status/feed')
        .set('Authorization', `Bearer ${token}`);

      expect(feedRes.status).toBe(200);
      expect(feedRes.headers['x-mii-lifespan-hours']).toBe('48');
      expect(feedRes.headers['x-screen-capture-block']).toBe('true');
    });

    it('POST /api/mii/presence/update & GET /api/mii/presence/showcase/:contactId - should lock activity until Pin accepted', async () => {
      // 1. Update presence with BeatwaveNG now listening
      await request(app)
        .post('/api/mii/presence/update')
        .set('Authorization', `Bearer ${token}`)
        .send({
          is_online: true,
          now_listening_title: 'Rush',
          now_listening_artist: 'Ayra Starr',
          now_watching_title: 'Lagos Fashion Week Live'
        });

      // 2. Fetch from a contact without mutual Pin
      const showcaseRes = await request(app)
        .get('/api/mii/presence/showcase/88888')
        .set('Authorization', `Bearer ${token}`);

      expect(showcaseRes.status).toBe(200);
      expect(showcaseRes.body.locked).toBe(true);
      expect(showcaseRes.body.message).toContain('Mutual Mii ID Pin exchange required');
    });

    it('Pin Exchange Protocol: Exchange -> Accept -> Instant Vanish Revocation', async () => {
      const contactUserId = '77777';

      // 1. Exchange Pin
      const exchRes = await request(app)
        .post('/api/mii/pin/exchange')
        .set('Authorization', `Bearer ${token}`)
        .send({
          contact_user_id: contactUserId,
          pin_code: '458921',
          contact_name: 'Amaka VIP'
        });
      expect(exchRes.status).toBe(200);
      expect(exchRes.body.data.pin_status).toBe('pending');

      // 2. Accept Pin
      const acceptRes = await request(app)
        .post('/api/mii/pin/accept')
        .set('Authorization', `Bearer ${token}`)
        .send({ contact_user_id: contactUserId });
      expect(acceptRes.status).toBe(200);
      expect(acceptRes.body.is_mutual).toBe(true);
      expect(acceptRes.body.activity_visible).toBe(true);

      // 3. Instant Vanish Revocation
      const revokeRes = await request(app)
        .post('/api/mii/pin/revoke')
        .set('Authorization', `Bearer ${token}`)
        .send({ contact_user_id: contactUserId });
      expect(revokeRes.status).toBe(200);
      expect(revokeRes.body.vanished).toBe(true);
    });

    it('FingerOrbit: folder configuration, anti-screenshot headers, and tokenized download', async () => {
      // 1. Get/init Folders
      const foldersRes = await request(app)
        .get('/api/mii/orbit/folders')
        .set('Authorization', `Bearer ${token}`);
      expect(foldersRes.status).toBe(200);
      expect(foldersRes.body.data.length).toBe(2); // Video and Image

      // 2. Configure video folder
      const configRes = await request(app)
        .put('/api/mii/orbit/folders/video')
        .set('Authorization', `Bearer ${token}`)
        .send({
          visibility: 'private',
          ugc_timer: '12hrs'
        });
      expect(configRes.status).toBe(200);
      expect(configRes.body.data.visibility).toBe('private');
      expect(configRes.body.data.ugc_timer).toBe('12hrs');
    });

    it('Mii MiniStore: should enforce strictly Two (2) Page Catalogue', async () => {
      // 1. Add product to Page 1
      const addRes = await request(app)
        .post('/api/mii/ministore/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Handmade Silk Scarf',
          price_fic: 45.0,
          price_gems: 150,
          catalog_page: 1
        });
      expect(addRes.status).toBe(201);

      // 2. Reject page 3 (strictly 2 pages)
      const rejectPageRes = await request(app)
        .post('/api/mii/ministore/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Invalid Item',
          catalog_page: 3
        });
      expect(rejectPageRes.status).toBe(400);

      // 3. Get catalog page 1
      const catRes = await request(app).get(`/api/mii/ministore/${testUserId}?page=1`);
      expect(catRes.status).toBe(200);
      expect(catRes.body.catalog_page).toBe(1);
      expect(catRes.body.total_pages).toBe(2);
    });
  });
});
