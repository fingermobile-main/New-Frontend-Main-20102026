import React, { useState } from 'react';
import { useAppContext } from "../contexts/AppContext";
import { useWeb3 } from '../contexts/Web3Context';
import { useSubscriptions } from '../hooks/useSubscriptions';

const SubscriptionsPage: React.FC = () => {
  const { balance } = useWeb3();
  const { ficBalance, showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState('active');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any | null>(null);

  const { subscriptions, loading, error, refreshData } = useSubscriptions();

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  const cancelledSubscriptions = subscriptions.filter(sub => sub.status === 'cancelled');

  const handleCancelSubscription = (subscription: any) => {
    setSelectedSubscription(subscription);
    setShowCancelModal(true);
  };

  const confirmCancelSubscription = () => {
    showToast(`Subscription to ${selectedSubscription?.name} has been cancelled. You will retain access until ${selectedSubscription?.renewalDate}.`, "success");
    setShowCancelModal(false);
    setSelectedSubscription(null);
    refreshData(); // Refresh data after cancellation
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex justify-center items-center"><p>Loading subscriptions...</p></div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 flex justify-center items-center"><p className="text-red-500">Error: {error}</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-600">Manage your creator subscriptions and payments</p>
        </div>

        {/* Subscription Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{activeSubscriptions.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Spending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeSubscriptions.reduce((sum, sub) => sum + sub.price, 0).toFixed(2)} <span className="text-sm text-gray-500">FIC</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Next Billing</p>
                <p className="text-lg font-bold text-gray-900">
                  {activeSubscriptions.length > 0 
                    ? activeSubscriptions[0].renewalDate 
                    : 'No upcoming bills'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Subscriptions
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cancelled'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cancelled Subscriptions
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'explore'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Explore Creators
            </button>
          </nav>
        </div>

        {/* Active Subscriptions */}
        {activeTab === 'active' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Active Subscriptions</h2>
            {activeSubscriptions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No active subscriptions</h3>
                <p className="mt-1 text-gray-500">Get started by subscribing to your favorite creators.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setActiveTab('explore')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Explore Creators
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeSubscriptions.map((subscription) => (
                  <div key={subscription.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center">
                        <img src={subscription.image} alt={subscription.name} className="w-12 h-12 rounded-full"  />
                        <div className="ml-4">
                          <h3 className="font-bold text-gray-900">{subscription.name}</h3>
                          <p className="text-sm text-gray-500">by {subscription.creator}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-2xl font-bold text-gray-900">
                          {subscription.price} <span className="text-lg text-gray-500">{subscription.currency}</span>
                          <span className="text-sm text-gray-500">/month</span>
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Next billing: {subscription.renewalDate}</p>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900">Included Features:</h4>
                        <ul className="mt-2 space-y-1">
                          {subscription.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-sm text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-6 flex space-x-3">
                        <button className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                          View Creator
                        </button>
                        <button 
                          onClick={() => handleCancelSubscription(subscription)}
                          className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cancelled Subscriptions */}
        {activeTab === 'cancelled' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Cancelled Subscriptions</h2>
            {cancelledSubscriptions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No cancelled subscriptions</h3>
                <p className="mt-1 text-gray-500">You haven&apos;t cancelled any subscriptions yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cancelledSubscriptions.map((subscription) => (
                  <div key={subscription.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center">
                        <img src={subscription.image} alt={subscription.name} className="w-12 h-12 rounded-full"  />
                        <div className="ml-4">
                          <h3 className="font-bold text-gray-900">{subscription.name}</h3>
                          <p className="text-sm text-gray-500">by {subscription.creator}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-2xl font-bold text-gray-900">
                          {subscription.price} <span className="text-lg text-gray-500">{subscription.currency}</span>
                          <span className="text-sm text-gray-500">/month</span>
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Cancelled on: {subscription.renewalDate}</p>
                      </div>
                      
                      <div className="mt-6">
                        <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                          Resubscribe
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Explore Creators */}
        {activeTab === 'explore' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Explore Creators</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search creators, content, or subscriptions..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center">
                      <img src={subscription.image} alt={subscription.name} className="w-12 h-12 rounded-full"  />
                      <div className="ml-4">
                        <h3 className="font-bold text-gray-900">{subscription.name}</h3>
                        <p className="text-sm text-gray-500">by {subscription.creator}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {subscription.price} <span className="text-lg text-gray-500">{subscription.currency}</span>
                        <span className="text-sm text-gray-500">/month</span>
                      </p>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Included Features:</h4>
                      <ul className="mt-2 space-y-1">
                        {subscription.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                        {subscription.features.length > 3 && (
                          <li className="text-sm text-gray-500">+{subscription.features.length- 3} more</li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="mt-6">
                      <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Cancel Subscription</h3>
              <button 
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="py-4">
              <p className="text-gray-700">
                Are you sure you want to cancel your subscription to <span className="font-bold">{selectedSubscription.name}</span>?
              </p>
              <p className="mt-2 text-sm text-gray-500">
                You will retain access to this subscription until <span className="font-medium">{selectedSubscription.renewalDate}</span>.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Keep Subscription
              </button>
              <button
                onClick={confirmCancelSubscription}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;