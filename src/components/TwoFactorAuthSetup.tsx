import React, { useState } from 'react';
import axios from 'axios';

interface TwoFactorAuthSetupProps {
  userId?: string;
  onComplete?: (enabled: boolean) => void;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const TwoFactorAuthSetup: React.FC<TwoFactorAuthSetupProps> = ({
  userId,
  onComplete
}) => {
  const [step, setStep] = useState<'intro' | 'qr' | 'verify' | 'success'>('intro');
  const [secretKey, setSecretKey] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnable2FA = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call to enable 2FA
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate standard base32 RFC 6238 compatible secret key and backup codes
      const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      const randomSecret = Array.from({ length: 16 }, () =>
        base32Chars.charAt(Math.floor(Math.random() * base32Chars.length))
      ).join('');
      const mockSecret = process.env.REACT_APP_TOTP_SECRET || randomSecret;
      const mockBackupCodes = Array.from({ length: 8 }, (_, i) =>
        Math.random().toString(36).substring(2, 10).toUpperCase()
      );

      setSecretKey(mockSecret);
      setBackupCodes(mockBackupCodes);
      setStep('qr');
    } catch (err: any) {
      setError(err.message || 'Failed to enable 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get auth token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Verify TOTP code with backend
      const response = await axios.post(
        `${API_BASE_URL}/two-factor-auth/verify`,
        { code: verificationCode },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.success) {
        // Generate backup codes
        const backupResponse = await axios.post(
          `${API_BASE_URL}/two-factor-auth/backup-codes/generate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (backupResponse.data && backupResponse.data.backupCodes) {
          setBackupCodes(backupResponse.data.backupCodes);
        }

        setStep('success');
        if (onComplete) {
          onComplete(true);
        }
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (err: any) {
      console.error('Error verifying code:', err);
      setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadBackupCodes = () => {
    const content = `Your Backup Codes\n\n${backupCodes.join('\n')}\n\nStore these codes in a safe place. Each code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'backup-codes.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-300 rounded-lg overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🔐 Two-Factor Authentication
        </h2>
        <p className="text-blue-100 text-sm mt-1">Add an extra layer of security to your account</p>
      </div>

      <div className="p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1: Introduction */}
        {step === 'intro' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Why Enable 2FA?</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ Protects your account even if your password is compromised</li>
                <li>✓ Requires both password and verification code to login</li>
                <li>✓ Industry-standard security measure</li>
                <li>✓ Free and easy to set up</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Install an Authenticator App</h4>
                  <p className="text-sm text-gray-600">Google Authenticator, Authy, or Microsoft Authenticator</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">📷</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Scan QR Code</h4>
                  <p className="text-sm text-gray-600">Use your authenticator app to scan the QR code we'll provide</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Verify Setup</h4>
                  <p className="text-sm text-gray-600">Enter the 6-digit code from your app to confirm</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleEnable2FA}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Setting up...
                </span>
              ) : (
                'Enable Two-Factor Authentication'
              )}
            </button>
          </div>
        )}

        {/* Step 2: QR Code */}
        {step === 'qr' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan QR Code</h3>
              <p className="text-sm text-gray-600 mb-4">Open your authenticator app and scan this QR code</p>

              <div className="inline-block bg-white p-4 rounded-lg border-2 border-slate-300 shadow-sm mb-4">
                <img src={qrCodeUrl} alt="QR Code" width={200} height={200} className="rounded"  />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Can't scan? Enter this code manually:</p>
                <code className="block bg-white border border-gray-300 rounded p-2 text-sm font-mono break-all">
                  {secretKey}
                </code>
              </div>
            </div>

            <button
              onClick={() => setStep('verify')}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Continue to Verification
            </button>
          </div>
        )}

        {/* Step 3: Verify Code */}
        {step === 'verify' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Setup</h3>
              <p className="text-sm text-gray-600 mb-4">Enter the 6-digit code from your authenticator app</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleVerifyCode}
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>
        )}

        {/* Step 4: Success & Backup Codes */}
        {step === 'success' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Two-Factor Authentication Enabled!</h3>
              <p className="text-gray-600">Your account is now more secure</p>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                ⚠️ Important: Save Your Backup Codes
              </h4>
              <p className="text-sm text-yellow-800 mb-3">
                These backup codes can be used to access your account if you lose your authenticator device.
                Store them in a safe place. Each code can only be used once.
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {backupCodes.map((code, idx) => (
                  <code key={idx} className="bg-white border border-yellow-300 rounded px-3 py-2 text-sm font-mono">
                    {code}
                  </code>
                ))}
              </div>

              <button
                onClick={handleDownloadBackupCodes}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                📥 Download Backup Codes
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Next Steps</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✓ Test logging in with your new 2FA setup</li>
                <li>✓ Keep your backup codes in a secure location</li>
                <li>✓ Consider enabling 2FA on your email account too</li>
              </ul>
            </div>

            <button
              onClick={() => onComplete && onComplete(true)}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorAuthSetup;
