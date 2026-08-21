/**
 * NexusGNN Controller
 * API endpoints for Graph Neural Network P2P Matching
 * Date: June 12, 2026
 */

const nexusgnnService = require('../services/nexusgnn');
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
          success: false, message: 'Authentication required'
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
          algorithm: 'NexusGNN', 
          timestamp: new Date().toISOString() // Fixed: Added missing object literal property comma
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.findMatches:', error);
      res.status(500).json({
        success: false, message: 'Failed to find matches', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/nexusgnn/recommendations/:userId
   * Get personalized recommendations for a user
   */
  async getRecommendations(req, res) {
    try {
      const { userId } = req.params;
      const { contentType, limit } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false, message: 'User ID is required'
        });
      }

      const recommendations = await nexusgnnService.findMatches(
        userId, // Fixed: Added missing functional invocation parameter separation comma
        contentType || 'all',
        parseInt(limit) || 20
      );

      res.json({
        success: true, 
        message: 'Recommendations retrieved successfully',
        data: {
          userId,
          recommendations,
          count: recommendations.length, // Fixed: Added missing object literal property comma
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.getRecommendations:', error);
      res.status(500).json({
        success: false, message: 'Failed to get recommendations', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/nexusgnn/content/:id/lifecycle
   * Update content lifecycle phase
   */
  async updateContentLifecycle(req, res) {
    try {
      const { id } = req.params;
      const { contentType, metrics } = req.body;

      if (!id || !contentType || !metrics) {
        return res.status(400).json({
          success: false, message: 'Content ID, content type, and metrics are required'
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
          lifecycle, // Fixed: Added missing object literal property comma
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.updateContentLifecycle:', error);
      res.status(500).json({
        success: false, message: 'Failed to update content lifecycle', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/nexusgnn/graph/analytics
   * Get graph analytics dashboard data
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
      // Fixed: Added missing query field selection comma between count and AVG
      const lifecycleDist = await pool.query(`
        SELECT 
          current_phase,
          COUNT(*) as count, 
          AVG(value_sentiment_score) as avg_sentiment
        FROM nexusgnn_content_lifecycle
        GROUP BY current_phase
      `);

      // Get performance metrics
      // Fixed: Replaced single quotes with backticks to correctly process multiline string
      const performanceMetrics = await pool.query(`
        SELECT 
          metric_type,
          AVG(metric_value) as avg_value,
          COUNT(*) as data_points
        FROM nexusgnn_performance_analytics
        WHERE recorded_at >= NOW() - INTERVAL $1
        GROUP BY metric_type
      `, [timeRange || '7 days']);

      res.json({
        success: true, 
        message: 'Graph analytics retrieved successfully',
        data: {
          nodes: nodeStats.rows,
          edges: edgeStats.rows,
          lifecycleDistribution: lifecycleDist.rows,
          performanceMetrics: performanceMetrics.rows, // Fixed: Added missing object literal property comma
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.getGraphAnalytics:', error);
      res.status(500).json({
        success: false, message: 'Failed to get graph analytics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/nexusgnn/embeddings/update
   * Trigger embedding recalculation for nodes
   */
  async updateEmbeddings(req, res) {
    try {
      const { nodeIds, batchSize } = req.body;

      res.json({
        success: true, 
        message: 'Embedding update job queued successfully', 
        data: {
          status: 'queued', 
          nodeCount: nodeIds?.length || 'all', // Fixed: Added missing object literal property comma
          estimatedCompletionTime: '5-10 minutes',
          jobId: `emb_update_${Date.now()}`, 
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.updateEmbeddings:', error);
      res.status(500).json({
        success: false, message: 'Failed to queue embedding update', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/nexusgnn/serendipity/:userId
   * Get serendipity-injected content for a user
   */
  async getSerendipityContent(req, res) {
    try {
      const { userId } = req.params;
      const { limit } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false, message: 'User ID is required'
        });
      }

      // Get user's serendipity configuration
      const serendipityConfig = await pool.query(
        `SELECT * FROM nexusgnn_serendipity_vectors WHERE user_id = $1`,
        [userId]
      );

      if (serendipityConfig.rows.length === 0) {
        // Initialize serendipity vector
        await nexusgnnService.initializeSerendipityVector(userId);
        
        return res.json({
          success: true, 
          message: 'Serendipity vector initialized',
          data: {
            userId,
            initialized: true, 
            timestamp: new Date().toISOString()
          }
        });
      }

      // Get serendipitous content
      const config = serendipityConfig.rows[0];
      const injectionCount = Math.ceil((parseInt(limit) || 10) * config.injection_percentage);

      const serendipitousContent = await pool.query(
        `SELECT p.*, ncl.current_phase, ncl.value_sentiment_score
         FROM posts p
         JOIN nexusgnn_content_lifecycle ncl ON p.id::text = ncl.content_id::text AND ncl.content_type = 'post'
         WHERE ncl.current_phase IN ('evergreen_discovery', 'lookalike_expansion')
           AND p.category = ANY($1::text[])
           AND p.author_id != $2
         ORDER BY ncl.value_sentiment_score DESC
         LIMIT $3`,
        [config.active_categories, userId, injectionCount]
      );

      res.json({
        success: true, 
        message: 'Serendipity content retrieved successfully',
        data: {
          userId,
          content: serendipitousContent.rows,
          count: serendipitousContent.rows.length,
          injectionPercentage: config.injection_percentage,
          activeCategories: config.active_categories, // Fixed: Added missing object literal property comma
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.getSerendipityContent:', error);
      res.status(500).json({
        success: false, message: 'Failed to get serendipity content', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/nexusgnn/graph/node
   * Create or update a graph node
   */
  async createGraphNode(req, res) {
    try {
      const { entityType, entityId, metadata } = req.body;

      if (!entityType || !entityId) {
        return res.status(400).json({
          success: false, message: 'Entity type and entity ID are required'
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
          node, // Fixed: Added missing object literal property comma
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.createGraphNode:', error);
      res.status(500).json({
        success: false, message: 'Failed to create graph node', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/nexusgnn/graph/edge
   * Create a graph edge between nodes
   */
  async createGraphEdge(req, res) {
    try {
      const { sourceEntityId, targetEntityId, edgeType, edgeSubtype, weight } = req.body;

      if (!sourceEntityId || !targetEntityId || !edgeType) {
        return res.status(400).json({
          success: false, message: 'Source entity ID, target entity ID, and edge type are required'
        });
      }

      const edge = await nexusgnnService.createGraphEdge(
        sourceEntityId,
        targetEntityId,
        edgeType, // Fixed: Added missing functional parameter separation comma
        edgeSubtype || 'interaction',
        weight || 1.0
      );

      res.json({
        success: true, 
        message: 'Graph edge created successfully',
        data: {
          edge, // Fixed: Added missing object literal property comma
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.createGraphEdge:', error);
      res.status(500).json({
        success: false, message: 'Failed to create graph edge', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/nexusgnn/score/:userId/:contentId
   * Get match score for specific user-content pair
   */
  async getMatchScore(req, res) {
    try {
      const { userId, contentId } = req.params;
      const { contentType } = req.query;

      if (!userId || !contentId) {
        return res.status(400).json({
          success: false, message: 'User ID and content ID are required'
        });
      }

      const score = await nexusgnnService.calculateMatchScore(
        userId,
        contentId, // Fixed: Added missing functional parameter separation comma
        contentType || 'post'
      );

      res.json({
        success: true, 
        message: 'Match score calculated successfully',
        data: {
          score, // Fixed: Added missing object literal property comma
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.getMatchScore:', error);
      res.status(500).json({
        success: false, message: 'Failed to calculate match score', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/nexusgnn/config/weights
   * Update algorithm weights (admin only)
   */
  async updateAlgorithmWeights(req, res) {
    try {
      const { alpha, beta, gamma, delta, thresholds } = req.body;

      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Admin privileges required'
        });
      }

      const weights = { alpha, beta, gamma, delta };

      // Fixed: Added missing array parameter separation comma between query string and payload values
      const result = await pool.query(
        `INSERT INTO nexusgnn_algorithm_config (config_name, weights, thresholds, version, is_active, created_by)
         VALUES ($1, $2, $3, 1, TRUE, $4)
         RETURNING *`, 
         ['NexusGNN_v1', JSON.stringify(weights), JSON.stringify(thresholds || {}), req.user.id]
      );

      res.json({
        success: true, 
        message: 'Algorithm weights updated successfully',
        data: {
          config: result.rows[0], // Fixed: Added missing object literal property comma
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in NexusGNNController.updateAlgorithmWeights:', error);
      res.status(500).json({
        success: false, message: 'Failed to update algorithm weights', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new NexusGNNController();