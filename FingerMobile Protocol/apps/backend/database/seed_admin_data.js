/* eslint-disable no-unused-vars */
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });
const logger = require('../config/logger');
const { identityDb, controlDb } = require('../db/db');

async function seedAdminData() {
  try {
    logger.info('Starting admin data seeding...');

    // 1. Seed Roles in identityDb
    await identityDb.query(`
      INSERT INTO roles (name, description, level, is_system)
      VALUES 
        ('admin', 'Full system access', 100, true),
        ('moderator', 'Content and user management', 50, true),
        ('user', 'Standard registered user', 10, true)
      ON CONFLICT (name) DO NOTHING;
    `);
    logger.info('✅ Seeded default roles');

    // 2. Seed Permissions in identityDb
    await identityDb.query(`
      INSERT INTO permissions (name, description, resource_type, action)
      VALUES 
        ('manage:system', 'Manage global system settings', 'system', 'manage'),
        ('manage:users', 'Manage user accounts and roles', 'users', 'manage'),
        ('read:users', 'View user details', 'users', 'read'),
        ('delete:posts', 'Delete any post', 'posts', 'delete')
      ON CONFLICT (name) DO NOTHING;
    `);
    logger.info('✅ Seeded default permissions');

    // Create role_permissions table if it doesn't exist
    await identityDb.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
        permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
        PRIMARY KEY (role_id, permission_id)
      );
    `);

    // Assign some permissions to admin role
    await identityDb.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id FROM roles r, permissions p
      WHERE r.name = 'admin'
      ON CONFLICT DO NOTHING;
    `);
    logger.info('✅ Assigned permissions to admin role');

    // 3. Seed Rate Limits in controlDb
    await controlDb.query(`
      INSERT INTO rate_limit_configs (name, description, endpoint_pattern, max_requests, window_ms, is_active)
      VALUES 
        ('Global API', 'Default rate limit for all API endpoints', '/api/*', 100, 900000, true),
        ('Auth Endpoints', 'Stricter rate limits for login/register', '/auth/*', 5, 900000, true),
        ('Uploads', 'Rate limit for media uploads', '/api/*/upload', 20, 3600000, true)
      ON CONFLICT DO NOTHING;
    `);
    logger.info('✅ Seeded default rate limit configs');

    logger.info('Admin data seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    logger.error('Error seeding admin data:', err);
    process.exit(1);
  }
}

seedAdminData();
