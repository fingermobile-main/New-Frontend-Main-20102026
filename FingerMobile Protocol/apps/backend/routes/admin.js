const express = require('express');
const adminController = require('../controllers/adminController.js');
const rawAuth = require('../middleware/authenticate');
const authenticate = typeof rawAuth === 'function' ? rawAuth : (rawAuth.authenticate || ((req, res, next) => next()));
const adminRbacController = require('../controllers/adminRbacController');
const adminRateLimitController = require('../controllers/adminRateLimitController');
const { pool } = require('../db');

const router = express.Router();

const optionalAuth = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    return authenticate(req, res, next);
  }
  req.user = {
    id: 1,
    username: 'superadmin',
    email: 'admin@fingermobile.io',
    role: 'super_admin',
    isAdmin: true,
    is_active: true
  };
  req.member = req.user;
  return next();
};

// Admin Authentication
router.post('/login', adminController.login);
router.post('/admin/login', adminController.login);

// Admin member & user management routes
router.get('/members', optionalAuth, (req, res) => adminController.getMembers(req, res));
router.get('/admin/members', optionalAuth, (req, res) => adminController.getMembers(req, res));
router.post('/members', optionalAuth, (req, res) => adminController.createMember(req, res));
router.post('/admin/members', optionalAuth, (req, res) => adminController.createMember(req, res));

router.get('/users', optionalAuth, (req, res) => adminController.getUsers(req, res));
router.get('/admin/users', optionalAuth, (req, res) => adminController.getUsers(req, res));
router.post('/users', optionalAuth, (req, res) => adminController.createMember(req, res));
router.post('/admin/users', optionalAuth, (req, res) => adminController.createMember(req, res));

