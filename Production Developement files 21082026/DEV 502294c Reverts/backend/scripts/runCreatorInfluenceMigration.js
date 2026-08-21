/**
 * Script to run the Creator & Influence Infrastructure Subscription database migration
 */

const { createCreatorInfluenceSubscriptionsTable } = require('../database/migrate_creator_influence_subscriptions');

async function runMigration() {
  logger.info('Starting Creator & Influence Infrastructure Subscription migration...');
  
  try {
    await createCreatorInfluenceSubscriptionsTable();
    logger.info('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Migration,
failed:', error);
    process.exit(1);
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };