import { Response } from 'express';
import { evaluateEligibility } from '../eligibility-service';
import { BusinessSuiteRequest } from '../middleware/request-context';
import { OverviewResponse } from '../types';

// Define types for the controller
export type { BusinessSuiteRequest };

// Define ProductKey as a union type of valid product keys
type ProductKey = 'basic' | 'premium' | 'enterprise';

// Controller functions
export const getOverview = async (_req: BusinessSuiteRequest, res: Response) => {
  try {
    // Mock data for overview
    const overview: OverviewResponse = {
      user: {
        id: 'user-123',
        email: 'user@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        age: 25,
        accountAgeDays: 30,
        countryCode: 'US',
        createdAt: new Date().toISOString()
      },
      seshatPage: {
        id: 'page-123',
        ownerUserId: 'user-123',
        name: 'Test Page',
        description: 'Test Description',
        followersCount: 1000,
        visibility: 'public',
        freeUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        billingPlan: 'free_trial',
        verifiedBusiness: false,
        createdAt: new Date().toISOString()
      },
      metrics: {
        followers: 1000,
        watchMinutes60d: 45000,
        watchMinutes30d: 25000,
        postEngagement30d: 3.5,
        returningViewers30d: 500,
        uniqueViews30d: 2000,
        activeVideos: 15,
        consecutiveFollowerDays: 10,
        accountAgeDays: 30,
        age: 25,
        isEligibleCountry: true,
        originalContentScore: 0.8,
        policyViolations: 0,
        giftPurchaseEligible: true,
        verifiedBusiness: false,
        verifiedPayout: false
      },
      config: {
        id: 'config-123',
        minimumAge: 18,
        minimumPayoutThreshold: 100,
        seshatMonthlyFee: 5,
        seshatYearlyFee: 50,
        revenueSharePercentage: 50,
        giftsCashValue: 0.05,
        supportedCountries: ['US', 'CA', 'GB', 'AU'],
        policyVersion: '1.0',
        affiliateBonusPercentage: 5
      },
      eligibility: {
        universalStatus: 'eligible',
        products: [
          { 
            product: 'basic', 
            status: 'eligible', 
            passedRules: ['minimum_followers', 'content_quality', 'audience_engagement'], 
            failedRules: [],
            nextActions: ['apply_for_monetization']
          },
          { 
            product: 'premium', 
            status: 'ineligible', 
            passedRules: ['minimum_followers'], 
            failedRules: ['content_quality', 'audience_engagement'], 
            nextActions: ['improve_content_quality', 'increase_engagement']
          },
          { 
            product: 'enterprise', 
            status: 'pending', 
            passedRules: ['minimum_followers'], 
            failedRules: ['business_verification'], 
            nextActions: ['complete_verification']
          }
        ]
      },
      programs: [
        {
          name: 'Basic Monetization',
          description: 'Entry-level monetization program',
          requirements: [
            'Minimum 1,000 followers',
            'Average watch time > 30 seconds',
            'Content posted in last 30 days'
          ],
          key: 'basic' as ProductKey
        },
        {
          name: 'Premium Monetization',
          description: 'Advanced monetization program',
          requirements: [
            'Minimum 10,000 followers',
            'Average watch time > 60 seconds',
            'Content posted in last 14 days',
            'Audience engagement > 3%'
          ],
          key: 'premium' as ProductKey
        },
        {
          name: 'Enterprise Monetization',
          description: 'Top-tier monetization program',
          requirements: [
            'Minimum 100,000 followers',
            'Average watch time > 90 seconds',
            'Content posted in last 7 days',
            'Audience engagement > 5%',
            'Business verification completed'
          ],
          key: 'enterprise' as ProductKey
        }
      ],
      verification: {
        legalName: 'Example Business LLC',
        registrationNumber: '123456789',
        countryCode: 'US'
      },
      revenue: {
        availableBalance: 500,
        pendingPayouts: 200,
        monthRevenue: 1500,
        thresholdRemaining: 50,
        thisWeekEarnings: 420,
        thisMonthEarnings: 1500,
        allTimeEarnings: 15000,
        adsRevenue: 1800,
        giftsRevenue: 450,
        subscriptionRevenue: 250,
        payoutAccount: {
          id: 'acc-123',
          userId: 'user-123',
          bankName: 'Chase Bank',
          accountLast4: '5678',
          currency: 'USD',
          verified: 1,
          createdAt: new Date().toISOString()
        }
      },
      alerts: ['Welcome to the platform!'],
      admin: {
        userCount: 1250,
        applicationCount: 42,
        revenueStats: {
          totalRevenue: 25000,
          monthlyRevenue: 2500,
          growthRate: 12.5,
        },
        webhookStatus: {
          status: 'active',
          lastProcessed: '2023-05-15T10:30:00Z',
          failureCount: 0,
        },
      },
      affiliate: {
        totalEarnings: 1250,
        activeReferrals: 24,
        conversionRate: 3.2,
        commissionRate: 5,
        referralCode: 'AFF123456',
        activity: [
          { date: '2023-05-01', action: 'signup', details: 'New referral signed up' },
          { date: '2023-05-02', action: 'purchase', details: '$50 purchase made' },
        ],
      },
    };

    res.json(overview);
  } catch (error) {
    console.error('Error in getOverview:', error);
    res.status(500).json({ error: 'Failed to get overview' });
  }
};

