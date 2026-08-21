const Queue = require('bull');
const logger = require('../utils/logger'); // Adding logger import

class QueueService {
  constructor() {
    // Email queue
    this.emailQueue = new Queue('email-queue', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD
      }
    });

    // Notification queue
    this.notificationQueue = new Queue('notification-queue', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD
      }
    });

    // Processing queue
    this.processingQueue = new Queue('processing-queue', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD
      }
    });

    this.setupQueueProcessors();
  }

  setupQueueProcessors() {
    this.emailQueue.process(async (job) => {
      try {
        logger.info(`Processing email job ${job.id}:`, job.data);
        return { success: true };
      } catch (error) {
        logger.error('Error processing email job:', error);
        throw error;
      }
    });

    this.notificationQueue.process(async (job) => {
      try {
        logger.info(`Processing notification job ${job.id}:`, job.data);
        return { success: true };
      } catch (error) {
        logger.error('Error processing notification job:', error);
        throw error;
      }
    });

    this.processingQueue.process(async (job) => {
      try {
        logger.info(`Processing job ${job.id}:`, job.data);
        return { success: true };
      } catch (error) {
        logger.error('Error processing job:', error);
        throw error;
      }
    });
  }

  async addEmailJob(data, options = {}) {
    try {
      return await this.emailQueue.add(data, {
        attempts: options.attempts || 3,
        backoff: options.backoff || { type: 'exponential', delay: 2000 },
        ...options
      });
    } catch (error) {
      logger.error('Error in addEmailJob:', error);
      throw error;
    }
  }

  async addNotificationJob(data, options = {}) {
    try {
      return await this.notificationQueue.add(data, {
        attempts: options.attempts || 3,
        backoff: options.backoff || { type: 'exponential', delay: 2000 },
        ...options
      });
    } catch (error) {
      logger.error('Error in addNotificationJob:', error);
      throw error;
    }
  }

  async addProcessingJob(data, options = {}) {
    try {
      return await this.processingQueue.add(data, {
        attempts: options.attempts || 3,
        backoff: options.backoff || { type: 'exponential', delay: 2000 },
        ...options
      });
    } catch (error) {
      logger.error('Error in addProcessingJob:', error);
      throw error;
    }
  }

  async getQueueStats() {
    try {
      const emailStats = {
        waiting: await this.emailQueue.getWaitingCount(),
        active: await this.emailQueue.getActiveCount(),
        completed: await this.emailQueue.getCompletedCount(),
        failed: await this.emailQueue.getFailedCount()
      };
      
      const notificationStats = {
        waiting: await this.notificationQueue.getWaitingCount(),
        active: await this.notificationQueue.getActiveCount(),
        completed: await this.notificationQueue.getCompletedCount(),
        failed: await this.notificationQueue.getFailedCount()
      };
      
      const processingStats = {
        waiting: await this.processingQueue.getWaitingCount(),
        active: await this.processingQueue.getActiveCount(),
        completed: await this.processingQueue.getCompletedCount(),
        failed: await this.processingQueue.getFailedCount()
      };

      return {
        email: emailStats,
        notifications: notificationStats,
        processing: processingStats
      };
    } catch (error) {
      logger.error('Error in getQueueStats:', error);
      throw error;
    }
  }
}

module.exports = new QueueService();