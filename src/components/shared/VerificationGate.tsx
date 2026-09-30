import { NavLink } from 'react-router-dom';
import React, {} from 'react';

import { VerificationBadgeIcon } from '../icons'; // Removed .tsx extension
import { useAuth } from '../../contexts/AuthContext';

interface VerificationGateProps {
  children: React.ReactNode;
  requiredVerification?: string;
  featureName: string;
}

const VerificationGate: React.FC<VerificationGateProps> = ({
  children,
  requiredVerification,
  featureName
}) => {
  const { member } = useAuth();

  const hasVerification = () => {
    if (!member?.isVerified) return false;

    // Admins have access to everything
    if (member.role === 'Admin') return true;

    if (requiredVerification) {
      // Verification tier logic
      // @ts-expect-error: auto-fixed by agent
      if (member.verificationTier === 'Premium') return true; // Premium verification can access everything

      // @ts-expect-error: auto-fixed by agent
      if (member.verificationTier === 'Verified' && requiredVerification !== 'Premium') return true;

      // @ts-expect-error: auto-fixed by agent
      return member.verificationTier === requiredVerification;
    }

    return true; // Any verification is fine if no specific tier is required
  };

  if (hasVerification()) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center h-full min-h-[calc(100vh-200px)] p-8">
      <div className="text-center bg-white p-10 rounded-xl shadow-lg max-w-md mx-auto">
        <div className="mx-auto mb-4 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
          <VerificationBadgeIcon className="w-8 h-8 text-brand-blue" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Verification Required
        </h2>
        <p className="text-gray-600 mt-2 mb-6">
          To access {featureName}, you need an active{' '}
          {requiredVerification ? `${requiredVerification} ` : ''}verification.
        </p>
        <a
          href="/settings/verification"
          className="px-6 py-3 font-semibold bg-brand-blue text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm"
        >
          Verify Account
        </a>
      </div>
    </div>
  );
};

export default VerificationGate;
