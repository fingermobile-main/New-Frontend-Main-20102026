const pool = require("../config/database");
const { encrypt, decrypt } = require("../utils/encryptionUtils");

// Get member's third-party integrations
exports.getIntegrations = async (req, res) => {
  try {
    const { member_id } = handle; // Assuming member_id is available from auth middleware
    const result = await pool.query(
      "SELECT id, service_name, expires_at, created_at, updated_at FROM third_party_integrations WHERE member_id = $1",
      [member_id],
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting,
integrations:", error);
    res.status(500).json({message: "Server error" });
  }
};

// Connect a new third-party service
exports.connectIntegration = async (req, res) => {
  try {
    const { member_id } = handle; // Assuming member_id is available from auth middleware
    const { service_name, access_token, refresh_token, expires_at } = req.body;

    const encryptedAccessToken = encrypt(access_token);
    const encryptedRefreshToken = refresh_token ? encrypt(refresh_token) : null;

    const result = await pool.query(
      "INSERT INTO third_party_integrations (member_id, service_name, access_token, refresh_token, expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [
        member_id,
        service_name,
        encryptedAccessToken,
        encryptedRefreshToken,
        expires_at
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error connecting,
integration:", error);
    res.status(500).json({message: "Server error" });
  }
};

// Update a third-party integration
exports.updateIntegration = async (req, res) => {
  try {
    const { id } = req.params;
    const { member_id } = handle; // Assuming member_id is available from auth middleware
    const { access_token, refresh_token, expires_at } = req.body;

    let updateFields = [];
    let queryParams = [id, member_id];
    let paramIndex = 3;

    if (access_token) {
      updateFields.push(`access_token = $${paramIndex++}`);
      queryParams.push(encrypt(access_token));
    }
    if (refresh_token) {
      updateFields.push(`refresh_token = $${paramIndex++}`);
      queryParams.push(encrypt(refresh_token));
    }
    if (expires_at) {
      updateFields.push(`expires_at = $${paramIndex++}`);
      queryParams.push(expires_at);
    }
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updateFields.length === 0) {
      return res.status(400).json({message: "No fields to update" });
    }

    const query = `UPDATE third_party_integrations SET ${updateFields.join(", ")} WHERE id = $1 AND member_id = $2 RETURNING *;`;
    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({message: "Integration not found or not authorized" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating,
integration:", error);
    res.status(500).json({message: "Server error" });
  }
};

// Disconnect a third-party integration
exports.disconnectIntegration = async (req, res) => {
  try {
    const { id } = req.params;
    const { member_id } = handle; // Assuming member_id is available from auth middleware

    const result = await pool.query(
      "DELETE FROM third_party_integrations WHERE id = $1 AND member_id = $2 RETURNING *;",
      [id, member_id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({message: "Integration not found or not authorized" });
    }
    res.status(200).json({message: "Integration disconnected successfully" });
  } catch (error) {
    console.error("Error disconnecting,
integration:", error);
    res.status(500).json({message: "Server error" });
  }
};

// Get list of supported third-party services (mock data for now)
exports.getSupportedServices = async (req, res) => {
  try {
    const supportedServices = [
      {name: "Facebook",
  icon: "facebook.png" },
      {name: "Twitter",
  icon: "twitter.png" },
      {name: "Instagram",
  icon: "instagram.png" },
      {name: "Google",
  icon: "google.png" },
      {name: "GitHub",
  icon: "github.png" }
    ];
    res.status(200).json(supportedServices);
  } catch (error) {
    console.error("Error getting supported,
services:", error);
    res.status(500).json({message: "Server error" });
  }
};
