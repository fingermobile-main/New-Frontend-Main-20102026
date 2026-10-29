import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';
import { ShieldCheckIcon, PhoneIcon, MailIcon, UserCircleIcon, ArrowRightIcon } from '../icons';
import identityService from '../services/identityService';

const VerificationPage: React.FC = () => {
  const { showToast } = useAppContext();
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
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 max-w-full overflow-x-hidden pb-28 md:pb-12">
        <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3.5 rounded-2xl shadow-md text-white">
              <ShieldCheckIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Verification</h1>
              <p className="text-slate-700 font-medium text-sm mt-1">
                Verify your sovereign identity via mobile SMS or encrypted email to activate all node features and higher limits
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-300">
          <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h2 className="text-xl font-black text-slate-900 mb-6">Secure Verification</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Choose Method</h3>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setVerificationMethod('phone')}
                        className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border ${
                          verificationMethod === 'phone'
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                            : 'border-slate-300 hover:border-gray-300'
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
                            : 'border-slate-300 hover:border-gray-300'
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
                          className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 shadow-md cursor-pointer"
                        >
                          {isLoading ? 'Verifying...' : 'Verify Account'}
                        </button>

                        <div className="mt-4 text-center">
                          <button
                            type="button"
                            onClick={handleSendCode}
                            disabled={isLoading}
                            className="text-xs text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer disabled:opacity-50"
                          >
                            Resend Code
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-300">
                      <h3 className="font-bold text-slate-900 mb-2">Why Verify?</h3>
                      <ul className="space-y-2 text-xs font-semibold text-slate-800">
                        <li className="flex items-start">
                          <span className="text-amber-600 font-black mr-2">✓</span>
                          <span>Access to sovereign creator monetization features</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-600 font-black mr-2">✓</span>
                          <span>Higher transaction limits and instant offboarding</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-600 font-black mr-2">✓</span>
                          <span>Enhanced cryptographic biometric protection</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-600 font-black mr-2">✓</span>
                          <span>Priority technical support SLA response</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 rounded-2xl p-8 text-center border border-emerald-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4 border text-emerald-950 border-emerald-400 font-black">
                      <ShieldCheckIcon className="h-8 w-8 text-emerald-700" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Account Verified!</h3>
                    <p className="text-slate-700 font-medium text-sm mb-6">
                      Your sovereign identity has been successfully verified across all platform nodes.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <button
                        onClick={resetVerification}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 shadow-sm cursor-pointer"
                      >
                        Verify Another Method
                      </button>
                      <Link
                        to="/dashboard"
                        className="px-5 py-2.5 bg-white border border-slate-300 text-slate-800 rounded-xl font-bold text-sm hover:bg-slate-50 shadow-sm inline-flex items-center justify-center cursor-pointer"
                      >
                        Go to Dashboard
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SOVEREIGN MOBILE QUICK DOCK */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-3 py-2 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setVerificationMethod('phone')}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg transition-colors ${
              verificationMethod === 'phone' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <PhoneIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Phone</span>
          </button>
          <button
            type="button"
            onClick={() => setVerificationMethod('email')}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg transition-colors ${
              verificationMethod === 'email' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <MailIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Email</span>
          </button>
          <button
            type="button"
            onClick={isVerified ? resetVerification : handleSubmitCode}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg text-emerald-700 font-bold bg-emerald-50 transition-colors"
          >
            <ShieldCheckIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">{isVerified ? 'Reset' : 'Verify'}</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default VerificationPage;
