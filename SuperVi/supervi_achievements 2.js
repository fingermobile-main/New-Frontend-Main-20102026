const express = require("express");
const { Pool } = require("pg");

const router = express.Router();

// Database connection pool for SuperVi
const pool = new Pool({
  member: process.env.SUPERVI_DB_MEMBER || "supervi_member", // Standardized from 'member' to 'member'
  host: process.env.DB_HOST || "supervi-db",
  database: process.env.SUPERVI_DB_NAME || "supervi_db",
  password: process.env.SUPERVI_DB_PASSWORD || "supervi_password",
  port: process.env.SUPERVI_DB_PORT || 5433,
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "SuperVi Achievements API",
    timestamp: new Date().toISOString(),
  });
});

// Middleware to check for admin role (placeholder for now)
const isAdmin = (req, res, next) => {
  // In a real application, this would involve JWT verification and role checking
  // For now, we'll just proceed
  next();
};

// GET all achievements with filtering
router.get("/", async (req, res) => {
  try {
    const {
      category,
      points_min,
      points_max,
      is_hidden,
      limit = 20,
      offset = 0,
    } = req.query;

    let query = "SELECT * FROM supervi_achievements";
    const params = [];
    let paramIndex = 0;

    let conditionsAdded = false;

    if (category) {
      paramIndex++;
      query += ` WHERE category = $${paramIndex}`;
      params.push(category);
      conditionsAdded = true;
    }

    if (points_min) {
      paramIndex++;
      query += conditionsAdded
        ? ` AND points >= $${paramIndex}`
        : ` WHERE points >= $${paramIndex}`;
      params.push(points_min);
      conditionsAdded = true;
    }

    if (points_max) {
      paramIndex++;
      query += conditionsAdded
        ? ` AND points <= $${paramIndex}`
        : ` WHERE points <= $${paramIndex}`;
      params.push(points_max);
      conditionsAdded = true;
    }

    if (is_hidden !== undefined) {
      paramIndex++;
      query += conditionsAdded
        ? ` AND is_hidden = $${paramIndex}`
        : ` WHERE is_hidden = $${paramIndex}`;
      params.push(is_hidden === "true");
    }

    query += ` ORDER BY points DESC, created_at DESC LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching achievements:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET a specific achievement by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM supervi_achievements WHERE id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Achievement not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching achievement:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST create a new achievement (Admin only)
router.post("/", isAdmin, async (req, res) => {
  const {
    name,
    description,
    icon_url,
    category,
    points,
    threshold,
    requirement_type,
    is_hidden,
  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO supervi_achievements (name, description, icon_url, category, points, threshold, requirement_type, is_hidden) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        name,
        description,
        icon_url,
        category,
        points,
        threshold,
        requirement_type,
        is_hidden,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating achievement:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT update an achievement (Admin only)
router.put("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    icon_url,
    category,
    points,
    threshold,
    requirement_type,
    is_hidden,
  } = req.body;
  try {
    const result = await pool.query(
      "UPDATE supervi_achievements SET name = $1, description = $2, icon_url = $3, category = $4, points = $5, threshold = $6, requirement_type = $7, is_hidden = $8 WHERE id = $9 RETURNING *",
      [
        name,
        description,
        icon_url,
        category,
        points,
        threshold,
        requirement_type,
        is_hidden,
        id,
      ],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Achievement not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating achievement:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE an achievement (Admin only)
router.delete("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM supervi_achievements WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Achievement not found" });
    }
    res.status(200).json({ message: "Achievement deleted successfully" });
  } catch (err) {
    console.error("Error deleting achievement:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET achievements for a specific member
router.get("/members/:memberId", async (req, res) => {
  const { memberId } = req.params;
  try {
    const result = await pool.query(
      "SELECT sa.*, sma.unlocked_at, sma.progress, sma.is_unlocked FROM supervi_member_achievements sma JOIN supervi_achievements sa ON sma.achievement_id = sa.id WHERE sma.member_id = $1",
      [memberId],
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching member achievements:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST unlock an achievement for a member
router.post("/members/:memberId/:achievementId/unlock", async (req, res) => {
  const { memberId, achievementId } = req.params;
  const { progress } = req.body; // Optional: for achievements with progress
  try {
    // Check if achievement exists
    const achievementExists = await pool.query(
      "SELECT id FROM supervi_achievements WHERE id = $1",
      [achievementId],
    );
    if (achievementExists.rows.length === 0) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    // Check if member achievement already exists
    const existingMemberAchievement = await pool.query(
      "SELECT * FROM supervi_member_achievements WHERE member_id = $1 AND achievement_id = $2",
      [memberId, achievementId],
    );

    if (existingMemberAchievement.rows.length > 0) {
      // Update existing achievement progress
      const updatedAchievement = await pool.query(
        "UPDATE supervi_member_achievements SET progress = $1, unlocked_at = NOW(), is_unlocked = TRUE WHERE member_id = $2 AND achievement_id = $3 RETURNING *",
        [
          progress || existingMemberAchievement.rows[0].progress,
          memberId,
          achievementId,
        ],
      );
      return res.status(200).json(updatedAchievement.rows[0]);
    } else {
      // Insert new member achievement
      const newAchievement = await pool.query(
        "INSERT INTO supervi_member_achievements (member_id, achievement_id, unlocked_at, progress, is_unlocked) VALUES ($1, $2, NOW(), $3, TRUE) RETURNING *",
        [memberId, achievementId, progress || 0],
      );
      return res.status(201).json(newAchievement.rows[0]);
    }
  } catch (err) {
    console.error("Error unlocking achievement for member:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST update progress for an achievement for a member
router.post("/members/:memberId/:achievementId/progress", async (req, res) => {
  const { memberId, achievementId } = req.params;
  const { progress } = req.body;

  if (progress === undefined || typeof progress !== "number") {
    return res.status(400).json({ message: "Progress must be a number" });
  }

  try {
    // Check if achievement exists
    const achievementExists = await pool.query(
      "SELECT id, threshold FROM supervi_achievements WHERE id = $1",
      [achievementId],
    );
    if (achievementExists.rows.length === 0) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    const achievement = achievementExists.rows[0];

    // Check if member achievement already exists
    const existingMemberAchievement = await pool.query(
      "SELECT * FROM supervi_member_achievements WHERE member_id = $1 AND achievement_id = $2",
      [memberId, achievementId],
    );

    if (existingMemberAchievement.rows.length > 0) {
      // Update existing achievement progress
      const updatedProgress = Math.min(progress, achievement.threshold); // Don't exceed threshold
      const isUnlocked = updatedProgress >= achievement.threshold;

      const updatedAchievement = await pool.query(
        "UPDATE supervi_member_achievements SET progress = $1, is_unlocked = $2, updated_at = NOW() WHERE member_id = $3 AND achievement_id = $4 RETURNING *",
        [updatedProgress, isUnlocked, memberId, achievementId],
      );

      return res.status(200).json({
        message: isUnlocked ? "Achievement unlocked!" : "Progress updated",
        achievement: updatedAchievement.rows[0],
      });
    } else {
      // Insert new member achievement
      const newProgress = Math.min(progress, achievement.threshold); // Don't exceed threshold
      const isUnlocked = newProgress >= achievement.threshold;

      const newAchievement = await pool.query(
        "INSERT INTO supervi_member_achievements (member_id, achievement_id, progress, is_unlocked) VALUES ($1, $2, $3, $4) RETURNING *",
        [memberId, achievementId, newProgress, isUnlocked],
      );

      return res.status(201).json({
        message: isUnlocked ? "Achievement unlocked!" : "Progress recorded",
        achievement: newAchievement.rows[0],
      });
    }
  } catch (err) {
    console.error("Error updating achievement progress for member:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET member's achievement statistics
router.get("/members/:memberId/stats", async (req, res) => {
  const { memberId } = req.params;
  try {
    // Get stats for member's achievements
    const statsResult = await pool.query(
      `
      SELECT 
        COUNT(*) as total_achievements,
        COUNT(CASE WHEN sma.is_unlocked = TRUE THEN 1 END) as unlocked_count,
        SUM(sa.points) as total_points_earned,
        (SELECT COUNT(*) FROM supervi_achievements) as total_available
      FROM supervi_member_achievements sma
      JOIN supervi_achievements sa ON sma.achievement_id = sa.id
      WHERE sma.member_id = $1
    `,
      [memberId],
    );

    const stats = statsResult.rows[0];

    // Calculate completion percentage
    const totalAvailable = await pool.query(
      "SELECT COUNT(*) as count FROM supervi_achievements",
    );
    const completionPercentage =
      totalAvailable.rows[0].count > 0
        ? Math.round(
            (stats.unlocked_count / totalAvailable.rows[0].count) * 100,
          )
        : 0;

    res.status(200).json({
      memberId,
      totalAchievements: parseInt(stats.total_achievements),
      unlockedCount: parseInt(stats.unlocked_count),
      totalPointsEarned: parseInt(stats.total_points_earned),
      totalAvailable: parseInt(totalAvailable.rows[0].count),
      completionPercentage: completionPercentage + "%",
    });
  } catch (err) {
    console.error("Error fetching member achievement stats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET top achievers
router.get("/top-achievers", async (req, res) => {
  const { limit = 10 } = req.query;
  try {
    const result = await pool.query(
      `
      SELECT 
        m.membername,
        m.avatar_url,
        COUNT(sma.id) as achievements_unlocked,
        SUM(sa.points) as total_points
      FROM members m
      JOIN supervi_member_achievements sma ON m.id = sma.member_id
      JOIN supervi_achievements sa ON sma.achievement_id = sa.id
      WHERE sma.is_unlocked = TRUE
      GROUP BY m.id, m.membername, m.avatar_url
      ORDER BY total_points DESC
      LIMIT $1
    `,
      [parseInt(limit)],
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching top achievers:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
