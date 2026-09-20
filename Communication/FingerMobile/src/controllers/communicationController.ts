import { Request, Response } from 'express';
import { CommunicationService } from '../services/communicationService';

// Get all communications
export const getCommunications = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    
    const result = await CommunicationService.getCommunications({
      page: Number(page),
      limit: Number(limit),
      type: type as string,
      status: status as string
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting communications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve communications',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};

// Create a new communication
export const createCommunication = async (req: Request, res: Response) => {
  try {
    const { title, content, type, priority, targetAudience, scheduledAt } = req.body;
    const createdBy = (req as any).user?.id; // Assuming authentication middleware sets user
    
    const newCommunication = await CommunicationService.createCommunication({
      title,
      content,
      type,
      priority,
      targetAudience,
      scheduledAt,
      createdBy
    });
    
    res.status(201).json({
      success: true,
      message: 'Communication created successfully',
      data: newCommunication
    });
  } catch (error) {
    console.error('Error creating communication:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create communication',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};

// Update a communication
export const updateCommunication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;
    const updateData = req.body;
    
    const updatedCommunication = await CommunicationService.updateCommunication(idStr, updateData);
    
    if (!updatedCommunication) {
      return res.status(404).json({
        success: false,
        message: 'Communication not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Communication updated successfully',
      data: updatedCommunication
    });
  } catch (error) {
    console.error('Error updating communication:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update communication',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};

// Delete a communication
export const deleteCommunication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;
    
    const deleted = await CommunicationService.deleteCommunication(idStr);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Communication not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Communication deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting communication:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete communication',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};

// Get broadcast history
export const getBroadcastHistory = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, type } = req.query;
    
    const result = await CommunicationService.getBroadcastHistory({
      page: Number(page),
      limit: Number(limit),
      startDate: startDate as string,
      endDate: endDate as string,
      type: type as string
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting broadcast history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve broadcast history',
      error: (error as Error).message 
    });
  }
  return; // Ensure all code paths return a value
};