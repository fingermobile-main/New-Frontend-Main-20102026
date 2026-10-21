/**
 * Pages Permission Controller
 * Canonical directory and granular access control for platform routes and screens
 */

const db = require('../db');
const logger = require('../utils/logger');

const pagesPermissionController = {
  // 1. Get Canonical Pages Directory
  getPagesDirectory: async (req, res) => {
    try {
      const category = req.query.category;
      const minTier = req.query.minTier;
      const search = req.query.search ? `%${req.query.search.toLowerCase()}%` : null;

      let query = 'SELECT * FROM rbac_pages_directory WHERE 1=1';
      const params = [];

      if (category && category !== 'ALL') {
        params.push(category);
        query += ` AND category = $${params.length}`;
      }

      if (minTier && minTier !== 'ALL') {
        params.push(minTier);
        query += ` AND min_role_tier = $${params.length}`;
      }

      if (search) {
        params.push(search);
        query += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(path) LIKE $${params.length})`;
      }

      query += ' ORDER BY category ASC, title ASC';

      const result = await db.query(query, params);
      res.json({
        success: true,
        pages: result.rows,
        total: result.rowCount
      });
    } catch (err) {
      logger.error('Error fetching pages directory:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch pages directory', error: err.message });
    }
  },

  // 2. Update Page Permissions & Maintenance Lockdown
  updatePagePermissions: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        minRoleTier, min_role_tier,
        isPublicMemberFacing, is_public_member_facing,
        isBackofficeOnly, is_backoffice_only,
        isModeratorOnly, is_moderator_only,
        isDistinguishedOnly, is_distinguished_only,
        isExecutiveOnly, is_executive_only,
        isMaintenanceLocked, is_maintenance_locked,
        hasConfidentialTelemetry, has_confidential_telemetry,
        confidentialFields, confidential_fields,
        description
      } = req.body;

      const finalMinTier = min_role_tier !== undefined ? min_role_tier : minRoleTier;
      const finalPublic = is_public_member_facing !== undefined ? is_public_member_facing : isPublicMemberFacing;
      const finalBackoffice = is_backoffice_only !== undefined ? is_backoffice_only : isBackofficeOnly;
      const finalMod = is_moderator_only !== undefined ? is_moderator_only : isModeratorOnly;
      const finalDist = is_distinguished_only !== undefined ? is_distinguished_only : isDistinguishedOnly;
      const finalExec = is_executive_only !== undefined ? is_executive_only : isExecutiveOnly;
      const finalMaint = is_maintenance_locked !== undefined ? is_maintenance_locked : isMaintenanceLocked;
      const finalConf = has_confidential_telemetry !== undefined ? has_confidential_telemetry : hasConfidentialTelemetry;
      const finalFields = confidential_fields !== undefined ? confidential_fields : confidentialFields;

      const result = await db.query(`
        UPDATE rbac_pages_directory
        SET
          min_role_tier = COALESCE($1, min_role_tier),
          is_public_member_facing = COALESCE($2, is_public_member_facing),
          is_backoffice_only = COALESCE($3, is_backoffice_only),
          is_moderator_only = COALESCE($4, is_moderator_only),
          is_distinguished_only = COALESCE($5, is_distinguished_only),
          is_executive_only = COALESCE($6, is_executive_only),
          is_maintenance_locked = COALESCE($7, is_maintenance_locked),
          has_confidential_telemetry = COALESCE($8, has_confidential_telemetry),
          confidential_fields = COALESCE($9::jsonb, confidential_fields),
          description = COALESCE($10, description),
          updated_at = NOW()
        WHERE id = $11
        RETURNING *
      `, [
        finalMinTier,
        finalPublic,
        finalBackoffice,
        finalMod,
        finalDist,
        finalExec,
        finalMaint,
        finalConf,
        finalFields ? JSON.stringify(finalFields) : null,
        description,
        id
      ]);

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Page not found in canonical directory' });
      }

      res.json({
        success: true,
        message: 'Page access permissions updated successfully',
        page: result.rows[0]
      });
    } catch (err) {
      logger.error('Error updating page permissions:', err);
      res.status(500).json({ success: false, message: 'Failed to update page permissions', error: err.message });
    }
  },

  // 3. Register New Page in Directory
  registerPage: async (req, res) => {
    try {
      const {
        path,
        title,
        category,
        minRoleTier = 'PUBLIC',
        isPublicMemberFacing = true,
        isBackofficeOnly = false,
        isModeratorOnly = false,
        isDistinguishedOnly = false,
        isExecutiveOnly = false,
        hasConfidentialTelemetry = false,
        confidentialFields = []
      } = req.body;

      if (!path || !title || !category) {
        return res.status(400).json({ success: false, message: 'path, title, and category are required' });
      }

      const id = `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const result = await db.query(`
        INSERT INTO rbac_pages_directory (
          id, path, title, category, min_role_tier,
          is_public_member_facing, is_backoffice_only, is_moderator_only,
          is_distinguished_only, is_executive_only, has_confidential_telemetry, confidential_fields
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb)
        ON CONFLICT (path) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          min_role_tier = EXCLUDED.min_role_tier,
          updated_at = NOW()
        RETURNING *
      `, [
        id,
        path,
        title,
        category,
        minRoleTier,
        isPublicMemberFacing,
        isBackofficeOnly,
        isModeratorOnly,
        isDistinguishedOnly,
        isExecutiveOnly,
        hasConfidentialTelemetry,
        JSON.stringify(confidentialFields)
      ]);

      res.status(201).json({
        success: true,
        message: 'Page registered in directory',
        page: result.rows[0]
      });
    } catch (err) {
      logger.error('Error registering page:', err);
      res.status(500).json({ success: false, message: 'Failed to register page', error: err.message });
    }
  },

  // 4. Field Masking Rules
  getMaskingRules: async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM rbac_field_masking_rules ORDER BY min_clearance_required DESC, field_name ASC');
      res.json({ success: true, rules: result.rows });
    } catch (err) {
      logger.error('Error fetching masking rules:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch masking rules', error: err.message });
    }
  },

  updateMaskingRule: async (req, res) => {
    try {
      const { id } = req.params;
      const { endpointOrContext, fieldName, minClearanceRequired, maskingStrategy, description } = req.body;

      const result = await db.query(`
        UPDATE rbac_field_masking_rules
        SET
          endpoint_or_context = COALESCE($1, endpoint_or_context),
          field_name = COALESCE($2, field_name),
          min_clearance_required = COALESCE($3, min_clearance_required),
          masking_strategy = COALESCE($4, masking_strategy),
          description = COALESCE($5, description),
          updated_at = NOW()
        WHERE id = $6
        RETURNING *
      `, [endpointOrContext, fieldName, minClearanceRequired, maskingStrategy, description, id]);

      res.json({ success: true, message: 'Masking rule updated', rule: result.rows[0] });
    } catch (err) {
      logger.error('Error updating masking rule:', err);
      res.status(500).json({ success: false, message: 'Failed to update masking rule', error: err.message });
    }
  }
};

module.exports = pagesPermissionController;
