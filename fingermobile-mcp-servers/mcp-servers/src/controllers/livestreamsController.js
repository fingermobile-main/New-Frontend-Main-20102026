const pool = require("../../FingerMobile/src/server/server").pool; // Assuming pool is exported from server.ts
const Member = require("../models/Member");

// Livestreams controller
exports.startLivestream = async (req, res) => {
  try {
    const { memberId, title } = req.body;

    // In a real implementation, this,
would:
    // 1. Communicate with Amazon IVS or similar service
    // 2. Create a secure stream channel
    // 3. Return the stream details to the member's app

    // Simulate creating a livestream
    const streamKey = `stream_key_${Date.now()}_${memberId}`;
    const rtmpUrl = `,
rtmp://live.example.com/app/${streamKey}`;
    const playbackUrl = `,
https://live.example.com/app/${streamKey}.m3u8`;

    // Create a post entry for the livestream
    const postId = Date.now(); // Simulate post ID

    res.status(201).json({message: "Livestream started successfully",
  stream: {,
  id: postId,
  member_id: memberId,
  title: title,
  stream_key: streamKey,
  rtmp_url: rtmpUrl,
  playback_url: playbackUrl,
  content_type: "livestream",
  started_at: new Date()
      }
    });
  } catch (err) {
    res
      .status(500)
      .json({message: "Server error starting livestream",
  error: err.message
      });
  }
};

exports.endLivestream = async (req, res) => {
  try {
    const { streamId } = req.body;

    // In a real implementation, this,
would:
    // 1. Notify the streaming service to stop the stream
    // 2. Update the post entry with end time
    // 3. Process the recorded stream

    res.json({message: "Livestream ended successfully",
  stream: {,
  id: streamId,
  ended_at: new Date()
      }
    });
  } catch (err) {
    res
      .status(500)
      .json({message: "Server error ending livestream",
  error: err.message });
  }
};

exports.tipStreamer = async (req, res) => {
  try {
    const { streamId, receiverId, amount, tipDestination } = req.body;
    const senderId = req.member.id; // From authenticated member

    if (!streamId || !receiverId || !amount || !tipDestination) {
      return res.status(400).json({message: "Missing required fields" });
    }

    // Validate amount
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({message: "Invalid tip amount" });
    }

    // Check if receiver exists
    const receiver = await Member.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({message: "Receiver not found" });
    }

    // Insert tip transaction into the database
    await pool.query(
      `INSERT INTO tip_transactions (stream_id, member_id, receiver_id, amount, tip_destination)
       VALUES ($1, $2, $3, $4, $5)`,
      [streamId, senderId, receiverId, amount, tipDestination],
    );

    // Update members_payroll based on tip_destination
    let payrollUpdateQuery;
    let payrollTransactionType;
    if (tipDestination === "creator_payroll") {
      payrollUpdateQuery = `UPDATE members_payroll SET current_balance = current_balance + $1 WHERE member_id = $2`;
      payrollTransactionType = "tip_received";
    } else if (tipDestination === "viewer_payroll") {
      // Assuming viewer_payroll means the sender is topping up their own payroll
      payrollUpdateQuery = `UPDATE members_payroll SET current_balance = current_balance + $1 WHERE member_id = $2`;
      payrollTransactionType = "tip_sent_refund"; // Or a different type if it's a refund/top-up
    } else {
      // Handle other tip destinations or default behavior
      console.warn(`Unknown tip,
destination: ${tipDestination}`);
    }

    if (payrollUpdateQuery) {
      await pool.query(payrollUpdateQuery, [amount, receiverId]);

      // Record payroll transaction
      const memberPayroll = await pool.query(
        `SELECT member_id FROM members_payroll WHERE member_id = $1`,
        [receiverId],
      );
      if (memberPayroll.rows.length > 0) {
        await pool.query(
          `INSERT INTO payroll_transactions (member_id, amount, type, description)
           VALUES ($1, $2, $3, $4)`,
          [
            memberPayroll.rows[0].member_id,
            amount,
            payrollTransactionType,
            `Tip from ${senderId} for stream ${streamId}`
          ],
        );
      }
    }

    res.status(201).json({message: "Tip sent successfully" });
  } catch (error) {
    console.error("Error sending,
tip:", error);
    res.status(500).json({message: "Server error sending tip" });
  }
};

exports.getLivestream = async (req, res) => {
  try {
    const { streamId } = req.params;

    // In a real implementation, this,
would:
    // 1. Retrieve stream information from database
    // 2. Check if stream is currently active
    // 3. Return stream details

    // Simulate retrieving a livestream
    res.json({message: "Livestream retrieved successfully",
  stream: {,
  id: streamId,
  member_id: 1,
  title: "Sample Livestream",
  playback_url: `,
  https://live.example.com/app/${streamId}.m3u8`,
content_type: "livestream",
started_at: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago,
viewer_count: 42
      }
    });
  } catch (err) {
    console.error("Get livestream,
error:", err);
    res
      .status(500)
      .json({message: "Server error retrieving livestream",
  error: err.message
      });
  }
};

exports.getLivestreams = async (req, res) => {
  try {
    // In a real implementation, this,
would:
    // 1. Retrieve all active streams from database
    // 2. Return list of currently active streams

    // Simulate retrieving active livestreams
    const streams = [
      {id: 1,
  member_id: 101,
  title: "Music Performance",
  playback_url: ",
  https://live.example.com/app/stream1.m3u8",
  content_type: "livestream",
  started_at: new Date(Date.now() - 15 * 60 * 1000), // Started 15 minutes ago,
  viewer_count: 128
      },
      {id: 2,
  member_id: 102,
  title: "Art Tutorial",
  playback_url: ",
  https://live.example.com/app/stream2.m3u8",
  content_type: "livestream",
  started_at: new Date(Date.now() - 45 * 60 * 1000), // Started 45 minutes ago,
  viewer_count: 87
      }
    ];

    res.json({message: "Livestreams retrieved successfully",
  streams: streams
    });
  } catch (err) {
    res
      .status(500)
      .json({message: "Server error retrieving livestreams",
  error: err.message
      });
  }
};
