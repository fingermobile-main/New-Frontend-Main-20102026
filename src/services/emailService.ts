import logger from '../utils/logger';

// Email Service - Stub
export const emailService = {
  sendEmail: async (
    to: string,
    subject: string,
    body: string
  ) => {
    try {
      console.info('Email service, stub:', { to, subject });
      return { success: true };
    } catch (error) {
      logger.error('Anonymous email error:', error);
      throw error;
    }
  }
};
