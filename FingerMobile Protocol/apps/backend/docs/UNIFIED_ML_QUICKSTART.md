# Unified ML Algorithm - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide walks you through deploying and testing the ML-optimized recommendation system for Discover, Mii, and Canary feeds.

---

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ PostgreSQL 14+ running
- ✅ Backend dependencies installed (`npm install`)
- ✅ Database connection configured (`.env` file)

---

## Step 1: Run Database Migration (1 min)

```bash
cd apps/backend
node scripts/migrate_unified_ml.js
```

**Expected Output:**
```
🚀 Starting Unified ML Schema Migration...
✅ Migration completed successfully!

📊 Created tables:
  - ml_interactions
  - ml_user_profiles
  ...
✨ Ready to use ML-optimized recommendations!
```

---

## Step 2: Build & Start Server (2 min)

```bash
npm run build
npm run dev
```

Server should start on `http://localhost:3001`

---

## Step 3: Test ML Endpoints (2 min)

### Test Discover Feed

```bash
curl -X GET "http://localhost:3001/api/discover/personalized?use_ml=true&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "...",
      "final_score": 0.87,
      "strategy": "collaborative"
    }
  ],
  "algorithm": "ml_hybrid_recommendation",
  "metadata": {
    "strategies_used": ["collaborative_filtering", "content_based", ...]
  }
}
```

### Test Mii Recommendations

```bash
curl -X GET "http://localhost:3001/api/mii/recommendations?use_ml=true&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Canary Trending

```bash
curl -X GET "http://localhost:3001/api/canary/trending?use_ml=true&limit=5&timeframe=24h"
```

---

## Step 4: Track Interactions

Simulate user engagement:

```bash
curl -X POST "http://localhost:3001/api/discover/track-interaction" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_id": "ITEM_UUID_HERE",
    "interaction_type": "like",
    "metadata": { "feed_type": "discover" }
  }'
```

**Supported Interaction Types:**
- `impression` - Item shown
- `view` - Item clicked
- `like` - User liked
- `share` - User shared
- `comment` - User commented
- `skip` - User skipped

---

## Step 5: Monitor Performance

Check algorithm metrics:

```bash
curl "http://localhost:3001/api/discover/metrics/algorithm?timeframe=24h"
```

**Key Metrics:**
- `ctr` - Click-through rate (target: >15%)
- `like_rate` - Like percentage (target: >8%)
- `share_rate` - Share percentage (target: >3%)

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Database migration ran without errors
- [ ] Server starts successfully
- [ ] `/api/discover/personalized` returns ML recommendations
- [ ] `/api/mii/recommendations` returns personalized avatars
- [ ] `/api/canary/trending` returns viral predictions
- [ ] Interaction tracking works (check `ml_interactions` table)
- [ ] Metrics endpoint returns valid data
- [ ] No errors in server logs

---

## 🔧 Configuration Tips

### Enable/Disable ML

Add `use_ml=false` to fallback to basic algorithms:
```
GET /api/discover/personalized?use_ml=false
```

### Adjust Recommendation Limits

Control result count:
```
GET /api/discover/personalized?limit=50
```

### Filter by Category

Narrow recommendations:
```
GET /api/discover/personalized?category=technology
GET /api/mii/recommendations?style_category=anime
GET /api/canary/trending?category=music
```

### Time Window for Trending

Adjust trending timeframe:
```
GET /api/canary/trending?timeframe=6h    # Last 6 hours
GET /api/canary/trending?timeframe=7d    # Last 7 days
```

---

## 🐛 Common Issues

### Issue: "Table ml_interactions does not exist"

**Solution:** Run migration script again
```bash
node scripts/migrate_unified_ml.js
```

### Issue: "Cannot read property 'getDiscoverRecommendations' of undefined"

**Solution:** Ensure UnifiedMLService is properly imported
```typescript
import unifiedMLService from '../services/UnifiedMLService';
```

### Issue: Empty recommendations returned

**Solution:** 
- Verify user has interaction history
- Check database has content items
- Review SQL query logs for errors

### Issue: Slow response times (>2s)

**Solution:**
- Add database indexes (already included in schema)
- Enable query caching
- Reduce candidate limit in service

---

## 📊 Next Steps

After successful deployment:

1. **Monitor Metrics Daily**
   ```bash
   curl http://localhost:3001/api/discover/metrics/algorithm?timeframe=24h
   ```

2. **Gather User Feedback**
   - Survey users on recommendation quality
   - Track engagement rate changes
   - Monitor retention metrics

3. **A/B Test Improvements**
   - Create new algorithm variants
   - Assign users to test groups
   - Compare performance

4. **Tune Algorithm Weights**
   - Adjust based on metrics
   - Update `ml_algorithm_config` table
   - Document changes

---

## 📚 Additional Resources

- **Full Documentation**: [UNIFIED_ML_IMPLEMENTATION.md](./UNIFIED_ML_IMPLEMENTATION.md)
- **API Reference**: See controller files for endpoint details
- **Database Schema**: [unified_ml_schema.sql](../database/unified_ml_schema.sql)
- **Service Code**: [UnifiedMLService.ts](../services/UnifiedMLService.ts)

---

## 🆘 Need Help?

- **Slack**: #ml-recommendations channel
- **Issues**: GitHub with label `ml-algorithm`
- **Email**: engineering-team@fingermobileprotocol.com

---

**Happy Recommending! 🎉**
