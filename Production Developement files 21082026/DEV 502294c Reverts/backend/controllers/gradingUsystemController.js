/**
 * Grading U-System Controller
 * Complete implementation for grading system
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class GradingUsystemController {
  /**
   * GET /api/grading-usystem/grades
   * Get all grade levels
   */
  async getGrades(req, res) {
    try {
      const result = await pool.query(
        `SELECT * FROM grading_grades
         ORDER BY min_score DESC`
      );

      res.json({
        success: true,
        data: result.rows, count: result.rows.length });
    } catch (error) {
      logger.error('Error, in GradingUsystemController.getGrades:', error);
      res.status(500).json({
        success: false, message: 'Failed to get grades', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/grading-usystem/calculate
   * Calculate grade based on score
   */
  async calculateGrade(req, res) {
    try {
      const { score, maxScore } = req.body;

      if (score === undefined || maxScore === undefined) {
        return res.status(400).json({
          success: false, message: 'Score and max score are required'
        });
      }

      const percentage = (parseFloat(score) / parseFloat(maxScore)) * 100;

      const result = await pool.query(
        `SELECT * FROM grading_grades
         WHERE $1 >= min_score AND $1 <= max_score
         ORDER BY min_score DESC
         LIMIT 1`,
        [percentage]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'No grade found for this score'
        });
      }

      res.json({
        success: true,
        data: {
          score: parseFloat(score),
          maxScore: parseFloat(maxScore),
          percentage: Math.round(percentage * 100) / 100, grade: result.rows[0]
        }
      });
    } catch (error) {
      logger.error('Error in GradingUsystemController.calculateGrade:', error);
      res.status(500).json({
        success: false, message: 'Failed to calculate grade', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/grading-usystem/submit-grade
   * Submit a grade for a student/course
   */
  async submitGrade(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Check instructor/admin permission
      if (!req.user?.isInstructor && !req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Instructor or admin access required'
        });
      }

      const { studentId, courseId, score, feedback } = req.body;

      if (!studentId || !courseId || score === undefined) {
        return res.status(400).json({
          success: false, message: 'Student ID, course ID, and score are required'
        });
      }

      // Calculate grade
      const percentage = parseFloat(score);
      const gradeResult = await pool.query(
        `SELECT id, letter_grade FROM grading_grades
         WHERE $1 >= min_score AND $1 <= max_score
         ORDER BY min_score DESC
         LIMIT 1`,
        [percentage]
      );

      if (gradeResult.rows.length === 0) {
        return res.status(400).json({
          success: false, message: 'Invalid score range'
        });
      }

      const gradeId = gradeResult.rows[0].id;
      const letterGrade = gradeResult.rows[0].letter_grade;

      await pool.query(
        `INSERT INTO grading_submissions 
         (student_id, course_id, graded_by, score, grade_id, letter_grade, feedback, submitted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [studentId, courseId, userId, percentage, gradeId, letterGrade, feedback || null]
      );

      res.status(201).json({
        success: true, message: 'Grade submitted successfully',
        data: {
          studentId,
          courseId,
          score: percentage, letterGrade } });
    } catch (error) {
      logger.error('Error in GradingUsystemController.submitGrade:', error);
      res.status(500).json({
        success: false, message: 'Failed to submit grade', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/grading-usystem/student/:studentId/grades
   * Get student's grades
   */
  async getStudentGrades(req, res) {
    try {
      const { studentId } = req.params;

      const result = await pool.query(
        `SELECT 
          gs.*,
          c.name as course_name,
          u.username as instructor_name
         FROM grading_submissions gs
         JOIN elearning_courses c ON gs.course_id = c.id
         JOIN users u ON gs.graded_by = u.id
         WHERE gs.student_id = $1
         ORDER BY gs.submitted_at DESC`,
        [studentId]
      );

      res.json({
        success: true,
        data: result.rows.map(submission => ({
          ...submission,
          score: parseFloat(submission.score)
        })), count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in GradingUsystemController.getStudentGrades:', error);
      res.status(500).json({
        success: false, message: 'Failed to get student grades', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/grading-usystem/stats
   * Get grading statistics
   */
  async getStats(req, res) {
    try {
      const stats = await pool.query(` SELECT 
          COUNT(*) as total_submissions,
          AVG(score) as avg_score,
          MIN(score) as min_score,
          MAX(score) as max_score,
          COUNT(DISTINCT student_id) as total_students,
          COUNT(DISTINCT course_id) as total_courses
        FROM grading_submissions
      `);

      res.json({
        success: true,
        data: {
          totalSubmissions: parseInt(stats.rows[0].total_submissions) || 0,
          avgScore: parseFloat(stats.rows[0].avg_score) || 0,
          minScore: parseFloat(stats.rows[0].min_score) || 0,
          maxScore: parseFloat(stats.rows[0].max_score) || 0,
          totalStudents: parseInt(stats.rows[0].total_students) || 0, totalCourses: parseInt(stats.rows[0].total_courses) || 0
        }
      });
    } catch (error) {
      logger.error('Error in GradingUsystemController.getStats:', error);
      res.status(500).json({
        success: false, message: 'Failed to get statistics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new GradingUsystemController();
