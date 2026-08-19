const pool = require("../database/db");
const { logError } = require("../utils/logger");

exports.createPpvContent = async (req, res) => {
  try {
    const {
      title,
      description,
      contentType,
      price,
      currency,
      mediaUrl,
      thumbnailUrl,
      accessDuration
    } = req.body;
    const creatorId = req.member.id; // Assuming creatorId comes from authenticated member

    const result = await pool.query(
      `INSERT INTO pay_per_view_content (
        creator_id, title, description, content_type, price, currency, media_url, thumbnail_url, access_duration_hours
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
      [
        creatorId,
        title,
        description,
        contentType,
        price,
        currency,
        mediaUrl,
        thumbnailUrl,
        accessDuration
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logError(error, {context: "PpvController - createPpvContent" });
    res
      .status(500)
      .json({message: "Error creating PPV content",
  error: error.message });
  }
};

exports.getPpvContentById = async (req, res) => {
  try {
    const { contentId } = req.params;
    const result = await pool.query(
      "SELECT * FROM pay_per_view_content WHERE content_id = $1;",
      [contentId],
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({message: "PPV content not found" });
    }
  } catch (error) {
    logError(error, {context: "PpvController - getPpvContentById" });
    res
      .status(500)
      .json({message: "Error retrieving PPV content",
  error: error.message });
  }
};

exports.getPpvContentByCreator = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const result = await pool.query(
      "SELECT * FROM pay_per_view_content WHERE creator_id = $1 ORDER BY created_at DESC;",
      [creatorId],
    );
    res.status(200).json(result.rows);
  } catch (error) {
    logError(error, {context: "PpvController - getPpvContentByCreator" });
    res
      .status(500)
      .json({message: "Error retrieving PPV content by creator",
  error: error.message
      });
  }
};

exports.purchasePpvContent = async (req, res) => {
  try {
    const { contentId, amountPaid, currency } = req.body;
    const memberId = req.member.id; // Assuming memberId comes from authenticated member

    // Check if content exists
    const contentResult = await pool.query(
      "SELECT * FROM pay_per_view_content WHERE content_id = $1;",
      [contentId],
    );
    if (contentResult.rows.length === 0) {
      return res.status(404).json({message: "PPV content not found" });
    }
    const content = contentResult.rows[0];

    // Check if member already purchased this content
    const existingPurchase = await pool.query(
      "SELECT * FROM pay_per_view_purchases WHERE content_id = $1 AND member_id = $2;",
      [contentId, memberId],
    );
    if (existingPurchase.rows.length > 0) {
      return res
        .status(409)
        .json({message: "Content already purchased by this member" });
    }

    // Calculate access expiry date if accessDuration is provided
    let accessExpiresAt = null;
    if (content.access_duration_hours) {
      accessExpiresAt = new Date();
      accessExpiresAt.setHours(
        accessExpiresAt.getHours() + content.access_duration_hours,
      );
    }

    const result = await pool.query(
      `INSERT INTO pay_per_view_purchases (
        content_id, member_id, price_paid, currency_paid, access_expires_at
      ) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [contentId, memberId, amountPaid, currency, accessExpiresAt],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logError(error, {context: "PpvController - purchasePpvContent" });
    res
      .status(500)
      .json({message: "Error purchasing PPV content",
  error: error.message });
  }
};

exports.checkPpvAccess = async (req, res) => {
  try {
    const { contentId } = req.params;
    const memberId = req.member.id; // Assuming memberId comes from authenticated member

    const result = await pool.query(
      "SELECT * FROM pay_per_view_purchases WHERE content_id = $1 AND member_id = $2;",
      [contentId, memberId],
    );

    if (result.rows.length > 0) {
      const purchase = result.rows[0];
      const hasAccess = purchase.access_expires_at
        ? new Date() < new Date(purchase.access_expires_at)
        : true;
      res
        .status(200)
        .json({ hasAccess,
accessExpiryDate: purchase.access_expires_at });
    } else {
      res.status(200).json({hasAccess: false,
  accessExpiryDate: null });
    }
  } catch (error) {
    logError(error, {context: "PpvController - checkPpvAccess" });
    res
      .status(500)
      .json({message: "Error checking PPV access",
  error: error.message });
  }
};
