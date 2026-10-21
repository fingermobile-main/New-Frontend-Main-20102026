/**
 * NexusGNN Algorithm Constants
 * Configuration for Graph Neural Network P2P Matching
 * Date: June 12, 2026
 */

// Algorithm weights for R(u,i) formula
const NEXUSGNN_WEIGHTS = {
  // Bipartite Interaction Matrix weight
  ALPHA: 0.35,

  // Exploration Preference Array weight
  BETA: 0.25,

  // Value Sentiment Score weight
  GAMMA: 0.25,

  // Domain & Freshness Quality Metric weight
  DELTA: 0.15
};

// Content lifecycle phase thresholds
const LIFECYCLE_THRESHOLDS = {
  SEED_TO_EXPANSION: {
    MIN_SAVES: 10,
    MIN_SHARES: 5,
    MIN_VALUE_SENTIMENT: 0.6
  },
  EXPANSION_TO_EVERGREEN: {
    MIN_VALUE_SENTIMENT: 0.75,
    MIN_ENGAGEMENT_RATE: 0.15,
    STABILITY_PERIOD_HOURS: 48
  },
  EVERGREEN_TO_ARCHIVED: {
    MAX_EVERGREEN_SCORE: 0.3,
    MIN_IMPRESSIONS: 1000
  }
};

// Serendipity injection configuration
const SERENDIPITY_CONFIG = {
  DEFAULT_INJECTION_PERCENTAGE: 0.10, // 10% of feed
  EXPLORATION_CATEGORIES_LIMIT: 5,
  BANDIT_LEARNING_RATE: 0.1,
  DEFAULT_CATEGORIES: ['technology', 'design', 'lifestyle', 'education', 'entertainment']
};

// Graph node types
const NODE_TYPES = {
  USER: 'user',
  ITEM: 'item',
  BOARD: 'board',
  GROUP: 'group'
};

// Graph edge types
const EDGE_TYPES = {
  HIGH_FRICTION_SOCIAL: 'high_friction_social',
  HIGH_INTENT_FUNCTIONAL: 'high_intent_functional'
};

// Edge subtypes
const EDGE_SUBTYPES = {
  SOCIAL: ['share', 'collaborative_add', 'reply', 'mention'],
  FUNCTIONAL: ['save', 'click', 'checkout', 'view', 'like']
};

// Embedding configuration
const EMBEDDING_CONFIG = {
  VECTOR_DIMENSION: 256,
  VISUAL_FEATURE_DIMENSION: 128,
  SEMANTIC_FEATURE_DIMENSION: 128,
  EXPIRATION_HOURS: 24
};

// Match score thresholds
const MATCH_THRESHOLDS = {
  HIGH_CONFIDENCE: 0.8,
  MEDIUM_CONFIDENCE: 0.6,
  LOW_CONFIDENCE: 0.4,
  MINIMUM_MATCH: 0.2
};

// Performance monitoring
const ANALYTICS_METRICS = {
  MATCH_ACCURACY: 'match_accuracy',
  ENGAGEMENT_RATE: 'engagement_rate',
  SERENDIPITY_SUCCESS: 'serendipity_success',
  CONTENT_LIFECYCLE_TRANSITION: 'content_lifecycle_transition',
  USER_RETENTION: 'user_retention'
};

// Cache configuration
const CACHE_CONFIG = {
  MATCH_SCORE_TTL_SECONDS: 3600, // 1 hour
  RECOMMENDATIONS_TTL_SECONDS: 1800, // 30 minutes
  GRAPH_ANALYTICS_TTL_SECONDS: 600 // 10 minutes
};

// Rate limiting for API endpoints
const RATE_LIMITS = {
  FIND_MATCHES: {
    WINDOW_MS: 60000, // 1 minute
    MAX_REQUESTS: 30
  },
  GET_RECOMMENDATIONS: {
    WINDOW_MS: 60000,
    MAX_REQUESTS: 20
  },
  UPDATE_LIFECYCLE: {
    WINDOW_MS: 60000,
    MAX_REQUESTS: 100
  }
};

// Entity type to node type mapping
const ENTITY_TO_NODE_MAPPING = {
  'user': NODE_TYPES.USER,
  'product': NODE_TYPES.ITEM,
  'post': NODE_TYPES.ITEM,
  'pin': NODE_TYPES.ITEM,
  'collection': NODE_TYPES.BOARD,
  'board': NODE_TYPES.BOARD,
  'group': NODE_TYPES.GROUP,
  'community': NODE_TYPES.GROUP
};

// Default algorithm parameters
const DEFAULT_ALGORITHM_PARAMS = {
  maxCandidatesPerRequest: 100,
  minMatchScore: MATCH_THRESHOLDS.MINIMUM_MATCH,
  enableSerendipity: true,
  enableLifecycleTracking: true,
  embeddingRecalculationInterval: EMBEDDING_CONFIG.EXPIRATION_HOURS * 3600 * 1000
};

module.exports = {
  NEXUSGNN_WEIGHTS,
  LIFECYCLE_THRESHOLDS,
  SERENDIPITY_CONFIG,
  NODE_TYPES,
  EDGE_TYPES,
  EDGE_SUBTYPES,
  EMBEDDING_CONFIG,
  MATCH_THRESHOLDS,
  ANALYTICS_METRICS,
  CACHE_CONFIG,
  RATE_LIMITS,
  ENTITY_TO_NODE_MAPPING,
  DEFAULT_ALGORITHM_PARAMS
};
