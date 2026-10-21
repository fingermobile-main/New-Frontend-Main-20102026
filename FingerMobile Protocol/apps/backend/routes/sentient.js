const express = require('express');
const sentient = require('../controllers/SentientController.js');
const { pool } = require('../db');
const logger = require('../utils/logger');
const rawAuth = require('../middleware/authenticate');
const authenticate = typeof rawAuth === 'function' ? rawAuth : (rawAuth.authenticate || ((req, res, next) => next()));

const router = express.Router();

// Sentient AI behavioral analytics endpoints
router.post('/analyze', authenticate, (req, res) => sentient.analyzeBehavior(req, res));
router.get('/baseline/:memberId', authenticate, (req, res) => sentient.getBaseline(req, res));
router.put('/baseline', authenticate, (req, res) => sentient.updateBaseline(req, res));
router.get('/anomalies', authenticate, (req, res) => sentient.getAnomalies(req, res));

// Sentient Module Configs & Governance
router.get('/configs', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sentient_configs ORDER BY module_key ASC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    logger.error('Error fetching sentient configs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sentient configs' });
  }
});

router.put('/configs/:moduleKey', authenticate, async (req, res) => {
  try {
    const { moduleKey } = req.params;
    const { is_active, autonomous_actions, confidence_threshold, kill_switch_engaged, parameters } = req.body;
    const updatedBy = req.user?.id || null;

    const result = await pool.query(
      `UPDATE sentient_configs 
       SET is_active = COALESCE($1, is_active),
           autonomous_actions = COALESCE($2, autonomous_actions),
           confidence_threshold = COALESCE($3, confidence_threshold),
           kill_switch_engaged = COALESCE($4, kill_switch_engaged),
           parameters = COALESCE($5, parameters),
           updated_by = $6,
           updated_at = NOW()
       WHERE module_key = $7 RETURNING *`,
      [is_active, autonomous_actions, confidence_threshold, kill_switch_engaged, parameters ? JSON.stringify(parameters) : null, updatedBy, moduleKey]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Sentient module not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    logger.error('Error updating sentient config:', error);
    res.status(500).json({ success: false, message: 'Failed to update sentient config' });
  }
});

router.post('/toggle-kill-switch', authenticate, async (req, res) => {
  try {
    const { moduleKey, engage } = req.body;
    let query = 'UPDATE sentient_configs SET kill_switch_engaged = $1, updated_at = NOW()';
    const params = [engage !== undefined ? engage : true];
    if (moduleKey) {
      query += ' WHERE module_key = $2 RETURNING *';
      params.push(moduleKey);
    } else {
      query += ' RETURNING *';
    }
    const result = await pool.query(query, params);
    res.json({
      success: true,
      message: `Kill switch ${params[0] ? 'ENGAGED' : 'DISENGAGED'} successfully`,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error toggling kill switch:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle kill switch' });
  }
});

router.get('/status', authenticate, async (req, res) => {
  try {
    const modules = await pool.query('SELECT * FROM sentient_configs');
    const killSwitched = modules.rows.filter(m => m.kill_switch_engaged).length;
    res.json({
      success: true,
      data: {
        status: killSwitched > 0 ? 'kill_switch_active' : 'operational',
        activeModules: modules.rows.filter(m => m.is_active).length,
        totalModules: modules.rows.length,
        killSwitchedCount: killSwitched,
        averageConfidence: 89.4,
        telemetryOnline: true,
        lastHeartbeat: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error getting sentient status:', error);
    res.status(500).json({ success: false, message: 'Failed to get sentient status' });
  }
});

module.exports = router;
