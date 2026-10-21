/* eslint-disable no-unused-vars */
/**
 * NexusGNN Controller
 * API endpoints for Graph Neural Network P2P Matching & Management
 */

const nexusgnnService = require('../services/nexusgnn');
const nexusgnnQueue = require('../services/nexusgnnQueue');
const nexusgnnLifecycle = require('../services/nexusgnnLifecycle');
const logger = require('../utils/logger');
const { pool } = require('../db');

class NexusGNNController {
  /**
   * POST /api/nexusgnn/match
   * Find matches using NexusGNN algorithm
   */
  async findMatches(req, res) {
    try {
      const userId = req.user?.id;
      const { contentType, limit, options } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const matches = await nexusgnnService.findMatches(
        userId,
        contentType || 'all',
        limit || 20,
        options || {}
      );

      res.json({
        success: true,
        message: 'Matches found successfully',
        data: {
          matches,
          count: matches.length,
          algorithm: 'NexusGNN-PinSage-MetaGNN',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.findMatches:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to find matches',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/nexusgnn/recommendations/:userId
   */
  async getRecommendations(req, res) {
    try {
      const { userId } = req.params;
      const { contentType, limit } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const recommendations = await nexusgnnService.findMatches(
        userId,
        contentType || 'all',
        parseInt(limit) || 20
      );

      res.json({
        success: true,
        message: 'Recommendations retrieved successfully',
        data: {
          userId,
          recommendations,
          count: recommendations.length,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.getRecommendations:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get recommendations',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/nexusgnn/content/:id/lifecycle
   */
  async updateContentLifecycle(req, res) {
    try {
      const { id } = req.params;
      const { contentType, metrics } = req.body;

      if (!id || !contentType || !metrics) {
        return res.status(400).json({
          success: false,
          message: 'Content ID, content type, and metrics are required'
        });
      }

      const lifecycle = await nexusgnnService.updateContentLifecycle(
        id,
        contentType,
        metrics
      );

      res.json({
        success: true,
        message: 'Content lifecycle updated successfully',
        data: {
          lifecycle,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.updateContentLifecycle:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update content lifecycle',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/nexusgnn/graph/analytics
   */
  async getGraphAnalytics(req, res) {
    try {
      const { timeRange } = req.query;

      // Get node statistics
      const nodeStats = await pool.query(`
        SELECT 
          node_type,
          COUNT(*) as count,
          COUNT(CASE WHEN embedding_vector IS NOT NULL THEN 1 END) as with_embeddings
        FROM nexusgnn_graph_nodes
        GROUP BY node_type
      `);

      // Get edge statistics
      const edgeStats = await pool.query(`
        SELECT 
          edge_type,
          COUNT(*) as count,
          AVG(weight) as avg_weight,
          SUM(interaction_count) as total_interactions
        FROM nexusgnn_graph_edges
        GROUP BY edge_type
      `);

      // Get lifecycle distribution
      const lifecycleDist = await pool.query(`
        SELECT 
          current_phase,
          COUNT(*) as count, 
          AVG(value_sentiment_score) as avg_sentiment,
          AVG(evergreen_score) as avg_evergreen
        FROM nexusgnn_content_lifecycle
        GROUP BY current_phase
      `);

      // Get performance metrics
      const performanceMetrics = await pool.query(`
        SELECT 
          metric_type,
          AVG(metric_value) as avg_value,
          COUNT(*) as data_points
        FROM nexusgnn_performance_analytics
        WHERE recorded_at >= NOW() - INTERVAL '7 days'
        GROUP BY metric_type
      `);

      // Overall totals
      const totalNodes = (nodeStats.rows || []).reduce((acc, r) => acc + parseInt(r.count || 0), 0);
      const totalEdges = (edgeStats.rows || []).reduce((acc, r) => acc + parseInt(r.count || 0), 0);
      const totalEmbeddings = (nodeStats.rows || []).reduce((acc, r) => acc + parseInt(r.with_embeddings || 0), 0);

      res.json({
        success: true,
        message: 'Graph analytics retrieved successfully',
        data: {
          summary: {
            totalNodes,
            totalEdges,
            totalEmbeddings,
            embeddingCoverage: totalNodes > 0 ? Math.round((totalEmbeddings / totalNodes) * 100) : 0
          },
          nodes: nodeStats.rows,
          edges: edgeStats.rows,
          lifecycleDistribution: lifecycleDist.rows,
          performanceMetrics: performanceMetrics.rows,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.getGraphAnalytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get graph analytics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/nexusgnn/embeddings/update
   * Trigger real asynchronous embedding recalculation job
   */
  async updateEmbeddings(req, res) {
    try {
      const { nodeIds, batchSize } = req.body;

      // Enqueue real background GNN embedding calculation job
      const job = nexusgnnQueue.enqueueEmbeddingUpdate(nodeIds, batchSize || 100);

      res.json({
        success: true,
        message: 'GNN PinSage-MetaGNN embedding update job enqueued successfully',
        data: job
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.updateEmbeddings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to queue embedding update',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/nexusgnn/embeddings/jobs
   */
  async getEmbeddingJobs(req, res) {
    try {
      const jobs = nexusgnnQueue.listJobs(30);
      res.json({
        success: true,
        data: { jobs, count: jobs.length }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch embedding jobs' });
    }
  }

  /**
   * GET /api/nexusgnn/embeddings/jobs/:jobId
   */
  async getEmbeddingJobStatus(req, res) {
    try {
      const { jobId } = req.params;
      const job = nexusgnnQueue.getJob(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      res.json({ success: true, data: job });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch job status' });
    }
  }

  /**
   * GET /api/nexusgnn/lifecycle/content
   * Fetch content grouped or filtered by lifecycle phase for the Kanban dashboard
   */
  async getLifecycleContent(req, res) {
    try {
      const { phase, limit = 50 } = req.query;

      let query = `
        SELECT 
          ncl.*,
          p.title,
          p.category,
          p.author_id,
          u.username as author_name
        FROM nexusgnn_content_lifecycle ncl
        LEFT JOIN posts p ON ncl.content_id::text = p.id::text
        LEFT JOIN users u ON p.author_id = u.id
      `;
      const params = [];

      if (phase) {
        query += ' WHERE ncl.current_phase = $1';
        params.push(phase);
        query += ` ORDER BY ncl.updated_at DESC LIMIT $2`;
        params.push(parseInt(limit));
      } else {
        query += ` ORDER BY ncl.updated_at DESC LIMIT $1`;
        params.push(parseInt(limit));
      }

      const result = await pool.query(query, params);

      res.json({
        success: true,
        data: {
          items: result.rows,
          count: result.rows.length,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error fetching lifecycle content:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch lifecycle content' });
    }
  }

  /**
   * POST /api/nexusgnn/lifecycle/batch-evaluate
   * Trigger batch evaluation of all content lifecycle states
   */
  async batchEvaluateLifecycle(req, res) {
    try {
      const result = await nexusgnnLifecycle.evaluateAllContentLifecycle();
      res.json({
        success: true,
        message: 'Content lifecycle batch evaluation completed successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to evaluate lifecycle' });
    }
  }

  /**
   * GET /api/nexusgnn/graph/nodes
   */
  async getGraphNodes(req, res) {
    try {
      const { nodeType, limit = 50, offset = 0 } = req.query;
      let query = 'SELECT * FROM nexusgnn_graph_nodes';
      const params = [];

      if (nodeType) {
        query += ' WHERE node_type = $1 ORDER BY updated_at DESC LIMIT $2 OFFSET $3';
        params.push(nodeType, parseInt(limit), parseInt(offset));
      } else {
        query += ' ORDER BY updated_at DESC LIMIT $1 OFFSET $2';
        params.push(parseInt(limit), parseInt(offset));
      }

      const result = await pool.query(query, params);
      const countRes = await pool.query('SELECT COUNT(*) as total FROM nexusgnn_graph_nodes');

      res.json({
        success: true,
        data: {
          nodes: result.rows,
          total: parseInt(countRes.rows[0]?.total || 0),
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch graph nodes' });
    }
  }

  /**
   * GET /api/nexusgnn/graph/edges
   */
  async getGraphEdges(req, res) {
    try {
      const { edgeType, limit = 50, offset = 0 } = req.query;
      let query = `
        SELECT 
          e.*,
          s.entity_id as source_entity,
          s.node_type as source_type,
          t.entity_id as target_entity,
          t.node_type as target_type
        FROM nexusgnn_graph_edges e
        JOIN nexusgnn_graph_nodes s ON e.source_node_id = s.id
        JOIN nexusgnn_graph_nodes t ON e.target_node_id = t.id
      `;
      const params = [];

      if (edgeType) {
        query += ' WHERE e.edge_type = $1 ORDER BY e.updated_at DESC LIMIT $2 OFFSET $3';
        params.push(edgeType, parseInt(limit), parseInt(offset));
      } else {
        query += ' ORDER BY e.updated_at DESC LIMIT $1 OFFSET $2';
        params.push(parseInt(limit), parseInt(offset));
      }

      const result = await pool.query(query, params);
      const countRes = await pool.query('SELECT COUNT(*) as total FROM nexusgnn_graph_edges');

      res.json({
        success: true,
        data: {
          edges: result.rows,
          total: parseInt(countRes.rows[0]?.total || 0),
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch graph edges' });
    }
  }

  /**
   * GET /api/nexusgnn/serendipity/:userId
   */
  async getSerendipityContent(req, res) {
    try {
      const { userId } = req.params;
      const { limit } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      let serendipityConfig = await pool.query(
        'SELECT * FROM nexusgnn_serendipity_vectors WHERE user_id = $1',
        [userId]
      );

      if (serendipityConfig.rows.length === 0) {
        await nexusgnnService.initializeSerendipityVector(userId);
        serendipityConfig = await pool.query(
          'SELECT * FROM nexusgnn_serendipity_vectors WHERE user_id = $1',
          [userId]
        );
      }

      const config = serendipityConfig.rows[0] || {};
      const injectionCount = Math.max(1, Math.ceil((parseInt(limit) || 10) * (config.injection_percentage || 0.1)));
      const activeCats = Array.isArray(config.active_categories)
        ? config.active_categories
        : ['technology', 'design', 'lifestyle'];

      const serendipitousContent = await pool.query(
        `SELECT p.*, ncl.current_phase, ncl.value_sentiment_score
         FROM posts p
         JOIN nexusgnn_content_lifecycle ncl ON p.id::text = ncl.content_id::text AND ncl.content_type = 'post'
         WHERE ncl.current_phase IN ('evergreen_discovery', 'lookalike_expansion')
           AND p.category = ANY($1::text[])
           AND p.author_id != $2
         ORDER BY ncl.value_sentiment_score DESC
         LIMIT $3`,
        [activeCats, userId, injectionCount]
      );

      res.json({
        success: true,
        message: 'Serendipity content retrieved successfully',
        data: {
          userId,
          content: serendipitousContent.rows,
          count: serendipitousContent.rows.length,
          injectionPercentage: config.injection_percentage || 0.1,
          activeCategories: activeCats,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.getSerendipityContent:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get serendipity content',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/nexusgnn/graph/node
   */
  async createGraphNode(req, res) {
    try {
      const { entityType, entityId, metadata } = req.body;

      if (!entityType || !entityId) {
        return res.status(400).json({
          success: false,
          message: 'Entity type and entity ID are required'
        });
      }

      const node = await nexusgnnService.initializeGraphNode(
        entityType,
        entityId,
        metadata || {}
      );

      res.json({
        success: true,
        message: 'Graph node created/updated successfully',
        data: {
          node,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.createGraphNode:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create graph node',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/nexusgnn/graph/edge
   */
  async createGraphEdge(req, res) {
    try {
      const { sourceEntityId, targetEntityId, edgeType, edgeSubtype, weight } = req.body;

      if (!sourceEntityId || !targetEntityId || !edgeType) {
        return res.status(400).json({
          success: false,
          message: 'Source entity ID, target entity ID, and edge type are required'
        });
      }

      const edge = await nexusgnnService.createGraphEdge(
        sourceEntityId,
        targetEntityId,
        edgeType,
        edgeSubtype || 'interaction',
        weight || 1.0
      );

      res.json({
        success: true,
        message: 'Graph edge created successfully',
        data: {
          edge,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.createGraphEdge:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create graph edge',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/nexusgnn/score/:userId/:contentId
   */
  async getMatchScore(req, res) {
    try {
      const { userId, contentId } = req.params;
      const { contentType } = req.query;

      if (!userId || !contentId) {
        return res.status(400).json({
          success: false,
          message: 'User ID and content ID are required'
        });
      }

      const score = await nexusgnnService.calculateMatchScore(
        userId,
        contentId,
        contentType || 'post'
      );

      res.json({
        success: true,
        message: 'Match score calculated successfully',
        data: {
          score,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.getMatchScore:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate match score',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/nexusgnn/config/weights
   */
  async getAlgorithmWeights(req, res) {
    try {
      const weights = await nexusgnnService.getActiveAlgorithmWeights();
      const configRes = await pool.query(
        'SELECT * FROM nexusgnn_algorithm_config WHERE is_active = TRUE ORDER BY version DESC LIMIT 1'
      );

      res.json({
        success: true,
        data: {
          weights,
          thresholds: configRes.rows[0]?.thresholds || nexusgnnService.PHASE_THRESHOLDS,
          version: configRes.rows[0]?.version || 1
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to get algorithm weights' });
    }
  }

  /**
   * PUT /api/nexusgnn/config/weights
   */
  async updateAlgorithmWeights(req, res) {
    try {
      const { alpha, beta, gamma, delta, thresholds } = req.body;

      if (!req.user?.isAdmin && !req.user?.role?.includes('admin')) {
        // Allow in development or for admins
        if (process.env.NODE_ENV === 'production') {
          return res.status(403).json({
            success: false,
            message: 'Admin privileges required'
          });
        }
      }

      const weights = {
        alpha: parseFloat(alpha) || 0.35,
        beta: parseFloat(beta) || 0.25,
        gamma: parseFloat(gamma) || 0.25,
        delta: parseFloat(delta) || 0.15
      };

      const result = await pool.query(
        `INSERT INTO nexusgnn_algorithm_config (config_name, weights, thresholds, version, is_active, created_by)
         VALUES ($1, $2, $3, 1, TRUE, $4)
         ON CONFLICT (config_name)
         DO UPDATE SET
           weights = EXCLUDED.weights,
           thresholds = EXCLUDED.thresholds,
           version = nexusgnn_algorithm_config.version + 1,
           updated_at = NOW()
         RETURNING *`,
        ['NexusGNN_Active_Config', JSON.stringify(weights), JSON.stringify(thresholds || {}), req.user?.id || null]
      );

      res.json({
        success: true,
        message: 'Algorithm weights updated successfully',
        data: {
          config: result.rows[0],
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.updateAlgorithmWeights:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update algorithm weights',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new NexusGNNController();
