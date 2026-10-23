/**
 * Stercs Editor & Studio Routes
 * FingerMobile Protocol™ - Studio Media Creation Engine
 * Full PostgreSQL persistence for projects, templates, themes, and media library assets.
 */

const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Optional authentication helper: identifies user or defaults to guest/demo creator (id: 4)
const resolveUser = (req) => {
  return req.user?.id || req.body?.user_id || req.query?.user_id || 4;
};

// -------------------------------------------------------------
// 1. PROJECTS
// -------------------------------------------------------------

// GET /api/stercs/projects
router.get('/projects', async (req, res) => {
  try {
    const userId = resolveUser(req);
    const { rows } = await db.query(
      `SELECT * FROM stercs_projects 
       WHERE member_id = $1 OR user_id = $2 OR member_id IS NULL
       ORDER BY updated_at DESC LIMIT 50`,
      [parseInt(userId) || 4, String(userId)]
    );
    res.json({
      success: true,
      projects: rows,
      count: rows.length
    });
  } catch (error) {
    logger.error('❌ Get Stercs projects failed:', error.message);
    res.status(500).json({ success: false, error: 'Failed to retrieve Stercs projects' });
  }
});

// POST /api/stercs/projects
router.post('/projects', async (req, res) => {
  try {
    const userId = resolveUser(req);
    const { name, description = '', template = 'blank', canvas_data = {} } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Project name required' });
    }

    const projectId = uuidv4();
    const query = `
      INSERT INTO stercs_projects (
        id, member_id, user_id, name, description, status, template, canvas_data, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, 'draft', $6, $7::jsonb, NOW(), NOW())
      RETURNING *
    `;

    const { rows } = await db.query(query, [
      projectId,
      parseInt(userId) || 4,
      String(userId),
      name,
      description,
      template,
      JSON.stringify(canvas_data)
    ]);

    logger.info(`✅ Stercs project created: ${name} (ID: ${projectId})`);
    res.status(201).json({
      success: true,
      project: rows[0],
      message: 'Project created successfully'
    });
  } catch (error) {
    logger.error('❌ Create Stercs project failed:', error.message);
    res.status(500).json({ success: false, error: 'Failed to create Stercs project' });
  }
});

// GET /api/stercs/projects/:id
router.get('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'SELECT * FROM stercs_projects WHERE id::text = $1 LIMIT 1',
      [String(id)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, project: rows[0] });
  } catch (error) {
    logger.error('❌ Get Stercs project failed:', error.message);
    res.status(500).json({ success: false, error: 'Failed to retrieve Stercs project' });
  }
});

// PUT /api/stercs/projects/:id
router.put('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, template, canvas_data, thumbnail_url } = req.body;

    const existing = await db.query('SELECT * FROM stercs_projects WHERE id::text = $1', [String(id)]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const cur = existing.rows[0];
    const updatedName = name !== undefined ? name : cur.name;
    const updatedDesc = description !== undefined ? description : cur.description;
    const updatedStatus = status !== undefined ? status : cur.status;
    const updatedTemplate = template !== undefined ? template : cur.template;
    const updatedCanvas = canvas_data !== undefined ? JSON.stringify(canvas_data) : JSON.stringify(cur.canvas_data || {});
    const updatedThumb = thumbnail_url !== undefined ? thumbnail_url : cur.thumbnail_url;

    const query = `
      UPDATE stercs_projects 
      SET name = $1, description = $2, status = $3, template = $4, canvas_data = $5::jsonb, thumbnail_url = $6, updated_at = NOW()
      WHERE id::text = $7
      RETURNING *
    `;

    const { rows } = await db.query(query, [
      updatedName, updatedDesc, updatedStatus, updatedTemplate, updatedCanvas, updatedThumb, String(id)
    ]);

    res.json({
      success: true,
      project: rows[0],
      message: 'Project updated successfully'
    });
  } catch (error) {
    logger.error('❌ Update Stercs project failed:', error.message);
    res.status(500).json({ success: false, error: 'Failed to update Stercs project' });
  }
});

// DELETE /api/stercs/projects/:id
router.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM stercs_projects WHERE id::text = $1 RETURNING id', [String(id)]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    logger.error('❌ Delete Stercs project failed:', error.message);
    res.status(500).json({ success: false, error: 'Failed to delete project' });
  }
});

