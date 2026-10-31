import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Phone, Mail, Fingerprint, Sparkles } from 'lucide-react';
import authService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { userProfileSyncService } from '../../services/UserProfileSyncService';
import AuthBrandingPanel from '../../components/auth/AuthBrandingPanel';
import { fingerBioAuth } from '../../services/FingerBioSDK';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; general?: string }>({});

  const enableDemoCredentials = process.env.REACT_APP_ENABLE_DEMO_CREDENTIALS === 'true';

  const validateForm = () => {
    let valid = true;
    const newErrors: { identifier?: string; password?: string; general?: string } = {};

    const clean = identifier.trim();
    if (!clean) {
      newErrors.identifier = 'Email or phone number is required';
      valid = false;
    }

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

  const fillQuickAccount = (ident: string, pass: string) => {
    setIdentifier(ident);
    setPassword(pass);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const trimmed = identifier.trim();
      const isEmail = trimmed.includes('@');
      const isPhoneLike = /^[+0-9\s\-()]+$/.test(trimmed) && trimmed.replace(/[^0-9]/g, '').length >= 7;

      const loginResponse: any = await authService.login({
        identifier: trimmed,
        email: isEmail ? trimmed.toLowerCase() : undefined,
        phone: isPhoneLike ? trimmed : undefined,
        username: (!isEmail && !isPhoneLike) ? trimmed.toLowerCase() : undefined,
        password
      });

      // Store tokens and user info
      const token = loginResponse.accessToken || loginResponse.token;
      if (token) {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('fingermobile_token', token);
        localStorage.setItem('token', token);
      }
      if (loginResponse.refreshToken) {
        localStorage.setItem('refreshToken', loginResponse.refreshToken);
      }
      if (loginResponse.user) {
        const fullUser = {
          ...loginResponse.user,
          onboardingComplete: true,
          onboarding_completed: true
        };
        localStorage.setItem('user', JSON.stringify(fullUser));
        localStorage.setItem('onboardingComplete', 'true');
        localStorage.setItem('hasCompletedOnboarding', 'true');
        localStorage.setItem(`onboardingComplete_${fullUser.id}`, 'true');

        const memberFullName = fullUser.name || `${fullUser.firstName || ''} ${fullUser.lastName || ''}`.trim() || fullUser.username;
        userProfileSyncService.updateProfile({
          name: memberFullName,
          username: fullUser.username,
          email: fullUser.email,
          phone: fullUser.phone,
          avatar: fullUser.avatar || fullUser.avatarUrl || '/assets/branding/mbah_israel_obinna.jpeg',
        });

        if (setUser) {
          setUser(fullUser as any);
        }

        // Direct every Platform Member/User to ForumPage upon successful login
        navigate('/forum');
      }
    } catch (error: any) {
      setErrors({
        general:
          error.response?.data?.message ||
          error.message ||
          'Login failed. Please check your credentials.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      const data = await fingerBioAuth.authenticateWithHardwareBiometrics(identifier || '');

      if (data && (data.authenticated || data.token || data.session_token)) {
        const token = data.token || data.session_token;
        if (token) {
          localStorage.setItem('accessToken', token);
          localStorage.setItem('fingermobile_token', token);
          localStorage.setItem('token', token);
        }
        const fullUser = {
          ...(data.user || {
            id: '00000000-0000-0000-0000-000000000001',
            username: data.username || identifier || 'ObinnaMbah',
            email: 'obinnambah@fingermobileprotocol.com',
            fullName: 'Obinna Mbah (Founder & SuperAdmin)'
          }),
          onboardingComplete: true,
          onboarding_completed: true
        };
        localStorage.setItem('user', JSON.stringify(fullUser));
        localStorage.setItem('onboardingComplete', 'true');
        localStorage.setItem('hasCompletedOnboarding', 'true');
        localStorage.setItem(`onboardingComplete_${fullUser.id}`, 'true');

        if (setUser) {
          setUser(fullUser as any);
        }

        // Flow Step 5 -> Step 6: Always loads ForumPage (/forum)
        navigate('/forum');
      } else {
        setErrors({ general: data?.message || 'Biometric authentication failed. Please try again.' });
      }
    } catch (error: any) {
      setErrors({ general: error?.message || 'Biometric authentication failed. Please try alternative login methods.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-slate-950 lg:bg-gradient-to-br lg:from-slate-900 lg:to-slate-950 flex items-center justify-center w-full max-w-full overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full min-h-screen lg:min-h-screen bg-white dark:bg-slate-900 overflow-hidden flex flex-col lg:flex-row shadow-2xl"
      >
        {/* Rotating Branding Panel (Left Column on Desktop: Full Screen Height) */}
        <AuthBrandingPanel className="lg:w-1/2 lg:min-h-screen" />

        {/* Form Container (Right Column on Desktop: Full Screen Height Scrollable) */}
        <div className="w-full lg:w-1/2 min-h-screen p-6 sm:p-12 xl:p-16 flex flex-col justify-center overflow-y-auto max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 mb-4 flex items-center justify-center p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-md">
              <img
                src="/assets/branding/fingermobile/logo-orange.webp"
                alt="FingerMobile Logo"
                className="w-full h-full object-contain filter drop-shadow-md"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = '/assets/branding/fingermobile/logo-white.webp';
                  }
                }}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              FingerMobile<span className="text-[#ff6b00]">™</span>
            </h1>
            <p className="text-xs sm:text-sm font-bold tracking-wide uppercase text-slate-700 dark:text-slate-300 mt-1">
              Protocol Sign In
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quick Test Accounts Pills (Controlled by REACT_APP_ENABLE_DEMO_CREDENTIALS) */}
            {enableDemoCredentials && (
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Platform Credentials & Demo Accounts
                  </span>
                  <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">1-click fill</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('fingermobileprotocol@gmail.com', 'mastercontrol123')}
                    className="col-span-2 px-2.5 py-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-orange-400/40 text-orange-950 dark:text-orange-200 hover:border-orange-500 font-semibold text-left transition-all shadow-sm"
                    title="Mr. Mbah Israel Obinna - Founder & Owner | SuperAdmin Master Control"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        👑 <span className="font-bold">Mr. Mbah Israel Obinna</span>
                      </span>
                      <span className="text-[10px] bg-orange-500/20 text-orange-800 dark:text-orange-300 px-1.5 py-0.5 rounded font-mono">Founder</span>
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium block mt-0.5">
                      fingermobileprotocol@gmail.com • SuperAdmin Master Control
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('eunicembah@gmail.com', 'mastercontrol123')}
                    className="col-span-2 px-2.5 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-400/40 text-purple-950 dark:text-purple-200 hover:border-purple-500 font-semibold text-left transition-all shadow-sm"
                    title="Mrs. Mbah Eunice Emonena - Co-Founder | Admin-1 Master Control"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        ⭐ <span className="font-bold">Mrs. Mbah Eunice Emonena</span>
                      </span>
                      <span className="text-[10px] bg-purple-500/20 text-purple-800 dark:text-purple-300 px-1.5 py-0.5 rounded font-mono">Co-Founder</span>
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium block mt-0.5">
                      eunicembah@gmail.com • Admin-1 & Master Control
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('admin@fingermobileprotocol.com', 'admin123')}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-indigo-500 font-medium text-left truncate transition-colors"
                  >
                    👑 Platform Admin <span className="text-slate-700 text-[10px] block">admin123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('user@fingermobileprotocol.com', 'user123')}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-indigo-500 font-medium text-left truncate transition-colors"
                  >
                    👤 Test User <span className="text-slate-700 text-[10px] block">user123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('creator@fingermobileprotocol.com', 'creator123')}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-indigo-500 font-medium text-left truncate transition-colors"
                  >
                    🎨 Creator <span className="text-slate-700 text-[10px] block">creator123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('merchant@fingermobileprotocol.com', 'merchant123')}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-indigo-500 font-medium text-left truncate transition-colors"
                  >
                    🛍️ Merchant <span className="text-slate-700 text-[10px] block">merchant123</span>
                  </button>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address or Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {identifier.includes('@') ? (
                    <Mail className="h-5 w-5 text-slate-700" />
                  ) : /^[+0-9]/.test(identifier) ? (
                    <Phone className="h-5 w-5 text-slate-700" />
                  ) : (
                    <User className="h-5 w-5 text-slate-700" />
                  )}
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border text-slate-900 font-bold border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 ${
                    errors.identifier ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="name@example.com or +1 (555) 123-4567"
                />
              </div>
              {errors.identifier && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.identifier}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full px-3 py-3 pr-10 border  text-slate-900 font-bold border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400${
                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="Enter your password"
                />
                <button aria-label="Hide"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-700 hover:text-slate-700" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-700 hover:text-slate-700" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-700">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleBiometricLogin}
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Fingerprint className="h-5 w-5 text-slate-700 dark:text-slate-300 mr-2" />
                Biometric
              </button>

              <button
                onClick={() => navigate('/verification')}
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Phone className="h-5 w-5 text-slate-700 dark:text-slate-300 mr-2" />
                Phone Verification
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              Don't have an account?{' '}
              <button
                onClick={handleSignUp}
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {/* SOVEREIGN MOBILE QUICK DOCK */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-300 dark:border-slate-700 px-3 py-2 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 transition-colors"
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Home</span>
          </button>
          <button
            type="button"
            onClick={handleBiometricLogin}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40 transition-colors"
          >
            <Fingerprint className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Biometric</span>
          </button>
          <button
            type="button"
            onClick={handleSignUp}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg text-blue-700 dark:text-blue-400 font-bold transition-colors"
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Register</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
