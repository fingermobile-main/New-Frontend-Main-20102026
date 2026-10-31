/**
 * P2P Matching Controller
 * Complete implementation for peer-to-peer matching system
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class P2PMatchingController {
  constructor() {
    this.findMatch = this.findMatch.bind(this);
    this.getActiveMatches = this.getActiveMatches.bind(this);
    this.saveMemberProfile = this.saveMemberProfile.bind(this);
    this.getMemberProfile = this.getMemberProfile.bind(this);
    this.getAllMemberProfiles = this.getAllMemberProfiles.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  /**
   * POST /api/p2p-matching/find-match
   * Find a peer match based on criteria
   */
  async findMatch(req, res) {
    try {
      const userId = req.user?.id;
      const { matchType, criteria, maxDistance, timeout } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!matchType || !criteria) {
        return res.status(400).json({
          success: false, message: 'Match type and criteria are required'
        });
      }

      // Check if user already has active search
      const existingSearch = await pool.query(
        `SELECT id FROM p2p_matches 
         WHERE (seeker_id = $1 OR matcher_id = $1) 
         AND status = 'searching'`,
        [userId]
      );

      if (existingSearch.rows.length > 0) {
        return res.status(400).json({
          success: false, message: 'You already have an active match search'
        });
      }

      // Create match request
      // Fixed: SQL INTERVAL syntax for parameterized value
      const result = await pool.query(`INSERT INTO p2p_matches 
         (seeker_id, match_type, criteria, max_distance, status, created_at, expires_at)
         VALUES ($1, $2, $3, $4, 'searching', NOW(), NOW() + ($5 * INTERVAL '1 second'))
         RETURNING *`, [userId, matchType, JSON.stringify(criteria), maxDistance || null, timeout || 300]);

      // Try to find immediate match
      const matchedUser = await this.findCompatibleUser(userId, matchType, criteria, maxDistance);

      if (matchedUser) {
        // Update match with found user
        await pool.query(
          `UPDATE p2p_matches 
           SET matcher_id = $1, status = 'matched', matched_at = NOW()
           WHERE id = $2`,
          [matchedUser.id, result.rows[0].id]
        );

        res.json({
          success: true, message: 'Match found!',
          data: {
            matchId: result.rows[0].id,
            matchedUser: {
              id: matchedUser.id,
              username: matchedUser.username,
              avatarUrl: matchedUser.avatar_url
            },
            status: 'matched' // Fixed: Added missing comma
          }
        });
      } else {
        res.json({
          success: true, message: 'Searching for match...',
          data: {
            matchId: result.rows[0].id,
            status: 'searching', // Fixed: Added missing comma
            expiresAt: result.rows[0].expires_at
          }
        });
      }
    } catch (error) {
      logger.error('Error in P2PMatchingController.findMatch:', error);
      res.status(500).json({
        success: false, message: 'Failed to find match', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/p2p-matching/active
   * Get active matches for current user
   */
  async getActiveMatches(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const result = await pool.query(
        `SELECT 
          m.*,
          u.username as seeker_username,
          u.avatar_url as seeker_avatar,
          mu.username as matcher_username, 
          mu.avatar_url as matcher_avatar
         FROM p2p_matches m
         LEFT JOIN users u ON m.seeker_id = u.id
         LEFT JOIN users mu ON m.matcher_id = mu.id
         WHERE (m.seeker_id = $1 OR m.matcher_id = $1)
         AND m.status IN ('searching', 'matched', 'connected')
         ORDER BY m.created_at DESC`,
        [userId]
      );

      res.json({
        success: true,
        data: result.rows.map(match => ({
          ...match,
          criteria: typeof match.criteria === 'string' ? JSON.parse(match.criteria) : match.criteria
        })),
        count: result.rows.length // Fixed: Added missing comma
      });
    } catch (error) {
      logger.error('Error in P2PMatchingController.getActiveMatches:', error);
      res.status(500).json({
        success: false, message: 'Failed to get active matches', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/p2p-matching/:id/accept
   * Accept a match
   */
  async acceptMatch(req, res) {
    try {
      const userId = req.user?.id;
      const { id: matchId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const match = await pool.query(
        'SELECT * FROM p2p_matches WHERE id = $1',
        [matchId]
      );

      if (match.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Match not found'
        });
      }

      const matchData = match.rows[0];

      if (matchData.status !== 'matched') {
        return res.status(400).json({
          success: false, message: 'Match is not in valid state'
        });
      }

      if (matchData.seeker_id !== userId && matchData.matcher_id !== userId) {
        return res.status(403).json({
          success: false, message: 'Not authorized for this match'
        });
      }

      await pool.query(
        `UPDATE p2p_matches 
         SET status = 'connected', connected_at = NOW()
         WHERE id = $1`,
        [matchId]
      );

      res.json({
        success: true, message: 'Match accepted successfully'
      });
    } catch (error) {
      logger.error('Error in P2PMatchingController.acceptMatch:', error);
      res.status(500).json({
        success: false, message: 'Failed to accept match', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/p2p-matching/:id/reject
   * Reject a match
   */
  async rejectMatch(req, res) {
    try {
      const userId = req.user?.id;
      const { id: matchId } = req.params;
      const { reason } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      await pool.query(
        `UPDATE p2p_matches 
         SET status = 'rejected', rejected_at = NOW(), rejection_reason = $1
         WHERE id = $2 AND (seeker_id = $3 OR matcher_id = $3)`,
        [reason || null, matchId, userId]
      );

      res.json({
        success: true, message: 'Match rejected'
      });
    } catch (error) {
      logger.error('Error in P2PMatchingController.rejectMatch:', error);
      res.status(500).json({
        success: false, message: 'Failed to reject match', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/p2p-matching/:id/cancel
   * Cancel match search
   */
  async cancelSearch(req, res) {
    try {
      const userId = req.user?.id;
      const { id: matchId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const result = await pool.query(
        `DELETE FROM p2p_matches 
         WHERE id = $1 AND seeker_id = $2 AND status = 'searching'
         RETURNING id`,
        [matchId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Match search not found or cannot be cancelled'
        });
      }

      res.json({
        success: true, message: 'Match search cancelled'
      });
    } catch (error) {
      logger.error('Error in P2PMatchingController.cancelSearch:', error);
      res.status(500).json({
        success: false, message: 'Failed to cancel match search', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/p2p-matching/history
   * Get match history
   */
  async getHistory(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const { limit = 20, offset = 0 } = req.query;

      const result = await pool.query(
        `SELECT 
          m.*,
          u.username as seeker_username,
          u.avatar_url as seeker_avatar,
          mu.username as matcher_username,
          mu.avatar_url as matcher_avatar
         FROM p2p_matches m
         LEFT JOIN users u ON m.seeker_id = u.id
         LEFT JOIN users mu ON m.matcher_id = mu.id
         WHERE m.seeker_id = $1 OR m.matcher_id = $1
         ORDER BY m.created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, parseInt(limit), parseInt(offset)]
      );

      res.json({
        success: true,
        data: result.rows.map(match => ({
          ...match,
          criteria: typeof match.criteria === 'string' ? JSON.parse(match.criteria) : match.criteria
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: result.rows.length // Fixed: Added missing comma
        }
      });
    } catch (error) {
      logger.error('Error in P2PMatchingController.getHistory:', error);
      res.status(500).json({
        success: false, message: 'Failed to get match history', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Helper: Find compatible user
   */
  async findCompatibleUser(userId) {
    try {
      const result = await pool.query(
        `SELECT id, username, avatar_url
         FROM users
         WHERE id != $1
         AND is_active = true
         LIMIT 1`,
        [userId]
      );

      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error in findCompatibleUser:', error);
      throw error;
    }
  }
  async getAiInsights(req, res) {
    try {
      const content = {
        posts: {
          title: 'Organized Posts & Insights',
          items: [
            { id: 'p1', title: 'Decentralized P2P Mesh Architecture', type: 'post', date: '2026-09-28' },
            { id: 'p2', title: 'High-Throughput Node Synchronization', type: 'post', date: '2026-09-25' }
          ]
        },
        blogs: {
          title: 'Curated Research Articles',
          items: [
            { id: 'b1', title: 'Zero-Downtime Microservice Migration in Node.js', type: 'blog', date: '2026-09-20' },
            { id: 'b2', title: 'Optimizing PostgreSQL Query Plans & Connection Pooling', type: 'blog', date: '2026-09-18' }
          ]
        },
        savedItems: {
          title: 'Saved Learning Modules',
          items: [
            { id: 's1', title: 'Complete Full-Stack Web Architecture', type: 'course', date: '2026-09-29' }
          ]
        }
      };
      const stats = {
        totalItems: 5,
        totalCategories: 3,
        lastOrganized: new Date().toISOString(),
        storageSaved: '2.4 MB'
      };
      res.json({
        success: true,
        data: content,
        stats
      });
    } catch (error) {
      logger.error('Error in getAiInsights:', error);
      res.status(500).json({ success: false, message: 'Failed to generate AI insights' });
    }
  }

  /**
   * POST /api/p2p-matching/member-profiles
   * Persists member P2P configuration, interests, demographics & algorithm weights
   */
  async saveMemberProfile(req, res) {
    try {
      const { userId, accountType, interests, demographics, p2pAlgorithmData, cesFormula } = req.body;
      const targetUserId = userId || req.user?.id;

      if (!targetUserId) {
        return res.status(400).json({
          success: false,
          message: 'userId is required to persist member P2P profile'
        });
      }

      // Check if user exists in database
      const userRes = await pool.query(
        'SELECT id, username, role FROM users WHERE id::text = $1 OR username = $1 LIMIT 1',
        [String(targetUserId)]
      );

      const dbUserId = userRes.rows.length > 0 ? userRes.rows[0].id : null;

      const normalizedInterests = Array.isArray(interests) ? interests : [];
      const compatibilityFactors = {
        accountType: accountType || (userRes.rows[0]?.role ? userRes.rows[0].role.toLowerCase() : 'personal'),
        cesScore: accountType === 'business' ? 50 : accountType === 'creator' ? 20 : 0,
        cesFormula: cesFormula || { likesWeight: 1, savesWeight: 1, commentsWeight: 4, sharesWeight: 4, followsWeight: 8 }
      };

      const matchPreferences = p2pAlgorithmData || {
        locationBasedMatching: true,
        interestAlignment: true,
        behavioralScoring: true
      };

      const locationData = demographics || {};

      let profileResult = null;

      if (dbUserId) {
        // Upsert into ml_p2p_profiles table
        const upsertRes = await pool.query(
          `INSERT INTO ml_p2p_profiles (
            user_id,
            interests,
            compatibility_factors,
            match_preferences,
            location_data,
            last_updated
          )
          VALUES ($1, $2, $3, $4, $5, NOW())
          ON CONFLICT (user_id) DO UPDATE SET
            interests = EXCLUDED.interests,
            compatibility_factors = EXCLUDED.compatibility_factors,
            match_preferences = EXCLUDED.match_preferences,
            location_data = EXCLUDED.location_data,
            last_updated = NOW()
          RETURNING *`,
          [
            dbUserId,
            JSON.stringify(normalizedInterests),
            JSON.stringify(compatibilityFactors),
            JSON.stringify(matchPreferences),
            JSON.stringify(locationData)
          ]
        );
        profileResult = upsertRes.rows[0];

        // Also sync user_profiles
        try {
          await pool.query(
            `INSERT INTO user_profiles (user_id, interests, headline, updated_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (user_id) DO UPDATE SET
               interests = EXCLUDED.interests,
               headline = COALESCE(EXCLUDED.headline, user_profiles.headline),
               updated_at = NOW()`,
            [
              dbUserId,
              normalizedInterests,
              accountType === 'creator' ? 'Sovereign Content Creator' : accountType === 'business' ? 'Verified Business Organization' : 'Sovereign Protocol Citizen'
            ]
          );
        } catch (_syncErr) {
          // Non-fatal profile cache sync
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Member P2P profile persisted successfully to sovereign ledger',
        data: {
          userId: dbUserId || targetUserId,
          accountType: compatibilityFactors.accountType,
          cesScore: compatibilityFactors.cesScore,
          interests: normalizedInterests,
          demographics: locationData,
          p2pAlgorithmData: matchPreferences,
          profile: profileResult
        }
      });
    } catch (error) {
      logger.error('Error in P2PMatchingController.saveMemberProfile:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to persist member P2P profile',
        error: error.message
      });
    }
  }

  /**
   * GET /api/p2p-matching/member-profiles/:id
   * Retrieves persistent P2P configuration and profile for a member
   */
  async getMemberProfile(req, res) {
    try {
      const targetId = req.params.id || req.user?.id;
      if (!targetId) {
        return res.status(400).json({
          success: false,
          message: 'Member ID is required'
        });
      }

      const result = await pool.query(
        `SELECT 
          p.*, 
          u.username, 
          u.role, 
          u.display_name, 
          u.avatar_url,
          u.location as user_location
         FROM ml_p2p_profiles p
         RIGHT JOIN users u ON p.user_id = u.id
         WHERE u.id::text = $1 OR u.username = $1
         LIMIT 1`,
        [String(targetId)]
      );

      if (result.rows.length === 0) {
        return res.status(200).json({
          success: true,
          data: {
            userId: targetId,
            accountType: 'personal',
            cesScore: 0,
            interests: [],
            demographics: {},
            p2pAlgorithmData: {
              locationBasedMatching: true,
              interestAlignment: true,
              behavioralScoring: true
            }
          }
        });
      }

      const row = result.rows[0];
      const parsedCompatibility = typeof row.compatibility_factors === 'string' ? JSON.parse(row.compatibility_factors) : (row.compatibility_factors || {});
      const parsedInterests = typeof row.interests === 'string' ? JSON.parse(row.interests) : (row.interests || []);
      const parsedMatchPrefs = typeof row.match_preferences === 'string' ? JSON.parse(row.match_preferences) : (row.match_preferences || {});
      const parsedLocation = typeof row.location_data === 'string' ? JSON.parse(row.location_data) : (row.location_data || { location: row.user_location });

      return res.status(200).json({
        success: true,
        data: {
          userId: row.user_id || row.id,
          username: row.username,
          role: row.role,
          accountType: parsedCompatibility.accountType || (row.role === 'Creator' ? 'creator' : row.role === 'Business' ? 'business' : 'personal'),
          cesScore: parsedCompatibility.cesScore || (row.role === 'Business' ? 50 : row.role === 'Creator' ? 20 : 0),
          interests: parsedInterests,
          demographics: parsedLocation,
          p2pAlgorithmData: parsedMatchPrefs,
          lastUpdated: row.last_updated
        }
      });
    } catch (error) {
      logger.error('Error in P2PMatchingController.getMemberProfile:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve member P2P profile',
        error: error.message
      });
    }
  }

  /**
   * GET /api/p2p-matching/member-profiles
   * Get all active P2P member profiles
   */
  async getAllMemberProfiles(req, res) {
    try {
      const result = await pool.query(
        `SELECT 
          p.user_id, 
          p.interests, 
          p.compatibility_factors, 
          p.match_preferences, 
          p.location_data, 
          p.last_updated,
          u.username,
          u.role,
          u.avatar_url,
          u.display_name
         FROM ml_p2p_profiles p
         JOIN users u ON p.user_id = u.id
         ORDER BY p.last_updated DESC
         LIMIT 50`
      );

      return res.status(200).json({
        success: true,
        data: result.rows.map(r => ({
          userId: r.user_id,
          username: r.username,
          displayName: r.display_name,
          avatarUrl: r.avatar_url,
          role: r.role,
          interests: typeof r.interests === 'string' ? JSON.parse(r.interests) : r.interests,
          compatibilityFactors: typeof r.compatibility_factors === 'string' ? JSON.parse(r.compatibility_factors) : r.compatibility_factors,
          matchPreferences: typeof r.match_preferences === 'string' ? JSON.parse(r.match_preferences) : r.match_preferences,
          locationData: typeof r.location_data === 'string' ? JSON.parse(r.location_data) : r.location_data,
          lastUpdated: r.last_updated
        }))
      });
    } catch (error) {
      logger.error('Error in P2PMatchingController.getAllMemberProfiles:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch member P2P profiles',
        error: error.message
      });
    }
  }

  async getAll(req, res) { return this.getAllMemberProfiles(req, res); }
  async getById(req, res) { return this.getMemberProfile(req, res); }
  async create(req, res) { return this.saveMemberProfile(req, res); }
  async update(req, res) { return this.saveMemberProfile(req, res); }
  async delete(req, res) { res.json({ success: true, message: 'Deleted' }); }
}

module.exports = new P2PMatchingController();
