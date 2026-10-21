/**
 * Database Initialization and Seed Script for NexusGNN
 * Creates the 9 required NexusGNN tables and seeds initial graph nodes, edges,
 * embeddings, content lifecycle stages, and algorithm weights.
 */

const { pool } = require('../db');
const logger = require('../utils/logger');
const gnnEngine = require('../services/gnnEngine');

async function initNexusGNN() {
  console.log('--- Initializing NexusGNN Database Tables & Seed Data ---');
  try {
    // 1. Create Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS nexusgnn_graph_nodes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          node_type VARCHAR(50) NOT NULL CHECK (node_type IN ('user', 'item', 'board', 'group')),
          entity_id UUID NOT NULL,
          entity_type VARCHAR(100) NOT NULL,
          metadata JSONB DEFAULT '{}',
          embedding_vector FLOAT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(node_type, entity_id)
      );

      CREATE INDEX IF NOT EXISTS idx_nexusgnn_nodes_type ON nexusgnn_graph_nodes(node_type);
      CREATE INDEX IF NOT EXISTS idx_nexusgnn_nodes_entity ON nexusgnn_graph_nodes(entity_id, entity_type);

      CREATE TABLE IF NOT EXISTS nexusgnn_graph_edges (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          source_node_id UUID NOT NULL REFERENCES nexusgnn_graph_nodes(id) ON DELETE CASCADE,
          target_node_id UUID NOT NULL REFERENCES nexusgnn_graph_nodes(id) ON DELETE CASCADE,
          edge_type VARCHAR(50) NOT NULL CHECK (edge_type IN (
              'high_friction_social',
              'high_intent_functional'
          )),
          edge_subtype VARCHAR(100),
          weight DECIMAL(5,4) DEFAULT 1.0,
          interaction_count INTEGER DEFAULT 1,
          last_interaction_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(source_node_id, target_node_id, edge_type, edge_subtype)
      );

      CREATE INDEX IF NOT EXISTS idx_nexusgnn_edges_source ON nexusgnn_graph_edges(source_node_id);
      CREATE INDEX IF NOT EXISTS idx_nexusgnn_edges_target ON nexusgnn_graph_edges(target_node_id);

      CREATE TABLE IF NOT EXISTS nexusgnn_embeddings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          node_id UUID NOT NULL REFERENCES nexusgnn_graph_nodes(id) ON DELETE CASCADE,
          embedding_version INTEGER DEFAULT 1,
          vector_dimension INTEGER NOT NULL,
          embedding_data FLOAT[] NOT NULL,
          visual_features JSONB,
          semantic_features JSONB,
          metagraph_paths JSONB,
          calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT TRUE,
          UNIQUE(node_id, embedding_version)
      );

      CREATE INDEX IF NOT EXISTS idx_nexusgnn_embeddings_node ON nexusgnn_embeddings(node_id);

      CREATE TABLE IF NOT EXISTS nexusgnn_content_lifecycle (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          content_id UUID NOT NULL,
          content_type VARCHAR(100) NOT NULL,
          current_phase VARCHAR(50) NOT NULL CHECK (current_phase IN (
              'seed_audience',
              'lookalike_expansion',
              'evergreen_discovery',
              'archived'
          )),
          phase_history JSONB DEFAULT '[]',
          seed_audience_metrics JSONB DEFAULT '{}',
          expansion_metrics JSONB DEFAULT '{}',
          evergreen_score DECIMAL(5,4) DEFAULT 0.0,
          entered_current_phase_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          total_impressions INTEGER DEFAULT 0,
          total_saves INTEGER DEFAULT 0,
          total_shares INTEGER DEFAULT 0,
          value_sentiment_score DECIMAL(5,4) DEFAULT 0.0,
          negative_scroll_velocity DECIMAL(5,4) DEFAULT 0.0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(content_id, content_type)
      );

      CREATE INDEX IF NOT EXISTS idx_nexusgnn_lifecycle_phase ON nexusgnn_content_lifecycle(current_phase);

      CREATE TABLE IF NOT EXISTS nexusgnn_serendipity_vectors (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          vector_data JSONB NOT NULL,
          injection_percentage DECIMAL(5,4) DEFAULT 0.10,
          active_categories JSONB DEFAULT '[]',
          contextual_bandit_state JSONB DEFAULT '{}',
          last_injection_at TIMESTAMP WITH TIME ZONE,
          total_injections INTEGER DEFAULT 0,
          successful_discoveries INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id)
      );

      CREATE TABLE IF NOT EXISTS nexusgnn_sentiment_scores (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          content_id UUID NOT NULL,
          content_type VARCHAR(100) NOT NULL,
          overall_sentiment DECIMAL(5,4),
          sentiment_breakdown JSONB,
          llm_analysis JSONB,
          comment_count INTEGER DEFAULT 0,
          long_form_insights INTEGER DEFAULT 0,
          social_friction_score DECIMAL(5,4) DEFAULT 0.0,
          calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP WITH TIME ZONE
      );

      CREATE TABLE IF NOT EXISTS nexusgnn_match_scores (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          content_id UUID NOT NULL,
          content_type VARCHAR(100) NOT NULL,
          final_score DECIMAL(10,6) NOT NULL,
          component_scores JSONB NOT NULL,
          scoring_weights JSONB NOT NULL,
          rank_position INTEGER,
          calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 hour'),
          UNIQUE(user_id, content_id, content_type)
      );

      CREATE TABLE IF NOT EXISTS nexusgnn_algorithm_config (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          config_name VARCHAR(100) NOT NULL UNIQUE,
          weights JSONB NOT NULL,
          thresholds JSONB,
          parameters JSONB,
          version INTEGER DEFAULT 1,
          is_active BOOLEAN DEFAULT TRUE,
          created_by UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS nexusgnn_performance_analytics (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          metric_type VARCHAR(100) NOT NULL,
          metric_value DECIMAL(10,6) NOT NULL,
          metadata JSONB DEFAULT '{}',
          recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ NexusGNN tables created or verified.');

    // 2. Seed Default Algorithm Weights
    await pool.query(`
      INSERT INTO nexusgnn_algorithm_config (
        config_name, weights, thresholds, version, is_active
      ) VALUES (
        'NexusGNN_Active_Config',
        '{"alpha": 0.35, "beta": 0.25, "gamma": 0.25, "delta": 0.15}',
        '{"SEED_TO_EXPANSION": {"min_saves": 10, "min_shares": 5, "min_value_sentiment": 0.6}, "EXPANSION_TO_EVERGREEN": {"min_value_sentiment": 0.75, "min_engagement_rate": 0.15, "stability_period_hours": 48}}',
        1,
        TRUE
      ) ON CONFLICT (config_name) DO UPDATE SET is_active = TRUE;
    `);

    // 3. Seed Performance Metrics
    await pool.query(`
      INSERT INTO nexusgnn_performance_analytics (metric_type, metric_value, metadata)
      VALUES 
        ('match_accuracy', 0.885, '{"period": "7d"}'),
        ('engagement_rate', 0.234, '{"period": "7d"}'),
        ('serendipity_success', 0.182, '{"period": "7d"}'),
        ('embedding_latency_ms', 14.2, '{"period": "7d"}')
    `);

    console.log('✅ NexusGNN default config and metrics seeded.');

    // 4. Calculate initial embeddings for any existing nodes
    await gnnEngine.recomputeAllEmbeddings();
    console.log('✅ Initial PinSage-MetaGNN embeddings generated.');

  } catch (error) {
    console.error('NexusGNN init error:', error);
  } finally {
    console.log('--- NexusGNN Initialization Complete ---');
  }
}

if (require.main === module) {
  initNexusGNN().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = initNexusGNN;
