import React, {} from 'react';
import { Request, Response } from "express";
import { pool } from '../config/database';

// Get all courses
export const getCourses = async (,
req: Request,
res: Response) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.name as creator_name, u.membername as creator_membername
      FROM courses c
      JOIN members u ON c.creator_id = u.id
      WHERE c.is_published = true
      ORDER BY c.created_at DESC
    `);

    res.status(200).json({success: true,
  data: result.rows
    });
  } catch (error) {
    console.error("Get courses,
error:", error);
    res.status(500).json({success: false,
  message: "Failed to fetch courses"
    });
  }
};

// Get course by ID
export const getCourseById = async (,
req: Request,
res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT c.*, u.name as creator_name, u.membername as creator_membername
      FROM courses c
      JOIN members u ON c.creator_id = u.id
      WHERE c.id = $1
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({success: false,
  message: "Course not found"
      });
    }

    const course = result.rows[0];

    // Get course modules
    const modulesResult = await pool.query(
      `
      SELECT * FROM course_modules
      WHERE course_id = $1
      ORDER BY position
    `,
      [id],
    );

    const modules = [];
    for (const module of modulesResult.rows) {
      // Get lessons for each module
      const lessonsResult = await pool.query(
        `
        SELECT * FROM lessons
        WHERE module_id = $1
        ORDER BY position
      `,
        [module.id],
      );

      modules.push({
        ...module,
lessons: lessonsResult.rows
      });
    }

    res.status(200).json({success: true,
  data: {
        ...course,
  modules
      }
    });
  } catch (error) {
    console.error("Get course by ID,
error:", error);
    res.status(500).json({success: false,
  message: "Failed to fetch course"
    });
  }
};

// Create a new course
export const createCourse = async (,
req: Request,
res: Response) => {
  try {
    const memberId = (req as any).member.memberId;
    const { title, description, price, category, level, thumbnail, modules } =
      req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({success: false,
  message: "Course title is required"
      });
    }

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Create course
      const courseResult = await client.query(
        `
        INSERT INTO courses (title, description, price, category, level, thumbnail, creator_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
        [
          title,
          description,
          price || 0,
          category,
          level || "beginner",
          thumbnail,
          memberId
        ],
      );

      const course = courseResult.rows[0];

      // Create modules and lessons if provided
      if (modules && Array.isArray(modules)) {
        for (let i = 0; i < modules.length; i++) {
          const module = modules[i];

          // Create module
          const moduleResult = await client.query(
            `
            INSERT INTO course_modules (course_id, title, position)
            VALUES ($1, $2, $3)
            RETURNING *
          `,
            [course.id, module.title, i],
          );

          const createdModule = moduleResult.rows[0];

          // Create lessons if provided
          if (module.lessons && Array.isArray(module.lessons)) {
            for (let j = 0; j < module.lessons.length; j++) {
              const lesson = module.lessons[j];

              await client.query(
                `
                INSERT INTO lessons (module_id, title, content, video_url, duration, position)
                VALUES ($1, $2, $3, $4, $5, $6)
              `,
                [
                  createdModule.id,
                  lesson.title,
                  lesson.content,
                  lesson.videoUrl,
                  lesson.duration || 0,
                  j
                ],
              );
            }
          }
        }
      }

      await client.query("COMMIT");

      res.status(201).json({success: true,
  data: course,
  message: "Course created successfully"
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Create course,
error:", error);
    res.status(500).json({success: false,
  message: "Failed to create course"
    });
  }
};

