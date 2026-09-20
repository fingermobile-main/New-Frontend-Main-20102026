import { Request, Response } from 'express';
import { CommunicationService } from '../services/communicationService';
import { BroadcastService } from '../services/broadcastService';
import { automatedMessagingService } from '../services/automatedMessagingService';
import { richMediaService } from '../services/richMediaService';

// Get all communications with enhanced filtering
export const getEnhancedCommunications = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, type, subtype, status, targetAudience, sortBy, sortOrder } = req.query;
    
    const result = await CommunicationService.getCommunications({
      page: Number(page),
      limit: Number(limit),
      type: type as string,
      subtype: subtype as string,
      status: status as string,
      targetAudience: targetAudience as string
    });
    
    // Add sorting if specified
    if (sortBy && sortOrder) {
      // Sorting would be handled in the service layer in a real implementation
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting enhanced communications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve communications',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};

// Create a new enhanced communication with rich content and media
export const createEnhancedCommunication = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      content, 
      type, 
      subtype, 
      priority, 
      targetAudience, 
      targetEntities, 
      scheduledAt, 
      mediaAttachments, 
      richContent, 
      metadata 
    } = req.body;
    
    const createdBy = (req as any).user?.id; // Assuming authentication middleware sets user
    
    // Process rich content if provided
    let processedRichContent = richContent;
    if (content && !processedRichContent) {
      processedRichContent = await richMediaService.processRichText(content);
    }
    
    const newCommunication = await CommunicationService.createCommunication({
      title,
      content,
      type,
      subtype,
      priority,
      targetAudience,
      targetEntities,
      scheduledAt,
      mediaAttachments,
      richContent: processedRichContent,
      metadata,
      createdBy
    });
    
    res.status(201).json({
      success: true,
      message: 'Enhanced communication created successfully',
      data: newCommunication
    });
  } catch (error) {
    console.error('Error creating enhanced communication:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create communication',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};

// Send targeted message to specific user types (Blogs, Gems, Hallmarks, etc.)
export const sendTargetedMessage = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      content, 
      type, 
      subtype, 
      priority, 
      targetAudience, 
      targetEntities, // Specific entities like blog IDs, gem IDs, hallmark IDs, etc.
      mediaAttachments, 
      richContent, 
      metadata 
    } = req.body;
    
    const senderId = (req as any).user?.id; // Assuming authentication middleware sets user
    
    const result = await BroadcastService.sendTargetedMessage({
      title,
      content,
      type,
      subtype,
      priority,
      targetAudience,
      targetEntities,
      mediaAttachments,
      richContent,
      metadata,
      senderId
    });
    
    res.status(200).json({
      success: true,
      message: 'Targeted message sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Error sending targeted message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send targeted message',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};

// Send automated message from Guardian/AI system
export const sendAutomatedMessage = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      content, 
      type, 
      subtype, 
      priority, 
      targetAudience, 
      targetEntities, 
      mediaAttachments, 
      richContent, 
      metadata,
      triggerEvent
    } = req.body;
    
    const result = await automatedMessagingService.sendAutomatedMessage({
      title,
      content,
      type,
      subtype,
      priority,
      targetAudience,
      targetEntities,
      mediaAttachments,
      richContent,
      metadata,
      triggerEvent
    });
    
    res.status(200).json({
      success: true,
      message: 'Automated message sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Error sending automated message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send automated message',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};

// Get communication statistics
export const getCommunicationStats = async (req: Request, res: Response) => {
  try {
    const stats = await CommunicationService.getCommunicationStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting communication stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve communication stats',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};

// Schedule automated message
export const scheduleAutomatedMessage = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      content, 
      type, 
      subtype, 
      priority, 
      targetAudience, 
      targetEntities, 
      scheduledAt, 
      mediaAttachments, 
      richContent, 
      metadata
    } = req.body;
    
    if (!scheduledAt) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled time is required for automated messages'
      });
    }
    
    const result = await automatedMessagingService.scheduleAutomatedMessage({
      title,
      content,
      type,
      subtype,
      priority,
      targetAudience,
      targetEntities,
      mediaAttachments,
      richContent,
      metadata,
      scheduledAt: new Date(scheduledAt)
    });
    
    res.status(201).json({
      success: true,
      message: 'Automated message scheduled successfully',
      data: result
    });
  } catch (error) {
    console.error('Error scheduling automated message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to schedule automated message',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};

// Process Guardian AI trigger
export const processGuardianTrigger = async (req: Request, res: Response) => {
  try {
    const { triggerType, triggerSource, messageTemplate, targetUsers, targetGroups, customData, priority } = req.body;
    
    const result = await automatedMessagingService.processGuardianTrigger({
      triggerType,
      triggerSource,
      messageTemplate,
      targetUsers,
      targetGroups,
      customData,
      priority
    });
    
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Guardian trigger processed successfully',
        data: result
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No message template found for the given trigger'
      });
    }
  } catch (error) {
    console.error('Error processing guardian trigger:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process guardian trigger',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};