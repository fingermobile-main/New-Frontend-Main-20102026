/**
 * rbacService.ts
 * Enterprise Role-Based Access Control (RBAC) service for FingerMobile Protocol
 */

import { api } from './api';

export interface Role {
  id: string;
  name: string;
  title?: string;
  description?: string;
  responsibility?: string;
  level: number;
  is_system?: boolean;
  permissions?: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource_type: string;
  action: string;
}

export interface Department {
  id: string;
  name: string;
  members: number;
  features: number;
}

export interface FranchiseLocation {
  id: string;
  name: string;
  type?: 'continent' | 'country' | 'state' | 'region';
  children?: FranchiseLocation[];
}

export interface CreateRolePayload {
  name?: string;
  title?: string;
  description?: string;
  responsibility?: string;
  level?: number;
  is_system?: boolean;
}

class RbacService {
  /**
   * Fetch all roles from PostgreSQL
   */
  async getRoles(): Promise<Role[]> {
    const response = await api.get<{ success: boolean; roles: Role[] }>('/admin/rbac/roles');
    const roles = response.data?.roles || (Array.isArray(response.data) ? response.data : []);
    return roles.map(r => ({
      ...r,
      title: r.title || r.name,
      responsibility: r.responsibility || r.description || 'System role access'
    }));
  }

  /**
   * Create a new role
   */
  async createRole(payload: CreateRolePayload): Promise<Role> {
    const response = await api.post<{ success: boolean; role: Role }>('/admin/rbac/roles', payload);
    const role = response.data?.role || (response.data as any);
    return {
      ...role,
      title: role.title || role.name,
      responsibility: role.responsibility || role.description
    };
  }

  /**
   * Assign a role to a user
   */
  async assignRole(userId: string | number, role: string): Promise<{ success: boolean; user: any }> {
    const response = await api.post<{ success: boolean; user: any }>('/admin/rbac/assign', {
      userId,
      role
    });
    return response.data;
  }

  /**
   * Get permissions catalogue
   */
  async getPermissions(): Promise<Permission[]> {
    const response = await api.get<{ success: boolean; permissions: Permission[] }>('/admin/rbac/permissions');
    return response.data?.permissions || (Array.isArray(response.data) ? response.data : []);
  }

  /**
   * Get departments hierarchy
   */
  async getDepartments(): Promise<Department[]> {
    const response = await api.get<Department[]>('/admin/rbac/departments');
    return Array.isArray(response.data) ? response.data : [];
  }

  /**
   * Get franchise ecosystem nodes
   */
  async getFranchiseLocations(): Promise<FranchiseLocation[]> {
    const response = await api.get<FranchiseLocation[]>('/admin/rbac/franchise-locations');
    return Array.isArray(response.data) ? response.data : [];
  }
}

export const rbacService = new RbacService();
export default rbacService;
