const { monetizationDb, identityDb } = require("../db");
const { logSecurityEvent } = require("../utils/securityLogger");
const FICService = require("./fic_service");
const WalletService = require("./wallet_service");

class ChallengeStakesService {
  // Create a new stake for a viral challenge
  static async createStake(memberId, challengeId, ficAmount) {
    const client = await monetizationDb.connect();
    try {
      await client.query("BEGIN");

      // Verify the challenge exists and is a viral challenge
      const challengeResult = await client.query(
        `SELECT challenge_type, status, start_time, end_time
         FROM challenges WHERE id = $1`,
        [challengeId],
      );

      if (challengeResult.rows.length === 0) {
        throw new Error("Challenge not found");
      }

      const challenge = challengeResult.rows[0];

      if (challenge.challenge_type !== "viral") {
        throw new Error("Staking is only allowed for viral challenges");
      }

      if (challenge.status !== "active") {
        throw new Error("Challenge is not active for staking");
      }

      // Check if member has already staked on this challenge
      const existingStakeResult = await client.query(
        `SELECT id FROM challenge_stakes 
         WHERE challenge_id = $1 AND member_id = $2 AND stake_status = 'active'`,
        [challengeId, memberId],
      );

      if (existingStakeResult.rows.length > 0) {
        throw new Error("Member has already staked on this challenge");
      }

      // Get member's FIC wallet
      const walletInfo = await WalletService.getWalletInfo(memberId);

      // Check if member has enough FIC balance
      if (walletInfo.fic_wallet.balance < ficAmount) {
        throw new Error(
          `Insufficient FIC balance. Required: ${ficAmount} Available: ${walletInfo.fic_wallet.balance}`,
        );
      }

      // Deduct from member's FIC wallet
      const transactionResult = await FICService.processTransaction(
        memberId,
        ficAmount,
        "challenge_stake",
        `Stake for viral challenge ${challengeId}`,
        "FIC_WALLET",
        "PERMANENCE_CHALLENGE",
      );

      // Create the stake record
      const stakeResult = await client.query(
        `INSERT INTO challenge_stakes (
          challenge_id, member_id, gift_amount, stake_status, created_at
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [challengeId, memberId, ficAmount, "active", new Date()],
      );

      // Update challenge engagement metrics
      await client.query(
        `INSERT INTO challenge_engagement (
          challenge_id, member_id, engagement_type, engagement_value
        ) VALUES ($1, $2, $3, $4)
        ON CONFLICT (challenge_id, member_id, engagement_type) 
        DO UPDATE SET engagement_value = challenge_engagement.engagement_value + $4`,
        [challengeId, memberId, "stake", 1],
      );

      // Log security event
      await logSecurityEvent(memberId, "VIRAL_CHALLENGE_STAKE_CREATED", {
        challengeId,
        memberId,
        ficAmount,
        stakeId: stakeResult.rows[0].id,
        transactionId: transactionResult.transaction.id
      });

      await client.query("COMMIT");

      return {
        success: true,
        stake: stakeResult.rows[0],
        transaction: transactionResult.transaction,
        message: `Successfully staked ${ficAmount} FIC on challenge ${challengeId}`
      };
    } catch (error) {
      await client.query("ROLLBACK");
      logger.error("Error creating challenge stake:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Get all stakes for a challenge
  static async getChallengeStakes(challengeId) {
    try {
      const stakesResult = await monetizationDb.query(
        `SELECT cs.*, m.membername, m.profile_picture_url
         FROM challenge_stakes cs
         JOIN members m ON cs.member_id = m.id
         WHERE cs.challenge_id = $1
         ORDER BY cs.created_at DESC`,
        [challengeId],
      );

      return stakesResult.rows;
    } catch (error) {
      logger.error("Error getting challenge stakes:", error);
      throw error;
    }
  }

  // Get member's stakes
  static async getmemberstakes(memberId) {
    try {
      const stakesResult = await monetizationDb.query(
        `SELECT cs.*, c.title as challenge_title, c.description as challenge_description
         FROM challenge_stakes cs
         JOIN challenges c ON cs.challenge_id = c.id
         WHERE cs.member_id = $1
         ORDER BY cs.created_at DESC`,
        [memberId],
      );

      return stakesResult.rows;
    } catch (error) {
      logger.error("Error getting member stakes:", error);
      throw error;
    }
  }

  // Calculate total stake pool for a challenge
  static async getChallengeStakePool(challengeId) {
    try {
      const result = await monetizationDb.query(
        `SELECT SUM(gift_amount) as total_pool, COUNT(*) as total_stakers
         FROM challenge_stakes
         WHERE challenge_id = $1 AND stake_status = 'active'`,
        [challengeId],
      );

      const totalPool = parseFloat(result.rows[0].total_pool) || 0;
      const totalStakers = parseInt(result.rows[0].total_stakers);

      return {
        totalPool,
        totalStakers,
        perStakerReward: totalStakers > 0 ? totalPool / totalStakers : 0
      };
    } catch (error) {
      logger.error("Error calculating challenge stake pool:", error);
      throw error;
    }
  }

  // Determine winner and distribute rewards for a viral challenge
  static async completeViralChallenge(challengeId, winnerId, adminId) {
    const client = await monetizationDb.connect();
    try {
      await client.query("BEGIN");

      // Get all active stakes for this challenge
      const stakesResult = await client.query(
        `SELECT * FROM challenge_stakes 
         WHERE challenge_id = $1 AND stake_status = 'active'`,
        [challengeId],
      );

      if (stakesResult.rows.length === 0) {
        throw new Error("No active stakes found for this challenge");
      }

      // Calculate total pool
      const totalPool = stakesResult.rows.reduce(
        (sum, stake) => sum + parseFloat(stake.gift_amount),
        0,
      );

      // Update stake status for all participants
      for (const stake of stakesResult.rows) {
        const isWinner = stake.member_id === winnerId;

        await client.query(
          `UPDATE challenge_stakes 
           SET stake_status = $1, is_winner = $2, resolved_at = $3
           WHERE id = $4`,
          [isWinner ? "won" : "lost", isWinner, new Date(), stake.id],
        );

        if (isWinner) {
          // Add winnings to winner's FIC wallet
          await FICService.processTransaction(
            winnerId,
            totalPool,
            "challenge_reward",
            `Reward for winning viral challenge ${challengeId}`,
            "PERMANENCE_CHALLENGE",
            "FIC_WALLET",
          );
        }
      }

      // Record the cycle results
      const cycleResult = await client.query(
        `INSERT INTO viral_challenge_cycles (
          challenge_id, cycle_start_date, cycle_end_date, 
          final_engagement_metrics, winner_id, prize_distribution
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          challengeId,
          stakesResult.rows[0].created_at, // Use the first stake's creation date as cycle start
          new Date(), // Current date as cycle end
          await this.calculateEngagementMetrics(challengeId), // Calculate engagement metrics
          winnerId,
          JSON.stringify({
            total_pool: totalPool,
            winner_reward: totalPool,
            total_stakers: stakesResult.rows.length
          })
        ],
      );

      // Update challenge status to completed
      await client.query(
        `UPDATE challenges SET status = 'completed' WHERE id = $1`,
        [challengeId],
      );

      // Log security event
      await logSecurityEvent(adminId, "VIRAL_CHALLENGE_COMPLETED", {
        challengeId,
        winnerId,
        totalPool,
        totalStakers: stakesResult.rows.length,
        adminId,
        cycleId: cycleResult.rows[0].id
      });

      await client.query("COMMIT");

      return {
        success: true,
        cycle: cycleResult.rows[0],
        totalPool,
        totalStakers: stakesResult.rows.length,
        message: `Successfully completed challenge ${challengeId} with winner ${winnerId}`
      };
    } catch (error) {
      await client.query("ROLLBACK");
      logger.error("Error completing viral challenge:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Calculate engagement metrics for a challenge
  static async calculateEngagementMetrics(challengeId) {
    try {
      // Get various engagement metrics for the challenge
      const viewsResult = await monetizationDb.query(
        `SELECT COUNT(*) as count FROM challenge_engagement 
         WHERE challenge_id = $1 AND engagement_type = 'view'`,
        [challengeId],
      );

      const sharesResult = await monetizationDb.query(
        `SELECT COUNT(*) as count FROM challenge_engagement 
         WHERE challenge_id = $1 AND engagement_type = 'share'`,
        [challengeId],
      );

      const likesResult = await monetizationDb.query(
        `SELECT COUNT(*) as count FROM challenge_engagement 
         WHERE challenge_id = $1 AND engagement_type = 'like'`,
        [challengeId],
      );

      const commentsResult = await monetizationDb.query(
        `SELECT COUNT(*) as count FROM challenge_engagement 
         WHERE challenge_id = $1 AND engagement_type = 'comment'`,
        [challengeId],
      );

      const participantsResult = await monetizationDb.query(
        `SELECT COUNT(*) as count FROM challenge_participants 
         WHERE challenge_id = $1`,
        [challengeId],
      );

      return {
        views: parseInt(viewsResult.rows[0].count),
        shares: parseInt(sharesResult.rows[0].count),
        likes: parseInt(likesResult.rows[0].count),
        comments: parseInt(commentsResult.rows[0].count),
        participants: parseInt(participantsResult.rows[0].count),
        total_engagement:
          parseInt(viewsResult.rows[0].count) +
          parseInt(sharesResult.rows[0].count) +
          parseInt(likesResult.rows[0].count) +
          parseInt(commentsResult.rows[0].count) +
          parseInt(participantsResult.rows[0].count)
      };
    } catch (error) {
      logger.error("Error calculating engagement metrics:", error);
      throw error;
    }
  }

  // Refund stakes (for cancelled challenges)
  static async refundChallengeStakes(challengeId, adminId) {
    const client = await monetizationDb.connect();
    try {
      await client.query("BEGIN");

      // Get all active stakes for this challenge
      const stakesResult = await client.query(
        `SELECT * FROM challenge_stakes 
         WHERE challenge_id = $1 AND stake_status = 'active'`,
        [challengeId],
      );

      if (stakesResult.rows.length === 0) {
        throw new Error("No active stakes found for this challenge");
      }

      // Refund each stake to the member's FIC wallet
      for (const stake of stakesResult.rows) {
        // Add refunded amount back to member's FIC wallet
        await FICService.processTransaction(
          stake.member_id,
          parseFloat(stake.gift_amount),
          "stake_refund",
          `Refund for cancelled challenge ${challengeId}`,
          "PERMANENCE_CHALLENGE",
          "FIC_WALLET",
        );

        // Update stake status to refunded
        await client.query(
          `UPDATE challenge_stakes 
           SET stake_status = 'refunded', resolved_at = $1
           WHERE id = $2`,
          [new Date(), stake.id],
        );
      }

      // Update challenge status to cancelled
      await client.query(
        `UPDATE challenges SET status = 'cancelled' WHERE id = $1`,
        [challengeId],
      );

      // Log security event
      await logSecurityEvent(adminId, "CHALLENGE_STAKES_REFUNDED", {
        challengeId,
        totalRefunded: stakesResult.rows.reduce(
          (sum, stake) => sum + parseFloat(stake.gift_amount),
          0,
        ),
        totalStakes: stakesResult.rows.length,
        adminId
      });

      await client.query("COMMIT");

      return {
        success: true,
        totalRefunded: stakesResult.rows.reduce(
          (sum, stake) => sum + parseFloat(stake.gift_amount),
          0,
        ),
        totalStakes: stakesResult.rows.length,
        message: `Successfully refunded stakes for challenge ${challengeId}`
      };
    } catch (error) {
      await client.query("ROLLBACK");
      logger.error("Error refunding challenge stakes:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = ChallengeStakesService;
