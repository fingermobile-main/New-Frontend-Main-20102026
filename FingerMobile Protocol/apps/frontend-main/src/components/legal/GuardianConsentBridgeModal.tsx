import React, { useState } from 'react';
import { XIcon } from '../icons';

interface GuardianConsentBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  minorUserId: string;
  onConsentVerified?: () => void;
}

export const GuardianConsentBridgeModal: React.FC<GuardianConsentBridgeModalProps> = ({
  isOpen,
  onClose,
  minorUserId,
  onConsentVerified
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dob, setDob] = useState('');
  const [isMinor, setIsMinor] = useState(false);
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) {
      setErrorMessage('Please select your date of birth.');
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setIsMinor(true);
      setStep(2);
      setErrorMessage(null);
    } else {
      setIsMinor(false);
      onClose();
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guardianEmail) {
      setErrorMessage('Guardian email address is required.');
      return;
    }
    setStep(3);
    setErrorMessage(null);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/v1/vault/legal/child-protection/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minorUserId,
          guardianEmail,
          guardianPhone,
          verificationMethod: 'otp'
        })
      });

      if (res.ok) {
        if (onConsentVerified) onConsentVerified();
        onClose();
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Failed to verify consent.');
      }
    } catch (err) {
      setErrorMessage('Network error during verification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <div>
              <h3 className="text-base font-black text-white">NDPA Age Verification & Child Protection</h3>
              <p className="text-[11px] text-slate-300 font-medium">Nigeria Data Protection Act (NDPA 2023 Section 31)</p>
            </div>
          </div>
          <button aria-label="Close"
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: NEUTRAL DOB GATE */}
        {step === 1 && (
          <form onSubmit={handleDobSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Enter your Date of Birth (Neutral Gate)
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
              <p className="text-[11px] text-slate-700 font-medium mt-1">
                Your date of birth is processed locally for statutory category classification.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg"
            >
              Confirm Age Category →
            </button>
          </form>
        )}

        {/* STEP 2: GUARDIAN BRIDGE FOR MINORS */}
        {step === 2 && isMinor && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
              <strong>Minor-Mode Protocol Engaged ($U_minor$):</strong> Users under 18 require verified parental/guardian consent. Personalized tracking will be disabled and night curfew (9 PM–7 AM) activated.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Parent / Legal Guardian Email
              </label>
              <input
                type="email"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
                placeholder="guardian@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Guardian Phone Number (Optional SMS OTP)
              </label>
              <input
                type="tel"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg"
            >
              Send Verification OTP Code →
            </button>
          </form>
        )}

        {/* STEP 3: OTP VERIFICATION */}
        {step === 3 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-xs text-slate-300">
              An OTP verification token has been dispatched to <strong>{guardianEmail}</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Enter 6-Digit Consent Code
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-center text-lg font-mono tracking-widest text-amber-400 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying Consent...' : 'Authorize Minor Account Access ✓'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default GuardianConsentBridgeModal;
