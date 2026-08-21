/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
const GradingSystemService = require('../services/GradingSystemService');
const logger = require('../utils/logger');

/**
 * GradingSystemController
 * Handles grading operations and grade management
 */

class GradingSystemController {
  /**
   * GET /api/grading-system/scales
   * Get all grading scales
   */
  async getGradingScales(req: Request, res: Response) {
    try {
      const scales = await GradingSystemService.getGradingScales();
      
      res.json({
        success: true,
        data: scales
      });
    } catch (error) {
      logger.error('GradingSystemController.getGradingScales error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? (error as Error).message : 'Failed to retrieve grading scales'
      });
    }
  }

  /**
   * POST /api/grading-system/scales
   * Create new grading scale
   */
  async createGradingScale(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const scaleData = req.body;
      const scale = await GradingSystemService.createGradingScale(scaleData);

      res.status(201).json({
        success: true,
        message: 'Grading scale created',
        data: scale
      });
    } catch (error) {
      logger.error('GradingSystemController.createGradingScale error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? (error as Error).message : 'Failed to create grading scale'
      });
    }
  }

  /**
   * POST /api/grading-system/grades
   * Submit grade for student
   */
  async submitGrade(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const gradeData = req.body;
      const grade = await GradingSystemService.submitGrade(gradeData, userId);

      res.status(201).json({
        success: true,
        message: 'Grade submitted successfully',
        data: grade
      });
    } catch (error) {
      logger.error('GradingSystemController.submitGrade error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? (error as Error).message : 'Failed to submit grade'
      });
    }
  }

  /**
   * GET /api/grading-system/students/:studentId/grades
   * Get student grades with GPA
   */
  async getStudentGrades(req: Request, res: Response) {
    try {
      const { studentId } = (req as any).params;
      const { courseId } = (req as any).query;
      
      const result = await GradingSystemService.getStudentGrades(
        parseInt(studentId),
        courseId ? parseInt(courseId) : undefined
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('GradingSystemController.getStudentGrades error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? (error as Error).message : 'Failed to retrieve student grades'
      });
    }
  }

  /**
   * PUT /api/grading-system/grades/:id
   * Update grade
   */
  async updateGrade(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = (req as any).params;
      const updates = req.body;
      
      const grade = await GradingSystemService.updateGrade(parseInt(id), updates, userId);

      res.json({
        success: true,
        message: 'Grade updated',
        data: grade
      });
    } catch (error) {
      logger.error('GradingSystemController.updateGrade error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? (error as Error).message : 'Failed to update grade'
      });
    }
  }

  /**
   * DELETE /api/grading-system/grades/:id
   * Delete grade
   */
  async deleteGrade(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = (req as any).params;
      await GradingSystemService.deleteGrade(parseInt(id));

      res.json({
        success: true,
        message: 'Grade deleted'
      });
    } catch (error) {
      logger.error('GradingSystemController.deleteGrade error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? (error as Error).message : 'Failed to delete grade'
      });
    }
  }

  /**
   * GET /api/grading-system/courses/:courseId/average
   * Get class average for course
   */
  async getClassAverage(req: Request, res: Response) {
    try {
      const { courseId } = (req as any).params;
      const average = await GradingSystemService.getClassAverage(parseInt(courseId));

      res.json({
        success: true,
        data: { courseId: parseInt(courseId), average }
      });
    } catch (error) {
      logger.error('GradingSystemController.getClassAverage error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? (error as Error).message : 'Failed to calculate class average'
      });
    }
  }

  /**
   * GET /api/grading-system/courses/:courseId/distribution
   * Get grade distribution for course
   */
  async getGradeDistribution(req: Request, res: Response) {
    try {
      const { courseId } = (req as any).params;
      const distribution = await GradingSystemService.getGradeDistribution(parseInt(courseId));

      res.json({
        success: true,
        data: { courseId: parseInt(courseId), distribution }
      });
    } catch (error) {
      logger.error('GradingSystemController.getGradeDistribution error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? (error as Error).message : 'Failed to get grade distribution'
      });
    }
  }
}

module.exports = new GradingSystemController();
