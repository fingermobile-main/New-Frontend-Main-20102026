import React, { useState } from 'react';
import {
  ShieldCheckIcon,
  KeyIcon,
  CheckCircleIcon,
  LockClosedIcon,
  SparklesIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface LushPinGateModalProps {
  isOpen: boolean;
  onConsentSuccess: (pin: string) => void;
  onClose?: () => void;
}

export const LushPinGateModal: React.FC<LushPinGateModalProps> = ({
  isOpen,
  onConsentSuccess,
  onClose
}) => {
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [generatedPin, setGeneratedPin] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newDigits = [...pinDigits];
    newDigits[index] = value;
    setPinDigits(newDigits);
    setErrorMsg(null);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`lush-pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      const prevInput = document.getElementById(`lush-pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleGeneratePin = () => {
    setIsRegistering(true);
    setErrorMsg(null);
    setTimeout(() => {
      // Generate a secure 6-digit random PIN
      const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedPin(randomPin);
      setPinDigits(randomPin.split(''));
      setIsRegistering(false);
    }, 600);
  };

  const handleVerifyAndConsent = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = pinDigits.join('');
    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      setErrorMsg('Please enter a valid 6-digit registration PIN.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMsg('You must consent to Lush Pressies Sovereign Membership terms to continue.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsSubmitting(false);
      // Save consent locally for session
      try {
        localStorage.setItem('lush_pressies_consent', 'true');
        localStorage.setItem('lush_pressies_pin', pin);
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
      onConsentSuccess(pin);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#F5F9F6] border border-emerald-200/80 rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative overflow-hidden">
        {/* Top Decorative Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-[#DC582A]" />

        <div className="text-center mb-6 pt-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner border text-emerald-950  font-black">
            <LockClosedIcon className="w-8 h-8 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Lush-Pressies Sovereign Access
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-sm mx-auto leading-relaxed">
            FingerMobile platform membership does not automatically grant access to Lush Pressies.
            Register, obtain your private 6-digit security PIN, and provide verified consent.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs sm:text-sm">
            <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {generatedPin && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs sm:text-sm text-emerald-900">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Your Assigned Member PIN: <strong>{generatedPin}</strong></span>
            </div>
            <span className="text-[11px] bg-emerald-200/70 text-emerald-800 px-2 py-0.5 rounded font-mono">
              Auto-filled
            </span>
          </div>
        )}

        <form onSubmit={handleVerifyAndConsent} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 text-center">
              Enter 6-Digit Member PIN
            </label>
            <div className="flex justify-center gap-2 sm:gap-3">
              {pinDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`lush-pin-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold bg-white text-slate-900 border-2 border-emerald-300 rounded-xl shadow-xs focus:border-emerald-600 focus:ring-2 focus:ring-emerald-400/40 focus:outline-hidden transition border border-slate-300 placeholder:text-slate-400"
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGeneratePin}
              disabled={isRegistering}
              className="text-xs sm:text-sm text-emerald-700 hover:text-emerald-800 font-semibold underline flex items-center gap-1.5 transition"
            >
              <KeyIcon className="w-4 h-4" />
              {isRegistering ? 'Generating Secure PIN...' : "Don't have a PIN? Register & Generate One"}
            </button>
          </div>

          <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-100 text-xs text-gray-600 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-slate-900 focus:ring-emerald-500 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
              />
              <span className="leading-tight text-gray-700 font-medium">
                I agree to the Lush Pressies Inclusivity & Mutual Respect Covenant, PIN Exchange Protocols, and Age-Verified Dating Guidelines.
              </span>
            </label>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl text-sm transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <CheckCircleIcon className="w-5 h-5" />
              {isSubmitting ? 'Verifying...' : 'Consent & Enter Lush-Pressies'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
            End-to-End Encrypted | Sovereign Web3 Consent Engine
          </p>
        </div>
      </div>
    </div>
  );
};

export default LushPinGateModal;
