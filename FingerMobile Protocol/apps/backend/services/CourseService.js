const logger = require('../utils/logger');
/**
 * CourseService
 * LMS course management with enrollment, progress tracking, and certificates
 */

const pool = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class CourseService {
  async createCourse(instructorId, options = {}) {
    try {
      const { title, description, category, price, duration_hours } = options;

      const courseId = uuidv4();

      const query = `
        INSERT INTO courses (
          id, instructor_id, title, description, category,
          price, duration_hours, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'draft', NOW())
        RETURNING *
      `;

      const result = await pool.query(query, [
        courseId, instructorId, title, description, category, price, duration_hours
      ]);

      return result.rows[0];
    } catch (error) {
      logger.error('Error creating course:', error);
      throw error;
    }
  }

  async enrollStudent(courseId, studentId) {
    try {
      const query = `
        INSERT INTO course_enrollments (course_id, student_id, enrolled_at, status)
        VALUES ($1, $2, NOW(), 'active')
        ON CONFLICT (course_id, student_id) DO NOTHING
        RETURNING *
      `;

      const result = await pool.query(query, [courseId, studentId]);

      return result.rows[0];
    } catch (error) {
      logger.error('Error enrolling student:', error);
      throw error;
    }
  }

  async generateCertificate(enrollmentId) {
    try {
      const certificateId = uuidv4();

      const query = `
        INSERT INTO course_certificates (id, enrollment_id, issued_at, status)
        VALUES ($1, $2, NOW(), 'issued')
        RETURNING *
      `;

      const result = await pool.query(query, [certificateId, enrollmentId]);

      return result.rows[0];
    } catch (error) {
      logger.error('Error generating certificate:', error);
      throw error;
    }
  }
}

module.exports = new CourseService();
