// KYC/KYB Verification Service

export interface KYCSubmissionDataV1 {
  userId: string;
  fullName: string;
  dateOfBirth: string; // ISO string
  documentType: 'passport' | 'driver_license' | 'national_id';
  documentFront: string; // Base64 encoded
  documentBack?: string; // Base64 encoded
  selfie: string; // Base64 encoded
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface KYBSubmissionDataV1 {
  userId: string;
  businessName: string;
  registrationNumber: string;
  incorporationDate: string; // ISO string
  businessAddress: string;
  businessCity: string;
  businessState: string;
  businessZipCode: string;
  businessCountry: string;
  businessType: string;
  taxId: string;
  directorFullName: string;
  directorDateOfBirth: string; // ISO string
  directorDocumentType: 'passport' | 'driver_license' | 'national_id';
  directorDocumentFront: string; // Base64 encoded
  directorDocumentBack?: string; // Base64 encoded
  proofOfAddress: string; // Base64 encoded
}

interface KYCRecord {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewerId?: string;
  rejectionReason?: string;
  documents: {
    documentType: string;
    documentFront: string;
    documentBack?: string;
    selfie: string;
  };
}

interface KYBRecord {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewerId?: string;
  rejectionReason?: string;
  businessDetails: {
    businessName: string;
    registrationNumber: string;
    incorporationDate: string;
    businessAddress: string;
    businessCity: string;
    businessState: string;
    businessZipCode: string;
    businessCountry: string;
    businessType: string;
    taxId: string;
    directorFullName: string;
    directorDateOfBirth: string;
  };
  documents: {
    directorDocumentType: string;
    directorDocumentFront: string;
    directorDocumentBack?: string;
    proofOfAddress: string;
  };
}

class KYCVerificationService {
  private kycRecords: Map<string, KYCRecord> = new Map();
  private kybRecords: Map<string, KYBRecord> = new Map();

  async submitKYC(data: KYCSubmissionDataV1): Promise<KYCRecord> {
    const record: KYCRecord = {
      id: 'kyc_' + Math.random().toString(36).substr(2, 10),
      userId: data.userId,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      documents: {
        documentType: data.documentType,
        documentFront: data.documentFront,
        documentBack: data.documentBack,
        selfie: data.selfie,
      }
    };

    this.kycRecords.set(record.id, record);
    console.log(`Submitted KYC for user ${data.userId}`);

    return record;
  }

  async getKYCStatus(userId: string): Promise<{
    status: 'not_found' | 'pending' | 'approved' | 'rejected';
    kycRecord?: KYCRecord | null;
  }> {
    const record = Array.from(this.kycRecords.values()).find(r => r.userId === userId);
    
    if (!record) {
      return { status: 'not_found', kycRecord: null };
    }

    return { status: record.status, kycRecord: record };
  }

  async submitKYB(data: KYBSubmissionDataV1): Promise<KYBRecord> {
    const record: KYBRecord = {
      id: 'kyb_' + Math.random().toString(36).substr(2, 10),
      userId: data.userId,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      businessDetails: {
        businessName: data.businessName,
        registrationNumber: data.registrationNumber,
        incorporationDate: data.incorporationDate,
        businessAddress: data.businessAddress,
        businessCity: data.businessCity,
        businessState: data.businessState,
        businessZipCode: data.businessZipCode,
        businessCountry: data.businessCountry,
        businessType: data.businessType,
        taxId: data.taxId,
        directorFullName: data.directorFullName,
        directorDateOfBirth: data.directorDateOfBirth,
      },
      documents: {
        directorDocumentType: data.directorDocumentType,
        directorDocumentFront: data.directorDocumentFront,
        directorDocumentBack: data.directorDocumentBack,
        proofOfAddress: data.proofOfAddress,
      }
    };

    this.kybRecords.set(record.id, record);
    console.log(`Submitted KYB for user ${data.userId}`);

    return record;
  }

