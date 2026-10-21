const cron = require('node-cron');
const logger = require('./config/logger');
const accountInactivityService = require('./services/accountInactivityService');

// Schedule account inactivity checks to run daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  logger.info('Running daily account inactivity checks...');
  try {
    await accountInactivityService.checkAndProcessAccountInactivity();
    logger.info('Daily account inactivity checks completed successfully');
  } catch (error) {
    logger.error('Error during account inactivity checks:', error);
  }
}, {
  timezone: "UTC"
});

// Schedule liability reconciliation checks to run twice daily (morning and evening)
cron.schedule('0 6,18 * * *', async () => {
  logger.info('Running liability reconciliation checks...');
  try {
    await accountInactivityService.processLiabilityReconciliation();
    logger.info('Liability reconciliation checks completed successfully');
  } catch (error) {
    logger.error('Error during liability reconciliation:', error);
  }
}, {
  timezone: "UTC"
});

logger.info('Cron jobs scheduled successfully');