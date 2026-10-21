/**
 * Lush Privacy Sovereignty Service
 * Handles member privacy, incognito engine, and sovereignty features
 */

const db = require('../config/database');
const { generateSecurePin, generatePrivacyAccessCode, validatePrivacyAccessCode } = require('./lushKeyTokenUtils');

class LushPrivacySovereignty {
  /**
   * Create a privacy-controlled content item
   */
  static async createPrivacyControlledContent(userId, content, privacySettings) {
    try {
      if (!userId || !content || !privacySettings) {
        throw new Error('User ID, content, and privacy settings are required');
      }

      // Validate privacy settings
      const validatedSettings = this.validatePrivacySettings(privacySettings);
      if (!validatedSettings.isValid) {
        throw new Error(`Invalid privacy settings: ${validatedSettings.errors.join(', ')}`);
      }

      // Create content with privacy controls
      const privacyContent = await db.createPrivacyControlledContent({
        userId,
        content,
        privacySettings: validatedSettings.settings,
        createdAt: new Date()
      });

      // If PIN exchange is required, generate a PIN
      if (validatedSettings.settings.pinExchangeRequired) {
        const pin = await this.generateContentAccessPin(privacyContent.id, userId);
        privacyContent.accessPin = pin;
      }

      return {
        success: true,
        content: privacyContent
      };
    } catch (error) {
      console.error('Error creating privacy-controlled content:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Validate privacy settings
   */
  static validatePrivacySettings(settings) {
    const errors = [];
    const validSettings = { ...settings };

    // Validate visibility
    const validVisibilities = ['public', 'connections', 'matches', 'private', 'unlisted'];
    if (settings.visibility && !validVisibilities.includes(settings.visibility)) {
      errors.push('Invalid visibility setting');
    }

    // Validate duration type
    const validDurations = ['permanent', '24h', '7d', '30d', 'custom'];
    if (settings.durationType && !validDurations.includes(settings.durationType)) {
      errors.push('Invalid duration type');
    }

    // Validate gender target
    const validGenders = ['all', 'men', 'women', 'non-binary', 'other'];
    if (settings.genderTarget && !validGenders.includes(settings.genderTarget)) {
      errors.push('Invalid gender target');
    }

    // Validate age range
    if (settings.ageRangeMin && (settings.ageRangeMin < 18 || settings.ageRangeMin > 100)) {
      errors.push('Minimum age must be between 18 and 100');
    }
    if (settings.ageRangeMax && (settings.ageRangeMax < 18 || settings.ageRangeMax > 100)) {
      errors.push('Maximum age must be between 18 and 100');
    }
    if (settings.ageRangeMin && settings.ageRangeMax && settings.ageRangeMin > settings.ageRangeMax) {
      errors.push('Minimum age cannot be greater than maximum age');
    }

    return {
      isValid: errors.length === 0,
      errors,
      settings: errors.length === 0 ? validSettings : null
    };
  }

  /**
   * Generate a PIN for content access
   */
  static async generateContentAccessPin(contentId, userId) {
    try {
      // Generate a secure PIN
      const pin = generateSecurePin(6);

      // Store the PIN with the content
      await db.storeContentAccessPin(contentId, pin, userId);

      return pin;
    } catch (error) {
      console.error('Error generating content access PIN:', error);
      throw error;
    }
  }

  /**
   * Request access to privacy-controlled content
   */
  static async requestAccessToContent(userId, contentId, accessCredentials = {}) {
    try {
      if (!userId || !contentId) {
        throw new Error('User ID and content ID are required');
      }

      // Get content and its privacy settings
      const content = await db.getPrivacyControlledContent(contentId);
      if (!content) {
        throw new Error('Content not found');
      }

      // Check if user is the content owner
      if (content.userId === userId) {
        return {
          success: true,
          hasAccess: true,
          content: content.content
        };
      }

      // Check privacy restrictions
      const accessResult = await this.checkPrivacyAccess(userId, content, accessCredentials);
      
      if (accessResult.hasAccess) {
        // Log access for analytics
        await db.logContentAccess(userId, contentId);

        return {
          success: true,
          hasAccess: true,
          content: content.content,
          accessType: accessResult.accessType
        };
      } else {
        return {
          success: false,
          hasAccess: false,
          reason: accessResult.reason,
          requiredActions: accessResult.requiredActions
        };
      }
    } catch (error) {
      console.error('Error requesting access to content:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if user has access to content based on privacy settings
   */
  static async checkPrivacyAccess(userId, content, accessCredentials) {
    const privacySettings = content.privacySettings;
    const user = await db.getUser(userId);

    // Check basic visibility
    if (privacySettings.visibility === 'private') {
      return { 
        hasAccess: false, 
        reason: 'Content is private', 
        requiredActions: ['owner_permission'] 
      };
    }

    if (privacySettings.visibility === 'connections' && !await db.areUsersConnected(userId, content.userId)) {
      return { 
        hasAccess: false, 
        reason: 'Content is restricted to connections', 
        requiredActions: ['connect_with_owner'] 
      };
    }

    if (privacySettings.visibility === 'matches' && !await db.areUsersMatched(userId, content.userId)) {
      return { 
        hasAccess: false, 
        reason: 'Content is restricted to matches', 
        requiredActions: ['match_with_owner'] 
      };
    }

    // Check PIN exchange requirement
    if (privacySettings.pinExchangeRequired) {
      if (!accessCredentials.pin) {
        return { 
          hasAccess: false, 
          reason: 'PIN exchange required', 
          requiredActions: ['enter_pin'] 
        };
      }

      const isValidPin = await db.validateContentAccessPin(content.id, accessCredentials.pin);
      if (!isValidPin) {
        return { 
          hasAccess: false, 
          reason: 'Invalid PIN', 
          requiredActions: ['enter_valid_pin'] 
        };
      }
    }

    // Check gift requirement
    if (privacySettings.giftRequiredToView) {
      const hasGifted = await db.hasUserGiftedTo(userId, content.userId);
      if (!hasGifted) {
        return { 
          hasAccess: false, 
          reason: 'Gift required to view', 
          requiredActions: ['send_gift'] 
        };
      }
    }

    // Check commitment button requirement
    if (privacySettings.commitButtonUnlockedOnly) {
      const hasCommitted = await db.hasUserCommittedTo(userId, content.userId);
      if (!hasCommitted) {
        return { 
          hasAccess: false, 
          reason: 'Commitment required', 
          requiredActions: ['commit_to_owner'] 
        };
      }
    }

    // Check Radiate++ requirement
    if (privacySettings.radiatePlusOnly) {
      const isRadiatePlus = await db.isUserRadiatePlus(userId);
      if (!isRadiatePlus) {
        return { 
          hasAccess: false, 
          reason: 'Radiate++ membership required', 
          requiredActions: ['upgrade_membership'] 
        };
      }
    }

    // Check membership category gate
    if (privacySettings.membershipCategoryGate && privacySettings.membershipCategoryGate.length > 0) {
      const userMembership = await db.getUserMembership(userId);
      if (!userMembership || !privacySettings.membershipCategoryGate.includes(userMembership.category)) {
        return { 
          hasAccess: false, 
          reason: 'Membership category does not meet requirements', 
          requiredActions: ['upgrade_membership_category'] 
        };
      }
    }

    // Check gender target
    if (privacySettings.genderTarget && privacySettings.genderTarget !== 'all') {
      if (user.gender !== privacySettings.genderTarget) {
        return { 
          hasAccess: false, 
          reason: 'Gender does not match target', 
          requiredActions: [] 
        };
      }
    }

    // Check age range
    if (privacySettings.ageRangeMin && user.age < privacySettings.ageRangeMin) {
      return { 
        hasAccess: false, 
        reason: 'User age below minimum requirement', 
        requiredActions: [] 
      };
    }

    if (privacySettings.ageRangeMax && user.age > privacySettings.ageRangeMax) {
      return { 
        hasAccess: false, 
        reason: 'User age above maximum requirement', 
        requiredActions: [] 
      };
    }

    // Check allowed user IDs
    if (privacySettings.allowedUserIds && privacySettings.allowedUserIds.length > 0) {
      if (!privacySettings.allowedUserIds.includes(userId)) {
        return { 
          hasAccess: false, 
          reason: 'User not in allowed list', 
          requiredActions: [] 
        };
      }
    }

    // Check location restrictions
    if (privacySettings.allowedLocations) {
      const userLocation = await db.getUserLocation(userId);
      const isAllowedLocation = await this.checkLocationRestriction(userLocation, privacySettings.allowedLocations);
      if (!isAllowedLocation) {
        return { 
          hasAccess: false, 
          reason: 'User location does not meet requirements', 
          requiredActions: [] 
        };
      }
    }

    // All checks passed
    return { 
      hasAccess: true, 
      accessType: 'full_access' 
    };
  }

  /**
   * Check if user's location meets content requirements
   */
  static async checkLocationRestriction(userLocation, requiredLocations) {
    if (!requiredLocations) return true;

    // Example: check if user is in allowed countries
    if (requiredLocations.countries && requiredLocations.countries.length > 0) {
      return requiredLocations.countries.includes(userLocation.country);
    }

    // Example: check if user is within allowed distance from a specific location
    if (requiredLocations.nearby && requiredLocations.nearby.center) {
      const distance = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        requiredLocations.nearby.center.latitude,
        requiredLocations.nearby.center.longitude
      );

      return distance <= requiredLocations.nearby.maxDistanceKm;
    }

    return true; // No location restrictions
  }

  /**
   * Calculate distance between two coordinates
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  }

  /**
   * Activate incognito mode for user
   */
  static async activateIncognitoMode(userId, durationHours = 24) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Check if user has permission to use incognito mode
      const userMembership = await db.getUserMembership(userId);
      if (!userMembership || !userMembership.features.includes('incognito_mode')) {
        throw new Error('Incognito mode not available for your membership level');
      }

      // Set incognito mode in database
      const incognitoExpiry = new Date(Date.now() + durationHours * 60 * 60 * 1000);
      const updatedUser = await db.updateUserIncognitoMode(userId, true, incognitoExpiry);

      // Remove user from discovery queues while incognito
      await db.removeUserFromDiscoveryQueues(userId);

      // Log incognito activation
      await db.logPrivacyAction(userId, 'incognito_activated', { duration: durationHours });

      return {
        success: true,
        incognitoUntil: incognitoExpiry,
        user: updatedUser
      };
    } catch (error) {
      console.error('Error activating incognito mode:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Deactivate incognito mode for user
   */
  static async deactivateIncognitoMode(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Set incognito mode to false in database
      const updatedUser = await db.updateUserIncognitoMode(userId, false, null);

      // Add user back to discovery queues
      await db.addUserToDiscoveryQueues(userId);

      // Log incognito deactivation
      await db.logPrivacyAction(userId, 'incognito_deactivated', {});

      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      console.error('Error deactivating incognito mode:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's privacy settings
   */
  static async getUserPrivacySettings(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const settings = await db.getUserPrivacySettings(userId);

      return {
        success: true,
        settings
      };
    } catch (error) {
      console.error('Error getting user privacy settings:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update user's privacy settings
   */
  static async updateUserPrivacySettings(userId, newSettings) {
    try {
      if (!userId || !newSettings) {
        throw new Error('User ID and new settings are required');
      }

      // Validate new settings
      const validatedSettings = this.validateUserPrivacySettings(newSettings);
      if (!validatedSettings.isValid) {
        throw new Error(`Invalid privacy settings: ${validatedSettings.errors.join(', ')}`);
      }

      // Update privacy settings in database
      const updatedSettings = await db.updateUserPrivacySettings(userId, validatedSettings.settings);

      // Log privacy settings update
      await db.logPrivacyAction(userId, 'settings_updated', { updatedFields: Object.keys(newSettings) });

      return {
        success: true,
        settings: updatedSettings
      };
    } catch (error) {
      console.error('Error updating user privacy settings:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Validate user privacy settings
   */
  static validateUserPrivacySettings(settings) {
    const errors = [];
    const validSettings = { ...settings };

    // Validate profile visibility
    const validProfileVisibilities = ['public', 'members_only', 'connections_only', 'private'];
    if (settings.profileVisibility && !validProfileVisibilities.includes(settings.profileVisibility)) {
      errors.push('Invalid profile visibility setting');
    }

    // Validate who can contact
    const validContactOptions = ['anyone', 'connections', 'matches', 'none'];
    if (settings.whoCanContact && !validContactOptions.includes(settings.whoCanContact)) {
      errors.push('Invalid contact setting');
    }

    // Validate location sharing
    const validLocationSharing = ['everyone', 'connections', 'matches', 'none'];
    if (settings.locationSharing && !validLocationSharing.includes(settings.locationSharing)) {
      errors.push('Invalid location sharing setting');
    }

    return {
      isValid: errors.length === 0,
      errors,
      settings: errors.length === 0 ? validSettings : null
    };
  }

  /**
   * Create a privacy access code for temporary access
   */
  static async createPrivacyAccessCode(userId, targetUserId, permissions, expiryHours = 24) {
    try {
      if (!userId || !targetUserId || !permissions) {
        throw new Error('User ID, target user ID, and permissions are required');
      }

      // Generate a privacy access code
      const accessCode = generatePrivacyAccessCode();
      const expiryDate = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

      // Store the access code
      const codeRecord = await db.createPrivacyAccessCode({
        code: accessCode,
        userId,
        targetUserId,
        permissions,
        expiryDate,
        createdAt: new Date()
      });

      return {
        success: true,
        accessCode: accessCode,
        expiryDate
      };
    } catch (error) {
      console.error('Error creating privacy access code:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Validate and use a privacy access code
   */
  static async validatePrivacyAccessCode(userId, accessCode, requestedPermission) {
    try {
      if (!userId || !accessCode || !requestedPermission) {
        throw new Error('User ID, access code, and requested permission are required');
      }

      // Validate the access code format
      if (!validatePrivacyAccessCode(accessCode)) {
        throw new Error('Invalid access code format');
      }

      // Get the code record
      const codeRecord = await db.getPrivacyAccessCode(accessCode);
      if (!codeRecord) {
        throw new Error('Access code not found');
      }

      // Check if code is expired
      if (new Date() > new Date(codeRecord.expiryDate)) {
        throw new Error('Access code has expired');
      }

      // Check if code is for the requesting user
      if (codeRecord.targetUserId !== userId) {
        throw new Error('Access code is not for this user');
      }

      // Check if requested permission is granted
      if (!codeRecord.permissions.includes(requestedPermission)) {
        throw new Error('Access code does not grant requested permission');
      }

      // Mark code as used (optional, depending on single-use policy)
      await db.markPrivacyAccessCodeAsUsed(codeRecord.id);

      return {
        success: true,
        permissionGranted: true,
        codeDetails: codeRecord
      };
    } catch (error) {
      console.error('Error validating privacy access code:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's incognito status
   */
  static async getUserIncognitoStatus(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const user = await db.getUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isIncognito = user.isIncognito || false;
      const incognitoUntil = user.incognitoUntil ? new Date(user.incognitoUntil) : null;
      const isActive = isIncognito && (!incognitoUntil || new Date() < incognitoUntil);

      return {
        success: true,
        isIncognito: isActive,
        expiresAt: isActive ? incognitoUntil : null,
        canDeactivate: isActive // Allow user to deactivate if currently active
      };
    } catch (error) {
      console.error('Error getting user incognito status:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get privacy compliance report for user
   */
  static async getPrivacyComplianceReport(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Gather privacy compliance data
      const report = {
        contentAccessLogs: await db.getUserContentAccessLogs(userId, 30), // Last 30 days
        privacySettingChanges: await db.getUserPrivacySettingChanges(userId, 30),
        incognitoUsage: await db.getUserIncognitoUsage(userId, 30),
        dataSharingPermissions: await db.getUserDataSharingPermissions(userId),
        consentHistory: await db.getUserConsentHistory(userId),
        automatedDecisionMaking: await db.getUserAutomatedDecisionMakingInfo(userId)
      };

      return {
        success: true,
        report
      };
    } catch (error) {
      console.error('Error getting privacy compliance report:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get privacy sovereignty dashboard data
   */
  static async getPrivacyDashboardData(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const privacyData = await db.getUserPrivacyData(userId);

      return {
        success: true,
        dashboard: {
          profileVisibility: privacyData.profileVisibility,
          whoCanContact: privacyData.whoCanContact,
          locationSharing: privacyData.locationSharing,
          contentVisibility: privacyData.contentVisibility,
          incognitoStatus: await this.getUserIncognitoStatus(userId),
          privacyScore: await this.calculatePrivacyScore(userId),
          recentAccessLogs: privacyData.recentAccessLogs,
          trustedConnections: privacyData.trustedConnections
        }
      };
    } catch (error) {
      console.error('Error getting privacy dashboard data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculate user's privacy score
   */
  static async calculatePrivacyScore(userId) {
    try {
      const privacySettings = await db.getUserPrivacySettings(userId);
      if (!privacySettings) {
        return 50; // Default medium privacy
      }

      let score = 50; // Base score

      // Adjust score based on settings
      switch (privacySettings.profileVisibility) {
        case 'private':
          score += 20;
          break;
        case 'connections_only':
          score += 10;
          break;
        case 'members_only':
          score += 5;
          break;
      }

      switch (privacySettings.whoCanContact) {
        case 'none':
          score += 15;
          break;
        case 'connections':
          score += 10;
          break;
        case 'matches':
          score += 5;
          break;
      }

      switch (privacySettings.locationSharing) {
        case 'none':
          score += 15;
          break;
        case 'connections':
          score += 10;
          break;
        case 'matches':
          score += 5;
          break;
      }

      // Cap at 100
      return Math.min(100, score);
    } catch (error) {
      console.error('Error calculating privacy score:', error);
      return 50; // Default score on error
    }
  }

  /**
   * Get privacy recommendations for user
   */
  static async getPrivacyRecommendations(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const privacyScore = await this.calculatePrivacyScore(userId);
      const recommendations = [];

      if (privacyScore < 40) {
        recommendations.push({
          title: 'Increase Profile Privacy',
          description: 'Consider setting your profile visibility to "Connections Only" or "Private"',
          priority: 'high'
        });
      }

      if (await db.getUserLocationSharing(userId) === 'everyone') {
        recommendations.push({
          title: 'Limit Location Sharing',
          description: 'Restrict location sharing to "Matches" or "Connections Only"',
          priority: 'medium'
        });
      }

      if (!(await db.getUserHasStrongPassword(userId))) {
        recommendations.push({
          title: 'Strengthen Account Security',
          description: 'Enable two-factor authentication and use a strong password',
          priority: 'high'
        });
      }

      return {
        success: true,
        recommendations,
        currentScore: privacyScore
      };
    } catch (error) {
      console.error('Error getting privacy recommendations:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = LushPrivacySovereignty;