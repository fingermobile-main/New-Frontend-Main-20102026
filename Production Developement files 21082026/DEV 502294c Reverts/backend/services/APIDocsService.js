/**
 * APIDocsService
 * API documentation generation and SDK code generation
 */

const fs = require('fs');
const path = require('path');

class APIDocsService {
  async generateOpenAPISpec() {
    try {
      const spec = {
        openapi: '3.0.0',
        info: {
          title: 'FingerMobile Protocol API',
          version: '1.0.0',
          description: 'Complete API documentation for FingerMobile Platform'
        },
        servers: [
          { url: 'https://api.fingermobile.com', description: 'Production' },
          { url: 'https://staging-api.fingermobile.com', description: 'Staging' }
        ],
        paths: this.generatePaths(),
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        }
      };
      
      return spec;
    } catch (error) {
      logger.error('Error generating OpenAPI spec:', error);
      throw error;
    }
  }
  
  generatePaths() {
    // Auto-generate from route files
    return {};
  }
  
  async generateSDK(language = 'javascript') {
    try {
      const sdkCode = `
// FingerMobile API SDK - ${language}
import axios from 'axios';

export class FingerMobileSDK {
  constructor(apiKey, baseURL = 'https://api.fingermobile.com') {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': \`Bearer \${apiKey}\`
      }
    });
  }
  
  async getUser(userId) {
    try {
    const response = await this.client.get(\`/users/\${userId}\`);
    return response.data;
    } catch (error) {
      logger.error('getUser error:', error);
      throw error;
    }
  }
}
`;
      
      return sdkCode;
    } catch (error) {
      logger.error('Error generating SDK:', error);
      throw error;
    }
  }
}

module.exports = new APIDocsService();
