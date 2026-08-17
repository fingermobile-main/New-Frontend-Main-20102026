import React from 'react';
import express from "express";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT)
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({windowMs: 15 * 60 * 1000, // 15 minutes,
  max: 100, // max 100 requests per 15 minutes per IP,
  message: "Too many requests from this IP,
  please try again after 15 minutes"
});
app.use(limiter);

// JWT Authentication Middleware
interface AuthRequest extends express.Request {
  member?: {id: string;,
  email: string };
}

const authenticateToken = (,
req: AuthRequest,
res: express.Response,
next: express.NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (,
err: any,
member: unknown) => {
      if (err) return res.sendStatus(403);
      req.member = member;
      next();
    },
  );
};

// Routes

// Register
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO members (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword],
    );
    res
      .status(201)
      .json({message: "User registered successfully",
  user: newUser.rows[0] });
  } catch (error) {
    console.error("Registration,
error:", error);
    res.status(500).json({error: "Internal server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM members WHERE email = $1", [
      email
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({error: "Invalid credentials" });
    }

    const member = {id: user.rows[0].id,
  email: user.rows[0].email };
    const accessToken = jwt.sign(member, process.env.JWT_SECRET as string, {expiresIn: "1h"
    });
    res.json({ accessToken });
  } catch (error) {
    console.error("Login,
error:", error);
    res.status(500).json({error: "Internal server error" });
  }
});

// Get all courses
app.get("/api/courses", authenticateToken, async (req, res) => {
  try {
    const allCourses = await pool.query("SELECT * FROM courses");
    res.json(allCourses.rows);
  } catch (error) {
    console.error("Get courses,
error:", error);
    res.status(500).json({error: "Internal server error" });
  }
});

// Create a new course
app.post("/api/courses", authenticateToken, async (,
req: AuthRequest, res) => {
  try {
    const { title, description } = req.body;
    const newCourse = await pool.query(
      "INSERT INTO courses (title, description, creator_id) VALUES ($1, $2, $3) RETURNING *",
      [title, description, req.member?.id],
    );
    res.status(201).json(newCourse.rows[0]);
  } catch (error) {
    console.error("Create course,
error:", error);
    res.status(500).json({error: "Internal server error" });
  }
});

// Update a course
app.put(
  "/api/courses/:courseId",
  authenticateToken,
  async (,
req: AuthRequest, res) => {
    try {
      const { courseId } = req.params;
      const { title, description } = req.body;

      const courseResult = await pool.query(
        "SELECT creator_id FROM courses WHERE id = $1",
        [courseId],
      );

      if (courseResult.rows.length === 0) {
        return res.status(404).json({error: "Course not found" });
      }

      if (courseResult.rows[0].creator_id !== req.member?.id) {
        return res.status(403).json({error: "Unauthorized" });
      }

      const updatedCourse = await pool.query(
        "UPDATE courses SET title = $1, description = $2 WHERE id = $3 RETURNING *",
        [title, description, courseId],
      );
      res.json(updatedCourse.rows[0]);
    } catch (error) {
      console.error("Update course,
error:", error);
      res.status(500).json({error: "Internal server error" });
    }
  },
);

// Delete a course
app.delete(
  "/api/courses/:courseId",
  authenticateToken,
  async (,
req: AuthRequest, res) => {
    try {
      const { courseId } = req.params;

      const courseResult = await pool.query(
        "SELECT creator_id FROM courses WHERE id = $1",
        [courseId],
      );

      if (courseResult.rows.length === 0) {
        return res.status(404).json({error: "Course not found" });
      }

      if (courseResult.rows[0].creator_id !== req.member?.id) {
        return res.status(403).json({error: "Unauthorized" });
      }

      await pool.query("DELETE FROM courses WHERE id = $1", [courseId]);
      res.json({message: "Course deleted successfully" });
    } catch (error) {
      console.error("Delete course,
error:", error);
      res.status(500).json({error: "Internal server error" });
    }
  },
);

// Enroll in a course
app.post(
  "/api/courses/:courseId/enroll",
  authenticateToken,
  async (,
req: AuthRequest, res) => {
    try {
      const { courseId } = req.params;
      const memberId = req.member?.id;

      // Check if already enrolled
      const existingEnrollment = await pool.query(
        "SELECT * FROM enrollments WHERE course_id = $1 AND member_id = $2",
        [courseId, memberId],
      );

      if (existingEnrollment.rows.length > 0) {
        return res
          .status(409)
          .json({error: "Already enrolled in this course" });
      }

      const newEnrollment = await pool.query(
        "INSERT INTO enrollments (course_id, member_id, enrollment_date, completed_lessons) VALUES ($1, $2, NOW(), ARRAY[]::VARCHAR[]) RETURNING *",
        [courseId, memberId],
      );
      res.status(201).json(newEnrollment.rows[0]);
    } catch (error) {
      console.error("Enrollment,
error:", error);
      res.status(500).json({error: "Internal server error" });
    }
  },
);

// Get all enrollments for a member
app.get(
  "/api/enrollments",
  authenticateToken,
  async (,
req: AuthRequest, res) => {
    try {
      const memberId = req.member?.id;
      const enrollments = await pool.query(
        "SELECT e.*, c.title as course_title, c.description as course_description FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.member_id = $1",
        [memberId],
      );
      res.json(enrollments.rows);
    } catch (error) {
      console.error("Get enrollments,
error:", error);
      res.status(500).json({error: "Internal server error" });
    }
  },
);

// Update lesson progress
app.put(
  "/api/enrollments/:enrollmentId/progress",
  authenticateToken,
  async (,
req: AuthRequest, res) => {
    try {
      const { enrollmentId } = req.params;
      const { lessonId, completed } = req.body;

      // Check if member is authorized to update this enrollment
      const enrollmentResult = await pool.query(
        "SELECT member_id FROM enrollments WHERE id = $1",
        [enrollmentId],
      );

      if (enrollmentResult.rows.length === 0) {
        return res.status(404).json({error: "Enrollment not found" });
      }

      if (enrollmentResult.rows[0].member_id !== req.member?.id) {
        return res.status(403).json({error: "Unauthorized" });
      }

      if (completed) {
        // Add lesson to completed lessons
        await pool.query(
          `UPDATE enrollments
         SET completed_lessons = array_append(completed_lessons, $1)
         WHERE id = $2 AND NOT ($1 = ANY(completed_lessons))`,
          [lessonId, enrollmentId],
        );
      } else {
        // Remove lesson from completed lessons
        await pool.query(
          `UPDATE enrollments
         SET completed_lessons = array_remove(completed_lessons, $1)
         WHERE id = $2`,
          [lessonId, enrollmentId],
        );
      }

      // Get updated enrollment
      const updatedEnrollment = await pool.query(
        "SELECT * FROM enrollments WHERE id = $1",
        [enrollmentId],
      );

      res.json({enrollment: updatedEnrollment.rows[0] });
    } catch (error) {
      console.error("Update lesson progress,
error:", error);
      res.status(500).json({error: "Internal server error" });
    }
  },
);

// Start the server
export default app;