// POST /api/stercs/projects/:id/publish
router.post('/projects/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `UPDATE stercs_projects 
       SET status = 'published', published_at = NOW(), updated_at = NOW() 
       WHERE id::text = $1 
       RETURNING *`,
      [String(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({
      success: true,
      message: 'Project published successfully',
      project: result.rows[0],
      publicUrl: `https://stercs.fingermobileprotocol.com/preview/${id}`
    });
  } catch (error) {
    logger.error('❌ Publish Stercs project failed:', error.message);
    res.status(500).json({ success: false, error: 'Failed to publish Stercs project' });
  }
});

// -------------------------------------------------------------
// 2. THEMES
// -------------------------------------------------------------

// GET /api/stercs/themes
router.get('/themes', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM stercs_themes ORDER BY created_at DESC');
    res.json({ success: true, themes: rows, count: rows.length });
  } catch (error) {
    logger.error('❌ Get themes error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to load themes' });
  }
});

// POST /api/stercs/themes
router.post('/themes', async (req, res) => {
  try {
    const { name, category = 'general', config = {}, preview_url = '' } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Theme name required' });
    }

    const themeId = uuidv4();
    const query = `
      INSERT INTO stercs_themes (id, name, category, is_preset, config, created_by, preview_url, created_at, updated_at)
      VALUES ($1, $2, $3, false, $4::jsonb, $5, $6, NOW(), NOW())
      RETURNING *
    `;

    const { rows } = await db.query(query, [
      themeId, name, category, JSON.stringify(config), String(resolveUser(req)), preview_url
    ]);

    res.status(201).json({ success: true, theme: rows[0], message: 'Theme saved' });
  } catch (error) {
    logger.error('❌ Create theme error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to save theme' });
  }
});

// -------------------------------------------------------------
// 3. MEDIA LIBRARY ASSETS
// -------------------------------------------------------------

// GET /api/stercs/media-library
router.get('/media-library', async (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM stercs_media_assets';
    const params = [];

    if (type && type !== 'all') {
      params.push(type);
      query += ' WHERE type = $1';
    }

    query += ' ORDER BY created_at DESC LIMIT 100';

    const { rows } = await db.query(query, params);
    res.json({ success: true, assets: rows, count: rows.length });
  } catch (error) {
    logger.error('❌ Get media library error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to load media library' });
  }
});

// POST /api/stercs/media-library
router.post('/media-library', async (req, res) => {
  try {
    const { name, type = 'image', url, thumbnail_url, size_bytes = 0, duration = 0, metadata = {} } = req.body;

    if (!name || !url) {
      return res.status(400).json({ success: false, error: 'Asset name and URL are required' });
    }

    const assetId = uuidv4();
    const query = `
      INSERT INTO stercs_media_assets (
        id, user_id, name, type, url, thumbnail_url, size_bytes, duration, metadata, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, NOW(), NOW())
      RETURNING *
    `;

    const { rows } = await db.query(query, [
      assetId, String(resolveUser(req)), name, type, url, thumbnail_url || url, size_bytes, duration, JSON.stringify(metadata)
    ]);

    res.status(201).json({ success: true, asset: rows[0], message: 'Asset added to media library' });
  } catch (error) {
    logger.error('❌ Add media asset error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to add media asset' });
  }
});

// DELETE /api/stercs/media-library/:id
router.delete('/media-library/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM stercs_media_assets WHERE id::text = $1 RETURNING id', [String(id)]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Asset not found' });
    }
    res.json({ success: true, message: 'Asset deleted' });
  } catch (error) {
    logger.error('❌ Delete media asset error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to delete asset' });
  }
});

// -------------------------------------------------------------
// 4. TEMPLATES & STATS
// -------------------------------------------------------------

// GET /api/stercs/templates
router.get('/templates', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM stercs_templates ORDER BY created_at DESC');
    res.json({ success: true, templates: rows, count: rows.length });
  } catch (error) {
    logger.error('❌ Get templates error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to load templates' });
  }
});

// GET /api/stercs/stats
router.get('/stats', async (req, res) => {
  try {
    const projects = await db.query('SELECT count(*) FROM stercs_projects');
    const published = await db.query('SELECT count(*) FROM stercs_projects WHERE status = \'published\'');
    const assets = await db.query('SELECT count(*) FROM stercs_media_assets');
    const themes = await db.query('SELECT count(*) FROM stercs_themes');

    res.json({
      success: true,
      stats: {
        totalProjects: parseInt(projects.rows[0].count) || 0,
        publishedProjects: parseInt(published.rows[0].count) || 0,
        mediaAssets: parseInt(assets.rows[0].count) || 0,
        availableThemes: parseInt(themes.rows[0].count) || 0,
        renderEngine: 'Stercs WebGL/WebCodecs v3.4',
        activePipelineStatus: 'operational'
      }
    });
  } catch (error) {
    logger.error('❌ Stercs stats error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to load stats' });
  }
});

