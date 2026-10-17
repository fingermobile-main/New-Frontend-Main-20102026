import React, { useEffect, useState } from 'react';
import { useCreatorInfluenceSubscription } from '../../hooks/useCreatorInfluenceSubscription';
import { useAuth } from '../../contexts/AuthContext';

// Define proper TypeScript interfaces
interface SubscriptionUsage {
  subscription_level: string;
  features_used: number;
  features_available: number;
  usage_percentage: number;
  days_remaining: number | null;
}

interface BillingHistoryItem {
  id: string;
  date: string;
  description?: string;
  amount?: number;
  status?: string;
}

interface SubscriptionDashboardProps {
  _followers: number; // Renamed to indicate intentional unused prop
  _engagementRate: number; // Renamed to indicate intentional unused prop
}

const SubscriptionDashboard: React.FC<SubscriptionDashboardProps> = ({
  _followers,
  _engagementRate
}) => {
  const { member } = useAuth();

  // Ensure memberId is properly typed as string
  const memberIdString = member?.id?.toString() || '';

  // Destructure only the properties that exist in the hook return type
  const {
    subscription,
    loading,
    error,
    createSubscription, // renamed from subscribe
    cancelSubscription,
    upgradeSubscription, // renamed from updatePlan
    getBillingHistory,
    getSubscriptionUsage
  } = useCreatorInfluenceSubscription({ memberId: memberIdString });

  const [usage, setUsage] = useState<SubscriptionUsage | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Inside the useEffect, we'll fetch usage and billing history separately
  useEffect(() => {
    const fetchData = async () => {
      if (!memberIdString) return;

      try {
        // Fetch usage data
        const usageData = await getSubscriptionUsage(); // This function now exists in the hook
        setUsage(usageData);

        // Fetch billing history
        const billingData = await getBillingHistory();
        setBillingHistory(billingData);
      } catch (err) {
        console.error('Error fetching subscription data:', err);
      }
    };

    fetchData();
  }, [memberIdString, getSubscriptionUsage, getBillingHistory]);

  const handleCancelSubmit = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setIsCancelling(true);
    try {
      await cancelSubscription(cancelReason);
      setShowCancelModal(false);
      setCancelReason('');
      // Refresh data after cancellation
      window.location.reload(); // Simple refresh for now
    } catch (err) {
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Format currency in Nigerian Naira
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Your Creator &amp; Influence Dashboard
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Manage your subscription and track your creator growth
        </p>
      </div>

      {/* Current Subscription Card */}
      {subscription ? (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-12">
          <div className="px-6 py-8 sm:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{subscription.subscription_level.replace('_', ' ').toUpperCase()}</h3>
                <p className="mt-2 text-gray-600">
                  Active since {formatDate(subscription.start_date)}
                  {subscription.end_date && (
                    <> • Ends {formatDate(subscription.end_date)}</>
                  )}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-950 border border-green-400 font-bold">
                  Active
                </span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900">Features Used</h4>
                {usage && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Available Features</span>
                      <span>{usage.features_available}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, usage.usage_percentage)}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-right text-xs text-slate-700">
                      {Math.round(usage.usage_percentage)}% of features utilized
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900">Days Remaining</h4>
                <div className="mt-4 text-3xl font-bold text-gray-900">
                  {subscription.end_date ? (
                    <>
                      {Math.max(0, Math.ceil(
                        (new Date(subscription.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      ))} days
                    </>
                  ) : (
                    <span className="text-green-600">Unlimited</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Until next renewal
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900">Auto Renewal</h4>
                <div className="mt-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    subscription.auto_renew
                      ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                      : 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
                  }`}>
                    {subscription.auto_renew ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {!subscription.auto_renew && 'Your subscription will expire at the end of the current period'}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-6 py-3 border border-red-600 text-red-600 text-base font-medium rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel Subscription
              </button>

              <button
                disabled
                className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Update Payment Method
              </button>

              <button
                disabled
                className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-12 p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Subscription</h3>
          <p className="text-gray-600 mb-6">
            You&apos;re currently on the free tier. Upgrade to unlock premium creator features!
          </p>
          <button
            onClick={() => {
              // This would trigger navigation to the subscription page
            }}
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Explore subscription plans"
          >
            Explore Subscription Plans
          </button>
        </div>
      )}

      {/* Billing History */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-300">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Billing History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billingHistory.length > 0 ? (
                billingHistory.slice(0, 5).map((item, index) => (
                  <tr key={`item-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      {formatCurrency(item.amount || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-950 border border-green-400 font-bold">
                        {item.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-800">
                    No billing history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Cancel Subscription
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-slate-700">
                        Are you sure you want to cancel your subscription? Your access to premium features will end at the end of the current billing period.
                      </p>

                      <div className="mt-4">
                        <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700">
                          Reason for cancellation (optional)
                        </label>
                        <textarea
                          id="cancel-reason"
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCancelSubmit}
                  disabled={isCancelling}
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionDashboard;
