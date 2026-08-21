const db = require("../../db"); // Fixed path to point to the backend/db.js file
const crypto = require("crypto");

// Service for Mii functionality
class MiiService {
  // Create a new Mii update
  async createMiiUpdate(memberId, content, mediaFiles, privacySettings) {
    try {
      // Validate inputs
      if (!memberId) {
        throw new Error("Member ID is required");
      }

      // Generate a unique ID for the update
      const updateId = `mii-${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;

      // Process media files if provided
      const processedMedia = mediaFiles
        ? mediaFiles.map((file) => ({id: `media-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
type: file.type || "image",
url: file.path || file.url,
thumbnail: file.thumbnail || null,
duration: file.duration || null,
uploadDate: new Date(),
expiryDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now,
caption: file.caption || null
          }))
        : [];

      // Prepare the update object
      const miiUpdate = {id: updateId,
  authorId: memberId,
  content: content || "",
  media: processedMedia,
  timestamp: new Date(),
  reactions: {},
replies: [],
mentions: [],
privacySettings: privacySettings || {visibility: "contacts",
  excludedContacts: [],
  includedContacts: []
        },
isViewed: false
      };

      // Save to database
      const query = `
        INSERT INTO mii_updates (
          id, author_id, content, media_data, timestamp, reactions, replies, 
          mentions, privacy_settings, is_viewed
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const values = [
        miiUpdate.id,
        miiUpdate.authorId,
        miiUpdate.content,
        JSON.stringify(miiUpdate.media),
        miiUpdate.timestamp,
        JSON.stringify(miiUpdate.reactions),
        JSON.stringify(miiUpdate.replies),
        JSON.stringify(miiUpdate.mentions),
        JSON.stringify(miiUpdate.privacySettings),
        miiUpdate.isViewed
      ];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error("Error creating Mii, update:", error);
      throw error;
    }
  }

  // Get Mii updates for a member
  async getMiiUpdates(memberId, limit = 20, offset = 0) {
    try {
      if (!memberId) {
        throw new Error("Member ID is required");
      }

      // Query to get updates from contacts with proper privacy controls
      const query = `
        SELECT 
          mu.*,
          m.membername as author_membername,
          m.avatar_url as author_avatar
        FROM mii_updates mu
        JOIN members m ON mu.author_id = m.id
        WHERE 
          mu.author_id IN (
            -- Get contacts who have mutual pin exchange
            SELECT contact_id FROM mii_pin_exchanges 
            WHERE member_id = $1 AND status = 'accepted'
            UNION
            -- Also include own updates
            SELECT $1
          )
          AND (
            mu.privacy_settings->>'visibility' = 'public' 
            OR (
              mu.privacy_settings->>'visibility' = 'contacts' 
              AND mu.author_id IN (
                SELECT contact_id FROM mii_pin_exchanges 
                WHERE member_id = $1 AND status = 'accepted'
              )
            )
            OR (
              mu.privacy_settings->>'visibility' = 'custom'
              AND mu.id NOT IN (
                SELECT unnest(string_to_array(mu.privacy_settings->>'excludedContacts', ','))
              )
            )
          )
          AND mu.timestamp > NOW() - INTERVAL '48 hours'  -- Only show updates less than 48 hours old
        ORDER BY mu.timestamp DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await db.query(query, [memberId, limit, offset]);
      return result.rows.map((row) => ({
        ...row,
media:
          typeof row.media_data === "string"
            ? JSON.parse(row.media_data)
            : row.media_data,
reactions:
          typeof row.reactions === "string"
            ? JSON.parse(row.reactions)
            : row.reactions,
replies:
          typeof row.replies === "string"
            ? JSON.parse(row.replies)
            : row.replies,
mentions:
          typeof row.mentions === "string"
            ? JSON.parse(row.mentions)
            : row.mentions,
privacySettings:
          typeof row.privacy_settings === "string"
            ? JSON.parse(row.privacy_settings)
            : row.privacy_settings
      }));
    } catch (error) {
      logger.error("Error getting Mii, updates:", error);
      throw error;
    }
  }

  // Add a reaction to a Mii update
  async addReactionToMiiUpdate(memberId, updateId, emoji) {
    try {
      if (!memberId || !updateId || !emoji) {
        throw new Error("Member ID, Update ID, and Emoji are required");
      }

      // First, get the current reactions
      const currentQuery = "SELECT reactions FROM mii_updates WHERE id = $1";
      const currentResult = await db.query(currentQuery, [updateId]);

      if (currentResult.rows.length === 0) {
        throw new Error("Update not found");
      }

      let reactions = currentResult.rows[0].reactions;
      if (typeof reactions === "string") {
        reactions = JSON.parse(reactions);
      }

      // Add the reaction
      if (!reactions[emoji]) {
        reactions[emoji] = [];
      }

      if (!reactions[emoji].includes(memberId)) {
        reactions[emoji].push(memberId);
      }

      // Update the database
      const updateQuery =
        "UPDATE mii_updates SET reactions = $1 WHERE id = $2 RETURNING *";
      const updateResult = await db.query(updateQuery, [
        JSON.stringify(reactions),
        updateId
      ]);

      return updateResult.rows[0];
    } catch (error) {
      logger.error("Error adding reaction to Mii, update:", error);
      throw error;
    }
  }

  // Add a reply to a Mii update
  async addReplyToMiiUpdate(memberId, updateId, replyContent) {
    try {
      if (!memberId || !updateId || !replyContent) {
        throw new Error("Member ID, Update ID, and Reply Content are required");
      }

      // Get current replies
      const currentQuery = "SELECT replies FROM mii_updates WHERE id = $1";
      const currentResult = await db.query(currentQuery, [updateId]);

      if (currentResult.rows.length === 0) {
        throw new Error("Update not found");
      }

      let replies = currentResult.rows[0].replies;
      if (typeof replies === "string") {
        replies = JSON.parse(replies);
      }

      // Create the new reply
      const newReply = {id: `reply-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
authorId: memberId,
authorName: await this.getmembername(memberId), // Helper to get member name,
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
      logger.error("Error adding reply to Mii, update:", error);
      throw error;
    }
  }

  // Helper to get member name
  async getmembername(memberId) {
    try {
      const query = "SELECT membername FROM members WHERE id = $1";
      const result = await db.query(query, [memberId]);
      return result.rows[0]?.membername || "Unknown Member";
    } catch (error) {
      logger.error("Error getting member, name:", error);
      return "Unknown member";
    }
  }

  // Exchange Mii PINs
  async exchangeMiiPin(memberId, contactPin) {
    try {
      if (!memberId || !contactPin) {
        throw new Error("Member ID and Contact PIN are required");
      }

      // Find the contact by their PIN
      const contactQuery = "SELECT id FROM members WHERE mii_pin = $1";
      const contactResult = await db.query(contactQuery, [contactPin]);

      if (contactResult.rows.length === 0) {
        throw new Error("Contact with this PIN not found");
      }

      const contactId = contactResult.rows[0].id;

      // Check if an exchange already exists
      const checkQuery = `
        SELECT id FROM mii_pin_exchanges 
        WHERE (member_id = $1 AND contact_id = $2) OR (member_id = $2 AND contact_id = $1)
      `;
      const checkResult = await db.query(checkQuery, [memberId, contactId]);

      if (checkResult.rows.length > 0) {
        // Update existing exchange to accepted status
        const updateQuery = `
          UPDATE mii_pin_exchanges 
          SET status = 'accepted', updated_at = NOW()
          WHERE (member_id = $1 AND contact_id = $2) OR (member_id = $2 AND contact_id = $1)
          RETURNING *
        `;
        const updateResult = await db.query(updateQuery, [memberId, contactId]);
        return updateResult.rows[0];
      } else {
        // Create new exchange entries for both directions
        const insertQuery = `
          INSERT INTO mii_pin_exchanges (member_id, contact_id, status) 
          VALUES 
            ($1, $2, 'accepted'),
            ($2, $1, 'pending_notification')  -- The other member gets a notification
          RETURNING *
        `;
        const insertResult = await db.query(insertQuery, [memberId, contactId]);

        // Return the exchange for the initiating member
        return insertResult.rows.find((row) => row.member_id === memberId);
      }
    } catch (error) {
      logger.error("Error exchanging Mii, PIN:", error);
      throw error;
    }
  }

  // Create a Mii folder
  async createMiiFolder(memberId, folderName, folderType, visibilityTimer) {
    try {
      if (!memberId || !folderName || !folderType || !visibilityTimer) {
        throw new Error("All folder parameters are required");
      }

      const folderId = `folder-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

      const folder = {id: folderId,
  owner_id: memberId,
  name: folderName,
  type: folderType, // 'Video' or 'Image',
  visibility_timer: visibilityTimer, // 'once', '6hrs', '12hrs', '24hrs', '48hrs',
  content: [],
  created_at: new Date(),
  updated_at: new Date()
      };

      const query = `
        INSERT INTO mii_folders (id, owner_id, name, type, visibility_timer, content, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      const values = [
        folder.id,
        folder.owner_id,
        folder.name,
        folder.type,
        folder.visibility_timer,
        JSON.stringify(folder.content),
        folder.created_at,
        folder.updated_at
      ];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error("Error creating Mii, folder:", error);
      throw error;
    }
  }

  // Get a member's Mii profile
  async getMiiProfile(memberId) {
    try {
      if (!memberId) {
        throw new Error("Member ID is required");
      }

      // Get member info
      const memberQuery = `
        SELECT id, membername, avatar_url, bio, mii_pin 
        FROM members 
        WHERE id = $1
      `;
      const memberResult = await db.query(memberQuery, [memberId]);

      if (memberResult.rows.length === 0) {
        throw new Error("Member not found");
      }

      const member = memberResult.rows[0];

      // Get follower/following counts
      const followerQuery = `
        SELECT COUNT(*) as count 
        FROM mii_pin_exchanges 
        WHERE contact_id = $1 AND status = 'accepted'
      `;
      const followingQuery = `
        SELECT COUNT(*) as count 
        FROM mii_pin_exchanges 
        WHERE member_id = $1 AND status = 'accepted'
      `;

      const [followerResult, followingResult] = await Promise.all([
        db.query(followerQuery, [memberId]),
        db.query(followingQuery, [memberId])
      ]);

      // Get recent Mii updates
      const updates = await this.getMiiUpdates(memberId, 10, 0);

      // Get Mii folders
      const foldersQuery = `
        SELECT * FROM mii_folders 
        WHERE owner_id = $1 
        ORDER BY created_at DESC
      `;
      const foldersResult = await db.query(foldersQuery, [memberId]);
      const folders = foldersResult.rows.map((row) => ({
        ...row,
content:
          typeof row.content === "string"
            ? JSON.parse(row.content)
            : row.content
      }));

      // Get contacts with Mii access
      const contactsQuery = `
        SELECT 
          m.id, 
          m.membername, 
          m.avatar_url,
          m.last_seen,
          me.status as mii_access_status,
          me.created_at as connection_date
        FROM members m
        JOIN mii_pin_exchanges me ON m.id = me.contact_id
        WHERE me.member_id = $1
        ORDER BY me.created_at DESC
      `;
      const contactsResult = await db.query(contactsQuery, [memberId]);
      const contacts = contactsResult.rows.map((contact) => ({
        ...contact,
hasMiiAccess: contact.mii_access_status === "accepted"
      }));

      return {id: member.id,
  name: member.membername,
  avatar: member.avatar_url,
  bio: member.bio,
  followers: parseInt(followerResult.rows[0].count),
  following: parseInt(followingResult.rows[0].count),
  miiUpdates: updates,
  folders,
  contacts,
  miiPin: member.mii_pin,
  hasExchangedPins: true, // Since we're looking at own profile
      };
    } catch (error) {
      logger.error("Error getting Mii, profile:", error);
      throw error;
    }
  }

  // Get contacts for Mii
  async getMiiContacts(memberId) {
    try {
      if (!memberId) {
        throw new Error("Member ID is required");
      }

      const query = `
        SELECT 
          m.id,
          m.membername,
          m.avatar_url,
          m.last_seen,
          m.currently_listening,
          m.currently_watching,
          COALESCE(me.status, 'none') as mii_access_status
        FROM members m
        LEFT JOIN mii_pin_exchanges me ON m.id = me.contact_id AND me.member_id = $1
        WHERE m.id != $1
        ORDER BY 
          CASE WHEN me.status = 'accepted' THEN 1
               WHEN me.status = 'pending' THEN 2
               ELSE 3 END,
          m.membername
      `;

      const result = await db.query(query, [memberId]);
      return result.rows.map((contact) => ({
        ...contact,
hasMiiAccess: contact.mii_access_status === "accepted",
isFollowing: contact.mii_access_status !== "none"
      }));
    } catch (error) {
      logger.error("Error getting Mii, contacts:", error);
      throw error;
    }
  }
}

module.exports = new MiiService();