// ... (keeping the rest of the functions unchanged, just adding proper types)
export const submitApplication = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const { productKey }: { productKey: string } = req.body; // Get as string first
    
    // Validate productKey - explicitly check against valid values and cast
    const validProductKeys: string[] = ['basic', 'premium', 'enterprise'];
    if (!validProductKeys.includes(productKey)) {
      return res.status(400).json({ error: 'Invalid product key' });
    }
    
    // Cast to ProductKey after validation
    const validatedProductKey = productKey as ProductKey;
    
    // Process application (mock implementation)
    console.log(`Application submitted for product: ${validatedProductKey}`);
    
    res.json({ success: true, message: `Application for ${validatedProductKey} submitted successfully` });
  } catch (error) {
    console.error('Error in submitApplication:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

export const getEstimate = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const estimateRequest = req.body;
    
    // Calculate estimate based on input
    const estimate = {
      monthlyRevenue: (estimateRequest.dailyViews * 30 * estimateRequest.cpm / 1000) || 0,
      annualRevenue: (estimateRequest.dailyViews * 365 * estimateRequest.cpm / 1000) || 0,
      estimatedCpm: estimateRequest.cpm || 2.5,
      revenueSharePercentage: estimateRequest.revenueSharePercentage || 50,
      projectedGrowth: estimateRequest.engagementRate || 3,
      recommendedStrategy: "Standard Monetization",
    };

    res.json(estimate);
  } catch (error) {
    console.error('Error in getEstimate:', error);
    res.status(500).json({ error: 'Failed to calculate estimate' });
  }
};

export const getVerification = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const verification = {
      legalName: 'Example Business LLC',
      registrationNumber: '123456789',
      countryCode: 'US',
      status: 'verified',
      documents: {
        businessLicense: 'uploaded',
        taxId: 'uploaded',
        bankStatement: 'pending'
      }
    };

    res.json(verification);
  } catch (error) {
    console.error('Error in getVerification:', error);
    res.status(500).json({ error: 'Failed to get verification data' });
  }
};

export const updateVerification = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const { legalName, registrationNumber, countryCode } = req.body;
    
    // Update verification info (mock implementation)
    console.log(`Verification updated: ${legalName}, ${registrationNumber}, ${countryCode}`);
    
    res.json({ success: true, message: 'Verification updated successfully' });
  } catch (error) {
    console.error('Error in updateVerification:', error);
    res.status(500).json({ error: 'Failed to update verification' });
  }
};

export const getPayoutAccount = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const payoutAccount = {
      bankName: 'Chase Bank',
      accountLast4: '5678',
      routingNumberLast4: '6789',
      currency: 'USD',
      status: 'verified'
    };

    res.json(payoutAccount);
  } catch (error) {
    console.error('Error in getPayoutAccount:', error);
    res.status(500).json({ error: 'Failed to get payout account data' });
  }
};

export const updatePayoutAccount = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const { bankName, accountLast4, currency } = req.body;
    
    // Update payout account (mock implementation)
    console.log(`Payout account updated: ${bankName}, ****${accountLast4}, ${currency}`);
    
    res.json({ success: true, message: 'Payout account updated successfully' });
  } catch (error) {
    console.error('Error in updatePayoutAccount:', error);
    res.status(500).json({ error: 'Failed to update payout account' });
  }
};

export const getConfig = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const config = {
      minimumAge: 18,
      minimumPayoutThreshold: 100,
      seshatMonthlyFee: 5,
      seshatYearlyFee: 50,
      revenueSharePercentage: 50,
      giftsCashValue: 0.05,
      supportedCountries: JSON.stringify(['US', 'CA', 'GB', 'AU']),
      policyVersion: '1.0',
      affiliateBonusPercentage: 5,
    };

    res.json(config);
  } catch (error) {
    console.error('Error in getConfig:', error);
    res.status(500).json({ error: 'Failed to get config' });
  }
};

export const updateConfig = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const configUpdates = req.body;
    
    // Update config (mock implementation)
    console.log('Config updated:', configUpdates);
    
    res.json({ success: true, message: 'Configuration updated successfully' });
  } catch (error) {
    console.error('Error in updateConfig:', error);
    res.status(500).json({ error: 'Failed to update config' });
  }
};

