import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { logError } from '../utils/errorLogger';
import { ApiService } from '../services/api';

interface GuardianStatus {
  timestamp: string;
  modules: {
    [key: string]: {
      status: string;
      description: string;
    };
  };
  killSwitch: {
    isActive: boolean;
    emergencyMode: boolean;
    countdownActive: boolean;
    countdownEndTime: string | null;
    lastActivationTime: string | null;
  };
  stercesConfig: {
    authorizedEmails: string[];
    authorizedIndividuals: { name: string; phone: string }[];
  };
}

const GuardianProtectionPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [guardianStatus, setGuardianStatus] = useState<GuardianStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pinCode, setPinCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [action, setAction] = useState('');
  const [reason, setReason] = useState('');

  // Fetch Guardian Status
  const fetchGuardianStatus = async () => {
    try {
      setLoading(true);
      const res: any = await ApiService.get('/sterces/status');
      if (res.data?.success || res.success) {
        setGuardianStatus(res.data?.status || res.status);
      } else {
        throw new Error(res.data?.message || res.message || 'Failed to fetch guardian status');
      }
    } catch (error) {
      logError(error, { context: 'GuardianProtectionPage - fetchGuardianStatus' });
      showToast('Could not load guardian status', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuardianStatus();
  }, []);

  // Request First PIN
  const handleRequestFirstPin = async () => {
    try {
      const res: any = await ApiService.post('/sterces/request-first-pin', { email });
      if (res.data?.success || res.success) {
        showToast(res.data?.message || res.message, 'success');
      } else {
        throw new Error(res.data?.message || res.message || 'Failed to request first PIN');
      }
    } catch (error: any) {
      logError(error, { context: 'GuardianProtectionPage - handleRequestFirstPin' });
      showToast(error.message || 'Failed to request first PIN', 'error');
    }
  };

  // Validate First PIN
  const handleValidateFirstPin = async () => {
    try {
      const res: any = await ApiService.post('/sterces/validate-first-pin', { pinCode, email });
      if (res.data?.success || res.success) {
        showToast(res.data?.message || res.message, 'success');
      } else {
        throw new Error(res.data?.message || res.message || 'Failed to validate first PIN');
      }
    } catch (error: any) {
      logError(error, { context: 'GuardianProtectionPage - handleValidateFirstPin' });
      showToast(error.message || 'Failed to validate first PIN', 'error');
    }
  };

  // Execute Kill Switch Action
  const handleExecuteKillSwitch = async () => {
    try {
      const res: any = await ApiService.post('/sterces/execute-kill-switch', {
        action,
        reason,
        validatedBy: email
      });
      if (res.data?.success || res.success) {
        showToast(res.data?.message || res.message, 'success');
        fetchGuardianStatus(); // Refresh status
      } else {
        throw new Error(res.data?.message || res.message || 'Failed to execute kill switch action');
      }
    } catch (error: any) {
      logError(error, { context: 'GuardianProtectionPage - handleExecuteKillSwitch' });
      showToast(error.message || 'Failed to execute kill switch action', 'error');
    }
  };

  // Activate Emergency Kill Switch
  const handleActivateEmergency = async () => {
    try {
      const res: any = await ApiService.post('/sterces/activate-emergency', {
        reason: reason || 'Emergency activation from dashboard'
      });
      if (res.data?.success || res.success) {
        showToast(res.data?.message || res.message, 'success');
        fetchGuardianStatus(); // Refresh status
      } else {
        throw new Error(res.data?.message || res.message || 'Failed to activate emergency kill switch');
      }
    } catch (error: any) {
      logError(error, { context: 'GuardianProtectionPage - handleActivateEmergency' });
      showToast(error.message || 'Failed to activate emergency kill switch', 'error');
    }
  };

  // Format date for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <MainLayout pageTitle="Guardian Protection">
        <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Guardian Protection">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Guardian Protection System
              </h1>
              <p className="text-gray-600">
                Strategic Tactical Enterprise Resource Control SYSTEM™️©️®️ (STERCS™️©️®️) - Protocol and Manipulation System ™️©️®️ (PRO-MPTS™️©️®️)
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Navigation</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-red-100 text-red-800 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('sterces-auth')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'sterces-auth'
                      ? 'bg-red-100 text-red-800 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  STERCS Authentication
                </button>
                <button
                  onClick={() => setActiveTab('kill-switch')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'kill-switch'
                      ? 'bg-red-100 text-red-800 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Kill Switch Controls
                </button>
                <button
                  onClick={() => setActiveTab('emergency')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'emergency'
                      ? 'bg-red-100 text-red-800 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Emergency Controls
                </button>
              </nav>
            </div>

            {/* System Status */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Guardian Status:</span>
                  <span className="font-medium text-green-600">ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span>Kill Switch:</span>
                  <span className={`font-medium ${
                    guardianStatus?.killSwitch.isActive ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {guardianStatus?.killSwitch.isActive ? 'ACTIVE' : 'STANDBY'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last Activation:</span>
                  <span className="font-medium">
                    {formatDate(guardianStatus?.killSwitch.lastActivationTime)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && guardianStatus && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Guardian Protection Dashboard</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                    <h3 className="font-bold text-gray-900 mb-2">STERCS Authorization</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Tripartite Security Code System for platform protection
                    </p>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Primary Emails:</span></p>
                      <ul className="list-disc pl-5 text-xs">
                        {guardianStatus.stercesConfig.authorizedEmails.slice(0, 2).map((email, i) => (
                          <li key={i}>{email}</li>
                        ))}
                      </ul>
                      <p className="mt-2"><span className="font-medium">Key Personnel:</span></p>
                      <ul className="list-disc pl-5 text-xs">
                        {guardianStatus.stercesConfig.authorizedIndividuals.slice(0, 2).map((person, i) => (
                          <li key={i}>{person.name} ({person.phone})</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-2">Kill Switch Status</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Platform control and emergency measures
                    </p>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span>Emergency Mode:</span>
                        <span className={guardianStatus.killSwitch.emergencyMode ? 'text-red-600 font-medium' : 'text-green-600'}>
                          {guardianStatus.killSwitch.emergencyMode ? 'ACTIVE' : 'OFF'}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Countdown Active:</span>
                        <span className={guardianStatus.killSwitch.countdownActive ? 'text-red-600 font-medium' : 'text-green-600'}>
                          {guardianStatus.killSwitch.countdownActive ? 'YES' : 'NO'}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Countdown Ends:</span>
                        <span>{formatDate(guardianStatus.killSwitch.countdownEndTime)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 mb-4">Protection Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(guardianStatus.modules).map(([key, module]) => (
                    <div key={key} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          module.status.includes('🟢') ? 'bg-green-100 text-green-800' :
                            module.status.includes('🔴') ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                        }`}>
                          {module.status.replace('🟢', '').replace('🔴', '').replace('🟡', '').trim()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{module.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STERCS Authentication Tab */}
            {activeTab === 'sterces-auth' && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-bold mb-6 text-gray-900">STERCS Authentication</h2>

                <div className="space-y-6">
                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <h3 className="font-bold text-gray-900">Step 1: Request First PIN</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Enter your authorized email to receive the first PIN code
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleRequestFirstPin}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Request PIN
                      </button>
                    </div>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <h3 className="font-bold text-gray-900">Step 2: Validate First PIN</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Enter the received PIN code to proceed
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        placeholder="XXXXXX"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleValidateFirstPin}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Validate
                      </button>
                    </div>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <h3 className="font-bold text-gray-900">Step 3: Backup Validation</h3>
                    <p className="text-sm text-gray-600">
                      After first PIN validation, backup PINs will be sent to secondary emails for additional validation
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <h3 className="font-bold text-gray-900">Step 4: MFA & Biometric</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Final verification through phone MFA and facial biometrics
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+2348088855752"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => showToast('MFA and biometric verification initiated', 'info')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Initiate Verification
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Kill Switch Controls Tab */}
            {activeTab === 'kill-switch' && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Kill Switch Controls</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Platform Actions</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Action
                        </label>
                        <select
                          value={action}
                          onChange={(e) => setAction(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">Choose an action...</option>
                          <option value="reboot">PLATFORM WIDE REBOOT</option>
                          <option value="freeze">FREEZE PLATFORM</option>
                          <option value="countdown_start">START 25-HOUR COUNTDOWN</option>
                          <option value="cancel_all">CANCEL ALL ACTIONS</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reason for Action
                        </label>
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter the reason for this action..."
                        />
                      </div>

                      <button
                        onClick={handleExecuteKillSwitch}
                        disabled={!action || !reason}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Execute Selected Action
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Current Status</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Platform Status:</span>
                          <span className={guardianStatus?.killSwitch.isActive ? 'text-red-600 font-medium' : 'text-green-600'}>
                            {guardianStatus?.killSwitch.isActive ? 'FROZEN/SHUTDOWN' : 'OPERATIONAL'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Emergency Mode:</span>
                          <span className={guardianStatus?.killSwitch.emergencyMode ? 'text-red-600 font-medium' : 'text-green-600'}>
                            {guardianStatus?.killSwitch.emergencyMode ? 'ACTIVE' : 'STANDBY'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Countdown Active:</span>
                          <span className={guardianStatus?.killSwitch.countdownActive ? 'text-red-600 font-medium' : 'text-green-600'}>
                            {guardianStatus?.killSwitch.countdownActive ? 'YES' : 'NO'}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-sm text-gray-500">
                            Warning: These actions will significantly impact platform operations.
                            Use only in genuine emergency situations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Controls Tab */}
            {activeTab === 'emergency' && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Emergency Kill Switch</h2>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Emergency Action Required</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>
                          This will instantly disable the entire application and API if a severe threat is detected.
                          This feature is currently OFF by default to prevent accidental lockouts.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Reason
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Describe the emergency situation requiring platform shutdown..."
                    />
                  </div>

                  <button
                    onClick={handleActivateEmergency}
                    className="w-full px-4 py-3 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-lg hover:from-red-800 hover:to-red-950 font-medium flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    YES, ACTIVATE EMERGENCY KILL SWITCH
                  </button>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Important Safety Notice</h4>
                    <p className="text-sm text-yellow-700">
                      This action will immediately shut down all platform services. Only authorized personnel
                      should perform this action. A detailed incident report will be automatically generated
                      and sent to security administrators.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GuardianProtectionPage;