  async getKYBStatus(userId: string): Promise<{
    status: 'not_found' | 'pending' | 'approved' | 'rejected';
    kybRecord?: KYBRecord | null;
  }> {
    const record = Array.from(this.kybRecords.values()).find(r => r.userId === userId);
    
    if (!record) {
      return { status: 'not_found', kybRecord: null };
    }

    return { status: record.status, kybRecord: record };
  }
}

// Export singleton instance
export const kycService = new KYCVerificationService();

// Export types
export type { KYCRecord, KYBRecord };
import { Request, Response, NextFunction } from 'express';
import { guardianAI, validateBiometricHash } from './guardian-ai-service.js';

/**
 * Age Gate Middleware
 * Ensures users are 22+ years old before accessing Seshat features
 */

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userAge?: number;
}

/**
 * Age Gate Validation Middleware
 * Checks if user meets minimum age requirement (22 years)
 */
export function ageGateMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const userAge = req.userAge;
  
  // If age is not provided in request context, block access
  if (!userAge) {
    res.status(403).json({
      error: 'Age verification required',
      message: 'You must complete age verification to access this feature',
      code: 'AGE_VERIFICATION_REQUIRED',
    });
    return;
  }
  
  // Check minimum age requirement (22 years)
  const MINIMUM_AGE = 22;
  
  if (userAge < MINIMUM_AGE) {
    res.status(403).json({
      error: 'Age restriction',
      message: `You must be at least ${MINIMUM_AGE} years old to create or manage a Seshat page`,
      currentAge: userAge,
      minimumAge: MINIMUM_AGE,
      code: 'AGE_RESTRICTION',
    });
    return;
  }
  
  // Age verified, proceed to next middleware/route handler
  next();
}

/**
 * Enhanced Age Gate with KYC Check
 * Verifies both age AND KYC approval status
 */
export async function enhancedAgeGateWithKYC(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this feature',
        code: 'AUTHENTICATION_REQUIRED',
      });
      return;
    }
    
    // TODO: Query database for KYC record
    // For now, simulate KYC check
    const kycRecord = await getKYCRecord(userId);
    
    if (!kycRecord) {
      res.status(403).json({
        error: 'KYC verification required',
        message: 'You must complete KYC verification before creating a Seshat page',
        code: 'KYC_REQUIRED',
        nextStep: 'Submit KYC form with biometric verification',
      });
      return;
    }
    
    // Check KYC status
    if (kycRecord.status !== 'APPROVED') {
      res.status(403).json({
        error: 'KYC pending',
        message: `Your KYC verification is ${kycRecord.status.toLowerCase()}. Please wait for approval.`,
        currentStatus: kycRecord.status,
        code: 'KYC_PENDING',
      });
      return;
    }
    
    // Verify age from KYC record
    if (!kycRecord.isAbove22Years) {
      res.status(403).json({
        error: 'Age restriction',
        message: 'You must be at least 22 years old based on your KYC verification',
        code: 'AGE_RESTRICTION_KYC',
      });
      return;
    }
    
    // All checks passed
    next();
  } catch (error) {
    console.error('Error in enhanced age gate:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to verify age and KYC status',
      code: 'VERIFICATION_ERROR',
    });
  }
}

/**
 * Mock function to get KYC record (replace with actual DB query)
 */
async function getKYCRecord(userId: string): Promise<{
  id: string;
  userId: string;
  isAbove22Years: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
} | null> {
  // TODO: Implement actual database query
  // SELECT * FROM kyc_records WHERE user_id = $1
  
  console.warn('KYC record lookup not implemented - returning mock data');
  
  // Mock data for testing
  return {
    id: 'kyc_mock_001',
    userId,
    isAbove22Years: true,
    status: 'APPROVED',
  };
}

// ============================================================
// KYC Verification Service
// ============================================================

export interface KYCSubmissionDataV2 {
  userId: string;
  fullLegalName: string;
  dateOfBirth: string; // ISO date format
  nationality?: string;
  idDocumentType?: string;
  idDocumentNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  countryCode?: string;
  biometricFaceData: string; // Base64 encoded image or hash
}

export interface KYBSubmissionDataV2 {
  userId: string;
  businessLegalName: string;
  businessRegistrationNumber: string;
  businessType: string;
  taxId?: string;
  incorporationDate?: string;
  registeredAddress?: string;
  businessEmail?: string;
  businessPhone?: string;
  websiteUrl?: string;
  industryCategory?: string;
  annualRevenueRange?: string;
  employeeCountRange?: string;
  documentsJson?: string;
}

