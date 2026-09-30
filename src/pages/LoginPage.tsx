import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { EyeIcon, EyeOffIcon, PhoneIcon } from '@/icons';
import { GoogleIcon, FacebookIcon, YahooIcon, LinkedInIcon, InstagramIcon, TikTokIcon } from '@/icons';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { fingerBioAuth } from '../services/FingerBioSDK';

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; twoFA?: string }>({});
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [pending2FAUserId, setPending2FAUserId] = useState<number | string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login: authLogin } = useAuth();

  const validateForm = () => {
    let valid = true;
    const newErrors: { identifier?: string; password?: string } = {};

    // Validate email or phone number format
    if (!identifier.trim()) {
      newErrors.identifier = 'Email or Phone number is required';
      valid = false;
    } else {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      const isPhone = /^[+]?[1-9][\d]{0,15}$/.test(identifier.replace(/\s|\(|\)|-|_/g, ''));
      if (!isEmail && !isPhone) {
        newErrors.identifier = 'Please enter a valid email or phone number';
        valid = false;
      }
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFACode || twoFACode.trim().length !== 6) {
      setErrors({ twoFA: 'Please enter a complete 6-digit code' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/verify-2fa-login', {
        userId: pending2FAUserId,
        totpCode: twoFACode.trim()
      });

      if (response.data && response.data.token) {
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('fingermobile_token', response.data.token);
        localStorage.setItem('token', response.data.token);

        if (response.data.user) {
          await authLogin(response.data.user.email || identifier, password);
        }

        toast({
          title: 'Login Successful',
          description: 'Two-factor authentication verified.',
          variant: 'default'
        });

        navigate('/forum');
      } else {
        throw new Error(response.data?.message || '2FA verification failed');
      }
    } catch (err: any) {
      toast({
        title: '2FA Failed',
        description: err.response?.data?.message || 'Invalid 2FA code. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        identifier: identifier.trim(),
        email: identifier.trim(),
        password: password
      });

      if (response.data && response.data.requires2FA) {
        setRequires2FA(true);
        setPending2FAUserId(response.data.userId);
        toast({
          title: '2FA Verification Required',
          description: 'Please enter the 6-digit verification code.'
        });
        return;
      }

      if (response.data && response.data.success && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('fingermobile_token', response.data.token);
        localStorage.setItem('token', response.data.token);

        // Update AuthContext with user data
        if (response.data.user) {
          await authLogin(response.data.user.email || identifier, password);
        }

        toast({
          title: 'Login Successful',
          description: 'You have been logged in successfully.',
          variant: 'default'
        });

        // Navigate to forum page (main landing after login)
        navigate('/forum');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
                          'Please check your credentials and try again.';

      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleFaceLogin = async () => {
    try {
      setIsLoading(true);
      const res = await fingerBioAuth.identify1toN();
      if (res.authenticated) {

        // Mock token for bio login
        localStorage.setItem('fingermobile_token', 'bio-mock-token');
        localStorage.setItem('token', 'bio-mock-token');
        await authLogin(res.identified_as || 'bio_user', 'bio-auth-skip');

        toast({
          title: 'Login Successful',
          description: 'Authenticated with FingerBio.',
          variant: 'default'
        });

        navigate('/forum');
      }
    } catch (err: any) {
      if (err.message === 'AMBIGUOUS_MATCH_TRY_1TO1') {
        toast({ title: 'Ambiguous Match', description: 'Match confidence low. Please enter your username and use the 1:1 Biometric Verification below.', variant: 'destructive' });
      } else if (err.message !== 'CANCELLED_BY_USER') {
        toast({ title: 'Face Login Failed', description: err.message, variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify1to1 = async () => {
    if (!identifier) {
      toast({ title: 'Required', description: 'Please enter your Email/Phone Number first for 1:1 verification.', variant: 'destructive' });
      return;
    }
    try {
      setIsLoading(true);
      const res = await fingerBioAuth.verify1to1(identifier);
      if (res.authenticated) {
        localStorage.setItem('fingermobile_token', 'bio-mock-token');
        localStorage.setItem('token', 'bio-mock-token');
        await authLogin(res.username || identifier, 'bio-auth-skip');

        toast({
          title: 'Verification Successful',
          description: 'Identity verified with FingerBio.',
          variant: 'default'
        });

        navigate('/forum');
      }
    } catch (err: any) {
      if (err.message !== 'CANCELLED_BY_USER') {
        toast({ title: 'Face Verification Failed', description: err.message, variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerification = () => {
    // TODO: Implement phone verification
    toast({
      title: 'Phone Verification',
      description: 'Phone verification requested.'
    });
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login functionality
    toast({
      title: `Logging in with ${provider}`,
      description: `Redirecting to ${provider} authentication...`
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Enter your email or phone number and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requires2FA ? (
            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div className="text-center py-2">
                <span className="text-3xl">🔐</span>
                <p className="text-sm text-gray-600 mt-2">
                  Enter the 6-digit code from your authenticator app to complete login.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="twoFA">Two-Factor Authentication Code</Label>
                <Input
                  id="twoFA"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                  className="text-center text-xl tracking-widest font-mono"
                  required
                />
                {errors.twoFA && <p className="text-red-500 text-sm">{errors.twoFA}</p>}
              </div>
              <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? 'Verifying 2FA...' : 'Verify & Enter'}
              </Button>
              <button
                type="button"
                onClick={() => setRequires2FA(false)}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-2"
              >
                ← Back to Login
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="identifier">Email or Phone Number</Label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="identifier"
                        type="text"
                        placeholder="name@example.com or +1 (234)..."
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className={`pl-10 ${errors.identifier ? 'border-red-500' : ''}`}
                        required
                      />
                    </div>
                    {errors.identifier && <p className="text-red-500 text-sm">{errors.identifier}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
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
                </div>
                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>


              <div className="flex flex-col gap-3 mt-4 mb-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFaceLogin}
                  disabled={isLoading}
                  className="w-full"
                >
              😁 Sign in with Face (Passwordless)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVerify1to1}
                  disabled={isLoading || !identifier}
                  className="w-full"
                >
              🛡 Verify Identity 1:1
                </Button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center justify-center"
                  onClick={() => handleSocialLogin('Google')}
                >
                  <GoogleIcon className="w-5 h-5 mr-2" />
              Google
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-center"
                  onClick={() => handleSocialLogin('Facebook')}
                >
                  <FacebookIcon className="w-5 h-5 mr-2" />
              Facebook
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-center"
                  onClick={() => handleSocialLogin('Yahoo')}
                >
                  <YahooIcon className="w-5 h-5 mr-2" />
              Yahoo
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-center"
                  onClick={() => handleSocialLogin('LinkedIn')}
                >
                  <LinkedInIcon className="w-5 h-5 mr-2" />
              LinkedIn
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-center"
                  onClick={() => handleSocialLogin('Instagram')}
                >
                  <InstagramIcon className="w-5 h-5 mr-2" />
              Instagram
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-center"
                  onClick={() => handleSocialLogin('TikTok')}
                >
                  <TikTokIcon className="w-5 h-5 mr-2" />
              TikTok
                </Button>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            variant="ghost"
            className="w-full mb-2"
            onClick={handlePhoneVerification}
          >
            Verify with Phone
          </Button>
          <div className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <div className="text-center text-sm text-gray-500 mt-2">
            <Link to="/forgot-password" className="font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
