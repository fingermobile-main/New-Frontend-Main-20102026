/**
 * FingerMobile Protocol™ - Cognitive-Legal Vault & Feedback Anticipation Integration Tests
 * Validates S_risk defamation scoring, Content-ID, Notice-and-Action, Child Protection (NDPA Sec 31),
 * Data Portability & Cascading Erasure, Tiered Kill-Switch, Proof of Play (PoP), and 2026 Tax Shield
 */

const request = require('supertest');
const app = require('../../app');
const { pool } = require('../../db');

describe('Cognitive-Legal Vault & Feedback Anticipation Integration Tests', () => {
  const testUserId = 'a0000000-0000-0000-0000-000000000099';
  const testMinorId = 'a0000000-0000-0000-0000-000000000088';

  beforeAll(async () => {
    // Clean up test records
    await pool.query('DELETE FROM defamation_risk_logs WHERE author_id = $1', [testUserId]);
    await pool.query('DELETE FROM child_consent_logs WHERE minor_user_id = $1', [testMinorId]);
    await pool.query('DELETE FROM data_portability_requests WHERE user_id = $1', [testUserId]);
    await pool.query('DELETE FROM pop_stream_pulses WHERE user_id = $1', [testUserId]);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM defamation_risk_logs WHERE author_id = $1', [testUserId]);
    await pool.query('DELETE FROM child_consent_logs WHERE minor_user_id = $1', [testMinorId]);
    await pool.query('DELETE FROM data_portability_requests WHERE user_id = $1', [testUserId]);
    await pool.query('DELETE FROM pop_stream_pulses WHERE user_id = $1', [testUserId]);
    await pool.end();
  });

  // ==========================================================================
  // 1. Feedback Anticipation & Cognitive Optimization
  // ==========================================================================
  describe('Feedback Anticipation Engine', () => {
    it('POST /api/v1/vault/anticipation/interactions - should process Love feedback with double_click haptic & shimmer', async () => {
      const res = await request(app)
        .post('/api/v1/vault/anticipation/interactions')
        .send({
          targetId: 'post_1001',
          targetType: 'forum_thread',
          interactionType: 'love',
          userId: testUserId
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.hapticProfile).toBe('double_click');
      expect(res.body.data.shimmerActive).toBe(true);
      expect(res.body.data.feedbackMultiplier).toBe(1.5);
    });

    it('POST /api/v1/vault/anticipation/interactions - should process long-press burst interaction', async () => {
      const res = await request(app)
        .post('/api/v1/vault/anticipation/interactions')
        .send({
          targetId: 'post_1002',
          targetType: 'publicitee_reel',
          interactionType: 'burst',
          durationMs: 2000,
          userId: testUserId
        });

      expect(res.status).toBe(200);
      expect(res.body.data.hapticProfile).toBe('heavy_vibrate');
      expect(res.body.data.feedbackMultiplier).toBe(2.5);
    });

    it('GET /api/v1/vault/anticipation/stochastic-reward - should roll variable reinforcement reward', async () => {
      const res = await request(app)
        .get('/api/v1/vault/anticipation/stochastic-reward?streakCount=6')
        .query({ userId: testUserId });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('rewardType');
      expect(res.body.data).toHaveProperty('rollMetric');
    });

    it('POST /api/v1/vault/anticipation/cognitive-load - should flag cognitive overload for rapid doomscrolling', async () => {
      const res = await request(app)
        .post('/api/v1/vault/anticipation/cognitive-load')
        .send({
          refreshIntervalMs: 800,
          scrollSpeedPxPerSec: 3200,
          sessionDurationMinutes: 50
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.cognitiveOverload).toBe(true);
      expect(res.body.data.throttleAction).toBe('recommend_break');
      expect(res.body.data.promptMessage).toContain('breathing moment');
    });

    it('GET /api/v1/vault/anticipation/notifications/peripheral - should return 5-7s non-intrusive shade queue', async () => {
      const res = await request(app)
        .get('/api/v1/vault/anticipation/notifications/peripheral')
        .query({ userId: testUserId });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.notifications)).toBe(true);
      expect(res.body.data.notifications[0].displayWindowSeconds).toBeLessThanOrEqual(7);
    });
  });

  // ==========================================================================
  // 2. Pre-Publication Defamation Risk Scoring & Content-ID
  // ==========================================================================
  describe('Legal Vault: Defamation & Content-ID', () => {
    it('POST /api/v1/vault/legal/defamation-score - should quarantine high-risk defamatory statement', async () => {
      const res = await request(app)
        .post('/api/v1/vault/legal/defamation-score')
        .send({
          textContent: 'Senator XYZ stole 50 billion naira and embezzled all community funds, he is a criminal fraud!',
          targetEntity: 'Senator XYZ',
          authorId: testUserId
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.aggregateRisk).toBeGreaterThanOrEqual(0.75);
      expect(res.body.data.moderationAction).toBe('quarantined');
      expect(res.body.data.quarantineReason).toContain('Cybercrimes Act 2024');
    });

    it('POST /api/v1/vault/legal/defamation-score - should approve benign post with low risk score', async () => {
      const res = await request(app)
        .post('/api/v1/vault/legal/defamation-score')
        .send({
          textContent: 'The new BeatwaveNG Afrobeat drop sounds magnificent today! Check it out.',
          authorId: testUserId
        });

      expect(res.status).toBe(200);
      expect(res.body.data.aggregateRisk).toBeLessThan(0.40);
      expect(res.body.data.moderationAction).toBe('approved');
    });

    it('POST /api/v1/vault/legal/content-id/fingerprint - should register new media perceptual fingerprint', async () => {
      const testHash = `phash_${Date.now()}`;
      const res = await request(app)
        .post('/api/v1/vault/legal/content-id/fingerprint')
        .send({
          mediaUrl: 'https://cdn.fingermobileprotocol.com/audio/track_01.mp3',
          mediaType: 'audio',
          copyrightOwner: 'FingerMobile Records Ltd',
          perceptualHash: testHash,
          authorId: testUserId
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.perceptual_hash).toBe(testHash);
    });

    it('POST /api/v1/vault/legal/notice-action/takedown & appeal - should process statutory takedown and counter-appeal', async () => {
      const takedownRes = await request(app)
        .post('/api/v1/vault/legal/notice-action/takedown')
        .send({
          claimantName: 'Barrister Chukwuma Adebayo',
          claimantEmail: 'legal@adebayochambers.com',
          infringementCategory: 'defamation',
          targetContentUri: 'https://fingermobileprotocol.com/forum/posts/post_1001'
        });

      expect(takedownRes.status).toBe(201);
      expect(takedownRes.body.data.takedown_status).toBe('quarantined');
      const noticeId = takedownRes.body.data.notice_id;

      // File counter-appeal
      const appealRes = await request(app)
        .post('/api/v1/vault/legal/notice-action/appeal')
        .send({
          noticeId,
          appealReason: 'Statements are based on verifiable public audit reports under freedom of information.'
        });

      expect(appealRes.status).toBe(200);
      expect(appealRes.body.data.takedown_status).toBe('appealed');
    });
  });

  // ==========================================================================
  // 3. Child Protection Layer (NDPA 2023 Sec 31)
  // ==========================================================================
  describe('Child Protection Layer (NDPA Sec 31)', () => {
    it('POST /api/v1/vault/legal/child-protection/consent - should record guardian verified consent', async () => {
      const res = await request(app)
        .post('/api/v1/vault/legal/child-protection/consent')
        .send({
          minorUserId: testMinorId,
          guardianEmail: 'guardian.parent@example.com',
          guardianPhone: '+2348012345678',
          verificationMethod: 'otp'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('verified');
      expect(res.body.data.guardian_id_hash).toBeDefined();
    });

    it('GET /api/v1/vault/legal/child-protection/status/:userId - should return Minor-Mode and curfew status', async () => {
      const res = await request(app)
        .get(`/api/v1/vault/legal/child-protection/status/${testMinorId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isMinor).toBe(true);
      expect(res.body.data.minorModeActive).toBe(true);
      expect(res.body.data.zeroTrackingEnforced).toBe(true);
    });
  });

  // ==========================================================================
  // 4. Data Portability & Cascading Erasure
  // ==========================================================================
  describe('Data Portability & Erasure Pipeline', () => {
    let requestId;

    it('POST /api/v1/vault/archive/request - should queue asynchronous data portability export', async () => {
      const res = await request(app)
        .post('/api/v1/vault/archive/request')
        .send({
          userId: testUserId,
          exportScope: 'all',
          requestType: 'export'
        });

      expect(res.status).toBe(202);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('processing');
      requestId = res.body.data.requestId;
    });

    it('GET /api/v1/vault/archive/status/:requestId - should check export completion status', async () => {
      const res = await request(app)
        .get(`/api/v1/vault/archive/status/${requestId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('completed');
      expect(res.body.data.encrypted_s3_uri).toContain('s3://');
    });

    it('GET /api/v1/vault/archive/download/:requestId - should issue 24h signed URL with KMS grant', async () => {
      const res = await request(app)
        .get(`/api/v1/vault/archive/download/${requestId}`);

      expect(res.status).toBe(200);
      expect(res.body.data.ttlHours).toBe(24);
      expect(res.body.data.signedUrl).toContain('https://vault.fingermobileprotocol.com/downloads/dsar/');
    });

    it('POST /api/v1/vault/archive/erasure - should execute zero-residual cascading erasure', async () => {
      const res = await request(app)
        .post('/api/v1/vault/archive/erasure')
        .send({ userId: testUserId });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/zero-residual/i);
    });
  });

  // ==========================================================================
  // 5. Tiered API Kill-Switch Circuit Breaker
  // ==========================================================================
  describe('Tiered API Kill-Switch Circuit Breaker', () => {
    it('POST /api/v1/vault/dpo/killswitch/trigger - should reject terminating Tier 1 Core services', async () => {
      const res = await request(app)
        .post('/api/v1/vault/dpo/killswitch/trigger')
        .send({
          tierAffected: 'tier1_core',
          reason: 'Attempted emergency shutdown'
        });

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('Tier 1 Core services cannot be terminated');
    });

    it('POST /api/v1/vault/dpo/killswitch/trigger - should activate Tier 3 Engagement Instant Kill', async () => {
      const res = await request(app)
        .post('/api/v1/vault/dpo/killswitch/trigger')
        .send({
          tierAffected: 'tier3_engagement_kill',
          reason: 'Regulatory compliance maintenance window'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.action).toBe('activated');
      expect(res.body.data.immutable_worm_hash).toBeDefined();
    });

    it('POST /api/v1/vault/dpo/killswitch/recover - should linear warm-up ramp recovery to 50%', async () => {
      const res = await request(app)
        .post('/api/v1/vault/dpo/killswitch/recover')
        .send({
          tierAffected: 'tier3_engagement_kill',
          recoveryPercentage: 50
        });

      expect(res.status).toBe(200);
      expect(res.body.data.recovery_percentage).toBe(50);
      expect(res.body.data.action).toBe('recovery_ramp');
    });

    it('GET /api/v1/vault/dpo/audit/car-report - should generate regulatory CAR audit report', async () => {
      const res = await request(app)
        .get('/api/v1/vault/dpo/audit/car-report');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.carReport.deadMansSwitchStatus).toBe('ARMED');
      expect(res.body.carReport.complianceHealthScore).toBe('99.4%');
    });
  });

  // ==========================================================================
  // 6. BeatwaveNG Proof of Play & 2026 Fiscal Tax Shield
  // ==========================================================================
  describe('BeatwaveNG Proof of Play & 2026 Fiscal Tax Shield', () => {
    it('POST /api/v1/vault/beatwave/pop/pulse - should mint 0.1 Gems for 30s stream pulse', async () => {
      const res = await request(app)
        .post('/api/v1/vault/beatwave/pop/pulse')
        .send({
          userId: testUserId,
          trackId: 'track_afrobeat_999',
          pulseIndex: 1
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.gemsMinted).toBe(0.1);
      expect(res.body.data.durationSeconds).toBe(30);
    });

    it('POST /api/v1/vault/beatwave/curation/mine - should award 50 Gems for playlist milestone', async () => {
      const res = await request(app)
        .post('/api/v1/vault/beatwave/curation/mine')
        .send({
          userId: testUserId,
          playlistId: 'playlist_vibes_2026',
          uniqueListenersCount: 25
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rewardGems).toBe(50);
    });

    it('GET /api/v1/vault/beatwave/tax/summary/:creatorId - should calculate 0.005% Cybersecurity Levy & ₦800k PIT tracker', async () => {
      const res = await request(app)
        .get(`/api/v1/vault/beatwave/tax/summary/${testUserId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.cybersecurityLevyPercentage).toBe('0.005%');
      expect(res.body.data.isSmallBusinessExempt).toBe(true);
      expect(res.body.data.pitReliefThreshold).toBe(800000);
      expect(res.body.data.netPayout).toBeDefined();
    });
  });
});
