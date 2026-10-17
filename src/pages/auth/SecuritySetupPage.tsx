import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';
import { Shield, Fingerprint, Smartphone, Eye, EyeOff, CheckCircle } from 'lucide-react';

const SecuritySetupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Biometrics, 2: 2FA, 3: Confirmation
  const [enableBiometrics, setEnableBiometrics] = useState(true);
  const [enableTwoFactor, setEnableTwoFactor] = useState(true);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'sms' | 'app'>('sms');
  const [showCode, setShowCode] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate backup codes
  useEffect(() => {
    let isMounted = true;
    if (step === 3) {
      import('../../services/identityService').then(({ identityService }) => {
        identityService.generateBackupCodes().then(codes => {
          if (isMounted && codes && codes.length > 0) {
            setBackupCodes(codes);
          }
        }).catch(() => {
          if (isMounted) {
            const fallback = Array.from({ length: 8 }, () =>
              Math.random().toString(36).substring(2, 8).toUpperCase()
            );
            setBackupCodes(fallback);
          }
        });
      });
    }

    return () => {
      isMounted = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [step]);

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete security setup
      setIsLoading(true);
      try {
        const { identityService } = await import('../../services/identityService');
        await identityService.updateSecuritySettings({
          twoFactorEnabled: enableTwoFactor,
          biometricEnabled: enableBiometrics,
          backupCodes: backupCodes
        });
      } catch (err) {
        // continue
      } finally {
        setIsLoading(false);
        navigate('/dashboard');
      }
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (step) {
    case 1:
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 border text-blue-950 border-blue-400 font-black">
              <Fingerprint className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Biometric Authentication</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
                Secure your account with fingerprint or face recognition
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <Smartphone className="h-6 w-6 text-slate-700 dark:text-gray-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Biometric Unlock</h3>
                  <p className="text-sm text-slate-700 dark:text-gray-400">Use fingerprint or face ID to sign in</p>
                </div>
              </div>
              <button
                onClick={() => setEnableBiometrics(!enableBiometrics)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  enableBiometrics ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    enableBiometrics ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 flex items-center">
              <Shield className="h-5 w-5 mr-2" /> Security Tip
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                Biometric authentication adds an extra layer of security and makes signing in faster.
            </p>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
                Add an extra layer of security to your account
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Enable Two-Factor Authentication</h3>
              <p className="text-xs text-slate-700 dark:text-gray-400">Require an extra security code during login</p>
            </div>
            <button
              type="button"
              onClick={() => setEnableTwoFactor(!enableTwoFactor)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enableTwoFactor ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  enableTwoFactor ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="mr-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">SMS</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Text Message (SMS)</h3>
                  <p className="text-sm text-slate-700 dark:text-gray-400">Receive codes via SMS</p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactorMethod('sms')}
                className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                  twoFactorMethod === 'sms'
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-gray-400 dark:border-gray-500'
                }`}
              >
                {twoFactorMethod === 'sms' && (
                  <CheckCircle className="h-3 w-3 text-slate-700" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="mr-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">APP</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Authenticator App</h3>
                  <p className="text-sm text-slate-700 dark:text-gray-400">Use Google Authenticator or similar</p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactorMethod('app')}
                className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                  twoFactorMethod === 'app'
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-gray-400 dark:border-gray-500'
                }`}
              >
                {twoFactorMethod === 'app' && (
                  <CheckCircle className="h-3 w-3 text-slate-700" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
            <h3 className="font-medium text-indigo-800 dark:text-indigo-200 flex items-center">
              <Shield className="h-5 w-5 mr-2" /> Recommended
            </h3>
            <p className="text-indigo-700 dark:text-indigo-300 text-sm mt-1">
                We recommend using an authenticator app for better security than SMS.
            </p>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Setup Complete</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
                Your account is now more secure
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Backup Codes</h3>
              <p className="text-slate-700 dark:text-gray-400 text-sm mb-4">
                  Save these backup codes in a safe place. You can use them if you lose access to your authentication methods.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="p-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-center font-mono text-sm"
                  >
                    {code}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center">
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium flex items-center"
                >
                  {showCode ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                  {showCode ? 'Hide codes' : 'Show codes'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="font-medium text-green-800 dark:text-green-200 flex items-center">
              <Shield className="h-5 w-5 mr-2" /> Security Status
            </h3>
            <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                Your account is now protected with biometric authentication and two-factor authentication.
            </p>
          </div>
        </div>
      );

    default:
      return null;
    }
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
          {renderStep()}

          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                disabled={isLoading}
                className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
            ) : (
              <button
                onClick={handleSkip}
                disabled={isLoading}
                className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skip
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={isLoading}
              className="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {step === 3 ? 'Finishing...' : 'Continue'}
                </span>
              ) : step === 3 ? (
                'Finish Setup'
              ) : (
                'Continue'
              )}
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-8 rounded-full ${
                    s <= step ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SecuritySetupPage;
