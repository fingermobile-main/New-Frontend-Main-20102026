/**
 * Environment Validator
 * Validates that all required environment variables are set before application startup
 */

const requiredEnvVars = [
  'NODE_ENV',
  'DATABASE_URL',
  'JWT_SECRET',
  'REDIS_URL',
  'PORT'
  // Add other required variables as needed
];

function validateEnvironment() {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    process.exit(1);
  }
  
  console.log('All required environment variables are present');
  return true;
}

module.exports = { validateEnvironment };