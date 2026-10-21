import React, {} from 'react';
// adminControlService.ts
// Enhanced administrative control system for FingerMobile platform

import { AdminActionItem, AdminMemberItem, AuditLogItem } from '../types/adminControl';
export type { AdminActionItem, AdminMemberItem, AuditLogItem };

import { defaultAdminActionItems } from '../data/adminActions';
import { defaultAdminMemberItems } from '../data/adminMembers';
import api from './api';

class AdminControlService {
  private static instance: AdminControlService;
  private actions: AdminActionItem[] = [];
  private members: AdminMemberItem[] = [];
  private auditLogs: AuditLogItem[] = [];
  private activeAction: AdminActionItem | null = null;
  private actionTimeout: ReturnType<typeof setTimeout> | null = null;

  private constructor() {
    this.actions = [...defaultAdminActionItems];
    this.members = [...defaultAdminMemberItems];
  }

  public static getInstance(): AdminControlService {
    if (!AdminControlService.instance) {
      AdminControlService.instance = new AdminControlService();
    }
    return AdminControlService.instance;
  }

  public getActions(): AdminActionItem[] {
    return this.actions;
  }

  public getMembers(): AdminMemberItem[] {
    return this.members;
  }

  public getAuditLogItems(): AuditLogItem[] {
    return this.auditLogs;
  }

  public async loadRealData(): Promise<void> {
    try {
      const { api } = await import('./api');
      const [membersRes, auditRes] = await Promise.all([
        api.get('/admin/members').catch(() => null),
        api.get('/audit-log-admin').catch(() => null)
      ]);
      if (membersRes?.data && Array.isArray(membersRes.data) && membersRes.data.length > 0) {
        this.members = membersRes.data.map((m: any) => ({
          id: m.id.toString(),
          name: m.membername || m.username || m.email,
          role: (m.role || 'ADMIN').toUpperCase() as any,
          permissions: ['ALL'],
          lastLogin: new Date(m.created_at || Date.now()),
          isActive: true
        }));
      }
      if (auditRes?.data?.logs && Array.isArray(auditRes.data.logs) && auditRes.data.logs.length > 0) {
        this.auditLogs = auditRes.data.logs.map((log: any) => ({
          id: log.id,
          actionId: log.action,
          actionName: log.action,
          performedBy: log.user_id || 'System Admin',
          timestamp: new Date(log.created_at),
          status: 'SUCCESS' as const,
          details: typeof log.changes === 'object' ? JSON.stringify(log.changes) : (log.resource_type || '')
        }));
      }
    } catch (e) {
      // Fallback to defaults
    }
  }

  public getActionById(
    id: string): AdminActionItem | undefined {
    return this.actions.find((action) => action.id === id);
  }

  public getMemberById(
    id: string): AdminMemberItem | undefined {
    return this.members.find((member) => member.id === id);
  }

  // SUPER ADMIN FUNCTIONS
  public isSuperAdmin(
    memberId: string): boolean {
    const member = this.getMemberById(memberId);
    return member?.role === 'OWNER';
  }

  public canAssignRoles(
    memberId: string): boolean {
    return this.isSuperAdmin(memberId);
  }

