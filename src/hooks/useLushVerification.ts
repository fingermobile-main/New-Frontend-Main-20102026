import { useState, useEffect } from 'react';

interface VerificationStatus {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  type: 'photo_id' | 'social_media' | 'phone' | 'email';
  submittedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  expiresAt?: string;
}

interface VerificationDocument {
  id: string;
  type: 'passport' | 'drivers_license' | 'national_id' | 'utility_bill' | 'bank_statement';
  frontImage: string;
  backImage?: string;
  uploadedAt: string;
}

interface VerificationRequirements {
  photo_id: boolean;
  social_media: boolean;
  phone: boolean;
  email: boolean;
  video_verification: boolean;
}

export function useLushVerification(userId: string) {
  const [verificationStatuses, setVerificationStatuses] = useState<VerificationStatus[]>([]);
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [requirements, setRequirements] = useState<VerificationRequirements | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load verification statuses
  const loadVerificationStatuses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/verification/status/${userId}`);
      // const data = await response.json();

      // Mock data for demonstration
      const mockStatuses: VerificationStatus[] = [
        {
          id: 'verif_email_1',
          userId,
          status: 'approved',
          type: 'email',
          submittedAt: '2026-09-01T10:00:00Z',
          reviewedAt: '2026-09-01T10:05:00Z'
        },
        {
          id: 'verif_phone_1',
          userId,
          status: 'approved',
          type: 'phone',
          submittedAt: '2026-09-01T11:00:00Z',
          reviewedAt: '2026-09-01T11:05:00Z'
        },
        {
          id: 'verif_photo_id_1',
          userId,
          status: 'pending',
          type: 'photo_id',
          submittedAt: '2026-10-01T14:00:00Z'
        },
        {
          id: 'verif_social_1',
          userId,
          status: 'approved',
          type: 'social_media',
          submittedAt: '2026-09-15T09:00:00Z',
          reviewedAt: '2026-09-15T09:15:00Z'
        }
      ];

      setVerificationStatuses(mockStatuses);
    } catch (err) {
      setError('Failed to load verification statuses');
      console.error('Error loading verification statuses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load verification documents
  const loadDocuments = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/verification/documents/${userId}`);
      // const data = await response.json();

      // Mock data for demonstration
      const mockDocuments: VerificationDocument[] = [
        {
          id: 'doc_passport_1',
          type: 'passport',
          frontImage: 'https://example.com/images/passport_front.jpg',
          uploadedAt: '2026-10-01T13:30:00Z'
        },
        {
          id: 'doc_utility_1',
          type: 'utility_bill',
          frontImage: 'https://example.com/images/utility_bill.jpg',
          uploadedAt: '2026-10-01T13:45:00Z'
        }
      ];

      setDocuments(mockDocuments);
    } catch (err) {
      setError('Failed to load verification documents');
      console.error('Error loading verification documents:', err);
    }
  };

  // Load verification requirements
  const loadRequirements = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/lushpressies/verification/requirements');
      // const data = await response.json();

      // Mock data for demonstration
      const mockRequirements: VerificationRequirements = {
        photo_id: true,
        social_media: true,
        phone: true,
        email: true,
        video_verification: false // Not required for all users
      };

      setRequirements(mockRequirements);
    } catch (err) {
      setError('Failed to load verification requirements');
      console.error('Error loading verification requirements:', err);
    }
  };

  // Submit verification document
  const submitVerification = async (type: VerificationStatus['type'], documents: VerificationDocument[]) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/lushpressies/verification/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId, type, documents })
      // });

      // Create a pending verification status
      const newStatus: VerificationStatus = {
        id: `verif_${type}_${Date.now()}`,
        userId,
        status: 'pending',
        type,
        submittedAt: new Date().toISOString()
      };

      setVerificationStatuses(prev => [...prev, newStatus]);
      setDocuments(prev => [...prev, ...documents]);

      return { success: true, status: newStatus };
    } catch (err: any) {
      setError('Failed to submit verification');
      console.error('Error submitting verification:', err);
      return { success: false, error: err.message };
    }
  };

  // Upload document
  const uploadDocument = async (type: VerificationDocument['type'], frontFile: File, backFile?: File) => {
    try {
      // In a real app, this would upload files to cloud storage
      // and return URLs

      // Mock document creation
      const newDocument: VerificationDocument = {
        id: `doc_${type}_${Date.now()}`,
        type,
        frontImage: URL.createObjectURL(frontFile),
        backImage: backFile ? URL.createObjectURL(backFile) : undefined,
        uploadedAt: new Date().toISOString()
      };

      setDocuments(prev => [...prev, newDocument]);

      return { success: true, document: newDocument };
    } catch (err: any) {
      setError('Failed to upload document');
      console.error('Error uploading document:', err);
      return { success: false, error: err.message };
    }
  };

  // Resubmit verification
  const resubmitVerification = async (statusId: string, documents: VerificationDocument[]) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/verification/resubmit/${statusId}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ documents })
      // });

      // Update the status to pending
      setVerificationStatuses(prev =>
        prev.map(status =>
          status.id === statusId
            ? { ...status, status: 'pending', submittedAt: new Date().toISOString() }
            : status
        )
      );

      // Add the new documents
      setDocuments(prev => [...prev, ...documents]);

      return { success: true };
    } catch (err: any) {
      setError('Failed to resubmit verification');
      console.error('Error resubmitting verification:', err);
      return { success: false, error: err.message };
    }
  };

  // Get verification status by type
  const getStatusByType = (type: VerificationStatus['type']) => {
    return verificationStatuses.find(status => status.type === type);
  };

  // Check if user is fully verified
  const isFullyVerified = () => {
    if (!requirements) return false;

    const emailVerified = getStatusByType('email')?.status === 'approved';
    const phoneVerified = getStatusByType('phone')?.status === 'approved';
    const photoIdVerified = getStatusByType('photo_id')?.status === 'approved';
    const socialVerified = getStatusByType('social_media')?.status === 'approved';

    return (
      (!requirements.email || emailVerified) &&
      (!requirements.phone || phoneVerified) &&
      (!requirements.photo_id || photoIdVerified) &&
      (!requirements.social_media || socialVerified)
    );
  };

  // Check if user needs verification
  const needsVerification = (type: VerificationStatus['type']) => {
    if (!requirements) return false;

    return requirements[type] && !getStatusByType(type);
  };

  // Check if verification is pending
  const isVerificationPending = (type: VerificationStatus['type']) => {
    const status = getStatusByType(type);
    return status && status.status === 'pending';
  };

  // Initialize data
  useEffect(() => {
    if (userId) {
      loadVerificationStatuses();
      loadDocuments();
      loadRequirements();
    }
  }, [userId]);

  return {
    verificationStatuses,
    documents,
    requirements,
    isLoading,
    error,
    loadVerificationStatuses,
    loadDocuments,
    loadRequirements,
    submitVerification,
    uploadDocument,
    resubmitVerification,
    getStatusByType,
    isFullyVerified,
    needsVerification,
    isVerificationPending
  };
}
