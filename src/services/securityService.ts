import React, {} from 'react';
// securityService.ts
// Service for handling advanced security features including phone verification, 2FA, MFA and biometric authentication

import apiService from './apiService';
import { SecurityApiResponse } from '../types/api';

export class SecurityService {
  private apiService: typeof apiService;

  constructor() {
    this.apiService = apiService;
  }

  /**
   * Send phone verification code to member's phone number
   * @param phoneNumber - The phone number to send verification code to
   * @returns Promise resolving to success status
   */
  async sendPhoneVerification(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    if (!phoneNumber || !/^\+\d{1,3}\d{10}$/.test(phoneNumber)) {
      // Basic phone number validation
      return {
        success: false,
        message: "Invalid phone number format. Please include country code."
      };
    }

    try {
      const response: SecurityApiResponse<any> = await this.apiService.request(
        "/auth/send-phone-verification", 
        { method: "POST", body: JSON.stringify({ phoneNumber }) }
      );

      return {
        success: response.success, 
        message: response.message || "Verification code sent successfully"
      };
    } catch (error) {
      console.error("Error sending phone verification:", error);
      return {
        success: false, 
        message: "Failed to send verification code"
      };
    }
  }

  /**
   * Verify phone number with code
   * @param phoneNumber - The phone number being verified
   * @param code - The verification code received by member
   * @returns Promise resolving to verification status
   */
  async verifyPhoneNumber(phoneNumber: string, code: string): Promise<{ success: boolean; message: string }> {
    if (!phoneNumber || !/^\+\d{1,3}\d{10}$/.test(phoneNumber)) {
      return { success: false, message: "Invalid phone number format." };
    }

    if (!code || !/^\d{6}$/.test(code)) {
      // Assuming a 6-digit code
      return { success: false, message: "Invalid verification code format." };
    }

    try {
      const response: SecurityApiResponse<any> = await this.apiService.request(
        "/auth/verify-phone", 
        { method: "POST", body: JSON.stringify({ phoneNumber, code }) }
      );

      return {
        success: response.success, 
        message: response.message || "Phone number verified successfully"
      };
    } catch (error) {
      console.error("Error verifying phone number:", error);
      return {
        success: false, 
        message: "Failed to verify phone number"
      };
    }
  }

  /**
   * Enable two-factor authentication for member
   * @param memberId - The member ID
   * @param method - The 2FA method (sms, email, authenticator)
   * @returns Promise resolving to enable status
   */
  async enableTwoFactor(memberId: string, method: string): Promise<{ success: boolean; message: string }> {
    try {
      const response: SecurityApiResponse<any> = await this.apiService.request(
        "/auth/enable-2fa", 
        { method: "POST", body: JSON.stringify({ memberId, method }) }
      );

      return {
        success: response.success, 
        message: response.message || "Two-factor authentication enabled"
      };
    } catch (error) {
      console.error("Error enabling 2FA:", error);
      return {
        success: false, 
        message: "Failed to enable two-factor authentication"
      };
    }
  }

  /**
   * Verify two-factor authentication code
   * @param memberId - The member ID
   * @param code - The 2FA code
   * @returns Promise resolving to verification status
   */
  async verifyTwoFactor(memberId: string, code: string): Promise<{ success: boolean; message: string }> {
    try {
      const response: SecurityApiResponse<any> = await this.apiService.request(
        "/auth/verify-2fa", 
        { method: "POST", body: JSON.stringify({ memberId, code }) }
      );

      return {
        success: response.success, 
        message: response.message || "Two-factor code verified"
      };
    } catch (error) {
      console.error("Error verifying 2FA:", error);
      return {
        success: false, 
        message: "Failed to verify two-factor code"
      };
    }
  }

  /**
   * Enable multi-factor authentication for member
   * @param memberId - The member ID
   * @param methods - The MFA methods to enable
   * @returns Promise resolving to enable status
   */
  async enableMultiFactor(memberId: string, methods: string[]): Promise<{ success: boolean; message: string }> {
    try {
      const response: SecurityApiResponse<any> = await this.apiService.request(
        "/auth/enable-mfa", 
        { method: "POST", body: JSON.stringify({ memberId, methods }) }
      );

      return {
        success: response.success, 
        message: response.message || "Multi-factor authentication enabled"
      };
    } catch (error) {
      console.error("Error enabling MFA:", error);
      return {
        success: false, 
        message: "Failed to enable multi-factor authentication"
      };
    }
  }

  /**
   * Verify multi-factor authentication
   * @param memberId - The member ID
   * @param factors - The factors with their verification data
   * @returns Promise resolving to verification status
   */
  async verifyMultiFactor(
    memberId: string,
    factors: Array<{ method: string; code: string }>
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response: SecurityApiResponse<any> = await this.apiService.request(
        "/auth/verify-mfa", 
        { method: "POST", body: JSON.stringify({ memberId, factors }) }
      );

      return {
        success: response.success, 
        message: response.message || "Multi-factor authentication verified"
      };
    } catch (error) {
      console.error("Error verifying MFA:", error);
      return {
        success: false, 
        message: "Failed to verify multi-factor authentication"
      };
    }
  }

  /**
   * Enroll member in biometric authentication
   * @param memberId - The member ID
   * @param biometricType - The type of biometric (face, fingerprint)
   * @returns Promise resolving to enrollment status
   */
  async enrollBiometric(memberId: string, biometricType: "face" | "fingerprint"): Promise<{ success: boolean; message: string }> {
    try {
      const response: SecurityApiResponse<any> = await this.apiService.request(
        "/auth/enroll-biometric", 
        { method: "POST", body: JSON.stringify({ memberId, biometricType }) }
      );

      return {
        success: response.success, 
        message: response.message || "Biometric enrollment successful"
      };
    } catch (error) {
      console.error("Error enrolling biometric:", error);
      return {
        success: false, 
        message: "Failed to enroll biometric authentication"
      };
    }
  }

  /**
   * Verify biometric authentication
   * @param memberId - The member ID
   * @param biometricData - The biometric data to verify
   * @returns Promise resolving to verification status
   */
  async verifyBiometric(memberId: string, biometricData: string): Promise<{ success: boolean; message: string }> {
    try {
      const response: SecurityApiResponse<any> = await this.apiService.request(
        "/auth/verify-biometric", 
        { method: "POST", body: JSON.stringify({ memberId, biometricData }) }
      );

      return {
        success: response.success, 
        message: response.message || "Biometric verified successfully"
      };
    } catch (error) {
      console.error("Error verifying biometric:", error);
      return {
        success: false, 
        message: "Failed to verify biometric"
      };
    }
  }

  /**
   * Generate backup codes for 2FA/MFA
   * @param memberId - The member ID
   * @returns Promise resolving to backup codes
   */
  async generateBackupCodes(memberId: string): Promise<{ success: boolean; codes?: string[]; message?: string }> {
    try {
      const response: SecurityApiResponse<{ codes?: string[] }> = await this.apiService.request(
        "/auth/generate-backup-codes", 
        { method: "POST", body: JSON.stringify({ memberId }) }
      );

      return {
        success: response.success, 
        codes: response.data?.codes, 
        message: response.message || "Backup codes generated"
      };
    } catch (error) {
      console.error("Error generating backup codes:", error);
      return {
        success: false, 
        message: "Failed to generate backup codes"
      };
    }
  }
}

export const securityService = new SecurityService();
export default securityService;