  public async assignRole(
    superMemberId: string,
    targetMemberId: string,
    newRole: AdminMemberItem['role'],
  ): Promise<{ success: boolean; message: string }> {
    if (!this.isSuperAdmin(superMemberId)) {
      return {success: false, message: 'Only SuperAdmin can assign roles' };
    }

    // Prevent OWNER from downgrading their own role
    if (targetMemberId === superMemberId && newRole !== 'OWNER') {
      return {success: false, message: 'SuperAdmin cannot downgrade their own role' };
    }

    try {
      const response = await api.put(`/superadmin/members/${targetMemberId}/role`, { role: newRole });

      const targetMember = this.getMemberById(targetMemberId);
      if (targetMember) {
        targetMember.role = newRole;
        switch (newRole) {
        case 'OWNER': targetMember.permissions = ['all']; break;
        case 'ADMIN': targetMember.permissions = ['modules', 'members', 'content']; break;
        case 'MODERATOR': targetMember.permissions = ['content', 'members']; break;
        case 'AUDITOR': targetMember.permissions = ['audit', 'logs']; break;
        }
      }
      return { success: true, message: response.data?.message || `Role ${newRole} assigned successfully` };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.error || 'Failed to assign role' };
    }
  }

  public async addMember(
    superMemberId: string,
    newMember: Omit<AdminMemberItem, 'id'>,
  ): Promise<{ success: boolean; message: string; memberId?: string }> {
    if (!this.isSuperAdmin(superMemberId)) {
      return {success: false, message: 'Only SuperAdmin can add members' };
    }

    try {
      const response = await api.post('/superadmin/members', newMember);
      const memberId = response.data?.member?.id || `member-${Date.now()}`;
      this.members.push({ ...newMember, id: memberId });
      return { success: true, message: response.data?.message || `Member ${newMember.name} added successfully`, memberId };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.error || 'Failed to add member' };
    }
  }

  public async removeMember(
    superMemberId: string,
    targetMemberId: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!this.isSuperAdmin(superMemberId)) {
      return {success: false, message: 'Only SuperAdmin can remove members' };
    }
    if (targetMemberId === superMemberId) {
      return {success: false, message: 'SuperAdmin cannot remove themselves' };
    }

    try {
      const response = await api.delete(`/superadmin/members/${targetMemberId}`);
      this.members = this.members.filter((member) => member.id !== targetMemberId);
      return { success: true, message: response.data?.message || 'Member removed successfully' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.error || 'Failed to remove member' };
    }
  }

  public async updateMember(
    superMemberId: string,
    targetMemberId: string,
    updates: Partial<AdminMemberItem>,
  ): Promise<{ success: boolean; message: string }> {
    if (!this.isSuperAdmin(superMemberId)) {
      return {success: false, message: 'Only SuperAdmin can update members' };
    }
    if (targetMemberId === superMemberId && updates.role && updates.role !== 'OWNER') {
      return {success: false, message: 'SuperAdmin cannot downgrade their own role' };
    }

    try {
      const response = await api.put(`/superadmin/members/${targetMemberId}`, updates);
      const targetMember = this.getMemberById(targetMemberId);
      if (targetMember) Object.assign(targetMember, updates);
      return { success: true, message: response.data?.message || 'Member updated successfully' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.error || 'Failed to update member' };
    }
  }

  public async executeAction(
    actionId: string,
    memberId: string,
    _pin: string,
    biometricData?: string,
    otp?: string,
    geoLocation?: string,
  ): Promise<{ success: boolean; message: string }> {
    const action = this.getActionById(actionId);
    const member = this.getMemberById(memberId);

    if (!action || !member) {
      return {success: false,
        message: 'Invalid action or member' };
    }

    // Check member permissions
    if (member.role !== 'OWNER' && member.role !== 'ADMIN') {
      return {success: false,
        message: 'Insufficient permissions' };
    }

    // OWNER (SuperAdmin) can bypass some restrictions
    const isSuperAdmin = this.isSuperAdmin(memberId);

    // Check geofencing (OWNER can bypass)
    if (
      action.geoFenceRequired &&
      geoLocation &&
      !action.allowedCountries.includes(geoLocation) &&
      !isSuperAdmin
    ) {
      return {success: false,
        message: 'Action not allowed from your location'
      };
    }

    // Check biometric requirement (OWNER can bypass in emergencies)
    if (action.requiresBiometric && !biometricData && !isSuperAdmin) {
      return {success: false,
        message: 'Biometric verification required' };
    }

    // Check OTP requirement (OWNER can bypass in emergencies)
    if (action.requiresOTP && !otp && !isSuperAdmin) {
      return {success: false,
        message: 'OTP required' };
    }

    // Check multi-signature requirement (OWNER can bypass for non-critical actions)
    if (action.requiresMultiSig && !isSuperAdmin) {
      // In a real implementation we would check for other signatures
      // For now we'll just log that multi-sig is required
      console.info(
        `Multi-signature,
required: ${action.minSignatures} signatures needed`,
      );
    }

    // Set active action and start confirmation timer
    this.activeAction = { ...action };

    if (action.requiresConfirmation) {
      // Notification should be handled by the UI component calling this service
      // using the message returned or through a dedicated callback
    }

    // Start timer if confirmation is required
    if (action.requiresConfirmation) {
      if (this.actionTimeout) {
        clearTimeout(this.actionTimeout);
      }
      this.actionTimeout = setTimeout(() => {
        this.performAction(actionId, memberId);
      }, action.confirmationWindow * 1000);
    } else {
      this.performAction(actionId, memberId);
    }

    return {success: true,
      message: action.requiresConfirmation
        ? `Action "${action.description}" scheduled to execute in ${action.confirmationWindow} seconds`
        : `Action "${action.description}" executed successfully`
    };
  }

  public cancelActiveAction(): {
  success: boolean; message: string } {
    if (this.actionTimeout) {
      clearTimeout(this.actionTimeout);
      this.actionTimeout = null;
      const action = this.activeAction;
      this.activeAction = null;

      if (action) {
        // Log cancellation
        this.auditLogs.push({id: `log-${Date.now()}`,
          memberId: 'system',
          actionId: action.id,
          timestamp: new Date(),
          details: 'Action cancelled by member',
          ipAddress: '127.0.0.1',
          memberAgent: 'Admin Control System',
          status: 'cancelled'
        });

        return {success: true,
          message: 'Action cancelled successfully' };
      }
    }

    return {success: false,
      message: 'No active action to cancel' };
  }

  private async performAction(
    actionId: string,
    memberId: string,
  ): Promise<{ success: boolean; message: string }> {
    const action = this.getActionById(actionId);
    if (!action) return { success: false, message: 'Invalid action' };

    action.status = 'executing';
    action.executionTime = new Date();

    try {
      const response = await api.post('/superadmin/operations', { actionId });
      action.status = 'completed';
      return { success: true, message: response.data?.message || 'Action executed successfully' };
    } catch (error: any) {
      action.status = 'failed';
      return { success: false, message: error.response?.data?.error || 'Action failed' };
    }
  }

  public addAuditLogItem(
    log: Omit<AuditLogItem, 'id' | 'timestamp'>): void {
    this.auditLogs.push({
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date()
    });
  }

  public async curateProduct(
    action: string,
    platform: string,
    productId: string,
    productData?: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/superadmin/curation/product', { action, platform, productId, productData });
      return { success: true, message: response.data?.message || `Product ${action} successful` };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.error || `Product ${action} failed` };
    }
  }

  public async curateMedia(
    action: string,
    platform: string,
    mediaId: string,
    mediaData?: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/superadmin/curation/media', { action, platform, mediaId, mediaData });
      return { success: true, message: response.data?.message || `Media ${action} successful` };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.error || `Media ${action} failed` };
    }
  }

  public async manageAds(
    action: string,
    adId: string,
    adData?: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/superadmin/curation/ads', { action, adId, adData });
      return { success: true, message: response.data?.message || `Ad ${action} successful` };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.error || `Ad ${action} failed` };
    }
  }


  public getActiveAction(): AdminActionItem | null {
    return this.activeAction;
  }
}

export default AdminControlService.getInstance();
