import apiService from './apiService';
import logger from '../utils/logger';

export interface EmailDispatchPayload {
  to: string;
  subject: string;
  body: string;
  templateSlug?: string;
  data?: Record<string, any>;
}

export interface EmailDispatchResult {
  success: boolean;
  message?: string;
  data?: {
    success: boolean;
    messageId?: string;
    provider?: string;
    recipient?: string;
  };
}

/**
 * Unified Enterprise Email Service - FingerMobile Protocol™
 * Connected directly to backend Express `/api/email/send` and Plunk/SMTP infrastructure.
 */
export const emailService = {
  sendEmail: async (
    to: string,
    subject: string,
    body: string,
    templateSlug: string = 'welcome',
    data: Record<string, any> = {}
  ): Promise<EmailDispatchResult> => {
    try {
      const response = await apiService.post<EmailDispatchResult>('/api/email/send', {
        to,
        subject,
        body,
        templateSlug,
        data
      });
      return response;
    } catch (error: any) {
      logger.error('Email dispatch error via apiService:', error);
      throw error;
    }
  }
};

export default emailService;
