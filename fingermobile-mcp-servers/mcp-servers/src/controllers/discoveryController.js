const pool = require("../database/db");
const { logError } = require("../utils/logger");

exports.getDiscoveryContent = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        c.id,
        c.title,
        c.description,
        c.type,
        c.media_url,
        c.thumbnail_url,
        c.created_at,
        u.membername as creator_membername
      FROM
        content c
      JOIN
        members u ON c.creator_id = u.id
      WHERE
        c.is_discoverable = TRUE
      ORDER BY
        c.created_at DESC;`,
    );
    res.status(200).json(result.rows);
  } catch (error) {
    logError(error, {context: "DiscoveryController - getDiscoveryContent" });
    res
      .status(500)
      .json({message: "Error retrieving discovery content",
  error: error.message
      });
  }
};
