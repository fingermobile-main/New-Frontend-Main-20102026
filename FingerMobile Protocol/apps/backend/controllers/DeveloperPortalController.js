/**
 * DeveloperPortalController
 * Developer portal endpoints for API documentation and SDK downloads
 */

const APIDocsService = require('../services/APIDocsService');
const logger = require('../utils/logger');

class DeveloperPortalController {
  /**
     * GET /api/developer/openapi.json
     * Get OpenAPI specification as JSON
     */
  async getOpenAPISpec(req, res) {
    try {
      const spec = await APIDocsService.generateOpenAPISpec();
      res.json(spec);
    } catch (error) {
      logger.error('Error in getOpenAPISpec:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate OpenAPI spec',
        error: error.message
      });
    }
  }

  /**
     * GET /api/developer/sdk/javascript
     * Download JavaScript SDK
     */
  async getJavaScriptSDK(req, res) {
    try {
      const sdkCode = await APIDocsService.generateJavaScriptSDK();
      res.setHeader('Content-Type', 'application/javascript');
      res.setHeader('Content-Disposition', 'attachment; filename="fingermobile-sdk.js"');
      res.send(sdkCode);
    } catch (error) {
      logger.error('Error in getJavaScriptSDK:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate JavaScript SDK',
        error: error.message
      });
    }
  }

  /**
     * GET /api/developer/sdk/python
     * Download Python SDK
     */
  async getPythonSDK(req, res) {
    try {
      const sdkCode = await APIDocsService.generatePythonSDK();
      res.setHeader('Content-Type', 'text/x-python');
      res.setHeader('Content-Disposition', 'attachment; filename="fingermobile_sdk.py"');
      res.send(sdkCode);
    } catch (error) {
      logger.error('Error in getPythonSDK:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate Python SDK',
        error: error.message
      });
    }
  }

  /**
     * GET /api/developer/examples/curl
     * Get cURL examples
     */
  async getCurlExamples(req, res) {
    try {
      const examples = await APIDocsService.generateCurlExamples();
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="curl-examples.sh"');
      res.send(examples);
    } catch (error) {
      logger.error('Error in getCurlExamples:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate cURL examples',
        error: error.message
      });
    }
  }

  /**
     * POST /api/developer/docs/generate
     * Regenerate all documentation files
     */
  async regenerateDocs(req, res) {
    try {
      const result = await APIDocsService.saveDocumentation();
      res.json({
        success: true,
        message: 'Documentation regenerated successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error in regenerateDocs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to regenerate documentation',
        error: error.message
      });
    }
  }

  /**
     * GET /api/developer/stats
     * Get API usage statistics
     */
  async getAPIStats(req, res) {
    try {
      // This would query analytics database for API usage
      res.json({
        success: true,
        data: {
          total_endpoints: 150,
          documented_endpoints: 145,
          sdk_downloads: {
            javascript: 0,
            python: 0
          },
          last_updated: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error in getAPIStats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch API stats',
        error: error.message
      });
    }
  }
}

module.exports = new DeveloperPortalController();
