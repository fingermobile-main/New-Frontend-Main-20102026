/**
 * Master Database Migration Runner
 * Aggregates all cluster schemas and runs them sequentially
 */
const { runMigrations } = require('./run_migrations');

console.log('🏛️ Running Master Migration Suite...');
runMigrations().catch(err => {
  console.error('Master migration failure:', err);
  process.exit(1);
});
