const logger = require('../../utils/logger');
const { identityDb } = require('../../db');
const { logSecurityEvent } = require('../../utils/securityLogger');

class TestingService {
  // Create a new test configuration
  static async createTestConfig(memberId, configData) {
    try {
      const {
        name,
        description,
        projectId,
        testType,
        testFramework,
        testFiles,
        environment,
        schedule
      } = configData;

      if (!name || !projectId || !testType || !testFramework) {
        throw new Error(
          'Name, Project ID, Test Type, and Test Framework are required for test configuration'         );
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_test_configs 
         (member_id, project_id, name, description, test_type, test_framework, test_files, environment, schedule)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,         [
          memberId,
          projectId,
          name,
          description || '',
          testType,
          testFramework,
          testFiles || [],
          environment || 'development',
          schedule || null
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, 'TEST_CONFIG_CREATE', {configId: result.rows[0].id,
        configName: name
      });

      return {success: true,
        config: result.rows[0],
        message: 'Test configuration created successfully'
      };
    } catch (error) {
      logger.error('Error creating test configuration:', error);
      throw error;
    }
  }

  // Get test configurations for a member
  static async getTestConfigs(memberId, options = {}) {
    try {
      let query = 'SELECT * FROM stercs_test_configs WHERE member_id = $1';
      const params = [memberId];

      if (options.projectId) {
        query += ` AND project_id = $${params.length + 1}`;
        params.push(options.projectId);
      }

      if (options.testType) {
        query += ` AND test_type = $${params.length + 1}`;
        params.push(options.testType);
      }

      if (options.testFramework) {
        query += ` AND test_framework = $${params.length + 1}`;
        params.push(options.testFramework);
      }

      query += ' ORDER BY created_at DESC';

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
        configs: result.rows,
        message: 'Test configurations retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting test configurations:', error);
      throw error;
    }
  }

