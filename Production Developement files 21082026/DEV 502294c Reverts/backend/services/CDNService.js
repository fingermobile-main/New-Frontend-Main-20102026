/**
 * CDNService
 * CloudFront/Cloudflare integration for global content delivery, caching, and DDoS protection
 */

const { CloudFrontClient, CreateInvalidationCommand } = require('@aws-sdk/client-cloudfront');
const axios = require('axios');
const pool = require('../database/connection');

class CDNService {
  constructor() {
    this.provider = process.env.CDN_PROVIDER || 'cloudfront'; // 'cloudfront' or 'cloudflare'
    
    if (this.provider === 'cloudfront') {
      this.cloudfront = new CloudFrontClient({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
      });
      this.distributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID;
    } else if (this.provider === 'cloudflare') {
      this.cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID;
      this.cloudflareApiKey = process.env.CLOUDFLARE_API_KEY;
      this.cloudflareEmail = process.env.CLOUDFLARE_EMAIL;
    }
  }
  
  /**
   * Invalidate CDN cache for specific paths
   */
  async invalidateCache(paths) {
    try {
      if (this.provider === 'cloudfront') {
        return await this.invalidateCloudFront(paths);
      } else if (this.provider === 'cloudflare') {
        return await this.purgeCloudflare(paths);
      }
    } catch (error) {
      logger.error('Error invalidating CDN cache:', error);
      throw error;
    }
  }
  
  /**
   * Invalidate CloudFront cache
   */
  async invalidateCloudFront(paths) {
    try {
    const params = {
      DistributionId: this.distributionId,
      InvalidationBatch: {
        CallerReference: `invalidation-${Date.now()}`,
        Paths: {
          Quantity: paths.length,
          Items: paths
        }
      }
    };
    
    const command = new CreateInvalidationCommand(params);
    const result = await this.cloudfront.send(command);
    
    // Log invalidation
    await this.logCacheAction('invalidation', paths, result.Invalidation.Id);
    
    return {
      success: true,
      invalidationId: result.Invalidation.Id,
      status: result.Invalidation.Status
    };
    } catch (error) {
      logger.error('invalidateCloudFront error:', error);
      throw error;
    }
  }
  
  /**
   * Purge Cloudflare cache
   */
  async purgeCloudflare(paths) {
    try {
    const url = `https://api.cloudflare.com/client/v4/zones/${this.cloudflareZoneId}/purge_cache`;
    
    const response = await axios.post(url, {
      files: paths
    } {
      headers: {
        'X-Auth-Email': this.cloudflareEmail,
        'X-Auth-Key': this.cloudflareApiKey,
        'Content-Type': 'application/json'
      }
    });
    
    // Log purging
    await this.logCacheAction('purge', paths, response.data.result?.id);
    
    return {
      success: response.data.success,
      result: response.data.result
    };
    } catch (error) {
      logger.error('purgeCloudflare error:', error);
      throw error;
    }
  }
  
  /**
   * Get CDN cache statistics
   */
  async getCacheStats() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_actions,
          COUNT(CASE WHEN action_type = 'invalidation' THEN 1 END) as invalidations,
          COUNT(CASE WHEN action_type = 'purge' THEN 1 END) as purges,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed
        FROM cdn_cache_actions
        WHERE created_at > NOW() - INTERVAL '24 hours'
      `;
      
      const result = await pool.query(query);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error getting cache stats:', error);
      throw error;
    }
  }
  
  /**
   * Configure CDN caching rules
   */
  async configureCachingRules(rules) {
    try {
      // Store caching rules in database
      for (const rule of rules) {
        await pool.query(
          `INSERT INTO cdn_caching_rules (pattern, ttl_seconds, cache_control, is_active, created_at)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT (pattern)
           DO UPDATE SET ttl_seconds = $2, cache_control = $3, updated_at = NOW()`,
          [rule.pattern, rule.ttl, rule.cacheControl, rule.active !== false]
        );
      }
      
      return { success: true, rulesConfigured: rules.length };
    } catch (error) {
      logger.error('Error configuring caching rules:', error);
      throw error;
    }
  }
  
  /**
   * Get CDN performance metrics
   */
  async getPerformanceMetrics(timeRange = '24h') {
    try {
      const intervalMap = {
        '1h': '1 hour',
        '24h': '24 hours',
        '7d': '7 days',
        '30d': '30 days'
      };
      
      const interval = intervalMap[timeRange] || '24 hours';
      
      const query = `
        SELECT 
          DATE_TRUNC('hour', served_at) as time_bucket,
          COUNT(*) as requests,
          AVG(response_time_ms) as avg_response_time,
          SUM(bytes_served) as total_bytes,
          COUNT(CASE WHEN cache_status = 'HIT' THEN 1 END) as cache_hits,
          COUNT(CASE WHEN cache_status = 'MISS' THEN 1 END) as cache_misses
        FROM cdn_request_logs
        WHERE served_at > NOW() - INTERVAL '${interval}'
        GROUP BY time_bucket
        ORDER BY time_bucket ASC
      `;
      
      const result = await pool.query(query);
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting performance metrics:', error);
      throw error;
    }
  }
  
  /**
   * Log cache action
   */
  async logCacheAction(actionType, paths, referenceId) {
    try {
      await pool.query(
        `INSERT INTO cdn_cache_actions (action_type, paths, reference_id, status, created_at)
         VALUES ($1, $2, $3, 'completed', NOW())`,
        [actionType, JSON.stringify(paths), referenceId]
      );
    } catch (error) {
      logger.error('Error logging cache action:', error);
    }
  }
  
  /**
   * Log CDN request
   */
  async logRequest(requestData) {
    try {
      await pool.query(
        `INSERT INTO cdn_request_logs (
           path, method, response_time_ms, bytes_served, 
           cache_status, client_ip, user_agent, served_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          requestData.path,
          requestData.method,
          requestData.responseTime,
          requestData.bytesServed,
          requestData.cacheStatus,
          requestData.clientIp,
          requestData.userAgent
        ]
      );
    } catch (error) {
      logger.error('Error logging CDN request:', error);
    }
  }
}

module.exports = new CDNService();
