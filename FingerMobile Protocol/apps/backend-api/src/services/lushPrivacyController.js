/**
 * Lush Privacy Controller Service
 * Handles all privacy-related operations for the Lush Pressies app
 */

const db = require('../config/database'); // Assuming a database connection
const { generateRandomString, validatePin, hashPin, verifyPin } = require('../utils/lushKeyTokenUtils');

class LushPrivacyController {
  /**
   * Check if a user has permission to view specific content
   */
  static async checkViewPermission(contentType, contentId, userId) {
    try {
      // Retrieve content privacy settings
      const privacySettings = await db.getPrivacySettings(contentType, contentId);
      
      if (!privacySettings) {
        return { canView: false, reason: 'Content not found or no privacy settings' };
      }

      // Check if user is the content owner
      if (privacySettings.ownerId === userId) {
        return { canView: true };
      }

      // Check visibility settings
      if (privacySettings.visibility === 'private') {
        return { canView: false, reason: 'Content is private' };
      }

      // Check if user is blocked
      const isBlocked = await db.isUserBlocked(privacySettings.ownerId, userId);
      if (isBlocked) {
        return { canView: false, reason: 'User is blocked' };
      }

      // Check membership requirements
      if (privacySettings.radiatePlusOnly) {
        const userMembership = await db.getUserMembership(userId);
        if (!userMembership || !userMembership.isRadiatePlus) {
          return { canView: false, reason: 'Radiate++ membership required' };
        }
      }

      // Check commitment requirements
      if (privacySettings.commitButtonUnlockedOnly) {
        const isCommitted = await db.isCommitted(userId, privacySettings.ownerId);
        if (!isCommitted) {
          return { canView: false, reason: 'Commit button must be unlocked' };
        }
      }

      // Check PIN exchange requirement
      if (privacySettings.pinExchangeRequired) {
        const pinGranted = await db.hasPinAccess(userId, contentId);
        if (!pinGranted) {
          return { canView: false, reason: 'PIN exchange required' };
        }
      }

      // Check gift requirement
      if (privacySettings.giftRequiredToView) {
        const giftGiven = await db.hasGivenGift(userId, privacySettings.ownerId);
        if (!giftGiven) {
          return { canView: false, reason: 'Gift required to view' };
        }
      }

      // Check membership category gate
      if (privacySettings.membershipCategoryGate && privacySettings.membershipCategoryGate.length > 0) {
        const userMembership = await db.getUserMembership(userId);
        if (!userMembership || !privacySettings.membershipCategoryGate.includes(userMembership.category)) {
          return { canView: false, reason: 'Membership category does not meet requirements' };
        }
      }

      // Check gender targeting
      if (privacySettings.genderTarget && privacySettings.genderTarget !== 'all') {
        const userProfile = await db.getUserProfile(userId);
        if (userProfile.gender !== privacySettings.genderTarget) {
          return { canView: false, reason: 'Gender does not match target' };
        }
      }

      // Check age range
      if (privacySettings.ageRangeMin || privacySettings.ageRangeMax) {
        const userProfile = await db.getUserProfile(userId);
        const userAge = this.calculateAge(userProfile.birthDate);
        
        if (privacySettings.ageRangeMin && userAge < privacySettings.ageRangeMin) {
          return { canView: false, reason: 'User age below minimum requirement' };
        }
        
        if (privacySettings.ageRangeMax && userAge > privacySettings.ageRangeMax) {
          return { canView: false, reason: 'User age above maximum requirement' };
        }
      }

      // Check allowed user IDs
      if (privacySettings.allowedUserIds && privacySettings.allowedUserIds.length > 0) {
        if (!privacySettings.allowedUserIds.includes(userId)) {
          return { canView: false, reason: 'User not in allowed list' };
        }
      }

      // Check location restrictions
      if (privacySettings.allowedLocations) {
        const userLocation = await db.getUserLocation(userId);
        const isAllowedLocation = this.checkLocationRestriction(userLocation, privacySettings.allowedLocations);
        if (!isAllowedLocation) {
          return { canView: false, reason: 'User location does not meet requirements' };
        }
      }

      // All checks passed
      return { canView: true };
    } catch (error) {
      console.error('Error checking view permission:', error);
      return { canView: false, reason: 'Internal error' };
    }
  }

