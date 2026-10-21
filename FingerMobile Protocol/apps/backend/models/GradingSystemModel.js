const logger = require('../utils/logger');

/**
 * GradingSystem Model
 * Handles database operations for grading system
 */
class GradingSystemModel {
  /**
   * @param {import('pg').Pool} pool - PostgreSQL connection pool
   */
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * Create a new grading scale
   */
  async createGradingScale(data) {
    try {
      const query = `
        INSERT INTO grading_scales (name, description, scale_type, is_default)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const values = [
        data.name,
        data.description || null,
        data.scale_type,
        data.is_default || false
      ];
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error('Error in createGradingScale:', error);
      throw error;
    }
  }

  /**
   * Get all grading scales
   */
  async getGradingScales() {
    try {
      const query = 'SELECT * FROM grading_scales ORDER BY created_at DESC;';
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      logger.error('Error in getGradingScales:', error);
      throw error;
    }
  }

  /**
   * Get grading scale by ID
   */
  async getGradingScaleById(id) {
    try {
      const query = 'SELECT * FROM grading_scales WHERE id = $1;';
      const result = await this.pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error in getGradingScaleById:', error);
      throw error;
    }
  }

  /**
   * Create grade entry
   */
  async createGradeEntry(data) {
    try {
      const query = `
        INSERT INTO grade_entries (student_id, course_id, assignment_id, grade_value, grade_scale_id, feedback, graded_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      const values = [
        data.student_id,
        data.course_id,
        data.assignment_id || null,
        data.grade_value,
        data.grade_scale_id,
        data.feedback || null,
        data.graded_by
      ];
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error('Error in createGradeEntry:', error);
      throw error;
    }
  }

  /**
   * Get student grades
   */
  async getStudentGrades(studentId, courseId = null) {
    try {
      let query = `
        SELECT ge.*, gs.name as scale_name, c.title as course_title
        FROM grade_entries ge
        JOIN grading_scales gs ON ge.grade_scale_id = gs.id
        JOIN courses c ON ge.course_id = c.id
        WHERE ge.student_id = $1
      `;
      const values = [studentId];

      if (courseId) {
        query += ' AND ge.course_id = $2';
        values.push(courseId);
      }

      query += ' ORDER BY ge.created_at DESC;';
      const result = await this.pool.query(query, values);
      return result.rows;
    } catch (error) {
      logger.error('Error in getStudentGrades:', error);
      throw error;
    }
  }

  /**
   * Calculate GPA for student
   */
  async calculateGPA(studentId) {
    try {
      const query = `
        SELECT AVG(ge.grade_value) as gpa
        FROM grade_entries ge
        WHERE ge.student_id = $1
        AND ge.grade_value IS NOT NULL;
      `;
      const result = await this.pool.query(query, [studentId]);
      return parseFloat(result.rows[0]?.gpa || '0');
    } catch (error) {
      logger.error('Error in calculateGPA:', error);
      throw error;
    }
  }

  /**
   * Update grade entry
   */
  async updateGrade(id, updates) {
    try {
      const query = `
        UPDATE grade_entries
        SET grade_value = COALESCE($1, grade_value),
            feedback = COALESCE($2, feedback),
            updated_at = NOW()
        WHERE id = $3
        RETURNING *;
      `;
      const values = [updates.grade_value ?? null, updates.feedback ?? null, id];
      const result = await this.pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error in updateGrade:', error);
      throw error;
    }
  }

  /**
   * Delete grade entry
   */
  async deleteGrade(id) {
    try {
      const query = 'DELETE FROM grade_entries WHERE id = $1;';
      const result = await this.pool.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      logger.error('Error in deleteGrade:', error);
      throw error;
    }
  }
}

module.exports = GradingSystemModel;
