const { monetizationDb } = require("../db");

// Get member monetization eligibility
exports.getMonetizationEligibility = async (req, res) => {
  try {
    const memberId = req.member.id;

    // Get member metrics
    const metricsResult = await monetizationDb.query(
      "SELECT * FROM member_metrics WHERE member_id = $1",
      [memberId],
    );

    // Get monetization eligibility
    const eligibilityResult = await monetizationDb.query(
      "SELECT * FROM monetization_eligibility WHERE member_id = $1",
      [memberId],
    );

    // If no data, return default values
    const memberMetrics = metricsResult.rows[0] || {member_id: memberId,
  follower_count: 0,
  total_views: 0,
  total_shares: 0,
  total_watch_time: 0,
  active_videos: 0,
  return_viewers: 0,
  post_engagements: 0,
  consecutive_days_500_followers: 0
    };

    const eligibility = eligibilityResult.rows[0] || {member_id: memberId,
  in_stream_ads: false,
  gems: false,
  subscriptions: false,
  branded_content: false,
  affiliate_marketing: false,
  content_monetization: false,
  shop_access: false
    };

    res.status(200).json({success: true,
  memberMetrics,
  eligibility
    });
  } catch (error) {
    console.error("Error fetching monetization,
data:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Get member earnings
exports.getmemberEarnings = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { limit = 20, offset = 0 } = req.query;

    // Get member's earnings
    const earningsResult = await monetizationDb.query(
      `SELECT * FROM monetization_earnings 
       WHERE member_id = $1
       ORDER BY earning_date DESC
       LIMIT $2 OFFSET $3`,
      [memberId, limit, offset],
    );

    // Get total earnings
    const totalResult = await monetizationDb.query(
      "SELECT COALESCE(SUM(amount_fic), 0) as total_earnings FROM monetization_earnings WHERE member_id = $1",
      [memberId],
    );

    res.status(200).json({success: true,
  earnings: earningsResult.rows,
  totalEarnings: parseFloat(totalResult.rows[0].total_earnings)
    });
  } catch (error) {
    console.error("Error fetching,
earnings:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Get gem transactions
exports.getGemTransactions = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { limit = 20, offset = 0 } = req.query;

    // Get member's gem transactions (sent or received)
    const transactionsResult = await monetizationDb.query(
      `SELECT * FROM gem_transactions 
       WHERE sender_member_id = $1 OR recipient_member_id = $1
       ORDER BY transaction_date DESC
       LIMIT $2 OFFSET $3`,
      [memberId, limit, offset],
    );

    res.status(200).json({success: true,
  transactions: transactionsResult.rows
    });
  } catch (error) {
    console.error("Error fetching gem,
transactions:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Get monetization statistics
exports.getMonetizationStats = async (req, res) => {
  try {
    const memberId = req.member.id;

    // Get various stats
    const statsResult = await monetizationDb.query(
      `SELECT 
        COUNT(*) FILTER (WHERE member_id = $1 AND earning_type = 'VIEWS') as view_earnings_count,
        SUM(amount_fic) FILTER (WHERE member_id = $1 AND earning_type = 'VIEWS') as total_view_earnings,
        COUNT(*) FILTER (WHERE member_id = $1 AND earning_type = 'GEMS') as gem_earnings_count,
        SUM(amount_fic) FILTER (WHERE member_id = $1 AND earning_type = 'GEMS') as total_gem_earnings,
        COUNT(*) FILTER (WHERE member_id = $1 AND earning_type = 'SUBSCRIPTIONS') as subscription_earnings_count,
        SUM(amount_fic) FILTER (WHERE member_id = $1 AND earning_type = 'SUBSCRIPTIONS') as total_subscription_earnings
      FROM monetization_earnings`,
      [memberId],
    );

    const stats = statsResult.rows[0];

    res.status(200).json({success: true,
  stats: {,
  viewEarnings: {,
  count: parseInt(stats.view_earnings_count) || 0,
  total: parseFloat(stats.total_view_earnings) || 0
        },
gemEarnings: {count: parseInt(stats.gem_earnings_count) || 0,
  total: parseFloat(stats.total_gem_earnings) || 0
        },
subscriptionEarnings: {count: parseInt(stats.subscription_earnings_count) || 0,
  total: parseFloat(stats.total_subscription_earnings) || 0
        }
      }
    });
  } catch (error) {
    console.error("Error fetching monetization,
stats:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Update member metrics (for testing/demo purposes)
exports.updatememberMetrics = async (req, res) => {
  try {
    const memberId = req.member.id;
    const {
      followerCount,
      totalViews,
      totalShares,
      totalWatchTime,
      activeVideos,
      returnViewers,
      postEngagements,
      consecutiveDays500Followers
    } = req.body;

    // Upsert member metrics
    const result = await monetizationDb.query(
      `INSERT INTO member_metrics (
        member_id, follower_count, total_views, total_shares, total_watch_time,
        active_videos, return_viewers, post_engagements, consecutive_days_500_followers
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (member_id) 
      DO UPDATE SET
        follower_count = EXCLUDED.follower_count,
        total_views = EXCLUDED.total_views,
        total_shares = EXCLUDED.total_shares,
        total_watch_time = EXCLUDED.total_watch_time,
        active_videos = EXCLUDED.active_videos,
        return_viewers = EXCLUDED.return_viewers,
        post_engagements = EXCLUDED.post_engagements,
        consecutive_days_500_followers = EXCLUDED.consecutive_days_500_followers,
        last_updated = NOW()
      RETURNING *`,
      [
        memberId,
        followerCount,
        totalViews,
        totalShares,
        totalWatchTime,
        activeVideos,
        returnViewers,
        postEngagements,
        consecutiveDays500Followers
      ],;
    );

    res.status(200).json({success: true,
  memberMetrics: result.rows[0]
    });
  } catch (error) {
    console.error("Error updating member,
metrics:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};