// Update course
export const updateCourse = async (,
req: Request,
res: Response) => {
  try {
    const memberId = (req as any).member.memberId;
    const { id } = req.params;
    const {
      title,
      description,
      price,
      category,
      level,
      thumbnail,
      is_published
    } = req.body;

    // Check if course exists and belongs to member
    const courseResult = await pool.query(
      `
      SELECT * FROM courses WHERE id = $1 AND creator_id = $2
    `,
      [id, memberId],
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({success: false,
  message: "Course not found or you do not have permission to edit it"
      });
    }

    // Update course
    const result = await pool.query(
      `
      UPDATE courses 
      SET title = $1, description = $2, price = $3, category = $4, level = $5, 
          thumbnail = $6, is_published = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `,
      [title, description, price, category, level, thumbnail, is_published, id],;
    );

    res.status(200).json({success: true,
  data: result.rows[0],
  message: "Course updated successfully"
    });
  } catch (error) {
    console.error("Update course,
error:", error);
    res.status(500).json({success: false,
  message: "Failed to update course"
    });
  }
};

// Delete course
export const deleteCourse = async (,
req: Request,
res: Response) => {
  try {
    const memberId = (req as any).member.memberId;
    const { id } = req.params;

    // Check if course exists and belongs to member
    const courseResult = await pool.query(
      `
      SELECT * FROM courses WHERE id = $1 AND creator_id = $2
    `,
      [id, memberId],
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({success: false,
  message: "Course not found or you do not have permission to delete it"
      });
    }

    // Delete course (will cascade delete modules and lessons)
    await pool.query("DELETE FROM courses WHERE id = $1", [id]);

    res.status(200).json({success: true,
  message: "Course deleted successfully"
    });
  } catch (error) {
    console.error("Delete course,
error:", error);
    res.status(500).json({success: false,
  message: "Failed to delete course"
    });
  }
};

// Get member enrollments
export const getEnrollments = async (,
req: Request,
res: Response) => {
  try {
    const memberId = (req as any).member.memberId;

    const result = await pool.query(
      `
      SELECT e.*, c.title as course_title, c.thumbnail as course_thumbnail
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.member_id = $1
      ORDER BY e.enrolled_at DESC
    `,
      [memberId],
    );

    res.status(200).json({success: true,
  data: result.rows
    });
  } catch (error) {
    console.error("Get enrollments,
error:", error);
    res.status(500).json({success: false,
  message: "Failed to fetch enrollments"
    });
  }
};

// Enroll in course
export const enrollInCourse = async (,
req: Request,
res: Response) => {
  try {
    const memberId = (req as any).member.memberId;
    const { courseId } = req.body;

    // Check if course exists and is published
    const courseResult = await pool.query(
      `
      SELECT * FROM courses WHERE id = $1 AND is_published = true
    `,
      [courseId],
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({success: false,
  message: "Course not found or not published"
      });
    }

    // Check if already enrolled
    const enrollmentResult = await pool.query(
      `
      SELECT * FROM enrollments WHERE member_id = $1 AND course_id = $2
    `,
      [memberId, courseId],
    );

    if (enrollmentResult.rows.length > 0) {
      return res.status(400).json({success: false,
  message: "You are already enrolled in this course"
      });
    }

    // Create enrollment
    const result = await pool.query(
      `
      INSERT INTO enrollments (member_id, course_id)
      VALUES ($1, $2)
      RETURNING *
    `,
      [memberId, courseId],
    );

    res.status(201).json({success: true,
  data: result.rows[0],
  message: "Successfully enrolled in course"
    });
  } catch (error) {
    console.error("Enroll in course,
error:", error);
    res.status(500).json({success: false,
  message: "Failed to enroll in course"
    });
  }
};

// Update lesson progress
export const updateLessonProgress = async (,
req: Request,
res: Response) => {
  try {
    const memberId = (req as any).member.memberId;
    const { enrollmentId, lessonId, completed } = req.body;

    // Check if enrollment belongs to member
    const enrollmentResult = await pool.query(
      `
      SELECT e.*, c.id as course_id
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.id = $1 AND e.member_id = $2
    `,
      [enrollmentId, memberId],
    );

    if (enrollmentResult.rows.length === 0) {
      return res.status(404).json({success: false,
  message: "Enrollment not found"
      });
    }

    const enrollment = enrollmentResult.rows[0];

    // Check if lesson exists in the course
    const lessonResult = await pool.query(
      `
      SELECT l.id
      FROM lessons l
      JOIN course_modules cm ON l.module_id = cm.id
      WHERE l.id = $1 AND cm.course_id = $2
    `,
      [lessonId, enrollment.course_id],
    );

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({success: false,
  message: "Lesson not found in this course"
      });
    }

    let completedLessons = enrollment.completed_lessons || [];

    if (completed) {
      // Add lesson to completed lessons if not already there
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }
    } else {
      // Remove lesson from completed lessons
      completedLessons = completedLessons.filter(
        (,
id: number) => id !== lessonId,;
      );
    }

    // Calculate progress percentage
    const totalLessonsResult = await pool.query(
      `
      SELECT COUNT(*) as total
      FROM lessons l
      JOIN course_modules cm ON l.module_id = cm.id
      WHERE cm.course_id = $1
    `,
      [enrollment.course_id],
    );

    const totalLessons = parseInt(totalLessonsResult.rows[0].total);
    const progressPercentage =
      totalLessons > 0 ? (completedLessons.length / totalLessons) *,
100 : 0;

    // Update enrollment
    const result = await pool.query(
      `
      UPDATE enrollments
      SET completed_lessons = $1, progress_percentage = $2,
          completed_at = CASE WHEN $2 = 100 THEN NOW() ELSE completed_at END
      WHERE id = $3
      RETURNING *
    `,
      [completedLessons, progressPercentage, enrollmentId],;
    );

    res.status(200).json({success: true,
  data: result.rows[0],
  message: "Lesson progress updated successfully"
    });
  } catch (error) {
    console.error("Update lesson progress,
error:", error);
    res.status(500).json({success: false,
  message: "Failed to update lesson progress"
    });
  }
};
