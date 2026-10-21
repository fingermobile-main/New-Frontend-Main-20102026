const { identityDb, contentDb } = require('../db/db');
const logger = require('../config/logger');

// Fallback baseline assets if database is empty or queries are pending
const BASELINE_ASSETS = {
  FORGOT_PASSWORD: {
    screenType: 'FORGOT_PASSWORD',
    storageUrl: '/assets/branding/backgrounds/FingerMobile Forgot password.webp',
    fileFormat: 'webp',
    ownerName: 'FingerMobile Protocol Studio',
    disclaimerText: '© 2026 FingerMobile Protocol. Official Platform Identity Background.',
    trendingScore: 95.0,
    isActive: true,
    holdMs: 4000,
    durationMs: 4000,
  },
  LOGIN: {
    screenType: 'LOGIN',
    storageUrl: '/assets/branding/backgrounds/FingerMobile Login screen Background image.webp',
    fileFormat: 'webp',
    ownerName: 'FingerMobile Protocol Studio',
    disclaimerText: '© 2026 FingerMobile Protocol. Official Platform Identity Background.',
    trendingScore: 98.0,
    isActive: true,
    holdMs: 4000,
    durationMs: 4000,
  },
  ONBOARDING: {
    screenType: 'ONBOARDING',
    storageUrl: '/assets/branding/backgrounds/FingerMobile Login screen Background image.webp',
    fileFormat: 'webp',
    ownerName: 'FingerMobile Protocol Studio',
    disclaimerText: '© 2026 FingerMobile Protocol. Official Platform Identity Background.',
    trendingScore: 96.0,
    isActive: true,
    holdMs: 4000,
    durationMs: 4000,
  },
  REGISTER: {
    screenType: 'REGISTER',
    storageUrl: '/assets/branding/backgrounds/FingerMobile Login screen Background image.webp',
    fileFormat: 'webp',
    ownerName: 'FingerMobile Protocol Studio',
    disclaimerText: '© 2026 FingerMobile Protocol. Official Platform Identity Background.',
    trendingScore: 97.0,
    isActive: true,
    holdMs: 4000,
    durationMs: 4000,
  },
  SPLASH: {
    screenType: 'SPLASH',
    storageUrl: '/assets/branding/fingermobile/FRONT copy.webp',
    fileFormat: 'webp',
    ownerName: 'FingerMobile Protocol Studio',
    disclaimerText: '© 2026 FingerMobile Protocol. Official Splash Asset.',
    trendingScore: 99.0,
    isActive: true,
    holdMs: 4000,
    durationMs: 4000,
  },
};

class BrandingRotationService {
  /**
   * Retrieve active branding assets for client screens
   */
  async getActiveBranding() {
    try {
      const now = new Date();
      const query = `
        SELECT id, screen_type, storage_url, file_format, owner_name, owner_id, 
               owner_consent_granted, disclaimer_text, trending_score, is_active, 
               starts_at, expires_at
        FROM branding_assets
        WHERE is_active = true 
          AND starts_at <= $1 
          AND expires_at > $1
        ORDER BY trending_score DESC, created_at DESC
      `;
      const result = await identityDb.query(query, [now]);
      const assetsByScreen = { ...BASELINE_ASSETS };

      for (const row of result.rows) {
        const type = row.screen_type;
        // The first match per screen type has highest trending score
        if (!assetsByScreen[type] || assetsByScreen[type].ownerName === 'FingerMobile Protocol Studio') {
          assetsByScreen[type] = {
            id: row.id,
            screenType: row.screen_type,
            storageUrl: row.storage_url,
            fileFormat: row.file_format,
            ownerName: row.owner_name,
            ownerId: row.owner_id,
            ownerConsentGranted: row.owner_consent_granted,
            disclaimerText: row.disclaimer_text,
            trendingScore: parseFloat(row.trending_score) || 0,
            isActive: row.is_active,
            startsAt: row.starts_at,
            expiresAt: row.expires_at,
            holdMs: 4000,
            durationMs: 4000,
          };
        }
      }

      return assetsByScreen;
    } catch (error) {
      logger.error('Error fetching active branding assets, using baseline fallback:', error);
      return BASELINE_ASSETS;
    }
  }

