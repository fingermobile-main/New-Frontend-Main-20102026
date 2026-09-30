import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../contexts/OnboardingContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Checkbox } from '@/components/ui/Checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
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
  ChartBarIcon
} from '@/icons';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, initializeOnboarding, updateProgress, setAccountType, setInterests, setDemographics, markVerificationComplete, finalizeOnboarding, nextStep, previousStep } = useOnboarding();
  const { state: authState } = useAuth();
  const [tempData, setTempData] = useState<any>({});
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

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
  const progressPercentage = state.progress
    ? (state.progress.completedSteps.length / state.steps.length) * 100
    : 0;

  // Handle welcome step
  const handleWelcomeContinue = () => {
    nextStep();
  };

  // Handle terms and permissions acceptance
  const handleTermsAcceptance = () => {
    // Mark all terms as accepted
    updateProgress({
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
    nextStep();
  };

  // Handle registration step
  const handleRegistration = () => {
    // In a real app, this would handle registration logic
    markVerificationComplete('email', true);
    markVerificationComplete('phone', true);
    nextStep();
  };

  // Handle verification and captcha
  const handleVerificationCaptcha = () => {
    markVerificationComplete('captcha', true);
    nextStep();
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

  const handleSaveInterests = () => {
    if (selectedInterests.length >= 4) { // Require minimum 4 interests
      setInterests(selectedInterests);
      setDemographics(tempData);
      nextStep();
    } else {
      alert('Please select at least 4 interests');
    }
  };

  // Handle profile customization
  const handleProfileChange = (field: string, value: any) => {
    setTempData({ ...tempData, [field]: value });
  };

  const handleSaveProfile = () => {
    updateProgress({ profileData: { ...state.progress?.profileData, ...tempData } });
    nextStep();
  };

  // Handle P2P algorithm calibration
  const handleP2PCalibration = () => {
    updateProgress({
      p2pAlgorithmData: {
        locationBasedMatching: true,
        interestAlignment: true,
        behavioralScoring: true
      }
    });
    nextStep();
  };

  // Handle account type selection
  const handleAccountTypeSelect = (type: 'personal' | 'creator' | 'business') => {
    setAccountType(type);
    setTempData({ ...tempData, accountType: type });
    nextStep();
  };

  // Handle content creator verification
  const handleCreatorVerification = () => {
    markVerificationComplete('identity', true);
    nextStep();
  };

  // Handle business verification
  const handleBusinessVerification = () => {
    // Mark business verification as complete if applicable
    if (state.progress?.accountType === 'business') {
      // In a real app, this would involve actual business verification
      nextStep();
    } else {
      nextStep(); // Skip if not business account
    }
  };

  // Handle CES formula education
  const handleCESFormulaEducation = () => {
    // Show educational content about CES formula
    nextStep();
  };

  // Handle completion
  const handleCompleteOnboarding = async () => {
    const success = await finalizeOnboarding();
    if (success) {
      navigate('/forum'); // Redirect to forum as per requirements
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
                    <p className="text-sm text-gray-600 mt-1">I agree to the terms of the FingerMobile Protocol User Agreement</p>
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
                    <p className="text-sm text-gray-600 mt-1">I agree to the FingerMobile Privacy Policy</p>
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
                    <p className="text-sm text-gray-600 mt-1">I agree to the Platform Use Terms</p>
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
                    <Label htmlFor="conditions" className="font-medium">Conditions</Label>
                    <p className="text-sm text-gray-600 mt-1">I agree to the Conditions</p>
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
                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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

                <div className="pt-4">
                  <h3 className="font-semibold mb-3">Prove You're Human</h3>
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="mb-4">Solve the visual CAPTCHA puzzle</p>
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-64 h-48 mx-auto" />
                    <Button className="mt-4">I'm not a robot</Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={previousStep}>Back</Button>
                <Button onClick={handleVerificationCaptcha}>Continue</Button>
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
                      <GlobeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Gender</Label>
                      <RadioGroup
                        value={tempData.gender || ''}
                        onValueChange={(value) => handleDemographicsChange('gender', value)}
                        className="flex space-x-4 mt-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter your age"
                        value={tempData.age || ''}
                        onChange={(e) => handleDemographicsChange('age', parseInt(e.target.value))}
                        min="13"
                        max="120"
                      />
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
                      <HeartIcon className={`h-4 w-4 mx-auto mb-1 ${selectedInterests.includes(interest) ? 'text-blue-500' : 'text-gray-400'}`} />
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
              <Button onClick={handleSaveInterests} disabled={selectedInterests.length < 4}>
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
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              onValueChange={(value) => handleAccountTypeSelect(value as any)}
              className="space-y-4"
            >
              <div className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="personal" id="personal" className="mt-1" />
                <div>
                  <Label htmlFor="personal" className="text-base font-semibold">Personal Account</Label>
                  <p className="text-sm text-gray-600 mt-1">
                      Simple everyday user with limited features. No subscription options.
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-500">
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> Basic features</li>
                    <li className="flex items-center"><CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" /> Standard visibility</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="creator" id="creator" className="mt-1" />
                <div>
                  <Label htmlFor="creator" className="text-base font-semibold">Content Creator Account</Label>
                  <p className="text-sm text-gray-600 mt-1">
                      For influencers, bloggers, and brand founders. Access to monetization features.
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-500">
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

              <div className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="business" id="business" className="mt-1" />
                <div>
                  <Label htmlFor="business" className="text-base font-semibold">Business/Brand Profile</Label>
                  <p className="text-sm text-gray-600 mt-1">
                      For companies and organizations. Required for running ads and e-commerce.
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-500">
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
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-center text-purple-700 mb-4">
                    For content creators, please submit the required documents
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center">
                      <GraduationCapIcon className="h-5 w-5 text-purple-500 mr-2" />
                      <span className="font-medium">International Passport</span>
                    </div>
                    <Button size="sm">Upload</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-purple-500 mr-2" />
                      <span className="font-medium">Selfie Photo</span>
                    </div>
                    <Button size="sm">Upload</Button>
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
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload files</span>
                          <input type="file" multiple className="sr-only" />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB each</p>
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
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Community Engagement Score (CES)</h3>
                <p className="text-sm text-green-700">
                    The CES algorithm evaluates member posts through a weighted point system, prioritizing high-intent interactions like follows and shares over passive interactions like likes.
                </p>
              </div>

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
                    Go to Dashboard
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
