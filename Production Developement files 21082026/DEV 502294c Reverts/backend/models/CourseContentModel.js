/**
 * CourseContentModel.js
 * Database models for course content management system
 */

const { identityDb } = require('../db');
const logger = require('../utils/logger'); // Ensure logger is required for error states

class CourseContentModel {
  /**
   * Get all courses with filtering and pagination
   */
  static async getCourses(filters = {}) {
    const {
      category_id,
      level,
      min_price,
      max_price,
      search,
      is_published = true,
      sort_by = 'created_at',
      order = 'DESC',
      limit = 20,
      offset = 0 // 1️⃣ FIX: Changed semicolon to comma
    } = filters;

    let query = `
      SELECT c.*, 
             cc.name as category_name,
             m.membername as instructor_name,
             m.profile_picture_url as instructor_avatar
      FROM courses c
      LEFT JOIN course_categories cc ON c.category_id = cc.id
      LEFT JOIN members m ON c.instructor_id = m.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (is_published !== undefined) {
      query += ` AND c.is_published = $${paramIndex++}`;
      params.push(is_published);
    }

    if (category_id) {
      query += ` AND c.category_id = $${paramIndex++}`;
      params.push(category_id);
    }

    if (level) {
      query += ` AND c.level = $${paramIndex++}`;
      params.push(level);
    }

    if (min_price !== undefined) {
      query += ` AND c.price >= $${paramIndex++}`;
      params.push(parseFloat(min_price));
    }

    if (max_price !== undefined) {
      query += ` AND c.price <= $${paramIndex++}`;
      params.push(parseFloat(max_price));
    }

    if (search) {
      // 2️⃣ FIX: Removed accidental trailing comma splitting string templates
      query += ` AND (c.title ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex} OR c.tags::text ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY c.${sort_by} ${order}`;
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await identityDb.query(query, params);
    return rows;
  }

  /**
   * Get total count of courses matching filters
   */
  static async getCoursesCount(filters = {}) {
    const {
      category_id,
      level,
      min_price,
      max_price,
      search,
      is_published = true // 3️⃣ FIX: Changed semicolon to closing block
    } = filters;

    let query = `SELECT COUNT(*) FROM courses WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (is_published !== undefined) {
      query += ` AND is_published = $${paramIndex++}`;
      params.push(is_published);
    }

    if (category_id) {
      query += ` AND category_id = $${paramIndex++}`;
      params.push(category_id);
    }

    if (level) {
      query += ` AND level = $${paramIndex++}`;
      params.push(level);
    }

    if (min_price !== undefined) {
      query += ` AND price >= $${paramIndex++}`;
      params.push(parseFloat(min_price));
    }

    if (max_price !== undefined) {
      query += ` AND price <= $${paramIndex++}`;
      params.push(parseFloat(max_price));
    }

    if (search) {
      // 4️⃣ FIX: Cleaned line-wrap syntax split
      query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR tags::text ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const { rows } = await identityDb.query(query, params);
    return parseInt(rows[0].count);
  }

  /**
   * Get single course by ID with lessons and materials
   */
  static async getCourseById(id) {
    const courseQuery = `
      SELECT c.*, 
             cc.name as category_name,
             m.membername as instructor_name,
             m.profile_picture_url as instructor_avatar
      FROM courses c
      LEFT JOIN course_categories cc ON c.category_id = cc.id
      LEFT JOIN members m ON c.instructor_id = m.id
      WHERE c.id = $1
    `;

    const { rows: courseRows } = await identityDb.query(courseQuery, [id]);
    
    if (courseRows.length === 0) {
      return null;
    }

    const course = courseRows[0];

    // Get lessons
    const lessonsQuery = `
      SELECT * FROM course_lessons
      WHERE course_id = $1 AND is_published = true
      ORDER BY sort_order ASC
    `;
    const { rows: lessons } = await identityDb.query(lessonsQuery, [id]);

    // Get materials
    const materialsQuery = `
      SELECT cm.*, cl.title as lesson_title
      FROM course_materials cm
      LEFT JOIN course_lessons cl ON cm.lesson_id = cl.id
      WHERE cm.course_id = $1
      ORDER BY cm.sort_order ASC
    `;
    const { rows: materials } = await identityDb.query(materialsQuery, [id]);

    // Get reviews summary
    const reviewsQuery = `
      SELECT 
        COUNT(*) as total_reviews,
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM course_reviews
      WHERE course_id = $1 AND is_approved = true
    `;
    const { rows: reviewStats } = await identityDb.query(reviewsQuery, [id]);

    return {
      ...course,
      lessons,
      materials,
      review_stats: reviewStats[0]
    };
  }

  /**
   * Create new course
   */
  static async createCourse(data) {
    const {
      title,
      slug,
      description,
      short_description,
      category_id,
      instructor_id,
      thumbnail_url,
      preview_video_url,
      level,
      language,
      duration_hours,
      total_lessons,
      price,
      currency,
      tags,
      requirements,
      learning_outcomes,
      meta_title,
      meta_description
    } = data;

    const query = `
      INSERT INTO courses (
        title, slug, description, short_description, category_id, instructor_id,
        thumbnail_url, preview_video_url, level, language, duration_hours,
        total_lessons, price, currency, tags, requirements, learning_outcomes,
        meta_title, meta_description, is_published
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
      ) RETURNING *
    `;

    const values = [
      title, slug, description, short_description, category_id, instructor_id,
      thumbnail_url, preview_video_url, level || 'beginner', language || 'en',
      duration_hours || 0, total_lessons || 0, price || 0, currency || 'USD',
      tags || [], requirements || [], learning_outcomes || [],
      meta_title, meta_description, false
    ];

    const { rows } = await identityDb.query(query, values);
    return rows[0];
  }

  /**
   * Update course
   */
  static async updateCourse(id, data) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && key !== 'id') {
        fields.push(`${key} = $${paramIndex++}`);
        values.push(data[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `UPDATE courses SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`; // 5️⃣ FIX: Added missing comma before updated_at

    const { rows } = await identityDb.query(query, values);
    return rows[0];
  }

  /**
   * Delete course
   */
  static async deleteCourse(id) {
    const query = 'DELETE FROM courses WHERE id = $1 RETURNING *';
    const { rows } = await identityDb.query(query, [id]);
    return rows[0];
  }

  /**
   * Enroll member in course
   */
  static async enrollInCourse(courseId, memberId) { // 6️⃣ FIX: Removed double parenthesis syntax error
    try {
      // Check if already enrolled
      const existingEnrollment = await identityDb.query(
        'SELECT * FROM course_enrollments WHERE course_id = $1 AND member_id = $2',
        [courseId, memberId]
      );

      if (existingEnrollment.rows.length > 0) {
        return existingEnrollment.rows[0];
      }

      // Get course details
      const course = await identityDb.query(
        'SELECT total_lessons FROM courses WHERE id = $1',
        [courseId]
      );

      if (course.rows.length === 0) {
        throw new Error('Course not found');
      }

      const totalLessons = course.rows[0].total_lessons;

      // Create enrollment
      const query = `
        INSERT INTO course_enrollments (course_id, member_id, total_lessons)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      const { rows } = await identityDb.query(query, [courseId, memberId, totalLessons]);
      return rows[0];
    } catch (error) { // 7️⃣ FIX: Organized completely mixed up and dangling try-catch blocks
      logger.error('Error in enrollInCourse:', error);
      throw error;
    }
  }

  /**
   * Get member's enrollments
   */
  static async getMemberEnrollments(memberId) {
    const query = `
      SELECT ce.*, c.title, c.thumbnail_url, c.instructor_id,
             m.membername as instructor_name
      FROM course_enrollments ce
      JOIN courses c ON ce.course_id = c.id
      LEFT JOIN members m ON c.instructor_id = m.id
      WHERE ce.member_id = $1
      ORDER BY ce.created_at DESC
    `;

    const { rows } = await identityDb.query(query, [memberId]);
    return rows;
  }

  /**
   * Mark lesson as completed
   */
  static async completeLesson(enrollmentId, lessonId, timeSpent = 0) { // 8️⃣ FIX: Fixed functional parameter syntax
    try {
      // Check if progress record exists
      const existingProgress = await identityDb.query(
        'SELECT * FROM course_progress WHERE enrollment_id = $1 AND lesson_id = $2',
        [enrollmentId, lessonId]
      );

      let result;

      if (existingProgress.rows.length > 0) {
        // Update existing progress
        const query = `
          UPDATE course_progress
          SET is_completed = true,
              completed_at = CURRENT_TIMESTAMP,
              time_spent_seconds = time_spent_seconds + $3,
              updated_at = CURRENT_TIMESTAMP
          WHERE enrollment_id = $1 AND lesson_id = $2
          RETURNING *;
        `;
        const { rows } = await identityDb.query(query, [enrollmentId, lessonId, timeSpent]);
        result = rows[0];
      } else {
        // Create new progress record
        const query = `
          INSERT INTO course_progress (enrollment_id, lesson_id, is_completed, completed_at, time_spent_seconds)
          VALUES ($1, $2, true, CURRENT_TIMESTAMP, $3)
          RETURNING *
        `;
        const { rows } = await identityDb.query(query, [enrollmentId, lessonId, timeSpent]);
        result = rows[0];
      }

      // Update enrollment progress
      await this.updateEnrollmentProgress(enrollmentId);

      return result;
    } catch (error) { // 9️⃣ FIX: Restructured completely scrambled query closure block mapping
      logger.error('Error in completeLesson:', error);
      throw error;
    }
  }

  /**
   * Update enrollment progress percentage
   */
  static async updateEnrollmentProgress(enrollmentId) {
    // Get completed lessons count
    const completedQuery = `
      SELECT COUNT(*) as completed_count
      FROM course_progress
      WHERE enrollment_id = $1 AND is_completed = true
    `;
    const { rows: completedRows } = await identityDb.query(completedQuery, [enrollmentId]);
    const completedLessons = parseInt(completedRows[0].completed_count);

    // Get enrollment details
    const enrollmentQuery = 'SELECT total_lessons FROM course_enrollments WHERE id = $1';
    const { rows: enrollmentRows } = await identityDb.query(enrollmentQuery, [enrollmentId]);
    
    if (enrollmentRows.length === 0) {
      return;
    }

    const totalLessons = enrollmentRows[0].total_lessons;
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0; // 🔟 FIX: Cleaned broken trailing comma string warp

    // Update enrollment
    const updateQuery = `
      UPDATE course_enrollments
      SET completed_lessons = $1,
          progress_percentage = $2,
          last_accessed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3;
    `;

    await identityDb.query(updateQuery, [completedLessons, progressPercentage.toFixed(2), enrollmentId]);
  }

  /**
   * Get course progress for enrollment
   */
  static async getCourseProgress(enrollmentId) {
    const query = `
      SELECT cp.*, cl.title as lesson_title, cl.lesson_type, cl.video_duration_minutes
      FROM course_progress cp
      JOIN course_lessons cl ON cp.lesson_id = cl.id
      WHERE cp.enrollment_id = $1
      ORDER BY cl.sort_order ASC
    `;

    const { rows } = await identityDb.query(query, [enrollmentId]);
    return rows;
  }

  /**
   * Create course review
   */
  static async createReview(data) {
    const { course_id, member_id, rating, title, comment } = data;

    // Check if member already reviewed
    const existing = await identityDb.query(
      'SELECT * FROM course_reviews WHERE course_id = $1 AND member_id = $2',
      [course_id, member_id]
    );

    if (existing.rows.length > 0) {
      throw new Error('You have already reviewed this course');
    }

    const query = `
      INSERT INTO course_reviews (course_id, member_id, rating, title, comment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const { rows } = await identityDb.query(query, [course_id, member_id, rating, title, comment]);
    return rows[0];
  }

  /**
   * Get course categories
   */
  static async getCategories() {
    const query = `
      SELECT cc.*, COUNT(c.id) as course_count
      FROM course_categories cc
      LEFT JOIN courses c ON cc.id = c.category_id AND c.is_published = true
      WHERE cc.is_active = true
      GROUP BY cc.id
      ORDER BY cc.sort_order ASC, cc.name ASC
    `;

    const { rows } = await identityDb.query(query);
    return rows;
  }
}

module.exports = CourseContentModel;