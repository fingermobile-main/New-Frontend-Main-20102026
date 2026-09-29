import { db } from '../database.js';

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
  registeredToday: string;
  systemUptime: string;
  lastUpdated: string;
}

interface SystemHealth {
  status: string;
  memoryUsage: string;
  diskSpace: string;
  cpuLoad: string;
  lastChecked: string;
}

interface PlatformMetrics {
  totalRevenue: number;
  totalApplications: number;
  totalVerifications: number;
  totalPayoutAccounts: number;
  reported: string;
}

function mapAdmin(row: Record<string, unknown>): AdminUser {
  return {
    id: row.id as string,
    username: row.username as string,
    email: row.email as string,
    role: row.role as AdminUser['role'],
    permissions: row.permissions_json ? JSON.parse(row.permissions_json as string) : [],
    isActive: Boolean(row.is_active),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  };
}

function mapAction(row: Record<string, unknown>): AdminAction {
  return {
    id: row.id as string,
    adminId: row.admin_id as string,
    action: row.action as string,
    target: row.target as string,
    targetType: row.target_type as string,
    timestamp: row.timestamp as string,
    metadata: row.metadata_json ? JSON.parse(row.metadata_json as string) : undefined
  };
}

class AdminServiceClass {
  getAdminById(adminId: string): AdminUser | null {
    const row = db.prepare('SELECT * FROM admins WHERE id = ?').get(adminId) as Record<string, unknown> | undefined;
    return row ? mapAdmin(row) : null;
  }

  createAdmin(admin: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>): AdminUser {
    const id = `admin-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    db.prepare(`
      INSERT INTO admins (id, username, email, role, permissions_json, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, admin.username, admin.email, admin.role, JSON.stringify(admin.permissions), admin.isActive ? 1 : 0);
    return this.getAdminById(id)!;
  }

  logAdminAction(action: Omit<AdminAction, 'id' | 'timestamp'>): AdminAction {
    const id = `act-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    db.prepare(`
      INSERT INTO admin_actions (id, admin_id, action, target, target_type, metadata_json)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      id, action.adminId, action.action, action.target, action.targetType,
      action.metadata ? JSON.stringify(action.metadata) : null
    );
    const row = db.prepare('SELECT * FROM admin_actions WHERE id = ?').get(id) as Record<string, unknown>;
    return mapAction(row);
  }

  getAdminActions(adminId: string, limit = 50): AdminAction[] {
    const rows = db.prepare(
      'SELECT * FROM admin_actions WHERE admin_id = ? ORDER BY timestamp DESC LIMIT ?'
    ).all(adminId, limit) as Record<string, unknown>[];
    return rows.map(mapAction);
  }

  getPlatformStats(): PlatformStats {
    const { total: totalUsers } = db.prepare('SELECT COUNT(*) as total FROM users').get() as { total: number };
    const { total: totalAdmins } = db.prepare('SELECT COUNT(*) as total FROM admins WHERE is_active = 1').get() as { total: number };
    const { total: totalActions } = db.prepare('SELECT COUNT(*) as total FROM admin_actions').get() as { total: number };
    const { total: activeUsers } = db.prepare("SELECT COUNT(*) as total FROM users WHERE status = 'active'").get() as { total: number };
    return {
      totalUsers,
      totalAdmins,
      totalActions,
      activeUsers,
      registeredToday: new Date().toISOString().split('T')[0],
      systemUptime: 'N/A',
      lastUpdated: new Date().toISOString()
    };
  }

  getSystemHealth(): SystemHealth {
    const memoryUsage = process.memoryUsage();
    const usedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const totalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    return {
      status: 'healthy',
      memoryUsage: `${usedMB}/${totalMB}MB`,
      diskSpace: 'N/A',
      cpuLoad: 'N/A',
      lastChecked: new Date().toISOString()
    };
  }

  getPlatformMetrics(): PlatformMetrics {
    const { total: totalRevenue } = db.prepare(
      "SELECT COALESCE(SUM(amount),0) as total FROM revenue_ledger WHERE status = 'completed'"
    ).get() as { total: number };
    const { total: totalApplications } = db.prepare('SELECT COUNT(*) as total FROM monetization_applications').get() as { total: number };
    const { total: totalVerifications } = db.prepare('SELECT COUNT(*) as total FROM business_verifications').get() as { total: number };
    const { total: totalPayoutAccounts } = db.prepare('SELECT COUNT(*) as total FROM payout_accounts').get() as { total: number };
    return {
      totalRevenue,
      totalApplications,
      totalVerifications,
      totalPayoutAccounts,
      reported: new Date().toISOString()
    };
  }

  update(id: string, updateData: Partial<AdminUser>): AdminUser | null {
    const existing = this.getAdminById(id);
    if (!existing) return null;
    const fields: string[] = [];
    const vals: unknown[] = [];
    if (updateData.username !== undefined) { fields.push('username = ?'); vals.push(updateData.username); }
    if (updateData.email !== undefined) { fields.push('email = ?'); vals.push(updateData.email); }
    if (updateData.role !== undefined) { fields.push('role = ?'); vals.push(updateData.role); }
    if (updateData.permissions !== undefined) { fields.push('permissions_json = ?'); vals.push(JSON.stringify(updateData.permissions)); }
    if (updateData.isActive !== undefined) { fields.push('is_active = ?'); vals.push(updateData.isActive ? 1 : 0); }
    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      vals.push(id);
      db.prepare(`UPDATE admins SET ${fields.join(', ')} WHERE id = ?`).run(...vals);
    }
    return this.getAdminById(id);
  }

  delete(id: string): void {
    db.prepare('DELETE FROM admins WHERE id = ?').run(id);
  }
}

export const AdminService = new AdminServiceClass();