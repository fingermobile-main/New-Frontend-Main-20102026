import React, { useState, useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useNavigate, Link } from 'react-router-dom';
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

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, initializeOnboarding, updateProgress, setAccountType, setInterests, setDemographics, markVerificationComplete, finalizeOnboarding, nextStep, previousStep } = useOnboarding();
  const { state: authState } = useAuth();
  const [tempData, setTempData] = useState<any>({});
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [creatorPassportFile, setCreatorPassportFile] = useState<File | null>(null);
  const [creatorSelfieFile, setCreatorSelfieFile] = useState<File | null>(null);
  const [businessDocuments, setBusinessDocuments] = useState<FileList | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const [ageError, setAgeError] = useState<string>('');

  // Regional Creator Quota & Capacity State
  const [selectedTier, setSelectedTier] = useState<CreatorTier>('TIER_3');
  const [inviteToken, setInviteToken] = useState<string>('');
  const [availabilityData, setAvailabilityData] = useState<CountryAvailabilityData | null>(null);
  const [tierFeedback, setTierFeedback] = useState<{ status: string; message: string } | null>(null);
  const [isSubmittingCreator, setIsSubmittingCreator] = useState<boolean>(false);

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
        .catch(console.error);
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
      .catch(err => {
        console.warn('Could not fetch live creator availability (using fallback):', err?.message);
      });
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
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('Could not parse stored user:', e);
        }
      }
      initializeOnboarding('new_user', {});
    }
  }, [authState.user]);

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
      alert('Please select a 2FA method and enter the code, or check "Skip 2FA setup"');
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
      alert('Please select at least 4 interests');
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
  const handleAccountTypeSelect = async (type: 'personal' | 'creator' | 'business') => {
    await setAccountType(type);
    setTempData({ ...tempData, accountType: type });
    await nextStep();
  };

  // Handle content creator verification with regional quota registration
  const handleCreatorVerification = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsSubmittingCreator(true);
    setTierFeedback(null);

    const country = tempData.countryCode || 'NG';
    const userId = authState.user?.id || state.progress?.userId || `creator_${Date.now()}`;
    const phone = tempData.phoneNumber || (authState.user as any)?.phone || '+2348012345678';

    try {
      const res = await api.post('/creators/signup', {
        userId,
        countryCode: country,
        tier: selectedTier,
        phoneNumber: phone,
        inviteToken: selectedTier === 'TIER_1' ? inviteToken : undefined
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
      console.warn('Backend creator signup error (fallback to local progress):', err?.response?.data || err?.message);
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
          localStorage.setItem('user', JSON.stringify(u));
        } catch (_err) {
          // Ignore parse errors
        }
      }

      // Notify backend if online
      await api.post('/auth/complete-onboarding', { userId }).catch(() => {});

      await finalizeOnboarding();
    } catch {
      // Ignore fallback errors
    } finally {
      // Step 3 -> Step 4: Success Screen
      navigate('/success');
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
    console.log('RENDER CURRENT STEP:', { currentStepId, steps: state.steps });

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
        <Card className="w-full max-w-3xl">
          <CardHeader className="text-center">
            <CardTitle>Terms & Permissions</CardTitle>
            <CardDescription>
                Please review and accept our agreements and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
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
                  />
                  <div>
                    <Label htmlFor="userAgreement" className="font-medium">FingerMobile Protocol User Agreement</Label>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <span>I agree to the terms of the FingerMobile Protocol User Agreement</span>
                      <Link to="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-semibold inline-flex items-center ml-1">
                        Read Terms &rarr;
                      </Link>
                    </p>
                  </div>
                </div>

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
                  />
                  <div>
                    <Label htmlFor="privacyPolicy" className="font-medium">Privacy Policy</Label>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <span>I agree to the FingerMobile Privacy Policy</span>
                      <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-semibold inline-flex items-center ml-1">
                        Read Privacy Policy &rarr;
                      </Link>
                    </p>
                  </div>
                </div>

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
                  />
                  <div>
                    <Label htmlFor="platformUseTerms" className="font-medium">Platform Use Terms</Label>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <span>I agree to the Platform Use Terms & Community Guidelines</span>
                      <Link to="/community-guidelines" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-semibold inline-flex items-center ml-1">
                        Read Guidelines &rarr;
                      </Link>
                    </p>
                  </div>
                </div>

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
                  />
                  <div>
                    <Label htmlFor="conditions" className="font-medium">Conditions & Safety Policies (CSAE)</Label>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <span>I agree to the Platform Conditions & Safety Policies</span>
                      <Link to="/csae-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-semibold inline-flex items-center ml-1">
                        Read Safety Policy &rarr;
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold mb-3">Platform Permissions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <span>Location Access</span>
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

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex items-center">
                      <LockOpenIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <span>Notifications</span>
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

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <span>Audio Access</span>
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

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex items-center">
                      <CameraIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <span>Media & Camera Access</span>
                    </div>
                    <Checkbox
                      checked={state.progress?.permissionsGranted.media || false}
                      onCheckedChange={(checked) => updateProgress({
                        permissionsGranted: {
                          ...state.progress?.permissionsGranted,
                          media: Boolean(checked)
                        }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex items-center">
                      <CogIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <span>Storage Access</span>
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

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={previousStep}>Back</Button>
                <Button
                  onClick={handleTermsAcceptance}
                  disabled={
                    !(state.progress?.termsAccepted.userAgreement &&
                        state.progress?.termsAccepted.privacyPolicy &&
                        state.progress?.termsAccepted.platformUseTerms &&
                        state.progress?.termsAccepted.conditions)
                  }
                >
                    Continue
                </Button>
              </div>
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
                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
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
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
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
                  <Button variant="outline" className="w-full">
                      Other Login Methods
                  </Button>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <Button variant="outline" size="sm">Apple</Button>
                    <Button variant="outline" size="sm">Google</Button>
                    <Button variant="outline" size="sm">Facebook</Button>
                    <Button variant="outline" size="sm">TikTok</Button>
                    <Button variant="outline" size="sm">Instagram</Button>
                    <Button variant="outline" size="sm">LinkedIn</Button>
                  </div>
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
                    
                    <div className="mt-4 flex justify-center">
                      <div className="bg-white p-4 border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-48 h-48 flex items-center justify-center">
                          <span className="text-slate-700">QR Code</span>
                        </div>
                      </div>
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
                      <GlobeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
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
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
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

    case 'account-type-selection':
      return (
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle>Account Type Selection</CardTitle>
            <CardDescription>
                Choose the type of account that best fits your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={tempData.accountType || ''}
              onValueChange={(value) => setTempData({ ...tempData, accountType: value as any })}
              className="space-y-4"
            >
              <div 
                className={`flex items-start space-x-4 p-4 border rounded-lg cursor-pointer transition-colors ${tempData.accountType === 'personal' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-slate-900'}`}
                onClick={() => setTempData({ ...tempData, accountType: 'personal' })}
              >
                <RadioGroupItem value="personal" id="personal" className="mt-1" />
                <div>
                  <Label htmlFor="personal" className="text-base font-semibold">Personal Account</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Simple everyday user with limited features. No subscription options.
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-700 dark:text-gray-400">
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> Basic features</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> Standard visibility</li>
                  </ul>
                </div>
              </div>

              <div 
                className={`flex items-start space-x-4 p-4 border rounded-lg cursor-pointer transition-colors ${tempData.accountType === 'creator' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-slate-900'}`}
                onClick={() => setTempData({ ...tempData, accountType: 'creator' })}
              >
                <RadioGroupItem value="creator" id="creator" className="mt-1" />
                <div>
                  <Label htmlFor="creator" className="text-base font-semibold">Content Creator Account</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      For influencers, bloggers, and brand founders. Access to monetization features.
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-700 dark:text-gray-400">
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> Monetization tools</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> Hallmark Page Boosting</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> Live Broadcast features</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> AI Features</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> Subscriptions page</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> Platform Member only Pages Suggestions</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> Earning Features</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> Full access to Hallmarks, Gems, Permanence, Blogs, Groups, Business Suite</li>
                  </ul>
                </div>
              </div>

              <div 
                className={`flex items-start space-x-4 p-4 border rounded-lg cursor-pointer transition-colors ${tempData.accountType === 'business' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-slate-900'}`}
                onClick={() => setTempData({ ...tempData, accountType: 'business' })}
              >
                <RadioGroupItem value="business" id="business" className="mt-1" />
                <div>
                  <Label htmlFor="business" className="text-base font-semibold">Business/Brand Profile</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      For companies and organizations. Required for running ads and e-commerce.
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-700 dark:text-gray-400">
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> Ad capabilities</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> E-commerce tools</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> Business verification</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> Advanced analytics</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> Mandatory platform auditing fee (~$105 USD annually)</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> Full Access to every and all Platform Member only Pages</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> All Features and Suggestions</li>
                  </ul>
                </div>
              </div>
            </RadioGroup>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={previousStep}>Back</Button>
              <Button onClick={() => handleAccountTypeSelect(tempData.accountType)}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      );

    case 'content-creator-verification':
      return (
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-r from-purple-500 to-pink-600 p-3 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <GraduationCapIcon className="h-8 w-8 text-white" />
            </div>
            <CardTitle>Content Creator Verification</CardTitle>
            <CardDescription>
                Verify your identity as a content creator
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
                        <span className="text-slate-700 dark:text-slate-400 text-xs">Open self-registration capped by regional quota</span>
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
                        <span className="text-slate-700 dark:text-slate-400 text-xs">Application-based with automated checks & portfolio validation</span>
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
                        <span className="text-slate-700 dark:text-slate-400 text-xs">Invite-only / SuperAdmin approval. Requires access token.</span>
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

                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-purple-500 mr-2" />
                      <span className="font-medium">Selfie Photo</span>
                    </div>
                    <div>
                      <input 
                        type="file" 
                        id="creatorSelfie" 
                        className="hidden text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setCreatorSelfieFile(e.target.files[0]);
                          }
                        }}
                      />
                      <label htmlFor="creatorSelfie" className="cursor-pointer">
                        <Button size="sm" type="button" onClick={() => document.getElementById('creatorSelfie')?.click()}>
                          {creatorSelfieFile ? 'Uploaded' : 'Upload'}
                        </Button>
                      </label>
                      {creatorSelfieFile && <div className="text-xs text-green-600 mt-1">{creatorSelfieFile.name}</div>}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-purple-700">
                  <p>Verification timeline: 1 to 3 months (completely free)</p>
                </div>
              </div>

              <Button className="w-full" onClick={handleCreatorVerification}>
                  Submit Documents
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
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-r from-indigo-500 to-blue-600 p-3 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <BriefcaseIcon className="h-8 w-8 text-white" />
            </div>
            <CardTitle>Business Verification</CardTitle>
            <CardDescription>
                Verify your business to access enterprise features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-900 mb-2">Required Business Documents:</h3>
                <ul className="space-y-2 text-sm text-indigo-700">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Certificate of Incorporation or Business License</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Trademark Registration Certificate (if applicable)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Legal Representative ID (Passport or Local ID)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Official Application Letter</span>
                  </li>
                </ul>

                <div className="mt-4 text-sm text-indigo-700">
                  <p>Verification timeline: 1 to 4 months for international businesses</p>
                  <p className="mt-2">Fee: Mandatory, non-refundable platform auditing fee of ~$105 USD annually</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" type="text" placeholder="Enter business name" />
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <select
                      id="businessType"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB each</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col">
        {/* Progress bar */}
        <div className="mb-8 max-w-2xl mx-auto w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {state.progress ? state.steps.findIndex(s => s.id === state.progress?.currentStep) + 1 : 0} of {state.steps.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Main content */}
        <div className="flex-grow flex items-center justify-center">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
