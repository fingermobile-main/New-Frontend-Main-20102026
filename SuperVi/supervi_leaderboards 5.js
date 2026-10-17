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
    service: "SuperVi Leaderboards API",
    timestamp: new Date().toISOString(),
  });
});

// Middleware to check for admin role (placeholder for now)
const isAdmin = (req, res, next) => {
  // In a real application, this would involve JWT verification and role checking
  // For now, we'll just proceed
  next();
};

// GET all leaderboards
router.get("/", async (req, res) => {
  try {
    const { game_mode, season_id, region, limit = 20, offset = 0 } = req.query;

    let query = "SELECT * FROM supervi_leaderboards";
    const params = [];
    let paramIndex = 0;

    let conditionsAdded = false;

    if (game_mode) {
      paramIndex++;
      query += ` WHERE game_mode = $${paramIndex}`;
      params.push(game_mode);
      conditionsAdded = true;
    }

    if (season_id) {
      paramIndex++;
      query += conditionsAdded
        ? ` AND season_id = $${paramIndex}`
        : ` WHERE season_id = $${paramIndex}`;
      params.push(season_id);
      conditionsAdded = true;
    }

    if (region) {
      paramIndex++;
      query += conditionsAdded
        ? ` AND region = $${paramIndex}`
        : ` WHERE region = $${paramIndex}`;
      params.push(region);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching leaderboards:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET a specific leaderboard by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM supervi_leaderboards WHERE id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Leaderboard not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST create a new leaderboard (Admin only)
router.post("/", isAdmin, async (req, res) => {
  const { game_mode, season_id, region } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO supervi_leaderboards (game_mode, season_id, region) VALUES ($1, $2, $3) RETURNING *",
      [game_mode, season_id, region],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating leaderboard:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT update a leaderboard (Admin only)
router.put("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { game_mode, season_id, region } = req.body;
  try {
    const result = await pool.query(
      "UPDATE supervi_leaderboards SET game_mode = $1, season_id = $2, region = $3 WHERE id = $4 RETURNING *",
      [game_mode, season_id, region, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Leaderboard not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating leaderboard:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE a leaderboard (Admin only)
router.delete("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM supervi_leaderboards WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Leaderboard not found" });
    }
    res.status(200).json({ message: "Leaderboard deleted successfully" });
  } catch (err) {
    console.error("Error deleting leaderboard:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET top entries for a specific leaderboard
router.get("/:id/entries", async (req, res) => {
  const { id } = req.params;
  const { limit = 10, offset = 0, sortBy = "score" } = req.query;
  try {
    let orderBy = "score DESC";
    if (sortBy === "rank") {
      orderBy = "score ASC"; // Lower scores might be better in some games
    } else if (sortBy === "date") {
      orderBy = "updated_at DESC";
    }

    const result = await pool.query(
      "SELECT le.*, m.membername, m.avatar_url FROM supervi_leaderboard_entries le JOIN members m ON le.member_id = m.id WHERE le.leaderboard_id = $1 ORDER BY " +
        orderBy +
        " LIMIT $2 OFFSET $3",
      [id, parseInt(limit), parseInt(offset)],
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching leaderboard entries:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET member's position in a specific leaderboard
router.get("/:id/members/:memberId/position", async (req, res) => {
  const { id, memberId } = req.params;
  try {
    // Get the member's score
    const memberEntry = await pool.query(
      "SELECT score, updated_at FROM supervi_leaderboard_entries WHERE leaderboard_id = $1 AND member_id = $2",
      [id, memberId],
    );

    if (memberEntry.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Member not found in this leaderboard" });
    }

    // Calculate position
    const positionResult = await pool.query(
      "SELECT COUNT(*) as position FROM supervi_leaderboard_entries WHERE leaderboard_id = $1 AND score > $2",
      [id, memberEntry.rows[0].score],
    );

    const position = parseInt(positionResult.rows[0].position) + 1;

    res.status(200).json({
      position,
      score: memberEntry.rows[0].score,
      updated_at: memberEntry.rows[0].updated_at,
      message: `Member is at position ${position}`,
    });
  } catch (err) {
    console.error("Error fetching member position:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST submit a new score for a member to a leaderboard
router.post("/:id/submit-score", async (req, res) => {
  const { id } = req.params;
  const { score } = req.body;
  const memberId = req.member.id; // Assuming member is authenticated

  try {
    // Validate input
    if (typeof score !== "number" || score < 0) {
      return res
        .status(400)
        .json({ message: "Score must be a positive number" });
    }

    // Check if leaderboard exists
    const leaderboardResult = await pool.query(
      "SELECT * FROM supervi_leaderboards WHERE id = $1",
      [id],
    );

    if (leaderboardResult.rows.length === 0) {
      return res.status(404).json({ message: "Leaderboard not found" });
    }

    // Check if member already has an entry
    const existingEntry = await pool.query(
      "SELECT * FROM supervi_leaderboard_entries WHERE leaderboard_id = $1 AND member_id = $2",
      [id, memberId],
    );

    if (existingEntry.rows.length > 0) {
      // If new score is better (higher), update it
      if (score > existingEntry.rows[0].score) {
        const result = await pool.query(
          "UPDATE supervi_leaderboard_entries SET score = $1, updated_at = NOW() WHERE leaderboard_id = $2 AND member_id = $3 RETURNING *",
          [score, id, memberId],
        );
        return res.status(200).json({
          message: "Score updated successfully",
          entry: result.rows[0],
          isNewRecord: true,
        });
      } else {
        return res.status(200).json({
          message: "Score not updated - existing score is higher",
          entry: existingEntry.rows[0],
          isNewRecord: false,
        });
      }
    } else {
      // Create new entry
      const result = await pool.query(
        "INSERT INTO supervi_leaderboard_entries (leaderboard_id, member_id, score) VALUES ($1, $2, $3) RETURNING *",
        [id, memberId, score],
      );
      return res.status(201).json({
        message: "Score submitted successfully",
        entry: result.rows[0],
        isNewRecord: true,
      });
    }
  } catch (err) {
    console.error("Error submitting score:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET leaderboard statistics
router.get("/:id/stats", async (req, res) => {
  const { id } = req.params;
  try {
    // Get basic stats
    const statsResult = await pool.query(
      `
      SELECT 
        COUNT(*) as total_players,
        MAX(score) as highest_score,
        MIN(score) as lowest_score,
        AVG(score) as average_score,
        STDDEV(score) as score_stddev
      FROM supervi_leaderboard_entries 
      WHERE leaderboard_id = $1
    `,
      [id],
    );

    // Get the leaderboard info
    const leaderboardResult = await pool.query(
      "SELECT * FROM supervi_leaderboards WHERE id = $1",
      [id],
    );

    if (leaderboardResult.rows.length === 0) {
      return res.status(404).json({ message: "Leaderboard not found" });
    }

    const stats = statsResult.rows[0];

    res.status(200).json({
      leaderboard: leaderboardResult.rows[0],
      stats: {
        totalPlayers: parseInt(stats.total_players),
        highestScore: parseFloat(stats.highest_score) || 0,
        lowestScore: parseFloat(stats.lowest_score) || 0,
        averageScore: parseFloat(stats.average_score) || 0,
        scoreStdDev: parseFloat(stats.score_stddev) || 0,
      },
    });
  } catch (err) {
    console.error("Error fetching leaderboard stats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET member's best scores across all leaderboards
router.get("/members/:memberId/best-scores", async (req, res) => {
  const { memberId } = req.params;
  const { limit = 10 } = req.query;

  try {
    const result = await pool.query(
      `
      SELECT 
        le.score,
        le.updated_at,
        lb.game_mode,
        lb.season_id,
        lb.region,
        (SELECT COUNT(*) FROM supervi_leaderboard_entries le2 
         WHERE le2.leaderboard_id = le.leaderboard_id AND le2.score > le.score) + 1 as rank
      FROM supervi_leaderboard_entries le
      JOIN supervi_leaderboards lb ON le.leaderboard_id = lb.id
      WHERE le.member_id = $1
      ORDER BY le.score DESC
      LIMIT $2
    `,
      [memberId, parseInt(limit)],
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching member best scores:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
