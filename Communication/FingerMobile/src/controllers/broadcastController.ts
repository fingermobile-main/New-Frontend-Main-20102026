import { Request, Response } from 'express';
import { BroadcastService } from '../services/broadcastService';

// Send a broadcast to all users
export const sendBroadcast = async (req: Request, res: Response) => {
  try {
    const { title, content, type, priority, targetAudience, includeOfflineUsers } = req.body;
    const senderId = (req as any).user?.id; // Assuming authentication middleware sets user
    
    const result = await BroadcastService.sendBroadcast({
      title,
      content,
      type,
      priority,
      targetAudience,
      includeOfflineUsers,
      senderId
    });
    
    res.status(200).json({
      success: true,
      message: 'Broadcast sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Error sending broadcast:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send broadcast',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};

// Get recipients for a broadcast
export const getBroadcastRecipients = async (req: Request, res: Response) => {
  try {
    const { targetAudience, filters } = req.body;
    
    const recipients = await BroadcastService.getBroadcastRecipients({
      targetAudience,
      filters
    });
    
    res.status(200).json({
      success: true,
      count: recipients.length,
      data: recipients
    });
  } catch (error) {
    console.error('Error getting broadcast recipients:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get broadcast recipients',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};

// Schedule a broadcast
export const scheduleBroadcast = async (req: Request, res: Response) => {
  try {
    const { title, content, type, priority, targetAudience, scheduledAt, timeZone } = req.body;
    const senderId = (req as any).user?.id; // Assuming authentication middleware sets user
    
    const scheduledBroadcast = await BroadcastService.scheduleBroadcast({
      title,
      content,
      type,
      priority,
      targetAudience,
      scheduledAt,
      timeZone,
      senderId
    });
    
    res.status(201).json({
      success: true,
      message: 'Broadcast scheduled successfully',
      data: scheduledBroadcast
    });
  } catch (error) {
    console.error('Error scheduling broadcast:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to schedule broadcast',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};

// Get active broadcasts
export const getActiveBroadcasts = async (req: Request, res: Response) => {
  try {
    const { status, type } = req.query;
    
    const activeBroadcasts = await BroadcastService.getActiveBroadcasts({
      status: status as string,
      type: type as string
    });
    
    res.status(200).json({
      success: true,
      count: activeBroadcasts.length,
      data: activeBroadcasts
    });
  } catch (error) {
    console.error('Error getting active broadcasts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get active broadcasts',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};

// Cancel a scheduled broadcast
export const cancelScheduledBroadcast = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;
    
    const cancelled = await BroadcastService.cancelScheduledBroadcast(idStr);
    
    if (!cancelled) {
      return res.status(404).json({
        success: false,
        message: 'Scheduled broadcast not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Scheduled broadcast cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling scheduled broadcast:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to cancel scheduled broadcast',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};