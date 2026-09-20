"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycService = exports.KYCService = void 0;
exports.ageGateMiddleware = ageGateMiddleware;
exports.enhancedAgeGateWithKYC = enhancedAgeGateWithKYC;
const guardian_ai_service_js_1 = require("./guardian-ai-service.js");
/**
 * Age Gate Validation Middleware
 * Checks if user meets minimum age requirement (22 years)
 */
function ageGateMiddleware(req, res, next) {
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
async function enhancedAgeGateWithKYC(req, res, next) {
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
    }
    catch (error) {
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
async function getKYCRecord(userId) {
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
class KYCService {
    /**
     * Submit KYC verification for a user
     */
    async submitKYC(data) {
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
            const biometricHash = guardian_ai_service_js_1.guardianAI.generateBiometricHash(data.biometricFaceData);
            // Validate biometric hash format
            if (!(0, guardian_ai_service_js_1.validateBiometricHash)(biometricHash)) {
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
        }
        catch (error) {
            console.error('Error submitting KYC:', error);
            throw error;
        }
    }
    /**
     * Submit KYB verification for a business
     */
    async submitKYB(data) {
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
        }
        catch (error) {
            console.error('Error submitting KYB:', error);
            throw error;
        }
    }
    /**
     * Calculate age from date of birth
     */
    calculateAge(dateOfBirth) {
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
    isValidRegistrationNumber(regNumber) {
        // Basic validation - alphanumeric with optional dashes
        const regEx = /^[A-Z0-9-]{5,20}$/i;
        return regEx.test(regNumber);
    }
    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    /**
     * Get KYC status for a user
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getKYCStatus(_userId) {
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
    async approveKYC(kycId, reviewerId, _notes) {
        // TODO: Update kyc_records table
        // UPDATE kyc_records SET status = 'APPROVED', reviewed_by = ..., review_notes = ... WHERE id = $1
        console.log(`KYC ${kycId} approved by reviewer ${reviewerId}`);
        return true;
    }
    /**
     * Reject KYC verification (admin only)
     */
    async rejectKYC(kycId, reviewerId, reason) {
        // TODO: Update kyc_records table
        // UPDATE kyc_records SET status = 'REJECTED', reviewed_by = ..., review_notes = ... WHERE id = $1
        console.log(`KYC ${kycId} rejected by reviewer ${reviewerId}: ${reason}`);
        return true;
    }
}
exports.KYCService = KYCService;
// Export singleton instance
exports.kycService = new KYCService();
