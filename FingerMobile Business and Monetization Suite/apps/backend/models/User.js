/*
 * FingerMobile Protocol™ - User Model
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

const db = require('../config/database'); // Assuming a database connection

class User {
  static async findById(userId) {
    const query = `
      SELECT 
        id, username, email, role, created_at, updated_at
      FROM users
      WHERE id = $1
    `;
    
    const result = await db.query(query, [userId]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  }

  static async findByEmail(email) {
    const query = `
      SELECT 
        id, username, email, password_hash, role, created_at, updated_at
      FROM users
      WHERE email = $1
    `;
    
    const result = await db.query(query, [email]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  }

  static async create(userData) {
    const query = `
      INSERT INTO users (
        username, email, password_hash, role
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, role, created_at, updated_at
    `;
    
    const result = await db.query(query, [
      userData.username,
      userData.email,
      userData.password_hash,
      userData.role || 'user'
    ]);
    
    return result.rows[0];
  }

  static async update(userId, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    
    if (fields.length === 0) {
      return this.findById(userId);
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `
      UPDATE users
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${fields.length + 1}
      RETURNING id, username, email, role, created_at, updated_at
    `;
    
    const result = await db.query(query, [...values, userId]);
    return result.rows[0];
  }
}

module.exports = User;