  /**
   * 48-Hour Rotation Engine:
   * 1. Inspects top 3 trending images from Trends.
   * 2. Checks owner consent status.
   * 3. Dispatches 48-hour advance broadcast to platform members.
   * 4. Activates consenting candidates for next 48-hour cycle or retains verified assets.
   */
  async runRotationCycle() {
    try {
      logger.info('Starting 48-Hour Branding Rotation Evaluation...');
      const now = new Date();
      const rotationWindowEnd = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48-hour cycle

      // Step 1: Deactivate any expired assets
      await identityDb.query(`
        UPDATE branding_assets
        SET is_active = false
        WHERE expires_at <= $1 AND is_active = true
      `, [now]);

      // Step 2: Fetch top trending posts/images from contentDb
      let trendingCandidates = [];
      try {
        const trendsQuery = `
          SELECT 
            p.id as post_id,
            p.author_id,
            COALESCE(p.image_url, p.media_url, '') as image_url,
            COALESCE(p.likes_count, 0) as likes_count,
            COALESCE(p.replies_count, 0) as comments_count,
            COALESCE(p.shares_count, 0) as shares_count,
            ROUND(
              (COALESCE(p.likes_count, 0) * 1.0 + COALESCE(p.replies_count, 0) * 2.0 + COALESCE(p.shares_count, 0) * 3.0) 
              / GREATEST(EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600.0, 1.0),
              2
            ) as trending_score
          FROM posts p
          WHERE (p.image_url IS NOT NULL OR p.media_url IS NOT NULL)
            AND (p.image_url <> '' OR p.media_url <> '')
          ORDER BY trending_score DESC
          LIMIT 3
        `;
        const trendsResult = await contentDb.query(trendsQuery);
        trendingCandidates = trendsResult.rows;
      } catch (err) {
        logger.warn('Could not query contentDb for trending images (using active registry):', err.message);
      }

      // Step 3: Check candidate assets and dispatch permit/consent & broadcasts
      const screenTypes = ['LOGIN', 'FORGOT_PASSWORD', 'ONBOARDING'];
      let screenIndex = 0;

      for (const candidate of trendingCandidates) {
        if (!candidate.image_url) continue;
        const targetScreen = screenTypes[screenIndex % screenTypes.length];
        screenIndex++;

        // Check if candidate already registered in branding_assets
        const existing = await identityDb.query(
          'SELECT id, owner_consent_granted, is_active FROM branding_assets WHERE storage_url = $1 AND screen_type = $2',
          [candidate.image_url, targetScreen]
        );

        if (existing.rows.length === 0) {
          // Resolve author username
          let authorName = 'FingerMobile Creator';
          try {
            const userRes = await identityDb.query('SELECT username, first_name, last_name FROM users WHERE id = $1', [candidate.author_id]);
            if (userRes.rows.length > 0) {
              authorName = userRes.rows[0].username || `${userRes.rows[0].first_name} ${userRes.rows[0].last_name}`.trim();
            }
          } catch (uErr) {
            // ignore
          }

          const disclaimerText = `Featured Trending Creation by @${authorName}. Used with creator permission under FingerMobile Protocol 48h showcase license.`;

          // Register new candidate
          const insertRes = await identityDb.query(`
            INSERT INTO branding_assets (
              screen_type, storage_url, file_format, owner_name, owner_id,
              owner_consent_granted, disclaimer_text, trending_score, is_active,
              starts_at, expires_at
            ) VALUES ($1, $2, 'webp', $3, $4, false, $5, $6, false, $7, $8)
            RETURNING id
          `, [
            targetScreen,
            candidate.image_url,
            authorName,
            candidate.author_id ? String(candidate.author_id) : null,
            disclaimerText,
            candidate.trending_score || 90.0,
            now,
            rotationWindowEnd
          ]);

          const assetId = insertRes.rows[0].id;

          // Dispatch Creator Permit Request Notification
          await identityDb.query(`
            INSERT INTO branding_consent_logs (
              asset_id, owner_id, notification_type, status, message, disclaimer_preview
            ) VALUES ($1, $2, 'OWNER_PERMIT_REQUEST', 'PENDING', $3, $4)
          `, [
            assetId,
            candidate.author_id ? String(candidate.author_id) : null,
            `Congratulations @${authorName}! Your trending post has been nominated to be featured as FingerMobile's ${targetScreen} background for the next 48-hour rotation. Please confirm your consent to grant showcase permission.`,
            disclaimerText
          ]);

          // Dispatch 48-Hour Platform Broadcast
          await identityDb.query(`
            INSERT INTO branding_consent_logs (
              asset_id, owner_id, notification_type, status, message, disclaimer_preview
            ) VALUES ($1, NULL, 'PLATFORM_BROADCAST', 'BROADCAST_SENT', $2, $3)
          `, [
            assetId,
            `Platform Broadcast: Trending artwork by @${authorName} is scheduled for FingerMobile's 48-Hour featured screen rotation starting in 48 hours pending creator consent.`,
            disclaimerText
          ]);

          logger.info(`Dispatched owner permit request and broadcast for trending asset ${assetId} (@${authorName})`);
        } else {
          // If consent was granted, activate for 48 hours
          const assetRow = existing.rows[0];
          if (assetRow.owner_consent_granted && !assetRow.is_active) {
            await identityDb.query(`
              UPDATE branding_assets
              SET is_active = true, starts_at = $1, expires_at = $2
              WHERE id = $3
            `, [now, rotationWindowEnd, assetRow.id]);
            logger.info(`Activated verified trending asset ${assetRow.id} for 48-hour rotation.`);
          }
        }
      }

      logger.info('48-Hour Branding Rotation Evaluation complete.');
    } catch (error) {
      logger.error('Error during branding rotation cycle:', error);
    }
  }

