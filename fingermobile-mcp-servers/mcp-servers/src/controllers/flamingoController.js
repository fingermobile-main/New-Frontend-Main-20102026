const pool = require("../config/database");
const { authenticate, authorize } = require("../middleware/auth");
const { logError } = require("../utils/errorLogger");

// Get premium content purchase history for the authenticated member
exports.getPurchaseHistory = async (req, res) => {
  try {
    const memberId = req.member.id; // Assuming member ID is available from authentication middleware

    const result = await pool.query(
      `SELECT
        tp.transaction_id,
        tp.purchase_date,
        tp.amount,
        tp.content_id,
        c.title as content_title,
        c.type as content_type,
        u.membername as creator_membername
      FROM
        transaction_purchases tp
      JOIN
        content c ON tp.content_id = c.id
      JOIN
        members u ON c.creator_id = u.id
      WHERE
        tp.buyer_id = $1 AND c.type = 'premium_flamingo'
      ORDER BY
        tp.purchase_date DESC;`,
      [memberId],
    );

    res.status(200).json(result.rows);
  } catch (error) {
    logError(error, {context: "FlamingoController - getPurchaseHistory" });
    res
      .status(500)
      .json({message: "Error retrieving purchase history",
  error: error.message
      });
  }
};

// Get unique stores from which the authenticated member has purchased premium flamingo content
exports.getStores = async (req, res) => {
  try {
    const memberId = req.member.id;

    const result = await pool.query(
      `SELECT DISTINCT
        u.id as store_id,
        u.membername as store_name
      FROM
        transaction_purchases tp
      JOIN
        content c ON tp.content_id = c.id
      JOIN
        members u ON c.creator_id = u.id
      WHERE
        tp.buyer_id = $1 AND c.type = 'premium_flamingo'
      ORDER BY
        u.membername;`,
      [memberId],
    );

    res.status(200).json(result.rows);
  } catch (error) {
    logError(error, {context: "FlamingoController - getStores" });
    res
      .status(500)
      .json({message: "Error retrieving stores",
  error: error.message });
  }
};
