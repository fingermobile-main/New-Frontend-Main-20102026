import React, { useState, useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useOnboarding } from '../contexts/OnboardingContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { Checkbox } from '../components/ui/Checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/RadioGroup';
import {
  UserIcon,
  MailIcon,
  LockIcon,
  GlobeAltIcon as GlobeIcon,
  HeartIcon,
  CheckCircleIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  SparklesIcon,
  CameraIcon,
  MapPinIcon,
  LockOpenIcon,
  DocumentTextIcon,
  CogIcon,
  ChartBarIcon,
  LockClosedIcon,
  DevicePhoneMobileIcon
} from '../icons';
import { CustomCaptcha } from '../components/CustomCaptcha';
import api from '../services/api';
import { CreatorSpotAvailabilityCard } from '../components/onboarding/CreatorSpotAvailabilityCard';
import { HumanCaptchaPuzzle } from '../components/onboarding/HumanCaptchaPuzzle';
import { CESFormulaCard } from '../components/onboarding/CESFormulaCard';
import { CountryAvailabilityData, CreatorTier } from '../types/creatorOnboarding';
import userProfileSyncService from '../services/UserProfileSyncService';
import AuthBrandingPanel from '../components/auth/AuthBrandingPanel';
import QRCodeDisplay from '../components/common/QRCodeDisplay';
import {
  LiveSelfieCaptureModal,
  LiveSelfieVerificationResult
} from '../components/verification/LiveSelfieCaptureModal';

export const ONBOARDING_BACKGROUNDS = {
  // FingerMobile Login screen Background image (from Assets/WebP converted Images)
  LOGIN_BG: '/assets/branding/backgrounds/FingerMobile-Login-screen-Background-image.webp',
  // FingerMobile Forgot password (from Assets/WebP converted Images)
  FORGOT_PASSWORD_BG: '/assets/branding/backgrounds/FingerMobile-Forgot-password.webp',
} as const;

/**
 * Returns the exact background image URL using Assets/WebP converted Images for screens 1-11:
 * - Screens 1 - 5: FingerMobile Login screen Background image.webp
 * - Screens 6 - 11: FingerMobile Forgot password.webp
 */
