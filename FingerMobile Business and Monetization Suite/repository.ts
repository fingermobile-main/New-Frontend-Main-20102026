import { BusinessVerification } from './shared/types';

// Mock data store
const mockVerifications: BusinessVerification[] = [];

export const createVerification = async (_id: string, verificationData: Partial<BusinessVerification>): Promise<BusinessVerification> => {
  // Create a new verification object - only using properties that exist in BusinessVerification
  const newVerification: BusinessVerification = {
    id: `verification_${Date.now()}`,
    userId: verificationData.userId || '',
    businessName: verificationData.businessName || '',
    registrationNumber: verificationData.registrationNumber || '',
    taxId: verificationData.taxId || '',
    incorporationDate: verificationData.incorporationDate || new Date(),
    businessAddress: verificationData.businessAddress || '',
    supportingDocuments: verificationData.supportingDocuments || [],
    verificationStatus: verificationData.verificationStatus || 'pending',
    verifiedAt: verificationData.verifiedAt, // Allow undefined according to type
    notes: verificationData.notes || ''
  };
  
  mockVerifications.push(newVerification);
  return newVerification;
};

export const getVerificationById = async (_id: string): Promise<BusinessVerification | null> => {
  const verification = mockVerifications.find(v => v.id === _id);
  return verification || null;
};

export const updateVerification = async (_id: string, verificationData: Partial<BusinessVerification>): Promise<BusinessVerification | null> => {
  const index = mockVerifications.findIndex(v => v.id === _id);
  if (index !== -1) {
    mockVerifications[index] = { ...mockVerifications[index], ...verificationData };
    return mockVerifications[index];
  }
  return null;
};

export const deleteVerification = async (_id: string): Promise<boolean> => {
  const initialLength = mockVerifications.length;
  const filteredVerifications = mockVerifications.filter(v => v.id !== _id);
  const deleted = filteredVerifications.length !== initialLength;
  
  if (deleted) {
    // Update the array reference
    while(mockVerifications.length > 0) {
      mockVerifications.pop();
    }
    filteredVerifications.forEach(v => mockVerifications.push(v));
  }
  
  return deleted;
};

// ... continue with other functions ...