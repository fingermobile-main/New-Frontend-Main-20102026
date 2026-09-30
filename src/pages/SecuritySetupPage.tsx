import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ShieldCheckIcon, FingerPrintIcon, LockClosedIcon, DeviceMobileIcon, UserCircleIcon, CreditCardIcon } from '../icons';

const SecuritySetupPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [multiFactorEnabled, setMultiFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneVerification, setPhoneVerification] = useState('+1 (555) 123-4567');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [backupCodesEnabled, setBackupCodesEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { identityService } = await import('../services/identityService');
        const settings = await identityService.getSecuritySettings();
        if (settings) {
          setTwoFactorEnabled(!!settings.twoFactorEnabled);
          setMultiFactorEnabled(!!settings.multiFactorEnabled);
          setBiometricEnabled(!!settings.biometricEnabled);
          if (settings.phoneVerification) setPhoneVerification(settings.phoneVerification);
          if (settings.backupCodes && settings.backupCodes.length > 0) {
            setBackupCodes(settings.backupCodes);
            setBackupCodesEnabled(true);
          }
        }
      } catch (err) {
        // ignore initial fetch error
      }
    };
    loadSettings();
  }, []);

  // Generate backup codes
  const generateBackupCodes = async () => {
    try {
      const { identityService } = await import('../services/identityService');
      const codes = await identityService.generateBackupCodes();
      setBackupCodes(codes);
      setBackupCodesEnabled(true);
      setShowBackupCodes(true);
      showToast('8 single-use cryptographic backup codes generated and saved.', 'success');
    } catch (err) {
      showToast('Failed to generate backup codes', 'error');
    }
  };

  const handleSaveChanges = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const { identityService } = await import('../services/identityService');
      await identityService.updateSecuritySettings({
        twoFactorEnabled,
        biometricEnabled,
        backupCodes
      });
      showToast('Security posture and preferences updated successfully.', 'success');
    } catch (err) {
      showToast('Failed to update security settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-white">Security Settings</h1>
              <p className="text-blue-100">
                Configure your account security preferences
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Account Security Overview */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Account Security Status</h2>
            <p className="text-sm text-gray-600 mb-4">
              Your account is protected with multiple layers of security.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-2">
                  <LockClosedIcon className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">Password</span>
              </div>
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-2 ${phoneVerification ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <DeviceMobileIcon className={`h-4 w-4 ${phoneVerification ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <span className="text-sm font-medium">Phone</span>
              </div>
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-2 ${twoFactorEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <UserCircleIcon className={`h-4 w-4 ${twoFactorEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <span className="text-sm font-medium">2FA</span>
              </div>
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-2 ${biometricEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <FingerPrintIcon className={`h-4 w-4 ${biometricEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <span className="text-sm font-medium">Biometric</span>
              </div>
            </div>
          </div>

          {/* Phone Verification */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Phone Verification</h2>
                <p className="text-sm text-gray-500">
                  Verified phone number for account recovery and 2FA
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-3">{phoneVerification}</span>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h2>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            </div>

            {twoFactorEnabled && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800">Setup Two-Factor Authentication</h3>
                <p className="text-sm text-blue-600 mt-1">
                  Scan the QR code with your authenticator app and enter the code below:
                </p>
                <div className="flex items-center mt-3">
                  <div className="bg-white p-2 mr-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 flex items-center justify-center">
                      <span className="text-xs text-gray-500 text-center">QR Code</span>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Multi-Factor Authentication */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Multi-Factor Authentication</h2>
                <p className="text-sm text-gray-500">
                  Combine multiple authentication methods for enhanced security
                </p>
              </div>
              <button
                onClick={() => setMultiFactorEnabled(!multiFactorEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  multiFactorEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`${
                    multiFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            </div>

            {multiFactorEnabled && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-800">Authentication Methods</h3>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="sms-auth" defaultChecked className="mr-2" />
                      <label htmlFor="sms-auth" className="text-sm">SMS Authentication</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="email-auth" defaultChecked className="mr-2" />
                      <label htmlFor="email-auth" className="text-sm">Email Authentication</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="app-auth" defaultChecked className="mr-2" />
                      <label htmlFor="app-auth" className="text-sm">Authenticator App</label>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-800">Required Factors</h3>
                  <div className="mt-3">
                    <label className="block text-sm mb-2">Number of factors required:</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>2 factors</option>
                      <option>3 factors</option>
                      <option>4 factors</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Biometric Authentication */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Biometric Authentication</h2>
                <p className="text-sm text-gray-500">
                  Use fingerprint or face recognition to sign in
                </p>
              </div>
              <button
                onClick={() => setBiometricEnabled(!biometricEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  biometricEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`${
                    biometricEnabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            </div>

            {biometricEnabled && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <FingerPrintIcon className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-medium text-green-800">Fingerprint</h3>
                  </div>
                  <div className="mt-3 flex items-center">
                    <button
                      onClick={() => setFingerprintEnabled(!fingerprintEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        fingerprintEnabled ? 'bg-green-600' : 'bg-gray-300'
                      } mr-3`}
                    >
                      <span
                        className={`${
                          fingerprintEnabled ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </button>
                    <span className="text-sm">Enable fingerprint authentication</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <UserCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-blue-800">Face ID</h3>
                  </div>
                  <div className="mt-3 flex items-center">
                    <button
                      onClick={() => setFaceIdEnabled(!faceIdEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        faceIdEnabled ? 'bg-blue-600' : 'bg-gray-300'
                      } mr-3`}
                    >
                      <span
                        className={`${
                          faceIdEnabled ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </button>
                    <span className="text-sm">Enable face recognition</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Backup Codes */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Backup Codes</h2>
                <p className="text-sm text-gray-500">
                  Codes to access your account if you lose your device {backupCodesEnabled && <span className="ml-2 text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Active</span>}
                </p>
              </div>
              <button
                onClick={generateBackupCodes}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                Generate Codes
              </button>
            </div>

            {showBackupCodes && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">Your Backup Codes</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Save these codes in a secure location. Each code can only be used once.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="bg-white p-3 rounded text-center text-sm font-mono border border-gray-200">
                      {code}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center">
                  <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-600">
                    Consider storing your backup codes in a password manager or printing them
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Privacy Controls */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Privacy Controls</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Visibility of Profile</h3>
                  <p className="text-sm text-gray-500">Control who can see your profile</p>
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Public</option>
                  <option>Friends Only</option>
                  <option>Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Message Encryption</h3>
                  <p className="text-sm text-gray-500">End-to-end encryption for messages</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    name="encrypt-messages"
                    id="encrypt-messages"
                    defaultChecked
                    className="sr-only"
                  />
                  <div className="block bg-blue-600 w-10 h-6 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium disabled:opacity-50"
            >
              {isSaving ? 'Saving Security Settings...' : 'Save Security Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySetupPage;
