const logger = require('../utils/logger');
/**
 * CamusService
 * Service for Camus e-learning platform
 * Created: June 8, 2026
 */

const db = require('../database/connection');

class CamusService {
  async getCourses(filters = {}) {
    try {
      const { limit = 50, offset = 0, category, level, search } = filters;

      let query = db('camus_courses').select('*');

      if (category) query = query.where({ category });
      if (level) query = query.where({ level });
      if (search) query = query.where('title', 'ilike', `%${search}%`);

      query = query.orderBy('enrollment_count', 'DESC').limit(limit).offset(offset);

      const results = await query;
      const [{ total }] = await db('camus_courses').count('* as total');

      return { data: results, total: parseInt(total), limit, offset };
    } catch (error) {
      logger.error('Error in CamusService.getCourses:', error);
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }
  }

  async getCourseById(id) {
    try {
      const course = await db('camus_courses').where({ id }).first();
      if (!course) return null;

      const modules = await db('camus_modules')
        .where({ course_id: id })
        .orderBy('order', 'ASC');

      const enrollments = await db('camus_enrollments')
        .where({ course_id: id })
        .count('* as total');

      return { ...course, modules, enrollmentCount: parseInt(enrollments[0].total) };
    } catch (error) {
      logger.error('Error in CamusService.getCourseById:', error);
      throw new Error(`Failed to fetch course: ${error.message}`);
    }
  }

  async enrollUser(data) {
    try {
      const now = new Date();
      const [enrollment] = await db('camus_enrollments').insert({
        ...data,
        status: 'active',
        progress: 0,
        enrolled_at: now
      }).returning('*');

      // Update course enrollment count
      await db('camus_courses')
        .where({ id: data.course_id })
        .increment('enrollment_count', 1);

      return enrollment;
    } catch (error) {
      logger.error('Error in CamusService.enrollUser:', error);
      throw new Error(`Failed to enroll: ${error.message}`);
    }
  }

  async updateProgress(data) {
    try {
      const { user_id, course_id, module_id, progress } = data;

      const [updated] = await db('camus_enrollments')
        .where({ user_id, course_id })
        .update({
          progress,
          last_module_id: module_id,
          updated_at: new Date()
        })
        .returning('*');

      return updated;
    } catch (error) {
      logger.error('Error in CamusService.updateProgress:', error);
      throw new Error(`Failed to update progress: ${error.message}`);
    }
  }
}

module.exports = new CamusService();