// -------------------------------------------------------------
// 5. DEFCON & COMMAND FIVE-LEVEL ALERT SYSTEM
// -------------------------------------------------------------

const DISPATCH_EMAILS = [
  'obinnambah100@gmail.com',
  'gracelinkbustech@gmail.com',
  'obinnambah@fingermobileprotocol.com',
  'eunicembah@gmail.com',
  'philipatiks@yahoo.com'
];

// GET /api/stercs/defcon - Get current defense condition state
router.get('/defcon', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM stercs_defcon_state ORDER BY id ASC LIMIT 1');
    const state = rows[0] || { current_level: 5, status: 'peace_time', is_platform_shutdown: false };
    res.json({
      success: true,
      data: {
        currentLevel: state.current_level,
        status: state.status,
        isPlatformShutdown: state.is_platform_shutdown,
        emergencyDispatchedAt: state.emergency_dispatched_at,
        dispatchedRecipients: state.dispatched_recipients || DISPATCH_EMAILS,
        requiresPromptCode: state.current_level === 1 && !state.is_platform_shutdown,
        lastRebootAt: state.last_reboot_at
      }
    });
  } catch (error) {
    logger.error('❌ Get DefCon state error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to load DefCon state' });
  }
});

// POST /api/stercs/defcon - Update DefCon readiness level
router.post('/defcon', async (req, res) => {
  try {
    const { level, reason = 'Operator directive' } = req.body;
    const parsedLevel = parseInt(level, 10);
    if (!parsedLevel || parsedLevel < 1 || parsedLevel > 5) {
      return res.status(400).json({ success: false, error: 'Level must be an integer between 1 and 5' });
    }

    let status = 'peace_time';
    let promptCode = null;
    let emergencyDispatchedAt = null;

    if (parsedLevel === 4) status = 'heightened_intelligence';
    if (parsedLevel === 3) status = 'force_readiness_escalation';
    if (parsedLevel === 2) status = 'critical_threat_mitigation';
    if (parsedLevel === 1) {
      status = 'maximum_emergency_promts';
      promptCode = String(Math.floor(100000 + Math.random() * 900000));
      emergencyDispatchedAt = new Date().toISOString();
      logger.warn(`🚨 DEFCON 1 ACTIVATED! PRO-MTS automated emergency dispatched to: ${DISPATCH_EMAILS.join(', ')}`);
      logger.warn(`🔑 Prompt AI 6-Digit Numeric Token generated: ${promptCode}`);
    }

    const { rows } = await db.query(
      `UPDATE stercs_defcon_state 
       SET current_level = $1, status = $2, active_prompt_code = $3, 
           emergency_dispatched_at = COALESCE($4, emergency_dispatched_at),
           dispatched_recipients = $5::jsonb, shutdown_reason = $6, updated_at = NOW()
       WHERE id = 1
       RETURNING *`,
      [parsedLevel, status, promptCode, emergencyDispatchedAt, JSON.stringify(DISPATCH_EMAILS), reason]
    );

    res.json({
      success: true,
      message: `DefCon state shifted to Level ${parsedLevel}`,
      data: {
        currentLevel: rows[0].current_level,
        status: rows[0].status,
        isPlatformShutdown: rows[0].is_platform_shutdown,
        emergencyDispatchedAt: rows[0].emergency_dispatched_at,
        dispatchedRecipients: DISPATCH_EMAILS,
        requiresPromptCode: parsedLevel === 1,
        // In local development, return simulated token in response for immediate testing ease
        devPromptCodeNotice: parsedLevel === 1 ? promptCode : undefined
      }
    });
  } catch (error) {
    logger.error('❌ Set DefCon state error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to update DefCon state' });
  }
});

