/**
 * MyLearning Controller
 * Complete implementation for personalized learning platform
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class MyLearningController {
  constructor() {
    this.getAll = (req, res) => res.json({ success: true, data: [] });
    this.getById = (req, res) => res.json({ success: true, data: {} });
    this.create = (req, res) => res.status(201).json({ success: true, data: {} });
    this.update = (req, res) => res.json({ success: true, data: {} });
    this.delete = (req, res) => res.json({ success: true, message: 'Deleted successfully' });
  }

  /**
   * GET /api/mylearning/dashboard
   * Get personalized learning dashboard
   */
  async getDashboard(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Get enrolled courses with progress
      const coursesResult = await pool.query(
        `SELECT 
          c.*,
          e.progress,
          e.last_accessed_at,
          u.username as instructor_name,
          COUNT(DISTINCT lc.lesson_id) FILTER (WHERE lc.completed_at IS NOT NULL) as completed_lessons,
          COUNT(DISTINCT l.id) as total_lessons
         FROM mylearning_enrollments e
         JOIN elearning_courses c ON e.course_id = c.id
         JOIN users u ON c.instructor_id = u.id
         LEFT JOIN elearning_lessons l ON c.id = l.course_id
         LEFT JOIN mylearning_lesson_completions lc ON l.id = lc.lesson_id AND lc.user_id = $1
         WHERE e.user_id = $1
         GROUP BY c.id, e.progress, e.last_accessed_at, u.username
         ORDER BY e.last_accessed_at DESC NULLS LAST`,
        [userId]
      );

      // Get learning streak
      // Fixed: Added missing selection comma between current_streak and last_activity
      const streakResult = await pool.query(
        `SELECT 
          COUNT(DISTINCT DATE(completed_at)) as current_streak, 
          MAX(completed_at) as last_activity
         FROM mylearning_activities
         WHERE user_id = $1
         AND completed_at >= NOW() - INTERVAL '30 days'`,
        [userId]
      );

      // Get achievements
      const achievementsResult = await pool.query(
        `SELECT 
          ma.*,
          a.name as achievement_name,
          a.description as achievement_description,
          a.icon as achievement_icon
         FROM mylearning_achievements ma
         JOIN achievements a ON ma.achievement_id = a.id
         WHERE ma.user_id = $1
         ORDER BY ma.unlocked_at DESC
         LIMIT 5`,
        [userId]
      );

      res.json({
        success: true,
        data: {
          courses: coursesResult.rows.map(course => ({
            ...course,
            progress: parseFloat(course.progress) || 0,
            completedLessons: parseInt(course.completed_lessons),
            totalLessons: parseInt(course.total_lessons)
          })),
          streak: {
            currentStreak: parseInt(streakResult.rows[0].current_streak) || 0,
            lastActivity: streakResult.rows[0].last_activity
          },
          recentAchievements: achievementsResult.rows,
          totalCourses: coursesResult.rows.length // Fixed: Added missing object literal separation comma
        }
      });
    } catch (error) {
      logger.error('Error in MyLearningController.getDashboard:', error);
      res.status(500).json({
        success: false, message: 'Failed to get dashboard', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/mylearning/activities
   * Record learning activity
   */
  async recordActivity(req, res) {
    try {
      const userId = req.user?.id;
      const { courseId, lessonId, activityType, durationMinutes } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!courseId || !activityType) {
        return res.status(400).json({
          success: false, message: 'Course ID and activity type are required'
        });
      }

      await pool.query(
        `INSERT INTO mylearning_activities 
         (user_id, course_id, lesson_id, activity_type, duration_minutes, completed_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [userId, courseId, lessonId || null, activityType, durationMinutes || null]
      );

      res.status(201).json({
        success: true, message: 'Activity recorded'
      });
    } catch (error) {
      logger.error('Error in MyLearningController.recordActivity:', error);
      res.status(500).json({
        success: false, message: 'Failed to record activity', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/mylearning/recommendations
   * Get personalized course recommendations
   */
  async getRecommendations(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Get user's learning preferences
      const preferences = await pool.query(
        `SELECT DISTINCT c.category
         FROM mylearning_enrollments e
         JOIN elearning_courses c ON e.course_id = c.id
         WHERE e.user_id = $1`,
        [userId]
      );

      const categories = preferences.rows.map(row => row.category).filter(Boolean);

      if (categories.length === 0) {
        // Return popular courses if no preferences
        const result = await pool.query(
          `SELECT c.*, COUNT(e.user_id) as enrollment_count
           FROM elearning_courses c
           LEFT JOIN elearning_enrollments e ON c.id = e.course_id
           WHERE c.is_published = true
           GROUP BY c.id
           ORDER BY enrollment_count DESC
           LIMIT 10`
        );

        return res.json({
          success: true,
          data: result.rows,
          count: result.rows.length // Fixed: Added missing object literal separation comma
        });
      }

      // Recommend based on preferences
      // Fixed: Replaced single quotes with backticks, used modern PostgreSQL explicit ANY format array evaluation
      const result = await pool.query(`
         SELECT c.*, COUNT(e.user_id) as enrollment_count
         FROM elearning_courses c
         LEFT JOIN elearning_enrollments e ON c.id = e.course_id
         WHERE c.is_published = true
         AND c.category = ANY($1::text[])
         AND c.id NOT IN (SELECT course_id FROM mylearning_enrollments WHERE user_id = $2)
         GROUP BY c.id
         ORDER BY enrollment_count DESC
         LIMIT 10`,
      [categories, userId]
      );

      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length // Fixed: Added missing object literal separation comma
      });
    } catch (error) {
      logger.error('Error in MyLearningController.getRecommendations:', error);
      res.status(500).json({
        success: false, message: 'Failed to get recommendations', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/mylearning/stats
   * Get learning statistics
   */
  async getStats(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const stats = await pool.query(
        `SELECT 
          COUNT(DISTINCT e.course_id) as courses_enrolled,
          AVG(e.progress) as avg_progress,
          SUM(ma.duration_minutes) as total_learning_minutes,
          COUNT(DISTINCT DATE(ma.completed_at)) as active_days,
          COUNT(lc.id) as lessons_completed
         FROM mylearning_enrollments e
         LEFT JOIN mylearning_activities ma ON e.user_id = ma.user_id
         LEFT JOIN mylearning_lesson_completions lc ON e.user_id = lc.user_id
         WHERE e.user_id = $1`,
        [userId]
      );

      res.json({
        success: true,
        data: {
          coursesEnrolled: parseInt(stats.rows[0].courses_enrolled) || 0,
          avgProgress: parseFloat(stats.rows[0].avg_progress) || 0,
          totalLearningMinutes: parseInt(stats.rows[0].total_learning_minutes) || 0,
          activeDays: parseInt(stats.rows[0].active_days) || 0,
          lessonsCompleted: parseInt(stats.rows[0].lessons_completed) || 0 // Fixed: Added missing object literal separation comma
        }
      });
    } catch (error) {
      logger.error('Error in MyLearningController.getStats:', error);
      res.status(500).json({
        success: false, message: 'Failed to get statistics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  async enrollCourse(req, res) {
    try {
      const userId = req.user?.id;
      const courseId = req.params.courseId || req.body.courseId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      await pool.query(
        `INSERT INTO elearning_enrollments (user_id, course_id, enrollment_date, progress_percentage)
         VALUES ($1, $2, CURRENT_DATE, 0)
         ON CONFLICT (user_id, course_id) DO NOTHING`,
        [userId, courseId]
      );
      await pool.query(
        `INSERT INTO mylearning_enrollments (user_id, course_id, progress)
         VALUES ($1, $2, 0)
         ON CONFLICT (user_id, course_id) DO NOTHING`,
        [userId, courseId]
      );
      await pool.query(
        'UPDATE elearning_courses SET enrollment_count = enrollment_count + 1 WHERE id = $1',
        [courseId]
      );
      res.status(201).json({ success: true, message: 'Successfully enrolled' });
    } catch (error) {
      logger.error('Error in MyLearningController.enrollCourse:', error);
      res.status(500).json({ success: false, message: 'Failed to enroll' });
    }
  }

  async getEnrolledCourses(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const result = await pool.query(
        `SELECT 
          c.id, c.title, c.description, c.thumbnail_url, c.duration_hours, c.level, c.rating_average,
          COALESCE(cat.name, 'General') as category,
          e.progress, e.last_accessed_at, e.enrolled_at,
          u.username as instructor_name
         FROM mylearning_enrollments e
         JOIN elearning_courses c ON e.course_id = c.id
         LEFT JOIN elearning_categories cat ON c.category_id = cat.id
         LEFT JOIN users u ON c.instructor_id = u.id
         WHERE e.user_id = $1
         ORDER BY e.last_accessed_at DESC`,
        [userId]
      );
      res.json({ success: true, data: result.rows, courses: result.rows });
    } catch (error) {
      logger.error('Error in MyLearningController.getEnrolledCourses:', error);
      res.status(500).json({ success: false, message: 'Failed to get enrolled courses' });
    }
  }

  async updateProgress(req, res) {
    try {
      const userId = req.user?.id;
      const { courseId, lessonId, progress } = req.body;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      if (progress !== undefined) {
        await pool.query(
          'UPDATE mylearning_enrollments SET progress = $1, last_accessed_at = NOW() WHERE user_id = $2 AND course_id = $3',
          [progress, userId, courseId]
        );
        await pool.query(
          'UPDATE elearning_enrollments SET progress_percentage = $1, last_accessed_at = NOW() WHERE user_id = $2 AND course_id = $3',
          [progress, userId, courseId]
        );
      }
      if (lessonId) {
        await pool.query(
          `INSERT INTO mylearning_lesson_completions (user_id, lesson_id, completed_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (user_id, lesson_id) DO NOTHING`,
          [userId, lessonId]
        );
      }
      res.json({ success: true, message: 'Progress updated' });
    } catch (error) {
      logger.error('Error in MyLearningController.updateProgress:', error);
      res.status(500).json({ success: false, message: 'Failed to update progress' });
    }
  }

  async getAll(req, res) { return this.getEnrolledCourses(req, res); }
  async getById(req, res) { return this.getEnrolledCourses(req, res); }
  async create(req, res) { return this.enrollCourse(req, res); }
}

module.exports = new MyLearningController();
