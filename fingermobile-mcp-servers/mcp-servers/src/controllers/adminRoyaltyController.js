/* global require, module */
const db = require("../../config/db-config");

/**
 * Get all royalty records for admin view.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getAllRoyalties = async (req, res) => {
  try {
    const [royalties] = await db.promise().query("SELECT * FROM royalties");
    res.status(200).json(royalties);
  } catch (error) {
    res
      .status(500)
      .json({message: "Failed to fetch royalty records",
  error: error.message
      });
  }
};

/**
 * Get royalty records for a specific artist (admin view).
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getArtistRoyaltiesAdmin = async (req, res) => {
  try {
    const { artistId } = req.params;

    if (!artistId) {
      return res.status(400).json({message: "Artist ID is required." });
    }

    const [royalties] = await db
      .promise()
      .query("SELECT * FROM royalties WHERE artist_id = ?", [artistId]);

    res.status(200).json(royalties);
  } catch (error) {
    res
      .status(500)
      .json({message: "Failed to fetch artist royalty records",
  error: error.message
      });
  }
};

/**
 * Update a specific royalty record.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const updateRoyaltyRecord = async (req, res) => {
  try {
    const { royaltyId } = req.params;
    const { track_id, artist_id, amount, transaction_date } = req.body;

    if (!track_id || !artist_id || !amount || !transaction_date) {
      return res
        .status(400)
        .json({message: "All fields are required for updating a royalty record."
        });
    }

    await db
      .promise()
      .query(
        "UPDATE royalties SET track_id = ?, artist_id = ?, amount = ?, transaction_date = ? WHERE id = ?",
        [track_id, artist_id, amount, transaction_date, royaltyId],
      );

    res.status(200).json({message: "Royalty record updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({message: "Failed to update royalty record",
  error: error.message
      });
  }
};

/**
 * Delete a specific royalty record.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const deleteRoyaltyRecord = async (req, res) => {
  try {
    const { royaltyId } = req.params;

    await db.promise().query("DELETE FROM royalties WHERE id = ?", [royaltyId]);

    res.status(200).json({message: "Royalty record deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({message: "Failed to delete royalty record",
  error: error.message
      });
  }
};

module.exports = {
  getAllRoyalties,
  getArtistRoyaltiesAdmin,
  updateRoyaltyRecord,
  deleteRoyaltyRecord
};
