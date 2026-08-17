import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { EyeIcon, EyeOffIcon, PhoneIcon, UserCircleIcon } from '@/icons';
import { GoogleIcon, FacebookIcon, YahooIcon, LinkedInIcon, InstagramIcon, TikTokIcon } from '@/icons';
import { useToast } from '@/hooks/use-toast';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'registration' | 'email-verification' | 'phone-verification' | '2fa-setup'>('registration');
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [phoneVerificationCode, setPhoneVerificationCode] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [generated2FASecret, setGenerated2FASecret] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; password?: string; confirmPassword?: string; verificationCode?: string }>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    let valid = true;
    const newErrors: { name?: string; email?: string; phone?: string; password?: string; confirmPassword?: string; verificationCode?: string } = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      valid = false;
    }

    // Validate email (MANDATORY)
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    // Validate phone number (MANDATORY)
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s|\(|\)|-|_/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
      valid = false;
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }

    // Validate password match
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.info('Registration attempt, with:', { name, email, phone, password });
      
      // Step 1: Create user account (pending verification)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Account Created",
        description: "Now verifying your email address..."
      });
      
      // Step 2: Send email verification
      await sendEmailVerification();
      setStep('email-verification');
      
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive"
      });
      console.error('Registration, error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (emailVerificationCode.length !== 6) {
      setErrors({ verificationCode: 'Please enter the complete 6-digit code' });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Verify email code with backend
      console.info('Verifying email, code:', emailVerificationCode);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Email Verified",
        description: "Now verifying your phone number..."
      });
      
      // Step 3: Send phone verification
      await sendPhoneVerification();
      setStep('phone-verification');
      
    } catch (error) {
      toast({
        title: "Email Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneVerificationCode.length !== 6) {
      setErrors({ verificationCode: 'Please enter the complete 6-digit code' });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Verify phone code with backend
      console.info('Verifying phone, code:', phoneVerificationCode);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Phone Verified",
        description: "Setting up two-factor authentication..."
      });
      
      // Step 4: Generate 2FA secret
      const secret = generate2FASecret();
      setGenerated2FASecret(secret);
      setStep('2fa-setup');
      
    } catch (error) {
      toast({
        title: "Phone Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (twoFACode.length !== 6) {
      setErrors({ verificationCode: 'Please enter the complete 6-digit 2FA code' });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Verify 2FA code and finalize account creation
      console.info('Verifying 2FA setup with secret:', process.env.JWT_SECRET || 'default-secret-for-development', 'Code:', twoFACode);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registration Complete",
        description: "Your account has been created successfully with 2FA enabled!"
      });
      
      navigate('/dashboard');
      
    } catch (error) {
      toast({
        title: "2FA Setup Failed",
        description: "Invalid 2FA code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    // TODO: Implement social registration functionality
    toast({
      title: `Registering with ${provider}`,
      description: `Redirecting to ${provider} authentication...`
    });
    console.info(`Initiating registration with ${provider}`);
  };

  // Generate 6-character alphanumeric verification code (e.g. 2F4-B9M)
  const generateVerificationCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code; // Returns format like "2F4B9M" without hyphen
  };

  const sendEmailVerification = async () => {
    try {
      const verificationCode = generateVerificationCode();
      console.info('📧 Email verification code, generated:', verificationCode);
      
      // TODO: Integrate with email service (SendGrid AWS SES, etc.)
      // await apiService.sendEmailVerification(email verificationCode);
      
      toast({
        title: "Verification Code Sent",
        description: `A 6-character code has been sent to ${email}. Please check your inbox.`
      });
      
      return verificationCode;
    } catch (error) {
      console.error('Failed to send email, verification:', error);
      toast({
        title: "Email Verification Failed",
        description: "Failed to send verification email. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const sendPhoneVerification = async () => {
    try {
      const verificationCode = generateVerificationCode();
      console.info('📱 Phone verification code, generated:', verificationCode);
      
      // TODO: Integrate with SMS service (Twilio AWS SNS, etc.)
      // await apiService.sendSMSVerification(phone verificationCode);
      
      toast({
        title: "Verification Code Sent",
        description: `A 6-character code has been sent to ${phone} via SMS.`
      });
      
      return verificationCode;
    } catch (error) {
      console.error('Failed to send phone, verification:', error);
      toast({
        title: "SMS Verification Failed",
        description: "Failed to send verification SMS. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const generate2FASecret = (): string => {
    // Generate a random 16-character base32 secret for TOTP
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = process.env.secret || "placeholder-secret";
    for (let i = 0; i < 16; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {step === 'registration' && 'Create Account'}
            {step === 'email-verification' && 'Verify Email'}
            {step === 'phone-verification' && 'Verify Phone'}
            {step === '2fa-setup' && 'Setup 2FA'}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 'registration' && 'Enter your details to create a new account'}
            {step === 'email-verification' && `Enter the 6-digit code sent to ${email}`}
            {step === 'phone-verification' && `Enter the 6-digit code sent to ${phone}`}
            {step === '2fa-setup' && 'Scan the QR code and enter the 6-digit code'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Registration Form */}
          {step === 'registration' && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <UserCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (234) 567-8900"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  <p className="text-xs text-gray-500">Both email and phone are required for verification</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={errors.password ? 'border-red-500' : ''}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          )}

          {/* Step 2: Email Verification */}
          {step === 'email-verification' && (
            <form onSubmit={handleEmailVerification}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailCode">Email Verification Code</Label>
                  <Input
                    id="emailCode"
                    type="text"
                    placeholder="2F4B9M"
                    value={emailVerificationCode}
                    onChange={(e) => setEmailVerificationCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    maxLength={6}
                    className={`font-mono text-lg tracking-widest ${errors.verificationCode ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.verificationCode && <p className="text-red-500 text-sm">{errors.verificationCode}</p>}
                  <p className="text-xs text-gray-500">Enter the 6-character code sent to your email (e.g., 2F4B9M)</p>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={async () => {
                  try {
                    await sendEmailVerification();
                  } catch (error) {
                    console.error('Resend, failed:', error);
                  }
                }}
              >
                Resend Code
              </Button>
            </form>
          )}

          {/* Step 3: Phone Verification */}
          {step === 'phone-verification' && (
            <form onSubmit={handlePhoneVerification}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneCode">Phone Verification Code</Label>
                  <Input
                    id="phoneCode"
                    type="text"
                    placeholder="2F4B9M"
                    value={phoneVerificationCode}
                    onChange={(e) => setPhoneVerificationCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    maxLength={6}
                    className={`font-mono text-lg tracking-widest ${errors.verificationCode ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.verificationCode && <p className="text-red-500 text-sm">{errors.verificationCode}</p>}
                  <p className="text-xs text-gray-500">Enter the 6-character code sent to your phone (e.g., 2F4B9M)</p>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify Phone'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={async () => {
                  try {
                    await sendPhoneVerification();
                  } catch (error) {
                    console.error('Resend, failed:', error);
                  }
                }}
              >
                Resend Code
              </Button>
            </form>
          )}

          {/* Step 4: 2FA Setup */}
          {step === '2fa-setup' && (
            <form onSubmit={handle2FASetup}>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Two-Factor Authentication Required</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    For enhanced security, you must enable 2FA. Scan the QR code below with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    {/* TODO: Generate actual QR code from generated2FASecret */}
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-xs text-center">
                      QR Code Placeholder<br/>
                      Secret: {generated2FASecret}
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Can't scan? Enter this code, manually: <strong>{generated2FASecret}</strong>
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twoFACode">Enter 6-Digit Code</Label>
                  <Input
                    id="twoFACode"
                    type="text"
                    placeholder="123456"
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value)}
                    maxLength={6}
                    className={errors.verificationCode ? 'border-red-500' : ''}
                    required
                  />
                  {errors.verificationCode && <p className="text-red-500 text-sm">{errors.verificationCode}</p>}
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={isLoading}
              >
                {isLoading ? 'Setting up 2FA...' : 'Enable 2FA & Complete Registration'}
              </Button>
            </form>
          )}
          
          {step === 'registration' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or register with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="flex items-center justify-center" onClick={() => handleSocialRegister('Google')}>
                  <GoogleIcon className="w-5 h-5 mr-2" /> Google
                </Button>
                <Button variant="outline" className="flex items-center justify-center" onClick={() => handleSocialRegister('Facebook')}>
                  <FacebookIcon className="w-5 h-5 mr-2" /> Facebook
                </Button>
                <Button variant="outline" className="flex items-center justify-center" onClick={() => handleSocialRegister('Yahoo')}>
                  <YahooIcon className="w-5 h-5 mr-2" /> Yahoo
                </Button>
                <Button variant="outline" className="flex items-center justify-center" onClick={() => handleSocialRegister('LinkedIn')}>
                  <LinkedInIcon className="w-5 h-5 mr-2" /> LinkedIn
                </Button>
                <Button variant="outline" className="flex items-center justify-center" onClick={() => handleSocialRegister('Instagram')}>
                  <InstagramIcon className="w-5 h-5 mr-2" /> Instagram
                </Button>
                <Button variant="outline" className="flex items-center justify-center" onClick={() => handleSocialRegister('TikTok')}>
                  <TikTokIcon className="w-5 h-5 mr-2" /> TikTok
                </Button>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          {step === 'registration' && (
            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary, hover:underline">
                Sign in
              </Link>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;