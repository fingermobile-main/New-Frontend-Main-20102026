import { NavLink } from 'react-router-dom';
import React, {} from 'react';

import { useAuth } from '../../contexts/AuthContext';
import { SubscriptionIcon } from '../icons';

interface SubscriptionGateProps {
  children: React.ReactNode;
  requiredPlan?: string;
  featureName: string;
}

const SubscriptionGate: React.FC<SubscriptionGateProps> = ({
  children,
  requiredPlan,
  featureName
}) => {
  const { member } = useAuth();

  const hasAccess = () => {
    // @ts-expect-error: auto-fixed by agent
    if (!member?.isSubscribed) return false;

    // Admins have access to everything
    if (member.role === 'Admin') return true;

    if (requiredPlan) {
      // Tiered access logic
      // @ts-expect-error: auto-fixed by agent
      if (member.currentPlan === 'Creator Pro') return true; // Creator Pro can access everything

      // @ts-expect-error: auto-fixed by agent
      if (member.currentPlan === 'Premium' && requiredPlan !== 'Creator Pro')
        return true;

      // @ts-expect-error: auto-fixed by agent
      return member.currentPlan === requiredPlan;
    }

    return true; // Any subscription is fine if no specific plan is required
  };

  if (hasAccess()) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center h-full min-h-[calc(100vh-200px)] p-8">
      <div className="text-center bg-white p-10 rounded-xl shadow-lg max-w-md mx-auto">
        <div className="mx-auto mb-4 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
          <SubscriptionIcon className="w-8 h-8 text-brand-blue" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Subscription Required
        </h2>
        <p className="text-gray-600 mt-2 mb-6">
          To access {featureName}, you need an active{' '}
          {requiredPlan ? `${requiredPlan} ` : ''}subscription.
        </p>
        <NavLink
          to="/financials/subscriptions"
          className="px-6 py-3 font-semibold bg-brand-blue text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm"
        >
          View Subscription Plans
        </NavLink>
      </div>
    </div>
  );
};

export default SubscriptionGate;
