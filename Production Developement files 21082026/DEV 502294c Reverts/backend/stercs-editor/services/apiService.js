const { identityDb } = require("../../db");
const { logSecurityEvent } = require("../../utils/securityLogger");

class ApiService {
  // Create a new API
  static async createApi(memberId, apiData) {
    try {
      const {
        name,
        description,
        projectId,
        baseUrl,
        endpoints = [],
        authType = "none",
        authConfig = {},
      } = apiData;

      if (!name || !projectId || !baseUrl) {
        throw new Error(
          "Name, Project ID, and Base URL are required for API creation",
        );
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_apis 
         (member_id, project_id, name, description, base_url, endpoints, auth_type, auth_config)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          memberId,
          projectId,
          name,
          description || "",
          baseUrl,
          endpoints,
          authType,
          authConfig
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, "API_CREATE", {apiId: result.rows[0].id,
  apiName: name
      });

      return {success: true,
  api: result.rows[0],
  message: "API created successfully"
      };
    } catch (error) {
      logger.error("Error creating, API:", error);
      throw error;
    }
  }

  // Get APIs for a member
  static async getApis(memberId, options = {}) {
    try {
      let query = `SELECT * FROM stercs_apis WHERE member_id = $1`;
      const params = [memberId];

      if (options.projectId) {
        query += ` AND project_id = $${params.length + 1}`;
        params.push(options.projectId);
      }

      if (options.search) {
        query += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`;
        params.push(`%${options.search}%`);
      }

      query += ` ORDER BY created_at DESC`;

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
  apis: result.rows,
  message: "APIs retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting, APIs:", error);
      throw error;
    }
  }

  // Get API by ID
  static async getApiById(memberId, apiId) {
    try {
      const result = await identityDb.query(
        `SELECT * FROM stercs_apis WHERE id = $1 AND member_id = $2`,
        [apiId, memberId],
      );

      if (result.rows.length === 0) {
        throw new Error("API not found or not owned by member");
      }

      return {success: true,
  api: result.rows[0],
  message: "API retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting API by, ID:", error);
      throw error;
    }
  }

  // Update an API
  static async updateApi(memberId, apiId, apiData) {
    try {
      // Verify API belongs to member
      const apiResult = await identityDb.query(
        `SELECT * FROM stercs_apis WHERE id = $1 AND member_id = $2`,
        [apiId, memberId],
      );

      if (apiResult.rows.length === 0) {
        throw new Error("API not found or not owned by member");
      }

      // Build update query dynamically
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 3; // First two params are apiId and memberId

      if (apiData.name) {
        updateFields.push(`name = $${paramIndex}`);
        updateValues.push(apiData.name);
        paramIndex++;
      }

      if (apiData.description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        updateValues.push(apiData.description);
        paramIndex++;
      }

      if (apiData.baseUrl) {
        updateFields.push(`base_url = $${paramIndex}`);
        updateValues.push(apiData.baseUrl);
        paramIndex++;
      }

      if (apiData.endpoints) {
        updateFields.push(`endpoints = $${paramIndex}`);
        updateValues.push(apiData.endpoints);
        paramIndex++;
      }

      if (apiData.authType) {
        updateFields.push(`auth_type = $${paramIndex}`);
        updateValues.push(apiData.authType);
        paramIndex++;
      }

      if (apiData.authConfig) {
        updateFields.push(`auth_config = $${paramIndex}`);
        updateValues.push(apiData.authConfig);
        paramIndex++;
      }

      updateValues.push(apiId, memberId); // Add apiId and memberId as last values

      const query = `UPDATE stercs_apis SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex - 1} AND member_id = $${paramIndex} RETURNING *`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, "API_UPDATE", {apiId: result.rows[0].id,
  apiName: result.rows[0].name
      });

      return {success: true,
  api: result.rows[0],
  message: "API updated successfully"
      };
    } catch (error) {
      logger.error("Error updating, API:", error);
      throw error;
    }
  }

  // Delete an API
  static async deleteApi(memberId, apiId) {
    try {
      // Verify API belongs to member
      const apiResult = await identityDb.query(
        `SELECT * FROM stercs_apis WHERE id = $1 AND member_id = $2`,
        [apiId, memberId],
      );

      if (apiResult.rows.length === 0) {
        throw new Error("API not found or not owned by member");
      }

      await identityDb.query(
        `DELETE FROM stercs_apis WHERE id = $1 AND member_id = $2`,
        [apiId, memberId],
      );

      // Log security event
      await logSecurityEvent(memberId, "API_DELETE", {
        apiId
      });

      return {success: true,
  message: "API deleted successfully"
      };
    } catch (error) {
      logger.error("Error deleting, API:", error);
      throw error;
    }
  }

  // Create an API endpoint
  static async createEndpoint(memberId, apiId, endpointData) {
    try {
      const {
        path,
        method,
        description,
        requestSchema,
        responseSchema,
        mockResponse = null,
      } = endpointData;

      if (!path || !method) {
        throw new Error("Path and method are required for endpoint creation");
      }

      // Verify API belongs to member
      const apiResult = await identityDb.query(
        `SELECT * FROM stercs_apis WHERE id = $1 AND member_id = $2`,
        [apiId, memberId],
      );

      if (apiResult.rows.length === 0) {
        throw new Error("API not found or not owned by member");
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_api_endpoints 
         (api_id, member_id, path, method, description, request_schema, response_schema, mock_response)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          apiId,
          memberId,
          path,
          method.toUpperCase(),
          description || "",
          requestSchema || {},
          responseSchema || {},
          mockResponse
        ],
      );

      // Update the endpoints array in the API record
      const currentApi = apiResult.rows[0];
      const newEndpoint = {id: result.rows[0].id,
  path: result.rows[0].path,
  method: result.rows[0].method,
  description: result.rows[0].description
      };

      const updatedEndpoints = [...(currentApi.endpoints || []), newEndpoint];
      await identityDb.query(
        `UPDATE stercs_apis SET endpoints = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [updatedEndpoints, apiId],
      );

      // Log security event
      await logSecurityEvent(memberId, "API_ENDPOINT_CREATE", {endpointId: result.rows[0].id,
  apiId: apiId
      });

      return {success: true,
  endpoint: result.rows[0],
  message: "API endpoint created successfully"
      };
    } catch (error) {
      logger.error("Error creating API, endpoint:", error);
      throw error;
    }
  }

  // Get API endpoints
  static async getEndpoints(memberId, apiId, options = {}) {
    try {
      const result = await identityDb.query(
        `SELECT * FROM stercs_api_endpoints 
         WHERE api_id = $1 AND member_id = $2
         ORDER BY created_at DESC`,
        [apiId, memberId],
      );

      return {success: true,
  endpoints: result.rows,
  message: "API endpoints retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting API, endpoints:", error);
      throw error;
    }
  }

  // Test an API endpoint
  static async testEndpoint(memberId, endpointId, testData) {
    try {
      // Verify endpoint belongs to member
      const endpointResult = await identityDb.query(
        `SELECT * FROM stercs_api_endpoints WHERE id = $1 AND member_id = $2`,
        [endpointId, memberId],
      );

      if (endpointResult.rows.length === 0) {
        throw new Error("API endpoint not found or not owned by member");
      }

      const endpoint = endpointResult.rows[0];

      // In a real implementation, this would make an actual HTTP request
      // For now, we'll simulate the test
      const testResult = {success: true,
  statusCode: 200,
  responseTime: Math.floor(Math.random() * 1000) + 100, // Random response time between 100-1100ms,
  responseBody: endpoint.mockResponse || {
  message: "Test successful" },
timestamp: new Date().toISOString()
      };

      // Log the test result
      await identityDb.query(
        `INSERT INTO stercs_api_tests 
         (endpoint_id, member_id, request_data, result, status_code, response_time)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          endpointId,
          memberId,
          testData || {},
          testResult.responseBody,
          testResult.statusCode,
          testResult.responseTime
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, "API_ENDPOINT_TEST", {endpointId: endpointId,
  statusCode: testResult.statusCode
      });

      return {success: true,
  testResult,
  message: "API endpoint tested successfully"
      };
    } catch (error) {
      logger.error("Error testing API, endpoint:", error);
      throw error;
    }
  }

  // Get API test history
  static async getTestHistory(memberId, endpointId, options = {}) {
    try {
      let query = `SELECT * FROM stercs_api_tests WHERE endpoint_id = $1 AND member_id = $2 ORDER BY created_at DESC`;
      const params = [endpointId, memberId];

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
  tests: result.rows,
  message: "API test history retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting API test, history:", error);
      throw error;
    }
  }
}

module.exports = ApiService;
