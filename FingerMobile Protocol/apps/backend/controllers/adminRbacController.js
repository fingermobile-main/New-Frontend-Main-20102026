const db = require('../db');
const pool = db.pool || db;
const logger = require('../config/logger');

const getRoles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM roles ORDER BY name ASC');
    res.json({ success: true, roles: result.rows });
  } catch (error) {
    logger.error('Error fetching RBAC roles:', error);
    res.status(500).json({ success: false, message: 'Server error fetching roles', error: error.message });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, title, description, responsibility, level = 10, is_system = false } = req.body;
    const roleName = name || title;
    const roleDesc = description || responsibility;

    if (!roleName) {
      return res.status(400).json({ success: false, message: 'Role name or title is required' });
    }

    const slug = roleName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const roleId = `role_${slug}`;
    const result = await pool.query(
      `INSERT INTO roles (id, slug, name, description, category, is_system_default, assigned_users_count, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'GENERAL', $5, 0, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET
         description = COALESCE(EXCLUDED.description, roles.description),
         updated_at = NOW()
       RETURNING *`,
      [roleId, slug, roleName, roleDesc || null, is_system]
    );

    res.status(201).json({
      success: true,
      role: {
        ...result.rows[0],
        title: result.rows[0].name,
        responsibility: result.rows[0].description
      }
    });
  } catch (error) {
    logger.error('Error creating role:', error);
    res.status(500).json({ success: false, message: 'Server error creating role' });
  }
};

const assignRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!userId || !role) {
      return res.status(400).json({ success: false, message: 'UserId and role are required' });
    }

    // Assign standard user.role first
    const updateResult = await pool.query(
      'UPDATE users SET role = $1 WHERE id::text = $2 RETURNING id, username, role',
      [role, userId]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: updateResult.rows[0] });
  } catch (error) {
    logger.error('Error assigning RBAC role:', error);
    res.status(500).json({ success: false, message: 'Server error assigning role' });
  }
};

const getPermissions = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM permissions ORDER BY module, name');
    res.json({ success: true, permissions: result.rows });
  } catch (error) {
    logger.error('Error fetching permissions:', error);
    res.status(500).json({ success: false, message: 'Server error fetching permissions' });
  }
};

const getDepartments = async (req, res) => {
  res.json([
    { id: 'dept-1', name: 'Engineering & Protocol Architecture', members: 42, features: 18 },
    { id: 'dept-2', name: 'Security & Cryptographic Audit', members: 15, features: 12 },
    { id: 'dept-3', name: 'Finance, FIC & Treasury', members: 24, features: 10 },
    { id: 'dept-4', name: 'Compliance & Verification', members: 19, features: 8 },
    { id: 'dept-5', name: 'Community & Ecosystem Growth', members: 31, features: 14 }
  ]);
};

const getFranchiseLocations = async (req, res) => {
  res.json([
    {
      id: 'continent-1',
      name: 'North America',
      type: 'continent',
      children: [
        { id: 'reg-na-1', name: 'US East (New York Hub)', type: 'region' },
        { id: 'reg-na-2', name: 'US West (San Francisco Hub)', type: 'region' }
      ]
    },
    {
      id: 'continent-2',
      name: 'Europe',
      type: 'continent',
      children: [
        { id: 'reg-eu-1', name: 'London Node', type: 'region' },
        { id: 'reg-eu-2', name: 'Frankfurt Node', type: 'region' }
      ]
    },
    {
      id: 'continent-3',
      name: 'Africa',
      type: 'continent',
      children: [
        { id: 'reg-af-1', name: 'Lagos Ecosystem Center', type: 'region' },
        { id: 'reg-af-2', name: 'Nairobi Innovation Hub', type: 'region' }
      ]
    }
  ]);
};

module.exports = {
  getRoles,
  createRole,
  assignRole,
  getPermissions,
  getDepartments,
  getFranchiseLocations
};
