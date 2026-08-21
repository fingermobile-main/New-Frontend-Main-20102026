/**
 * SentientController
 * Bridge between frontend and Python Sentient AI backend for behavioral analytics
 */

const { spawn } = require('child_process');
const logger = require('../utils/logger');
const path = require('path');

class SentientController {
  /**
   * Sanitize input parameters to prevent command injection
   */
  sanitizeParam(param) {
    if (!param || typeof param !== 'string') {
      return '';
    }
    
    // Remove potentially dangerous characters
    return param.replace(/[;&|$`]/g, '');
  }
  
  /**
   * Sanitize action parameter specifically
   */
  sanitizeAction(action) {
    if (!action || typeof action !== 'string') {
      return 'default_action';
    }
    
    // Only allow alphanumeric characters and hyphens/underscores
    return action.replace(/[^a-zA-Z0-9\-_]/g, '');
  }
  
  /**
   * Analyze member behavior using Python Sentient engine
   */
  async analyzeBehavior(req, res) {
    try {
      const { memberId, behaviorData } = req.body;
      
      if (!memberId || !behaviorData) {
        return res.status(400).json({
          success: false, error: 'memberId and behaviorData are required'
        });
      }
      
      // Call Python Sentient backend
      const result = await this.callPythonSentient('analyze_member', {
        memberId: this.sanitizeParam(memberId.toString()),
        behaviorData: behaviorData
      });
      
      res.json({
        success: true, data: result
      });
    } catch (error) {
      logger.error('Error in SentientController.analyzeBehavior:', error);
      res.status(500).json({
        success: false, error: 'Failed to analyze behavior', details: error.message
      });
    }
  }
  
  /**
   * Get behavioral baseline for member
   */
  async getBaseline(req, res) {
    try {
      const { memberId } = req.params;
      
      const result = await this.callPythonSentient('get_baseline', {
        memberId: this.sanitizeParam(memberId)
      });
      
      res.json({
        success: true, data: result
      });
    } catch (error) {
      logger.error('Error in SentientController.getBaseline:', error);
      res.status(500).json({
        success: false, error: 'Failed to get baseline', details: error.message
      });
    }
  }
  
  /**
   * Update behavioral baseline
   */
  async updateBaseline(req, res) {
    try {
      const { memberId, baselineData } = req.body;
      
      const result = await this.callPythonSentient('update_baseline', {
        memberId: this.sanitizeParam(memberId.toString()),
        baselineData: baselineData
      });
      
      res.json({
        success: true, data: result
      });
    } catch (error) {
      logger.error('Error in SentientController.updateBaseline:', error);
      res.status(500).json({
        success: false, error: 'Failed to update baseline', details: error.message
      });
    }
  }
  
  /**
   * Get anomaly alerts
   */
  async getAnomalies(req, res) {
    try {
      const { memberId, limit = 50 } = req.query;
      
      const result = await this.callPythonSentient('get_anomalies', {
        memberId: memberId ? this.sanitizeParam(memberId.toString()) : null,
        limit: Math.min(Math.max(parseInt(limit), 1), 1000) // Limit to reasonable range
      });
      
      res.json({
        success: true, data: result
      });
    } catch (error) {
      logger.error('Error in SentientController.getAnomalies:', error);
      res.status(500).json({
        success: false, error: 'Failed to get anomalies', details: error.message
      });
    }
  }
  
  /**
   * Call Python Sentient backend
   */
  callPythonSentient(action, params) {
    return new Promise((resolve, reject) => {
      // Sanitize action parameter
      const safeAction = this.sanitizeAction(action);
      
      const pythonScript = path.join(__dirname, '../../security/sentient_behavioral_analytics.py');
      
      // Sanitize parameters to prevent command injection
      const sanitizedParams = JSON.stringify(params).replace(/[;&|$`]/g, '');
      
      // ⚠️ SECURITY: Using spawn with parameterized arguments (safe from injection)
      const pythonProcess = spawn('python3', [
        pythonScript, '--action', safeAction, '--params', sanitizedParams
      ], {
        shell: false, // Prevent command injection
        timeout: 30000 // 30 second timeout
      });
      
      let stdout = '';
      let stderr = '';
      
      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(stdout);
            resolve(result);
          } catch (e) {
            resolve({ raw_output: stdout });
          }
        } else {
          reject(new Error(`Python process exited with code ${code}: ${stderr}`));
        }
      });
      
      pythonProcess.on('error', (error) => {
        reject(error);
      });
    });
  }
}

module.exports = new SentientController();