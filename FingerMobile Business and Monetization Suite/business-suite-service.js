"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessSuiteService = void 0;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.getContentMetrics = getContentMetrics;
exports.createContentMetrics = createContentMetrics;
exports.updateContentMetrics = updateContentMetrics;
exports.createBusinessVerification = createBusinessVerification;
exports.getMonetizationApplication = getMonetizationApplication;
exports.createMonetizationApplication = createMonetizationApplication;
exports.updateMonetizationApplication = updateMonetizationApplication;
exports.getRevenueLedgerEntry = getRevenueLedgerEntry;
exports.createRevenueLedgerEntry = createRevenueLedgerEntry;
exports.updateRevenueLedgerEntry = updateRevenueLedgerEntry;
exports.createPayout = createPayout;
exports.createPayoutAccount = createPayoutAccount;
exports.createPlatformConfig = createPlatformConfig;
exports.updatePlatformConfig = updatePlatformConfig;
exports.createAffiliateEvent = createAffiliateEvent;
exports.updateAffiliateEvent = updateAffiliateEvent;
exports.updateWebhookEvent = updateWebhookEvent;
exports.updateAuditLog = updateAuditLog;
const constants_js_1 = require("./constants.js");
const formulas_js_1 = require("./formulas.js");
const policy_js_1 = require("./policy.js");
const repository_js_1 = require("./repository.js");
const eligibility_service_js_1 = require("./eligibility-service.js");
const guardian_ai_service_js_1 = require("./guardian-ai-service.js");
const kyc_verification_service_js_1 = require("./kyc-verification-service.js");
const database_service_js_1 = require("./db/database-service.js");
const createId = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
function buildMetrics(page, config) {
    const user = repository_js_1.repository.getUser();
    const contentMetrics = repository_js_1.repository.getContentMetrics();
    const payoutAccount = repository_js_1.repository.getPayoutAccount();
    return {
        followers: page.followersCount,
        watchMinutes60d: contentMetrics.watchMinutes60d,
        watchMinutes30d: contentMetrics.watchMinutes30d,
        postEngagement30d: contentMetrics.postEngagement30d,
        returningViewers30d: contentMetrics.returningViewers30d,
        uniqueViews30d: contentMetrics.uniqueViews30d,
        activeVideos: contentMetrics.activeVideos,
        consecutiveFollowerDays: contentMetrics.consecutiveFollowerDays,
        accountAgeDays: user.accountAgeDays,
        age: user.age,
        isEligibleCountry: config.supportedCountries.includes(user.countryCode),
        originalContentScore: contentMetrics.originalContentScore,
        policyViolations: contentMetrics.policyViolations,
        giftPurchaseEligible: contentMetrics.giftPurchaseEligible,
        verifiedBusiness: page.verifiedBusiness,
        verifiedPayout: Boolean(payoutAccount?.verified),
    };
}
exports.businessSuiteService = {
    getOverview() {
        const user = repository_js_1.repository.getUser();
        const seshatPage = repository_js_1.repository.getSeshatPage();
        const config = repository_js_1.repository.getPlatformConfig();
        const metrics = buildMetrics(seshatPage, config);
        const eligibility = (0, eligibility_service_js_1.evaluateEligibility)(metrics, config);
        const revenueLedger = repository_js_1.repository.getRevenueLedger();
        const payouts = repository_js_1.repository.getPayouts();
        const availableBalance = revenueLedger.reduce((sum, entry) => sum + entry.netAmount, 0);
        const pendingPayouts = payouts
            .filter((payout) => payout.status !== 'paid')
            .reduce((sum, payout) => sum + payout.amount, 0);
        return {
            user,
            seshatPage,
            metrics,
            config,
            eligibility: {
                universalStatus: eligibility.universalStatus,
                products: eligibility.products,
            },
            revenue: {
                availableBalance: Number(availableBalance.toFixed(2)),
                pendingPayouts: Number(pendingPayouts.toFixed(2)),
                monthRevenue: Number((availableBalance * 0.42).toFixed(2)),
                thresholdRemaining: Math.max(0, Number((config.minimumPayoutThreshold - availableBalance).toFixed(2))),
            },
            alerts: eligibility.universalAlerts,
        };
    },
    getPrograms() {
        return constants_js_1.PROGRAM_DEFINITIONS;
    },
    getEligibility() {
        const seshatPage = repository_js_1.repository.getSeshatPage();
        const config = repository_js_1.repository.getPlatformConfig();
        const metrics = buildMetrics(seshatPage, config);
        const result = (0, eligibility_service_js_1.evaluateEligibility)(metrics, config);
        return {
            universalStatus: result.universalStatus,
            products: result.products,
            metrics,
            alerts: result.universalAlerts,
        };
    },
    getVerificationStatus() {
        return {
            businessVerification: repository_js_1.repository.getBusinessVerification(),
            payoutAccount: repository_js_1.repository.getPayoutAccount(),
            policyAcknowledged: true,
        };
    },
    getRevenueSummary() {
        return {
            ledger: repository_js_1.repository.getRevenueLedger(),
            payouts: repository_js_1.repository.getPayouts(),
            payoutAccount: repository_js_1.repository.getPayoutAccount(),
            config: repository_js_1.repository.getPlatformConfig(),
        };
    },
    getAffiliateSummary() {
        const partnerEvents = repository_js_1.repository.getAffiliateEvents();
        const totalClicks = partnerEvents.reduce((sum, item) => sum + item.clicks, 0);
        const totalConversions = partnerEvents.reduce((sum, item) => sum + item.conversions, 0);
        const totalCommission = partnerEvents.reduce((sum, item) => sum + item.commissionAmount, 0);
        return {
            partners: partnerEvents,
            overview: {
                totalClicks,
                totalConversions,
                totalCommission: Number(totalCommission.toFixed(2)),
                conversionRate: totalClicks === 0
                    ? 0
                    : Number(((totalConversions / totalClicks) * 100).toFixed(2)),
            },
        };
    },
    getPolicy() {
        return {
            version: repository_js_1.repository.getPlatformConfig().policyVersion,
            sections: policy_js_1.monetizationPolicySections,
        };
    },
    getAdminMonitoring() {
        return {
            config: repository_js_1.repository.getPlatformConfig(),
            auditLogs: repository_js_1.repository.getAuditLogs(),
            webhooks: repository_js_1.repository.getWebhookEvents(),
            applications: repository_js_1.repository.getApplications(),
        };
    },
    createSeshatPage(payload) {
        const user = repository_js_1.repository.getUser();
        const freeUntil = new Date();
        freeUntil.setFullYear(freeUntil.getFullYear() + 2);
        const createdAt = new Date().toISOString();
        const id = createId('page');
        repository_js_1.repository.createSeshatPage({
            id,
            ownerUserId: user.id,
            name: payload.name,
            description: payload.description,
            visibility: payload.visibility, // TypeScript should now recognize this as the correct type
            freeUntil: freeUntil.toISOString(),
            createdAt,
        });
        repository_js_1.repository.addAuditLog({
            id: createId('audit'),
            actorId: user.id,
            action: 'seshat.created',
            targetType: 'seshat_page',
            targetId: id,
            metadataJson: JSON.stringify(payload),
            createdAt,
        });
        return repository_js_1.repository.getSeshatPage();
    },
    updateSeshatPage(payload) {
        repository_js_1.repository.updateSeshatPage({
            id: payload.id,
            name: payload.name,
            description: payload.description,
            visibility: payload.visibility, // TypeScript should now recognize this as the correct type
            billingPlan: payload.billingPlan // TypeScript should now recognize this as the correct type
        });
        return repository_js_1.repository.getSeshatPage();
    },
    submitMonetizationApplication(productKey) {
        const page = repository_js_1.repository.getSeshatPage();
        const application = {
            id: createId('application'),
            seshatPageId: page.id,
            productKey,
            status: 'submitted',
            submittedAt: new Date().toISOString(),
            decisionNotes: 'Queued for compliance and payout review.',
        };
        repository_js_1.repository.addApplication(application);
        return application;
    },
    updateBusinessVerification(payload) {
        const user = repository_js_1.repository.getUser();
        repository_js_1.repository.updateBusinessVerification({
            id: 'verification_default',
            userId: user.id,
            legalName: payload.legalName,
            registrationNumber: payload.registrationNumber,
            countryCode: payload.countryCode,
            reviewStatus: 'pending',
            submittedAt: new Date().toISOString(),
        });
        return repository_js_1.repository.getBusinessVerification();
    },
    updatePayoutAccount(payload) {
        const user = repository_js_1.repository.getUser();
        repository_js_1.repository.updatePayoutAccount({
            id: 'payout_default',
            userId: user.id,
            bankName: payload.bankName,
            accountLast4: payload.accountLast4,
            currency: payload.currency,
            verified: 1,
            createdAt: new Date().toISOString(),
        });
        return repository_js_1.repository.getPayoutAccount();
    },
    updateConfig(payload) {
        const current = repository_js_1.repository.getPlatformConfig();
        const updated = {
            ...current,
            ...payload,
        };
        repository_js_1.repository.updateConfig({
            id: current.id ?? 'platform_default',
            minimumAge: updated.minimumAge,
            minimumPayoutThreshold: updated.minimumPayoutThreshold,
            seshatMonthlyFee: updated.seshatMonthlyFee,
            seshatYearlyFee: updated.seshatYearlyFee,
            revenueSharePercentage: updated.revenueSharePercentage,
            giftsCashValue: updated.giftsCashValue,
            supportedCountriesJson: JSON.stringify(updated.supportedCountries),
            policyVersion: updated.policyVersion,
            affiliateBonusPercentage: updated.affiliateBonusPercentage,
            updatedAt: new Date().toISOString(),
        });
        return repository_js_1.repository.getPlatformConfig();
    },
    trackWebhook(eventType, payload) {
        const webhook = {
            id: createId('webhook'),
            eventType,
            payloadJson: JSON.stringify(payload),
            status: 'pending',
            receivedAt: new Date().toISOString(),
        };
        repository_js_1.repository.addWebhookEvent(webhook);
        return webhook;
    },
    estimateRevenue(payload) {
        return (0, formulas_js_1.calculateEstimates)(payload);
    },
    // ============================================================
    // NEW METHODS - Week 1 Implementation
    // ============================================================
    // Guardian AI Services
    async generateAccessKey(seshatPageId, keyType, expiryDays) {
        return await guardian_ai_service_js_1.guardianAI.createAccessKey(seshatPageId, keyType, expiryDays);
    },
    async generateCoupon(seshatPageId, prefix) {
        return await guardian_ai_service_js_1.guardianAI.createCoupon(seshatPageId, prefix);
    },
    validateBusinessName(name) {
        return guardian_ai_service_js_1.guardianAI.validateName(name);
    },
    generateBiometricHash(faceData) {
        return guardian_ai_service_js_1.guardianAI.generateBiometricHash(faceData);
    },
    // KYC/KYB Verification
    async submitKYC(data) {
        return await kyc_verification_service_js_1.kycService.submitKYC(data);
    },
    async getKYCStatus(userId) {
        return await kyc_verification_service_js_1.kycService.getKYCStatus(userId);
    },
    async submitKYB(data) {
        return await kyc_verification_service_js_1.kycService.submitKYB(data);
    },
    async getKYBStatus(_userId) {
        return await database_service_js_1.dbService.getKYBStatus(_userId);
    },
    // Admin KYC/KYB Management (Database operations - NOW IMPLEMENTED)
    async approveKYC(kycId, reviewerId, notes) {
        return await database_service_js_1.dbService.approveKYC(kycId, reviewerId, notes);
    },
    async rejectKYC(kycId, reviewerId, reason) {
        return await database_service_js_1.dbService.rejectKYC(kycId, reviewerId, reason);
    },
    async approveKYB(kybId, reviewerId, notes) {
        return await database_service_js_1.dbService.approveKYB(kybId, reviewerId, notes);
    },
    async rejectKYB(kybId, reviewerId, reason) {
        return await database_service_js_1.dbService.rejectKYB(kybId, reviewerId, reason);
    },
    // Access Key Management (Database operations - NOW IMPLEMENTED)
    async getAccessKeys(seshatPageId) {
        return await database_service_js_1.dbService.getAccessKeys(seshatPageId);
    },
    async createAccessKeyRecord(seshatPageId, keyType, expiryDays) {
        return await database_service_js_1.dbService.createAccessKeyRecord(seshatPageId, keyType, expiryDays);
    },
    async revokeAccessKey(id) {
        return await database_service_js_1.dbService.revokeAccessKey(id);
    },
    // Coupon Management (Database operations - NOW IMPLEMENTED)
    async getCoupons(seshatPageId) {
        return await database_service_js_1.dbService.getCoupons(seshatPageId);
    },
    async createCouponRecord(data) {
        return await database_service_js_1.dbService.createCouponRecord(data);
    },
    async redeemCoupon(code, userId) {
        return await database_service_js_1.dbService.redeemCoupon(code, userId);
    },
};
// Named export functions for use by the controller
async function createUser(userData) {
    // In a real implementation, we would validate userData and hash passwords
    // For now, we'll return a generated ID, but we acknowledge the userData parameter
    const userId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    // Log the userData to acknowledge its use (in a real implementation, we'd validate it)
    console.log('Creating user with provided data:', userData);
    // TODO: Implement actual user creation logic with validation and persistence
    return userId;
}
async function updateUser(userId, userData) {
    // In a real implementation, we would validate updates and handle sensitive fields appropriately
    // For now, this is a placeholder
    console.log(`Updating user ${userId} with data:`, userData);
}
async function getContentMetrics() {
    return repository_js_1.repository.getContentMetrics();
}
async function createContentMetrics(metricsData) {
    return repository_js_1.repository.createContentMetrics(metricsData);
}
async function updateContentMetrics(metricsId, metricsData) {
    repository_js_1.repository.updateContentMetrics({ id: metricsId, ...metricsData });
}
async function createBusinessVerification(verificationData) {
    return repository_js_1.repository.createBusinessVerification(verificationData);
}
async function getMonetizationApplication(applicationId) {
    return repository_js_1.repository.getMonetizationApplication(applicationId);
}
async function createMonetizationApplication(applicationData) {
    return repository_js_1.repository.createMonetizationApplication({
        ...applicationData,
        status: 'pending' // Use the proper type from the interface
    });
}
async function updateMonetizationApplication(applicationId, applicationData) {
    repository_js_1.repository.updateMonetizationApplication({ id: applicationId, ...applicationData });
}
async function getRevenueLedgerEntry(entryId) {
    return repository_js_1.repository.getRevenueLedgerEntry(entryId);
}
async function createRevenueLedgerEntry(entryData) {
    return repository_js_1.repository.createRevenueLedgerEntry(entryData);
}
async function updateRevenueLedgerEntry(entryId, entryData) {
    repository_js_1.repository.updateRevenueLedgerEntry({ id: entryId, ...entryData });
}
async function createPayout(payoutData) {
    return repository_js_1.repository.createPayout(payoutData);
}
async function createPayoutAccount(accountData) {
    return repository_js_1.repository.createPayoutAccount(accountData);
}
async function createPlatformConfig(configData) {
    // Convert supportedCountries to string if it's not already an array
    const processedConfigData = {
        ...configData,
        supportedCountries: Array.isArray(configData.supportedCountries) ? configData.supportedCountries : [configData.supportedCountries]
    };
    return repository_js_1.repository.createPlatformConfig(processedConfigData);
}
async function updatePlatformConfig(configData) {
    // Create a new object with the exact shape expected by the repository function
    const repoConfigData = {};
    // Manually copy each property ensuring correct types
    if (configData.minimumAge !== undefined) {
        repoConfigData.minimumAge = configData.minimumAge;
    }
    if (configData.minimumPayoutThreshold !== undefined) {
        repoConfigData.minimumPayoutThreshold = configData.minimumPayoutThreshold;
    }
    if (configData.seshatMonthlyFee !== undefined) {
        repoConfigData.seshatMonthlyFee = configData.seshatMonthlyFee;
    }
    if (configData.seshatYearlyFee !== undefined) {
        repoConfigData.seshatYearlyFee = configData.seshatYearlyFee;
    }
    if (configData.revenueSharePercentage !== undefined) {
        repoConfigData.revenueSharePercentage = configData.revenueSharePercentage;
    }
    if (configData.giftsCashValue !== undefined) {
        repoConfigData.giftsCashValue = configData.giftsCashValue;
    }
    if (configData.supportedCountries !== undefined) {
        // Handle the supportedCountries transformation properly
        repoConfigData.supportedCountries = Array.isArray(configData.supportedCountries)
            ? configData.supportedCountries
            : [configData.supportedCountries];
    }
    if (configData.policyVersion !== undefined) {
        repoConfigData.policyVersion = configData.policyVersion;
    }
    if (configData.affiliateBonusPercentage !== undefined) {
        repoConfigData.affiliateBonusPercentage = configData.affiliateBonusPercentage;
    }
    repository_js_1.repository.updatePlatformConfig(repoConfigData);
}
async function createAffiliateEvent(eventData) {
    return repository_js_1.repository.createAffiliateEvent(eventData);
}
async function updateAffiliateEvent(eventId, eventData) {
    repository_js_1.repository.updateAffiliateEvent({ id: eventId, ...eventData });
}
async function updateWebhookEvent(eventId, eventData) {
    repository_js_1.repository.updateWebhookEvent({ id: eventId, ...eventData });
}
async function updateAuditLog(logId, logData) {
    repository_js_1.repository.updateAuditLog({ id: logId, ...logData });
}
