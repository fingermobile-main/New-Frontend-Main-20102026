/**
 * identityService.ts
 * Comprehensive identity, profile, security, and verification API service for FingerMobile Protocol
 */

import { api } from './api';

export interface UserProfileData {
  id?: number | string;
  name?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string | null;
  avatar?: string | null;
  coverPhotoUrl?: string | null;
  location?: string | { city?: string; country?: string };
  interests?: string[];
  website?: string;
  gender?: string;
  occupation?: string;
  company?: string;
  educationLevel?: string;
  socialLinks?: Record<string, any>;
  verificationStatus?: string;
  kycCompleted?: boolean;
  privacySettings?: Record<string, any>;
  role?: string;
  headline?: string;
  skills?: string[];
  certifications?: any[];
  portfolioUrl?: string;
}

export interface ProfileEnhancementData {
  userId?: string | number;
  headline?: string;
  skills?: string[];
  certifications?: string[];
  badges?: string[];
  portfolioUrl?: string;
}

export interface KycSubmissionData {
  userId?: string | number;
  legalName: string;
  nationality: string;
  passportNumber: string;
  fullLegalName?: string;
  idDocumentNumber?: string;
}

export interface OfficialVerificationData {
  userId?: string | number;
  businessLegalName: string;
  businessRegistrationNumber: string;
  entityType: string;
  documents?: {
    businessRegistration?: string;
    trademarkCertificate?: string;
    legalRepId?: string;
  };
  paymentAmount?: string;
}

export interface SecuritySettingsData {
  twoFactorEnabled?: boolean;
  two_factor_enabled?: boolean;
  biometricEnabled?: boolean;
  multiFactorEnabled?: boolean;
  phoneVerification?: string;
  backupCodesEnabled?: boolean;
  backupCodes?: string[];
  loginNotifications?: boolean;
}

export interface UserSessionData {
  id: string;
  platform: 'web' | 'mobile' | 'desktop';
  current: boolean;
  lastAccessed: string | number;
  createdAt?: string;
  expiresAt?: string;
  ipAddress: string;
  userAgent?: string;
  memberAgent?: string;
}

class IdentityService {
  /**
   * Fetch current or specified user's profile
   */
  async getProfile(userId?: string | number): Promise<UserProfileData> {
    const url = userId ? `/users/profile?userId=${userId}` : '/users/profile';
    const response = await api.get<{ success: boolean; data: UserProfileData; user?: UserProfileData }>(url);
    return response.data?.data || response.data?.user || (response.data as any);
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<UserProfileData>, userId?: string | number): Promise<{ success: boolean; data?: UserProfileData; message?: string }> {
    const url = userId ? `/users/profile?userId=${userId}` : '/users/profile';
    const response = await api.put<{ success: boolean; data: UserProfileData; message?: string }>(url, data);
    return {
      success: response.data?.success !== false,
      data: response.data?.data || (response.data as any),
      message: response.data?.message
    };
  }

  /**
   * Enhance profile with skills, badges, certifications and portfolio
   */
  async enhanceProfile(data: ProfileEnhancementData): Promise<any> {
    const response = await api.post<{ success: boolean; data: any }>('/users/profile/enhancement', data);
    return response.data?.data || (response.data as any);
  }

  /**
   * Submit Creator / Individual KYC Verification
   */
  async submitKycVerification(data: KycSubmissionData): Promise<{ success: boolean; id: string; message: string }> {
    const response = await api.post<{ success: boolean; id: string; message: string }>('/verifications/submit', data);
    return response.data;
  }

  /**
   * Submit Enterprise / Official KYB Verification
   */
  async submitOfficialVerification(data: OfficialVerificationData): Promise<{ success: boolean; id: string; message: string }> {
    const response = await api.post<{ success: boolean; id: string; message: string }>('/kyb/submit', data);
    return response.data;
  }

  /**
   * Check verification status
   */
  async getVerificationStatus(userId?: string | number): Promise<any> {
    const url = userId ? `/verifications/status?userId=${userId}` : '/verifications/status';
    const response = await api.get<any>(url);
    return response.data;
  }

  /**
   * Send 6-digit phone or email verification code
   */
  async sendVerificationCode(method: 'phone' | 'email', destination: string): Promise<any> {
    const response = await api.post<any>('/verifications/send-code', {
      method,
      destination,
      value: destination
    });
    return response.data;
  }

  /**
   * Verify 6-digit code
   */
  async verifyCode(code: string, method: 'phone' | 'email' = 'phone'): Promise<any> {
    const response = await api.post<any>('/verifications/verify-code', { code, method });
    return response.data;
  }

  /**
   * Get active user security posture & 2FA status
   */
  async getSecuritySettings(userId?: string | number): Promise<SecuritySettingsData> {
    const url = userId ? `/security/settings?userId=${userId}` : '/security/settings';
    const response = await api.get<{ success: boolean; data: SecuritySettingsData; settings?: SecuritySettingsData }>(url);
    return response.data?.data || response.data?.settings || (response.data as any);
  }

  /**
   * Update security settings
   */
  async updateSecuritySettings(settings: Partial<SecuritySettingsData>): Promise<any> {
    const response = await api.put<any>('/security/settings', settings);
    return response.data;
  }

  /**
   * Generate 8 single-use cryptographic backup codes
   */
  async generateBackupCodes(): Promise<string[]> {
    const response = await api.post<{ success: boolean; backupCodes: string[]; data: string[] }>('/security/backup-codes/generate');
    return response.data?.backupCodes || response.data?.data || [];
  }

  /**
   * Get active sessions
   */
  async getActiveSessions(userId?: string | number): Promise<UserSessionData[]> {
    const url = userId ? `/security/sessions?userId=${userId}` : '/security/sessions';
    const response = await api.get<{ success: boolean; data: UserSessionData[]; sessions?: UserSessionData[] }>(url);
    const sessions = response.data?.data || response.data?.sessions || (Array.isArray(response.data) ? response.data : []);
    return sessions;
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string): Promise<boolean> {
    const response = await api.post<{ success: boolean }>(`/security/sessions/${sessionId}/revoke`);
    return !!response.data?.success;
  }

  /**
   * Revoke all other active sessions
   */
  async revokeAllSessions(): Promise<boolean> {
    const response = await api.delete<{ success: boolean }>('/security/sessions');
    return !!response.data?.success;
  }
}

export const identityService = new IdentityService();
export default identityService;
