# Fingershorts ML Video Feed - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites

- Node.js 16+ installed
- PostgreSQL database running
- Backend server configured

### Step 1: Apply Database Schema

```bash
cd apps/backend
node scripts/migrate_fingershorts_ml.js
```

Expected output:
```
🚀 Starting Fingershorts ML Schema Migration...
✅ Transaction started
⚙️  Applying schema changes...
✅ Schema applied successfully
🎉 Migration completed successfully!
```

### Step 2: Install Dependencies (if needed)

```bash
npm install pg axios
```

### Step 3: Build TypeScript

```bash
npm run build
```

### Step 4: Start Backend Server

```bash
npm run dev
```

### Step 5: Test the Implementation

#### Option A: Automated Tests

```bash
# Set environment variables
export TEST_AUTH_TOKEN = process.env.TOKEN || "placeholder-TOKEN"
export TEST_USER_ID="user-uuid"
export TEST_VIDEO_ID="video-uuid"

# Run tests
node scripts/test_fingershorts_ml.js
```

#### Option B: Manual Testing with cURL

```bash
# Get personalized feed (ML-based)
curl -X GET "http://localhost:3000/api/fingershorts/for-you?limit=10&use_ml=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get trending videos
curl -X GET "http://localhost:3000/api/fingershorts/trending?limit=10&hours=24"

# Record video view (triggers ML tracking)
curl -X POST "http://localhost:3000/api/fingershorts/videos/VIDEO_ID/view" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"watch_duration": 15, "completion_rate": 0.5}'

# Like a video (triggers ML tracking)
curl -X POST "http://localhost:3000/api/fingershorts/videos/VIDEO_ID/like" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Check algorithm metrics (admin)
curl -X GET "http://localhost:3000/api/fingershorts/metrics/algorithm?timeframe=24 hours" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 📊 Monitoring ML Performance

### View Algorithm Metrics

```bash
curl http://localhost:3000/api/fingershorts/metrics/algorithm?timeframe=7 days \
  -H "Authorization: Bearer TOKEN"
```

Response:
```json
{
  "success": true,
  "data": {
    "total_recommendations": 15420,
    "engagement_rate": 0.23,
    "completion_rate": 0.67,
    "skip_rate": 0.15
  }
}
```

### Database Queries for Insights

```sql
-- Top performing videos by engagement
SELECT v.title, vpm.engagement_score, vpm.total_views
FROM video_performance_metrics vpm
JOIN fingershorts_videos v ON vpm.video_id = v.id
ORDER BY vpm.engagement_score DESC
LIMIT 10;

-- User preference analysis
SELECT user_id, preferred_categories, last_updated
FROM user_preference_cache
WHERE needs_refresh = false
ORDER BY last_updated DESC
LIMIT 5;

-- A/B test distribution
SELECT ab_test_variantant, COUNT(*) as user_count
FROM user_ab_tests
GROUP BY ab_test_variantant;
```

## 🔧 Configuration

### Environment Variables

Add to `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/fingermobile

# Optional: ML Algorithm Settings
ML_COLLABORATIVE_WEIGHT=0.35
ML_CONTENT_WEIGHT=0.30
ML_ENGAGEMENT_WEIGHT=0.25
ML_FRESHNESS_WEIGHT=0.10
```

### Algorithm Weight Tuning

Edit `services/MLRecommendationService.ts`:

```typescript
private readonly COLLABORATIVE_WEIGHT = 0.35;  // Adjust based on performance
private readonly CONTENT_WEIGHT = 0.30;
private readonly ENGAGEMENT_WEIGHT = 0.25;
private readonly FRESHNESS_WEIGHT = 0.10;
```

Rebuild after changes:
```bash
npm run build
npm run dev
```

## 🧪 Testing Different Scenarios

### Scenario 1: Cold Start (New User)

```bash
# New user should get trending content
curl "http://localhost:3000/api/fingershorts/for-you?limit=10" \
  -H "Authorization: Bearer NEW_USER_TOKEN"
```

Expected: Returns trending videos with `algorithm: "trending_fallback"`

### Scenario 2: Personalized Feed

After user interacts with 10+ videos:

```bash
# Should return ML-personalized content
curl "http://localhost:3000/api/fingershorts/for-you?limit=10&use_ml=true" \
  -H "Authorization: Bearer ACTIVE_USER_TOKEN"
```

Expected: Returns personalized videos with `algorithm: "ml_v1"` (or other variant)

### Scenario 3: Following Feed

```bash
curl "http://localhost:3000/api/fingershorts/following?limit=10" \
  -H "Authorization: Bearer USER_TOKEN"
```

Expected: Videos from followed creators, ranked by engagement score

## 🐛 Troubleshooting

### Issue: "Table does not exist"

**Solution:**
```bash
# Re-run migration
node scripts/migrate_fingershorts_ml.js

# Verify tables
psql $DATABASE_URL -c "\dt user_video_interactions"
```

### Issue: "ML service not found"

**Solution:**
```bash
# Rebuild TypeScript
npm run build

# Check compiled file exists
ls dist/services/MLRecommendationService.js
```

### Issue: Empty feed

**Causes:**
1. No published videos in database
2. User has no interaction history (cold start)

**Solution:**
```sql
-- Check video count
SELECT COUNT(*) FROM fingershorts_videos WHERE is_published = true;

-- For new users, feed falls back to trending automatically
```

### Issue: Slow recommendations

**Solution:**
```sql
-- Analyze tables for query optimization
ANALYZE user_video_interactions;
ANALYZE video_performance_metrics;
ANALYZE user_preference_cache;

-- Check indexes
SELECT indexname, tablename FROM pg_indexes 
WHERE tablename LIKE '%video%' OR tablename LIKE '%user%';
```

## 📈 Performance Optimization Tips

### 1. Enable pg_cron for Automatic Updates

```sql
-- Install pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule hourly trending score calculation
SELECT cron.schedule(
  'calculate-trending-scores',
  '0 * * * *',
  'SELECT calculate_trending_scores()'
);
```

### 2. Cache User Preferences

User preferences are automatically cached. To force refresh:

```sql
UPDATE user_preference_cache SET needs_refresh = true WHERE user_id = 'USER_UUID';
```

### 3. Monitor Query Performance

```sql
-- Find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE query LIKE '%fingershorts%'
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## 🎯 Next Steps

### Immediate Actions

1. ✅ Apply database schema
2. ✅ Run automated tests
3. ✅ Test API endpoints manually
4. ✅ Monitor first 100 recommendations

### Week 1

- [ ] Collect baseline metrics
- [ ] Monitor A/B test distribution
- [ ] Gather user feedback
- [ ] Adjust algorithm weights if needed

### Month 1

- [ ] Analyze engagement trends
- [ ] Compare A/B test variants
- [ ] Optimize weights based on data
- [ ] Plan Phase 2 enhancements

## 📚 Additional Resources

- **Full Documentation**: `docs/FINGERSHORTS_ML_IMPLEMENTATION.md`
- **Database Schema**: `database/fingershorts_ml_schema.sql`
- **ML Service**: `services/MLRecommendationService.ts`
- **Controller**: `controllers/FingershortsController.ts`

## 🆘 Support

For issues or questions:

1. Check logs: `logs/combined.log`
2. Review documentation
3. Run diagnostic script: `node scripts/test_fingershorts_ml.js`
4. Check database health: `psql $DATABASE_URL -c "SELECT count(*) FROM fingershorts_videos;"`

---

**Ready to go!** 🎉 Your ML-powered video feed is now active.
