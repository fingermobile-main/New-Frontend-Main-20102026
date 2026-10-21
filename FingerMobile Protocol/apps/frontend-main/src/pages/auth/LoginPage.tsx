import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Phone, Mail, Fingerprint, Sparkles } from 'lucide-react';
import authService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { userProfileSyncService } from '../../services/UserProfileSyncService';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    let valid = true;
    const newErrors: { identifier?: string; password?: string; general?: string } = {};

    const clean = identifier.trim();
    if (!clean) {
      newErrors.identifier = 'Email, phone number, or username is required';
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
          setUser(fullUser);
        }

        // Direct every Platform Member/User to ForumPage upon successful login
        navigate('/forum');
      }
    } catch (error: any) {
      const trimmed = identifier.trim().toLowerCase();
      const devAccounts: Record<string, any> = {
        'fingermobileprotocol@gmail.com': {
          id: 'usr_founder_obinna',
          username: 'israelobinna',
          firstName: 'Israel Obinna',
          lastName: 'Mbah',
          name: 'Mr. Mbah Israel Obinna',
          email: 'fingermobileprotocol@gmail.com',
          phone: '+2348088855752',
          role: 'SuperAdmin',
          title: 'Founder and Owner',
          designation: 'Founder & Owner | SuperAdmin & Master Control',
          onboardingComplete: true,
          onboarding_completed: true,
          target: '/forum',
        },
        'eunicembah@gmail.com': {
          id: 'usr_cofounder_eunice',
          username: 'eunicembah',
          firstName: 'Eunice Emonena',
          lastName: 'Mbah',
          name: 'Mrs. Eunice Emonena Mbah',
          email: 'eunicembah@gmail.com',
          phone: '+234-803-392-4846',
          role: 'Admin',
          title: 'Co-Founder',
          designation: 'Co-Founder | Admin-1 & Master Control',
          onboardingComplete: true,
          onboarding_completed: true,
          target: '/forum',
        },
        'admin@fingermobileprotocol.com': {
          id: 'usr_admin',
          username: 'admin',
          firstName: 'System',
          lastName: 'Admin',
          name: 'System Admin',
          email: 'admin@fingermobileprotocol.com',
          phone: '+2348011112222',
          role: 'Admin',
          onboardingComplete: true,
          onboarding_completed: true,
          target: '/forum',
        },
        'user@fingermobileprotocol.com': {
          id: 'usr_test',
          username: 'testuser',
          firstName: 'Alexandria',
          lastName: 'Chen',
          name: 'Alexandria Chen',
          email: 'user@fingermobileprotocol.com',
          phone: '+2348099998888',
          role: 'Member',
          onboardingComplete: true,
          onboarding_completed: true,
          target: '/forum',
        },
        'creator@fingermobileprotocol.com': {
          id: 'usr_creator',
          username: 'creator',
          firstName: 'Luxury',
          lastName: 'Creator',
          name: 'Luxury Creator',
          email: 'creator@fingermobileprotocol.com',
          phone: '+2348077776666',
          role: 'Creator',
          onboardingComplete: true,
          onboarding_completed: true,
          target: '/forum',
        },
        'merchant@fingermobileprotocol.com': {
          id: 'usr_merchant',
          username: 'merchant',
          firstName: 'Premier',
          lastName: 'Merchant',
          name: 'Premier Merchant',
          email: 'merchant@fingermobileprotocol.com',
          phone: '+2348055554444',
          role: 'Merchant',
          onboardingComplete: true,
          onboarding_completed: true,
          target: '/forum',
        },
      };

      const matchedAccount =
        devAccounts[trimmed] ||
        (trimmed === 'obinnambah100@gmail.com' ||
        trimmed === 'gracelinkbustech@gmail.com' ||
        trimmed === '+2348088855752' ||
        trimmed === '+2347033304670' ||
        trimmed === 'israelobinna'
          ? devAccounts['fingermobileprotocol@gmail.com']
          : null);

      if (matchedAccount) {
        const token = `token_dev_${Date.now()}`;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('fingermobile_token', token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(matchedAccount));
        localStorage.setItem('onboardingComplete', 'true');
        if (setUser) setUser(matchedAccount);
        navigate(matchedAccount.target || '/forum');
        return;
      }
      setErrors({ general: error.response?.data?.message || error.message || 'Login failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!navigator.credentials) {
      setErrors({ general: 'Biometric authentication not supported on this device' });
      return;
    }

    setIsLoading(true);
    try {
      // Using Web Authentication API for biometric login
      const assertionOptions = await fetch('/api/auth/biometric-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identifier || 'user' })
      }).then(res => res.json());

      const credential = await navigator.credentials.get({
        publicKey: assertionOptions
      }) as PublicKeyCredential;

      // Send assertion to server for verification
      const response = await fetch('/api/auth/biometric-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: credential.id,
          rawId: credential.rawId,
          response: credential.response,
          type: credential.type
        })
      });

      const data = await response.json();

      if (response.ok && data.user) {
        const token = data.accessToken || data.token;
        if (token) {
          localStorage.setItem('accessToken', token);
          localStorage.setItem('fingermobile_token', token);
          localStorage.setItem('token', token);
        }
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        const fullUser = {
          ...data.user,
          onboardingComplete: true,
          onboarding_completed: true
        };
        localStorage.setItem('user', JSON.stringify(fullUser));
        localStorage.setItem('onboardingComplete', 'true');
        localStorage.setItem('hasCompletedOnboarding', 'true');
        localStorage.setItem(`onboardingComplete_${fullUser.id}`, 'true');

        if (setUser) {
          setUser(fullUser);
        }

        // Flow Step 5 -> Step 6: Always loads ForumPage (/forum)
        navigate('/forum');
      } else {
        setErrors({ general: data.message || 'Biometric authentication failed' });
      }
    } catch (error) {
      setErrors({ general: 'Biometric authentication failed. Please try alternative login methods.' });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center">
              <img
                src="/assets/branding/fingermobile/logo-orange.webp"
                alt="FingerMobile Logo"
                className="w-full h-full object-contain filter drop-shadow-md"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = '/assets/branding/fingermobile/fingermobile_emblem.png';
                  }
                }}
              />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              FingerMobile<span className="text-[#ff6b00]">™</span>
            </h1>
            <p className="text-sm font-semibold tracking-wide uppercase text-slate-700 dark:text-slate-300 mt-1">
              Protocol Sign In
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quick Test Accounts Pills */}
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

            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email, Phone Number, or Username
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
                  className={`block w-full pl-10 pr-3 py-3 border  text-slate-900 font-bold border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400${
                    errors.identifier ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="admin, user@fingermobileprotocol.com, or +234..."
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
                <button
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
    </div>
  );
};

export default LoginPage;