// POST /api/stercs/defcon/verify-shutdown - Conclusive, Irrevocable, Absolute all Console Imminent Shutdown
router.post('/defcon/verify-shutdown', async (req, res) => {
  try {
    const { promptCode } = req.body;
    if (!promptCode) {
      return res.status(400).json({ success: false, error: '6-digit Prompt AI code is required' });
    }

    const { rows } = await db.query('SELECT active_prompt_code FROM stercs_defcon_state WHERE id = 1');
    const expected = rows[0]?.active_prompt_code;

    // Allow expected code or master emergency bypass code '749822'
    if (String(promptCode).trim() !== String(expected) && String(promptCode).trim() !== '749822') {
      return res.status(401).json({ success: false, error: 'Invalid 6-digit Prompt AI numeric token' });
    }

    await db.query(
      `UPDATE stercs_defcon_state 
       SET is_platform_shutdown = TRUE, status = 'absolute_platform_shutdown', updated_at = NOW() 
       WHERE id = 1`
    );

    logger.error('⛔ CONCLUSIVE, IRREVOCABLE, ABSOLUTE ALL CONSOLE IMMINENT SHUTDOWN EXECUTED. PLATFORM OFFLINE.');

    res.json({
      success: true,
      message: 'Conclusive, Irrevocable, Absolute All Console Imminent Shutdown executed. Platform taken Offline.',
      isPlatformShutdown: true
    });
  } catch (error) {
    logger.error('❌ DefCon shutdown error:', error.message);
    res.status(500).json({ success: false, error: 'Shutdown execution failed' });
  }
});

// POST /api/stercs/defcon/reboot - Sovereign Cold-Boot & Platform Restoration
router.post('/defcon/reboot', async (req, res) => {
  try {
    const { rebootOrder, backupCode } = req.body;
    // Sovereign validation: Order must be specified and backup code verified
    if (!rebootOrder || !backupCode) {
      return res.status(400).json({ success: false, error: 'SuperAdmin Reboot Order and Backup Code required' });
    }

    // Accept sovereign PIN '749822' or 'SOVEREIGN-BOOT-2026'
    if (String(backupCode).trim() !== '749822' && String(backupCode).trim() !== 'SOVEREIGN-BOOT-2026') {
      return res.status(403).json({ success: false, error: 'Invalid Cryptographic Backup Code' });
    }

    await db.query(
      `UPDATE stercs_defcon_state 
       SET current_level = 5, status = 'peace_time', is_platform_shutdown = FALSE, 
           active_prompt_code = NULL, last_reboot_at = NOW(), updated_at = NOW() 
       WHERE id = 1`
    );

    logger.info(`✅ Sovereign platform cold-boot authorized by SuperAdmin: ${rebootOrder}. System restored to DEFCON 5.`);

    res.json({
      success: true,
      message: 'Platform restored to active status at DEFCON 5 peace time readiness.',
      isPlatformShutdown: false,
      currentLevel: 5
    });
  } catch (error) {
    logger.error('❌ DefCon reboot error:', error.message);
    res.status(500).json({ success: false, error: 'Platform reboot failed' });
  }
});

// -------------------------------------------------------------
// 6. UNIVERSAL PLATFORM HEATMAP & GEO-RESTRICTIONS
// -------------------------------------------------------------

// GET /api/stercs/geo-restrictions
router.get('/geo-restrictions', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM stercs_geo_restrictions ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    logger.error('❌ Get geo-restrictions error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to retrieve geo-restrictions' });
  }
});

// POST /api/stercs/geo-restrictions
router.post('/geo-restrictions', async (req, res) => {
  try {
    const {
      region_type = 'district',
      region_name,
      freeze_all_services = false,
      frozen_services = [],
      blocked_ips = [],
      blocked_macs = [],
      severity = 'warning',
      reason = ''
    } = req.body;

    if (!region_name) {
      return res.status(400).json({ success: false, error: 'Region name is required' });
    }

    const { rows } = await db.query(
      `INSERT INTO stercs_geo_restrictions (
        region_type, region_name, freeze_all_services, frozen_services, blocked_ips, blocked_macs, severity, reason, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, $7, $8, TRUE, NOW(), NOW())
      RETURNING *`,
      [
        region_type,
        region_name,
        freeze_all_services,
        JSON.stringify(frozen_services),
        JSON.stringify(blocked_ips),
        JSON.stringify(blocked_macs),
        severity,
        reason
      ]
    );

    logger.warn(`🛡️ Universal Geo-Restriction enforced on ${region_name} (${region_type}) - Severity: ${severity}`);

    res.status(201).json({
      success: true,
      message: `Geo-restriction enforced on ${region_name}`,
      data: rows[0]
    });
  } catch (error) {
    logger.error('❌ Create geo-restriction error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to create geo-restriction' });
  }
});

// DELETE /api/stercs/geo-restrictions/:id
router.delete('/geo-restrictions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM stercs_geo_restrictions WHERE id = $1', [parseInt(id, 10)]);
    res.json({ success: true, message: 'Geo-restriction lifted' });
  } catch (error) {
    logger.error('❌ Delete geo-restriction error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to delete geo-restriction' });
  }
});

module.exports = router;

