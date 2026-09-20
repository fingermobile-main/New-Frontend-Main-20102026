import { Request, Response } from 'express';
import { automatedMessagingService, GuardianMessageRequest } from '../services/automatedMessagingService';

export class GuardianController {
  
  /**
   * Triggers an automated message from Guardian SI
   */
  async triggerAlert(req: Request, res: Response) {
    try {
      // In a real application, we would check for a valid service-to-service API key or JWT token
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== 'Bearer GUARDIAN_INTERNAL_SECURE_TOKEN_2026') {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid Service Token' });
      }

      const guardianRequest: GuardianMessageRequest = req.body;

      if (!guardianRequest.triggerType || !guardianRequest.messageTemplate) {
        return res.status(400).json({ success: false, message: 'Missing required fields: triggerType or messageTemplate' });
      }

      const result = await automatedMessagingService.processGuardianTrigger(guardianRequest);

      if (!result) {
        return res.status(400).json({ success: false, message: 'Failed to process Guardian trigger: No matching template found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Guardian alert processed successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Error in GuardianController triggerAlert:', error);
      return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
  }
}

export const guardianController = new GuardianController();
