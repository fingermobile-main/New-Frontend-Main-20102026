import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import {
  ShieldExclamationIcon,
  FingerPrintIcon,
  BuildingOfficeIcon
} from '../../../components/icons';
import { api } from '../../../services/api';
import PlatformOwnershipCard from '../../../components/dashboard/PlatformOwnershipCard';
import SubscriptionModelsConsole from '../../../components/dashboard/SubscriptionModelsConsole';

const StercsControlPage: React.FC = () => {
  const { seadsInitiatives, showToast, handleStercsLogin, handleStercsAction } = useAppContext();

  const [authStep, setAuthStep] = useState(0); // 0: Start, 1: PIN1, 2: PIN2, 3: Biometrics, 4: Authenticated
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [error, setError] = useState('');
  const [systemMode, setSystemMode] = useState<'enterprise' | 'threat'>(
    'threat',
  );

  // Countdown state for wipe action
  const [isWipeConfirm, setIsWipeConfirm] = useState(false);
  const [countdown, setCountdown] = useState(25 * 60 * 60);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSystemWipe = useCallback(async () => {
    try {
      await api.post('/sentient/toggle-kill-switch', { engage: true, reason: 'STERCS system wipe initiated' }).catch(() => null);
    } catch (e) {
      console.error(e);
    }
    showToast(
      `STERCS™©®: System wipe initiated. All ${systemMode === 'enterprise' ? 'enterprise resources' : 'threat data'} will be erased in 24 hours. Protocol lock active.`,
    );
    setIsWipeConfirm(false);
    setCountdown(25 * 60 * 60);
  }, [showToast, systemMode]);

  const executeAction = async (action: string) => {
    try {
      await api.post('/guardian/rules', {
        name: `STERCS_${action.toUpperCase()}`,
        category: 'stercs',
        description: `STERCS action triggered: ${action} in ${systemMode} mode`,
        severity: action.includes('wipe') || action.includes('lockdown') ? 'critical' : 'medium',
        threshold_value: 1,
        action: 'flag',
        is_active: true
      }).catch(() => null);
    } catch (e) {
      console.error(e);
    }
    handleStercsAction(action);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isWipeConfirm && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isWipeConfirm && countdown === 0) {
      handleSystemWipe();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isWipeConfirm, countdown, handleSystemWipe]);

  const startBiometrics = async () => {
    if (videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        videoRef.current.srcObject = stream;
        // Simulate biometric scan
        setTimeout(async () => {
          const success = await handleStercsLogin(pin1, pin2, 'biometric_data');
          if (success) {
            setAuthStep(4);
            showToast(
              `PRO-MPTS™©®: Authentication successful. STERCS™©® (${systemMode === 'enterprise' ? 'Enterprise' : 'Threat'}) engaged.`,
            );
            stream.getTracks().forEach((track) => track.stop());
          } else {
            setError('Biometric verification failed.');
            resetAuth();
            stream.getTracks().forEach((track) => track.stop());
          }
        }, 3000);
      } catch {
        setError('Camera access denied. Please enable camera permissions.');
      }
    }
  };

  const handlePin1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin1.length === 6) {
      setAuthStep(2);
      setError('');
    } else {
      setError('PIN 1 must be 6 digits');
    }
  };

  const handlePin2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin2.length === 8) {
      setAuthStep(3);
      setError('');
      startBiometrics();
    } else {
      setError('PIN 2 must be 8 digits');
    }
  };

  const resetAuth = () => {
    setAuthStep(0);
    setPin1('');
    setPin2('');
    setError('');
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Permanent Platform Ownership Authority Seal */}
      <PlatformOwnershipCard />

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <ShieldExclamationIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Strategic Tactical Enterprise Resource Control SYSTEM™©®
                (STERCS)
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-slate-300 font-medium">
                  {systemMode === 'enterprise'
                    ? 'Enterprise Resource Management'
                    : 'Sentient Threat Evaluation & Response'}
                </p>
                <button
                  onClick={() =>
                    setSystemMode((mode) =>
                      mode === 'enterprise' ? 'threat' : 'enterprise',
                    )
                  }
                  className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded"
                >
                  Switch to{' '}
                  {systemMode === 'enterprise' ? 'Threat' : 'Enterprise'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {authStep === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto bg-gray-800 p-4 rounded-full w-24 h-24 flex items-center justify-center mb-6">
                {systemMode === 'enterprise' ? (
                  <BuildingOfficeIcon className="w-12 h-12 text-blue-400" />
                ) : (
                  <FingerPrintIcon className="w-12 h-12 text-red-400" />
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">
                STERCS™©® Access Required
              </h2>
              <p className="text-slate-300 font-medium mb-2">
                {systemMode === 'enterprise'
                  ? 'Strategic Tactical Enterprise Resource Control Systems'
                  : 'Sentient Threat Evaluation & Response Control System'}
              </p>
              <p className="text-slate-300 font-medium mb-8">
                Multi-factor authentication required for system access
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setAuthStep(1)}
                  className="px-6 py-3 bg-brand-blue hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Begin Standard Authentication
                </button>
                <button
                  onClick={() => setAuthStep(4)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-lg shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                >
                  <span>👑 Founder / SuperAdmin Master Authorization</span>
                </button>
              </div>
            </div>
          )}

          {authStep === 1 && (
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">STERCS™©® Control Panel</h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    systemMode === 'enterprise'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {systemMode === 'enterprise' ? 'Enterprise' : 'Threat'}
                </span>
              </div>
              <p className="text-slate-300 font-medium mb-6">Enter 6-digit PIN 1</p>

              <form onSubmit={handlePin1Submit}>
                <div className="mb-4">
                  <input
                    type="password"
                    value={pin1}
                    onChange={(e) => setPin1(e.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                    placeholder="••••••"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    maxLength={6}
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm mb-4 text-center">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={resetAuth}
                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pin1.length !== 6}
                    className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors ${
                      pin1.length === 6
                        ? 'bg-brand-blue hover:bg-blue-700 text-white'
                        : 'bg-gray-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          )}

          {authStep === 2 && (
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">STERCS™©® Control Panel</h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    systemMode === 'enterprise'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {systemMode === 'enterprise' ? 'Enterprise' : 'Threat'}
                </span>
              </div>
              <p className="text-slate-300 font-medium mb-6">Enter 8-digit PIN 2</p>

              <form onSubmit={handlePin2Submit}>
                <div className="mb-4">
                  <input
                    type="password"
                    value={pin2}
                    onChange={(e) => setPin2(e.target.value.replace(/\D/g, '').slice(0, 8))
                    }
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    maxLength={8}
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm mb-4 text-center">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setAuthStep(1)}
                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={pin2.length !== 8}
                    className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors ${
                      pin2.length === 8
                        ? 'bg-brand-blue hover:bg-blue-700 text-white'
                        : 'bg-gray-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          )}

          {authStep === 3 && (
            <div className="text-center py-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Biometric Authentication</h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    systemMode === 'enterprise'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {systemMode === 'enterprise' ? 'Enterprise' : 'Threat'}
                </span>
              </div>
              <p className="text-slate-300 font-medium mb-6 sm:text-base lg:text-lg">
                Please look into the camera for facial recognition
              </p>

              <div className="relative mx-auto w-64 h-64 mb-6">
                <div className="absolute inset-0 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="rounded-lg w-full max-w-full h-auto"
                  ></video>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-2 border-blue-500 rounded-full animate-ping opacity-20"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 border-2 border-blue-500 rounded-full"></div>
                </div>
              </div>

              <p className="text-slate-300 font-medium">Scanning... Please remain still</p>

              <div className="mt-6">
                <button
                  onClick={resetAuth}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  Cancel Authentication
                </button>
              </div>
            </div>
          )}

          {authStep === 4 && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold">
                    STERCS™©® Command Center
                  </h2>
                  <p className="text-slate-300 font-medium">
                    {systemMode === 'enterprise'
                      ? 'Strategic Tactical Enterprise Resource Control Systems'
                      : 'Sentient Threat Evaluation & Response Control System'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      systemMode === 'enterprise'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {systemMode === 'enterprise'
                      ? 'Enterprise Mode'
                      : 'Threat Mode'}
                  </span>
                  <button
                    onClick={resetAuth}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {systemMode === 'enterprise' ? (
                  <>
                    <div
                      className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                      onClick={() => executeAction('resource_allocation')} role="button" tabIndex={0}
                    >
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                        <BuildingOfficeIcon className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="font-bold text-white mb-2">
                        Resource Allocation
                      </h3>
                      <p className="text-slate-300 font-medium text-sm">
                        Allocate and manage enterprise resources across regions
                      </p>
                    </div>

                    <div
                      className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                      onClick={() => executeAction('strategic_planning')} role="button" tabIndex={0}
                    >
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-bold text-white mb-2">
                        Strategic Planning
                      </h3>
                      <p className="text-slate-300 font-medium text-sm">
                        Deploy tactical strategies for enterprise growth
                      </p>
                    </div>

                    <div
                      className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                      onClick={() => executeAction('enterprise_backup')} role="button" tabIndex={0}
                    >
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </div>
                      <h3 className="font-bold text-white mb-2">
                        Enterprise Backup
                      </h3>
                      <p className="text-slate-300 font-medium text-sm">
                        Execute enterprise-wide backup procedures
                      </p>
                    </div>

                    <div
                      className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                      onClick={() => executeAction('performance_optimize')} role="button" tabIndex={0}
                    >
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-bold text-white mb-2">
                        Performance Optimize
                      </h3>
                      <p className="text-slate-300 font-medium text-sm">
                        Run enterprise optimization routines
                      </p>
                    </div>

                    <div
                      className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                      onClick={() => executeAction('resource_monitoring')} role="button" tabIndex={0}
                    >
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                          />
                        </svg>
                      </div>
                      <h3 className="font-bold text-white mb-2">
                        Resource Monitoring
                      </h3>
                      <p className="text-slate-300 font-medium text-sm">
                        Monitor enterprise resource utilization
                      </p>
                    </div>

                    <div
                      className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-colors cursor-pointer"
                      onClick={() => setIsWipeConfirm(true)} role="button" tabIndex={0}
                    >
                      <div className="w-12 h-12 bg-red-700/30 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </div>
                      <h3 className="font-bold text-white mb-2">
                        Enterprise Wipe
                      </h3>
                      <p className="text-slate-300 font-medium text-sm">
                        Initiate complete enterprise data wipe (IRREVERSIBLE)
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-colors cursor-pointer"
                      onClick={() => executeAction('threat_scan')} role="button" tabIndex={0}
                    >
                      <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                        <ShieldExclamationIcon className="w-6 h-6 text-red-400" />
                      </div>
                      <h3 className="font-bold text-white mb-2">Threat Scan</h3>
                      <p className="text-slate-300 font-medium text-sm">
                        Execute comprehensive threat evaluation across all
                        platform modules
                      </p>
                    </div>

                    <div
                      className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-colors cursor-pointer"
                      onClick={() => executeAction('ai_analysis')} role="button" tabIndex={0}
                    >
                      <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-bold text-white mb-2">AI Analysis</h3>
                      <p className="text-slate-300 font-medium text-sm">
                        Deploy SENTIENT cognitive processing for pattern
                        analysis
                      </p>
                    </div>

                    <div
                      className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-colors cursor-pointer"
                      onClick={() => executeAction('security_lockdown')} role="button" tabIndex={0}
                    >
                      <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-bold text-white mb-2">
                        Security Lockdown
                      </h3>
                      <p className="text-slate-300 font-medium text-sm">
                        Initiate platform-wide security lockdown procedures
                      </p>
                    </div>

                    <div
                      className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-colors cursor-pointer"
                      onClick={() => executeAction('system_backup')} role="button" tabIndex={0}
                    >
                      <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </div>
                      <h3 className="font-bold text-white mb-2">
                        System Backup
                      </h3>
                      <p className="text-slate-300 font-medium text-sm">
                        Execute full system backup to secure storage
                      </p>
                    </div>

                    <div
                      className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500 transition-colors cursor-pointer"
                      onClick={() => executeAction('performance_optimize')} role="button" tabIndex={0}
                    >
                      <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-bold text-white mb-2">
                        Performance Optimize
                      </h3>
                      <p className="text-slate-300 font-medium text-sm">
                        Run system optimization routines for peak performance
                      </p>
                    </div>

                    <div
                      className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-700 transition-colors cursor-pointer"
                      onClick={() => setIsWipeConfirm(true)} role="button" tabIndex={0}
                    >
                      <div className="w-12 h-12 bg-red-700/30 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </div>
                      <h3 className="font-bold text-white mb-2">System Wipe</h3>
                      <p className="text-slate-300 font-medium text-sm">
                        Initiate complete system wipe (IRREVERSIBLE)
                      </p>
                    </div>
                  </>
                )}
              </div>

              {isWipeConfirm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                  <div className="bg-gray-900 rounded-xl border border-red-500/50 max-w-md w-full p-6">
                    <h3 className="text-xl font-bold text-red-400 mb-4">
                      CONFIRM SYSTEM WIPE
                    </h3>
                    <p className="text-gray-300 mb-4">
                      This action will permanently erase all{' '}
                      {systemMode === 'enterprise'
                        ? 'enterprise resource'
                        : 'threat evaluation'}{' '}
                      data from the platform. The wipe will begin in 24 hours
                      and cannot be stopped once initiated.
                    </p>

                    <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6">
                      <div className="text-center text-red-400 font-mono text-2xl font-bold">
                        {formatTime(countdown)}
                      </div>
                      <p className="text-center text-red-400 text-sm mt-2">
                        Time until wipe begins
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setIsWipeConfirm(false);
                          setCountdown(25 * 60 * 60);
                        }}
                        className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSystemWipe}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Confirm Wipe
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STERCS Subscription Models & Free Tier Curation Console */}
              <div className="mt-10 pt-8 border-t border-gray-800">
                <SubscriptionModelsConsole sourceDashboard="StercsDashboard" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StercsControlPage;
