/**
 * Database Configuration for Lush Pressies App
 * Sets up database connections and common database operations
 */

const { Pool } = require('pg'); // Using PostgreSQL as an example
require('dotenv').config();

// Database connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'lush_pressies_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully');
  }
});

// Common database operations for the Lush Pressies app
const dbOperations = {
  // User operations
  getUser: async (userId) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0];
  },

  getUserByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  createUser: async (userData) => {
    const { id, email, username, firstName, lastName, password_hash, avatar, bio, location } = userData;
    const result = await pool.query(
      'INSERT INTO users(id, email, username, first_name, last_name, password_hash, avatar, bio, location, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING *',
      [id, email, username, firstName, lastName, password_hash, avatar, bio, location]
    );
    return result.rows[0];
  },

  updateUser: async (userId, updateData) => {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    
    const result = await pool.query(
      `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $$${fields.length + 1} RETURNING *`,
      [...values, userId]
    );
    return result.rows[0];
  },

  // Privacy-controlled content operations
  createPrivacyControlledContent: async (contentData) => {
    const { userId, content, privacySettings } = contentData;
    const result = await pool.query(
      'INSERT INTO privacy_controlled_content(user_id, content, privacy_settings, created_at) VALUES($1, $2, $3, NOW()) RETURNING *',
      [userId, content, privacySettings]
    );
    return result.rows[0];
  },

  getPrivacyControlledContent: async (contentId) => {
    const result = await pool.query(
      'SELECT * FROM privacy_controlled_content WHERE id = $1', 
      [contentId]
    );
    return result.rows[0];
  },

  // Content access PIN operations
  storeContentAccessPin: async (contentId, pin, userId) => {
    const result = await pool.query(
      'INSERT INTO content_access_pins(content_id, pin, user_id, created_at) VALUES($1, $2, $3, NOW()) RETURNING *',
      [contentId, pin, userId]
    );
    return result.rows[0];
  },

  validateContentAccessPin: async (contentId, pin) => {
    const result = await pool.query(
      'SELECT * FROM content_access_pins WHERE content_id = $1 AND pin = $2 AND used = FALSE',
      [contentId, pin]
    );
    return result.rows.length > 0;
  },

  // User privacy settings operations
  getUserPrivacySettings: async (userId) => {
    const result = await pool.query(
      'SELECT * FROM user_privacy_settings WHERE user_id = $1',
      [userId]
    );
    return result.rows[0];
  },

  updateUserPrivacySettings: async (userId, settings) => {
    const { profileVisibility, whoCanContact, locationSharing, contentVisibility } = settings;
    const result = await pool.query(`
      INSERT INTO user_privacy_settings(user_id, profile_visibility, who_can_contact, location_sharing, content_visibility, created_at, updated_at)
      VALUES($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        profile_visibility = EXCLUDED.profile_visibility,
        who_can_contact = EXCLUDED.who_can_contact,
        location_sharing = EXCLUDED.location_sharing,
        content_visibility = EXCLUDED.content_visibility,
        updated_at = NOW()
      RETURNING *
    `, [userId, profileVisibility, whoCanContact, locationSharing, contentVisibility]);
    return result.rows[0];
  },

  // User location operations
  updateUserLocation: async (userId, locationData) => {
    const { latitude, longitude, accuracy } = locationData;
    const result = await pool.query(`
      INSERT INTO user_locations(user_id, latitude, longitude, accuracy, updated_at)
      VALUES($1, $2, $3, $4, NOW())
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        accuracy = EXCLUDED.accuracy,
        updated_at = NOW()
      RETURNING *
    `, [userId, latitude, longitude, accuracy]);
    return result.rows[0];
  },

  getUserLocation: async (userId) => {
    const result = await pool.query(
      'SELECT * FROM user_locations WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
      [userId]
    );
    return result.rows[0];
  },

  // User connections/matching operations
  areUsersConnected: async (userAId, userBId) => {
    const result = await pool.query(
      `SELECT * FROM user_connections 
       WHERE (user_a_id = $1 AND user_b_id = $2) OR (user_a_id = $2 AND user_b_id = $1) 
       AND status = 'connected'`,
      [userAId, userBId]
    );
    return result.rows.length > 0;
  },

  areUsersMatched: async (userAId, userBId) => {
    const result = await pool.query(
      `SELECT * FROM matches 
       WHERE (user_a_id = $1 AND user_b_id = $2) OR (user_a_id = $2 AND user_b_id = $1) 
       AND status = 'active'`,
      [userAId, userBId]
    );
    return result.rows.length > 0;
  },

  // User verification operations
  getUserVerification: async (userId, verificationType) => {
    const result = await pool.query(
      'SELECT * FROM user_verifications WHERE user_id = $1 AND type = $2 ORDER BY created_at DESC LIMIT 1',
      [userId, verificationType]
    );
    return result.rows[0];
  },

  // User membership operations
  getUserMembership: async (userId) => {
    const result = await pool.query(
      'SELECT * FROM user_memberships WHERE user_id = $1 AND status = \'active\' ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    return result.rows[0];
  },

  // User credits operations
  getUserCredits: async (userId) => {
    const result = await pool.query(
      'SELECT COALESCE(credits, 0) as credits FROM user_accounts WHERE user_id = $1',
      [userId]
    );
    return result.rows[0]?.credits || 0;
  },

  // Events logging
  createEvent: async (eventData) => {
    const { userId, eventType, properties } = eventData;
    const result = await pool.query(
      'INSERT INTO events(user_id, event_type, properties, timestamp) VALUES($1, $2, $3, $4) RETURNING *',
      [userId, eventType, properties, eventData.timestamp]
    );
    return result.rows[0];
  },

  // Privacy access codes
  createPrivacyAccessCode: async (codeData) => {
    const { code, userId, targetUserId, permissions, expiryDate } = codeData;
    const result = await pool.query(
      'INSERT INTO privacy_access_codes(code, user_id, target_user_id, permissions, expiry_date, created_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      [code, userId, targetUserId, permissions, expiryDate, codeData.createdAt]
    );
    return result.rows[0];
  },

  getPrivacyAccessCode: async (code) => {
    const result = await pool.query(
      'SELECT * FROM privacy_access_codes WHERE code = $1 AND used = FALSE AND expiry_date > NOW()',
      [code]
    );
    return result.rows[0];
  },

  markPrivacyAccessCodeAsUsed: async (codeId) => {
    await pool.query(
      'UPDATE privacy_access_codes SET used = TRUE, used_at = NOW() WHERE id = $1',
      [codeId]
    );
  },

  // User gamification profile
  getGamificationProfile: async (userId) => {
    const result = await pool.query(
      'SELECT * FROM user_gamification_profiles WHERE user_id = $1',
      [userId]
    );
    return result.rows[0];
  },

  createGamificationProfile: async (profileData) => {
    const { userId, level, currentXP, totalXP, streak, longestStreak } = profileData;
    const result = await pool.query(
      'INSERT INTO user_gamification_profiles(user_id, level, current_xp, total_xp, streak, longest_streak, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [userId, level, currentXP, totalXP, streak, longestStreak, profileData.createdAt, profileData.updatedAt]
    );
    return result.rows[0];
  },

  updateGamificationProfile: async (userId, updateData) => {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    
    const result = await pool.query(
      `UPDATE user_gamification_profiles SET ${setClause}, updated_at = NOW() WHERE user_id = $${fields.length + 1} RETURNING *`,
      [...values, userId]
    );
    return result.rows[0];
  },

  // Log XP awards
  logXPAward: async (userId, amount, reason, actionType) => {
    await pool.query(
      'INSERT INTO xp_awards_log(user_id, amount, reason, action_type, awarded_at) VALUES($1, $2, $3, $4, NOW())',
      [userId, amount, reason, actionType]
    );
  },

  // Award achievements
  getUserAchievement: async (userId, achievementId) => {
    const result = await pool.query(
      'SELECT * FROM user_achievements WHERE user_id = $1 AND achievement_id = $2',
      [userId, achievementId]
    );
    return result.rows[0];
  },

  awardAchievement: async (userId, achievementData) => {
    const { achievementId, title, description, points, icon } = achievementData;
    const result = await pool.query(
      'INSERT INTO user_achievements(user_id, achievement_id, title, description, points, icon, awarded_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, achievementId, title, description, points, icon, achievementData.awardedAt]
    );
    return result.rows[0];
  },

  // Get all achievements
  getAllAchievements: async () => {
    const result = await pool.query('SELECT * FROM achievements ORDER BY points DESC');
    return result.rows;
  },

  // Get user achievements
  getUserAchievements: async (userId) => {
    const result = await pool.query(
      'SELECT * FROM user_achievements WHERE user_id = $1 ORDER BY awarded_at DESC',
      [userId]
    );
    return result.rows;
  },

  // Get user badges
  getUserBadges: async (userId) => {
    const result = await pool.query(
      'SELECT * FROM user_badges WHERE user_id = $1 ORDER BY awarded_at DESC',
      [userId]
    );
    return result.rows;
  },

  // Add badge to user
  addBadgeToUser: async (userId, badgeName) => {
    await pool.query(
      'INSERT INTO user_badges(user_id, badge_name, awarded_at) VALUES($1, $2, NOW()) ON CONFLICT DO NOTHING',
      [userId, badgeName]
    );
  },

  // Grant feature access
  grantFeatureAccess: async (userId, featureName) => {
    await pool.query(
      'INSERT INTO user_features(user_id, feature_name, granted_at) VALUES($1, $2, NOW()) ON CONFLICT DO NOTHING',
      [userId, featureName]
    );
  },

  // Get leaderboard
  getLeaderboard: async (limit, offset, sortBy) => {
    const orderBy = sortBy === 'xp' ? 'total_xp' : 'level';
    const result = await pool.query(
      `SELECT u.username, u.first_name, u.last_name, u.avatar, gp.level, gp.total_xp 
       FROM user_gamification_profiles gp
       JOIN users u ON gp.user_id = u.id
       ORDER BY gp.${orderBy} DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  // Award gamification points
  awardGamificationPoints: async (userId, points, reason) => {
    const profile = await this.getGamificationProfile(userId);
    if (profile) {
      const newTotalXP = profile.total_xp + points;
      const newCurrentXP = profile.current_xp + points;
      
      // Check for level up (simple implementation)
      const newXpForNextLevel = 100 * profile.level; // Each level requires 100 * level XP
      let newLevel = profile.level;
      let remainingXP = newCurrentXP;
      
      while (remainingXP >= newXpForNextLevel) {
        remainingXP -= newXpForNextLevel;
        newLevel++;
      }
      
      await this.updateGamificationProfile(userId, {
        total_xp: newTotalXP,
        current_xp: remainingXP,
        level: newLevel
      });
    } else {
      await this.createGamificationProfile({
        user_id: userId,
        level: 1,
        current_xp: points,
        total_xp: points,
        streak: 0,
        longest_streak: 0,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    
    // Log the XP award
    await this.logXPAward(userId, points, reason, 'gamification');
  },

  // Get user behavior data
  getUserBehaviorData: async (userId) => {
    // This would aggregate various behavioral data from different tables
    const interactions = await pool.query(
      'SELECT COUNT(*) as total_interactions FROM user_interactions WHERE user_id = $1',
      [userId]
    );
    
    const messages = await pool.query(
      'SELECT COUNT(*) as total_messages FROM messages WHERE sender_id = $1',
      [userId]
    );
    
    const profileViews = await pool.query(
      'SELECT COUNT(*) as profile_views FROM profile_views WHERE viewed_user_id = $1',
      [userId]
    );
    
    return {
      total_interactions: parseInt(interactions.rows[0].total_interactions),
      total_messages: parseInt(messages.rows[0].total_messages),
      profile_views: parseInt(profileViews.rows[0].profile_views),
      avg_response_time: 0, // Would calculate from message timestamps
      message_frequency: 0, // Would calculate from message timestamps
      content_sentiment: 0.5 // Placeholder for sentiment analysis
    };
  },

  // Get personality profile
  getPersonalityProfile: async (userId) => {
    const result = await pool.query(
      'SELECT * FROM user_personality_profiles WHERE user_id = $1 ORDER BY analyzed_at DESC LIMIT 1',
      [userId]
    );
    return result.rows[0];
  },

  // Save personality profile
  savePersonalityProfile: async (userId, profileData) => {
    const { traits, dominantTraits, confidence } = profileData;
    const result = await pool.query(`
      INSERT INTO user_personality_profiles(user_id, traits, dominant_traits, confidence, analyzed_at)
      VALUES($1, $2, $3, $4, $5)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        traits = EXCLUDED.traits,
        dominant_traits = EXCLUDED.dominant_traits,
        confidence = EXCLUDED.confidence,
        analyzed_at = EXCLUDED.analyzed_at
      RETURNING *
    `, [userId, traits, dominantTraits, confidence, profileData.analyzedAt]);
    return result.rows[0];
  },

  // Get shared interests
  getSharedInterests: async (userAId, userBId) => {
    const userA = await this.getUser(userAId);
    const userB = await this.getUser(userBId);
    
    if (!userA?.interests || !userB?.interests) return [];
    
    const userAInterests = Array.isArray(userA.interests) ? userA.interests : JSON.parse(userA.interests || '[]');
    const userBInterests = Array.isArray(userB.interests) ? userB.interests : JSON.parse(userB.interests || '[]');
    
    return userAInterests.filter(interest => userBInterests.includes(interest));
  },

  // Get similar values
  getSimilarValues: async (userAId, userBId) => {
    const userA = await this.getUser(userAId);
    const userB = await this.getUser(userBId);
    
    if (!userA?.values || !userB?.values) return [];
    
    const userAValues = Array.isArray(userA.values) ? userA.values : JSON.parse(userA.values || '[]');
    const userBValues = Array.isArray(userB.values) ? userB.values : JSON.parse(userB.values || '[]');
    
    return userAValues.filter(value => userBValues.includes(value));
  },

  // Location compatibility
  getLocationCompatibility: async (userAId, userBId) => {
    const locA = await this.getUserLocation(userAId);
    const locB = await this.getUserLocation(userBId);
    
    if (!locA || !locB) return 0;
    
    // Calculate distance and return inverse (closer = higher compatibility)
    const distance = this.calculateDistance(locA.latitude, locA.longitude, locB.latitude, locB.longitude);
    return Math.max(0, 100 - distance); // Assuming distance is in km
  },

  // Calculate distance between two points
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  },

  // Escrow gift operations
  createEscrowGift: async (giftData) => {
    const { senderId, recipientId, giftDetails } = giftData;
    const result = await pool.query(
      'INSERT INTO escrow_gifts(sender_id, recipient_id, gift_details, status, held_until, created_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      [senderId, recipientId, giftDetails, giftData.status, giftData.heldUntil, giftData.createdAt]
    );
    return result.rows[0];
  },

  getEscrowGift: async (giftId) => {
    const result = await pool.query(
      'SELECT * FROM escrow_gifts WHERE id = $1',
      [giftId]
    );
    return result.rows[0];
  },

  updateEscrowGiftStatus: async (giftId, status, reason = null) => {
    const result = await pool.query(
      'UPDATE escrow_gifts SET status = $2, updated_at = NOW(), reason = $3 WHERE id = $1 RETURNING *',
      [giftId, status, reason]
    );
    return result.rows[0];
  },

  holdFundsInEscrow: async (userId, amount) => {
    // This would typically involve financial transactions
    // For now, we'll just log the action
    console.log(`Holding ${amount} funds in escrow for user ${userId}`);
  },

  transferFromEscrowToRecipient: async (senderId, recipientId, amount) => {
    // This would typically involve financial transactions
    // For now, we'll just log the action
    console.log(`Transferring ${amount} from escrow from ${senderId} to ${recipientId}`);
  },

  returnFundsToSender: async (userId, amount) => {
    // This would typically involve financial transactions
    // For now, we'll just log the action
    console.log(`Returning ${amount} funds to user ${userId}`);
  },

  getExpiredEscrowGifts: async () => {
    const result = await pool.query(
      'SELECT * FROM escrow_gifts WHERE status = \'held_in_escrow\' AND held_until < NOW()'
    );
    return result.rows;
  },

  getUserPendingEscrowGifts: async (userId) => {
    const result = await pool.query(
      'SELECT * FROM escrow_gifts WHERE recipient_id = $1 AND status = \'held_in_escrow\'',
      [userId]
    );
    return result.rows;
  },

  getUserSentEscrowGifts: async (userId) => {
    const result = await pool.query(
      'SELECT * FROM escrow_gifts WHERE sender_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  },

  //Lapidaire questions operations
  createLapidaireQuestion: async (questionData) => {
    const { userId, question, audience } = questionData;
    const result = await pool.query(
      'INSERT INTOlapidaire_questions(user_id, question, audience, status, created_at) VALUES($1, $2, $3, $4, $5) RETURNING *',
      [userId, question, audience, questionData.status, questionData.createdAt]
    );
    return result.rows[0];
  },

  getLapidaireQuestion: async (questionId) => {
    const result = await pool.query(
      'SELECT * FROMlapidaire_questions WHERE id = $1',
      [questionId]
    );
    return result.rows[0];
  },

  hasUserAnsweredQuestion: async (userId, questionId) => {
    const result = await pool.query(
      'SELECT * FROMlapidaire_answers WHERE user_id = $1 AND question_id = $2',
      [userId, questionId]
    );
    return result.rows.length > 0;
  },

  createLapidaireAnswer: async (answerData) => {
    const { questionId, userId, answer } = answerData;
    const result = await pool.query(
      'INSERT INTOlapidaire_answers(question_id, user_id, answer, created_at) VALUES($1, $2, $3, $4) RETURNING *',
      [questionId, userId, answer, answerData.createdAt]
    );
    return result.rows[0];
  },

  getLapidaireQuestions: async (userId, audience, limit) => {
    // This would need to factor in the user's connections for 'matches-only' and 'friends-only' audiences
    const result = await pool.query(
      'SELECT iq.*, u.username, u.avatar FROMlapidaire_questions iq JOIN users u ON iq.user_id = u.id WHERE (audience = \'public\' OR user_id = $1) AND status = \'active\' ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows;
  },

  getUserLapidaireQuestions: async (userId) => {
    const result = await pool.query(
      'SELECT * FROMlapidaire_questions WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  },

  getAnswersToQuestion: async (questionId, limit) => {
    const result = await pool.query(
      'SELECT ia.*, u.username, u.avatar FROMlapidaire_answers ia JOIN users u ON ia.user_id = u.id WHERE ia.question_id = $1 ORDER BY ia.created_at DESC LIMIT $2',
      [questionId, limit]
    );
    return result.rows;
  },

  // Gift catalog operations
  createGiftCatalogItem: async (itemData) => {
    const { name, description, price, imageUrl, category, status } = itemData;
    const result = await pool.query(
      'INSERT INTO gift_catalog_items(name, description, price, image_url, category, status, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, description, price, imageUrl, category, status, itemData.createdAt, itemData.updatedAt]
    );
    return result.rows[0];
  },

  getActiveGiftCatalogItems: async () => {
    const result = await pool.query(
      'SELECT * FROM gift_catalog_items WHERE status = \'active\' ORDER BY category, price'
    );
    return result.rows;
  },

  getGiftCatalogItem: async (itemId) => {
    const result = await pool.query(
      'SELECT * FROM gift_catalog_items WHERE id = $1',
      [itemId]
    );
    return result.rows[0];
  },

  // User verification operations
  isUserVerified: async (userId) => {
    const result = await pool.query(
      'SELECT COUNT(*) as verified_count FROM user_verifications WHERE user_id = $1 AND status = \'approved\'',
      [userId]
    );
    return parseInt(result.rows[0].verified_count) > 0;
  },

  // Admin operations
  isAdmin: async (userId) => {
    const result = await pool.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0]?.is_admin || false;
  },

  // Content access logging
  logContentAccess: async (userId, contentId) => {
    await pool.query(
      'INSERT INTO content_access_logs(user_id, content_id, accessed_at) VALUES($1, $2, NOW())',
      [userId, contentId]
    );
  },

  // Privacy action logging
  logPrivacyAction: async (userId, action, details) => {
    await pool.query(
      'INSERT INTO privacy_action_logs(user_id, action, details, timestamp) VALUES($1, $2, $3, NOW())',
      [userId, action, details]
    );
  },

  // User incognito operations
  updateUserIncognitoMode: async (userId, isIncognito, expiryDate) => {
    const result = await pool.query(`
      INSERT INTO user_privacy_modes(user_id, is_incognito, incognito_until, created_at, updated_at)
      VALUES($1, $2, $3, NOW(), NOW())
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        is_incognito = EXCLUDED.is_incognito,
        incognito_until = EXCLUDED.incognito_until,
        updated_at = NOW()
      RETURNING *
    `, [userId, isIncognito, expiryDate]);
    return result.rows[0];
  },

  // Discovery queue operations
  removeUserFromDiscoveryQueues: async (userId) => {
    // This would remove the user from various matching/discovery queues
    console.log(`Removing user ${userId} from discovery queues`);
  },

  addUserToDiscoveryQueues: async (userId) => {
    // This would add the user back to various matching/discovery queues
    console.log(`Adding user ${userId} to discovery queues`);
  },

  // Get user's content access logs
  getUserContentAccessLogs: async (userId, daysBack) => {
    const sinceDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const result = await pool.query(
      'SELECT * FROM content_access_logs WHERE user_id = $1 AND accessed_at >= $2 ORDER BY accessed_at DESC',
      [userId, sinceDate]
    );
    return result.rows;
  },

  // Get user's privacy setting changes
  getUserPrivacySettingChanges: async (userId, daysBack) => {
    const sinceDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const result = await pool.query(
      'SELECT * FROM privacy_action_logs WHERE user_id = $1 AND timestamp >= $2 AND action LIKE \'%settings%\' ORDER BY timestamp DESC',
      [userId, sinceDate]
    );
    return result.rows;
  },

  // Get user's incognito usage
  getUserIncognitoUsage: async (userId, daysBack) => {
    const sinceDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const result = await pool.query(
      'SELECT * FROM user_privacy_modes WHERE user_id = $1 AND created_at >= $2 ORDER BY created_at DESC',
      [userId, sinceDate]
    );
    return result.rows;
  },

  // Get user's data sharing permissions
  getUserDataSharingPermissions: async (userId) => {
    const result = await pool.query(
      'SELECT * FROM user_data_permissions WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || {};
  },

  // Get user's consent history
  getUserConsentHistory: async (userId) => {
    const result = await pool.query(
      'SELECT * FROM user_consent_history WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  },

  // Get user's automated decision making info
  getUserAutomatedDecisionMakingInfo: async (userId) => {
    // Placeholder for GDPR-related information about automated decision making
    return {
      hasAutomatedDecision: false,
      logicInvolved: '',
      consequences: ''
    };
  },

  // Get user's privacy data summary
  getUserPrivacyData: async (userId) => {
    const settings = await this.getUserPrivacySettings(userId);
    const recentAccessLogs = await this.getUserContentAccessLogs(userId, 7);
    const trustedConnections = await this.getTrustedConnections(userId);
    
    return {
      profileVisibility: settings?.profile_visibility || 'public',
      whoCanContact: settings?.who_can_contact || 'anyone',
      locationSharing: settings?.location_sharing || 'everyone',
      contentVisibility: settings?.content_visibility || 'public',
      recentAccessLogs,
      trustedConnections
    };
  },

  // Get trusted connections for privacy
  getTrustedConnections: async (userId) => {
    // Get user's matches and connections
    const matches = await pool.query(
      `SELECT u.id, u.username, u.avatar 
       FROM matches m 
       JOIN users u ON (CASE WHEN m.user_a_id = $1 THEN m.user_b_id = u.id ELSE m.user_a_id = u.id END)
       WHERE (m.user_a_id = $1 OR m.user_b_id = $1) AND m.status = 'active'`,
      [userId]
    );
    
    return matches.rows;
  },

  // Check if a feature is active for a user
  isFeatureActive: async (userId, featureId) => {
    const result = await pool.query(
      'SELECT * FROM user_features WHERE user_id = $1 AND feature_name = $2',
      [userId, featureId]
    );
    return result.rows.length > 0;
  },

  // Activate a Radiate++ feature
  activateRadiatePlusPlusFeature: async (userId, featureId) => {
    const result = await pool.query(
      'INSERT INTO user_features(user_id, feature_name, granted_at) VALUES($1, $2, NOW()) ON CONFLICT (user_id, feature_name) DO UPDATE SET granted_at = NOW() RETURNING *',
      [userId, featureId]
    );
    return result.rows[0];
  },

  // Get Radiate++ exclusive events
  getExclusiveEvents: async (userId) => {
    // Check if user has Radiate++ membership first
    const membership = await this.getUserMembership(userId);
    if (!membership || membership.plan !== 'radiate_plus_plus') {
      return [];
    }
    
    const result = await pool.query(
      'SELECT * FROM exclusive_events WHERE event_type = \'radiate_plus_plus\' AND start_date >= NOW() ORDER BY start_date',
      []
    );
    return result.rows;
  },

  // Get upcoming features for early access
  getUpcomingFeaturesForEarlyAccess: async (userId) => {
    // Check if user has Radiate++ membership first
    const membership = await this.getUserMembership(userId);
    if (!membership || membership.plan !== 'radiate_plus_plus') {
      return [];
    }
    
    const result = await pool.query(
      'SELECT * FROM upcoming_features WHERE early_access = true AND status = \'development\' ORDER BY estimated_release_date',
      []
    );
    return result.rows;
  },

  // Get Radiate++ statistics
  getRadiatePlusPlusStats: async () => {
    const result = await pool.query(`
      SELECT 
        COUNT(CASE WHEN plan = 'radiate_plus_plus' THEN 1 END) as radiate_plus_plus_count,
        COUNT(*) as total_memberships
      FROM user_memberships 
      WHERE status = 'active'
    `);
    return result.rows[0];
  },

  // Get Radiate++ feature usage
  getRadiatePlusPlusFeatureUsage: async (userId) => {
    const result = await pool.query(
      'SELECT feature_name, COUNT(*) as usage_count FROM user_features WHERE user_id = $1 GROUP BY feature_name',
      [userId]
    );
    return result.rows;
  },

  // Set unlimited swipes for user
  setUnlimitedSwipes: async (userId) => {
    await pool.query(
      'INSERT INTO user_feature_flags(user_id, feature_name, enabled, updated_at) VALUES($1, $2, $3, NOW()) ON CONFLICT (user_id, feature_name) DO UPDATE SET enabled = $3, updated_at = NOW()',
      [userId, 'unlimited_swipes', true]
    );
  },

  // Enable ad-free experience
  enableAdFreeExperience: async (userId) => {
    await pool.query(
      'INSERT INTO user_feature_flags(user_id, feature_name, enabled, updated_at) VALUES($1, $2, $3, NOW()) ON CONFLICT (user_id, feature_name) DO UPDATE SET enabled = $3, updated_at = NOW()',
      [userId, 'ad_free_experience', true]
    );
  },

  // Enable extended profile
  enableExtendedProfile: async (userId) => {
    await pool.query(
      'INSERT INTO user_feature_flags(user_id, feature_name, enabled, updated_at) VALUES($1, $2, $3, NOW()) ON CONFLICT (user_id, feature_name) DO UPDATE SET enabled = $3, updated_at = NOW()',
      [userId, 'extended_profile', true]
    );
  },

  // Enable seen profiles
  enableSeenProfiles: async (userId) => {
    await pool.query(
      'INSERT INTO user_feature_flags(user_id, feature_name, enabled, updated_at) VALUES($1, $2, $3, NOW()) ON CONFLICT (user_id, feature_name) DO UPDATE SET enabled = $3, updated_at = NOW()',
      [userId, 'seen_profiles', true]
    );
  },

  // Enable unlimited boosts
  enableUnlimitedBoosts: async (userId) => {
    await pool.query(
      'INSERT INTO user_feature_flags(user_id, feature_name, enabled, updated_at) VALUES($1, $2, $3, NOW()) ON CONFLICT (user_id, feature_name) DO UPDATE SET enabled = $3, updated_at = NOW()',
      [userId, 'unlimited_boosts', true]
    );
  },

  // Enable advanced search
  enableAdvancedSearch: async (userId) => {
    await pool.query(
      'INSERT INTO user_feature_flags(user_id, feature_name, enabled, updated_at) VALUES($1, $2, $3, NOW()) ON CONFLICT (user_id, feature_name) DO UPDATE SET enabled = $3, updated_at = NOW()',
      [userId, 'advanced_search', true]
    );
  },

  // Grant special badge
  grantSpecialBadge: async (userId, badgeName) => {
    await pool.query(
      'INSERT INTO user_badges(user_id, badge_name, awarded_at) VALUES($1, $2, NOW()) ON CONFLICT DO NOTHING',
      [userId, badgeName]
    );
  }
};

module.exports = dbOperations;