  // Update a test configuration
  static async updateTestConfig(memberId, configId, configData) {
    try {
      // Verify config belongs to member
      const configResult = await identityDb.query(
        'SELECT * FROM stercs_test_configs WHERE id = $1 AND member_id = $2'         [configId, memberId],
      );

      if (configResult.rows.length === 0) {
        throw new Error('Test configuration not found or not owned by member');
      }

      // Build update query dynamically
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 2; // First param is configId

      if (configData.name) {
        updateFields.push(`name = $${paramIndex}`);
        updateValues.push(configData.name);
        paramIndex++;
      }

      if (configData.description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        updateValues.push(configData.description);
        paramIndex++;
      }

      if (configData.testType) {
        updateFields.push(`test_type = $${paramIndex}`);
        updateValues.push(configData.testType);
        paramIndex++;
      }

      if (configData.testFramework) {
        updateFields.push(`test_framework = $${paramIndex}`);
        updateValues.push(configData.testFramework);
        paramIndex++;
      }

      if (configData.testFiles) {
        updateFields.push(`test_files = $${paramIndex}`);
        updateValues.push(configData.testFiles);
        paramIndex++;
      }

      if (configData.environment) {
        updateFields.push(`environment = $${paramIndex}`);
        updateValues.push(configData.environment);
        paramIndex++;
      }

      if (configData.schedule !== undefined) {
        updateFields.push(`schedule = $${paramIndex}`);
        updateValues.push(configData.schedule);
        paramIndex++;
      }

      updateValues.push(configId); // Add configId as last value

      const query = `UPDATE stercs_test_configs SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, 'TEST_CONFIG_UPDATE', {configId: result.rows[0].id,
        configName: result.rows[0].name
      });

      return {success: true,
        config: result.rows[0],
        message: 'Test configuration updated successfully'
      };
    } catch (error) {
      logger.error('Error updating test configuration:', error);
      throw error;
    }
  }

  // Delete a test configuration
  static async deleteTestConfig(memberId, configId) {
    try {
      // Verify config belongs to member
      const configResult = await identityDb.query(
        'SELECT * FROM stercs_test_configs WHERE id = $1 AND member_id = $2'         [configId, memberId],
      );

      if (configResult.rows.length === 0) {
        throw new Error('Test configuration not found or not owned by member');
      }

      await identityDb.query('DELETE FROM stercs_test_configs WHERE id = $1', [
        configId
      ]);

      // Log security event
      await logSecurityEvent(memberId, 'TEST_CONFIG_DELETE', {
        configId
      });

      return {success: true,
        message: 'Test configuration deleted successfully'
      };
    } catch (error) {
      logger.error('Error deleting test configuration:', error);
      throw error;
    }
  }

  // Create a new test run
  static async createTestRun(memberId, testRunData) {
    try {
      const { configId, projectId, notes } = testRunData;

      if (!configId || !projectId) {
        throw new Error(
          'Configuration ID and Project ID are required for test run'         );
      }

      // Verify the config belongs to the member
      const configResult = await identityDb.query(
        'SELECT * FROM stercs_test_configs WHERE id = $1 AND member_id = $2'         [configId, memberId],
      );

      if (configResult.rows.length === 0) {
        throw new Error('Test configuration not found or not owned by member');
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_test_runs 
         (member_id, config_id, project_id, status, notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`         [
            memberId,
            configId,
            projectId,
            'pending', // Initial status
            notes || ''
          ],
      );

      // Log security event
      await logSecurityEvent(memberId, 'TEST_RUN_START', {testRunId: result.rows[0].id,
        configId: configId
      });

      return {success: true,
        testRun: result.rows[0],
        message: 'Test run started successfully'
      };
    } catch (error) {
      logger.error('Error creating test run:', error);
      throw error;
    }
  }

  // Get test runs for a member
  static async getTestRuns(memberId, options = {}) {
    try {
      let query = `SELECT tr.*, tc.name as config_name, tc.test_type as test_type, tc.test_framework as test_framework 
                   FROM stercs_test_runs tr
                   JOIN stercs_test_configs tc ON tr.config_id = tc.id
                   WHERE tr.member_id = $1`;
      const params = [memberId];

      if (options.projectId) {
        query += ` AND tr.project_id = $${params.length + 1}`;
        params.push(options.projectId);
      }

      if (options.status) {
        query += ` AND tr.status = $${params.length + 1}`;
        params.push(options.status);
      }

      if (options.testType) {
        query += ` AND tc.test_type = $${params.length + 1}`;
        params.push(options.testType);
      }

      query += ' ORDER BY tr.created_at DESC';

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
        testRuns: result.rows,
        message: 'Test runs retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting test runs:', error);
      throw error;
    }
  }

  // Update test run status
  static async updateTestRunStatus(
    memberId,
    testRunId,
    status,
    results = null,
  ) {
    try {
      // Verify test run belongs to member
      const testRunResult = await identityDb.query(
        'SELECT * FROM stercs_test_runs WHERE id = $1 AND member_id = $2'         [testRunId, memberId],
      );

      if (testRunResult.rows.length === 0) {
        throw new Error('Test run not found or not owned by member');
      }

      const updateFields = ['status = $1', 'updated_at = CURRENT_TIMESTAMP'];
      const updateValues = [status];

      if (results) {
        updateFields.push('results = $2');
        updateValues.push(results);
      }

      updateValues.push(testRunId);

      const query = `UPDATE stercs_test_runs SET ${updateFields.join(', ')} WHERE id = $${updateValues.length} RETURNING *`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, 'TEST_RUN_STATUS_UPDATE', {testRunId: result.rows[0].id,
        status: status
      });

      return {success: true,
        testRun: result.rows[0],
        message: 'Test run status updated successfully'
      };
    } catch (error) {
      logger.error('Error updating test run status:', error);
      throw error;
    }
  }

  // Execute a test run (simulated)
  static async executeTestRun(testRunId) {
    try {
      // In a real implementation, this would:
      // 1. Get the test configuration
      // 2. Execute the tests using the specified framework
      // 3. Collect results
      // 4. Update the test run status

      // For now, we'll simulate the process
      const testRunResult = await identityDb.query(
        `SELECT tr.*, tc.test_files as test_files 
         FROM stercs_test_runs tr
         JOIN stercs_test_configs tc ON tr.config_id = tc.id
         WHERE tr.id = $1`,
        [testRunId],
      );

      if (testRunResult.rows.length === 0) {
        throw new Error('Test run not found');
      }

      // Simulate test execution with delays
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate processing time

      // Randomly determine if tests passed
      const success = Math.random() > 0.2; // 80% success rate for simulation

      const status = success ? 'completed' : 'failed';

      // Generate mock test results
      const results = {totalTests: 10,
        passedTests: success ? 10 : Math.floor(Math.random() * 10),
        failedTests: success ? 0 : 10 - Math.floor(Math.random() * 10),
        skippedTests: 0,
        executionTime: Math.floor(Math.random() * 5000) + 1000, // 1-6 seconds,
        details: success ? 'All tests passed' : 'Some tests failed'
      };

      await identityDb.query(
        `UPDATE stercs_test_runs 
         SET status = $1, results = $2, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $3`         [status, results, testRunId],
      );

      return {success: true,
        testRunId,
        status,
        results,
        message: success
          ? 'Tests completed successfully'
          : 'Tests failed with errors'
      };
    } catch (error) {
      logger.error('Error executing test run:', error);
      throw error;
    }
  }
}

module.exports = TestingService;
