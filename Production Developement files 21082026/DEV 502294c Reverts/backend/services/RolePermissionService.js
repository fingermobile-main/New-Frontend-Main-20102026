/**
 * RolePermissionService
 * Complete RBAC system with granular permissions, role hierarchy, and dynamic checks
 */

const pool = require('../database/connection');

class RolePermissionService {
  /**
   * Check if user has permission
   */
  async hasPermission(userId, permission) {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE u.id = $1 AND p.name = $2 AND ur.is_active = true
      `;
      
      const result = await pool.query(query, [userId, permission]);
      
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      logger.error('Error checking permission:', error);
      throw error;
    }
  }
  
  /**
   * Check if user has any of multiple permissions
   */
  async hasAnyPermission(userId, permissions) {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE u.id = $1 AND p.name = ANY($2::text[]) AND ur.is_active = true
      `;
      
      const result = await pool.query(query, [userId, permissions]);
      
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      logger.error('Error checking any permission:', error);
      throw error;
    }
  }
  
  /**
   * Get all permissions for user
   */
  async getUserPermissions(userId) {
    try {
      const query = `
        SELECT DISTINCT p.name, p.description, p.category
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE u.id = $1 AND ur.is_active = true
        ORDER BY p.category, p.name
      `;
      
      const result = await pool.query(query, [userId]);
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting user permissions:', error);
      throw error;
    }
  }
  
  /**
   * Get all roles for user
   */
  async getUserRoles(userId) {
    try {
      const query = `
        SELECT r.*, ur.assigned_at, ur.assigned_by
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN roles r ON ur.role_id = r.id
        WHERE u.id = $1 AND ur.is_active = true
        ORDER BY ur.assigned_at DESC
      `;
      
      const result = await pool.query(query, [userId]);
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting user roles:', error);
      throw error;
    }
  }
  
  /**
   * Assign role to user
   */
  async assignRole(userId, roleId, assignedBy) {
    try {
      const query = `
        INSERT INTO user_roles (user_id, role_id, assigned_by, is_active, assigned_at)
        VALUES ($1, $2, $3, true, NOW())
        ON CONFLICT (user_id, role_id)
        DO UPDATE SET is_active = true, assigned_at = NOW()
        RETURNING *
      `;
      
      const result = await pool.query(query, [userId, roleId, assignedBy]);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error assigning role:', error);
      throw error;
    }
  }
  
  /**
   * Revoke role from user
   */
  async revokeRole(userId, roleId) {
    try {
      const query = `
        UPDATE user_roles
        SET is_active = false
        WHERE user_id = $1 AND role_id = $2
        RETURNING *
      `;
      
      const result = await pool.query(query, [userId, roleId]);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error revoking role:', error);
      throw error;
    }
  }
  
  /**
   * Create new permission
   */
  async createPermission(name, description, category) {
    try {
      const query = `
        INSERT INTO permissions (name, description, category, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *
      `;
      
      const result = await pool.query(query, [name, description, category]);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating permission:', error);
      throw error;
    }
  }
  
  /**
   * Create new role
   */
  async createRole(name, description, parentRoleId = null) {
    try {
      const query = `
        INSERT INTO roles (name, description, parent_role_id, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *
      `;
      
      const result = await pool.query(query, [name, description, parentRoleId]);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating role:', error);
      throw error;
    }
  }
  
  /**
   * Assign permission to role
   */
  async assignPermissionToRole(roleId, permissionId) {
    try {
      const query = `
        INSERT INTO role_permissions (role_id, permission_id, created_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (role_id, permission_id) DO NOTHING
        RETURNING *
      `;
      
      const result = await pool.query(query, [roleId, permissionId]);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error assigning permission to role:', error);
      throw error;
    }
  }
  
  /**
   * Get role hierarchy
   */
  async getRoleHierarchy(roleId) {
    try {
      const query = `
        WITH RECURSIVE role_tree AS (
          SELECT id, name, parent_role_id, 0 as level
          FROM roles
          WHERE id = $1
          
          UNION ALL
          
          SELECT r.id, r.name, r.parent_role_id, rt.level + 1
          FROM roles r
          JOIN role_tree rt ON r.id = rt.parent_role_id
        )
        SELECT * FROM role_tree ORDER BY level DESC
      `;
      
      const result = await pool.query(query, [roleId]);
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting role hierarchy:', error);
      throw error;
    }
  }
}

module.exports = new RolePermissionService();