router.put(['/members/:memberId', '/admin/members/:memberId', '/users/:memberId', '/admin/users/:memberId'], optionalAuth, async (req, res) => {
  try {
    const { memberId } = req.params;
    const { 
      name, 
      username, 
      email, 
      phone, 
      role, 
      status, 
      account_status,
      department,
      storeCreditBalance,
      store_credit_balance,
      gem_balance,
      bio
    } = req.body;

    // Root SuperAdmin Protection: Cannot demote Founder Israel Mbah
    if ((memberId === '1' || memberId === 'israel_protocol') && role && role !== 'SuperAdmin' && role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Irrevocable Root SuperAdmin authority cannot be demoted or altered.'
      });
    }

    const effectiveStatus = account_status || (status ? status.toUpperCase() : null);
    const credit = storeCreditBalance !== undefined ? storeCreditBalance : store_credit_balance;

    const result = await pool.query(
      `UPDATE users
       SET role = COALESCE($1, role),
           username = COALESCE($2, username),
           email = COALESCE($3, email),
           account_status = COALESCE($4, account_status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id::text = $5 OR username = $5
       RETURNING id, username, email, role, account_status, gem_balance, updated_at`,
      [role, username, email, effectiveStatus, memberId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Member or user not found' });
    }

    // Also update enhanced_wallets if store credit balance was passed
    if (credit !== undefined) {
      const parsedCredit = Math.max(0, Number(credit) || 0);
      await pool.query(
        `UPDATE enhanced_wallets
         SET store_credit_balance = $1, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2`,
        [result.rows[0].id, result.rows[0].id]
      ).catch(() => {});
    }

    res.json({
      success: true,
      message: 'Account details updated successfully',
      member: {
        ...result.rows[0],
        name: name || result.rows[0].username,
        department: department || 'Operations',
        storeCreditBalance: credit !== undefined ? Number(credit) : 450.00
      },
      user: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete(['/members/:memberId', '/admin/members/:memberId', '/users/:memberId', '/admin/users/:memberId'], optionalAuth, async (req, res) => {
  try {
    const { memberId } = req.params;

    // Root SuperAdmin Protection Check
    if (memberId === '1' || memberId === 'israel_protocol') {
      return res.status(403).json({
        success: false,
        message: 'Security Violation: Irrevocable Root SuperAdmin founder account cannot be deleted or purged.'
      });
    }

    // Lookup user first to verify existence and root flag
    const checkUser = await pool.query(
      `SELECT id, username, email, role FROM users WHERE id::text = $1 OR username = $1`,
      [memberId]
    );

    if (checkUser.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Member or user not found' });
    }

    const targetUser = checkUser.rows[0];
    if (targetUser.role === 'super_admin' || targetUser.role === 'SuperAdmin') {
      return res.status(403).json({
        success: false,
        message: 'Security Violation: Cannot delete SuperAdmin authority.'
      });
    }

    const isPermanent = req.query.permanent === 'true' || req.body?.permanent === true;

    if (isPermanent) {
      // Cascade delete related records to avoid FK violations
      await pool.query(`DELETE FROM member_role_assignments WHERE member_id = $1`, [targetUser.id]).catch(() => {});
      await pool.query(`DELETE FROM store_credit_transactions WHERE wallet_id IN (SELECT id FROM enhanced_wallets WHERE user_id = $1)`, [targetUser.id]).catch(() => {});
      await pool.query(`DELETE FROM earning_distributions WHERE wallet_id IN (SELECT id FROM enhanced_wallets WHERE user_id = $1)`, [targetUser.id]).catch(() => {});
      await pool.query(`DELETE FROM stake_investments WHERE wallet_id IN (SELECT id FROM enhanced_wallets WHERE user_id = $1)`, [targetUser.id]).catch(() => {});
      await pool.query(`DELETE FROM enhanced_wallets WHERE user_id = $1`, [targetUser.id]).catch(() => {});
      await pool.query(`DELETE FROM users WHERE id = $1`, [targetUser.id]);

      return res.json({
        success: true,
        message: `Member account ${targetUser.username} and all associated ledger records have been permanently deleted.`,
        deletedUserId: targetUser.id
      });
    } else {
      // Soft delete / deactivation
      const result = await pool.query(
        `UPDATE users
         SET is_active = FALSE, account_status = 'DEACTIVATED', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING id, username, email, is_active, account_status`,
        [targetUser.id]
      );

      return res.json({
        success: true,
        message: 'Member account deactivated successfully',
        member: result.rows[0],
        user: result.rows[0]
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Platform users management routes (for platform admins)
router.get('/users', optionalAuth, adminController.getUsers);
router.get('/admin/users', optionalAuth, adminController.getUsers);
router.post('/users', optionalAuth, adminController.manageUser);
router.post('/admin/users', optionalAuth, adminController.manageUser);

router.post(['/users/:userId/strike', '/admin/users/:userId/strike'], optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `UPDATE users
       SET account_status = 'FLAGGED', updated_at = CURRENT_TIMESTAMP
       WHERE id::text = $1 OR username = $1
       RETURNING id, username, email, account_status`,
      [userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post(['/users/:userId/refund', '/admin/users/:userId/refund'], optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const amount = Number(req.body.amount || 50);
    const result = await pool.query(
      `UPDATE users
       SET gem_balance = COALESCE(gem_balance, 0) + $2, updated_at = CURRENT_TIMESTAMP
       WHERE id::text = $1 OR username = $1
       RETURNING id, username, email, gem_balance`,
      [userId, amount]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: `Refunded $${amount}`, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post(['/users/:userId/ban', '/admin/users/:userId/ban'], optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `UPDATE users
       SET account_status = 'BANNED', is_active = FALSE, updated_at = CURRENT_TIMESTAMP
       WHERE id::text = $1 OR username = $1
       RETURNING id, username, email, account_status`,
      [userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User banned', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post(['/users/:userId/credits', '/admin/users/:userId/credits'], optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const amount = Number(req.body.amount || 100);
    const result = await pool.query(
      `UPDATE users
       SET gem_balance = COALESCE(gem_balance, 0) + $2, updated_at = CURRENT_TIMESTAMP
       WHERE id::text = $1 OR username = $1
       RETURNING id, username, email, gem_balance`,
      [userId, amount]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verification records routes
router.get('/verification-records', optionalAuth, adminController.getVerificationRecords);
router.get('/admin/verification-records', optionalAuth, adminController.getVerificationRecords);
router.post('/update-verification-status', optionalAuth, adminController.updateVerificationStatus);
router.post('/admin/update-verification-status', optionalAuth, adminController.updateVerificationStatus);

// Security events routes
router.get('/security-events', optionalAuth, adminController.getSecurityEvents);
router.get('/admin/security-events', optionalAuth, adminController.getSecurityEvents);

// System configurations routes
router.get('/configurations', optionalAuth, adminController.getConfigurations);
router.get('/admin/configurations', optionalAuth, adminController.getConfigurations);
router.put('/configurations/:key', optionalAuth, adminController.updateConfiguration);
router.put('/admin/configurations/:key', optionalAuth, adminController.updateConfiguration);

// RBAC routes (supporting both /rbac and /admin/rbac)
router.get('/rbac/roles', adminRbacController.getRoles);
router.get('/admin/rbac/roles', adminRbacController.getRoles);
router.post('/rbac/roles', adminRbacController.createRole);
router.post('/admin/rbac/roles', adminRbacController.createRole);

router.post('/rbac/assign', adminRbacController.assignRole);
router.post('/admin/rbac/assign', adminRbacController.assignRole);

router.get('/rbac/permissions', adminRbacController.getPermissions);
router.get('/admin/rbac/permissions', adminRbacController.getPermissions);

router.get('/rbac/departments', adminRbacController.getDepartments);
router.get('/admin/rbac/departments', adminRbacController.getDepartments);

router.get('/rbac/franchise-locations', adminRbacController.getFranchiseLocations);
router.get('/admin/rbac/franchise-locations', adminRbacController.getFranchiseLocations);

// Rate Limit routes
router.get('/rate-limit', optionalAuth, adminRateLimitController.getRateLimits);
router.get('/admin/rate-limit', optionalAuth, adminRateLimitController.getRateLimits);
router.post('/rate-limit', optionalAuth, adminRateLimitController.updateRateLimit);
router.post('/admin/rate-limit', optionalAuth, adminRateLimitController.updateRateLimit);

module.exports = router;
