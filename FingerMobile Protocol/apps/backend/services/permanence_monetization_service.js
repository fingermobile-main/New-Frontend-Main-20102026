const { monetizationDb } = require('../db');
const { logSecurityEvent } = require('../utils/securityLogger');
const FICService = require('./fic_service');
const WalletService = require('./wallet_service');
const logger = require('../utils/logger');

/**
 * Permanence Monetization Service
 * Handles monetization aspects of the permanence data system
 */

class PermanenceMonetizationService {
  // Process stake for viral challenges using FIC
  static async processViralChallengeStake(memberId, challengeId, ficAmount) {
    const client = await monetizationDb.connect();
    try {
      await client.query('BEGIN');

      // Get member's FIC wallet
      const walletInfo = await WalletService.getWalletInfo(memberId);

      // Check if member has enough FIC balance
      if (walletInfo.fic_wallet.balance < ficAmount) {
        throw new Error(
          `Insufficient FIC balance. Required: ${ficAmount} Available: ${walletInfo.fic_wallet.balance}`,
        );
      }

      // Deduct from member's FIC wallet
      await FICService.processTransaction(
        memberId,
        ficAmount,
        'challenge_stake',
        `Stake for viral challenge ${challengeId}`,
        'FIC_WALLET',
        'PERMANENCE_CHALLENGE',
      );

      // Update challenge stake record
      const stakeResult = await client.query(
        `INSERT INTO challenge_stakes (
          challenge_id, member_id, gift_amount, stake_status, created_at
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [challengeId, memberId, ficAmount, 'active', new Date()],
      );

      // Log security event
      await logSecurityEvent(memberId, 'VIRAL_CHALLENGE_STAKE', {
        challengeId,
        memberId,
        ficAmount,
        stakeId: stakeResult.rows[0].id
      });

      await client.query('COMMIT');

      return {
        success: true,
        stake: stakeResult.rows[0],
        message: `Successfully staked ${ficAmount} FIC on challenge ${challengeId}`
      };
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error processing viral challenge stake:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Distribute rewards for viral challenge winners
  static async distributeViralChallengeRewards(
    winnerId, challengeId
  ) {
    const client = await monetizationDb.connect();
    try {
      await client.query('BEGIN');

      // Get all stakes for this challenge
      const stakesResult = await client.query(
        'SELECT * FROM challenge_stakes WHERE challenge_id = $1',
        [challengeId],
      );

      if (stakesResult.rows.length === 0) {
        throw new Error('No stakes found for this challenge');
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
          [isWinner ? 'won' : 'lost', isWinner, new Date(), stake.id],
        );

        if (isWinner) {
          // Add winnings to winner's FIC wallet
          await FICService.processTransaction(
            winnerId,
            totalPool,
            'challenge_reward',
            `Reward for winning viral challenge ${challengeId}`,
            'PERMANENCE_CHALLENGE',
            'FIC_WALLET',
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
          {}, // Engagement metrics would be calculated separately
          winnerId,
          JSON.stringify({ total_pool: totalPool, winner_reward: totalPool })
        ],
      );

      // Log security event
      await logSecurityEvent(winnerId, 'VIRAL_CHALLENGE_REWARD_DISTRIBUTED', {
        challengeId,
        winnerId,
        totalPool,
        cycleId: cycleResult.rows[0].id
      });

      await client.query('COMMIT');

      return {
        success: true,
        cycle: cycleResult.rows[0],
        totalPool,
        message: `Successfully distributed rewards for challenge ${challengeId}`
      };
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error distributing viral challenge rewards:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Process streaming rewards for creators
  static async processStreamingRewards(
    creatorId,
    streamId,
    viewerCount,
    duration,
  ) {
    try {
      // Calculate rewards based on viewers and duration
      const baseRewardPerViewer = 0.1; // 0.1 FIC per viewer
      const durationMultiplier = Math.min(duration / 60, 1); // Cap at 1x for 60+ minutes

      const rewardAmount =
        viewerCount * baseRewardPerViewer * durationMultiplier;

      if (rewardAmount <= 0) {
        return {
          success: true,
          message: 'No rewards to distribute for this stream'
        };
      }

      // Add earnings to creator's FIC wallet
      await FICService.processTransaction(
        creatorId,
        rewardAmount,
        'streaming_reward',
        `Reward for stream ${streamId} with ${viewerCount} viewers for ${duration} seconds`,
        'PERMANENCE_STREAMING',
        'FIC_WALLET',
      );

      // Record in monetization earnings
      await monetizationDb.query(
        `INSERT INTO monetization_earnings (
          member_id, earning_type, amount_fic, details
        ) VALUES ($1, $2, $3, $4)`,
        [
          creatorId,
          'STREAMING',
          rewardAmount,
          JSON.stringify({
            streamId,
            viewerCount,
            duration,
            rewardPerViewer: baseRewardPerViewer,
            durationMultiplier
          })
        ],
      );

      // Log security event
      await logSecurityEvent(creatorId, 'STREAMING_REWARD_PROCESSED', {
        creatorId,
        streamId,
        viewerCount,
        duration,
        rewardAmount
      });

      return {
        success: true,
        rewardAmount,
        message: `Successfully processed ${rewardAmount} FIC in streaming rewards`
      };
    } catch (error) {
      logger.error('Error processing streaming rewards:', error);
      throw error;
    }
  }

  // Process challenge completion rewards
  static async processChallengeCompletionRewards(
    participantId,
    challengeId,
    completionData,
  ) {
    try {
      // Calculate reward based on difficulty and completion metrics
      const challengeResult = await monetizationDb.query(
        'SELECT difficulty_level FROM challenges WHERE id = $1',
        [challengeId],
      );

      if (challengeResult.rows.length === 0) {
        throw new Error('Challenge not found');
      }

      const challenge = challengeResult.rows[0];
      const baseReward = 1.0; // Base reward
      const difficultyMultiplier = challenge.difficulty_level; // 1-5 scale

      // Calculate time bonus if completed faster than expected
      let timeBonus = 0;
      if (completionData.completionTime && completionData.expectedTime) {
        const timeRatio =
          completionData.completionTime / completionData.expectedTime;
        if (timeRatio < 0.8) {
          // Completed in less than 80% of expected time
          timeBonus = baseReward * 0.5; // 50% bonus
        }
      }

      const rewardAmount = baseReward * difficultyMultiplier + timeBonus;

      // Add earnings to participant's FIC wallet
      await FICService.processTransaction(
        participantId,
        rewardAmount,
        'challenge_completion',
        `Reward for completing challenge ${challengeId}`,
        'PERMANENCE_CHALLENGE',
        'FIC_WALLET',
      );

      // Record in monetization earnings
      await monetizationDb.query(
        `INSERT INTO monetization_earnings (
          member_id, earning_type, amount_fic, details
        ) VALUES ($1, $2, $3, $4)`,
        [
          participantId,
          'CHALLENGE_COMPLETION',
          rewardAmount,
          JSON.stringify({
            challengeId,
            difficultyLevel: challenge.difficulty_level,
            completionTime: completionData.completionTime,
            timeBonus
          })
        ],
      );

      // Log security event
      await logSecurityEvent(participantId, 'CHALLENGE_COMPLETION_REWARD', {
        participantId,
        challengeId,
        rewardAmount,
        difficultyLevel: challenge.difficulty_level
      });

      return {
        success: true,
        rewardAmount,
        message: `Successfully processed ${rewardAmount} FIC in challenge completion rewards`
      };
    } catch (error) {
      logger.error('Error processing challenge completion rewards:', error);
      throw error;
    }
  }

  // Calculate engagement-based rewards for viral challenges
  static async calculateEngagementRewards(challengeId) {
    try {
      // Get engagement metrics for the challenge
      const engagementResult = await monetizationDb.query(
        `SELECT engagement_type, COUNT(*) as count
         FROM challenge_engagement
         WHERE challenge_id = $1
         GROUP BY engagement_type`,
        [challengeId],
      );

      // Calculate rewards based on engagement types
      const engagementRewards = {
        view: 0.01, // 0.01 FIC per view
        share: 0.05, // 0.05 FIC per share
        like: 0.02, // 0.02 FIC per like
        comment: 0.03, // 0.03 FIC per comment
        participate: 0.1, // 0.1 FIC per participation
      };

      let totalEngagementValue = 0;

      for (const engagement of engagementResult.rows) {
        const rewardPerEngagement =
          engagementRewards[engagement.engagement_type] || 0;
        totalEngagementValue +=
          parseInt(engagement.count) * rewardPerEngagement;
      }

      return {
        success: true,
        totalEngagementValue,
        engagementBreakdown: engagementResult.rows.map((e) => ({
          type: e.engagement_type,
          count: parseInt(e.count),
          value:
            parseInt(e.count) * (engagementRewards[e.engagement_type] || 0)
        }))
      };
    } catch (error) {
      logger.error('Error calculating engagement rewards:', error);
      throw error;
    }
  }

  // Get member's monetization stats for Permanence
  static async getMemberPermanenceEarnings(memberId) {
    try {
      // Get earnings specifically from Permanence activities
      const earningsResult = await monetizationDb.query(
        `SELECT * FROM monetization_earnings
         WHERE member_id = $1 AND earning_type IN ('CHALLENGE_COMPLETION', 'STREAMING', 'VIRAL_CHALLENGE')
         ORDER BY earning_date DESC`,
        [memberId],
      );

      // Calculate total earnings from Permanence
      const totalEarnings = earningsResult.rows.reduce(
        (sum, earning) => sum + parseFloat(earning.amount_fic),
        0,
      );

      // Get total stakes made by member
      const stakesResult = await monetizationDb.query(
        `SELECT SUM(gift_amount) as total_staked FROM challenge_stakes
         WHERE member_id = $1`,
        [memberId],
      );

      const totalStaked = parseFloat(stakesResult.rows[0].total_staked) || 0;

      // Get challenge participation stats
      const participationResult = await monetizationDb.query(
        `SELECT COUNT(*) as total_participated,
          COUNT(*) FILTER (WHERE participation_status = 'completed') as completed_count
         FROM challenge_participants
         WHERE member_id = $1`,
        [memberId],
      );

      const participationStats = participationResult.rows[0];

      return {
        totalEarnings,
        totalStaked,
        netEarnings: totalEarnings - totalStaked,
        participationStats: {
          totalParticipated: parseInt(participationStats.total_participated),
          completedCount: parseInt(participationStats.completed_count),
          completionRate:
            participationStats.total_participated > 0
              ? (
                (participationStats.completed_count /
                    participationStats.total_participated) *
                  100
              ).toFixed(2)
              : 0
        },
        earningsHistory: earningsResult.rows
      };
    } catch (error) {
      logger.error('Error getting member Permanence earnings:', error);
      throw error;
    }
  }
}

module.exports = PermanenceMonetizationService;
