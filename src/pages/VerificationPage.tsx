import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';
import { ShieldCheckIcon, PhoneIcon, MailIcon, UserCircleIcon, ArrowRightIcon } from '../icons';
import identityService from '../services/identityService';

const VerificationPage: React.FC = () => {
  const { showToast, ficBalance } = useAppContext();
  const [verificationMethod, setVerificationMethod] = useState<'phone' | 'email'>('phone');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationValue, setVerificationValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await identityService.getVerificationStatus();
        if (res.status === 'verified' || res.kycCompleted) {
          setIsVerified(true);
        }
      } catch (err) {
        // ignore initial fetch error
      }
    };
    checkStatus();
  }, []);

  const handleSendCode = async () => {
    if (!verificationValue) {
      showToast(`Please enter your ${verificationMethod}`, 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await identityService.sendVerificationCode(verificationMethod, verificationValue);
      showToast(res.message || `Verification code dispatched to your ${verificationMethod}`, 'success');
      if (res.testCode) {
        setVerificationCode(res.testCode);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to dispatch verification code', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      showToast('Please enter a valid 6-digit code', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await identityService.verifyCode(verificationCode, verificationMethod);
      if (res.success) {
        setIsVerified(true);
        showToast(res.message || 'Account verified successfully! You now have full platform access.', 'success');
      } else {
        showToast(res.message || 'Invalid verification code. Please try again.', 'error');
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || 'Invalid verification code. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetVerification = () => {
    setIsVerified(false);
    setVerificationCode('');
    setVerificationValue('');
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 p-3 w-16 h-16 rounded-full flex items-center justify-center">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Account Verification</h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Verify your account to unlock all platform features and enhance security
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Secure Verification</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Choose Method</h3>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setVerificationMethod('phone')}
                        className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border ${
                          verificationMethod === 'phone'
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <PhoneIcon className="h-6 w-6 text-blue-600 mb-2" />
                        <span className="font-medium text-gray-700">Phone</span>
                      </button>
                      <button
                        onClick={() => setVerificationMethod('email')}
                        className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border ${
                          verificationMethod === 'email'
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <MailIcon className="h-6 w-6 text-blue-600 mb-2" />
                        <span className="font-medium text-gray-700">Email</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                      {verificationMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                    </h3>
                    <div className="relative">
                      <input
                        type={verificationMethod === 'email' ? 'email' : 'tel'}
                        value={verificationValue}
                        onChange={(e) => setVerificationValue(e.target.value)}
                        placeholder={
                          verificationMethod === 'phone' ? '+1 (555) 123-4567' : 'your@email.com'
                        }
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        {verificationMethod === 'phone' ? (
                          <PhoneIcon className="h-5 w-5 text-slate-700" />
                        ) : (
                          <MailIcon className="h-5 w-5 text-slate-700" />
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleSendCode}
                      disabled={isLoading}
                      className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <span>Sending Code...</span>
                      ) : (
                        <>
                          <span>Send Verification Code</span>
                          <ArrowRightIcon className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Verification Code</h2>

                {!isVerified ? (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Enter Code</h3>
                          <p className="text-sm text-slate-700">
                            We've sent a 6-digit code to your {verificationMethod}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="123456"
                          className="w-full px-4 py-3 text-lg text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                        />
                        <button
                          onClick={handleSubmitCode}
                          disabled={isLoading}
                          className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                        >
                          {isLoading ? 'Verifying...' : 'Verify Account'}
                        </button>

                        <div className="mt-4 text-center">
                          <button className="text-sm text-blue-600 hover:text-blue-800">
                            Resend Code
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
                      <h3 className="font-bold text-gray-900 mb-2">Why Verify?</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="text-amber-500 mr-2">✓</span>
                          <span>Access to premium features</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-500 mr-2">✓</span>
                          <span>Higher transaction limits</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-500 mr-2">✓</span>
                          <span>Enhanced security</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-500 mr-2">✓</span>
                          <span>Faster customer support</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 text-center border border-green-100">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <ShieldCheckIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Account Verified!</h3>
                    <p className="text-gray-600 mb-6">
                      Your account has been successfully verified. You can now access all platform features.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={resetVerification}
                        className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700"
                      >
                        Verify Another Method
                      </button>
                      <button className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                        Go to Dashboard
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-lg mr-4">
              <UserCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Your FIC Balance</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-indigo-700">
                  Add Funds
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VerificationPage;
