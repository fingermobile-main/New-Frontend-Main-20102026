import { Communication } from '../models/Communication';
import { Op, fn, col } from 'sequelize';

export interface CommunicationFilters {
  page: number;
  limit: number;
  type?: string;
  status?: string;
  subtype?: string;
  targetAudience?: string;
}

export interface CreateCommunicationDto {
  title: string;
  content: string;
  type: string;
  subtype?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetAudience: string;
  targetEntities?: string[];
  scheduledAt?: Date;
  mediaAttachments?: string[];
  richContent?: any;
  metadata?: any;
  createdBy: string;
}

export interface BroadcastHistoryFilters {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
  type?: string;
  subtype?: string;
}

class CommunicationServiceImpl {
  async getCommunications(filters: CommunicationFilters): Promise<{ 
    data: Communication[]; 
    pagination: { page: number; limit: number; total: number; totalPages: number } 
  }> {
    // Calculate pagination
    const offset = (filters.page - 1) * filters.limit;
    
    // Build where clause based on filters
    const whereClause: any = {};
    if (filters.type) {
      whereClause.type = filters.type;
    }
    if (filters.status) {
      whereClause.status = filters.status;
    }
    if (filters.subtype) {
      whereClause.subtype = filters.subtype;
    }
    if (filters.targetAudience) {
      whereClause.targetAudience = filters.targetAudience;
    }
    
    // Find communications with pagination
    const communications = await Communication.findAll({
      where: whereClause,
      limit: filters.limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    // Count total records for pagination
    const total = await Communication.count({ where: whereClause });
    const totalPages = Math.ceil(total / filters.limit);
    
    return {
      data: communications,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages
      }
    };
  }

  async createCommunication(data: CreateCommunicationDto): Promise<Communication> {
    const newCommunication = await Communication.create({
      title: data.title,
      content: data.content,
      type: data.type,
      subtype: data.subtype,
      priority: data.priority,
      targetAudience: data.targetAudience,
      targetEntities: data.targetEntities || [],
      status: data.scheduledAt ? 'scheduled' : 'draft',
      scheduledAt: data.scheduledAt,
      mediaAttachments: data.mediaAttachments || [],
      richContent: data.richContent,
      metadata: data.metadata,
      createdBy: data.createdBy
    });

    return newCommunication;
  }

  async updateCommunication(id: string, updateData: Partial<Communication>): Promise<Communication | null> {
    const communication = await Communication.findByPk(id);
    
    if (!communication) {
      return null;
    }
    
    await communication.update(updateData);
    return communication;
  }

  async deleteCommunication(id: string): Promise<boolean> {
    const communication = await Communication.findByPk(id);
    
    if (!communication) {
      return false;
    }
    
    await communication.destroy();
    return true;
  }

  async getBroadcastHistory(filters: BroadcastHistoryFilters): Promise<{ 
    data: Communication[]; 
    pagination: { page: number; limit: number; total: number; totalPages: number } 
  }> {
    // Calculate pagination
    const offset = (filters.page - 1) * filters.limit;
    
    // Build where clause for sent communications only
    const whereClause: any = { status: 'sent' };
    
    if (filters.type) {
      whereClause.type = filters.type;
    }
    
    if (filters.subtype) {
      whereClause.subtype = filters.subtype;
    }
    
    if (filters.startDate) {
      whereClause.sentAt = { ...whereClause.sentAt, [Op.gte]: new Date(filters.startDate) };
    }
    
    if (filters.endDate) {
      whereClause.sentAt = whereClause.sentAt || {};
      whereClause.sentAt[Op.lte] = new Date(filters.endDate);
    }
    
    // Find communications with pagination
    const communications = await Communication.findAll({
      where: whereClause,
      limit: filters.limit,
      offset,
      order: [['sentAt', 'DESC']]
    });
    
    // Count total records for pagination
    const total = await Communication.count({ where: { ...whereClause, status: 'sent' } });
    const totalPages = Math.ceil(total / filters.limit);
    
    return {
      data: communications,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages
      }
    };
  }

  async getCommunicationStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    todaySent: number;
  }> {
    const total = await Communication.count();
    
    // Get counts by type
    const byTypeQuery = await Communication.findAll({
      attributes: ['type', [fn('COUNT', col('type')), 'count']],
      group: ['type']
    });
    const byType = byTypeQuery.reduce((acc: Record<string, number>, item: any) => {
      acc[item.type] = Number(item.dataValues.count);
      return acc;
    }, {});
    
    // Get counts by status
    const byStatusQuery = await Communication.findAll({
      attributes: ['status', [fn('COUNT', col('status')), 'count']],
      group: ['status']
    });
    const byStatus = byStatusQuery.reduce((acc: Record<string, number>, item: any) => {
      acc[item.status] = Number(item.dataValues.count);
      return acc;
    }, {});
    
    // Get counts by priority
    const byPriorityQuery = await Communication.findAll({
      attributes: ['priority', [fn('COUNT', col('priority')), 'count']],
      group: ['priority']
    });
    const byPriority = byPriorityQuery.reduce((acc: Record<string, number>, item: any) => {
      acc[item.priority] = Number(item.dataValues.count);
      return acc;
    }, {});
    
    // Get today's sent count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaySent = await Communication.count({
      where: {
        status: 'sent',
        sentAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      }
    });
    
    return {
      total,
      byType,
      byStatus,
      byPriority,
      todaySent
    };
  }
}

export const CommunicationService = new CommunicationServiceImpl();