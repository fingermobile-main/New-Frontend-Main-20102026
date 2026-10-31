import { User } from '../types/user';
import api from './api';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

export interface OnboardingProgress {
  userId: string;
  currentStep: string;
  completedSteps: string[];
  profileData: Partial<User>;
  interests: string[];
  verificationStatus: {
    email?: boolean;
    phone?: boolean;
    identity?: boolean;
    captcha?: boolean;
    termsAccepted?: boolean;
    permissionsGranted?: boolean;
    business?: boolean;
    twoFactor?: boolean;
  };
  accountType: 'personal' | 'creator' | 'business' | null;
  demographicInfo: {
    location?: string;
    gender?: string;
    age?: number;
    defaultIpLocation?: boolean;
  };
  p2pAlgorithmData: {
    locationBasedMatching?: boolean;
    interestAlignment?: boolean;
    behavioralScoring?: boolean;
  };
  termsAccepted: {
    userAgreement?: boolean;
    privacyPolicy?: boolean;
    platformUseTerms?: boolean;
    conditions?: boolean;
  };
  permissionsGranted: {
    location?: boolean;
    notifications?: boolean;
    audio?: boolean;
    media?: boolean;
    camera?: boolean;
    storage?: boolean;
  };
  cesFormula: {
    likesWeight: number;
    savesWeight: number;
    commentsWeight: number;
    sharesWeight: number;
    followsWeight: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OnboardingData {
  step: string;
  data: any;
}

class OnboardingService {
  private static instance: OnboardingService;
  private progress: Map<string, OnboardingProgress> = new Map();

  private constructor() {}

  public static getInstance(): OnboardingService {
    if (!OnboardingService.instance) {
      OnboardingService.instance = new OnboardingService();
    }
    return OnboardingService.instance;
  }

  public async initializeOnboarding(userId: string, userData: Partial<User>): Promise<OnboardingProgress> {
    const progress: OnboardingProgress = {
      userId,
      currentStep: 'welcome',
      completedSteps: [],
      profileData: userData,
      interests: [],
      verificationStatus: {
        email: false,
        phone: false,
        identity: false,
        captcha: false,
        termsAccepted: false,
        permissionsGranted: false
      },
      accountType: null,
      demographicInfo: {},
      p2pAlgorithmData: {
        locationBasedMatching: false,
        interestAlignment: false,
        behavioralScoring: false
      },
      termsAccepted: {
        userAgreement: false,
        privacyPolicy: false,
        platformUseTerms: false,
        conditions: false
      },
      permissionsGranted: {
        location: false,
        notifications: false,
        audio: false,
        media: false,
        camera: false,
        storage: false
      },
      cesFormula: {
        likesWeight: 1,
        savesWeight: 1,
        commentsWeight: 4,
        sharesWeight: 4,
        followsWeight: 8
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.progress.set(userId, progress);
    return progress;
  }

  public async getProgress(userId: string): Promise<OnboardingProgress | null> {
    return this.progress.get(userId) || null;
  }

  public async updateProgress(userId: string, data: Partial<OnboardingProgress>): Promise<OnboardingProgress> {
    const existingProgress = this.progress.get(userId);
    if (!existingProgress) {
      throw new Error('Onboarding progress not found for user');
    }

    const updatedProgress: OnboardingProgress = {
      ...existingProgress,
      ...data,
      updatedAt: new Date()
    };

    this.progress.set(userId, updatedProgress);
    return updatedProgress;
  }

  public async completeStep(userId: string, stepId: string): Promise<OnboardingProgress> {
    const progress = this.progress.get(userId);
    if (!progress) {
      throw new Error('Onboarding progress not found for user');
    }

    // Add step to completed steps if not already there
    if (!progress.completedSteps.includes(stepId)) {
      progress.completedSteps.push(stepId);
    }

    // Update current step based on progression logic
    progress.currentStep = this.getNextStep(stepId, progress.completedSteps, progress.accountType);

    progress.updatedAt = new Date();
    this.progress.set(userId, progress);

    return progress;
  }

  public getNextStep(currentStep: string, _completedSteps: string[] = [], accountType?: string | null): string {
    if (currentStep === 'terms-permissions') {
      return 'account-type-selection';
    }
    if (currentStep === 'account-type-selection') {
      if (accountType === 'creator') return 'content-creator-verification';
      if (accountType === 'business') return 'business-verification';
      return 'two-factor-setup';
    }
    if (currentStep === 'content-creator-verification' || currentStep === 'business-verification') {
      return 'two-factor-setup';
    }

    const onboardingFlow = [
      'welcome',
      'terms-permissions',
      'account-type-selection',
      ...(accountType === 'creator' ? ['content-creator-verification'] : []),
      ...(accountType === 'business' ? ['business-verification'] : []),
      'two-factor-setup',
      'verification-captcha',
      'demographics-interests',
      'profile-customization',
      'p2p-algorithm-calibration',
      'ces-formula-education',
      'completion'
    ];

    const currentIndex = onboardingFlow.indexOf(currentStep);
    if (currentIndex === -1 || currentIndex >= onboardingFlow.length - 1) {
      return 'completion';
    }

    return onboardingFlow[currentIndex + 1];
  }

  public getPreviousStep(currentStep: string, accountType?: string | null): string {
    if (currentStep === 'terms-permissions') return 'welcome';
    if (currentStep === 'account-type-selection') return 'terms-permissions';
    if (currentStep === 'content-creator-verification' || currentStep === 'business-verification') {
      return 'account-type-selection';
    }
    if (currentStep === 'two-factor-setup') {
      if (accountType === 'creator') return 'content-creator-verification';
      if (accountType === 'business') return 'business-verification';
      return 'account-type-selection';
    }

    const onboardingFlow = [
      'welcome',
      'terms-permissions',
      'account-type-selection',
      ...(accountType === 'creator' ? ['content-creator-verification'] : []),
      ...(accountType === 'business' ? ['business-verification'] : []),
      'two-factor-setup',
      'verification-captcha',
      'demographics-interests',
      'profile-customization',
      'p2p-algorithm-calibration',
      'ces-formula-education',
      'completion'
    ];

    const currentIndex = onboardingFlow.indexOf(currentStep);
    if (currentIndex <= 0) return 'welcome';
    return onboardingFlow[currentIndex - 1];
  }

  public async setAccountType(userId: string, accountType: 'personal' | 'creator' | 'business'): Promise<OnboardingProgress> {
    const progress = this.progress.get(userId);
    if (!progress) {
      throw new Error('Onboarding progress not found for user');
    }

    progress.accountType = accountType;
    progress.updatedAt = new Date();
    this.progress.set(userId, progress);

    return progress;
  }

  public async setInterests(userId: string, interests: string[]): Promise<OnboardingProgress> {
    const progress = this.progress.get(userId);
    if (!progress) {
      throw new Error('Onboarding progress not found for user');
    }

    progress.interests = interests;
    progress.updatedAt = new Date();
    this.progress.set(userId, progress);

    return progress;
  }

  public async setDemographics(userId: string, demographics: OnboardingProgress['demographicInfo']): Promise<OnboardingProgress> {
    const progress = this.progress.get(userId);
    if (!progress) {
      throw new Error('Onboarding progress not found for user');
    }

    progress.demographicInfo = { ...progress.demographicInfo, ...demographics };
    progress.updatedAt = new Date();
    this.progress.set(userId, progress);

    return progress;
  }

  public async markVerificationComplete(userId: string, verificationType: keyof OnboardingProgress['verificationStatus'], status: boolean): Promise<OnboardingProgress> {
    const progress = this.progress.get(userId);
    if (!progress) {
      throw new Error('Onboarding progress not found for user');
    }

    progress.verificationStatus[verificationType] = status;
    progress.updatedAt = new Date();
    this.progress.set(userId, progress);

    return progress;
  }

  public async acceptTerms(userId: string, termType: keyof OnboardingProgress['termsAccepted'], accepted: boolean): Promise<OnboardingProgress> {
    const progress = this.progress.get(userId);
    if (!progress) {
      throw new Error('Onboarding progress not found for user');
    }

    progress.termsAccepted[termType] = accepted;
    progress.verificationStatus.termsAccepted = Object.values(progress.termsAccepted).every(val => val === true);
    progress.updatedAt = new Date();
    this.progress.set(userId, progress);

    return progress;
  }

  public async grantPermission(userId: string, permissionType: keyof OnboardingProgress['permissionsGranted'], granted: boolean): Promise<OnboardingProgress> {
    const progress = this.progress.get(userId);
    if (!progress) {
      throw new Error('Onboarding progress not found for user');
    }

    progress.permissionsGranted[permissionType] = granted;
    progress.verificationStatus.permissionsGranted = Object.values(progress.permissionsGranted).every(val => val === true);
    progress.updatedAt = new Date();
    this.progress.set(userId, progress);

    return progress;
  }

  public async configureP2PAlgorithm(userId: string, config: Partial<OnboardingProgress['p2pAlgorithmData']>): Promise<OnboardingProgress> {
    const progress = this.progress.get(userId);
    if (!progress) {
      throw new Error('Onboarding progress not found for user');
    }

    progress.p2pAlgorithmData = { ...progress.p2pAlgorithmData, ...config };
    progress.updatedAt = new Date();
    this.progress.set(userId, progress);

    return progress;
  }

  public async finalizeOnboarding(userId: string): Promise<boolean> {
    const progress = this.progress.get(userId);
    try {
      if (progress) {
        // Persist onboarding data to backend user profile
        await api.put('/users/profile', {
          bio: progress.profileData?.bio || 'FingerMobile Community Member',
          location: progress.demographicInfo?.location || 'Lagos, Nigeria',
          interests: progress.interests || []
        }).catch((err) => {
          console.warn('Could not persist profile to API (fallback in-memory):', err?.message);
        });

        // Persist P2P preferences & matching calibration to backend
        await api.post('/p2p-matching/member-profiles', {
          userId,
          accountType: progress.accountType || 'personal',
          interests: progress.interests || [],
          demographics: progress.demographicInfo || {},
          p2pAlgorithmData: progress.p2pAlgorithmData || {},
          cesFormula: progress.cesFormula || {}
        }).catch((err) => {
          console.warn('Could not persist P2P profile to API:', err?.message);
        });
      }
    } catch (e) {
      console.warn('Onboarding finalize error:', e);
    }

    // Clean up and return true
    this.progress.delete(userId);
    return true;
  }

  public async resetOnboarding(userId: string): Promise<void> {
    this.progress.delete(userId);
  }

  public async getOnboardingSteps(accountType: 'personal' | 'creator' | 'business' | null): Promise<OnboardingStep[]> {
    const baseSteps: OnboardingStep[] = [
      {
        id: 'welcome',
        title: 'Welcome to FingerMobile',
        description: 'Get set up with your sovereign account',
        required: true
      },
      {
        id: 'terms-permissions',
        title: 'Legal & Privacy Policy Acceptance',
        description: 'Review and accept Privacy Policy, CSAE Safety, and Sovereign Terms',
        required: true
      },
      {
        id: 'account-type-selection',
        title: 'Account Type Selection',
        description: 'Choose Personal (Free), Creator (Membership), or Business',
        required: true
      },
      {
        id: 'content-creator-verification',
        title: 'Content Creator Verification',
        description: 'Verify identity and select regional creator tier',
        required: accountType === 'creator'
      },
      {
        id: 'business-verification',
        title: 'Business Verification',
        description: 'Verify your business and brand credentials',
        required: accountType === 'business'
      },
      {
        id: 'two-factor-setup',
        title: 'Two-Factor Authentication Setup',
        description: 'Secure your account with 2FA',
        required: true
      },
      {
        id: 'verification-captcha',
        title: 'Verification & Captcha',
        description: 'Verify information and prove you are human',
        required: true
      },
      {
        id: 'demographics-interests',
        title: 'Demographics & Interests',
        description: 'Personalize your feed across 54 topic categories',
        required: true
      },
      {
        id: 'profile-customization',
        title: 'Profile Customization',
        description: 'Set up your display name and sovereign avatar',
        required: true
      },
      {
        id: 'p2p-algorithm-calibration',
        title: 'P2P Algorithm Calibration',
        description: 'Configure your sovereign matching preferences',
        required: true
      },
      {
        id: 'ces-formula-education',
        title: 'CES Formula Education',
        description: 'Learn how engagement is scored in FingerMobile',
        required: true
      },
      {
        id: 'completion',
        title: 'Onboarding Complete!',
        description: 'Your sovereign profile is activated and ready to explore',
        required: false
      }
    ];

    // Filter steps immutably based on account type
    if (accountType === 'personal') {
      return baseSteps.filter(s => s.id !== 'content-creator-verification' && s.id !== 'business-verification');
    }
    if (accountType === 'creator') {
      return baseSteps.filter(s => s.id !== 'business-verification');
    }
    if (accountType === 'business') {
      return baseSteps.filter(s => s.id !== 'content-creator-verification');
    }

    return baseSteps;
  }
}

export default OnboardingService.getInstance();
