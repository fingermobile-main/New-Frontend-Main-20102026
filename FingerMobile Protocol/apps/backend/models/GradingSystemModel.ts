const { Pool } = require('pg');

/**
 * GradingSystem Model
 * Handles database operations for grading system
 */

class GradingSystemModel {
  pool: any; // Add type declaration for pool property

  constructor(
    pool: any) {
    this.pool = pool;
  }

  /**
   * Create a new grading scale
   */
  async createGradingScale(
    data: any) {
    const query = `
      INSERT INTO grading_scales (name, description, scale_type, is_default)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [data.name, data.description, data.scale_type || 'percentage', data.is_default || false];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get all grading scales
   */
  async getGradingScales() {
    const query = 'SELECT * FROM grading_scales ORDER BY created_at DESC';
    const result = await this.pool.query(query);
    return result.rows;
  }

  /**
   * Get grading scale by ID
   */
  async getGradingScaleById(
    id: string) {
    const query = 'SELECT * FROM grading_scales WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Create grade entry
   */
  async createGradeEntry(
    data: any) {
    const query = `
      INSERT INTO grade_entries (student_id, course_id, assignment_id, grade_value, grade_scale_id, feedback, graded_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
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
  }

  /**
   * Get student grades
   */
  async getStudentGrades(
    studentId: string, courseId?: string) {
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

    query += ' ORDER BY ge.created_at DESC';
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  /**
   * Calculate GPA for student
   */
  async calculateGPA(
    studentId: string) {
    const query = `
      SELECT AVG(ge.grade_value) as gpa
      FROM grade_entries ge
      WHERE ge.student_id = $1
      AND ge.grade_value IS NOT NULL
    `;
    const result = await this.pool.query(query, [studentId]);
    return parseFloat(result.rows[0]?.gpa || '0');
  }

  /**
   * Update grade
   */
  async updateGrade(
    id: string,
    updates: any,
    userId: string) {
    const query = `
      UPDATE grade_entries
      SET grade_value = COALESCE($1, grade_value),
          feedback = COALESCE($2, feedback),
          updated_at = NOW()
      WHERE id = $3
      RETURNING *;
    `;
    const values = [updates.grade_value, updates.feedback, id];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete grade entry
   */
  async deleteGrade(
    id: string) {
    const query = 'DELETE FROM grade_entries WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }
}

export = GradingSystemModel;