export const getEligibility = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const metrics = req.body.metrics || {};
    
    // Create a mock platform config with all required fields to avoid type errors
    const platformConfig = {
      id: 'default-config',
      minimumAge: 18,
      minimumPayoutThreshold: 100,
      seshatMonthlyFee: 5,
      seshatYearlyFee: 50,
      revenueSharePercentage: 50,
      giftsCashValue: 0.05,
      supportedCountries: ['US', 'CA', 'GB', 'AU'], // Changed from JSON.stringify to array
      policyVersion: '1.0',
      affiliateBonusPercentage: 5,
    };

    // Evaluate eligibility based on metrics
    const eligibility = evaluateEligibility(metrics, platformConfig);
    
    res.json(eligibility);
  } catch (error) {
    console.error('Error in getEligibility:', error);
    res.status(500).json({ error: 'Failed to evaluate eligibility' });
  }
};

export const getPrograms = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const programs = [
      {
        name: 'Basic Monetization',
        description: 'Entry-level monetization program',
        requirements: [
          'Minimum 1,000 followers',
          'Average watch time > 30 seconds',
          'Content posted in last 30 days'
        ],
        key: 'basic' as ProductKey
      },
      {
        name: 'Premium Monetization',
        description: 'Advanced monetization program',
        requirements: [
          'Minimum 10,000 followers',
          'Average watch time > 60 seconds',
          'Content posted in last 14 days',
          'Audience engagement > 3%'
        ],
        key: 'premium' as ProductKey
      },
      {
        name: 'Enterprise Monetization',
        description: 'Top-tier monetization program',
        requirements: [
          'Minimum 100,000 followers',
          'Average watch time > 90 seconds',
          'Content posted in last 7 days',
          'Audience engagement > 5%',
          'Business verification completed'
        ],
        key: 'enterprise' as ProductKey
      }
    ];

    res.json(programs);
  } catch (error) {
    console.error('Error in getPrograms:', error);
    res.status(500).json({ error: 'Failed to get programs' });
  }
};

export const getAffiliate = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const affiliateData = {
      totalEarnings: 1250,
      activeReferrals: 24,
      conversionRate: 3.2,
      commissionRate: 5,
      referralCode: 'AFF123456',
      activity: [
        { date: '2023-05-01', action: 'signup', details: 'New referral signed up' },
        { date: '2023-05-02', action: 'purchase', details: '$50 purchase made' },
      ],
    };

    res.json(affiliateData);
  } catch (error) {
    console.error('Error in getAffiliate:', error);
    res.status(500).json({ error: 'Failed to get affiliate data' });
  }
};

// Add the calculateEstimate function that was missing
export const calculateEstimate = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const estimateRequest = req.body;
    
    // Calculate estimate based on input
    const estimate = {
      monthlyRevenue: (estimateRequest.dailyViews * 30 * estimateRequest.cpm / 1000) || 0,
      annualRevenue: (estimateRequest.dailyViews * 365 * estimateRequest.cpm / 1000) || 0,
      estimatedCpm: estimateRequest.cpm || 2.5,
      revenueSharePercentage: estimateRequest.revenueSharePercentage || 50,
      projectedGrowth: estimateRequest.engagementRate || 3,
      recommendedStrategy: "Standard Monetization",
    };

    res.json(estimate);
  } catch (error) {
    console.error('Error in calculateEstimate:', error);
    res.status(500).json({ error: 'Failed to calculate estimate' });
  }
};

// Add the missing getVerificationStatus and updateVerificationStatus functions
export const getVerificationStatus = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    console.log(`Getting verification status for user: ${userId}`);
    
    const verificationStatus = {
      status: 'pending',
      documents: {
        businessLicense: 'not_uploaded',
        taxId: 'not_uploaded',
        bankStatement: 'not_uploaded'
      },
      lastUpdated: new Date().toISOString(),
      userId: userId
    };

    res.json(verificationStatus);
  } catch (error) {
    console.error('Error in getVerificationStatus:', error);
    res.status(500).json({ error: 'Failed to get verification status' });
  }
};

export const updateVerificationStatus = async (req: BusinessSuiteRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    const { status, documents } = req.body;
    
    console.log(`Updating verification status for user: ${userId}`, { status, documents });
    
    // Update verification status (mock implementation)
    res.json({ 
      success: true, 
      message: `Verification status for user ${userId} updated successfully`,
      userId: userId,
      status: status,
      documents: documents
    });
  } catch (error) {
    console.error('Error in updateVerificationStatus:', error);
    res.status(500).json({ error: 'Failed to update verification status' });
  }
};