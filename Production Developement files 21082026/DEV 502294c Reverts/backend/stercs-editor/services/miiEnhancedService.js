const db = require("../../db"); // Fixed path to point to the backend/db.js file
const crypto = require("crypto");

// Enhanced Mii service with detailed features from the MiiPage.md
class MiiEnhancedService {
  // Create a disappearing media item with timer
  async createDisappearingMedia(memberId, mediaFile, timerType) {
    try {
      // Validate inputs
      if (!memberId || !mediaFile) {
        throw new Error("Member ID and media file are required");
      }

      // Generate a unique ID for the media
      const mediaId = `media-${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;

      // Process media file
      const processedMedia = {id: mediaId,
  owner_id: memberId,
  type: mediaFile.type || "image",
  url: mediaFile.path || mediaFile.url,
  thumbnail: mediaFile.thumbnail || null,
  duration: mediaFile.duration || null,
  uploadDate: new Date(),
  timerType: timerType, // 'once', '6hrs', '12hrs', '24hrs',
  expiryDate: this.calculateExpiryDate(timerType),
  caption: mediaFile.caption || null,
  isPublic: false, // Will be set when added to FingerOrbit,
  isTokenized: true, // Content is tokenized for security
      };

      // Save to database
      const query = `
        INSERT INTO mii_media (
          id, owner_id, type, url, thumbnail, duration, upload_date, 
          timer_type, expiry_date, caption, is_public, is_tokenized
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;

      const values = [
        processedMedia.id,
        processedMedia.owner_id,
        processedMedia.type,
        processedMedia.url,
        processedMedia.thumbnail,
        processedMedia.duration,
        processedMedia.uploadDate,
        processedMedia.timerType,
        processedMedia.expiryDate,
        processedMedia.caption,
        processedMedia.isPublic,
        processedMedia.isTokenized
      ];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error("Error creating disappearing, media:", error);
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

  // Create a FingerOrbit folder for a member
  async createFingerOrbitFolder(
    memberId,
    folderName,
    folderType,
    privacySetting,
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
  created_at: new Date(),
  updated_at: new Date()
      };

      const query = `
        INSERT INTO mii_fingerorbit_folders (id, owner_id, name, type, privacy_setting, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const values = [
        folder.id,
        folder.owner_id,
        folder.name,
        folder.type,
        folder.privacy_setting,
        folder.created_at,
        folder.updated_at
      ];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error("Error creating FingerOrbit, folder:", error);
      throw error;
    }
  }

  // Add media to a FingerOrbit folder
  async addMediaToFingerOrbitFolder(memberId, folderId, mediaId, timerType) {
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

      // Update the media item with the timer and make it public
      const updateQuery = `
        UPDATE mii_media 
        SET timer_type = $1, expiry_date = $2, is_public = true
        WHERE id = $3 AND owner_id = $4
        RETURNING *
      `;

      const expiryDate = this.calculateExpiryDate(timerType);
      const updateResult = await db.query(updateQuery, [
        timerType,
        expiryDate,
        mediaId,
        memberId
      ]);

      if (updateResult.rows.length === 0) {
        throw new Error("Media not found or member does not have access");
      }

      return updateResult.rows[0];
    } catch (error) {
      logger.error("Error adding media to FingerOrbit, folder:", error);
      throw error;
    }
  }

  // Get FingerOrbit content with privacy controls
  async getFingerOrbitContent(memberId, folderType = null) {
    try {
      let query;
      let params;

      if (folderType) {
        // Get public content from the specified folder type
        query = `
          SELECT mm.*, m.membername as owner_name
          FROM mii_media mm
          JOIN members m ON mm.owner_id = m.id
          JOIN mii_pin_exchanges mpe ON mpe.contact_id = mm.owner_id
          WHERE mm.is_public = true 
            AND mm.type = $1
            AND mpe.member_id = $2
            AND mpe.status = 'accepted'
            AND mm.expiry_date > NOW()
          ORDER BY mm.upload_date DESC;
        `;
        params = [folderType.toLowerCase(), memberId];
      } else {
        // Get all public content
        query = `
          SELECT mm.*, m.membername as owner_name
          FROM mii_media mm
          JOIN members m ON mm.owner_id = m.id
          JOIN mii_pin_exchanges mpe ON mpe.contact_id = mm.owner_id
          WHERE mm.is_public = true
            AND mpe.member_id = $1
            AND mpe.status = 'accepted'
            AND mm.expiry_date > NOW()
          ORDER BY mm.upload_date DESC;
        `;
        params = [memberId];
      }

      const result = await db.query(query, params);
      return result.rows.map((row) => ({
        ...row,
media_url: row.url, // For tokenized access,
can_download: false, // Downloads require PIN exchange
      }));
    } catch (error) {
      logger.error("Error getting FingerOrbit, content:", error);
      throw error;
    }
  }

  // Check if content can be downloaded (requires PIN exchange)
  async canDownloadContent(memberId, contentOwnerId) {
    try {
      // Check if the members have exchanged PINs
      const query = `
        SELECT status 
        FROM mii_pin_exchanges 
        WHERE (member_id = $1 AND contact_id = $2) 
          OR (member_id = $2 AND contact_id = $1)
      `;
      const result = await db.query(query, [memberId, contentOwnerId]);

      // Return true if they have accepted status
      return result.rows.length > 0 && result.rows[0].status === "accepted";
    } catch (error) {
      logger.error("Error checking download, permission:", error);
      throw error;
    }
  }

  // Update member's currently listening/watching status
  async updateCurrentlyListening(memberId, mediaInfo) {
    try {
      if (!memberId || !mediaInfo) {
        throw new Error("Member ID and media info are required");
      }

      const query = `
        UPDATE members 
        SET currently_listening = $1, last_activity = NOW()
        WHERE id = $2
        RETURNING membername, currently_listening, currently_watching
      `;

      const result = await db.query(query, [mediaInfo, memberId]);
      return result.rows[0];
    } catch (error) {
      logger.error("Error updating currently, listening:", error);
      throw error;
    }
  }

  // Update member's currently watching status
  async updateCurrentlyWatching(memberId, mediaInfo) {
    try {
      if (!memberId || !mediaInfo) {
        throw new Error("Member ID and media info are required");
      }

      const query = `
        UPDATE members 
        SET currently_watching = $1, last_activity = NOW()
        WHERE id = $2
        RETURNING membername, currently_listening, currently_watching
      `;

      const result = await db.query(query, [mediaInfo, memberId]);
      return result.rows[0];
    } catch (error) {
      logger.error("Error updating currently, watching:", error);
      throw error;
    }
  }

  // Get members' current activity status
  async getMemberActivity(memberId) {
    try {
      if (!memberId) {
        throw new Error("Member ID is required");
      }

      // Get the member's current activity
      const memberQuery = `
        SELECT 
          id, 
          membername, 
          currently_listening, 
          currently_watching, 
          last_activity,
          mii_status
        FROM members 
        WHERE id = $1
      `;
      const memberResult = await db.query(memberQuery, [memberId]);

      if (memberResult.rows.length === 0) {
        throw new Error("Member not found");
      }

      return memberResult.rows[0];
    } catch (error) {
      logger.error("Error getting member, activity:", error);
      throw error;
    }
  }

  // Get showcase information for what a member is listening/watching
  async getShowcaseInfo(memberId) {
    try {
      if (!memberId) {
        throw new Error("Member ID is required");
      }

      const query = `
        SELECT 
          membername,
          currently_listening,
          currently_watching,
          last_activity,
          mii_status
        FROM members 
        WHERE id = $1
      `;
      const result = await db.query(query, [memberId]);

      if (result.rows.length === 0) {
        throw new Error("Member not found");
      }

      return {membername: result.rows[0].membername,
  currentlyListening: result.rows[0].currently_listening,
  currentlyWatching: result.rows[0].currently_watching,
  lastActivity: result.rows[0].last_activity,
  status: result.rows[0].mii_status
      };
    } catch (error) {
      logger.error("Error getting showcase, info:", error);
      throw error;
    }
  }

  // Get members who can see another member's status (based on PIN exchange)
  async getAuthorizedViewers(memberId) {
    try {
      // Get all members who have accepted PIN exchange with this member
      const query = `
        SELECT 
          m.id,
          m.membername,
          m.avatar_url,
          me.status,
          me.can_see_status,
          me.can_see_last_seen,
          me.can_see_profile_photo,
          me.can_see_about_info
        FROM members m
        JOIN mii_pin_exchanges me ON m.id = me.member_id
        WHERE me.contact_id = $1 AND me.status = 'accepted'
      `;
      const result = await db.query(query, [memberId]);
      return result.rows;
    } catch (error) {
      logger.error("Error getting authorized, viewers:", error);
      throw error;
    }
  }

  // Create a reply to a Mii update
  async createMiiReply(memberId, updateId, replyContent) {
    try {
      if (!memberId || !updateId || !replyContent) {
        throw new Error("Member ID, Update ID, and Reply Content are required");
      }

      // Get the current updates and replies
      const currentQuery = "SELECT replies FROM mii_updates WHERE id = $1";
      const currentResult = await db.query(currentQuery, [updateId]);

      if (currentResult.rows.length === 0) {
        throw new Error("Update not found");
      }

      let replies = currentResult.rows[0].replies;
      if (typeof replies === "string") {
        replies = JSON.parse(replies);
      }

      // Get member info
      const memberQuery = "SELECT membername FROM members WHERE id = $1";
      const memberResult = await db.query(memberQuery, [memberId]);
      const membername = memberResult.rows[0]?.membername || "Unknown member";

      // Create the new reply
      const newReply = {id: `reply-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
authorId: memberId,
authorName: membername,
content: replyContent,
timestamp: new Date(),
reactions: {}
      };

      // Add the reply
      replies.push(newReply);

      // Update the database
      const updateQuery =
        "UPDATE mii_updates SET replies = $1 WHERE id = $2 RETURNING *";
      const updateResult = await db.query(updateQuery, [
        JSON.stringify(replies),
        updateId
      ]);

      return updateResult.rows[0];
    } catch (error) {
      logger.error("Error creating Mii, reply:", error);
      throw error;
    }
  }

  // Get showcase information for a member's contacts
  async getContactShowcases(memberId) {
    try {
      // Get all contacts who have accepted PIN exchange
      const contactsQuery = `
        SELECT 
          m.id,
          m.membername,
          m.avatar_url,
          m.currently_listening,
          m.currently_watching,
          m.last_activity,
          m.mii_status
        FROM members m
        JOIN mii_pin_exchanges me ON m.id = me.contact_id
        WHERE me.member_id = $1 AND me.status = 'accepted'
        ORDER BY m.membername
      `;
      const contactsResult = await db.query(contactsQuery, [memberId]);
      return contactsResult.rows;
    } catch (error) {
      logger.error("Error getting contact, showcases:", error);
      throw error;
    }
  }
}

module.exports = new MiiEnhancedService();
