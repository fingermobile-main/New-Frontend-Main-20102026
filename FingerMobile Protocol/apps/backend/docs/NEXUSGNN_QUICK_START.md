# NexusGNN Quick Start Guide

## 5-Minute Setup

### Prerequisites
- PostgreSQL database running
- Node.js 16+ installed
- Backend service operational

### Step 1: Deploy Database Schema

```bash
cd /Users/user/Documents/FingerMobile\ Protocol\ Communication/FingerMobile\ Protocol

# Run deployment script (staging)
./deploy-nexusgnn.sh staging

# Or for production
./deploy-nexusgnn.sh production
```

### Step 2: Verify Installation

```bash
# Check database tables
psql -U postgres -d fingermobile -c "\dt nexusgnn_*"

# Should show 9 tables:
# - nexusgnn_graph_nodes
# - nexusgnn_graph_edges
# - nexusgnn_embeddings
# - nexusgnn_content_lifecycle
# - nexusgnn_serendipity_vectors
# - nexusgnn_sentiment_scores
# - nexusgnn_match_scores
# - nexusgnn_algorithm_config
# - nexusgnn_performance_analytics
```

### Step 3: Test API Endpoints

```bash
# Get auth token first
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}' \
  | jq -r '.token')

# Test match finding
curl -X POST http://localhost:3000/api/nexusgnn/match \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"contentType":"post","limit":10}'

# Test graph analytics
curl http://localhost:3000/api/nexusgnn/graph/analytics \
  -H "Authorization: Bearer $TOKEN"
```

### Step 4: Initialize Graph Nodes

```javascript
// Example: Create graph nodes for users and content
const axios = require('axios');

const API_URL = 'http://localhost:3000/api/nexusgnn';
const token = process.env.token || "placeholder-token";

// Create user node
await axios.post(`${API_URL}/graph/node`, {
  entityType: 'user',
  entityId: 'user-uuid-here',
  metadata: { preferences: { technology: 0.8, design: 0.6 } }
}, {
  headers: { Authorization: `Bearer ${token}` }
});

// Create content node
await axios.post(`${API_URL}/graph/node`, {
  entityType: 'post',
  entityId: 'content-uuid-here',
  metadata: { category: 'technology', domain_authority: 0.9 }
}, {
  headers: { Authorization: `Bearer ${token}` }
});

// Create edge (user saved content)
await axios.post(`${API_URL}/graph/edge`, {
  sourceEntityId: 'user-uuid-here',
  targetEntityId: 'content-uuid-here',
  edgeType: 'high_intent_functional',
  edgeSubtype: 'save',
  weight: 0.9
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

### Step 5: Monitor Performance

```bash
# View real-time analytics
curl http://localhost:3000/api/nexusgnn/graph/analytics \
  -H "Authorization: Bearer $TOKEN" | jq .

# Check logs
tail -f apps/backend/logs/nexusgnn.log
```

## Common Use Cases

### 1. Get Personalized Recommendations

```javascript
const recommendations = await axios.get(
  `${API_URL}/recommendations/${userId}?contentType=post&limit=20`,
  { headers: { Authorization: `Bearer ${token}` } }
);

console.log(recommendations.data.data.recommendations);
```

### 2. Update Content Lifecycle

```javascript
// When content receives engagement
await axios.post(
  `${API_URL}/content/${contentId}/lifecycle`,
  {
    contentType: 'post',
    metrics: {
      impressions: 500,
      saves: 15,
      shares: 8,
      value_sentiment_score: 0.75
    }
  },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

### 3. Get Serendipitous Content

```javascript
const serendipity = await axios.get(
  `${API_URL}/serendipity/${userId}?limit=5`,
  { headers: { Authorization: `Bearer ${token}` } }
);

// Returns 10% of feed as exploratory content
console.log(serendipity.data.data.content);
```

### 4. Calculate Match Score

```javascript
const score = await axios.get(
  `${API_URL}/score/${userId}/${contentId}?contentType=post`,
  { headers: { Authorization: `Bearer ${token}` } }
);

console.log(`Match score: ${score.data.data.score.finalScore}`);
// Cached for 1 hour automatically
```

## Troubleshooting

### Issue: "Table does not exist"
```bash
# Re-run migrations
./deploy-nexusgnn.sh staging
```

### Issue: "Authentication required"
```bash
# Ensure you're sending valid auth token
curl -H "Authorization: Bearer YOUR_VALID_TOKEN" ...
```

### Issue: Low match scores
```sql
-- Check algorithm weights
SELECT * FROM nexusgnn_algorithm_config WHERE is_active = TRUE;

-- Verify graph nodes exist
SELECT COUNT(*) FROM nexusgnn_graph_nodes;

-- Check edges
SELECT COUNT(*) FROM nexusgnn_graph_edges;
```

### Issue: Slow performance
```bash
# Enable caching (already implemented in middleware)
# Check cache hit rate
curl http://localhost:3000/api/nexusgnn/score/user-id/content-id \
  -H "Authorization: Bearer $TOKEN"

# Second request should return: "cached": true
```

## Configuration Tuning

### Adjust Algorithm Weights

```bash
curl -X PUT http://localhost:3000/api/nexusgnn/config/weights \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "alpha": 0.40,
    "beta": 0.20,
    "gamma": 0.25,
    "delta": 0.15
  }'
```

### Modify Lifecycle Thresholds

Edit `apps/backend/constants/nexusgnn.js`:

```javascript
const LIFECYCLE_THRESHOLDS = {
  SEED_TO_EXPANSION: {
    MIN_SAVES: 8,  // Lowered from 10
    MIN_SHARES: 4,  // Lowered from 5
    MIN_VALUE_SENTIMENT: 0.55  // Lowered from 0.6
  }
};
```

Then restart backend service.

## Monitoring Dashboard

Key metrics to track:

1. **Match Quality**
   - Average match score distribution
   - User engagement with matches
   - Click-through rate

2. **Content Lifecycle**
   - Phase transition rates
   - Time in each phase
   - Evergreen content percentage

3. **Serendipity Effectiveness**
   - Exploration category engagement
   - Discovery success rate
   - User retention impact

4. **System Performance**
   - API response times
   - Cache hit rates
   - Database query performance

Access dashboard: `GET /api/nexusgnn/graph/analytics?timeRange=7days`

## Next Steps

1. **Read Full Documentation**: `apps/backend/docs/NEXUSGNN_IMPLEMENTATION_GUIDE.md`
2. **Review Test Suite**: `apps/backend/tests/nexusgnn.test.js`
3. **Monitor Analytics**: Set up Grafana/Prometheus dashboards
4. **A/B Testing**: Experiment with different weight configurations
5. **Scale Horizontally**: Add Redis for distributed caching

## Support

- **Documentation**: See full implementation guide
- **Tests**: Run `npm test` for validation
- **Logs**: Check `apps/backend/logs/nexusgnn.log`
- **Issues**: Contact backend-team@fingermobileprotocol.com

---

**Ready to deploy!** 🚀