  /**
   * Process creator permit response
   */
  async submitConsent(assetId, granted, _ownerId) {
    try {
      const now = new Date();
      const rotationWindowEnd = new Date(now.getTime() + 48 * 60 * 60 * 1000);

      const updateAsset = await identityDb.query(`
        UPDATE branding_assets
        SET owner_consent_granted = $1,
            is_active = $1,
            starts_at = CASE WHEN $1 = true THEN $2 ELSE starts_at END,
            expires_at = CASE WHEN $1 = true THEN $3 ELSE expires_at END
        WHERE id = $4
        RETURNING *
      `, [granted, now, rotationWindowEnd, assetId]);

      if (updateAsset.rows.length === 0) {
        return { success: false, message: 'Asset not found' };
      }

      await identityDb.query(`
        UPDATE branding_consent_logs
        SET status = $1, responded_at = NOW()
        WHERE asset_id = $2
      `, [granted ? 'GRANTED' : 'DECLINED', assetId]);

      return {
        success: true,
        message: granted
          ? 'Consent granted. Asset scheduled for 48-hour active rotation.'
          : 'Consent declined. Previous verified platform branding retained.',
        asset: updateAsset.rows[0]
      };
    } catch (error) {
      logger.error('Error submitting branding consent:', error);
      throw error;
    }
  }

  /**
   * Get all branding assets for admin overview
   */
  async getAllAssets() {
    try {
      const result = await identityDb.query(`
        SELECT * FROM branding_assets ORDER BY created_at DESC LIMIT 50
      `);
      return result.rows;
    } catch (error) {
      logger.error('Error fetching all branding assets:', error);
      return [];
    }
  }

  /**
   * Start scheduled rotation watcher (every 1 hour checks 48-hour windows)
   */
  startScheduler() {
    logger.info('Initializing 48-hour branding rotation scheduler...');
    // Run an initial evaluation cycle on startup
    setTimeout(() => {
      this.runRotationCycle();
    }, 5000);

    // Check hourly for 48-hour window transitions
    setInterval(() => {
      this.runRotationCycle();
    }, 60 * 60 * 1000);
  }
}

const brandingRotationService = new BrandingRotationService();

module.exports = brandingRotationService;
