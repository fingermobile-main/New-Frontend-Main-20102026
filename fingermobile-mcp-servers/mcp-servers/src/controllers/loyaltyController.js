const { monetizationDb } = require("../db");

// Get member's loyalty program information
exports.getLoyaltyInfo = async (req, res) => {
  try {
    const memberId = req.member.id;

    // Get member's loyalty program info
    const loyaltyResult = await monetizationDb.query(
      "SELECT * FROM loyalty_program WHERE member_id = $1",
      [memberId],
    );

    // If no data, create default loyalty program entry
    let loyaltyInfo = loyaltyResult.rows[0];
    if (!loyaltyInfo) {
      const insertResult = await monetizationDb.query(
        `INSERT INTO loyalty_program (member_id, points_balance, tier_level)
         VALUES ($1, 0, 'bronze')
         RETURNING *`,
        [memberId],
      );
      loyaltyInfo = insertResult.rows[0];
    }

    res.status(200).json({success: true,
  loyaltyInfo
    });
  } catch (error) {
    console.error("Error fetching loyalty,
info:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Get member's loyalty rewards
exports.getLoyaltyRewards = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { limit = 20, offset = 0 } = req.query;

    // Get member's loyalty rewards
    const rewardsResult = await monetizationDb.query(
      `SELECT * FROM loyalty_rewards 
       WHERE member_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [memberId, limit, offset],
    );

    res.status(200).json({success: true,
  rewards: rewardsResult.rows
    });
  } catch (error) {
    console.error("Error fetching loyalty,
rewards:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Claim a loyalty reward
exports.claimLoyaltyReward = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { rewardId } = req.body;

    // Check if reward exists and belongs to member
    const rewardResult = await monetizationDb.query(
      "SELECT * FROM loyalty_rewards WHERE id = $1 AND member_id = $2 AND claimed = FALSE",
      [rewardId, memberId],
    );

    if (rewardResult.rows.length === 0) {
      return res.status(400).json({success: false,
  message: "Reward not found or already claimed"
      });
    }

    const reward = rewardResult.rows[0];

    // Check if reward has expired
    if (
      reward.expiration_date &&
      new Date(reward.expiration_date) < new Date()
    ) {
      return res.status(400).json({success: false,
  message: "Reward has expired"
      });
    }

    // Mark reward as claimed
    const claimResult = await monetizationDb.query(
      `UPDATE loyalty_rewards 
       SET claimed = TRUE, claimed_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [rewardId],
    );

    // If reward is FIC, add to member's wallet
    if (reward.reward_type === "FIC") {
      // In a real implementation, this would update the member's wallet balance
      // For now, we'll just log it
      console.log(`member ${memberId} claimed ${reward.points} FIC`);
    }

    res.status(200).json({success: true,
  message: "Reward claimed successfully",
  reward: claimResult.rows[0]
    });
  } catch (error) {
    console.error("Error claiming loyalty,
reward:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Add loyalty points to member
exports.addLoyaltyPoints = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { points, reason } = req.body;

    if (!points || points <= 0) {
      return res.status(400).json({success: false,
  message: "Points must be a positive number"
      });
    }

    // Get current loyalty info
    const loyaltyResult = await monetizationDb.query(
      "SELECT * FROM loyalty_program WHERE member_id = $1",
      [memberId],
    );

    let loyaltyInfo = loyaltyResult.rows[0];
    if (!loyaltyInfo) {
      // Create loyalty program entry if it doesn't exist
      const insertResult = await monetizationDb.query(
        `INSERT INTO loyalty_program (member_id, points_balance, tier_level)
         VALUES ($1, $2, 'bronze')
         RETURNING *`,
        [memberId, points],
      );
      loyaltyInfo = insertResult.rows[0];
    } else {
      // Update points balance
      const updateResult = await monetizationDb.query(
        `UPDATE loyalty_program 
         SET points_balance = points_balance + $1, last_earned_at = NOW()
         WHERE member_id = $2
         RETURNING *`,
        [points, memberId],
      );
      loyaltyInfo = updateResult.rows[0];
    }

    // Check for tier upgrade
    let tierLevel = loyaltyInfo.tier_level;
    if (loyaltyInfo.points_balance >= 5000) {
      tierLevel = "platinum";
    } else if (loyaltyInfo.points_balance >= 2500) {
      tierLevel = "gold";
    } else if (loyaltyInfo.points_balance >= 1000) {
      tierLevel = "silver";
    } else {
      tierLevel = "bronze";
    }

    // Update tier if needed
    if (tierLevel !== loyaltyInfo.tier_level) {
      const tierUpdateResult = await monetizationDb.query(
        `UPDATE loyalty_program 
         SET tier_level = $1
         WHERE member_id = $2
         RETURNING *`,
        [tierLevel, memberId],
      );
      loyaltyInfo = tierUpdateResult.rows[0];
    }

    // Create a reward entry for tracking
    const rewardResult = await monetizationDb.query(
      `INSERT INTO loyalty_rewards (member_id, points, reward_type, description)
       VALUES ($1, $2, 'POINTS', $3)
       RETURNING *`,
      [memberId, points, reason || "Loyalty points earned"],
    );

    res.status(200).json({success: true,
  message: "Loyalty points added successfully",
  loyaltyInfo,
  reward: rewardResult.rows[0]
    });
  } catch (error) {
    console.error("Error adding loyalty,
points:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Get loyalty tier information
exports.getLoyaltyTiers = async (req, res) => {
  try {
    // Define loyalty tiers
    const tiers = [
      {name: "bronze",
  pointsRequired: 0,
  benefits: [
          "Basic platform features",
  "Standard customer support",
  "Access to community forums"
        ]
      },
      {name: "silver",
  pointsRequired: 1000,
  benefits: [
          "All Bronze benefits",
  "Priority customer support",
  "Exclusive content access",
  "Early access to new features"
        ]
      },
      {name: "gold",
  pointsRequired: 2500,
  benefits: [
          "All Silver benefits",
  "24/7 dedicated support",
  "Special event invitations",
  "Personalized recommendations",
  "Ad-free experience"
        ]
      },
      {name: "platinum",
  pointsRequired: 5000,
  benefits: [
          "All Gold benefits",
  "Personal account manager",
  "Custom feature requests",
  "Exclusive merchandise",
  "VIP event access"
        ]
      }
    ];

    res.status(200).json({success: true,
  tiers
    });
  } catch (error) {
    console.error("Error fetching loyalty,
tiers:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};