export class KYCService {
  /**
   * Submit KYC verification for a user
   */
  async submitKYC(data: KYCSubmissionDataV2): Promise<{
    success: boolean;
    kycId: string;
    status: string;
    message: string;
  }> {
    try {
      // Validate age from date of birth
      const age = this.calculateAge(data.dateOfBirth);
      
      if (age < 22) {
        return {
          success: false,
          kycId: '',
          status: 'REJECTED',
          message: 'Applicant must be at least 22 years old',
        };
      }
      
      // Generate biometric hash
      const biometricHash = guardianAI.generateBiometricHash(data.biometricFaceData);
      
      // Validate biometric hash format
      if (!validateBiometricHash(biometricHash)) {
        throw new Error('Invalid biometric hash format');
      }
      
      // TODO: Insert into kyc_records table
      // INSERT INTO kyc_records (...) VALUES (...)
      
      console.log('KYC submission received for user:', data.userId);
      console.log('Age calculated:', age);
      console.log('Biometric hash generated:', biometricHash.substring(0, 20) + '...');
      
      return {
        success: true,
        kycId: 'kyc_pending_' + Date.now(),
        status: 'PENDING',
        message: 'KYC verification submitted successfully. Awaiting review.',
      };
    } catch (error) {
      console.error('Error submitting KYC:', error);
      throw error;
    }
  }
  
  /**
   * Submit KYB verification for a business
   */
  async submitKYB(data: KYBSubmissionDataV2): Promise<{
    success: boolean;
    kybId: string;
    status: string;
    message: string;
  }> {
    try {
      // Validate business registration number format
      if (!this.isValidRegistrationNumber(data.businessRegistrationNumber)) {
        return {
          success: false,
          kybId: '',
          status: 'REJECTED',
          message: 'Invalid business registration number format',
        };
      }
      
      // Validate email format if provided
      if (data.businessEmail && !this.isValidEmail(data.businessEmail)) {
        return {
          success: false,
          kybId: '',
          status: 'REJECTED',
          message: 'Invalid business email format',
        };
      }
      
      // TODO: Insert into kyb_records table
      // INSERT INTO kyb_records (...) VALUES (...)
      
      console.log('KYB submission received for user:', data.userId);
      console.log('Business name:', data.businessLegalName);
      
      return {
        success: true,
        kybId: 'kyb_pending_' + Date.now(),
        status: 'PENDING',
        message: 'KYB verification submitted successfully. Awaiting review.',
      };
    } catch (error) {
      console.error('Error submitting KYB:', error);
      throw error;
    }
  }
  
  /**
   * Calculate age from date of birth
   */
  private calculateAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  
  /**
   * Validate business registration number format
   */
  private isValidRegistrationNumber(regNumber: string): boolean {
    // Basic validation - alphanumeric with optional dashes
    const regEx = /^[A-Z0-9-]{5,20}$/i;
    return regEx.test(regNumber);
  }
  
  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Get KYC status for a user
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getKYCStatus(_userId: string): Promise<{
    status: string;
    kycRecord?: unknown;
  }> {
    // TODO: Query database for KYC record
    // SELECT * FROM kyc_records WHERE user_id = $1
    
    console.warn('KYC status lookup not implemented - returning mock data');
    
    return {
      status: 'PENDING',
      kycRecord: null,
    };
  }
  
  /**
   * Approve KYC verification (admin only)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async approveKYC(kycId: string, reviewerId: string, _notes?: string): Promise<boolean> {
    // TODO: Update kyc_records table
    // UPDATE kyc_records SET status = 'APPROVED', reviewed_by = ..., review_notes = ... WHERE id = $1
    
    console.log(`KYC ${kycId} approved by reviewer ${reviewerId}`);
    return true;
  }
  
  /**
   * Reject KYC verification (admin only)
   */
  async rejectKYC(kycId: string, reviewerId: string, reason: string): Promise<boolean> {
    // TODO: Update kyc_records table
    // UPDATE kyc_records SET status = 'REJECTED', reviewed_by = ..., review_notes = ... WHERE id = $1
    
    console.log(`KYC ${kycId} rejected by reviewer ${reviewerId}: ${reason}`);
    return true;
  }
}

// Export singleton instance
export const kycServiceV2 = new KYCService();
