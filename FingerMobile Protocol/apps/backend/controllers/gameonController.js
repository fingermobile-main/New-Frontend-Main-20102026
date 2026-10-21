/**
 * GameOn Controller
 * FingerMobile Protocol™ - Competitive Gaming, Tournaments & Sports Platform
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class GameonController {
  constructor() {
    this.getHubData = this.getHubData.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getMatches = this.getMatches.bind(this);
    this.getLeaderboard = this.getLeaderboard.bind(this);
    this.placeWager = this.placeWager.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.getCategories = this.getCategories.bind(this);
  }

  /**
   * GET /api/gameon
   * Combined gaming hub payload (Matches, Events, and Leaderboards)
   */
  async getHubData(req, res) {
    try {
      const matchesRes = await pool.query(
        `SELECT id, sport, home_team, away_team, match_date, odds, status, result, created_at
         FROM gameon_matches
         ORDER BY match_date ASC LIMIT 20`
      );

      const eventsRes = await pool.query(
        `SELECT id, title, description, sport_type, event_type, location, start_time, end_time, 
                max_participants, entry_fee, currency, status, image_url
         FROM gameon_events
         ORDER BY start_time ASC LIMIT 20`
      );

      const leaderboardRes = await pool.query(
        `SELECT gl.id, gl.game_id, gl.score AS points, gl.rank, gl.season,
                u.username AS player_name, u.avatar_url AS avatar,
                COALESCE(u.followers_count, 12) AS wins,
                '88.5%' AS win_rate
         FROM gameon_leaderboards gl
         LEFT JOIN users u ON u.uuid::text = gl.user_id::text
         ORDER BY gl.rank ASC LIMIT 10`
      );

      const formattedMatches = matchesRes.rows.map(m => ({
        id: m.id,
        event_name: `${m.home_team} vs ${m.away_team}`,
        team_a: m.home_team,
        team_b: m.away_team,
        odds_a: m.odds?.home || 1.85,
        odds_b: m.odds?.away || 2.15,
        scheduled_at: new Date(m.match_date).toLocaleString(),
        status: m.status,
        prize_pool_fic: 5000
      }));

      const formattedLeaderboard = leaderboardRes.rows.map((entry, idx) => ({
        rank: entry.rank || idx + 1,
        player_name: entry.player_name || `ProGamer_${idx + 1}`,
        avatar: entry.avatar || `https://images.unsplash.com/photo-${1534528741775 + idx}?w=150`,
        points: entry.points || 5000 - idx * 250,
        wins: entry.wins || 45 - idx * 2,
        win_rate: entry.win_rate || '85%'
      }));

      return res.json({
        success: true,
        matches: formattedMatches,
        events: eventsRes.rows,
        leaderboard: formattedLeaderboard
      });
    } catch (err) {
      logger.error('GameOn getHubData error:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/gameon/events
   */
  async getAll(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM gameon_events ORDER BY start_time ASC LIMIT 50'
      );
      return res.json({ success: true, data: result.rows, events: result.rows });
    } catch (err) {
      logger.error('GameOn getAll error:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/gameon/matches
   */
  async getMatches(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM gameon_matches ORDER BY match_date ASC LIMIT 50'
      );
      return res.json({ success: true, matches: result.rows });
    } catch (err) {
      logger.error('GameOn getMatches error:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/gameon/leaderboard
   */
  async getLeaderboard(req, res) {
    try {
      const result = await pool.query(
        `SELECT gl.*, u.username, u.avatar_url 
         FROM gameon_leaderboards gl
         LEFT JOIN users u ON u.uuid::text = gl.user_id::text
         ORDER BY gl.rank ASC LIMIT 25`
      );
      return res.json({ success: true, leaderboard: result.rows });
    } catch (err) {
      logger.error('GameOn getLeaderboard error:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/gameon/wager
   */
  async placeWager(req, res) {
    try {
      const { matchId, team, wagerAmount, userId } = req.body;
      if (!matchId || !team || !wagerAmount) {
        return res.status(400).json({ success: false, message: 'Missing matchId, team, or wagerAmount' });
      }

      // Check match exists
      const matchCheck = await pool.query('SELECT * FROM gameon_matches WHERE id = $1', [matchId]);
      if (matchCheck.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Match not found' });
      }

      const match = matchCheck.rows[0];
      const oddsMultiplier = team === 'A' ? (match.odds?.home || 1.85) : (match.odds?.away || 2.15);
      const potentialWinnings = Number(wagerAmount) * Number(oddsMultiplier);

      const predictionUser = userId || '9247363b-bb66-4fa3-9421-c964970b04df';

      const insertRes = await pool.query(
        `INSERT INTO gameon_predictions (match_id, user_id, prediction, stake_amount, potential_winnings, status)
         VALUES ($1, $2, $3, $4, $5, 'pending')
         RETURNING *`,
        [matchId, predictionUser, team === 'A' ? match.home_team : match.away_team, wagerAmount, potentialWinnings]
      );

      return res.status(201).json({
        success: true,
        message: 'Wager placed successfully',
        prediction: insertRes.rows[0],
        potentialWinnings
      });
    } catch (err) {
      logger.error('GameOn placeWager error:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const { eventId } = req.params;
      const result = await pool.query('SELECT * FROM gameon_events WHERE id = $1', [eventId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      return res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async create(req, res) {
    try {
      const { title, description, organizerId, startTime } = req.body;
      const insert = await pool.query(
        `INSERT INTO gameon_events (title, description, organizer_id, start_time)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [title, description, organizerId || '9247363b-bb66-4fa3-9421-c964970b04df', startTime || new Date()]
      );
      return res.status(201).json({ success: true, data: insert.rows[0] });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const { eventId } = req.params;
      await pool.query('DELETE FROM gameon_events WHERE id = $1', [eventId]);
      return res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async getCategories(req, res) {
    return res.json({
      success: true,
      data: ['esports', 'rhythm', 'speedtap', 'fps', 'strategy', 'tournament', 'championship']
    });
  }
}

module.exports = new GameonController();
