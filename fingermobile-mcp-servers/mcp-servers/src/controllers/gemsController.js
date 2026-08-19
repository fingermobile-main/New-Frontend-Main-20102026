const { monetizationDb } = require("../db");

// Get member's gem balance
exports.getGemBalance = async (req, res) => {
  try {
    const memberId = req.member.id;

    // Get member's gem transactions to calculate balance
    const transactionsResult = await monetizationDb.query(
      `SELECT 
         gem_type,
         SUM(CASE WHEN recipient_member_id = $1 THEN quantity ELSE 0 END) as received,
         SUM(CASE WHEN sender_member_id = $1 THEN quantity ELSE 0 END) as sent
       FROM gem_transactions 
       WHERE sender_member_id = $1 OR recipient_member_id = $1
       GROUP BY gem_type`,
      [memberId],
    );

    // Calculate balances for each gem type
    const balances = transactionsResult.rows.map((row) => ({gemType: row.gem_type,
  received: parseInt(row.received) || 0,
  sent: parseInt(row.sent) || 0,
  balance: (parseInt(row.received) || 0) - (parseInt(row.sent) || 0)
    }));

    res.status(200).json({success: true,
  balances
    });
  } catch (error) {
    console.error("Error fetching gem,
balance:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Get gem transactions history
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

// Send gems to another member
exports.sendGems = async (req, res) => {
  try {
    const sendermemberId = req.member.id;
    const { recipientmemberId, gemType, quantity, postId } = req.body;

    // Validate inputs
    if (!recipientmemberId || !gemType || !quantity || quantity <= 0) {
      return res.status(400).json({success: false,
  message:
          "Recipient member ID,
  gem type,
  and positive quantity are required"
      });
    }

    // Check if gem type is valid
    const validGemTypes = ["MARBLE", "EMERALD", "SAPPHIRE", "RUBY", "DIAMOND"];
    if (!validGemTypes.includes(gemType.toUpperCase())) {
      return res.status(400).json({success: false,
  message:
          "Invalid gem type. Valid types,
  are: MARBLE,
  EMERALD,
  SAPPHIRE,
  RUBY,
  DIAMOND"
      });
    }

    // Check sender's balance
    const balanceResult = await monetizationDb.query(
      `SELECT 
         SUM(CASE WHEN recipient_member_id = $1 THEN quantity ELSE 0 END) -
         SUM(CASE WHEN sender_member_id = $1 THEN quantity ELSE 0 END) as balance
       FROM gem_transactions 
       WHERE (sender_member_id = $1 OR recipient_member_id = $1) AND gem_type = $2`,
      [sendermemberId, gemType.toUpperCase()],
    );

    const balance = parseInt(balanceResult.rows[0]?.balance) || 0;

    if (balance < quantity) {
      return res.status(400).json({success: false,
  message: "Insufficient gem balance"
      });
    }

    // Create transaction record
    const transactionResult = await monetizationDb.query(
      `INSERT INTO gem_transactions 
         (sender_member_id, recipient_member_id, gem_type, quantity, amount_fic, transaction_date, post_id)
       VALUES ($1, $2, $3, $4, $5, NOW(), $6)
       RETURNING *`,
      [
        sendermemberId,
        recipientmemberId,
        gemType.toUpperCase(),
        quantity,
        0,
        postId || null
      ],
    );

    res.status(201).json({success: true,
  message: "Gems sent successfully",
  transaction: transactionResult.rows[0]
    });
  } catch (error) {
    console.error("Error sending,
gems:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Get gem earnings
exports.getGemEarnings = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { limit = 20, offset = 0 } = req.query;

    // Get member's gem earnings
    const earningsResult = await monetizationDb.query(
      `SELECT * FROM monetization_earnings 
       WHERE member_id = $1 AND earning_type = 'GEMS'
       ORDER BY earning_date DESC
       LIMIT $2 OFFSET $3`,
      [memberId, limit, offset],
    );

    // Get total gem earnings
    const totalResult = await monetizationDb.query(
      `SELECT COALESCE(SUM(amount_fic), 0) as total_earnings 
       FROM monetization_earnings 
       WHERE member_id = $1 AND earning_type = 'GEMS'`,
      [memberId],
    );

    res.status(200).json({success: true,
  earnings: earningsResult.rows,
  totalEarnings: parseFloat(totalResult.rows[0].total_earnings)
    });
  } catch (error) {
    console.error("Error fetching gem,
earnings:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};

// Convert gems to earnings (creator monetization)
exports.convertGemsToEarnings = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { gemType, quantity } = req.body;

    // Validate inputs
    if (!gemType || !quantity || quantity <= 0) {
      return res.status(400).json({success: false,
  message: "Gem type and positive quantity are required"
      });
    }

    // Check if gem type is valid
    const validGemTypes = ["MARBLE", "EMERALD", "SAPPHIRE", "RUBY", "DIAMOND"];
    if (!validGemTypes.includes(gemType.toUpperCase())) {
      return res.status(400).json({success: false,
  message:
          "Invalid gem type. Valid types,
  are: MARBLE,
  EMERALD,
  SAPPHIRE,
  RUBY,
  DIAMOND"
      });
    }

    // Check member's gem balance
    const balanceResult = await monetizationDb.query(
      `SELECT 
         SUM(CASE WHEN recipient_member_id = $1 THEN quantity ELSE 0 END) -
         SUM(CASE WHEN sender_member_id = $1 THEN quantity ELSE 0 END) as balance
       FROM gem_transactions 
       WHERE (sender_member_id = $1 OR recipient_member_id = $1) AND gem_type = $2`,
      [memberId, gemType.toUpperCase()],
    );

    const balance = parseInt(balanceResult.rows[0]?.balance) || 0;

    if (balance < quantity) {
      return res.status(400).json({success: false,
  message: "Insufficient gem balance"
      });
    }

    // Calculate earnings based on gem type
    // Rates from monetizationService.,
ts:
    // 1.,
Marbles: $0.03 for every 5
    // 2.,
Emerald: $0.06 for every 5
    // 3.,
Sapphire: $0.09 for every 5
    // 4.,
Ruby: $0.12 for every 5
    // 5.,
Diamond: $0.15 for every 5
    let earnings = 0;
    switch (gemType.toUpperCase()) {
      case "MARBLE":
        earnings = (quantity / 5) * 0.03;
        break;
      case "EMERALD":
        earnings = (quantity / 5) * 0.06;
        break;
      case "SAPPHIRE":
        earnings = (quantity / 5) * 0.09;
        break;
      case "RUBY":
        earnings = (quantity / 5) * 0.12;
        break;
      case "DIAMOND":
        earnings = (quantity / 5) * 0.15;
        break;
    }

    // Record the conversion as a transaction (sending to platform)
    const transactionResult = await monetizationDb.query(
      `INSERT INTO gem_transactions 
         (sender_member_id, recipient_member_id, gem_type, quantity, amount_fic, transaction_date)
       VALUES ($1, 'PLATFORM', $2, $3, $4, NOW())
       RETURNING *`,
      [memberId, gemType.toUpperCase(), quantity, earnings],
    );

    // Record the earnings
    const earningsResult = await monetizationDb.query(
      `INSERT INTO monetization_earnings 
         (member_id, earning_type, amount_fic, details, earning_date)
       VALUES ($1, 'GEMS', $2, $3, NOW())
       RETURNING *`,
      [
        memberId,
        earnings,
        JSON.stringify({gemType: gemType.toUpperCase(),
  quantity })
      ],
    );

    res.status(201).json({success: true,
  message: "Gems converted to earnings successfully",
  transaction: transactionResult.rows[0],
  earnings: earningsResult.rows[0],
  amountEarned: earnings
    });
  } catch (error) {
    console.error("Error converting gems to,
earnings:", error);
    res.status(500).json({success: false,
  message: "Server error"
    });
  }
};
