/**
 * Unit Tests for eLearning Controller
 * FingerMobile Protocol™
 */

jest.mock('../../db', () => ({
  pool: { query: jest.fn() },
  query: jest.fn()
}));

const request = require('supertest');
const express = require('express');
const { pool } = require('../../db');
const elearningController = require('../../controllers/elearningController');

describe('eLearning Controller Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.user = { id: 'test-user-id' };
      next();
    });
    pool.query.mockReset();
  });

  describe('Course Management', () => {
    beforeEach(() => {
      app.get('/api/elearning/courses', elearningController.getCourses.bind(elearningController));
      app.post('/api/elearning/courses', elearningController.createCourse.bind(elearningController));
      app.post('/api/elearning/courses/:id/enroll', elearningController.enrollInCourse.bind(elearningController));
      app.get('/api/elearning/my-courses', elearningController.getMyCourses.bind(elearningController));
    });

    it('should get published courses', async () => {
      const mockCourses = {
        rows: [
          { id: '1', title: 'JavaScript Basics', instructor_name: 'John Doe', rating: 4.5 }
        ]
      };
      pool.query.mockResolvedValue(mockCourses);

      const response = await request(app).get('/api/elearning/courses?limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });

    it('should create a new course', async () => {
      const mockCourse = {
        rows: [{ id: 'new-course-id', title: 'New Course' }]
      };
      pool.query.mockResolvedValue(mockCourse);

      const response = await request(app)
        .post('/api/elearning/courses')
        .send({
          title: 'New Course',
          description: 'Test course',
          category: 'Programming',
          price: 5000
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should enroll user in course', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/api/elearning/courses/course-123/enroll');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should get user enrolled courses', async () => {
      const mockEnrollments = {
        rows: [
          { course_id: '1', course_title: 'JavaScript Basics', progress_percentage: 65 }
        ]
      };
      pool.query.mockResolvedValue(mockEnrollments);

      const response = await request(app).get('/api/elearning/my-courses');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].progress_percentage).toBe(65);
    });
  });
});
