const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { email, password, name, role = 'user' } = userData;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at',
      [email, hashedPassword, name, role]
    );
    
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query('SELECT id, email, name, role, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async updateProfile(id, updates) {
    const { name, avatar, bio } = updates;
    const result = await query(
      'UPDATE users SET name = COALESCE($1, name), avatar = COALESCE($2, avatar), bio = COALESCE($3, bio), updated_at = NOW() WHERE id = $4 RETURNING id, email, name, role, avatar, bio, updated_at',
      [name, avatar, bio, id]
    );
    return result.rows[0];
  }
}

module.exports = User;