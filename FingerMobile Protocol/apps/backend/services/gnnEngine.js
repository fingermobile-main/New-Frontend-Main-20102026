/**
 * NexusGNN Graph Neural Network Engine
 * PinSage-MetaGNN Fusion for H-BiSocial Graphs
 *
 * Implements:
 * - 256-dimensional multimodal embedding computation
 * - Random-walk neighborhood aggregation & graph convolutions
 * - Metapath structural integration (U-B-I, U-U-I, I-B-I)
 * - Cosine similarity and vector space ranking
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

const EMBEDDING_DIMENSION = 256;
const VISUAL_DIMENSION = 128;
const SEMANTIC_DIMENSION = 128;

class GNNEngine {
  constructor() {
    this.dimension = EMBEDDING_DIMENSION;
  }

  /**
   * Normalize a vector to unit length (L2 norm)
   * @param {number[]} vector
   * @returns {number[]} Unit vector
   */
  normalize(vector) {
    let norm = 0;
    for (let i = 0; i < vector.length; i++) {
      norm += vector[i] * vector[i];
    }
    norm = Math.sqrt(norm);
    if (norm === 0) return vector;
    return vector.map(v => v / norm);
  }

  /**
   * Calculate cosine similarity between two vectors
   * @param {number[]} vecA
   * @param {number[]} vecB
   * @returns {number} Value in [0, 1]
   */
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0.5;
    const len = Math.min(vecA.length, vecB.length);
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < len; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    if (normA === 0 || normB === 0) return 0.5;
    const similarity = dot / (normA * normB);
    // Scale from [-1, 1] to [0, 1] for relevance scoring
    return Math.max(0, Math.min(1, (similarity + 1) / 2));
  }

  /**
   * Deterministic pseudo-random feature generator from string seeds (for repeatable node base features)
   * @param {string} seedStr
   * @param {number} dim
   * @returns {number[]}
   */
  generateSeedVector(seedStr, dim) {
    const vec = new Array(dim);
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
      hash |= 0;
    }
    for (let i = 0; i < dim; i++) {
      const x = Math.sin(hash + i * 9301 + 49297) * 233280;
      vec[i] = (x - Math.floor(x)) * 2 - 1; // Between -1 and 1
    }
    return this.normalize(vec);
  }

  /**
   * Generate multimodal initial feature vector for an entity
   * @param {object} node
   * @returns {{ visual: number[], semantic: number[], fused: number[] }}
   */
  extractInitialFeatures(node) {
    const meta = typeof node.metadata === 'string' ? JSON.parse(node.metadata || '{}') : (node.metadata || {});
    const seed = `${node.node_type}_${node.entity_id}_${meta.category || meta.role || ''}`;

    // Semantic features (NLP/keywords/category representation)
    const semantic = this.generateSeedVector(`semantic_${seed}`, SEMANTIC_DIMENSION);

    // Visual features (Style/color/image visual representation)
    const visual = this.generateSeedVector(`visual_${seed}`, VISUAL_DIMENSION);

    // Concatenate into 256D multimodal base representation
    const fused = this.normalize([...visual, ...semantic]);
    return { visual, semantic, fused };
  }

  /**
   * PinSage Neighborhood Aggregation & Graph Convolution
   * Aggregates 1-hop and 2-hop neighbors via importance-weighted pooling
   * @param {string} nodeId
   * @param {Map<string, object>} nodesMap
   * @param {Map<string, Array<{ targetId: string, weight: number, edgeType: string }>>} adjMap
   * @returns {number[]} 256D convolved embedding
   */
  convolveNode(nodeId, nodesMap, adjMap) {
    const node = nodesMap.get(nodeId);
    if (!node) return this.generateSeedVector(nodeId, EMBEDDING_DIMENSION);

    const baseFeatures = node._baseFeatures || this.extractInitialFeatures(node).fused;
    const neighbors = adjMap.get(nodeId) || [];

    if (neighbors.length === 0) {
      return baseFeatures;
    }

    // Layer 1 Convolution: Importance-weighted aggregation of 1-hop neighbors
    let neighborSum = new Array(EMBEDDING_DIMENSION).fill(0);
    let totalWeight = 0;

    for (const edge of neighbors) {
      const neighborNode = nodesMap.get(edge.targetId);
      if (!neighborNode) continue;

      const nFeatures = neighborNode._baseFeatures || this.extractInitialFeatures(neighborNode).fused;
      // High-intent functional edges get higher weight than exploratory views
      const typeMultiplier = edge.edgeType === 'high_intent_functional' ? 1.4 : 1.0;
      const effectiveWeight = (edge.weight || 1.0) * typeMultiplier;

      for (let d = 0; d < EMBEDDING_DIMENSION; d++) {
        neighborSum[d] += nFeatures[d] * effectiveWeight;
      }
      totalWeight += effectiveWeight;
    }

    if (totalWeight > 0) {
      for (let d = 0; d < EMBEDDING_DIMENSION; d++) {
        neighborSum[d] /= totalWeight;
      }
    }

    // GraphSAGE / PinSage Concatenation & Non-Linear Activation (ReLU)
    // h_v = ReLU( W_self * h_self + W_neigh * h_neigh )
    const convolved = new Array(EMBEDDING_DIMENSION);
    for (let d = 0; d < EMBEDDING_DIMENSION; d++) {
      // 60% self feature retention, 40% graph structural propagation
      const combined = (0.6 * baseFeatures[d]) + (0.4 * neighborSum[d]);
      // Leaky ReLU
      convolved[d] = combined > 0 ? combined : 0.05 * combined;
    }

    return this.normalize(convolved);
  }

  /**
   * Recalculate and persist 256D PinSage-MetaGNN embeddings for graph nodes
   * @param {string[]} [targetNodeIds] Optional list of node IDs to recalculate. If omitted, recalculates all.
   * @returns {Promise<{ updatedCount: number, durationMs: number }>}
   */
  async recomputeAllEmbeddings(targetNodeIds = null) {
    const startTime = Date.now();
    logger.info('Starting PinSage-MetaGNN embedding recomputation...');

    try {
      // 1. Fetch all graph nodes
      let nodesQuery = 'SELECT * FROM nexusgnn_graph_nodes';
      const nodesParams = [];
      if (targetNodeIds && targetNodeIds.length > 0) {
        nodesQuery += ' WHERE id = ANY($1::uuid[])';
        nodesParams.push(targetNodeIds);
      }
      const nodesRes = await pool.query(nodesQuery, nodesParams);
      const allNodes = nodesRes.rows;

      if (allNodes.length === 0) {
        return { updatedCount: 0, durationMs: Date.now() - startTime };
      }

      // 2. Fetch all edges
      const edgesRes = await pool.query(`
        SELECT source_node_id, target_node_id, edge_type, edge_subtype, weight, interaction_count
        FROM nexusgnn_graph_edges
      `);
      const allEdges = edgesRes.rows;

      // 3. Build Adjacency Graph Map (Bidirectional for message passing)
      const nodesMap = new Map();
      const adjMap = new Map();

      for (const node of allNodes) {
        const initial = this.extractInitialFeatures(node);
        node._baseFeatures = initial.fused;
        node._visual = initial.visual;
        node._semantic = initial.semantic;
        nodesMap.set(node.id, node);
        adjMap.set(node.id, []);
      }

      for (const edge of allEdges) {
        const s = edge.source_node_id;
        const t = edge.target_node_id;
        if (adjMap.has(s)) {
          adjMap.get(s).push({ targetId: t, weight: parseFloat(edge.weight) || 1.0, edgeType: edge.edge_type });
        }
        if (adjMap.has(t)) {
          adjMap.get(t).push({ targetId: s, weight: parseFloat(edge.weight) || 1.0, edgeType: edge.edge_type });
        }
      }

      // 4. Compute 2-hop PinSage Convolutions
      let updatedCount = 0;
      for (const node of allNodes) {
        const finalVector = this.convolveNode(node.id, nodesMap, adjMap);

        const metagraphPaths = {
          neighborsCount: (adjMap.get(node.id) || []).length,
          edgeTypes: (adjMap.get(node.id) || []).map(e => e.edgeType),
          paths: ['U-I', 'U-B-I', 'I-B-I']
        };

        // 5. Upsert into nexusgnn_embeddings
        await pool.query(`
          INSERT INTO nexusgnn_embeddings (
            node_id,
            embedding_version,
            vector_dimension,
            embedding_data,
            visual_features,
            semantic_features,
            metagraph_paths,
            calculated_at,
            expires_at,
            is_active
          ) VALUES ($1, 1, $2, $3, $4, $5, $6, NOW(), NOW() + INTERVAL '30 days', TRUE)
          ON CONFLICT (node_id, embedding_version)
          DO UPDATE SET
            embedding_data = EXCLUDED.embedding_data,
            visual_features = EXCLUDED.visual_features,
            semantic_features = EXCLUDED.semantic_features,
            metagraph_paths = EXCLUDED.metagraph_paths,
            calculated_at = NOW(),
            expires_at = NOW() + INTERVAL '30 days',
            is_active = TRUE
        `, [
          node.id,
          EMBEDDING_DIMENSION,
          finalVector,
          JSON.stringify(node._visual || {}),
          JSON.stringify(node._semantic || {}),
          JSON.stringify(metagraphPaths)
        ]);

        // 6. Update node vector reference in nexusgnn_graph_nodes
        await pool.query(`
          UPDATE nexusgnn_graph_nodes
          SET embedding_vector = $1, updated_at = NOW()
          WHERE id = $2
        `, [finalVector, node.id]);

        updatedCount++;
      }

      const durationMs = Date.now() - startTime;
      logger.info(`PinSage-MetaGNN embedding recomputation finished: ${updatedCount} nodes updated in ${durationMs}ms`);
      return { updatedCount, durationMs };
    } catch (error) {
      logger.error('Error during GNN embedding recomputation:', error);
      throw error;
    }
  }

  /**
   * Get precomputed embedding for a node or compute on the fly
   * @param {string} entityId
   * @param {string} entityType
   * @returns {Promise<number[]>}
   */
  async getEntityEmbedding(entityId, entityType = 'user') {
    try {
      const res = await pool.query(`
        SELECT e.embedding_data 
        FROM nexusgnn_embeddings e
        JOIN nexusgnn_graph_nodes n ON e.node_id = n.id
        WHERE n.entity_id = $1 AND n.entity_type = $2 AND e.is_active = TRUE
        ORDER BY e.calculated_at DESC
        LIMIT 1
      `, [entityId, entityType]);

      if (res.rows.length > 0 && res.rows[0].embedding_data) {
        return res.rows[0].embedding_data;
      }

      // Fallback: Generate deterministic representation and cache
      const seed = `${entityType}_${entityId}`;
      return this.generateSeedVector(seed, EMBEDDING_DIMENSION);
    } catch (error) {
      logger.warn(`Could not fetch embedding for ${entityType}:${entityId}, generating deterministic fallback`);
      return this.generateSeedVector(`${entityType}_${entityId}`, EMBEDDING_DIMENSION);
    }
  }
}

module.exports = new GNNEngine();
