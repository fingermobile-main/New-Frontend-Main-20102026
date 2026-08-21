/**
 * PromptsController
 * Bridge between frontend and Python PROMPTS threat analyzer
 */

const { spawn } = require('child_process');
const logger = require('../utils/logger');
const path = require('path');

class PromptsController {
  async analyzePrompt(req, res) {
    try {
      const { promptData, context } = req.body;
      
      if (!promptData) {
        return res.status(400).json({
          success: false, error: 'promptData is required'
        });
      }
      
      const result = await this.callPythonPrompts('analyze', {
        promptData,
        context
      });
      
      res.json({
        success: true, data: result
      });
    } catch (error) {
      logger.error('Error in PromptsController.analyzePrompt:', error);
      res.status(500).json({
        success: false, error: 'Failed to analyze prompt', details: error.message
      });
    }
  }
  
  callPythonPrompts(action, params) {
    return new Promise((resolve, reject) => {
      const pythonScript = path.join(__dirname, '../../security/prompts_threat_analyzer.py');
      
      // ⚠️ SECURITY: Using spawn with parameterized arguments (safe from injection)
      const pythonProcess = spawn('python3', [
        pythonScript, pythonScript, action, '--params', JSON.stringify(params)
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

module.exports = new PromptsController();