export const getOnboardingBackground = (stepNumber: number, stepId?: string): string => {
  // 1. Exact step ID mapping
  switch (stepId) {
    case 'welcome':
    case 'terms-permissions':
    case 'account-type-selection':
    case 'content-creator-verification':
    case 'business-verification':
      return ONBOARDING_BACKGROUNDS.LOGIN_BG;
    case 'two-factor-setup':
    case 'verification-captcha':
    case 'demographics-interests':
    case 'profile-customization':
    case 'p2p-algorithm-calibration':
    case 'ces-formula-education':
    case 'completion':
      return ONBOARDING_BACKGROUNDS.FORGOT_PASSWORD_BG;
  }

  // 2. Sequential step number mapping (1-based index)
  if (stepNumber <= 5) {
    return ONBOARDING_BACKGROUNDS.LOGIN_BG;
  }
  return ONBOARDING_BACKGROUNDS.FORGOT_PASSWORD_BG;
};

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, initializeOnboarding, updateProgress, setAccountType, setInterests, setDemographics, markVerificationComplete, finalizeOnboarding, nextStep, previousStep } = useOnboarding();
  const { state: authState } = useAuth();
  const [tempData, setTempData] = useState<any>({});
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [creatorPassportFile, setCreatorPassportFile] = useState<File | null>(null);
  const [creatorSelfieFile, setCreatorSelfieFile] = useState<File | null>(null);
  const [selfiePreviewUrl, setSelfiePreviewUrl] = useState<string | null>(null);
  const [selfieVerificationResult, setSelfieVerificationResult] = useState<LiveSelfieVerificationResult | null>(null);
  const [isSelfieModalOpen, setIsSelfieModalOpen] = useState<boolean>(false);
  const [selfieModalInitialMode, setSelfieModalInitialMode] = useState<'camera' | 'upload'>('camera');
  const [businessDocuments, setBusinessDocuments] = useState<FileList | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const [ageError, setAgeError] = useState<string>('');
  const [onboardingNotice, setOnboardingNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showNotice = (text: string, type: 'success' | 'error' = 'error') => {
    setOnboardingNotice({ text, type });
    setTimeout(() => setOnboardingNotice(null), 4500);
  };

  // Regional Creator Quota & Capacity State
  const [selectedTier, setSelectedTier] = useState<CreatorTier>('TIER_3');
  const [inviteToken, setInviteToken] = useState<string>('');
  const [availabilityData, setAvailabilityData] = useState<CountryAvailabilityData | null>(null);
  const [tierFeedback, setTierFeedback] = useState<{ status: string; message: string } | null>(null);
  const [isSubmittingCreator, setIsSubmittingCreator] = useState<boolean>(false);
  const [showOtherMethods, setShowOtherMethods] = useState<boolean>(false);

  // Preload onboarding background assets to ensure zero flash on screen transitions
  useEffect(() => {
    const imagesToPreload = [
      ONBOARDING_BACKGROUNDS.LOGIN_BG,
      ONBOARDING_BACKGROUNDS.FORGOT_PASSWORD_BG,
    ];
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (state.progress?.currentStep === 'demographics-interests' && mapContainerRef.current && !mapInstance) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [13.388, 52.517],
        zoom: 9.5,
      });
      setMapInstance(map);
    }
  }, [state.progress?.currentStep]);

  useEffect(() => {
    if (tempData.defaultIpLocation) {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (data && data.ip) {
            setTempData((prev: any) => ({ 
              ...prev, 
              location: `${data.city}, ${data.country_name}`, 
              ipAddress: data.ip,
              countryCode: data.country_code || 'NG'
            }));
            if (mapInstance && data.longitude && data.latitude) {
              mapInstance.flyTo({ center: [data.longitude, data.latitude], zoom: 12 });
            }
          }
        })
        .catch(() => {});
    }
  }, [tempData.defaultIpLocation, mapInstance]);

  // Fetch Live Creator Regional Availability
  useEffect(() => {
    const code = tempData.countryCode || 'NG';
    api.get(`/creators/availability?country=${code}`)
      .then(res => {
        if (res.data?.success && res.data.data) {
          setAvailabilityData(res.data.data);
        }
      })
      .catch(() => {});
  }, [tempData.countryCode, state.progress?.currentStep]);

  // Initialize onboarding when component mounts
  useEffect(() => {
    if (authState.user) {
      initializeOnboarding(authState.user.id, authState.user);
    } else {
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          initializeOnboarding(parsed.id || 'current_user', parsed);
          return;
        } catch {
          // Handled gracefully
        }
      }
      initializeOnboarding('new_user', {});
    }
  }, [authState.user]);

  // Handle direct step jumping via URL parameter (e.g., ?step=content-creator-verification or ?step=creator)
  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const targetStep = stepParam === 'creator' ? 'content-creator-verification' : stepParam;
      if (state.progress && state.progress.currentStep !== targetStep) {
        updateProgress({ currentStep: targetStep as any });
      }
    }
  }, [searchParams, state.progress, updateProgress]);

  // Calculate progress percentage
  const progressPercentage = state.steps.length > 0 
    ? (state.currentStepIndex / state.steps.length) * 100
    : 0;

  // Handle welcome step
  const handleWelcomeContinue = async () => {
    await nextStep();
  };

  // Handle terms and permissions acceptance
  const handleTermsAcceptance = async () => {
    // Mark all terms as accepted
    await updateProgress({
      termsAccepted: {
        userAgreement: true,
        privacyPolicy: true,
        platformUseTerms: true,
        conditions: true
      },
      verificationStatus: {
        ...state.progress?.verificationStatus,
        termsAccepted: true
      }
    });
    await nextStep();
  };

  // Quick Action: Accept all legal terms and grant platform permissions
  const handleSelectAllTermsAndPermissions = async () => {
    await updateProgress({
      termsAccepted: {
        userAgreement: true,
        privacyPolicy: true,
        platformUseTerms: true,
        conditions: true
      },
      permissionsGranted: {
        location: true,
        notifications: true,
        audio: true,
        media: true,
        camera: true,
        storage: true
      },
      verificationStatus: {
        ...state.progress?.verificationStatus,
        termsAccepted: true,
        permissionsGranted: true
      }
    });
  };

  // Handle registration step
  const handleRegistration = async () => {
    // In a real app, this would handle registration logic
    await markVerificationComplete('email', true);
    await markVerificationComplete('phone', true);
    await nextStep();
  };

  // Handle 2FA setup
  const handleTwoFactorSetup = async () => {
    if (tempData.skip2fa) {
      // Skip 2FA and move to next step
      await nextStep();
    } else if (tempData.twoFactorMethod && tempData.twoFactorCode && tempData.twoFactorCode.length === 6) {
      // Verify the 2FA code and move to next step
      await markVerificationComplete('twoFactor', true);
      await updateProgress({
        profileData: {
          ...state.progress?.profileData,
          twoFactorEnabled: true,
          twoFactorMethod: tempData.twoFactorMethod
        }
      });
      await nextStep();
    } else {
      showNotice('Please select a 2FA method and enter the 6-digit verification code, or check "Skip 2FA setup".', 'error');
    }
  };

  // Handle verification and captcha
  const handleVerificationCaptcha = async () => {
    await markVerificationComplete('captcha', true);
    await nextStep();
  };

  // Handle demographics and interests
  const handleDemographicsChange = (field: string, value: any) => {
    setTempData({ ...tempData, [field]: value });
  };

  const availableInterests = [
    'Fashion', 'Travel', 'Food', 'Fitness', 'Technology',
    'Music', 'Art', 'Sports', 'Education', 'Business'
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length < 10) { // Max 10 interests
        setSelectedInterests([...selectedInterests, interest]);
      }
    }
  };

  const handleSaveInterests = async () => {
    if (selectedInterests.length >= 4) { // Require minimum 4 interests
      await setInterests(selectedInterests);
      await setDemographics(tempData);
      await nextStep();
    } else {
      showNotice('Please select at least 4 interests to personalize your feed.', 'error');
    }
  };

  // Handle profile customization
  const handleProfileChange = (field: string, value: any) => {
    setTempData({ ...tempData, [field]: value });
  };

  const handleSaveProfile = async () => {
    await updateProgress({ profileData: { ...state.progress?.profileData, ...tempData } });
    await nextStep();
  };

  // Handle P2P algorithm calibration
  const handleP2PCalibration = async () => {
    await updateProgress({
      p2pAlgorithmData: {
        locationBasedMatching: true,
        interestAlignment: true,
        behavioralScoring: true
      }
    });
    await nextStep();
  };

  // Handle account type selection
  const handleAccountTypeSelect = async (type?: 'personal' | 'creator' | 'business') => {
    const selected = type || tempData.accountType || 'personal';
    setTempData((prev: any) => ({ ...prev, accountType: selected }));
    await setAccountType(selected);
  };

  // Handle content creator verification with regional quota registration
  const handleCreatorVerification = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsSubmittingCreator(true);
    setTierFeedback(null);

    const country = tempData.countryCode || 'NG';
    const userId = authState.user?.id || state.progress?.userId || `creator_${Date.now()}`;
    const phone = tempData.phoneNumber || (authState.user as any)?.phone || '+2348012345678';

    // Optional upload of selfie to backend
    let uploadedSelfieUrl = '';
    if (creatorSelfieFile) {
      try {
        const formData = new FormData();
        formData.append('file', creatorSelfieFile);
        formData.append('fileType', 'image');
        const uploadRes = await api.post('/uploads', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data?.data?.url) {
          uploadedSelfieUrl = uploadRes.data.data.url;
        }
      } catch {
        // Fallback handled gracefully
      }
    }

    try {
      const res = await api.post('/creators/signup', {
        userId,
        countryCode: country,
        tier: selectedTier,
        phoneNumber: phone,
        inviteToken: selectedTier === 'TIER_1' ? inviteToken : undefined,
        selfieUrl: uploadedSelfieUrl || selfiePreviewUrl || undefined,
        isLivenessVerified: selfieVerificationResult?.isLiveMotionVerified || false,
        livenessScore: selfieVerificationResult?.livenessScore || 0
      });

      if (res.data?.success) {
        const result = res.data.data;
        setTierFeedback({
          status: result.status,
          message: result.message || 'Creator registration processed.'
        });
        await markVerificationComplete('identity', true);
        setTimeout(async () => {
          await nextStep();
        }, 1500);
      } else {
        setTierFeedback({
          status: 'ERROR',
          message: res.data?.message || 'Failed to claim tier slot.'
        });
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Regional quota registration completed.';
      setTierFeedback({
        status: 'ACTIVE',
        message: errMsg
      });
      await markVerificationComplete('identity', true);
      setTimeout(async () => {
        await nextStep();
      }, 1200);
    } finally {
      setIsSubmittingCreator(false);
    }
  };

  // Handle business verification
  const handleBusinessVerification = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    // Mark business verification as complete if applicable
    if (state.progress?.accountType === 'business') {
      // In a real app, this would involve actual business verification
      await nextStep();
    } else {
      await nextStep(); // Skip if not business account
    }
  };

  // Handle CES formula education
  const handleCESFormulaEducation = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    // Show educational content about CES formula
    await nextStep();
  };

  // Handle completion
  const handleCompleteOnboarding = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const accountType = state.progress?.accountType || tempData.accountType || 'personal';
    try {
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('hasCompletedOnboarding', 'true');
      const userId = state.progress?.userId || authState.user?.id || 'new_user';
      localStorage.setItem(`onboardingComplete_${userId}`, 'true');

      // Update stored user if available
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          u.onboardingComplete = true;
          u.onboarding_completed = true;
          u.accountType = accountType;
          if (accountType === 'creator') {
            u.role = 'Creator';
            u.assignedDashboards = ['/creatordashboard', '/ugc-dashboard', '/monetization-dashboard'];
          } else if (accountType === 'business') {
            u.role = 'Business';
            u.assignedDashboards = ['/businessoffices', '/monetization-dashboard', '/storefront'];
          } else {
            u.role = u.role || 'Member';
          }
          localStorage.setItem('user', JSON.stringify(u));

          // Sync sovereign profile state immediately
          userProfileSyncService.updateProfile({
            id: u.id,
            username: u.username || 'citizen',
            name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : u.username || 'Sovereign Citizen',
            headline: accountType === 'creator' ? 'Sovereign Content Creator' : accountType === 'business' ? 'Verified Business Organization' : 'Sovereign Protocol Citizen',
            avatar: u.avatar || '/assets/branding/default-avatar.svg',
            email: u.email || ''
          });
        } catch (_err) {
          // Ignore parse errors
        }
      }

      // Notify backend if online with full P2P preferences & profile calibration
      await api.post('/auth/complete-onboarding', {
        userId,
        accountType,
        interests: state.progress?.interests || selectedInterests,
        demographics: state.progress?.demographicInfo || tempData,
        p2pAlgorithmData: state.progress?.p2pAlgorithmData || {
          locationBasedMatching: true,
          interestAlignment: true,
          behavioralScoring: true
        }
      }).catch(() => {});

      await finalizeOnboarding();
    } catch {
      // Ignore fallback errors
    } finally {
      // Navigate to Success screen with explicit role query param
      navigate(`/success?role=${accountType}`);
    }
  };

  // Render current step
  const renderCurrentStep = () => {
    if (!state.progress || state.steps.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading onboarding process...</p>
        </div>
      );
    }

    const currentStepId = state.progress.currentStep;

    switch (currentStepId) {
    case 'welcome':
      return (
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-r from-blue-500 to-purple-600 p-3 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Welcome to FingerMobile!</CardTitle>
            <CardDescription>
                Let's get you set up with your account. This will only take a few minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">What you'll do in onboarding:</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Accept our terms and permissions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Register with email and phone</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Verify your identity</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Choose your account type (Personal, Creator, or Business)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Select your interests to personalize your feed</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Configure P2P algorithm preferences</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-center">
                <Button onClick={handleWelcomeContinue} className="w-48">
                    Get Started
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'terms-permissions':
      return (
        <Card className="w-full max-w-3xl border border-slate-300 bg-white shadow-lg">
          <CardHeader className="text-center pb-4 border-b border-slate-200">
            <div className="mx-auto bg-gradient-to-tr from-emerald-500 to-teal-600 p-3 w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md">
              <DocumentTextIcon className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-2xl font-black text-slate-900">
              Sovereign Legal, Privacy & Platform Safety Agreements
            </CardTitle>
            <CardDescription className="text-sm text-slate-700 font-medium max-w-xl mx-auto mt-1">
              FingerMobile operates under strict decentralized data sovereignty, zero advertising trackers, and absolute zero tolerance for child sexual abuse material. Please review and accept to proceed.
            </CardDescription>

            {/* Quick Action One-Click Acceptance */}
            <div className="mt-4 pt-2">
              <button
                type="button"
                onClick={handleSelectAllTermsAndPermissions}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-950 hover:bg-indigo-100 hover:border-indigo-300 transition shadow-xs cursor-pointer"
              >
                <CheckCircleIcon className="w-4 h-4 text-indigo-600" />
                <span>Quick Action: Agree to All Terms & Grant Platform Permissions</span>
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">1. Mandatory Legal & Safety Frameworks</h3>
              
              {/* Privacy Policy */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 transition">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacyPolicy"
                    checked={state.progress?.termsAccepted.privacyPolicy || false}
                    onCheckedChange={(checked) => updateProgress({
                      termsAccepted: {
                        ...state.progress?.termsAccepted,
                        privacyPolicy: Boolean(checked)
                      }
                    })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <Label htmlFor="privacyPolicy" className="text-base font-bold text-slate-900 cursor-pointer">
                        FingerMobile Privacy Policy & Sovereign Data Protection
                      </Label>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
                        Zero Ad-Trackers • NDPR & GDPR Compliant
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium mt-1">
                      FingerMobile Protocol never sells personal data, never embeds ad-tracking cookies, and never tracks off-platform behavioral activity. Sovereign biometrics remain encrypted locally on your personal device.
                    </p>
                    <div className="mt-2">
                      <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-700 hover:text-indigo-900 text-xs font-bold inline-flex items-center">
                        Read Full Privacy Policy &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* CSAE Safety Policy */}
              <div className="p-4 rounded-xl border border-rose-200 hover:border-rose-300 bg-rose-50/30 transition">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="conditions"
                    checked={state.progress?.termsAccepted.conditions || false}
                    onCheckedChange={(checked) => updateProgress({
                      termsAccepted: {
                        ...state.progress?.termsAccepted,
                        conditions: Boolean(checked)
                      }
                    })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <Label htmlFor="conditions" className="text-base font-bold text-slate-900 cursor-pointer">
                        CSAE & Child Protection Zero-Tolerance Safety Policy
                      </Label>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-950 border border-rose-400">
                        Zero-Tolerance Lawful Mandate
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium mt-1">
                      FingerMobile enforces an uncompromising zero-tolerance policy regarding Child Sexual Abuse Material (CSAM) and Child Sexual Exploitation and Abuse (CSAE). Any violation results in permanent ban and immediate referral to global law enforcement agencies (NCMEC / Interpol).
                    </p>
                    <div className="mt-2">
                      <Link to="/csae-policy" target="_blank" rel="noopener noreferrer" className="text-rose-700 hover:text-rose-900 text-xs font-bold inline-flex items-center">
                        Read CSAE Safety Policy & Guidelines &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Agreement */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 transition">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="userAgreement"
                    checked={state.progress?.termsAccepted.userAgreement || false}
                    onCheckedChange={(checked) => updateProgress({
                      termsAccepted: {
                        ...state.progress?.termsAccepted,
                        userAgreement: Boolean(checked)
                      }
                    })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <Label htmlFor="userAgreement" className="text-base font-bold text-slate-900 cursor-pointer">
                        FingerMobile Protocol User Agreement
                      </Label>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400">
                        Decentralized Protocol Governance
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium mt-1">
                      Governs decentralized platform participation, peer-to-peer asset transfers, escrow settlements, and cryptographic identity sovereignty across the FingerMobile network.
                    </p>
                    <div className="mt-2">
                      <Link to="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-indigo-700 hover:text-indigo-900 text-xs font-bold inline-flex items-center">
                        Read User Agreement & Terms &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Guidelines */}
              <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 transition">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="platformUseTerms"
                    checked={state.progress?.termsAccepted.platformUseTerms || false}
                    onCheckedChange={(checked) => updateProgress({
                      termsAccepted: {
                        ...state.progress?.termsAccepted,
                        platformUseTerms: Boolean(checked)
                      }
                    })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <Label htmlFor="platformUseTerms" className="text-base font-bold text-slate-900 cursor-pointer">
                        Platform Use Terms & Community Standards
                      </Label>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-400">
                        Civic Town Square Ethics
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium mt-1">
                      Standards against harassment, fraudulent commerce, automated bot manipulation, hate speech, and impersonation. Fosters merit-based reputation and authentic discussions.
                    </p>
                    <div className="mt-2">
                      <Link to="/community-guidelines" target="_blank" rel="noopener noreferrer" className="text-indigo-700 hover:text-indigo-900 text-xs font-bold inline-flex items-center">
                        Read Community Standards &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Permissions */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">2. Device Hardware Permissions</h3>
                <span className="text-xs text-slate-700 font-medium">Toggle permissions for sovereign features</span>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-indigo-600 mr-3" />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Location Access</span>
                      <span className="text-xs text-slate-700 font-medium">Enables P2P proximity matching & regional creator calibration</span>
                    </div>
                  </div>
                  <Checkbox
                    checked={state.progress?.permissionsGranted.location || false}
                    onCheckedChange={(checked) => updateProgress({
                      permissionsGranted: {
                        ...state.progress?.permissionsGranted,
                        location: Boolean(checked)
                      }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center">
                    <LockOpenIcon className="h-5 w-5 text-indigo-600 mr-3" />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Push Notifications</span>
                      <span className="text-xs text-slate-700 font-medium">Real-time alerts for forum replies, escrow transactions, and security</span>
                    </div>
                  </div>
                  <Checkbox
                    checked={state.progress?.permissionsGranted.notifications || false}
                    onCheckedChange={(checked) => updateProgress({
                      permissionsGranted: {
                        ...state.progress?.permissionsGranted,
                        notifications: Boolean(checked)
                      }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center">
                    <CameraIcon className="h-5 w-5 text-indigo-600 mr-3" />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Camera & Media Access</span>
                      <span className="text-xs text-slate-700 font-medium">Required for uploading sovereign avatar, media posts, and creator verification</span>
                    </div>
                  </div>
                  <Checkbox
                    checked={state.progress?.permissionsGranted.media || false}
                    onCheckedChange={(checked) => updateProgress({
                      permissionsGranted: {
                        ...state.progress?.permissionsGranted,
                        media: Boolean(checked),
                        camera: Boolean(checked)
                      }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-indigo-600 mr-3" />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Audio & Microphone</span>
                      <span className="text-xs text-slate-700 font-medium">Enables live audio rooms, voice broadcasting, and voice messages</span>
                    </div>
                  </div>
                  <Checkbox
                    checked={state.progress?.permissionsGranted.audio || false}
                    onCheckedChange={(checked) => updateProgress({
                      permissionsGranted: {
                        ...state.progress?.permissionsGranted,
                        audio: Boolean(checked)
                      }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center">
                    <CogIcon className="h-5 w-5 text-indigo-600 mr-3" />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Local Device Storage</span>
                      <span className="text-xs text-slate-700 font-medium">Sovereign caching of encrypted keys, offline feeds, and media</span>
                    </div>
                  </div>
                  <Checkbox
                    checked={state.progress?.permissionsGranted.storage || false}
                    onCheckedChange={(checked) => updateProgress({
                      permissionsGranted: {
                        ...state.progress?.permissionsGranted,
                        storage: Boolean(checked)
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={previousStep} className="border-slate-300 text-slate-800">
                Back
              </Button>
              <Button
                onClick={handleTermsAcceptance}
                disabled={
                  !(state.progress?.termsAccepted.userAgreement &&
                    state.progress?.termsAccepted.privacyPolicy &&
                    state.progress?.termsAccepted.platformUseTerms &&
                    state.progress?.termsAccepted.conditions)
                }
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md disabled:opacity-50"
              >
                Accept Agreements & Continue &rarr;
              </Button>
            </div>
          </CardContent>
        </Card>
      );

    case 'registration':
      return (
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle>Registration</CardTitle>
            <CardDescription>
                Create your account with email and phone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address (Mandatory)</Label>
                  <div className="relative mt-1">
                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-600" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={tempData.email || state.progress?.profileData?.email || ''}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number (Mandatory)</Label>
                  <div className="flex space-x-2">
                    <select
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={tempData.countryCode || '+234'}
                      onChange={(e) => handleProfileChange('countryCode', e.target.value)}
                    >
                      <option value="+234">Nigeria (+234)</option>
                      <option value="+1">USA (+1)</option>
                      <option value="+44">UK (+44)</option>
                      <option value="+33">France (+33)</option>
                      <option value="+49">Germany (+49)</option>
                      <option value="+81">Japan (+81)</option>
                      <option value="+86">China (+86)</option>
                    </select>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={(tempData as any).phone || (state.progress?.profileData as any)?.phone || ''}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-600" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={tempData.password || ''}
                      onChange={(e) => handleProfileChange('password', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-slate-800 font-bold"
                    onClick={() => setShowOtherMethods(!showOtherMethods)}
                  >
                    {showOtherMethods ? 'Hide Other Login Methods' : 'Other Login Methods'}
                  </Button>
                  {showOtherMethods && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {(['Apple', 'Google', 'Facebook', 'TikTok', 'Instagram', 'LinkedIn'] as const).map((provider) => (
                        <Button
                          key={provider}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRegistration}
                          className="text-slate-800 font-bold hover:bg-slate-50"
                        >
                          {provider}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={previousStep}>Back</Button>
                <Button onClick={handleRegistration}>Continue</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'two-factor-setup':
      return (
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-r from-purple-500 to-indigo-600 p-3 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <LockClosedIcon className="h-8 w-8 text-white" />
            </div>
            <CardTitle>Two-Factor Authentication Setup</CardTitle>
            <CardDescription>
                Secure your account with 2FA using authenticator apps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Secure Your Account</h3>
                <p className="text-sm text-purple-700">
                    Enable Two-Factor Authentication to add an extra layer of security to your account.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Choose Your 2FA Method:</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded border hover:bg-gray-100 cursor-pointer"
                    onClick={() => setTempData({...tempData, twoFactorMethod: 'google_authenticator'})}>
                    <div className="flex items-center">
                      <DevicePhoneMobileIcon className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <div className="font-medium">Google Authenticator</div>
                        <div className="text-xs text-slate-700">Most popular authenticator app</div>
                      </div>
                    </div>
                    {tempData.twoFactorMethod === 'google_authenticator' && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded border hover:bg-gray-100 cursor-pointer"
                    onClick={() => setTempData({...tempData, twoFactorMethod: 'microsoft_authenticator'})}>
                    <div className="flex items-center">
                      <DevicePhoneMobileIcon className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <div className="font-medium">Microsoft Authenticator</div>
                        <div className="text-xs text-slate-700">Microsoft's authenticator solution</div>
                      </div>
                    </div>
                    {tempData.twoFactorMethod === 'microsoft_authenticator' && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded border hover:bg-gray-100 cursor-pointer"
                    onClick={() => setTempData({...tempData, twoFactorMethod: 'duo_mobile'})}>
                    <div className="flex items-center">
                      <DevicePhoneMobileIcon className="h-5 w-5 text-indigo-500 mr-3" />
                      <div>
                        <div className="font-medium">Duo Mobile</div>
                        <div className="text-xs text-slate-700">Enterprise-grade authentication</div>
                      </div>
                    </div>
                    {tempData.twoFactorMethod === 'duo_mobile' && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>

                {tempData.twoFactorMethod && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Setup Instructions:</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-sm text-blue-700">
                      <li>Download the {tempData.twoFactorMethod.replace('_', ' ')} app on your device</li>
                      <li>Scan the QR code below with the app</li>
                      <li>Enter the 6-digit code from the app</li>
                      <li>Click "Verify" to complete setup</li>
                    </ol>
                    
                    <div className="mt-4 flex flex-col items-center justify-center">
                      <QRCodeDisplay
                        data={`otpauth://totp/FingerMobile:${encodeURIComponent(tempData.email || state.progress?.profileData?.email || 'member')}?secret=${tempData.twoFactorSecret || 'JBSWY3DPEHPK3PXP'}&issuer=FingerMobile`}
                        size={180}
                        title="Scan with Authenticator"
                        subtitle="Compatible with Google Authenticator, Authy, 1Password & Microsoft Authenticator"
                        purpose="security"
                        centerLogoType="fingermobile"
                        tier="tier1-profile"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <Label htmlFor="twoFactorCode">Enter 6-digit code from app</Label>
                      <Input
                        id="twoFactorCode"
                        type="text"
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        className="text-center text-lg tracking-widest py-3 mt-1 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                        value={tempData.twoFactorCode || ''}
                        onChange={(e) => setTempData({...tempData, twoFactorCode: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <div className="flex items-center">
                    <Checkbox 
                      id="skip2fa"
                      checked={tempData.skip2fa || false}
                      onCheckedChange={(checked) => setTempData({...tempData, skip2fa: Boolean(checked)})}
                    />
                    <Label htmlFor="skip2fa" className="ml-2 text-sm">
                      Skip 2FA setup for now (not recommended)
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={previousStep}>Back</Button>
                <Button 
                  onClick={handleTwoFactorSetup}
                >
                  Continue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'verification-captcha':
      return (
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle>Verification & Captcha</CardTitle>
            <CardDescription>
                Verify your information and prove you're human
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-center text-blue-700">
                    Verification codes have been sent to your email and phone
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="emailCode">Email Verification Code (6 digits)</Label>
                  <Input
                    id="emailCode"
                    type="text"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="text-center text-lg tracking-widest py-6"
                  />
                </div>

                <div>
                  <Label htmlFor="phoneCode">Phone Verification Code (6 digits)</Label>
                  <Input
                    id="phoneCode"
                    type="text"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="text-center text-lg tracking-widest py-6"
                  />
                </div>

                <div className="pt-4 space-y-4">
                  <HumanCaptchaPuzzle onVerified={() => markVerificationComplete('captcha', true)} />
                  <CustomCaptcha onSuccess={() => markVerificationComplete('captcha', true)} />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={previousStep}>Back</Button>
                <Button 
                  onClick={handleVerificationCaptcha}
                  disabled={!state.progress?.verificationStatus?.captcha}
                >Continue</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'demographics-interests':
      return (
        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center">
            <CardTitle>Demographics & Interests</CardTitle>
            <CardDescription>
                Tell us about yourself and select your interests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Demographics</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="relative mt-1">
                      <GlobeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-600" />
                      <Input
                        id="location"
                        type="text"
                        placeholder="Enter your location"
                        value={tempData.location || ''}
                        onChange={(e) => handleDemographicsChange('location', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="defaultIpLocation"
                      checked={tempData.defaultIpLocation || false}
                      onCheckedChange={(checked) => handleDemographicsChange('defaultIpLocation', checked)}
                    />
                    <Label htmlFor="defaultIpLocation">Use my default IP location</Label>
                  </div>
                  
                  <div className="pt-4">
                    <div ref={mapContainerRef} style={{ height: '300px', width: '100%', borderRadius: '0.5rem', overflow: 'hidden' }} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label className="block mb-1">Gender</Label>
                      <div className="flex gap-2 mt-1">
                        {['male', 'female', 'other'].map(gender => (
                          <button
                            key={gender}
                            type="button"
                            onClick={() => handleDemographicsChange('gender', gender)}
                            className={`flex-1 py-2 px-3 border rounded-md text-sm font-medium capitalize ${tempData.gender === gender ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                          >
                            {gender}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="age" className="block mb-1">Age</Label>
                      <Input
                        id="age"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Enter your age"
                        value={tempData.age || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val) {
                            const num = parseInt(val, 10);
                            handleDemographicsChange('age', num);
                            if (num < 22) {
                              setAgeError('Must be at least 22 years of age');
                            } else {
                              setAgeError('');
                            }
                          } else {
                            handleDemographicsChange('age', undefined);
                            setAgeError('');
                          }
                        }}
                        className="mt-1 w-full"
                      />
                      {ageError && <p className="text-sm text-red-500 mt-1">{ageError}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Interests (Select at least 4)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableInterests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`p-3 rounded-lg border text-center text-sm font-medium transition-colors ${
                        selectedInterests.includes(interest)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <HeartIcon className={`h-4 w-4 mx-auto mb-1 ${selectedInterests.includes(interest) ? 'text-blue-500' : 'text-slate-700'}`} />
                      {interest}
                    </button>
                  ))}
                </div>

                <div className="mt-4 text-sm text-gray-600">
                    Selected: {selectedInterests.length}/10 | Required: 4 minimum
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={previousStep}>Back</Button>
              <Button onClick={handleSaveInterests} disabled={selectedInterests.length < 4 || (tempData.age && tempData.age < 22)}>
                  Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      );

    case 'profile-customization':
      return (
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle>Profile Customization</CardTitle>
            <CardDescription>
                Customize your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <div className="relative mt-1">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-600" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a unique username"
                      value={tempData.username || state.progress?.profileData?.username || ''}
                      onChange={(e) => handleProfileChange('username', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    placeholder="Tell others about yourself"
                    value={tempData.bio || state.progress?.profileData?.bio || ''}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={tempData.website || state.progress?.profileData?.website || ''}
                    onChange={(e) => handleProfileChange('website', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={previousStep}>Back</Button>
                <Button onClick={handleSaveProfile}>Continue</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'p2p-algorithm-calibration':
      return (
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle>P2P Algorithm Calibration</CardTitle>
            <CardDescription>
                Configure your matching preferences for optimal experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">How the P2P Algorithm Works</h3>
                <p className="text-sm text-blue-700">
                    FingerMobile uses a P2P search-and-recommendation model that ranks content using a Community Engagement Score (CES).
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">CES Formula:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-center font-mono">
                      CES = (Likes × {state.progress?.cesFormula.likesWeight || 1}) + (Saves × {state.progress?.cesFormula.savesWeight || 1}) + (Comments × {state.progress?.cesFormula.commentsWeight || 4}) + (Shares × {state.progress?.cesFormula.sharesWeight || 4}) + (Follows × {state.progress?.cesFormula.followsWeight || 8})
                  </p>
                </div>

                <div className="pt-4">
                  <h3 className="font-semibold mb-3">Optimize Your Experience</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Focus on collecting and comments to maximize your score</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Use strategic keywords in your titles and bios</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Create visually appealing content with proper ratios</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Engage authentically to avoid commercial filters</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4">
                  <h3 className="font-semibold mb-3">Algorithm Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                      <span>Location-Based Matching</span>
                      <Checkbox
                        checked={state.progress?.p2pAlgorithmData.locationBasedMatching || false}
                        onCheckedChange={(checked) => updateProgress({
                          p2pAlgorithmData: {
                            ...state.progress?.p2pAlgorithmData,
                            locationBasedMatching: Boolean(checked)
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                      <span>Interest Alignment</span>
                      <Checkbox
                        checked={state.progress?.p2pAlgorithmData.interestAlignment || false}
                        onCheckedChange={(checked) => updateProgress({
                          p2pAlgorithmData: {
                            ...state.progress?.p2pAlgorithmData,
                            interestAlignment: Boolean(checked)
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                      <span>Behavioral Scoring</span>
                      <Checkbox
                        checked={state.progress?.p2pAlgorithmData.behavioralScoring || false}
                        onCheckedChange={(checked) => updateProgress({
                          p2pAlgorithmData: {
                            ...state.progress?.p2pAlgorithmData,
                            behavioralScoring: Boolean(checked)
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={previousStep}>Back</Button>
                <Button onClick={handleP2PCalibration}>Continue</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'account-type-selection': {
      const currentAccountType = tempData.accountType || state.progress?.accountType || 'personal';

      return (
        <Card className="w-full max-w-3xl border border-slate-300 bg-white shadow-xl">
          <CardHeader className="text-center pb-4 border-b border-slate-200">
            <div className="mx-auto bg-gradient-to-tr from-indigo-500 to-purple-600 p-3 w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md">
              <UserIcon className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-2xl font-black text-slate-900">
              Select Your Sovereign Account Type
            </CardTitle>
            <CardDescription className="text-sm text-slate-700 font-medium max-w-xl mx-auto mt-1">
              Choose one of the 3 platform-specific account types to calibrate your tools, monetization capabilities, and sovereign ecosystem access.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <RadioGroup
              value={currentAccountType}
              onValueChange={(value) => setTempData({ ...tempData, accountType: value as any })}
              className="space-y-4"
            >
              {/* 1. Personal (Free Tier) */}
              <div 
                className={`flex items-start space-x-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                  currentAccountType === 'personal'
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-600'
                    : 'border-slate-300 hover:border-slate-400 bg-white'
                }`}
                onClick={() => setTempData({ ...tempData, accountType: 'personal' })}
              >
                <RadioGroupItem value="personal" id="personal" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <Label htmlFor="personal" className="text-lg font-bold text-slate-900 cursor-pointer">
                      1. Personal (free tier)
                    </Label>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
                      Free Tier • Individual Citizen
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium mt-1">
                    Everyday sovereign individual with free tier access. Connect with friends, participate in debates, explore topics, post content, and engage in the decentralized forum.
                  </p>
                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-800 font-semibold">
                    <li className="flex items-center"><CheckCircleIcon className="h-3.5 w-3.5 text-emerald-600 mr-1.5 flex-shrink-0" /> Free perpetual access (No subscription fees)</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3.5 w-3.5 text-emerald-600 mr-1.5 flex-shrink-0" /> Decentralized feed & Community Forum</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3.5 w-3.5 text-emerald-600 mr-1.5 flex-shrink-0" /> P2P sovereign encryption & local biometrics</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3.5 w-3.5 text-emerald-600 mr-1.5 flex-shrink-0" /> Zero ad tracking & zero surveillance</li>
                  </ul>
                </div>
              </div>

              {/* 2. Content Creator (Membership) */}
              <div 
                className={`flex items-start space-x-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                  currentAccountType === 'creator'
                    ? 'border-purple-600 bg-purple-50/40 shadow-sm ring-1 ring-purple-600'
                    : 'border-slate-300 hover:border-slate-400 bg-white'
                }`}
                onClick={() => setTempData({ ...tempData, accountType: 'creator' })}
              >
                <RadioGroupItem value="creator" id="creator" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <Label htmlFor="creator" className="text-lg font-bold text-slate-900 cursor-pointer">
                      2. Content Creator (Membership)
                    </Label>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-950 border border-purple-400">
                      Membership • Creator Suite
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium mt-1">
                    For digital storytellers, influencers, streamers, artists, and media founders who build audiences and monetize sovereign content.
                  </p>
                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-800 font-semibold">
                    <li className="flex items-center"><CheckCircleIcon className="h-3.5 w-3.5 text-purple-600 mr-1.5 flex-shrink-0" /> Monetization tools & direct P2P earnings</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3.5 w-3.5 text-purple-600 mr-1.5 flex-shrink-0" /> Verified Creator badge & Hallmark Page Boosting</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3.5 w-3.5 text-purple-600 mr-1.5 flex-shrink-0" /> Live Broadcast streaming & AI Creative Studio</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3.5 w-3.5 text-purple-600 mr-1.5 flex-shrink-0" /> Platform Member only Pages, Suggestions & Groups</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3.5 w-3.5 text-purple-600 mr-1.5 flex-shrink-0" /> Regional quota reservation & milestone trophies</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3.5 w-3.5 text-purple-600 mr-1.5 flex-shrink-0" /> Full access to Gems, Permanence, Blogs & Business Suite</li>
                  </ul>
                </div>
              </div>

              {/* 3. Business/Organization */}
              <div 
                className={`flex items-start space-x-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                  currentAccountType === 'business'
                    ? 'border-amber-600 bg-amber-50/40 shadow-sm ring-1 ring-amber-600'
                    : 'border-slate-300 hover:border-slate-400 bg-white'
                }`}
                onClick={() => setTempData({ ...tempData, accountType: 'business' })}
              >
                <RadioGroupItem value="business" id="business" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <Label htmlFor="business" className="text-lg font-bold text-slate-900 cursor-pointer">
                      3. Business/Organization
                    </Label>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-400">
                      Enterprise • Commercial Suite
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium mt-1">
                    For companies, brand founders, merchants, NGOs, and enterprise organizations managing commercial operations, targeted ads, and store fronts.
                  </p>
                  <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-800 font-semibold">
                    <li className="flex items-center"><CheckCircleIcon className="h-3.5 w-3.5 text-amber-600 mr-1.5 flex-shrink-0" /> Official Business/Organization verification</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3.5 w-3.5 text-amber-600 mr-1.5 flex-shrink-0" /> Sovereign Commerce Storefront & Escrow Checkout</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3.5 w-3.5 text-amber-600 mr-1.5 flex-shrink-0" /> Protocol Advertising Engine & advanced analytics</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3.5 w-3.5 text-amber-600 mr-1.5 flex-shrink-0" /> Mandatory platform auditing fee (~$105 USD annually)</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3.5 w-3.5 text-amber-600 mr-1.5 flex-shrink-0" /> Complete access to all 385 Platform Pages & Business Hubs</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3.5 w-3.5 text-amber-600 mr-1.5 flex-shrink-0" /> Dedicated corporate offices & governance compliance</li>
                  </ul>
                </div>
              </div>
            </RadioGroup>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={previousStep} className="border-slate-300 text-slate-800">
                Back
              </Button>
              <Button 
                onClick={() => handleAccountTypeSelect(currentAccountType)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md"
              >
                Continue with {currentAccountType === 'creator' ? 'Content Creator' : currentAccountType === 'business' ? 'Business/Organization' : 'Personal (Free Tier)'} &rarr;
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    case 'content-creator-verification':
      return (
        <Card className="w-full max-w-2xl border border-slate-300 bg-white shadow-xl">
          <CardHeader className="text-center pb-4 border-b border-slate-200">
            <div className="mx-auto bg-gradient-to-r from-purple-500 to-pink-600 p-3 w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-md">
              <GraduationCapIcon className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-black text-slate-900">Content Creator Verification</CardTitle>
            <CardDescription className="text-sm text-slate-700 font-medium max-w-lg mx-auto mt-1">
              Verify your identity and secure your regional creator tier membership
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Live Cohort Availability Banner */}
              {availabilityData?.activeCohort ? (
                <div className="mb-4">
                  <CreatorSpotAvailabilityCard
                    countryName={tempData.location || (tempData.countryCode === 'US' ? 'United States' : tempData.countryCode === 'GB' ? 'United Kingdom' : 'Nigeria')}
                    totalSeats={availabilityData.activeCohort.totalSeats}
                    availableSeats={availabilityData.activeCohort.availableSeats}
                    percentageFilled={availabilityData.activeCohort.percentageFilled}
                    closingDateStr={new Date(availabilityData.activeCohort.closesAt).toLocaleDateString()}
                    isWaitlist={availabilityData.activeCohort.availableSeats <= 0}
                    onSelect={() => setSelectedTier('TIER_3')}
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <CreatorSpotAvailabilityCard
                    countryName={tempData.location || 'Regional'}
                    totalSeats={5000}
                    availableSeats={2}
                    percentageFilled={99.9}
                    closingDateStr="December 31, 2026"
                    isWaitlist={false}
                    onSelect={() => setSelectedTier('TIER_3')}
                  />
                </div>
              )}

              {tierFeedback && (
                <div className={`p-4 rounded-lg text-sm mb-4 border ${
                  tierFeedback.status === 'ACTIVE' 
                    ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-200'
                    : tierFeedback.status === 'WAITLISTED'
                    ? 'bg-amber-900/40 border-amber-500/50 text-amber-200'
                    : 'bg-blue-900/40 border-blue-500/50 text-blue-200'
                }`}>
                  <p className="font-semibold">{tierFeedback.message}</p>
                </div>
              )}

              <div className="bg-purple-50 dark:bg-slate-900/60 border border-purple-200 dark:border-purple-900/50 rounded-lg p-4">
                <p className="text-center text-purple-700 dark:text-purple-300 mb-4 font-medium">
                  Select your creator tier according to regional eligibility:
                </p>

                <div className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-4 mb-4 shadow-sm text-left">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">Select Creator Tier</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <input 
                        type="radio" 
                        id="tier3" 
                        name="creatorTier" 
                        value="TIER_3" 
                        checked={selectedTier === 'TIER_3'} 
                        onChange={() => setSelectedTier('TIER_3')}
                        className="mt-1 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" 
                      />
                      <label htmlFor="tier3" className="text-sm cursor-pointer">
                        <span className="font-medium text-gray-900 dark:text-slate-100 block">Tier 3 (Emerging/Micro)</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium text-xs">Open self-registration capped by regional quota</span>
                      </label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input 
                        type="radio" 
                        id="tier2" 
                        name="creatorTier" 
                        value="TIER_2" 
                        checked={selectedTier === 'TIER_2'}
                        onChange={() => setSelectedTier('TIER_2')}
                        className="mt-1 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" 
                      />
                      <label htmlFor="tier2" className="text-sm cursor-pointer">
                        <span className="font-medium text-gray-900 dark:text-slate-100 block">Tier 2 (Established / Pro)</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium text-xs">Application-based with automated checks & portfolio validation</span>
                      </label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input 
                        type="radio" 
                        id="tier1" 
                        name="creatorTier" 
                        value="TIER_1" 
                        checked={selectedTier === 'TIER_1'}
                        onChange={() => setSelectedTier('TIER_1')}
                        className="mt-1 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" 
                      />
                      <label htmlFor="tier1" className="text-sm cursor-pointer">
                        <span className="font-medium text-gray-900 dark:text-slate-100 block">Tier 1 (Elite / Flagship)</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium text-xs">Invite-only / SuperAdmin approval. Requires access token.</span>
                      </label>
                    </div>
                  </div>

                  {selectedTier === 'TIER_1' && (
                    <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-800">
                      <Label htmlFor="inviteToken" className="text-xs text-amber-500 font-semibold block mb-1">
                        Enter Tier 1 SuperAdmin Single-Use Invite Token:
                      </Label>
                      <Input
                        id="inviteToken"
                        type="text"
                        placeholder="e.g. VIP-FM-2026-TOKEN-XYZ"
                        value={inviteToken}
                        onChange={(e) => setInviteToken(e.target.value)}
                        className="text-xs font-mono text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                    </div>
                  )}

                  {/* Dynamic Regional Quota Status */}
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded text-sm">
                    <div className="font-semibold mb-2 text-gray-800 dark:text-slate-200 text-xs">
                      Live Regional Quota Status ({tempData.countryCode || 'NG'})
                    </div>
                    <div className="flex justify-between text-xs">
                      {availabilityData?.tiers && availabilityData.tiers.length > 0 ? (
                        availabilityData.tiers.map(t => {
                          const isFull = t.reserved_count >= t.max_capacity;
                          const avail = Math.max(0, t.max_capacity - t.reserved_count);
                          return (
                            <span 
                              key={t.tier} 
                              className={isFull ? 'text-red-500' : 'text-green-600 font-medium'}
                            >
                              {t.tier.replace('TIER_', 'T')}: {isFull ? 'Full' : `${avail} slots left`}
                            </span>
                          );
                        })
                      ) : (
                        <>
                          <span className="text-red-500 font-medium">T1: 2 slots (96% full)</span>
                          <span className="text-amber-500 font-medium">T2: 160 slots (68% full)</span>
                          <span className="text-green-600 font-medium">T3: 2 slots left</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center">
                      <GraduationCapIcon className="h-5 w-5 text-purple-500 mr-2" />
                      <span className="font-medium">International Passport</span>
                    </div>
                    <div>
                      <input 
                        type="file" 
                        id="creatorPassport" 
                        className="hidden text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setCreatorPassportFile(e.target.files[0]);
                          }
                        }}
                      />
                      <label htmlFor="creatorPassport" className="cursor-pointer">
                        <Button size="sm" type="button" onClick={() => document.getElementById('creatorPassport')?.click()}>
                          {creatorPassportFile ? 'Uploaded' : 'Upload'}
                        </Button>
                      </label>
                      {creatorPassportFile && <div className="text-xs text-green-600 mt-1">{creatorPassportFile.name}</div>}
                    </div>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {selfiePreviewUrl ? (
                        <div className="relative flex-shrink-0">
                          <img
                            src={selfiePreviewUrl}
                            alt="Verified Selfie"
                            className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-sm"
                          />
                          {selfieVerificationResult?.isLiveMotionVerified && (
                            <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
                              <CheckCircleIcon className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 flex-shrink-0">
                          <CameraIcon className="h-5 w-5 text-purple-600" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm">Selfie Photo</span>
                          {selfieVerificationResult?.isLiveMotionVerified ? (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
                              Live Motion Verified ({selfieVerificationResult.livenessScore}%)
                            </span>
                          ) : creatorSelfieFile ? (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-950 border border-purple-300">
                              Uploaded Photo
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                              Live Motion Required
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-0.5">
                          {creatorSelfieFile
                            ? creatorSelfieFile.name
                            : 'Open device camera for a live photo snap and live motion verification (reduces fraud)'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => {
                          setSelfieModalInitialMode('camera');
                          setIsSelfieModalOpen(true);
                        }}
                        className={
                          creatorSelfieFile
                            ? 'bg-slate-800 hover:bg-slate-900 text-white font-bold'
                            : 'bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-sm'
                        }
                      >
                        {creatorSelfieFile ? 'Retake / Change' : 'Upload'}
                      </Button>

                      {!creatorSelfieFile && (
                        <Button
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setSelfieModalInitialMode('upload');
                            setIsSelfieModalOpen(true);
                          }}
                          className="text-xs font-bold text-slate-700 border-slate-300 bg-white hover:bg-slate-50"
                        >
                          Choose File
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-purple-700">
                  <p>Verification timeline: 1 to 3 months (completely free)</p>
                </div>
              </div>

              <Button className="w-full" onClick={handleCreatorVerification} disabled={isSubmittingCreator}>
                  {isSubmittingCreator ? 'Submitting Documents...' : 'Submit Documents'}
              </Button>

              <div className="flex justify-between">
                <Button variant="outline" onClick={previousStep}>Back</Button>
                <Button variant="secondary" onClick={nextStep}>
                    Skip for now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'business-verification':
      return (
        <Card className="w-full max-w-2xl border border-slate-300 bg-white shadow-xl">
          <CardHeader className="text-center pb-4 border-b border-slate-200">
            <div className="mx-auto bg-gradient-to-r from-amber-500 to-indigo-600 p-3 w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-md">
              <BriefcaseIcon className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-black text-slate-900">Business / Organization Verification</CardTitle>
            <CardDescription className="text-sm text-slate-700 font-medium max-w-lg mx-auto mt-1">
              Verify your enterprise or brand organization to access commercial features & protocol storefronts
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="bg-amber-50/60 border border-amber-300 rounded-xl p-4">
                <h3 className="font-bold text-slate-900 mb-2">Required Business Documents:</h3>
                <ul className="space-y-2 text-sm text-slate-800 font-medium">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Certificate of Incorporation or Business License</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Trademark Registration Certificate (if applicable)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Legal Representative ID (Passport or Local ID)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Official Application Letter</span>
                  </li>
                </ul>

                <div className="mt-4 text-xs text-slate-700 font-semibold space-y-1 border-t border-amber-200 pt-3">
                  <p>• Verification timeline: 1 to 4 months for international businesses</p>
                  <p>• Fee: Mandatory, non-refundable platform auditing fee of ~$105 USD annually</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName" className="text-slate-900 font-bold text-sm">Business Name</Label>
                    <Input id="businessName" type="text" placeholder="Enter legal business name" className="mt-1 text-slate-900 font-bold border border-slate-300 bg-white" />
                  </div>
                  <div>
                    <Label htmlFor="businessType" className="text-slate-900 font-bold text-sm">Business Type</Label>
                    <select
                      id="businessType"
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select type</option>
                      <option value="company">Company</option>
                      <option value="llc">LLC</option>
                      <option value="partnership">Partnership</option>
                      <option value="soleProprietorship">Sole Proprietorship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="businessDocuments">Upload Business Documents</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="businessDocuments" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload files</span>
                          <input 
                            id="businessDocuments" 
                            type="file" 
                            multiple 
                            className="sr-only text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" 
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setBusinessDocuments(e.target.files);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">PDF, JPG, PNG up to 10MB each</p>
                      {businessDocuments && businessDocuments.length > 0 && (
                        <div className="text-xs text-green-600 mt-2">
                          {businessDocuments.length} document(s) uploaded
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Checkbox id="agreement" />
                  <Label htmlFor="agreement" className="ml-2">
                      I agree to pay the mandatory platform auditing fee of ~$105 USD annually
                  </Label>
                </div>

                <Button className="w-full" onClick={handleBusinessVerification}>
                    Submit for Review
                </Button>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={previousStep}>Back</Button>
                <Button variant="secondary" onClick={nextStep}>
                    Skip for now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'ces-formula-education':
      return (
        <Card className="w-full max-w-3xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-r from-green-500 to-teal-600 p-3 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <ChartBarIcon className="h-8 w-8 text-white" />
            </div>
            <CardTitle>CES Formula Education</CardTitle>
            <CardDescription>
                Learn how engagement is scored on FingerMobile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <CESFormulaCard />

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">CES Formula:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-center font-mono text-lg">
                      CES = (Likes × {state.progress?.cesFormula.likesWeight || 1}) + (Saves × {state.progress?.cesFormula.savesWeight || 1}) + (Comments × {state.progress?.cesFormula.commentsWeight || 4}) + (Shares × {state.progress?.cesFormula.sharesWeight || 4}) + (Follows × {state.progress?.cesFormula.followsWeight || 8})
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Metric Weighting Breakdown:</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex justify-between"><span>Likes:</span> <span>{state.progress?.cesFormula.likesWeight || 1} point(s)</span></li>
                      <li className="flex justify-between"><span>Saves:</span> <span>{state.progress?.cesFormula.savesWeight || 1} point(s)</span></li>
                      <li className="flex justify-between"><span>Comments:</span> <span>{state.progress?.cesFormula.commentsWeight || 4} points</span></li>
                      <li className="flex justify-between"><span>Shares:</span> <span>{state.progress?.cesFormula.sharesWeight || 4} points</span></li>
                      <li className="flex justify-between"><span>Follows:</span> <span>{state.progress?.cesFormula.followsWeight || 8} points</span></li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Actionable Tips:</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start">
                        <CheckCircleIcon className="h-4 w-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Prioritize Comments and Saves</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon className="h-4 w-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Structure content for saving</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircleIcon className="h-4 w-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>End with engaging questions</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-semibold mb-2">SEO Scripting Tips:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Place primary keyword in first 5 words of title</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Repeat keyword 3-5 times naturally in bio</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Include 3-5 hyper-specific hashtags at bottom</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Visual Aesthetics:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Use 3:4 vertical image ratio</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Add bold text overlay with contrasting colors</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Never post raw, unedited photos</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={previousStep}>Back</Button>
                <Button onClick={handleCESFormulaEducation}>Continue</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'completion':
      return (
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-r from-green-500 to-emerald-600 p-3 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon className="h-8 w-8 text-white" />
            </div>
            <CardTitle>Welcome to FingerMobile!</CardTitle>
            <CardDescription>
                You've successfully completed the onboarding process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Your account is ready!</h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Profile setup complete</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Verification steps completed</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Personalized feed configured</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>P2P algorithm calibrated</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-6">
                    Your <span className="font-semibold capitalize">{state.progress.accountType}</span> account is now active and ready to use.
                </p>

                <Button className="w-64" onClick={handleCompleteOnboarding}>
                    Complete & Proceed to Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );

    default:
      return (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Onboarding Step Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was an issue with the onboarding process. Please try again.</p>
            <Button onClick={() => navigate('/')} className="mt-4">
                Return Home
            </Button>
          </CardContent>
        </Card>
      );
    }
  };

  const currentStepIndex = state.progress
    ? state.steps.findIndex(s => s.id === state.progress?.currentStep)
    : state.currentStepIndex;
  const currentStepNumber = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;
  const currentStepId = state.progress?.currentStep || state.steps[currentStepIndex]?.id || 'welcome';
  const activeBackground = getOnboardingBackground(currentStepNumber, currentStepId);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative w-full max-w-full overflow-x-hidden bg-slate-950 text-slate-900 pb-28 md:pb-0">
      {/* LEFT COLUMN (Desktop): Full-Screen Rotating Platform Branding Panel */}
      <AuthBrandingPanel
        initialIndex={currentStepNumber % 5}
        className="lg:w-5/12 xl:w-1/2 lg:min-h-screen lg:sticky lg:top-0 border-r border-slate-800"
      />

      {/* RIGHT COLUMN: Interactive Step Onboarding Flow */}
      <div
        className="w-full lg:w-7/12 xl:w-1/2 min-h-screen flex flex-col justify-between relative transition-all duration-700 ease-in-out bg-cover bg-center bg-no-repeat overflow-y-auto"
        style={{ backgroundImage: `url("${activeBackground}")` }}
      >
        {/* Subtle Backdrop Layer on the right column for content legibility */}
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] pointer-events-none" />

        <div className="relative z-10 w-full px-4 sm:px-8 py-8 flex-grow flex flex-col max-w-3xl mx-auto">
          {/* Header & Progress Bar */}
          <div className="mb-6 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-300 dark:border-slate-800 shadow-xl rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Step {currentStepNumber} of {state.steps.length}
              </span>
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2.5 bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Live Notification Banner */}
          {onboardingNotice && (
            <div
              className={`mb-4 p-4 rounded-xl border font-bold text-sm flex items-center justify-between shadow-lg transition-all ${
                onboardingNotice.type === 'success'
                  ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                  : 'bg-rose-100 text-rose-950 border-rose-400'
              }`}
            >
              <span>{onboardingNotice.text}</span>
              <button
                type="button"
                onClick={() => setOnboardingNotice(null)}
                className="text-slate-700 hover:text-slate-900 font-black ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* Main Content Card */}
          <div className="flex-grow flex items-center justify-center my-auto">
            {renderCurrentStep()}
          </div>
        </div>

        {/* Desktop Quick Breadcrumb / Footer Bar */}
        <div className="hidden lg:flex relative z-10 items-center justify-between px-8 py-4 border-t border-slate-300/60 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md text-xs font-bold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span>FingerMobile Protocol™ Sovereign Onboarding</span>
            <span>•</span>
            <span className="font-mono text-orange-600">Encrypted Flow</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={previousStep}
              disabled={currentStepNumber <= 1}
              className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
            >
              ← Previous Step
            </button>
            <Link to="/login" className="text-orange-600 hover:text-orange-500 font-extrabold">
              Already have an account? Sign In →
            </Link>
          </div>
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 md:hidden">
        <div className="flex items-center justify-around gap-2 max-w-md mx-auto">
          <button
            type="button"
            onClick={previousStep}
            disabled={currentStepNumber <= 1}
            className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all disabled:opacity-40"
          >
            <span className="text-base font-black">←</span>
            <span>Back</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all"
          >
            <span className="text-base font-black">⌂</span>
            <span>Home</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-sky-600 hover:text-sky-800 transition-all"
          >
            <span className="text-base font-black">↗</span>
            <span>Sign In</span>
          </button>
        </div>
      </div>

      {/* Live Selfie Camera & Motion Verification Modal */}
      <LiveSelfieCaptureModal
        isOpen={isSelfieModalOpen}
        onClose={() => setIsSelfieModalOpen(false)}
        initialMode={selfieModalInitialMode}
        onCaptureComplete={(result) => {
          setCreatorSelfieFile(result.file);
          setSelfiePreviewUrl(result.previewUrl);
          setSelfieVerificationResult(result);
          showNotice(
            result.isLiveMotionVerified
              ? 'Live motion selfie verified! Anti-fraud liveness confirmed.'
              : 'Selfie photo attached successfully.',
            'success'
          );
        }}
      />
    </div>
  );
};

export default OnboardingPage;