  /**
   * Verify PIN for content access
   */
  static async verifyPinForContent(pin, contentType, contentId) {
    try {
      // Validate PIN format
      if (!validatePin(pin)) {
        return { success: false, reason: 'Invalid PIN format' };
      }

      // Retrieve stored PIN for content
      const storedPin = await db.getContentPin(contentId, contentType);
      if (!storedPin) {
        return { success: false, reason: 'No PIN set for this content' };
      }

      // Verify PIN
      const isValid = await verifyPin(pin, storedPin.hash);
      if (!isValid) {
        return { success: false, reason: 'Invalid PIN' };
      }

      // Check PIN expiration
      if (storedPin.expiresAt && new Date() > new Date(storedPin.expiresAt)) {
        return { success: false, reason: 'PIN has expired' };
      }

      // Record successful PIN usage
      await db.recordPinUsage(storedPin.id);

      return { success: true };
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return { success: false, reason: 'Internal error' };
    }
  }

  /**
   * Generate a new PIN for content access
   */
  static async generateContentPin(contentType, contentId, ownerId, options = {}) {
    try {
      const {
        expirationHours = 24,
        maxUses = null,
        reusable = false
      } = options;

      // Generate a new PIN
      const pin = generateRandomString(6, '0123456789'); // 6-digit numeric PIN
      const pinHash = await hashPin(pin);

      // Store PIN in database
      const pinRecord = await db.createContentPin({
        pin: pinHash,
        contentType,
        contentId,
        ownerId,
        expiresAt: expirationHours ? new Date(Date.now() + expirationHours * 60 * 60 * 1000) : null,
        maxUses,
        reusable,
        createdAt: new Date()
      });

      return {
        success: true,
        pinId: pinRecord.id,
        pin: reusable ? null : pin, // Don't return PIN if reusable (security)
        expiresAt: pinRecord.expiresAt
      };
    } catch (error) {
      console.error('Error generating content PIN:', error);
      return { success: false, reason: 'Internal error' };
    }
  }

  /**
   * Update privacy settings for content
   */
  static async updatePrivacySettings(contentType, contentId, userId, newSettings) {
    try {
      // Verify user owns the content
      const contentOwner = await db.getContentOwner(contentType, contentId);
      if (contentOwner !== userId) {
        return { success: false, reason: 'User does not own this content' };
      }

      // Validate settings
      const validatedSettings = this.validatePrivacySettings(newSettings);
      if (!validatedSettings.valid) {
        return { success: false, reason: validatedSettings.errors.join(', ') };
      }

      // Update settings in database
      const updatedSettings = await db.updatePrivacySettings(contentType, contentId, validatedSettings.settings);

      return {
        success: true,
        settings: updatedSettings
      };
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      return { success: false, reason: 'Internal error' };
    }
  }

  /**
   * Validate privacy settings
   */
  static validatePrivacySettings(settings) {
    const errors = [];

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
      valid: errors.length === 0,
      errors,
      settings: errors.length === 0 ? settings : null
    };
  }

  /**
   * Get privacy settings for content
   */
  static async getPrivacySettings(contentType, contentId) {
    try {
      return await db.getPrivacySettings(contentType, contentId);
    } catch (error) {
      console.error('Error retrieving privacy settings:', error);
      return null;
    }
  }

  /**
   * Check if content has specific privacy restrictions
   */
  static async hasPrivacyRestrictions(contentType, contentId) {
    try {
      const settings = await this.getPrivacySettings(contentType, contentId);
      if (!settings) return false;

      // Check if any privacy restrictions are enabled
      return (
        settings.visibility === 'private' ||
        settings.visibility === 'connections' ||
        settings.visibility === 'matches' ||
        settings.pinExchangeRequired ||
        settings.giftRequiredToView ||
        settings.commitButtonUnlockedOnly ||
        settings.radiatePlusOnly ||
        settings.membershipCategoryGate?.length > 0 ||
        settings.genderTarget !== 'all' ||
        settings.ageRangeMin > 18 ||
        settings.ageRangeMax < 100 ||
        settings.allowedUserIds?.length > 0 ||
        settings.allowedLocations ||
        settings.autoDelete
      );
    } catch (error) {
      console.error('Error checking privacy restrictions:', error);
      return false;
    }
  }

  /**
   * Calculate user age from birth date
   */
  static calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Check if user's location meets content requirements
   */
  static checkLocationRestriction(userLocation, requiredLocations) {
    // This is a simplified check - in a real app, this would be more complex
    // and might involve checking country, region, city, etc.
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
}

module.exports = LushPrivacyController;