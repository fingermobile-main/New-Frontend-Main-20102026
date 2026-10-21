# NexusGNN Algorithm Implementation Guide

## Overview

NexusGNN is an advanced Graph Neural Network (GNN) based P2P matching algorithm that fuses Pinterest's high-intent, evergreen bipartite graph with Facebook's high-velocity social graph. This creates a **Discovery-Intent Loop** that maps user relationships and reactions to their aspirations and creation goals.

## Architecture

### Core Components

1. **H-BiSocial Graph (Heterogeneous Bipartite Social Graph)**
   - **Nodes**: Users (U), Intent Items/Pins (I), Collections/Boards (B), Community Hubs/Groups (H)
   - **Edges**: 
     - High-Friction Social Edges (shares, collaborative adds, long-form replies)
     - High-Intent Functional Edges (saves, clicks, checkouts)

2. **PinSage-MetaGNN Fusion Embeddings**
   - Multi-modal visual-semantic features
   - Metagraph structural paths integration
   - 256-dimensional embedding vectors

3. **Hybrid Scoring Formula**
   ```
   R(u,i) = α·I_bi(u,i) + β·[P_base(u,t) + S_vector] + γ·V_sent(i) + δ·Ω(d)
   ```

### Scoring Components

| Component | Description | Weight |
|-----------|-------------|--------|
| **I_bi(u,i)** | Bipartite Interaction Matrix - measures user-item distance based on collaborative co-curation | α = 0.35 |
| **P_base(u,t) + S_vector** | Exploration Preference Array - combines user preferences with serendipity injection via contextual multi-armed bandit | β = 0.25 |
| **V_sent(i)** | Value Sentiment Score - LLM-parsed comment sentiment × engagement velocity, dampens clickbait | γ = 0.25 |
| **Ω(d)** | Domain & Freshness Quality Metric - ensures high-authority sources get baseline boost | δ = 0.15 |

## Content Lifecycle

### Phase 1: High-Intent Seed Audience
- New content bypasses follower base
- Injected into targeted "Intent Cluster" of users seeking adjacent items
- **Transition Threshold**: ≥10 saves, ≥5 shares, ≥0.6 value sentiment

### Phase 2: Lookalike Social Node Expansion
- Maps onto Meta Social Graph
- Blasts to lookalike networks sharing structural metrics with initial savers
- **Transition Threshold**: ≥0.75 value sentiment, 48-hour stability period

### Phase 3: Evergreen Discovery Engine
- Content served via search queries and serendipity injections
- Maintains relevance for months/years
- **Archive Condition**: <0.3 evergreen score after 1000+ impressions

## API Endpoints

### Authentication
All endpoints require Bearer token authentication via `Authorization` header.

---

### 1. Find Matches
**Endpoint**: `POST /api/nexusgnn/match`

**Description**: Find personalized matches using NexusGNN algorithm

**Request Body**:
```json
{
  "contentType": "post",
  "limit": 20,
  "options": {
    "enableSerendipity": true
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Matches found successfully",
  "data": {
    "matches": [
      {
        "id": "content-uuid",
        "type": "post",
        "score": 0.85,
        "scoringDetails": {
          "I_bi": { "score": 0.7, "interactionCount": 5 },
          "P_base_plus_S": { "score": 0.8, "serendipityBoost": 0.15 },
          "V_sent": { "score": 0.9, "sentiment": 0.85 },
          "Omega_d": { "score": 0.75, "freshness": 0.8 }
        }
      }
    ],
    "count": 20,
    "algorithm": "NexusGNN",
    "timestamp": "2026-06-12T17:30:00Z"
  }
}
```

**Rate Limit**: 30 requests per minute

---

### 2. Get Recommendations
**Endpoint**: `GET /api/nexusgnn/recommendations/:userId`

**Query Parameters**:
- `contentType` (optional): Filter by content type
- `limit` (optional, default: 20): Number of recommendations

**Response**:
```json
{
  "success": true,
  "data": {
    "userId": "user-uuid",
    "recommendations": [...],
    "count": 20,
    "timestamp": "2026-06-12T17:30:00Z"
  }
}
```

**Rate Limit**: 20 requests per minute

