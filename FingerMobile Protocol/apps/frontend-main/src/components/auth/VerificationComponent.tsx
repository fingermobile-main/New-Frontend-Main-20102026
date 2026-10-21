import React, { useEffect, useRef, useState } from 'react';

import authService from '../../services/authService';

interface VerificationProps {
  phone: string;
  onSuccess: (_userData: any) => void;
}

const VerificationComponent: React.FC<VerificationProps> = ({ phone, onSuccess }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState('');

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle input change for each digit
  const handleChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value)) return; // Only allow numbers

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input if value was entered and not the last one
    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  // Handle backspace to move to previous input
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    try {
      await authService.sendVerificationCode(phone);
      setCountdown(30);
      setResendDisabled(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit verification code
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.verifyCode(phone, verificationCode);
      onSuccess(userData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer for resend button
  useEffect(() => {
    if (resendDisabled && countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resendDisabled, countdown]);

  // Send initial verification code
  useEffect(() => {
    const sendInitialCode = async () => {
      try {
        await authService.sendVerificationCode(phone);
      } catch (err: any) {
        setError(err.message);
      }
    };

    if (phone) {
      sendInitialCode();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [phone]);

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
        Verify Your Phone
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
        Enter the 6-digit code sent to <span className="font-semibold">{phone}</span>
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center space-x-3 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-2xl text-center border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || code.some(digit => !digit)}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-700 dark:text-slate-300 font-medium text-sm">
          Didn't receive the code?{' '}
          <button
            onClick={handleResendCode}
            disabled={resendDisabled || loading}
            className={`font-medium ${
              resendDisabled
                ? 'text-slate-700 cursor-not-allowed'
                : 'text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
            }`}
          >
            {resendDisabled ? `Resend in ${countdown}s` : 'Resend code'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerificationComponent;
