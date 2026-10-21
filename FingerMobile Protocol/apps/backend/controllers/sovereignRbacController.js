/**
 * Sovereign RBAC Controller
 * Powers the Users Permission Console, Back Office Portals, Badge Privileges & Moderator Command Centers
 */

const db = require('../db');
const logger = require('../utils/logger');
const { PRIMARY_ADMIN_EMAILS, SECONDARY_ADMIN_EMAILS } = require('../middleware/executiveFieldFilter');

// Helper to determine sovereign role tier
function computeRoleTier(user) {
  const email = (user?.email || '').toLowerCase().trim();
  if (PRIMARY_ADMIN_EMAILS.includes(email)) return 'PRIMARY_SUPER_ADMIN';
  if (SECONDARY_ADMIN_EMAILS.includes(email)) return 'SECONDARY_ADMIN_CFO';
  if (user?.role === 'admin' || user?.role === 'superadmin') return 'PRIMARY_SUPER_ADMIN';
  return 'PLATFORM_MEMBER';
}

const sovereignRbacController = {
  // 1. Overview Metrics for Console
  getOverview: async (req, res) => {
    try {
      const [usersCount, staffCount, badgeCount, distCount, modCount, pagesCount] = await Promise.all([
        db.query('SELECT COUNT(*) FROM users'),
        db.query('SELECT COUNT(*) FROM rbac_staff_assignments WHERE is_active = TRUE'),
        db.query('SELECT COUNT(*) FROM rbac_badge_tier_privileges'),
        db.query('SELECT COUNT(*) FROM rbac_user_distinguished_assignments WHERE is_active = TRUE'),
        db.query('SELECT COUNT(*) FROM rbac_moderator_scopes WHERE is_active = TRUE'),
        db.query('SELECT COUNT(*) FROM rbac_pages_directory')
      ]);

      res.json({
        success: true,
        stats: {
          totalUsers: parseInt(usersCount.rows[0].count),
          activeStaff: parseInt(staffCount.rows[0].count),
          badgeTiers: parseInt(badgeCount.rows[0].count),
          distinguishedMembers: parseInt(distCount.rows[0].count),
          activeModerators: parseInt(modCount.rows[0].count),
          registeredPages: parseInt(pagesCount.rows[0].count)
        }
      });
    } catch (err) {
      logger.error('Error fetching RBAC overview:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch RBAC overview metrics', error: err.message });
    }
  },

  // 2. Staff Roles & Directory
  getStaffDirectory: async (req, res) => {
    try {
      const rolesRes = await db.query('SELECT * FROM rbac_staff_roles ORDER BY clearance_level DESC, name ASC');
      const assignmentsRes = await db.query(`
        SELECT a.*, u.username, u.email, u.display_name, r.name as role_name, r.department, r.clearance_level
        FROM rbac_staff_assignments a
        JOIN users u ON a.user_id = u.id
        JOIN rbac_staff_roles r ON a.role_id = r.id
        WHERE a.is_active = TRUE
        ORDER BY a.created_at DESC
      `);

      res.json({
        success: true,
        roles: rolesRes.rows,
        assignments: assignmentsRes.rows
      });
    } catch (err) {
      logger.error('Error fetching staff directory:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch staff directory', error: err.message });
    }
  },

  assignStaffRole: async (req, res) => {
    try {
      const { userId, roleId, notes } = req.body;
      const assignedBy = req.user?.email || 'SuperAdmin';

      if (!userId || !roleId) {
        return res.status(400).json({ success: false, message: 'userId and roleId are required' });
      }

      const id = `assign_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const result = await db.query(`
        INSERT INTO rbac_staff_assignments (id, user_id, role_id, assigned_by, notes, is_active)
        VALUES ($1, $2, $3, $4, $5, TRUE)
        RETURNING *
      `, [id, userId, roleId, assignedBy, notes || null]);

      res.status(201).json({ success: true, message: 'Staff role assigned successfully', assignment: result.rows[0] });
    } catch (err) {
      logger.error('Error assigning staff role:', err);
      res.status(500).json({ success: false, message: 'Failed to assign staff role', error: err.message });
    }
  },

  removeStaffAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      await db.query('UPDATE rbac_staff_assignments SET is_active = FALSE, updated_at = NOW() WHERE id = $1', [id]);
      res.json({ success: true, message: 'Staff assignment revoked successfully' });
    } catch (err) {
      logger.error('Error removing staff assignment:', err);
      res.status(500).json({ success: false, message: 'Failed to remove staff assignment', error: err.message });
    }
  },

  // 3. Badge Tier Privileges
  getBadgeTiers: async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM rbac_badge_tier_privileges ORDER BY badge_level ASC');
      res.json({ success: true, tiers: result.rows });
    } catch (err) {
      logger.error('Error fetching badge tiers:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch badge tiers', error: err.message });
    }
  },

  updateBadgeTier: async (req, res) => {
    try {
      const { id } = req.params;
      const { minFicBalance, minReputation, feeDiscountPct, canAccessVaults, canAccessEarlyDrops, priorityCuration, perks } = req.body;

      const result = await db.query(`
        UPDATE rbac_badge_tier_privileges
        SET
          min_fic_balance = COALESCE($1, min_fic_balance),
          min_reputation = COALESCE($2, min_reputation),
          fee_discount_pct = COALESCE($3, fee_discount_pct),
          can_access_private_vaults = COALESCE($4, can_access_private_vaults),
          can_access_early_drops = COALESCE($5, can_access_early_drops),
          priority_curation = COALESCE($6, priority_curation),
          perks = COALESCE($7::jsonb, perks),
          updated_at = NOW()
        WHERE id = $8
        RETURNING *
      `, [minFicBalance, minReputation, feeDiscountPct, canAccessVaults, canAccessEarlyDrops, priorityCuration, perks ? JSON.stringify(perks) : null, id]);

      res.json({ success: true, message: 'Badge tier privileges updated', tier: result.rows[0] });
    } catch (err) {
      logger.error('Error updating badge tier:', err);
      res.status(500).json({ success: false, message: 'Failed to update badge tier', error: err.message });
    }
  },

  // 4. Distinguished & Honoured Members Registry
  getDistinguishedRegistry: async (req, res) => {
    try {
      const ranksRes = await db.query('SELECT * FROM rbac_distinguished_honoured_registry ORDER BY voting_weight DESC');
      const membersRes = await db.query(`
        SELECT d.*, u.username, u.email, u.display_name, r.rank_name, r.voting_weight, r.badge_accent
        FROM rbac_user_distinguished_assignments d
        JOIN users u ON d.user_id = u.id
        JOIN rbac_distinguished_honoured_registry r ON d.rank_id = r.id
        WHERE d.is_active = TRUE
        ORDER BY d.appointed_at DESC
      `);

      res.json({
        success: true,
        ranks: ranksRes.rows,
        dignitaries: membersRes.rows
      });
    } catch (err) {
      logger.error('Error fetching distinguished registry:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch distinguished registry', error: err.message });
    }
  },

  appointDistinguishedMember: async (req, res) => {
    try {
      const { userId, rankId, citation } = req.body;
      const appointedBy = req.user?.email || 'SuperAdmin';

      if (!userId || !rankId) {
        return res.status(400).json({ success: false, message: 'userId and rankId are required' });
      }

      const id = `dist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const result = await db.query(`
        INSERT INTO rbac_user_distinguished_assignments (id, user_id, rank_id, citation, appointed_by, is_active)
        VALUES ($1, $2, $3, $4, $5, TRUE)
        RETURNING *
      `, [id, userId, rankId, citation || null, appointedBy]);

      res.status(201).json({ success: true, message: 'Distinguished honor bestowed', dignitary: result.rows[0] });
    } catch (err) {
      logger.error('Error appointing distinguished member:', err);
      res.status(500).json({ success: false, message: 'Failed to appoint distinguished member', error: err.message });
    }
  },

  revokeDistinguishedMember: async (req, res) => {
    try {
      const { id } = req.params;
      await db.query('UPDATE rbac_user_distinguished_assignments SET is_active = FALSE WHERE id = $1', [id]);
      res.json({ success: true, message: 'Distinguished appointment revoked' });
    } catch (err) {
      logger.error('Error revoking distinguished appointment:', err);
      res.status(500).json({ success: false, message: 'Failed to revoke appointment', error: err.message });
    }
  },

  // 5. Moderator Scopes
  getModeratorScopes: async (req, res) => {
    try {
      const result = await db.query(`
        SELECT m.*, u.username, u.email, u.display_name
        FROM rbac_moderator_scopes m
        JOIN users u ON m.user_id = u.id
        WHERE m.is_active = TRUE
        ORDER BY m.created_at DESC
      `);

      res.json({ success: true, moderators: result.rows });
    } catch (err) {
      logger.error('Error fetching moderator scopes:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch moderator scopes', error: err.message });
    }
  },

  assignModeratorScope: async (req, res) => {
    try {
      const { userId, modTier, assignedCategory, canTimeout, canBan, canPin, canDispute } = req.body;
      const appointedBy = req.user?.email || 'SuperAdmin';

      if (!userId || !modTier) {
        return res.status(400).json({ success: false, message: 'userId and modTier are required' });
      }

      const id = `mod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const result = await db.query(`
        INSERT INTO rbac_moderator_scopes (id, user_id, mod_tier, assigned_category, can_timeout_users, can_ban_users, can_pin_topics, can_resolve_disputes, appointed_by, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE)
        RETURNING *
      `, [id, userId, modTier, assignedCategory || 'ALL', canTimeout ?? true, canBan ?? false, canPin ?? true, canDispute ?? false, appointedBy]);

      res.status(201).json({ success: true, message: 'Moderator scope assigned', moderator: result.rows[0] });
    } catch (err) {
      logger.error('Error assigning moderator scope:', err);
      res.status(500).json({ success: false, message: 'Failed to assign moderator scope', error: err.message });
    }
  },

  revokeModeratorScope: async (req, res) => {
    try {
      const { id } = req.params;
      await db.query('UPDATE rbac_moderator_scopes SET is_active = FALSE, updated_at = NOW() WHERE id = $1', [id]);
      res.json({ success: true, message: 'Moderator scope revoked' });
    } catch (err) {
      logger.error('Error revoking moderator scope:', err);
      res.status(500).json({ success: false, message: 'Failed to revoke moderator scope', error: err.message });
    }
  },

  // 6. Comprehensive Users Permission Matrix for the Users Console
  getUsersPermissionSummary: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit || '50');
      const offset = parseInt(req.query.offset || '0');
      const search = req.query.search ? `%${req.query.search.toLowerCase()}%` : null;

      let query = `
        SELECT
          u.id, u.username, u.email, u.display_name, u.role, u.is_active, u.reputation_score, u.gem_balance, u.created_at,
          COALESCE(
            (SELECT json_agg(json_build_object('roleId', sr.id, 'roleName', sr.name, 'department', sr.department, 'clearance', sr.clearance_level))
             FROM rbac_staff_assignments sa
             JOIN rbac_staff_roles sr ON sa.role_id = sr.id
             WHERE sa.user_id = u.id AND sa.is_active = TRUE), '[]'::json
          ) as staff_roles,
          COALESCE(
            (SELECT json_agg(json_build_object('rankId', dr.id, 'rankName', dr.rank_name, 'votingWeight', dr.voting_weight))
             FROM rbac_user_distinguished_assignments da
             JOIN rbac_distinguished_honoured_registry dr ON da.rank_id = dr.id
             WHERE da.user_id = u.id AND da.is_active = TRUE), '[]'::json
          ) as distinguished_ranks,
          COALESCE(
            (SELECT json_agg(json_build_object('modTier', ms.mod_tier, 'category', ms.assigned_category, 'canBan', ms.can_ban_users))
             FROM rbac_moderator_scopes ms
             WHERE ms.user_id = u.id AND ms.is_active = TRUE), '[]'::json
          ) as moderator_scopes
        FROM users u
      `;

      const params = [];
      if (search) {
        query += ` WHERE LOWER(u.email) LIKE $1 OR LOWER(u.username) LIKE $1 OR LOWER(u.display_name) LIKE $1 `;
        params.push(search);
      }

      query += ` ORDER BY u.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await db.query(query, params);

      // Enhance with executive tier tagging
      const enhancedUsers = result.rows.map(user => ({
        ...user,
        executiveTier: computeRoleTier(user),
        isExecutive: PRIMARY_ADMIN_EMAILS.includes((user.email || '').toLowerCase()) || SECONDARY_ADMIN_EMAILS.includes((user.email || '').toLowerCase())
      }));

      res.json({
        success: true,
        users: enhancedUsers,
        total: enhancedUsers.length
      });
    } catch (err) {
      logger.error('Error fetching users permission summary:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch users permission summary', error: err.message });
    }
  },

  // 7. Content Creators Hive Directory
  getCreatorsDirectory: async (req, res) => {
    try {
      const result = await db.query(`
        SELECT
          cp.id, cp.user_id, cp.country_code, cp.tier, cp.status, cp.is_geo_suspect, cp.created_at,
          u.username, u.display_name, u.email, u.reputation_score, u.gem_balance
        FROM creator_profiles cp
        LEFT JOIN users u ON cp.user_id = u.id::text OR cp.user_id = u.username
        ORDER BY cp.created_at DESC
      `);

      const [totalCount, activeCount, tierStats] = await Promise.all([
        db.query('SELECT COUNT(*) FROM creator_profiles'),
        db.query("SELECT COUNT(*) FROM creator_profiles WHERE status = 'ACTIVE'"),
        db.query('SELECT tier, COUNT(*) as count FROM creator_profiles GROUP BY tier')
      ]);

      res.json({
        success: true,
        creators: result.rows,
        stats: {
          total: parseInt(totalCount.rows[0]?.count || '0'),
          active: parseInt(activeCount.rows[0]?.count || '0'),
          tiers: tierStats.rows
        }
      });
    } catch (err) {
      logger.error('Error fetching creators directory:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch creators directory', error: err.message });
    }
  },

  updateCreatorProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const { tier, status } = req.body;

      const result = await db.query(`
        UPDATE creator_profiles
        SET
          tier = COALESCE($1, tier),
          status = COALESCE($2, status),
          updated_at = NOW()
        WHERE id::text = $3
        RETURNING *
      `, [tier, status, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Creator profile not found' });
      }

      res.json({ success: true, message: 'Creator profile updated successfully', creator: result.rows[0] });
    } catch (err) {
      logger.error('Error updating creator profile:', err);
      res.status(500).json({ success: false, message: 'Failed to update creator profile', error: err.message });
    }
  },

  // 8. Business & Organizations Hive Directory
  getBusinessDirectory: async (req, res) => {
    try {
      const result = await db.query(`
        SELECT
          id, name, type, country, state, city, website, accreditation_status, is_verified, metadata, created_at, updated_at
        FROM organizations
        ORDER BY created_at DESC
      `);

      const [totalCount, verifiedCount] = await Promise.all([
        db.query('SELECT COUNT(*) FROM organizations'),
        db.query('SELECT COUNT(*) FROM organizations WHERE is_verified = TRUE')
      ]);

      res.json({
        success: true,
        businesses: result.rows,
        stats: {
          total: parseInt(totalCount.rows[0]?.count || '0'),
          verified: parseInt(verifiedCount.rows[0]?.count || '0')
        }
      });
    } catch (err) {
      logger.error('Error fetching business directory:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch business directory', error: err.message });
    }
  },

  updateBusinessAccreditation: async (req, res) => {
    try {
      const { id } = req.params;
      const { accreditation_status, is_verified, metadata } = req.body;

      const result = await db.query(`
        UPDATE organizations
        SET
          accreditation_status = COALESCE($1, accreditation_status),
          is_verified = COALESCE($2, is_verified),
          metadata = COALESCE($3::jsonb, metadata),
          updated_at = NOW()
        WHERE id::text = $4
        RETURNING *
      `, [accreditation_status, is_verified, metadata ? JSON.stringify(metadata) : null, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Organization not found' });
      }

      res.json({ success: true, message: 'Organization accreditation updated', business: result.rows[0] });
    } catch (err) {
      logger.error('Error updating business accreditation:', err);
      res.status(500).json({ success: false, message: 'Failed to update business accreditation', error: err.message });
    }
  },

  // 9. Update Member Role/Account Type (e.g. promoting member to Creator or Business)
  updateUserAccountType: async (req, res) => {
    try {
      const { userId, role } = req.body;
      if (!userId || !role) {
        return res.status(400).json({ success: false, message: 'userId and role are required' });
      }

      const validRoles = ['Member', 'Creator', 'Business', 'Admin', 'Staff', 'Moderator'];
      const normalizedRole = validRoles.find(r => r.toLowerCase() === role.toLowerCase()) || role;

      const result = await db.query(`
        UPDATE users
        SET role = $1, updated_at = NOW()
        WHERE id::text = $2
        RETURNING id, username, email, role, display_name
      `, [normalizedRole, userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({ success: true, message: `User role updated to ${normalizedRole}`, user: result.rows[0] });
    } catch (err) {
      logger.error('Error updating user role:', err);
      res.status(500).json({ success: false, message: 'Failed to update user role', error: err.message });
    }
  }
};

module.exports = sovereignRbacController;
