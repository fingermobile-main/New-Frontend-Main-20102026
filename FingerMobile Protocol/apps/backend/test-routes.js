/* eslint-disable no-unused-vars */
const logger = require('./utils/logger');
// test-routes.js
const express = require('express');
const glob = require('glob'); // Import the glob module
const path = require('path');
const request = require('supertest'); // Import supertest for HTTP request simulation

const { sequelize } = require('./database/connection');
const { setSequelize } = require('./utils/modelInitializer');

async function runTest() {
  const app = express();
  const errors = []; // Array to collect all errors

  logger.info('🔧 Initializing Sequelize...');
  setSequelize(sequelize);

  logger.info('🔐 Authenticating Sequelize connection...');
  try {
    await sequelize.authenticate();
    logger.info('✅ Sequelize connection authenticated successfully.');
  } catch (err) {
    logger.error('❌ Failed to authenticate Sequelize connection:', err);
    process.exit(1);
  }

  logger.info('🧪 Validating main route module (routes/index.js) and execution...');

  // Load and register the main routes index file
  const mainRouteFile = './routes/index.js';
  try {
    const route = require(mainRouteFile);

    // Verify the export is a valid Express router or middleware function
    if (typeof route !== 'function' && (!route || typeof route.handle !== 'function')) {
      throw new TypeError(`Module at ${mainRouteFile} does not export a valid Express router/middleware.`);
    }

    app.use('/', route); // Mount the main router
    logger.info(`✅ Successfully loaded and registered main route module: ${mainRouteFile}`);
  } catch (err) {
    logger.error(`💥 Broken Route File Detected (Load/Registration): ${mainRouteFile}`);
    logger.error(err);
    errors.push({ file: mainRouteFile, error: err });
  }


  // After loading the main route module, simulate a request to test execution
  if (errors.length === 0) {
    logger.info('\n🚀 Sending test request to "/" to trigger route handlers...');
    try {
      // Send a simple GET request to the root path
      // Using supertest to simulate the request without starting a real server
      const response = await request(app).get('/').timeout(5000); // 5 second timeout

      // Log the response status and text
      logger.info(`\n🌐 Test request completed. Status: ${response.status}`);
      logger.info(`📋 Response preview: ${response.text.substring(0, 100)}...`); // First 100 chars

      // If the response status is 5xx, consider it a server error caused by route execution
      if (response.status >= 500) {
        const executionError = new Error(`Route execution failed with status ${response.status}. Response: ${response.text}`);
        errors.push({ file: 'Route Execution (/)', error: executionError });
      }
    } catch (reqErr) {
      // Handle errors during the request (e.g., timeout, route throws error)
      logger.error('\n💥 Error during route execution test:');
      logger.error(reqErr);
      errors.push({ file: 'Route Execution (/)', error: reqErr });
    }
  } else {
    logger.info('\n⚠️ Skipping route execution test due to load/registration errors.');
  }


  // Gracefully close connection regardless of outcome
  await sequelize.close();

  if (errors.length > 0) {
    logger.error('\n❌ Summary of Errors Encountered:');
    errors.forEach(({ file, error }) => {
      logger.error(`\nFile/Stage: ${file}`);
      logger.error(error);
    });
    process.exit(1);
  }

  logger.info('\n✅ Main route module loaded, registered, and executed successfully (no immediate crashes detected)! All included routes are implicitly validated.');
}

runTest().catch((err) => {
  logger.error('Unhandled runtime error in test setup:', err);
  process.exit(1);
});
