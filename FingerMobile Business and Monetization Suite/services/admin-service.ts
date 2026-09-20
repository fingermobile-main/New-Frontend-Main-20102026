export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'moderator' | 'support';
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAction {
  id: string;
  adminId: string;
  action: string;
  target: string;
  targetType: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface PlatformStats {
  totalUsers: number;
  totalAdmins: number;
  totalActions: number;
  activeUsers: number;
  registeredToday: number;
  systemUptime: string;
  lastUpdated: string;
}

interface SystemHealth {
  status: string;
  responseTime: string;
  memoryUsage: string;
  diskSpace: string;
  cpuLoad: string;
  lastChecked: string;
}

interface PlatformMetrics {
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  totalRevenue: number;
  conversionRate: string;
  sessionDuration: string;
  reported: string;
}

class AdminServiceClass {
  private admins: Map<string, AdminUser> = new Map();
  private actions: Map<string, AdminAction> = new Map();

  async getAdminById(adminId: string): Promise<AdminUser | null> {
    return this.admins.get(adminId) || null;
  }

  async createAdmin(admin: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminUser> {
    const newAdmin: AdminUser = {
      ...admin,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.admins.set(newAdmin.id, newAdmin);
    return newAdmin;
  }

  async logAdminAction(action: Omit<AdminAction, 'id' | 'timestamp'>): Promise<AdminAction> {
    const newAction: AdminAction = {
      ...action,
      id: Math.random().toString(36).substring(2, 15),
      timestamp: new Date().toISOString()
    };
    this.actions.set(newAction.id, newAction);
    return newAction;
  }

  async getAdminActions(adminId: string, limit: number = 50): Promise<AdminAction[]> {
    return Array.from(this.actions.values())
      .filter(action => action.adminId === adminId)
      .slice(0, limit);
  }

  async getPlatformStats(): Promise<PlatformStats> {
    // Get overall platform statistics
    return {
      totalUsers: Math.floor(Math.random() * 10000), // Simulated data
      totalAdmins: this.admins.size,
      totalActions: this.actions.size,
      activeUsers: Math.floor(Math.random() * 5000), // Simulated data
      registeredToday: Math.floor(Math.random() * 100), // Simulated data
      systemUptime: '99.9%', // Simulated data
      lastUpdated: new Date().toISOString()
    };
  }

  async getSystemHealth(): Promise<SystemHealth> {
    // Get system health metrics
    return {
      status: 'healthy',
      responseTime: `${Math.floor(Math.random() * 100) + 50}ms`, // Simulated data
      memoryUsage: `${Math.floor(Math.random() * 30) + 40}%`, // Simulated data
      diskSpace: '75% free', // Simulated data
      cpuLoad: `${Math.floor(Math.random() * 20) + 10}%`, // Simulated data
      lastChecked: new Date().toISOString()
    };
  }

  async getPlatformMetrics(): Promise<PlatformMetrics> {
    // Get various platform metrics
    return {
      dailyActiveUsers: Math.floor(Math.random() * 2000), // Simulated data
      monthlyActiveUsers: Math.floor(Math.random() * 8000), // Simulated data
      totalRevenue: Math.floor(Math.random() * 50000), // Simulated data
      conversionRate: `${(Math.random() * 5 + 2).toFixed(2)}%`, // Simulated data
      sessionDuration: `${Math.floor(Math.random() * 10) + 5}m`, // Simulated data
      reported: new Date().toISOString()
    };
  }

  async update(id: string, updateData: Partial<AdminUser>): Promise<AdminUser | null> {
    const existing = this.admins.get(id);
    if (!existing) return null;

    const updated: AdminUser = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    this.admins.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.admins.delete(id);
  }
}

export const AdminService = new AdminServiceClass();