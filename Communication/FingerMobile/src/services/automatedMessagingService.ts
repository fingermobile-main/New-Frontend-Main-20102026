import { BroadcastService } from './broadcastService';
import { richMediaService } from './richMediaService';
import { Communication } from '../models/Communication';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


export interface AutomatedMessageConfig {
  title: string;
  content: string;
  type: string;
  subtype?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetAudience: string;
  targetEntities?: string[];
  mediaAttachments?: string[];
  richContent?: any;
  metadata?: any;
  triggerEvent?: string; // What event triggered this message
  scheduledAt?: Date; // For scheduled automated messages
}

export interface GuardianMessageRequest {
  triggerType: 'user_action' | 'system_event' | 'scheduled' | 'ai_analysis';
  triggerSource: string; // User ID, system component, etc.
  messageTemplate: string; // Template ID or predefined message type
  targetUsers?: string[]; // Specific users to target
  targetGroups?: string[]; // Specific groups to target
  customData?: any; // Custom data to personalize the message
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export class AutomatedMessagingService {
  constructor(private broadcastService: typeof BroadcastService = BroadcastService) {}

  async sendAutomatedMessage(config: AutomatedMessageConfig): Promise<Communication> {
    // Use the broadcast service to send the automated message
    return await this.broadcastService.sendAutomatedMessage(
      'GUARDIAN_AI_SYSTEM',
      config
    );
  }

  async processGuardianTrigger(request: GuardianMessageRequest): Promise<Communication | null> {
    // Determine the appropriate message template based on trigger type
    const messageConfig = await this.generateMessageFromTemplate(request);
    
    if (!messageConfig) {
      console.warn(`No message template found for trigger: ${request.triggerType}`);
      return null;
    }

    // Send the automated message
    return await this.sendAutomatedMessage(messageConfig);
  }

  private async generateMessageFromTemplate(request: GuardianMessageRequest): Promise<AutomatedMessageConfig | null> {
    // This would typically load from a template system
    // For now, we'll implement some basic templates
    let title = '';
    let content = '';
    let type = 'automated';
    let priority: 'low' | 'medium' | 'high' | 'critical' = request.priority || 'medium';

    switch (request.messageTemplate) {
      case 'new_user_welcome':
        title = 'Welcome to FingerMobile!';
        content = `Hello! Welcome to FingerMobile. We're excited to have you join our community. Explore our features and enjoy your experience.`;
        type = 'welcome';
        priority = 'low';
        break;
        
      case 'security_alert':
        title = 'Security Alert';
        content = `We detected unusual activity on your account. Please review your recent activities and secure your account.`;
        type = 'alert';
        priority = 'high';
        break;
        
      case 'system_maintenance':
        title = 'Scheduled Maintenance';
        content = `We'll be performing scheduled maintenance on our systems. Some services may be temporarily unavailable.`;
        type = 'maintenance';
        priority = 'medium';
        break;
        
      case 'content_recommendation':
        title = 'Recommended for You';
        content = `Based on your interests, we've found some content that might interest you. Check it out now!`;
        type = 'recommendation';
        priority = 'low';
        break;
        
      case 'payment_confirmation':
        title = 'Payment Confirmation';
        content = `Your payment has been processed successfully. Thank you for your transaction.`;
        type = 'notification';
        priority = 'low';
        break;
        
      case 'community_update':
        title = 'Community Update';
        content = `There are new updates in your communities. Join the conversation now.`;
        type = 'notification';
        priority = 'medium';
        break;
        
      case 'ai_analysis':
        // Generate message dynamically using Google GenAI
        try {
          const prompt = `Generate a personalized communication message. 
          Context: ${JSON.stringify(request.customData || {})}
          Trigger Source: ${request.triggerSource}
          Make it sound like it's coming from Guardian SI (Sentient Intelligence), maintaining a helpful, secure, and professional tone. Return a JSON object with 'title', 'content', 'priority', and 'type' keys. 'priority' must be 'low', 'medium', 'high', or 'critical'.`;
          
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        title: { type: 'STRING' },
                        content: { type: 'STRING' },
                        type: { type: 'STRING' },
                        priority: { type: 'STRING', enum: ['low', 'medium', 'high', 'critical'] }
                    },
                    required: ['title', 'content', 'type', 'priority']
                }
            }
          });
          
          if (response.text) {
             const aiGenerated = JSON.parse(response.text);
             title = aiGenerated.title;
             content = aiGenerated.content;
             type = aiGenerated.type;
             priority = aiGenerated.priority as 'low' | 'medium' | 'high' | 'critical';
          } else {
             return null;
          }
        } catch (error) {
          console.error('Failed to generate AI message:', error);
          return null;
        }
        break;

      default:
        // For custom triggers, we might need to generate content dynamically
        if (request.customData) {
          title = request.customData.title || 'System Notification';
          content = request.customData.content || 'You have received a new notification.';
          type = request.customData.type || 'automated';
          priority = request.priority || 'medium';
        } else {
          return null; // No template found
        }
    }

    // Personalize the message if custom data is provided
    if (request.customData) {
      content = this.personalizeMessage(content, request.customData);
    }

    // Determine target audience based on request
    let targetAudience = 'all';
    let targetEntities: string[] = [];

    if (request.targetUsers && request.targetUsers.length > 0) {
      targetAudience = `individual:${request.targetUsers[0]}`; // For individual messages
      targetEntities = request.targetUsers;
    } else if (request.targetGroups && request.targetGroups.length > 0) {
      targetAudience = `group:${request.targetGroups[0]}`; // For group messages
      targetEntities = request.targetGroups;
    }

    return {
      title,
      content,
      type,
      subtype: 'automated',
      priority,
      targetAudience,
      targetEntities,
      triggerEvent: request.triggerType,
      metadata: {
        triggerSource: request.triggerSource,
        triggerType: request.triggerType,
        generatedAt: new Date(),
        customData: request.customData
      }
    };
  }

  private personalizeMessage(template: string, data: any): string {
    // Simple template replacement
    let personalizedMessage = template;
    
    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{{${key}}}`;
      if (personalizedMessage.includes(placeholder)) {
        personalizedMessage = personalizedMessage.replace(new RegExp(placeholder, 'g'), String(value));
      }
    }
    
    return personalizedMessage;
  }

  async scheduleAutomatedMessage(config: AutomatedMessageConfig & { scheduledAt: Date }): Promise<Communication> {
    // Create a scheduled communication using the broadcast service
    return await this.broadcastService.scheduleBroadcast({
      title: config.title,
      content: config.content,
      type: config.type,
      subtype: config.subtype,
      priority: config.priority,
      targetAudience: config.targetAudience,
      targetEntities: config.targetEntities,
      scheduledAt: config.scheduledAt,
      mediaAttachments: config.mediaAttachments,
      richContent: config.richContent,
      metadata: config.metadata,
      senderId: 'GUARDIAN_AI_SCHEDULER'
    });
  }

  async sendTargetedAutomatedMessage(
    targetUsers: string[],
    messageConfig: Omit<AutomatedMessageConfig, 'targetAudience'>
  ): Promise<Communication[]> {
    const results: Communication[] = [];

    // Send individual messages to each user
    for (const userId of targetUsers) {
      const configWithTarget = {
        ...messageConfig,
        targetAudience: `individual:${userId}`,
        targetEntities: [userId]
      };

      const result = await this.sendAutomatedMessage(configWithTarget);
      results.push(result);
    }

    return results;
  }

  async sendContentSpecificMessage(
    contentType: 'blog' | 'gem' | 'hallmark' | 'seishe' | 'mii' | 'community' | 'group',
    contentId: string,
    messageConfig: Omit<AutomatedMessageConfig, 'targetAudience' | 'targetEntities'>
  ): Promise<Communication> {
    return await this.sendAutomatedMessage({
      ...messageConfig,
      targetAudience: `content_specific`,
      targetEntities: [`${contentType}:${contentId}`]
    });
  }

  async sendBulkAutomatedMessages(
    messageConfigs: AutomatedMessageConfig[]
  ): Promise<Communication[]> {
    const results: Communication[] = [];
    
    for (const config of messageConfigs) {
      try {
        const result = await this.sendAutomatedMessage(config);
        results.push(result);
      } catch (error) {
        console.error('Failed to send automated message:', error);
        // Continue with other messages
      }
    }
    
    return results;
  }

  async processScheduledAutomatedMessages(): Promise<void> {
    // This would typically run as a background job
    // Find scheduled automated messages and send them
    console.log('Processing scheduled automated messages...');
    
    // In a real implementation, this would query for scheduled messages
    // that are due and process them accordingly
  }
}

// Export singleton instance
export const automatedMessagingService = new AutomatedMessagingService();