/**
 * Lush Verification Controller
 * Handles all verification-related operations for the Lush Pressies app
 */

const db = require('../config/database');
const { generateSecurePin, hashPin, verifyPin } = require('../utils/lushKeyTokenUtils');

class LushVerificationController {
  /**
   * Submit verification documents
   */
  static async submitVerification(userId, verificationType, documents) {
    try {
      // Validate inputs
      if (!userId || !verificationType || !documents || !Array.isArray(documents) || documents.length === 0) {
        return { success: false, error: 'User ID, verification type, and documents are required' };
      }

      // Validate verification type
      const validTypes = ['photo_id', 'social_media', 'phone', 'email', 'video_verification'];
      if (!validTypes.includes(verificationType)) {
        return { success: false, error: 'Invalid verification type' };
      }

      // Check if user already has this verification type pending/approved
      const existingVerification = await db.getUserVerification(userId, verificationType);
      if (existingVerification && (existingVerification.status === 'pending' || existingVerification.status === 'approved')) {
        return { success: false, error: 'Verification already submitted or approved for this type' };
      }

      // Process documents based on verification type
      const processedDocuments = await this.processDocuments(documents, verificationType);

      // Create verification request
      const verificationRequest = await db.createVerificationRequest({
        userId,
        type: verificationType,
        documents: processedDocuments,
        status: 'pending',
        submittedAt: new Date(),
        reviewedAt: null,
        reviewerNotes: null
      });

      // Notify admin team about new verification request
      this.notifyAdminsOfVerification(verificationRequest);

      return {
        success: true,
        verificationId: verificationRequest.id,
        status: 'pending'
      };
    } catch (error) {
      console.error('Error submitting verification:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Process documents for verification
   */
  static async processDocuments(documents, verificationType) {
    // In a real implementation, this would:
    // 1. Validate document formats
    // 2. Check file sizes
    // 3. Scan for viruses
    // 4. Extract text/data from documents
    // 5. Store documents securely

    // For now, we'll just return the document metadata
    return documents.map(doc => ({
      id: doc.id,
      type: doc.type,
      url: doc.url,
      uploadedAt: new Date(),
      status: 'uploaded'
    }));
  }

  /**
   * Notify admins about new verification request
   */
  static notifyAdminsOfVerification(request) {
    // This would typically send a notification to admin dashboard
    console.log(`New verification request: ${request.id} for user ${request.userId} (${request.type})`);
  }

  /**
   * Review verification request
   */
  static async reviewVerification(adminId, verificationId, approve, notes = '') {
    try {
      // Validate inputs
      if (!adminId || !verificationId || typeof approve !== 'boolean') {
        return { success: false, error: 'Admin ID, verification ID, and approval status are required' };
      }

      // Get verification request
      const verification = await db.getVerificationRequest(verificationId);
      if (!verification) {
        return { success: false, error: 'Verification request not found' };
      }

      // Check if verification is already reviewed
      if (verification.status !== 'pending') {
        return { success: false, error: 'Verification request already reviewed' };
      }

      // Update verification status
      const newStatus = approve ? 'approved' : 'rejected';
      const updatedVerification = await db.updateVerificationRequest(verificationId, {
        status: newStatus,
        reviewedAt: new Date(),
        reviewerNotes: notes
      });

      // Update user's verification status
      await db.updateUserVerificationStatus(verification.userId, verification.type, newStatus);

      // If approved, grant verification benefits
      if (approve) {
        await this.grantVerificationBenefits(verification.userId, verification.type);
      }

      // Notify user about verification result
      this.notifyUserOfVerificationResult(verification.userId, verification.type, newStatus, notes);

      return {
        success: true,
        verification: updatedVerification,
        status: newStatus
      };
    } catch (error) {
      console.error('Error reviewing verification:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Grant benefits to user after successful verification
   */
  static async grantVerificationBenefits(userId, verificationType) {
    // Grant benefits based on verification type
    switch (verificationType) {
      case 'photo_id':
        // Increase profile visibility
        await db.increaseProfileVisibility(userId, 10);
        break;
      case 'social_media':
        // Add social verification badge
        await db.addVerificationBadge(userId, 'social');
        break;
      case 'phone':
        // Increase trust score
        await db.increaseTrustScore(userId, 5);
        break;
      case 'email':
        // Increase trust score
        await db.increaseTrustScore(userId, 2);
        break;
      case 'video_verification':
        // Highest trust score increase
        await db.increaseTrustScore(userId, 15);
        await db.addVerificationBadge(userId, 'video');
        break;
    }
  }

  /**
   * Notify user about verification result
   */
  static notifyUserOfVerificationResult(userId, verificationType, status, notes) {
    // This would typically send a push notification or email
    console.log(`Verification result for user ${userId} (${verificationType}): ${status}`);
    if (notes) {
      console.log(`Reviewer notes: ${notes}`);
    }
  }

  /**
   * Get user's verification status
   */
  static async getUserVerificationStatus(userId) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      // Get all verification records for the user
      const verifications = await db.getUserVerifications(userId);

      // Organize by type
      const status = {
        email: { verified: false, status: 'none', submittedAt: null },
        phone: { verified: false, status: 'none', submittedAt: null },
        photo_id: { verified: false, status: 'none', submittedAt: null },
        social_media: { verified: false, status: 'none', submittedAt: null },
        video_verification: { verified: false, status: 'none', submittedAt: null }
      };

      verifications.forEach(verification => {
        status[verification.type] = {
          verified: verification.status === 'approved',
          status: verification.status,
          submittedAt: verification.submittedAt,
          reviewedAt: verification.reviewedAt
        };
      });

      // Calculate overall verification score
      const verifiedTypes = Object.values(status).filter(v => v.verified).length;
      const totalTypes = Object.keys(status).length;
      const verificationPercentage = (verifiedTypes / totalTypes) * 100;

      return {
        success: true,
        status,
        verificationPercentage,
        isFullyVerified: verificationPercentage === 100
      };
    } catch (error) {
      console.error('Error getting user verification status:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Initiate phone verification
   */
  static async initiatePhoneVerification(userId, phoneNumber) {
    try {
      if (!userId || !phoneNumber) {
        return { success: false, error: 'User ID and phone number are required' };
      }

      // Generate verification code
      const verificationCode = generateSecurePin(6);

      // Store verification code (with expiration)
      await db.storePhoneVerificationCode(userId, phoneNumber, verificationCode);

      // Send SMS with verification code
      // In a real implementation, this would use an SMS service like Twilio
      console.log(`Sending verification code ${verificationCode} to ${phoneNumber}`);

      // For demo purposes, we'll return the code
      return {
        success: true,
        phoneNumber,
        verificationId: `verif_phone_${Date.now()}`,
        message: 'Verification code sent successfully'
      };
    } catch (error) {
      console.error('Error initiating phone verification:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Verify phone number with code
   */
  static async verifyPhoneNumber(userId, phoneNumber, verificationCode) {
    try {
      if (!userId || !phoneNumber || !verificationCode) {
        return { success: false, error: 'User ID, phone number, and verification code are required' };
      }

      // Get stored verification code
      const storedCode = await db.getPhoneVerificationCode(userId, phoneNumber);

      if (!storedCode) {
        return { success: false, error: 'No verification code found for this phone number' };
      }

      // Check if code is expired (e.g., 10 minutes)
      const expirationTime = 10 * 60 * 1000; // 10 minutes in milliseconds
      if (Date.now() - new Date(storedCode.createdAt).getTime() > expirationTime) {
        // Remove expired code
        await db.removePhoneVerificationCode(userId, phoneNumber);
        return { success: false, error: 'Verification code has expired' };
      }

      // Verify code
      const isValid = verificationCode === storedCode.code;
      if (!isValid) {
        return { success: false, error: 'Invalid verification code' };
      }

      // Update user's phone verification status
      await db.updateUserVerificationStatus(userId, 'phone', 'approved');
      await db.setUserPhoneNumber(userId, phoneNumber);

      // Remove used code
      await db.removePhoneVerificationCode(userId, phoneNumber);

      // Grant verification benefits
      await this.grantVerificationBenefits(userId, 'phone');

      return {
        success: true,
        verified: true
      };
    } catch (error) {
      console.error('Error verifying phone number:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Initiate email verification
   */
  static async initiateEmailVerification(userId, email) {
    try {
      if (!userId || !email) {
        return { success: false, error: 'User ID and email are required' };
      }

      // Generate verification code
      const verificationCode = generateSecurePin(6);

      // Store verification code (with expiration)
      await db.storeEmailVerificationCode(userId, email, verificationCode);

      // Send email with verification code
      // In a real implementation, this would use an email service
      console.log(`Sending verification code ${verificationCode} to ${email}`);

      // For demo purposes, we'll return the code
      return {
        success: true,
        email,
        verificationId: `verif_email_${Date.now()}`,
        message: 'Verification code sent successfully'
      };
    } catch (error) {
      console.error('Error initiating email verification:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Verify email with code
   */
  static async verifyEmail(userId, email, verificationCode) {
    try {
      if (!userId || !email || !verificationCode) {
        return { success: false, error: 'User ID, email, and verification code are required' };
      }

      // Get stored verification code
      const storedCode = await db.getEmailVerificationCode(userId, email);

      if (!storedCode) {
        return { success: false, error: 'No verification code found for this email' };
      }

      // Check if code is expired (e.g., 24 hours)
      const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      if (Date.now() - new Date(storedCode.createdAt).getTime() > expirationTime) {
        // Remove expired code
        await db.removeEmailVerificationCode(userId, email);
        return { success: false, error: 'Verification code has expired' };
      }

      // Verify code
      const isValid = verificationCode === storedCode.code;
      if (!isValid) {
        return { success: false, error: 'Invalid verification code' };
      }

      // Update user's email verification status
      await db.updateUserVerificationStatus(userId, 'email', 'approved');
      await db.setUserEmail(userId, email);

      // Remove used code
      await db.removeEmailVerificationCode(userId, email);

      // Grant verification benefits
      await this.grantVerificationBenefits(userId, 'email');

      return {
        success: true,
        verified: true
      };
    } catch (error) {
      console.error('Error verifying email:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get verification requirements for user
   */
  static async getVerificationRequirements(userId) {
    try {
      // In a real implementation, this might vary by user type, location, etc.
      return {
        success: true,
        requirements: {
          email: true,
          phone: true,
          photo_id: true,
          social_media: true,
          video_verification: false // Not required for all users
        }
      };
    } catch (error) {
      console.error('Error getting verification requirements:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get verification requests for admin review
   */
  static async getVerificationRequestsForReview(limit = 20, offset = 0) {
    try {
      // Get pending verification requests
      const requests = await db.getPendingVerificationRequests(limit, offset);

      // Get user details for each request
      const requestsWithDetails = await Promise.all(
        requests.map(async (request) => {
          const user = await db.getUser(request.userId);
          return {
            ...request,
            user: {
              id: user.id,
              username: user.username,
              email: user.email
            }
          };
        })
      );

      return {
        success: true,
        requests: requestsWithDetails,
        count: requestsWithDetails.length
      };
    } catch (error) {
      console.error('Error getting verification requests:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Resubmit verification after rejection
   */
  static async resubmitVerification(userId, verificationType, documents) {
    try {
      // Check if user has a rejected verification of this type
      const rejectedVerification = await db.getUserVerification(userId, verificationType);
      if (!rejectedVerification || rejectedVerification.status !== 'rejected') {
        return { success: false, error: 'No rejected verification found for this type' };
      }

      // Submit new verification (same as initial submission)
      return await this.submitVerification(userId, verificationType, documents);
    } catch (error) {
      console.error('Error resubmitting verification:', error);
      return { success: false, error: 'Internal server error' };
    }
  }
}

module.exports = LushVerificationController;