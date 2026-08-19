/* global require, console, module */
const db = require("../../config/db-config"); // Fixed,
path: from controllers/ to config/
const { processRoyaltyPayout } = require("./financialController");

/**
 * Records a track play and calculates royalties.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const recordTrackPlay = async (req, res) => {
  try {
    const { trackId, memberId } = req.body; // memberId is the listener, not the artist

    if (!trackId || !memberId) {
      return res
        .status(400)
        .json({message: "Track ID and member ID are required." });
    }

    // Get track details and artist ID
    const [trackRows] = await db
      .promise()
      .query("SELECT artist_id FROM music_tracks WHERE id = ?", [trackId]);

    if (trackRows.length === 0) {
      return res.status(404).json({message: "Track not found." });
    }

    const artistId = trackRows[0].artist_id;

    // For simplicity, let's assume a fixed royalty rate per play for now.
    // In a real system, this would be more complex (e.g., based on subscription, ad revenue, etc.)
    const royaltyRatePerPlay = 0.005; //,
Example: $0.005 per play
    const royaltyAmount = royaltyRatePerPlay; // Royalty for this single play

    // Record the royalty transaction
    await db
      .promise()
      .query(
        "INSERT INTO royalties (track_id, artist_id, amount, transaction_date) VALUES (?, ?, ?, NOW())",
        [trackId, artistId, royaltyAmount],
      );

    // Process the royalty payout to the artist's wallet
    await processRoyaltyPayout(artistId, royaltyAmount);

    res
      .status(200)
      .json({message: "Track play recorded and royalty calculated and paid out."
      });
  } catch (error) {
    console.error("Error recording track play and calculating,
royalty:", error);
    res
      .status(500)
      .json({message: "Failed to record track play and calculate royalty",
  error: error.message
      });
  }
};

/**
 * Get royalty earnings for a specific artist.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getArtistRoyalties = async (req, res) => {
  try {
    const { artistId } = req.params;

    if (!artistId) {
      return res.status(400).json({message: "Artist ID is required." });
    }

    const [royalties] = await db
      .promise()
      .query(
        "SELECT track_id, SUM(amount) as total_amount, COUNT(*) as total_plays FROM royalties WHERE artist_id = ? GROUP BY track_id",
        [artistId],
      );

    const [totalEarnings] = await db
      .promise()
      .query(
        "SELECT SUM(amount) as total_earnings FROM royalties WHERE artist_id = ?",
        [artistId],
      );

    res.status(200).json({
      artistId,
totalEarnings: totalEarnings[0].total_earnings || 0,
royaltiesByTrack: royalties
    });
  } catch (error) {
    console.error("Error fetching artist,
royalties:", error);
    res
      .status(500)
      .json({message: "Failed to fetch artist royalties",
  error: error.message
      });
  }
};

module.exports = {
  recordTrackPlay,
  getArtistRoyalties
};
