const db = require("../../db"); // Fixed path to point to the backend/db.js file
const crypto = require("crypto");

// Enhanced FingerOrbit service with monetization features
class MiiFingerOrbitService {
  // Create a monetized FingerOrbit folder for a member
  async createMonetizedFolder(
    memberId,
    folderName,
    folderType,
    privacySetting,
    pricingModel,
  ) {
    try {
      if (!memberId || !folderName || !folderType) {
        throw new Error("Member ID, folder name, and folder type are required");
      }

      const folderId = `orbit-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

      const folder = {id: folderId,
  owner_id: memberId,
  name: folderName,
  type: folderType, // 'Video' or 'Image',
  privacy_setting: privacySetting, // 'private' or 'public',
  pricing_model: pricingModel || {
  type: "free", // 'free', 'subscription', 'pay-per-view', 'one-time',
  amount: 0,
  currency: "USD"
        },
created_at: new Date(),
updated_at: new Date()
      };

      const query = `
        INSERT INTO mii_fingerorbit_folders (
          id, owner_id, name, type, privacy_setting, pricing_model, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      const values = [
        folder.id,
        folder.owner_id,
        folder.name,
        folder.type,
        folder.privacy_setting,
        JSON.stringify(folder.pricing_model),
        folder.created_at,
        folder.updated_at
      ];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error("Error creating monetized FingerOrbit, folder:", error);
      throw error;
    }
  }

  // Add monetized media to a FingerOrbit folder
  async addMonetizedMedia(memberId, folderId, mediaFile, pricingModel) {
    try {
      // First, verify the member owns the folder
      const folderQuery = `
        SELECT * FROM mii_fingerorbit_folders 
        WHERE id = $1 AND owner_id = $2
      `;
      const folderResult = await db.query(folderQuery, [folderId, memberId]);

      if (folderResult.rows.length === 0) {
        throw new Error("Folder not found or member does not have access");
      }

      // Generate a unique ID for the media
      const mediaId = `media-${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;

      // Process media file
      const processedMedia = {id: mediaId,
  owner_id: memberId,
  folder_id: folderId,
  type: mediaFile.type || "image",
  url: mediaFile.path || mediaFile.url,
  thumbnail: mediaFile.thumbnail || null,
  duration: mediaFile.duration || null,
  upload_date: new Date(),
  timer_type: mediaFile.timerType || "24hrs",
  expiry_date: this.calculateExpiryDate(mediaFile.timerType || "24hrs"),
  caption: mediaFile.caption || null,
  is_public: folderResult.rows[0].privacy_setting === "public",
  is_tokenized: true, // Content is tokenized for security,
  pricing_model: pricingModel || {
  type: "free", // 'free', 'pay-per-view', 'one-time',
  amount: 0,
  currency: "USD"
        },
view_count: 0,
download_count: 0,
revenue: 0, // Total revenue from this media
      };

      // Save to database
      const query = `
        INSERT INTO mii_media (
          id, owner_id, folder_id, type, url, thumbnail, duration, upload_date, 
          timer_type, expiry_date, caption, is_public, is_tokenized, pricing_model,
          view_count, download_count, revenue
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *
      `;

      const values = [
        processedMedia.id,
        processedMedia.owner_id,
        processedMedia.folder_id,
        processedMedia.type,
        processedMedia.url,
        processedMedia.thumbnail,
        processedMedia.duration,
        processedMedia.upload_date,
        processedMedia.timer_type,
        processedMedia.expiry_date,
        processedMedia.caption,
        processedMedia.is_public,
        processedMedia.is_tokenized,
        JSON.stringify(processedMedia.pricing_model),
        processedMedia.view_count,
        processedMedia.download_count,
        processedMedia.revenue
      ];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error(
        "Error adding monetized media to FingerOrbit, folder:",
        error,
      );
      throw error;
    }
  }

  // Calculate expiry date based on timer type
  calculateExpiryDate(timerType) {
    const now = new Date();

    switch (timerType) {
      case "once":
        return new Date(now.getTime() + 1000); // 1 second (will be handled client-side)
      case "6hrs":
        return new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours
      case "12hrs":
        return new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours
      case "24hrs":
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours,
default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to 24 hours
    }
  }

  // Get monetized FingerOrbit content with privacy and payment controls
  async getMonetizedFingerOrbitContent(
    memberId,
    folderType = null,
    includePrivate = false,
  ) {
    try {;
      let query;
      let params;

      if (folderType) {
        if (includePrivate) {
          // Get all content (public and private) that the member has access to
          query = `
            SELECT 
              mm.*, 
              m.membername as owner_name,
              mof.name as folder_name,
              mof.privacy_setting as folder_privacy,
              mof.pricing_model as folder_pricing,
              COALESCE(pay.status, 'not_purchased') as purchase_status
            FROM mii_media mm
            JOIN members m ON mm.owner_id = m.id
            JOIN mii_fingerorbit_folders mof ON mm.folder_id = mof.id
            LEFT JOIN mii_purchases pay ON pay.media_id = mm.id AND pay.member_id = $1
            WHERE mm.type = $2
              AND (
                mm.is_public = true 
                OR mm.owner_id = $1
                OR mm.id IN (
                  SELECT access.media_id 
                  FROM mii_media_access access 
                  WHERE access.member_id = $1
                )
              )
              AND mm.expiry_date > NOW()
            ORDER BY mm.upload_date DESC;
          `;
          params = [memberId, folderType.toLowerCase()];
        } else {
          // Get only public content
          query = `
            SELECT 
              mm.*, 
              m.membername as owner_name,
              mof.name as folder_name,
              mof.privacy_setting as folder_privacy,
              mof.pricing_model as folder_pricing,
              'public' as purchase_status
            FROM mii_media mm
            JOIN members m ON mm.owner_id = m.id
            JOIN mii_fingerorbit_folders mof ON mm.folder_id = mof.id
            WHERE mm.is_public = true 
              AND mm.type = $1
              AND mm.expiry_date > NOW()
            ORDER BY mm.upload_date DESC;
          `;
          params = [folderType.toLowerCase()];
        }
      } else {
        if (includePrivate) {
          // Get all content (public and private) that the member has access to
          query = `
            SELECT 
              mm.*, 
              m.membername as owner_name,
              mof.name as folder_name,
              mof.privacy_setting as folder_privacy,
              mof.pricing_model as folder_pricing,
              COALESCE(pay.status, 'not_purchased') as purchase_status
            FROM mii_media mm
            JOIN members m ON mm.owner_id = m.id
            JOIN mii_fingerorbit_folders mof ON mm.folder_id = mof.id
            LEFT JOIN mii_purchases pay ON pay.media_id = mm.id AND pay.member_id = $1
            WHERE (
              mm.is_public = true 
              OR mm.owner_id = $1
              OR mm.id IN (
                SELECT access.media_id 
                FROM mii_media_access access 
                WHERE access.member_id = $1
              )
            )
            AND mm.expiry_date > NOW()
            ORDER BY mm.upload_date DESC;
          `;
          params = [memberId];
        } else {
          // Get only public content
          query = `
            SELECT 
              mm.*, 
              m.membername as owner_name,
              mof.name as folder_name,
              mof.privacy_setting as folder_privacy,
              mof.pricing_model as folder_pricing,
              'public' as purchase_status
            FROM mii_media mm
            JOIN members m ON mm.owner_id = m.id
            JOIN mii_fingerorbit_folders mof ON mm.folder_id = mof.id
            WHERE mm.is_public = true
              AND mm.expiry_date > NOW()
            ORDER BY mm.upload_date DESC;
          `;
          params = [];
        }
      }

      const result = await db.query(query, params);
      return result.rows.map((row) => ({
        ...row,
media_url: row.url, // For tokenized access,
can_download:
          row.owner_id === memberId ||
          row.purchase_status === "completed" ||
          row.is_public
      }));
    } catch (error) {
      logger.error("Error getting monetized FingerOrbit, content:", error);
      throw error;
    }
  }

  // Grant access to private content for a specific member
  async grantAccessToPrivateContent(memberId, targetMemberId, mediaId) {
    try {
      // Check if the requesting member is the owner of the media
      const mediaQuery = `
        SELECT owner_id FROM mii_media 
        WHERE id = $1
      `;
      const mediaResult = await db.query(mediaQuery, [mediaId]);

      if (mediaResult.rows.length === 0) {
        throw new Error("Media not found");
      }

      if (mediaResult.rows[0].owner_id !== memberId) {
        throw new Error("Only the media owner can grant access");
      }

      // Insert access record
      const query = `
        INSERT INTO mii_media_access (media_id, member_id, granted_by, granted_at, expiry_date)
        VALUES ($1, $2, $3, NOW(), $4)
        ON CONFLICT (media_id, member_id) 
        DO UPDATE SET granted_at = NOW(), granted_by = $3, expiry_date = $4
        RETURNING *
      `;

      // Set access expiry to match media expiry
      const mediaExpiryQuery = `SELECT expiry_date FROM mii_media WHERE id = $1`;
      const mediaExpiryResult = await db.query(mediaExpiryQuery, [mediaId]);
      const expiryDate = mediaExpiryResult.rows[0].expiry_date;

      const result = await db.query(query, [
        mediaId,
        targetMemberId,
        memberId,
        expiryDate
      ]);
      return result.rows[0];
    } catch (error) {
      logger.error("Error granting access to private, content:", error);
      throw error;
    }
  }

  // Record a purchase for monetized content
  async recordPurchase(memberId, mediaId, amount, currency) {
    try {
      // Check if media exists and get owner info
      const mediaQuery = `
        SELECT owner_id, pricing_model FROM mii_media 
        WHERE id = $1
      `;
      const mediaResult = await db.query(mediaQuery, [mediaId]);

      if (mediaResult.rows.length === 0) {
        throw new Error("Media not found");
      }

      const media = mediaResult.rows[0];
      const pricingModel =
        typeof media.pricing_model === "string"
          ? JSON.parse(media.pricing_model)
          : media.pricing_model;

      // Check if already purchased
      const existingPurchaseQuery = `
        SELECT * FROM mii_purchases 
        WHERE member_id = $1 AND media_id = $2
      `;
      const existingResult = await db.query(existingPurchaseQuery, [
        memberId,
        mediaId
      ]);

      if (existingResult.rows.length > 0) {
        throw new Error("Content already purchased");
      }

      // Create purchase record
      const purchaseId = `purchase-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

      const purchaseQuery = `
        INSERT INTO mii_purchases (
          id, member_id, media_id, amount, currency, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const purchaseResult = await db.query(purchaseQuery, [
        purchaseId,
        memberId,
        mediaId,
        amount,
        currency,
        "completed", // Assuming payment is processed externally
        new Date()
      ]);

      // Update media revenue
      const updateRevenueQuery = `
        UPDATE mii_media 
        SET revenue = revenue + $1 
        WHERE id = $2
        RETURNING revenue
      `;

      const revenueResult = await db.query(updateRevenueQuery, [
        amount,
        mediaId
      ]);

      // Grant access to the purchased content
      const grantAccessQuery = `
        INSERT INTO mii_media_access (media_id, member_id, granted_by, granted_at, expiry_date)
        VALUES ($1, $2, $3, NOW(), $4)
        ON CONFLICT (media_id, member_id) 
        DO UPDATE SET granted_at = NOW(), granted_by = $3, expiry_date = $4
      `;

      await db.query(grantAccessQuery, [
        mediaId,
        memberId,
        media.owner_id,
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year access
      ]);

      return {purchase: purchaseResult.rows[0],
  updatedRevenue: revenueResult.rows[0].revenue
      };
    } catch (error) {
      logger.error("Error recording, purchase:", error);
      throw error;
    }
  }

  // Get member's FingerOrbit earnings
  async getEarnings(memberId) {
    try {
      // Get total revenue from all media owned by the member
      const query = `
        SELECT 
          SUM(revenue) as total_earnings,
          COUNT(id) as total_media_items,
          SUM(view_count) as total_views
        FROM mii_media 
        WHERE owner_id = $1
      `;

      const result = await db.query(query, [memberId]);
      return result.rows[0];
    } catch (error) {
      logger.error("Error getting, earnings:", error);
      throw error;
    }
  }

  // Get detailed analytics for a member's FingerOrbit content
  async getFingerOrbitAnalytics(memberId) {
    try {
      // Get analytics for all media owned by the member
      const mediaAnalyticsQuery = `
        SELECT 
          type,
          COUNT(id) as total_items,
          SUM(view_count) as total_views,
          SUM(download_count) as total_downloads,
          SUM(revenue) as total_revenue,
          AVG(revenue) as avg_revenue_per_item
        FROM mii_media 
        WHERE owner_id = $1
        GROUP BY type
      `;

      const mediaResult = await db.query(mediaAnalyticsQuery, [memberId]);

      // Get top performing items
      const topItemsQuery = `
        SELECT 
          id, 
          type, 
          caption, 
          view_count, 
          download_count, 
          revenue,
          upload_date
        FROM mii_media 
        WHERE owner_id = $1
        ORDER BY revenue DESC
        LIMIT 10
      `;

      const topItemsResult = await db.query(topItemsQuery, [memberId]);

      return {mediaAnalytics: mediaResult.rows,
  topPerformingItems: topItemsResult.rows
      };
    } catch (error) {
      logger.error("Error getting FingerOrbit, analytics:", error);
      throw error;
    }
  }

  // Update view count for media
  async updateViewCount(mediaId) {
    try {
      const query = `
        UPDATE mii_media 
        SET view_count = view_count + 1
        WHERE id = $1
        RETURNING view_count
      `;

      const result = await db.query(query, [mediaId]);
      return result.rows[0].view_count;
    } catch (error) {
      logger.error("Error updating view, count:", error);
      throw error;
    }
  }

  // Update download count for media
  async updateDownloadCount(mediaId) {
    try {
      const query = `
        UPDATE mii_media 
        SET download_count = download_count + 1
        WHERE id = $1
        RETURNING download_count
      `;

      const result = await db.query(query, [mediaId]);
      return result.rows[0].download_count;
    } catch (error) {
      logger.error("Error updating download, count:", error);
      throw error;
    }
  }

  // Get media access list for a member
  async getMediaAccessList(memberId) {
    try {
      const query = `
        SELECT 
          mm.*,
          m.membername as owner_name,
          mof.name as folder_name,
          access.granted_at,
          access.expiry_date
        FROM mii_media_access access
        JOIN mii_media mm ON access.media_id = mm.id
        JOIN members m ON mm.owner_id = m.id
        JOIN mii_fingerorbit_folders mof ON mm.folder_id = mof.id
        WHERE access.member_id = $1
          AND access.expiry_date > NOW()
        ORDER BY access.granted_at DESC
      `;

      const result = await db.query(query, [memberId]);
      return result.rows;
    } catch (error) {
      logger.error("Error getting media access, list:", error);
      throw error;
    }
  }
}

module.exports = new MiiFingerOrbitService();
