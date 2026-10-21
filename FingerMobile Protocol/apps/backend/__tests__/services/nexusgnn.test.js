/**
 * NexusGNN Algorithm Unit Tests
 * Tests vector normalization, cosine similarities, 256D embeddings,
 * lifecycle transition rules, and asynchronous queue functionality.
 */

const gnnEngine = require('../../services/gnnEngine');
const nexusgnnService = require('../../services/nexusgnn');
const nexusgnnQueue = require('../../services/nexusgnnQueue');

describe('NexusGNN Algorithm Unit Tests', () => {
  describe('Vector & Cosine Operations', () => {
    it('should normalize vectors to unit length', () => {
      const vec = [3, 4]; // norm is 5
      const norm = gnnEngine.normalize(vec);
      expect(norm[0]).toBeCloseTo(0.6);
      expect(norm[1]).toBeCloseTo(0.8);
      const length = Math.sqrt(norm[0] * norm[0] + norm[1] * norm[1]);
      expect(length).toBeCloseTo(1.0);
    });

    it('should compute cosine similarity in [0, 1]', () => {
      const vecA = [1, 0, 0];
      const vecB = [1, 0, 0];
      const simIdentical = gnnEngine.cosineSimilarity(vecA, vecB);
      expect(simIdentical).toBeCloseTo(1.0);

      const vecC = [0, 1, 0];
      const simOrthogonal = gnnEngine.cosineSimilarity(vecA, vecC);
      expect(simOrthogonal).toBeCloseTo(0.5); // scaled to [0, 1] range

      const vecD = [-1, 0, 0];
      const simOpposite = gnnEngine.cosineSimilarity(vecA, vecD);
      expect(simOpposite).toBeCloseTo(0.0);
    });

    it('should generate 256-dimensional multimodal embeddings', () => {
      const node = {
        node_type: 'item',
        entity_id: 'post-12345',
        metadata: { category: 'technology', domain_authority: 0.85 }
      };
      const features = gnnEngine.extractInitialFeatures(node);
      expect(features.fused.length).toBe(256);
      expect(features.visual.length).toBe(128);
      expect(features.semantic.length).toBe(128);

      // Verify L2 norm = 1
      const l2 = Math.sqrt(features.fused.reduce((acc, v) => acc + v * v, 0));
      expect(l2).toBeCloseTo(1.0);
    });
  });

  describe('Lifecycle Phase Transition Logic', () => {
    it('should trigger seed to expansion transition on threshold met', () => {
      const metricsEligible = {
        saves: 12, // >= 10
        shares: 6,  // >= 5
        value_sentiment_score: 0.65 // >= 0.6
      };
      expect(nexusgnnService.shouldTransitionToExpansion(metricsEligible)).toBe(true);

      const metricsIneligible = {
        saves: 8,
        shares: 2,
        value_sentiment_score: 0.5
      };
      expect(nexusgnnService.shouldTransitionToExpansion(metricsIneligible)).toBe(false);
    });

    it('should trigger expansion to evergreen transition with stability period', () => {
      const twoDaysAgo = new Date(Date.now() - 50 * 3600 * 1000).toISOString();
      const lifecycleStable = {
        entered_current_phase_at: twoDaysAgo
      };
      const metricsHighSentiment = {
        value_sentiment_score: 0.80
      };
      expect(nexusgnnService.shouldTransitionToEvergreen(lifecycleStable, metricsHighSentiment)).toBe(true);

      const recentLifecycle = {
        entered_current_phase_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString()
      };
      expect(nexusgnnService.shouldTransitionToEvergreen(recentLifecycle, metricsHighSentiment)).toBe(false);
    });

    it('should archive degraded content with low evergreen score', () => {
      const lifecycleLowScore = { evergreen_score: 0.2 };
      const metricsHighImpressions = { impressions: 1500 };
      expect(nexusgnnService.shouldArchiveContent(lifecycleLowScore, metricsHighImpressions)).toBe(true);

      const metricsLowImpressions = { impressions: 400 };
      expect(nexusgnnService.shouldArchiveContent(lifecycleLowScore, metricsLowImpressions)).toBe(false);
    });
  });

  describe('Asynchronous Embedding Job Queue', () => {
    it('should enqueue and track embedding jobs', () => {
      const job = nexusgnnQueue.enqueueEmbeddingUpdate(['node-1', 'node-2'], 50);
      expect(job).toHaveProperty('jobId');
      expect(job.type).toBe('EMBEDDING_RECOMPUTATION');
      expect(job.targetNodesCount).toBe(2);

      const retrieved = nexusgnnQueue.getJob(job.jobId);
      expect(retrieved).not.toBeNull();
      expect(retrieved.jobId).toBe(job.jobId);
    });
  });

  describe('Serendipity Boost & Category Matching', () => {
    it('should apply boost for active exploration categories', () => {
      const vector = { active_categories: ['technology', 'design'] };
      expect(nexusgnnService.calculateSerendipityBoost(vector, 'technology')).toBe(0.15);
      expect(nexusgnnService.calculateSerendipityBoost(vector, 'cooking')).toBe(0);
    });
  });
});