---

### 3. Update Content Lifecycle
**Endpoint**: `POST /api/nexusgnn/content/:id/lifecycle`

**Request Body**:
```json
{
  "contentType": "post",
  "metrics": {
    "impressions": 500,
    "saves": 15,
    "shares": 8,
    "value_sentiment_score": 0.7,
    "negative_scroll_velocity": 0.1
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "lifecycle": {
      "content_id": "content-uuid",
      "current_phase": "lookalike_expansion",
      "phase_history": [...],
      "evergreen_score": 0.65
    }
  }
}
```

**Rate Limit**: 100 requests per minute

---

### 4. Graph Analytics Dashboard
**Endpoint**: `GET /api/nexusgnn/graph/analytics`

**Query Parameters**:
- `timeRange` (optional, default: "7 days"): Analytics time range

**Response**:
```json
{
  "success": true,
  "data": {
    "nodes": [
      { "node_type": "user", "count": 1500, "with_embeddings": 1200 }
    ],
    "edges": [
      { "edge_type": "high_intent_functional", "count": 5000, "avg_weight": 0.75 }
    ],
    "lifecycleDistribution": [
      { "current_phase": "seed_audience", "count": 300, "avg_sentiment": 0.6 }
    ],
    "performanceMetrics": [...]
  }
}
```

---

### 5. Update Embeddings
**Endpoint**: `POST /api/nexusgnn/embeddings/update`

**Request Body**:
```json
{
  "nodeIds": ["node-1", "node-2"],
  "batchSize": 100
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "status": "queued",
    "jobId": "emb_update_1718208600000",
    "estimatedCompletionTime": "5-10 minutes"
  }
}
```

---

### 6. Get Serendipity Content
**Endpoint**: `GET /api/nexusgnn/serendipity/:userId`

**Query Parameters**:
- `limit` (optional, default: 10): Number of serendipitous items

**Response**:
```json
{
  "success": true,
  "data": {
    "userId": "user-uuid",
    "content": [...],
    "injectionPercentage": 0.10,
    "activeCategories": ["technology", "design"]
  }
}
```

---

### 7. Create Graph Node
**Endpoint**: `POST /api/nexusgnn/graph/node`

**Request Body**:
```json
{
  "entityType": "user",
  "entityId": "user-uuid",
  "metadata": {
    "preferences": {...}
  }
}
```

---

### 8. Create Graph Edge
**Endpoint**: `POST /api/nexusgnn/graph/edge`

**Request Body**:
```json
{
  "sourceEntityId": "user-uuid",
  "targetEntityId": "content-uuid",
  "edgeType": "high_intent_functional",
  "edgeSubtype": "save",
  "weight": 0.9
}
```

---

### 9. Get Match Score
**Endpoint**: `GET /api/nexusgnn/score/:userId/:contentId`

**Query Parameters**:
- `contentType` (optional, default: "post")

**Response**:
```json
{
  "success": true,
  "data": {
    "score": {
      "finalScore": 0.85,
      "components": {...},
      "weights": { "alpha": 0.35, "beta": 0.25, "gamma": 0.25, "delta": 0.15 }
    }
  },
  "cached": false
}
```

**Cache TTL**: 1 hour

---

### 10. Update Algorithm Weights (Admin Only)
**Endpoint**: `PUT /api/nexusgnn/config/weights`

**Request Body**:
```json
{
  "alpha": 0.35,
  "beta": 0.25,
  "gamma": 0.25,
  "delta": 0.15,
  "thresholds": {
    "SEED_TO_EXPANSION": {
      "MIN_SAVES": 10,
      "MIN_SHARES": 5
    }
  }
}
```

## Database Schema

### Key Tables

1. **nexusgnn_graph_nodes**: Stores graph nodes (users, items, boards, groups)
2. **nexusgnn_graph_edges**: Stores relationships between nodes
3. **nexusgnn_embeddings**: PinSage-MetaGNN fusion embeddings
4. **nexusgnn_content_lifecycle**: Tracks content through lifecycle phases
5. **nexusgnn_serendipity_vectors**: User-specific exploration configurations
6. **nexusgnn_sentiment_scores**: LLM-parsed sentiment analysis
7. **nexusgnn_match_scores**: Cached scoring results
8. **nexusgnn_algorithm_config**: Algorithm weights and parameters
9. **nexusgnn_performance_analytics**: Performance metrics tracking

