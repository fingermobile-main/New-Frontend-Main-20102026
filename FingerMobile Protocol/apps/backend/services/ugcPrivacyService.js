/**
 * UGC Privacy & Permissions Service
 * FingerMobile Protocol™
 * Standardized privacy control for all User Generated Content
 * Includes Demographic & Location Heatmap Filtering:
 * - Allowed & Excluded Countries, Regions, Cities, Geofence Polygons
 * - Gender Filtering (All, Male, Female, Non-Binary)
 * - Age Range Filtering (e.g., 22-60+)
 */

const db = require('../db');
const logger = require('../utils/logger');

const logErr = (msg, err) => {
  if (logger && typeof logger.error === 'function') logger.error(msg, err);
};

const getPool = () => db.pool || db;

/**
 * Standard ray-casting algorithm for point-in-polygon geofence check
 * @param {[number, number]} point [latitude, longitude]
 * @param {Array<[number, number]>} polygon Array of [latitude, longitude] vertices
 */
function isPointInPolygon(point, polygon) {
  if (!point || !Array.isArray(polygon) || polygon.length < 3) return false;
  const [lat, lng] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect = ((yi > lng) !== (yj > lng)) && (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

class UGCPrivacyService {
  /**
   * Get privacy settings for a UGC item (returns default settings if not explicitly configured)
   */
  async getPrivacySettings(contentType, contentId, ownerId = null) {
    try {
      const sql = `
        SELECT * FROM ugc_privacy_settings
        WHERE content_type = $1 AND content_id = $2
      `;
      const result = await getPool().query(sql, [contentType, String(contentId)]);
      if (result.rows.length > 0) {
        const row = result.rows[0];
        return {
          ...row,
          allowed_locations: row.allowed_locations || { countries: [], regions: [], cities: [], polygons: [] },
          excluded_locations: row.excluded_locations || { countries: [], regions: [], cities: [], polygons: [] },
          allowed_genders: row.allowed_genders || ['all'],
          gender_target: row.gender_target || 'all',
          age_range_min: row.age_range_min != null ? row.age_range_min : 13,
          age_range_max: row.age_range_max != null ? row.age_range_max : 120
        };
      }

      // Return default privacy settings if item has no custom configuration yet
      return {
        content_type: contentType,
        content_id: String(contentId),
        owner_id: ownerId,
        allow_reviews: 'everyone',
        allow_comments: 'everyone',
        allow_sharing: 'everyone',
        allow_tagging: 'everyone',
        allow_saving: 'everyone',
        allow_download: 'everyone',
        visibility: 'public',
        duration_type: 'permanent',
        expires_at: null,
        allowed_user_ids: [],
        allowed_locations: { countries: [], regions: [], cities: [], polygons: [] },
        excluded_locations: { countries: [], regions: [], cities: [], polygons: [] },
        gender_target: 'all',
        allowed_genders: ['all'],
        age_range_min: 13,
        age_range_max: 120
      };
    } catch (error) {
      logErr('Error in UGCPrivacyService.getPrivacySettings:', error);
      return {
        content_type: contentType,
        content_id: String(contentId),
        owner_id: ownerId,
        allow_reviews: 'everyone',
        allow_comments: 'everyone',
        allow_sharing: 'everyone',
        allow_tagging: 'everyone',
        allow_saving: 'everyone',
        allow_download: 'everyone',
        visibility: 'public',
        duration_type: 'permanent',
        expires_at: null,
        allowed_user_ids: [],
        allowed_locations: { countries: [], regions: [], cities: [], polygons: [] },
        excluded_locations: { countries: [], regions: [], cities: [], polygons: [] },
        gender_target: 'all',
        allowed_genders: ['all'],
        age_range_min: 13,
        age_range_max: 120
      };
    }
  }

  /**
   * Upsert privacy settings for a UGC item
   */
  async upsertPrivacySettings(contentType, contentId, ownerId, settings = {}) {
    try {
      const {
        allow_reviews = 'everyone',
        allow_comments = 'everyone',
        allow_sharing = 'everyone',
        allow_tagging = 'everyone',
        allow_saving = 'everyone',
        allow_download = 'everyone',
        visibility = 'public',
        duration_type = 'permanent',
        expires_at = null,
        allowed_user_ids = [],
        allowed_locations = { countries: [], regions: [], cities: [], polygons: [] },
        excluded_locations = { countries: [], regions: [], cities: [], polygons: [] },
        gender_target = 'all',
        allowed_genders = ['all'],
        age_range_min = 13,
        age_range_max = 120
      } = settings;

      const sql = `
        INSERT INTO ugc_privacy_settings (
          content_type, content_id, owner_id, allow_reviews, allow_comments,
          allow_sharing, allow_tagging, allow_saving, allow_download,
          visibility, duration_type, expires_at, allowed_user_ids,
          allowed_locations, excluded_locations, gender_target, allowed_genders,
          age_range_min, age_range_max, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18, $19, NOW()
        )
        ON CONFLICT (content_type, content_id)
        DO UPDATE SET
          allow_reviews = EXCLUDED.allow_reviews,
          allow_comments = EXCLUDED.allow_comments,
          allow_sharing = EXCLUDED.allow_sharing,
          allow_tagging = EXCLUDED.allow_tagging,
          allow_saving = EXCLUDED.allow_saving,
          allow_download = EXCLUDED.allow_download,
          visibility = EXCLUDED.visibility,
          duration_type = EXCLUDED.duration_type,
          expires_at = EXCLUDED.expires_at,
          allowed_user_ids = EXCLUDED.allowed_user_ids,
          allowed_locations = EXCLUDED.allowed_locations,
          excluded_locations = EXCLUDED.excluded_locations,
          gender_target = EXCLUDED.gender_target,
          allowed_genders = EXCLUDED.allowed_genders,
          age_range_min = EXCLUDED.age_range_min,
          age_range_max = EXCLUDED.age_range_max,
          updated_at = NOW()
        RETURNING *
      `;

      const result = await getPool().query(sql, [
        contentType,
        String(contentId),
        ownerId,
        allow_reviews,
        allow_comments,
        allow_sharing,
        allow_tagging,
        allow_saving,
        allow_download,
        visibility,
        duration_type,
        expires_at,
        Array.isArray(allowed_user_ids) ? allowed_user_ids : [],
        JSON.stringify(allowed_locations),
        JSON.stringify(excluded_locations),
        gender_target,
        JSON.stringify(allowed_genders),
        age_range_min,
        age_range_max
      ]);

      return result.rows[0];
    } catch (error) {
      logErr('Error in UGCPrivacyService.upsertPrivacySettings:', error);
      throw error;
    }
  }

  /**
   * Check demographic and location heatmap filtering access
   * @param {Object} settings UGC Privacy Settings row
   * @param {Object} userProfile Requesting member profile { gender, age, country, region, city, lat, lng }
   * @returns {{ allowed: boolean, reason?: string }}
   */
  checkDemographicAccess(settings, userProfile = {}) {
    if (!settings) return { allowed: true };

    const {
      gender_target = 'all',
      allowed_genders = ['all'],
      age_range_min = 13,
      age_range_max = 120,
      allowed_locations = {},
      excluded_locations = {}
    } = settings;

    // 1. Gender Filter Check
    const userGender = (userProfile.gender || '').toLowerCase();
    const effectiveGenders = Array.isArray(allowed_genders) ? allowed_genders.map(g => String(g).toLowerCase()) : ['all'];
    const effectiveTarget = String(gender_target).toLowerCase();

    if (!effectiveGenders.includes('all')) {
      if (!userGender || !effectiveGenders.includes(userGender)) {
        return { allowed: false, reason: `Content is restricted to specific genders (${effectiveGenders.join(', ')})` };
      }
    } else if (effectiveTarget !== 'all') {
      if (!userGender || userGender !== effectiveTarget) {
        return { allowed: false, reason: `Content targets ${effectiveTarget} members only` };
      }
    }

    // 2. Age Range Filter Check
    const userAge = userProfile.age != null ? Number(userProfile.age) : null;
    if (userAge != null) {
      if (userAge < age_range_min || userAge > age_range_max) {
        return {
          allowed: false,
          reason: `Content requires viewer age between ${age_range_min} and ${age_range_max} years old`
        };
      }
    }

    // 3. Location / Heatmap Exclusion Check
    const uCountry = (userProfile.country || '').trim().toLowerCase();
    const uRegion = (userProfile.region || '').trim().toLowerCase();
    const uCity = (userProfile.city || '').trim().toLowerCase();
    const uCoords = (userProfile.lat != null && userProfile.lng != null) ? [Number(userProfile.lat), Number(userProfile.lng)] : null;

    const exclCountries = (excluded_locations.countries || []).map(c => String(c).trim().toLowerCase());
    const exclRegions = (excluded_locations.regions || []).map(r => String(r).trim().toLowerCase());
    const exclCities = (excluded_locations.cities || []).map(c => String(c).trim().toLowerCase());
    const exclPolygons = excluded_locations.polygons || [];

    if (uCountry && exclCountries.includes(uCountry)) {
      return { allowed: false, reason: `Content is excluded in your country (${userProfile.country})` };
    }
    if (uRegion && exclRegions.includes(uRegion)) {
      return { allowed: false, reason: `Content is excluded in your region (${userProfile.region})` };
    }
    if (uCity && exclCities.includes(uCity)) {
      return { allowed: false, reason: `Content is excluded in your city (${userProfile.city})` };
    }
    if (uCoords && exclPolygons.length > 0) {
      for (const poly of exclPolygons) {
        if (isPointInPolygon(uCoords, poly)) {
          return { allowed: false, reason: 'Content is excluded in your geofenced area' };
        }
      }
    }

    // 4. Location / Heatmap Inclusion (Allowed) Check
    const allowCountries = (allowed_locations.countries || []).map(c => String(c).trim().toLowerCase());
    const allowRegions = (allowed_locations.regions || []).map(r => String(r).trim().toLowerCase());
    const allowCities = (allowed_locations.cities || []).map(c => String(c).trim().toLowerCase());
    const allowPolygons = allowed_locations.polygons || [];

    const hasInclusionFilters = allowCountries.length > 0 || allowRegions.length > 0 || allowCities.length > 0 || allowPolygons.length > 0;
    if (hasInclusionFilters) {
      let isLocationPermitted = false;
      if (uCountry && allowCountries.includes(uCountry)) isLocationPermitted = true;
      if (uRegion && allowRegions.includes(uRegion)) isLocationPermitted = true;
      if (uCity && allowCities.includes(uCity)) isLocationPermitted = true;
      if (uCoords && allowPolygons.length > 0) {
        for (const poly of allowPolygons) {
          if (isPointInPolygon(uCoords, poly)) {
            isLocationPermitted = true;
            break;
          }
        }
      }

      if (!isLocationPermitted) {
        return { allowed: false, reason: 'Content is not available in your geographic location' };
      }
    }

    return { allowed: true };
  }

  /**
   * Check if a specific action (review, comment, share, tag, save, download, view) is allowed for requestingUserId
   */
  async checkPermission(contentType, contentId, requestingUserId, action, userProfile = null) {
    try {
      const settings = await this.getPrivacySettings(contentType, contentId);
      const isOwner = settings.owner_id && Number(settings.owner_id) === Number(requestingUserId);

      // Owner always has full permissions on their own content
      if (isOwner) {
        return { allowed: true, reason: 'Owner permission' };
      }

      // Check item expiration (duration)
      if (settings.expires_at && new Date() > new Date(settings.expires_at)) {
        return { allowed: false, reason: 'Content availability duration has expired' };
      }

      // Check demographic and location heatmap filtering if requesting viewing or interaction
      if (userProfile) {
        const demoCheck = this.checkDemographicAccess(settings, userProfile);
        if (!demoCheck.allowed) {
          return demoCheck;
        }
      }

      // Check overall visibility first
      if (settings.visibility === 'private' && !isOwner) {
        return { allowed: false, reason: 'Content is marked private by owner' };
      }

      let permissionSetting = 'everyone';
      switch (action) {
      case 'review':
        permissionSetting = settings.allow_reviews;
        break;
      case 'comment':
        permissionSetting = settings.allow_comments;
        break;
      case 'share':
        permissionSetting = settings.allow_sharing;
        break;
      case 'tag':
        permissionSetting = settings.allow_tagging;
        break;
      case 'save':
        permissionSetting = settings.allow_saving;
        break;
      case 'download':
        permissionSetting = settings.allow_download;
        break;
      case 'view':
        permissionSetting = settings.visibility;
        break;
      default:
        permissionSetting = 'everyone';
      }

      if (permissionSetting === 'none' || permissionSetting === 'private') {
        return { allowed: false, reason: `Owner has disabled ${action}s on this content` };
      }

      if (permissionSetting === 'followers') {
        if (!requestingUserId) {
          return { allowed: false, reason: 'Authentication required to access follower-only content' };
        }
        // Check if requestingUserId follows owner_id
        const followCheck = await getPool().query(
          'SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2',
          [requestingUserId, settings.owner_id]
        );
        if (followCheck.rows.length === 0) {
          return { allowed: false, reason: `Only followers can ${action} this content` };
        }
      }

      return { allowed: true, reason: 'Permitted by owner privacy settings' };
    } catch (error) {
      logErr('Error in UGCPrivacyService.checkPermission:', error);
      // Default to allowed for unconfigured items if error occurs
      return { allowed: true, reason: 'Fallback permission' };
    }
  }
}

module.exports = new UGCPrivacyService();
