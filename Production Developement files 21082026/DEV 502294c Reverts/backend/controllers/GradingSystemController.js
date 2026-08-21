/**
 * GradingSystemController
 * Handles grading system operations including scales, grades, and GPA calculation
 */

const pool = require('../database/connection');
const logger = require('../utils/logger');
const GradingSystemModel = require('../models/GradingSystemModel');

const gradingModel = new GradingSystemModel(pool);

class GradingSystemController {
  /**
   * Get all grading scales
   */
  async getGradingScales(req, res) {
    try {
      const scales = await gradingModel.getGradingScales();
      res.json({ 
        success: true, message: 'Grading scales retrieved successfully', data: scales 
      });
    } catch (error) {
      logger.error('Error in GradingSystemController.getGradingScales:', error);
      res.status(500).json({ 
        success: false, error: 'Failed to retrieve grading scales',
        details: error.message 
      });
    }
  }

  /**
   * Get grading scale by ID
   */
  async getGradingScaleById(req, res) {
    try {
      const { id } = req.params;
      const scale = await gradingModel.getGradingScaleById(id);
      
      if (!scale) {
        return res.status(404).json({ 
          success: false, error: 'Grading scale not found' 
        });
      }
      
      res.json({ 
        success: true, message: 'Grading scale retrieved successfully', data: scale 
      });
    } catch (error) {
      logger.error('Error in GradingSystemController.getGradingScaleById:', error);
      res.status(500).json({ 
        success: false, error: 'Failed to retrieve grading scale',
        details: error.message 
      });
    }
  }

  /**
   * Create new grading scale
   */
  async createGradingScale(req, res) {
    try {
      const { name, description, scale_type, is_default } = req.body;
      
      // Validation
      if (!name) {
        return res.status(400).json({ 
          success: false, error: 'Grading scale name is required' 
        });
      }
      
      const scale = await gradingModel.createGradingScale({
        name,
        description, scale_type: scale_type || 'percentage',
        is_default: is_default || false
      });
      
      res.status(201).json({ 
        success: true, message: 'Grading scale created successfully', data: scale 
      });
    } catch (error) {
      logger.error('Error in GradingSystemController.createGradingScale:', error);
      res.status(500).json({ 
        success: false, error: 'Failed to create grading scale',
        details: error.message 
      });
    }
  }

  /**
   * Submit grade for student
   */
  async submitGrade(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId || (req.member && req.member.id);
      const { student_id, course_id, assignment_id, grade_value, grade_scale_id, feedback } = req.body;
      
      // Validation
      if (!student_id || !course_id || !grade_value || !grade_scale_id) {
        return res.status(400).json({ 
          success: false, error: 'student_id, course_id, grade_value, and grade_scale_id are required' 
        });
      }
      
      const grade = await gradingModel.createGradeEntry({
        student_id,
        course_id,
        assignment_id,
        grade_value,
        grade_scale_id,
        feedback,
        graded_by: userId
      });
      
      res.status(201).json({ 
        success: true, message: 'Grade submitted successfully', data: grade 
      });
    } catch (error) {
      logger.error('Error in GradingSystemController.submitGrade:', error);
      res.status(500).json({ 
        success: false, error: 'Failed to submit grade',
        details: error.message 
      });
    }
  }

  /**
   * Get student grades with GPA
   */
  async getStudentGrades(req, res) {
    try {
      const { studentId } = req.params;
      const { courseId } = req.query;
      
      const grades = await gradingModel.getStudentGrades(studentId, courseId);
      const gpa = await gradingModel.calculateGPA(studentId);
      
      res.json({ 
        success: true, message: 'Student grades retrieved successfully',
        data: {
          grades,
          gpa, total_grades: grades.length
        } 
      });
    } catch (error) {
      logger.error('Error in GradingSystemController.getStudentGrades:', error);
      res.status(500).json({ 
        success: false, error: 'Failed to retrieve student grades',
        details: error.message 
      });
    }
  }

  /**
   * Update grade
   */
  async updateGrade(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.user?.userId || (req.member && req.member.id);
      const updates = req.body;
      
      const grade = await gradingModel.updateGrade(id, updates, userId);
      
      if (!grade) {
        return res.status(404).json({ 
          success: false, error: 'Grade entry not found' 
        });
      }
      
      res.json({ 
        success: true, message: 'Grade updated successfully', data: grade 
      });
    } catch (error) {
      logger.error('Error in GradingSystemController.updateGrade:', error);
      res.status(500).json({ 
        success: false, error: 'Failed to update grade',
        details: error.message 
      });
    }
  }

  /**
   * Delete grade entry
   */
  async deleteGrade(req, res) {
    try {
      const { id } = req.params;
      const deleted = await gradingModel.deleteGrade(id);
      
      if (!deleted) {
        return res.status(404).json({ 
          success: false, error: 'Grade entry not found' 
        });
      }
      
      res.json({ 
        success: true, message: 'Grade deleted successfully'
      });
    } catch (error) {
      logger.error('Error in GradingSystemController.deleteGrade:', error);
      res.status(500).json({ 
        success: false, error: 'Failed to delete grade',
        details: error.message 
      });
    }
  }
}

module.exports = new GradingSystemController();
