import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Phone, User, Mail } from 'lucide-react';
import authService from '../../services/authService';
import { userProfileSyncService } from '../../services/UserProfileSyncService';
import { useAuth } from '../../contexts/AuthContext';
import AuthBrandingPanel from '../../components/auth/AuthBrandingPanel';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser, clearAuthData } = useAuth();

  useEffect(() => {
    // When visiting the registration screen as a new applicant, ensure any stale session is cleared
    // and all navigation drawers are strictly closed.
    clearAuthData();
    window.dispatchEvent(new CustomEvent('close-drawer-menu'));
  }, []);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    let valid = true;
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
      general?: string;
    } = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    const trimmedPhone = phone.trim();
    const rawDigits = trimmedPhone.replace(/[^0-9]/g, '');

    if (!trimmedPhone) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (rawDigits.length < 8) {
      newErrors.phone = 'Please enter a valid phone number (at least 8 digits)';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const trimmedPhone = phone.trim();
      const rawDigits = trimmedPhone.replace(/[^0-9]/g, '');
      let cleanPhone = '';
      if (rawDigits.length > 0) {
        if (trimmedPhone.startsWith('+')) {
          cleanPhone = `+${rawDigits}`;
        } else if (rawDigits.startsWith('0') && rawDigits.length === 11) {
          // Auto-normalize Nigerian local format (08012345678 -> +2348012345678)
          cleanPhone = `+234${rawDigits.slice(1)}`;
        } else {
          cleanPhone = `+${rawDigits}`;
        }
      }

      const effectiveEmail =
        email.trim() ||
        `user_${
          cleanPhone.replace(/[^0-9]/g, '') || Date.now()
        }@fingermobileprotocol.com`;

      const registerResponse: any = await authService.register({
        name: `${firstName} ${lastName}`.trim(),
        phone: cleanPhone,
        email: effectiveEmail,
        password,
        firstName,
        lastName,
      });

      // Store tokens and user info
      const token = registerResponse.accessToken || registerResponse.token;
      if (token) {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('fingermobile_token', token);
        localStorage.setItem('token', token);
      }
      if (registerResponse.refreshToken) {
        localStorage.setItem('refreshToken', registerResponse.refreshToken);
      }
      if (registerResponse.user) {
        const fullUser = {
          ...registerResponse.user,
          onboardingComplete: false,
          onboarding_completed: false,
        };
        localStorage.setItem('user', JSON.stringify(fullUser));
        localStorage.removeItem('onboardingComplete');
        localStorage.removeItem('hasCompletedOnboarding');

        // Immediately update AuthContext state with fresh applicant user
        setUser(fullUser);

        // Reset profile store to clean state for new applicant
        userProfileSyncService.clearProfile();
        const memberFullName = fullUser.name || `${fullUser.firstName || ''} ${fullUser.lastName || ''}`.trim() || fullUser.username;
        userProfileSyncService.updateProfile({
          id: fullUser.id,
          name: memberFullName,
          username: fullUser.username,
          email: fullUser.email,
          phone: fullUser.phone,
          avatar: fullUser.avatar || fullUser.avatarUrl || '/assets/branding/default-avatar.svg',
          headline: 'Applicant (Onboarding in Progress)',
        });
      }

      // Navigate to onboarding
      navigate('/onboarding');
    } catch (error: any) {
      setErrors({
        general:
          error.response?.data?.message ||
          error.message ||
          'Registration failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
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
        <AuthBrandingPanel initialIndex={1} className="lg:w-1/2 lg:min-h-screen" />

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
            <p className="text-xs sm:text-sm font-bold tracking-normal text-slate-700 dark:text-slate-300 mt-1">
              Create your Sovereign Account
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-700" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border  text-slate-900 font-bold border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400${
                      errors.firstName
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-700" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border  text-slate-900 font-bold border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400${
                      errors.lastName
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                    placeholder="Doe"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-700" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border text-slate-900 font-bold border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 ${
                    errors.email
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-700" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border  text-slate-900 font-bold border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400${
                    errors.phone
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full px-3 py-3 pr-10 border  text-slate-900 font-bold border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400${
                    errors.password
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
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
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full px-3 py-3 pr-10 border  text-slate-900 font-bold border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400${
                    errors.confirmPassword
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="Confirm your password"
                />
                <button aria-label="Hide"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-700 hover:text-slate-700" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-700 hover:text-slate-700" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                  {errors.confirmPassword}
                </p>
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
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              Already have an account?{' '}
              <button
                onClick={handleLogin}
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Sign in
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
            onClick={handleLogin}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40 transition-colors"
          >
            <Mail className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
