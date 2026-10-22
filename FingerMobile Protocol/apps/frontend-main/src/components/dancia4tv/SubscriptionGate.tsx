import React, {} from 'react';
import { useDancia4Tv } from '../../contexts/Dancia4TvProvider';
import type { DanciaSubscriptionPlan } from '../../types/dancia4tv';

interface SubscriptionGateProps {
  children: React.ReactNode;
  requiredPlanType: DanciaSubscriptionPlan['type'];
  fallback?: React.ReactNode;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({
  children,
  requiredPlanType,
  fallback
}) => {
  const { getMemberSubscriptionStatus, loading } = useDancia4Tv();
  const isSubscribed = getMemberSubscriptionStatus(requiredPlanType);

  if (loading) {
    return <div className="dancia-spinner">Verifying credentials...</div>;
  }

  if (!isSubscribed) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="subscription-upsell-card">
        <h3>Premium Content Protected</h3>
        <p>This premium video stream requires an active <strong>{requiredPlanType}</strong> package tier.</p>
        <button
          type="button"
          aria-label="View upgrade pricing options for premium content"
          onClick={() => window.location.assign('/pricing')}
          className="upgrade-btn"
        >View Upgrade Pricing Options</button>
      </div>
    );
  }

  return <>{children}</>;
};
