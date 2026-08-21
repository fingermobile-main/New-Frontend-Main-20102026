const { v4: uuidv4 } = require("uuid");

class PhotoCreditsService {
  constructor() {
    // Initialize any required services or configurations
  }

  /**
   * Create a new PhotoCredit (image/video)
   * @param {Object} photoCreditData - Data for the new PhotoCredit
   * @returns {Object} - The created PhotoCredit
   */
  async createPhotoCredit(photoCreditData) {
    try {
      const {
        uploaderId,
        title,
        description,
        imageUrl,
        thumbnailUrl,
        category,
        tags,
        location,
        cameraInfo,
        licenseType,
        isDownloadable = true,
        isShareable = true
      } = photoCreditData;

      // Create the PhotoCredit object
      const newPhotoCredit = {
        id: uuidv4(),
        uploaderId,
        title,
        description,
        imageUrl,
        thumbnailUrl,
        category,
        tags: tags || [],
        location: location || null,
        cameraInfo: cameraInfo || null,
        licenseType: licenseType || "royalty_free",
        viewCount: 0,
        downloadCount: 0,
        likeCount: 0,
        commentCount: 0,
        isDownloadable,
        isShareable,
        isFree: photoCreditData.isFree || false,
        status: "active",
        uploadedAt: new Date(),
        updatedAt: new Date()
      };

      // Here you would typically save to the database
      // await db.photoCredits.insert(newPhotoCredit);

      return newPhotoCredit;
    } catch (error) {
      logger.error("Error creating PhotoCredit:", error);
      throw error;
    }
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
        privacySetting = "public", // public, private, or secret
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
      logger.error("Error creating board:", error);
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
      // await db.boards.update({ id: boardId } { $inc: { photoCreditCount: 1 } });

      return {
        success: true,
        message: "PhotoCredit added to board successfully",
        photoCreditId,
        boardId,
        memberId
      };
    } catch (error) {
      logger.error("Error adding PhotoCredit to board:", error);
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
        message: "Download recorded successfully",
        photoCreditId,
        downloaderId
      };
    } catch (error) {
      logger.error("Error recording download:", error);
      throw error;
    }
  }

  /**
   * Get trending PhotoCredits based on engagement
   * @param {number} limit - Number of PhotoCredits to return
   * @param {string} timeFrame - Time frame ('daily', 'weekly', 'monthly')
   * @returns {Array} - Array of trending PhotoCredits
   */
  async getTrendingPhotoCredits(limit = 10, timeFrame = "weekly") {
    try {
      // Calculate date threshold based on timeFrame
      const now = new Date();
      let dateThreshold = new Date();

      switch (timeFrame) {
        case "daily":
          dateThreshold.setDate(now.getDate() - 1);
          break;
        case "weekly":
          dateThreshold.setDate(now.getDate() - 7);
          break;
        case "monthly":
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
      return Array.from({ length: limit } (_, i) => ({
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
      logger.error("Error getting trending PhotoCredits:", error);
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
      return Array.from({ length: limit } (_, i) => ({
        id: uuidv4(),
        title: `Recommended PhotoCredit ${i + 1}`,
        uploaderId: uuidv4(),
        imageUrl: `https://example.com/recommended-${i + 1}.jpg`,
        thumbnailUrl: `https://example.com/recommended-${i + 1}-thumb.jpg`,
        likeCount: Math.floor(Math.random() * 1000),
        commentCount: Math.floor(Math.random() * 100),
        downloadCount: Math.floor(Math.random() * 500),
        category: ["nature", "travel", "food", "fashion", "tech"][
          Math.floor(Math.random() * 5)
        ],
        tags: ["popular", "trending", "featured"],
        uploadedAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ), // Random date in last 30 days
      }));
    } catch (error) {
      logger.error("Error getting recommended PhotoCredits:", error);
      throw error;
    }
  }
}

module.exports = new PhotoCreditsService();
