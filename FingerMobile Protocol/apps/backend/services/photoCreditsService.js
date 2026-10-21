const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const db = require('../db');

class PhotoCreditsService {
  constructor() {
    // Initialize any required services or configurations
  }

  async getAll(filters = {}) {
    try {
      const limit = parseInt(filters.limit) || 50;
      const offset = parseInt(filters.offset) || 0;
      const category = filters.category;

      let query = 'SELECT p.*, p.id::text AS photo_id FROM photocredits_photos p WHERE p.status = $1 AND p.is_public = TRUE';
      const params = ['active'];

      if (category && category !== 'all') {
        params.push(category);
        query += ` AND p.category = $${params.length}`;
      }

      params.push(limit);
      query += ` ORDER BY p.uploaded_at DESC LIMIT $${params.length}`;

      params.push(offset);
      query += ` OFFSET $${params.length}`;

      const res = await db.query(query, params);
      return res.rows;
    } catch (error) {
      logger.error('Error getting all photo credits:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const res = await db.query('SELECT p.*, p.id::text AS photo_id FROM photocredits_photos p WHERE p.id::text = $1 AND p.status = $2 AND p.is_public = TRUE LIMIT 1', [String(id), 'active']);
      return res.rows[0] || null;
    } catch (error) {
      logger.error('Error getting photo credit by id:', error);
      throw error;
    }
  }

  async create(photoCreditData) {
    try {
      const id = photoCreditData.id || uuidv4();
      const uploaderId = photoCreditData.uploader_id || photoCreditData.uploaderId;
      const title = photoCreditData.title;
      const description = photoCreditData.description || '';
      const imageUrl = photoCreditData.image_url || photoCreditData.imageUrl;
      if (!uploaderId || !title || !imageUrl) {
        throw new Error('uploader_id, title, and image_url are required to create a PhotoCredits asset');
      }
      const thumbnailUrl = photoCreditData.thumbnail_url || photoCreditData.thumbnailUrl || imageUrl;
      const category = photoCreditData.category || 'photography';
      const tags = photoCreditData.tags || [];
      const location = photoCreditData.location && typeof photoCreditData.location === 'object'
        ? photoCreditData.location
        : {};
      const locationName = typeof photoCreditData.location === 'string' ? photoCreditData.location : photoCreditData.location_name || null;
      const cameraInfo = photoCreditData.camera_info || photoCreditData.cameraInfo || {};
      const licenseType = photoCreditData.license_type || photoCreditData.licenseType || 'royalty_free';
      const price = parseFloat(photoCreditData.price ?? photoCreditData.cost) || 0;
      const isFree = photoCreditData.is_free !== undefined ? photoCreditData.is_free : (price === 0);

      const query = `
        INSERT INTO photocredits_photos (
          id, uploader_id, title, description, image_url, thumbnail_url,
          category, tags, location, location_name, camera_info, license_type,
          cost, is_free, is_public, is_downloadable, status, uploaded_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10, $11::jsonb,
          $12, $13, $14, $15, $16, 'active', NOW(), NOW()
        )
        RETURNING *, id::text AS photo_id
      `;

      const res = await db.query(query, [
        id, String(uploaderId), title, description, imageUrl, thumbnailUrl,
        category, JSON.stringify(tags), JSON.stringify(location), locationName,
        JSON.stringify(cameraInfo), licenseType, price, isFree,
        photoCreditData.is_public !== false, photoCreditData.is_downloadable !== false
      ]);

      return res.rows[0];
    } catch (error) {
      logger.error('Error creating photo credit:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const existing = await db.query('SELECT * FROM photocredits_photos WHERE id::text = $1', [String(id)]);
      if (!existing.rowCount) return null;
      const current = existing.rows[0];
      const res = await db.query(
        `UPDATE photocredits_photos
         SET title = $1, description = $2, cost = $3, license_type = $4,
             is_public = $5, is_downloadable = $6, updated_at = NOW()
         WHERE id = $7 RETURNING *, id::text AS photo_id`,
        [
          data.title !== undefined ? data.title : current.title,
          data.description !== undefined ? data.description : current.description,
          data.price !== undefined ? parseFloat(data.price) : current.cost,
          data.license_type !== undefined ? data.license_type : current.license_type,
          data.is_public !== undefined ? Boolean(data.is_public) : current.is_public,
          data.is_downloadable !== undefined ? Boolean(data.is_downloadable) : current.is_downloadable,
          current.id
        ]
      );
      return res.rows[0];
    } catch (error) {
      logger.error('Error updating photo credit:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const res = await db.query(
        `UPDATE photocredits_photos
         SET status = 'archived', is_public = FALSE, updated_at = NOW()
         WHERE id::text = $1 AND status <> 'archived' RETURNING id`,
        [String(id)]
      );
      return res.rows.length > 0;
    } catch (error) {
      logger.error('Error deleting photo credit:', error);
      throw error;
    }
  }

  /**
   * Create a new PhotoCredit (image/video)
   * @param {Object} photoCreditData - Data for the new PhotoCredit
   * @returns {Object} - The created PhotoCredit
   */
  async createPhotoCredit(photoCreditData) {
    return this.create(photoCreditData);
  }



  /**
   * Calculate engagement score for a PhotoCredit
   * @param {Object} photoCredit - The PhotoCredit object
   * @returns {number} - The engagement score
   */
  calculateEngagementScore(photoCredit) {
    // Engagement score calculation based on various factors
    // Weights can be adjusted based on business requirements
    const {
      likeCount,
      commentCount,
      downloadCount,
      shareCount,
      viewCount,
      saveCount
    } = photoCredit;

    // Weighted scoring system
    const likeWeight = 1;
    const commentWeight = 2;
    const downloadWeight = 3;
    const shareWeight = 3;
    const viewWeight = 0.1;
    const saveWeight = 2;

    const engagementScore =
      likeCount * likeWeight +
      commentCount * commentWeight +
      downloadCount * downloadWeight +
      shareCount * shareWeight +
      viewCount * viewWeight +
      saveCount * saveWeight;

    return engagementScore;
  }

  /**
   * Determine if a PhotoCredit is eligible for earning FIC
   * @param {Object} photoCredit - The PhotoCredit object
   * @returns {boolean} - Whether the PhotoCredit is eligible for earning
   */
  isEligibleForEarning(photoCredit) {
    // Calculate engagement score
    const engagementScore = this.calculateEngagementScore(photoCredit);

    // Threshold for earning eligibility
    const earningThreshold =
      parseInt(process.env.PHOTOCREDIT_EARNING_THRESHOLD) || 100;

    return engagementScore >= earningThreshold;
  }

  /**
   * Determine if a PhotoCredit is eligible for monthly FIC award
   * @param {Object} photoCredit - The PhotoCredit object
   * @returns {boolean} - Whether the PhotoCredit is eligible for monthly award
   */
  isEligibleForMonthlyAward(photoCredit) {
    // Monthly award eligibility based on like count
    const likeThreshold =
      parseInt(process.env.PHOTOCREDIT_MONTHLY_LIKE_THRESHOLD) || 500;

    return photoCredit.likeCount >= likeThreshold;
  }

  /**
   * Create a new board for organizing PhotoCredits
   * @param {Object} boardData - Data for the new board
   * @returns {Object} - The created board
   */
  async createBoard(boardData) {
    try {
      const {
        ownerId,
        name,
        description,
        privacySetting = 'public', // public, private, or secret
        isDownloadable = true,
        isShareable = true
      } = boardData;

      const newBoard = {
        id: uuidv4(),
        ownerId,
        name,
        description,
        privacySetting,
        isDownloadable,
        isShareable,
        photoCreditCount: 0,
        memberCount: 0, // For group boards
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Here you would typically save to the database
      // await db.boards.insert(newBoard);

      return newBoard;
    } catch (error) {
      logger.error('Error creating board:', error);
      throw error;
    }
  }

  /**
   * Add a PhotoCredit to a board
   * @param {string} photoCreditId - ID of the PhotoCredit
   * @param {string} boardId - ID of the board
   * @param {string} memberId - ID of the member adding it
   * @returns {Object} - Result of the operation
   */
  async addToBoard(photoCreditId, boardId, memberId) {
    try {
      // This would typically involve database operations
      // await db.boardPhotoCredits.insert({
      //   photoCreditId,
      //   boardId,
      //   addedBy: memberId,
      //   addedAt: new Date()
      // });

      // Update board's photoCredit count
      // await db.boards.update({ id: boardId }, { $inc: { photoCreditCount: 1 } });

      return {
        success: true,
        message: 'PhotoCredit added to board successfully',
        photoCreditId,
        boardId,
        memberId
      };
    } catch (error) {
      logger.error('Error adding PhotoCredit to board:', error);
      throw error;
    }
  }

  /**
   * Update download count for a PhotoCredit
   * @param {string} photoCreditId - ID of the PhotoCredit
   * @param {string} downloaderId - ID of the downloader
   * @returns {Object} - Result of the operation
   */
  async recordDownload(photoCreditId, downloaderId) {
    try {
      // This would typically involve database operations
      // await db.photoCredits.update(
      //   { id: photoCreditId }
      //   { $inc: { downloadCount: 1 } $set: { updatedAt: new Date() } }
      // );

      // Notify the owner of the download
      // await this.notifyOwnerOfDownload(photoCreditId, downloaderId);

      return {
        success: true,
        message: 'Download recorded successfully',
        photoCreditId,
        downloaderId
      };
    } catch (error) {
      logger.error('Error recording download:', error);
      throw error;
    }
  }

  /**
   * Get trending PhotoCredits based on engagement
   * @param {number} limit - Number of PhotoCredits to return
   * @param {string} timeFrame - Time frame ('daily', 'weekly', 'monthly')
   * @returns {Array} - Array of trending PhotoCredits
   */
  async getTrendingPhotoCredits(limit = 10, timeFrame = 'weekly') {
    try {
      // Calculate date threshold based on timeFrame
      const now = new Date();
      let dateThreshold = new Date();

      switch (timeFrame) {
      case 'daily':
        dateThreshold.setDate(now.getDate() - 1);
        break;
      case 'weekly':
        dateThreshold.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        dateThreshold.setMonth(now.getMonth() - 1);
        break;
      default:
        dateThreshold.setDate(now.getDate() - 7);
      }

      // This would typically involve database query with aggregation
      // const trendingPhotoCredits = await db.photoCredits
      //   .find({
      //     createdAt: { $gte: dateThreshold }
      //     status: 'active'
      //   })
      //   .sort({ engagementScore: -1 })
      //   .limit(limit)
      //   .toArray();

      // For now, returning a placeholder
      return Array.from({ length: limit }, (_, i) => ({
        id: uuidv4(),
        title: `Trending PhotoCredit ${i + 1}`,
        uploaderId: uuidv4(),
        imageUrl: `https://example.com/trending-${i + 1}.jpg`,
        thumbnailUrl: `https://example.com/trending-${i + 1}-thumb.jpg`,
        likeCount: Math.floor(Math.random() * 1000),
        commentCount: Math.floor(Math.random() * 100),
        downloadCount: Math.floor(Math.random() * 500),
        shareCount: Math.floor(Math.random() * 200),
        viewCount: Math.floor(Math.random() * 5000),
        saveCount: Math.floor(Math.random() * 300),
        engagementScore: Math.floor(Math.random() * 5000),
        uploadedAt: new Date(
          dateThreshold.getTime() + Math.random() * (now - dateThreshold),
        )
      }));
    } catch (error) {
      logger.error('Error getting trending PhotoCredits:', error);
      throw error;
    }
  }

  /**
   * Get recommended PhotoCredits for a member
   * @param {string} memberId - ID of the member
   * @param {number} limit - Number of PhotoCredits to return
   * @returns {Array} - Array of recommended PhotoCredits
   */
  async getRecommendedPhotoCredits(memberId, limit = 10) {
    try {
      // This would typically involve more complex recommendation logic
      // based on member's activity, interests, followed boards, etc.

      // For now, returning a placeholder
      return Array.from({ length: limit }, (_, i) => ({
        id: uuidv4(),
        title: `Recommended PhotoCredit ${i + 1}`,
        uploaderId: uuidv4(),
        imageUrl: `https://example.com/recommended-${i + 1}.jpg`,
        thumbnailUrl: `https://example.com/recommended-${i + 1}-thumb.jpg`,
        likeCount: Math.floor(Math.random() * 1000),
        commentCount: Math.floor(Math.random() * 100),
        downloadCount: Math.floor(Math.random() * 500),
        category: ['nature', 'travel', 'food', 'fashion', 'tech'][
          Math.floor(Math.random() * 5)
        ],
        tags: ['popular', 'trending', 'featured'],
        uploadedAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ), // Random date in last 30 days
      }));
    } catch (error) {
      logger.error('Error getting recommended PhotoCredits:', error);
      throw error;
    }
  }

  /**
   * Get 26-Day Friday Monthly Giveaway Leaderboard (Top 10 UGC Photos)
   */
  async getGiveawayLeaderboard() {
    try {
      const query = `
        SELECT
          id, photo_id, uploader_id, photographer_name, title, description,
          image_url, thumbnail_url, category, tags, location, camera_info,
          license_type, credits_count, price, is_free, created_at,
          COALESCE(likes, 0) as likes,
          COALESCE(dislikes, 0) as dislikes,
          COALESCE(downloads, 0) as downloads,
          COALESCE(shares, 0) as shares,
          COALESCE(rating, 5.0) as rating,
          poll_data,
          (
            (COALESCE(likes, 0) * 1) +
            (COALESCE(downloads, 0) * 3) +
            (COALESCE(shares, 0) * 2) +
            (COALESCE(rating, 5.0) * 10)
          ) as composite_score
        FROM photo_credits
        WHERE status = 'active'
        ORDER BY composite_score DESC
        LIMIT 10
      `;

      const res = await db.query(query);

      // Prize structure (125,000 FIC Total Prize Pool)
      const prizeStructure = [
        { rank: 1, prizeFic: 50000, title: 'Champion Grand Prize', badge: '🥇 1st Place' },
        { rank: 2, prizeFic: 25000, title: 'Runner-Up Sovereign Award', badge: '🥈 2nd Place' },
        { rank: 3, prizeFic: 15000, title: 'Masterclass Bronze Award', badge: '🥉 3rd Place' },
        { rank: 4, prizeFic: 10000, title: 'Top 4 Excellence Award', badge: 'Top 4' },
        { rank: 5, prizeFic: 8000, title: 'Top 5 Creator Grant', badge: 'Top 5' },
        { rank: 6, prizeFic: 6000, title: 'Top 6 Editorial Honor', badge: 'Top 6' },
        { rank: 7, prizeFic: 4000, title: 'Top 7 Visual Merit', badge: 'Top 7' },
        { rank: 8, prizeFic: 3000, title: 'Top 8 Community Selection', badge: 'Top 8' },
        { rank: 9, prizeFic: 2000, title: 'Top 9 Rising Light Award', badge: 'Top 9' },
        { rank: 10, prizeFic: 1000, title: 'Top 10 Finalist Laurels', badge: 'Top 10' }
      ];

      // Calculate 26-Day Friday Cycle Metadata
      const now = new Date();
      const dayOfWeek = now.getDay();
      let daysUntilFriday = (5 - dayOfWeek + 7) % 7;
      if (daysUntilFriday === 0) daysUntilFriday = 7;
      const nextFriday = new Date(now.getTime() + (daysUntilFriday * 24 * 60 * 60 * 1000));
      nextFriday.setHours(23, 59, 59, 999);

      const msRemaining = nextFriday.getTime() - now.getTime();
      const daysRemaining = Math.max(1, Math.floor(msRemaining / (1000 * 60 * 60 * 24)));
      const hoursRemaining = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      const leaderboard = res.rows.map((row, idx) => {
        const prize = prizeStructure[idx] || { rank: idx + 1, prizeFic: 500, title: 'Finalist', badge: `Top ${idx + 1}` };
        return {
          ...row,
          rank: idx + 1,
          prizeFic: prize.prizeFic,
          prizeTitle: prize.title,
          prizeBadge: prize.badge,
          composite_score: parseFloat(row.composite_score).toFixed(1)
        };
      });

      return {
        cycleDays: 26,
        nextPayoutFriday: nextFriday.toISOString(),
        daysRemaining,
        hoursRemaining,
        totalPrizePoolFic: 125000,
        leaderboard
      };
    } catch (error) {
      logger.error('Error in getGiveawayLeaderboard:', error);
      throw error;
    }
  }

  /**
   * Vote / Engage with PhotoCredit (Like, Dislike, Download, Share, Rating, Poll)
   */
  async votePhoto(id, action, payload = {}) {
    try {
      const photo = await this.getById(id);
      if (!photo) return null;

      let updateQuery = '';
      const params = [photo.id];

      if (action === 'like') {
        updateQuery = 'UPDATE photo_credits SET likes = COALESCE(likes, 0) + 1, updated_at = NOW() WHERE id = $1 RETURNING *';
      } else if (action === 'dislike') {
        updateQuery = 'UPDATE photo_credits SET dislikes = COALESCE(dislikes, 0) + 1, updated_at = NOW() WHERE id = $1 RETURNING *';
      } else if (action === 'download') {
        updateQuery = 'UPDATE photo_credits SET downloads = COALESCE(downloads, 0) + 1, updated_at = NOW() WHERE id = $1 RETURNING *';
      } else if (action === 'share') {
        updateQuery = 'UPDATE photo_credits SET shares = COALESCE(shares, 0) + 1, updated_at = NOW() WHERE id = $1 RETURNING *';
      } else if (action === 'rating') {
        const newRating = Math.min(5.0, Math.max(1.0, parseFloat(payload.rating) || 5.0));
        updateQuery = 'UPDATE photo_credits SET rating = ROUND(((COALESCE(rating, 5.0) + $2) / 2)::numeric, 2), updated_at = NOW() WHERE id = $1 RETURNING *';
        params.push(newRating);
      } else if (action === 'poll_vote') {
        const optionIndex = parseInt(payload.optionIndex);
        const poll = photo.poll_data || payload.poll;
        if (poll && Array.isArray(poll.options)) {
          const optKey = typeof poll.options[optionIndex] === 'string'
            ? poll.options[optionIndex]
            : (poll.options[optionIndex]?.text || String(optionIndex));
          const votes = poll.votes || {};
          votes[optKey] = (votes[optKey] || 0) + 1;
          poll.votes = votes;
          updateQuery = 'UPDATE photo_credits SET poll_data = $2::jsonb, updated_at = NOW() WHERE id = $1 RETURNING *';
          params.push(JSON.stringify(poll));
        } else {
          return photo;
        }
      } else if (action === 'create_poll') {
        const poll = payload.poll;
        if (poll) {
          updateQuery = 'UPDATE photo_credits SET poll_data = $2::jsonb, updated_at = NOW() WHERE id = $1 RETURNING *';
          params.push(JSON.stringify(poll));
        } else {
          return photo;
        }
      } else {
        return photo;
      }

      const res = await db.query(updateQuery, params);
      return res.rows[0];
    } catch (error) {
      logger.error('Error voting on photo:', error);
      throw error;
    }
  }
}

module.exports = new PhotoCreditsService();
