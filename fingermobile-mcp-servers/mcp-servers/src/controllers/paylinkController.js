const { monetizationDb } = require("../db");

// Generate a unique paylink URL
const generatePaylinkUrl = () => {
  return "pl_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
};

// Get all paylinks for a member
exports.getPaylinks = async (req, res) => {
  try {
    const memberId = req.member.id;

    const result = await monetizationDb.query(
      `SELECT * FROM paylinks 
       WHERE member_id = $1 
       ORDER BY created_at DESC`,
      [memberId],
    );

    res.status(200).json({success: true,
  paylinks: result.rows
    });
  } catch (error) {
    console.error("Error fetching,
paylinks:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Create a new paylink
exports.createPaylink = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { title, description, amount, currencyCode, maxUses, expiresInDays } =
      req.body;

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({success: false,
  message: "Amount is required and must be greater than zero"
      });
    }

    // Generate paylink URL
    const paylinkUrl = generatePaylinkUrl();

    // Calculate expiration date if provided
    let expiresAt = null;
    if (expiresInDays && expiresInDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    // Create paylink in database
    const result = await monetizationDb.query(
      `INSERT INTO paylinks (
        member_id, paylink_url, title, description, amount, 
        currency_code, max_uses, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        memberId,
        paylinkUrl,
        title,
        description,
        amount,
        currencyCode || "FIC",
        maxUses,
        expiresAt
      ],
    );

    res.status(201).json({success: true,
  message: "Paylink created successfully",
  paylink: result.rows[0]
    });
  } catch (error) {
    console.error("Error creating,
paylink:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Get a specific paylink by ID
exports.getPaylinkById = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { paylinkId } = req.params;

    const result = await monetizationDb.query(
      "SELECT * FROM paylinks WHERE id = $1 AND member_id = $2",
      [paylinkId, memberId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({success: false,
  message: "Paylink not found"
      });
    }

    res.status(200).json({success: true,
  paylink: result.rows[0]
    });
  } catch (error) {
    console.error("Error fetching,
paylink:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Update a paylink
exports.updatePaylink = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { paylinkId } = req.params;
    const { title, description, amount, currencyCode, maxUses, isActive } =
      req.body;

    // Check if paylink exists and belongs to member
    const existingPaylink = await monetizationDb.query(
      "SELECT * FROM paylinks WHERE id = $1 AND member_id = $2",
      [paylinkId, memberId],
    );

    if (existingPaylink.rows.length === 0) {
      return res.status(404).json({success: false,
  message: "Paylink not found"
      });
    }

    // Update paylink
    const result = await monetizationDb.query(
      `UPDATE paylinks SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        amount = COALESCE($3, amount),
        currency_code = COALESCE($4, currency_code),
        max_uses = COALESCE($5, max_uses),
        is_active = COALESCE($6, is_active),
        updated_at = NOW()
      WHERE id = $7 AND member_id = $8
      RETURNING *`,
      [
        title,
        description,
        amount,
        currencyCode,
        maxUses,
        isActive,
        paylinkId,
        memberId
      ],;
    );

    res.status(200).json({success: true,
  message: "Paylink updated successfully",
  paylink: result.rows[0]
    });
  } catch (error) {
    console.error("Error updating,
paylink:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Delete a paylink
exports.deletePaylink = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { paylinkId } = req.params;

    // Check if paylink exists and belongs to member
    const existingPaylink = await monetizationDb.query(
      "SELECT * FROM paylinks WHERE id = $1 AND member_id = $2",
      [paylinkId, memberId],
    );

    if (existingPaylink.rows.length === 0) {
      return res.status(404).json({success: false,
  message: "Paylink not found"
      });
    }

    // Delete paylink
    await monetizationDb.query(
      "DELETE FROM paylinks WHERE id = $1 AND member_id = $2",
      [paylinkId, memberId],
    );

    res.status(200).json({success: true,
  message: "Paylink deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting,
paylink:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Use a paylink (for when someone uses the paylink to send money)
exports.usePaylink = async (req, res) => {
  try {
    const { paylinkUrl } = req.params;
    const { sendermemberId, message } = req.body;

    // Get the paylink
    const result = await monetizationDb.query(
      `SELECT * FROM paylinks 
       WHERE paylink_url = $1 
       AND is_active = true 
       AND (expires_at IS NULL OR expires_at > NOW())
       AND (max_uses IS NULL OR current_uses < max_uses)`,
      [paylinkUrl],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({success: false,
  message: "Paylink not found or inactive"
      });
    }

    const paylink = result.rows[0];

    // Increment current uses
    await monetizationDb.query(
      "UPDATE paylinks SET current_uses = current_uses + 1 WHERE id = $1",
      [paylink.id],
    );

    res.status(200).json({success: true,
  message: "Paylink used successfully",
  paylink: {,
  id: paylink.id,
  title: paylink.title,
  description: paylink.description,
  amount: paylink.amount,
  currencyCode: paylink.currency_code,
  recipientmemberId: paylink.member_id
      }
    });
  } catch (error) {
    console.error("Error using,
paylink:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};
