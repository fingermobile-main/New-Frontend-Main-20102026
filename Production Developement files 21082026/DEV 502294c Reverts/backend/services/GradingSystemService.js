const pool = require('../database/connection');
const GradingSystemModel = require('../models/GradingSystemModel');

const gradingModel = new GradingSystemModel(pool);

class GradingSystemService {
  /**
   * Get all grading scales
   */
  static async getAllScales() {
    try {
      return await gradingModel.getGradingScales();
    } catch (error) {
      logger.error('Error in GradingSystemService.getAllScales:', error);
      throw error;
    }
  }
  
  // Alias for controller compatibility
  static async getGradingScales() {
    return await this.getAllScales();
  }
  
  /**
   * Get grading scale by ID
   */
  static async getScaleById(id) {
    try {
      return await gradingModel.getGradingScaleById(id);
    } catch (error) {
      logger.error('Error in GradingSystemService.getScaleById:', error);
      throw error;
    }
  }
  
  /**
   * Create new grading scale
   */
  static async createScale(data) {
    try {
      return await gradingModel.createGradingScale(data);
    } catch (error) {
      logger.error('Error in GradingSystemService.createScale:', error);
      throw error;
    }
  }
  
  // Alias for controller compatibility
  static async createGradingScale(data) {
    return await this.createScale(data);
  }
  
  /**
   * Submit grade for student
   */
  static async assignGrade(data) {
    try {
      return await gradingModel.createGradeEntry(data);
    } catch (error) {
      logger.error('Error in GradingSystemService.assignGrade:', error);
      throw error;
    }
  }
  
  // New method for controller
  static async submitGrade(data, userId) {
    try {
      return await this.assignGrade({ ...data, graded_by: userId });
    } catch (error) {
      logger.error('Error in GradingSystemService.submitGrade:', error);
      throw error;
    }
  }
  
  /**
   * Get student grades
   */
  static async getStudentGrades(studentId, courseId) {
    try {
      return await gradingModel.getStudentGrades(studentId, courseId);
    } catch (error) {
      logger.error('Error in GradingSystemService.getStudentGrades:', error);
      throw error;
    }
  }
  
  /**
   * Calculate GPA for student
   */
  static async calculateGPA(studentId) {
    try {
      return await gradingModel.calculateGPA(studentId);
    } catch (error) {
      logger.error('Error in GradingSystemService.calculateGPA:', error);
      throw error;
    }
  }
  
  /**
   * Update grade
   */
  static async updateGrade(id, updates, userId) {
    try {
      return await gradingModel.updateGrade(id, updates, userId);
    } catch (error) {
      logger.error('Error in GradingSystemService.updateGrade:', error);
      throw error;
    }
  }
  
  /**
   * Delete grade entry
   */
  static async deleteGrade(id) {
    try {
      return await gradingModel.deleteGrade(id);
    } catch (error) {
      logger.error('Error in GradingSystemService.deleteGrade:', error);
      throw error;
    }
  }
  
  /**
   * Get class average for a course
   */
  static async getClassAverage(courseId) {
    try {
      const query = `
        SELECT AVG(grade_value) as average
        FROM grade_entries
        WHERE course_id = $1
      `;
      const result = await pool.query(query, [courseId]);
      return parseFloat(result.rows[0]?.average || '0');
    } catch (error) {
      logger.error('Error in GradingSystemService.getClassAverage:', error);
      throw error;
    }
  }
  
  /**
   * Get grade distribution for a course
   */
  static async getGradeDistribution(courseId) {
    try {
      const query = `
        SELECT 
          CASE 
            WHEN grade_value >= 90 THEN 'A'
            WHEN grade_value >= 80 THEN 'B'
            WHEN grade_value >= 70 THEN 'C'
            WHEN grade_value >= 60 THEN 'D'
            ELSE 'F'
          END as letter_grade,
          COUNT(*) as count
        FROM grade_entries
        WHERE course_id = $1
        GROUP BY letter_grade
        ORDER BY letter_grade
      `;
      const result = await pool.query(query, [courseId]);
      
      const distribution = {};
      result.rows.forEach(row => {
        distribution[row.letter_grade] = parseInt(row.count);
      });
      
      return distribution;
    } catch (error) {
      logger.error('Error in GradingSystemService.getGradeDistribution:', error);
      throw error;
    }
  }
}

module.exports = GradingSystemService;