## Installation & Setup

### 1. Run Database Migrations

```bash
psql -U postgres -d fingermobile -f apps/backend/database/comprehensive_controller_schemas.sql
```

### 2. Install Dependencies

```bash
cd apps/backend
npm install
```

### 3. Configure Environment Variables

Add to `.env`:
```env
# NexusGNN Configuration
NEXUSGNN_ENABLE=true
NEXUSGNN_EMBEDDING_DIMENSION=256
NEXUSGNN_CACHE_TTL=3600
NEXUSGNN_SERENDIPITY_INJECTION=0.10
```

### 4. Start Backend Server

```bash
npm start
```

## Testing

### Unit Tests

```bash
npm run test:nexusgnn
# or
npm test -- __tests__/services/nexusgnn.test.js --forceExit
```

### Integration Tests

```bash
npm test -- tests/nexusgnn.integration.test.js
```

## Admin Management Dashboard

A full-featured management and operations dashboard is available in `apps/admin-dashboard` under the `/nexusgnn` route:

1. **Topology & Analytics**: Real-time H-BiSocial node and edge distribution charts, 256D embedding coverage metrics, and GNN latency telemetry.
2. **Content Lifecycle Kanban**: Visual 4-column kanban board (Seed Audience, Lookalike Expansion, Evergreen Discovery, Archived) with real-time transition metrics and on-demand batch evaluation.
3. **R(u,i) Hybrid Scoring Simulator**: Interactive sandbox to inspect candidate matches and detailed scoring component breakdowns ($\alpha \cdot I_{bi}, \beta \cdot [P_{base}+S], \gamma \cdot V_{sent}, \delta \cdot \Omega$).
4. **Algorithm Tuning & Weights**: Live weight balance sliders ($\alpha, \beta, \gamma, \delta$), threshold inputs, and one-click deployment.
5. **Embedding & Job Worker Management**: Trigger on-demand GNN 256D vector recalculation with live queue progress tracking.
6. **Graph Nodes & Edges Manager**: Interactive register forms for nodes and interaction edges.

## Performance Optimization

### Caching Strategy
- Match scores cached for 1 hour
- Recommendations cached for 30 minutes
- Graph analytics cached for 10 minutes

### Rate Limiting
- Find matches: 30 req/min
- Get recommendations: 20 req/min
- Update lifecycle: 100 req/min

### Batch Processing
- Embedding recalculation: Async job queue
- Lifecycle transitions: Batch updates every 5 minutes

## Monitoring & Analytics

Track these key metrics:
- **Match Accuracy**: % of matches resulting in user engagement
- **Engagement Rate**: Average interactions per recommended item
- **Serendipity Success**: % of users engaging with exploratory content
- **Lifecycle Transition Rate**: Speed of content progression through phases
- **User Retention**: Impact on long-term user engagement

## Troubleshooting

### Common Issues

1. **Low Match Scores**
   - Check if graph nodes are properly initialized
   - Verify edge creation for user interactions
   - Review algorithm weights configuration

2. **Slow Performance**
   - Enable caching middleware
   - Optimize database indexes
   - Consider Redis for distributed caching

3. **Serendipity Not Working**
   - Verify serendipity vector initialization
   - Check active categories configuration
   - Review bandit learning rate

## Future Enhancements

1. **Advanced Embeddings**: Integrate transformer-based visual/text models
2. **Real-time Updates**: WebSocket streaming for live match updates
3. **A/B Testing Framework**: Test different weight configurations
4. **Federated Learning**: Privacy-preserving model training
5. **Multi-modal LLM Integration**: Enhanced sentiment analysis

## Support

For issues or questions:
- Check logs: `logs/nexusgnn.log`
- Review analytics: `/api/nexusgnn/graph/analytics`
- Contact: backend-team@fingermobileprotocol.com

---

**Version**: 1.0.0  
**Last Updated**: June 12, 2026  
**Maintainer**: FingerMobile Protocol Team
