import React from 'react';
/*
 * FingerMobile Protocol™ - Monetization Page Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import { useWeb3 } from '../contexts/Web3Context';
import { useAppContext } from "../contexts/AppContext";

const MonetizationPage: React.FC = () => {
  const { balance } = useWeb3();
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = React.useState('overview');
  const [showTokenizeModal, setShowTokenizeModal] = React.useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = React.useState(false);
  const [selectedContent, setSelectedContent] = React.useState<any>(null);

  // Mock data for monetization stats
  const monetizationStats = {
    totalEarnings: 2450.75,
    thisMonth: 320.50,
    totalSubscribers: 124,
    totalPurchases: 89
  };

  // Mock data for content
  const content = [
    {
      id: 1,
      title: 'Summer Music Production Tutorial',
      type: 'video',
      earnings: 1250.75,
      views: 12500,
      purchases: 42,
      subscribers: 24,
      status: 'monetized',
      thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 2,
      title: 'Digital Art Collection',
      type: 'image',
      earnings: 890.25,
      views: 8900,
      purchases: 32,
      subscribers: 18,
      status: 'monetized',
      thumbnail: 'https://images.unsplash.com/photo-1543857778-c4a1a569e7bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 3,
      title: 'Behind the Scenes Photos',
      type: 'image',
      earnings: 0,
      views: 4200,
      purchases: 0,
      subscribers: 0,
      status: 'unmonetized',
      thumbnail: 'https://images.unsplash.com/photo-1543857778-c4a1a569e7bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }
  ];

  // Mock data for payout history
  const payoutHistory = [
    { id: 1, amount: 1250.75, date: '2023-06-01', status: 'completed' },
    { id: 2, amount: 890.25, date: '2023-05-01', status: 'completed' },
    { id: 3, amount: 320.50, date: '2023-04-01', status: 'completed' }
  ];

  const handleTokenizeContent = (contentItem: any) => {
    setSelectedContent(contentItem);
    setShowTokenizeModal(true);
  };

  const handleCreatePaylink = (contentItem: any) => {
    setSelectedContent(contentItem);
    setShowPaylinkModal(true);
  };

  const monetizedContent = content.filter(item => item.status === 'monetized');
  const unmonetizedContent = content.filter(item => item.status === 'unmonetized');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Monetization</h1>
          <p className="text-gray-600">Track earnings and monetize your content</p>
        </div>

        {/* Monetization Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">{monetizationStats.totalEarnings.toFixed(2)} <span className="text-sm text-gray-500">FIC</span></p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{monetizationStats.thisMonth.toFixed(2)} <span className="text-sm text-gray-500">FIC</span></p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{monetizationStats.totalSubscribers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Purchases</p>
                <p className="text-2xl font-bold text-gray-900">{monetizationStats.totalPurchases}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Content
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payouts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Payouts
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Earnings Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Earnings History</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Earnings Chart</h3>
                    <p className="mt-1 text-gray-500">Visual representation of your earnings over time</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Top Performing Content</h3>
                <div className="space-y-4">
                  {content.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center">
                      <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-lg object-cover"  />
                      <div className="ml-3 flex-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.earnings.toFixed(2)} FIC earned</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{item.purchases}</p>
                        <p className="text-xs text-gray-500">purchases</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Content</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center" aria-label="Button"><svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Content
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Monetized Content</h3>
                {monetizedContent.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No monetized content</h3>
                    <p className="mt-1 text-gray-500">Monetize your existing content to start earning</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {monetizedContent.map((item) => (
                      <div key={item.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-lg object-cover"  />
                        <div className="ml-3 flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                          <p className="text-xs text-gray-500">{item.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{item.earnings.toFixed(2)} FIC</p>
                          <p className="text-xs text-gray-500">{item.purchases} purchases</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Unmonetized Content</h3>
                {unmonetizedContent.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">All content monetized</h3>
                    <p className="mt-1 text-gray-500">Great job! All your content is monetized</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {unmonetizedContent.map((item) => (
                      <div key={item.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-lg object-cover"  />
                        <div className="ml-3 flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                          <p className="text-xs text-gray-500">{item.type}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleTokenizeContent(item)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                          >
                            Tokenize
                          </button>
                          <button 
                            onClick={() => handleCreatePaylink(item)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                          >
                            Paylink
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payouts Tab */}
        {activeTab === 'payouts' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Payout History</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Request Payout
              </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payoutHistory.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payout.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payout.amount.toFixed(2)} FIC
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {payout.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-900">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Content Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Top Performing Content</h3>
                <div className="space-y-4">
                  {content.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <img src={item.thumbnail} alt={item.title} className="w-full h-32 object-cover rounded-t-lg max-w-full h-auto"  />
                      <div className="ml-3 flex-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>{item.views.toLocaleString()} views</span>
                          <span className="mx-2">•</span>
                          <span>{item.purchases} purchases</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{item.earnings.toFixed(2)} FIC</p>
                        <p className="text-xs text-gray-500">earned</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Audience Insights</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Audience Analytics</h3>
                    <p className="mt-1 text-gray-500">Demographics and engagement data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tokenize Content Modal */}
      {showTokenizeModal && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Tokenize Content</h3>
              <button 
                onClick={() => setShowTokenizeModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="py-4">
              <div className="flex items-center mb-4">
                <img src={selectedContent.thumbnail} alt={selectedContent.title} className="w-16 h-16 rounded-lg object-cover"  />
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">{selectedContent.title}</h4>
                  <p className="text-sm text-gray-500">{selectedContent.type}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Token Price (FIC)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Royalty Percentage</label>
                  <input
                    type="number"
                    placeholder="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Percentage you earn on secondary sales</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option>Commercial Use</option>
                    <option>Non-Commercial Use</option>
                    <option>Creative Commons</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowTokenizeModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast(`Content "${selectedContent.title}" has been tokenized!`, "success");
                  setShowTokenizeModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Tokenize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Paylink Modal */}
      {showPaylinkModal && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create Paylink</h3>
              <button 
                onClick={() => setShowPaylinkModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="py-4">
              <div className="flex items-center mb-4">
                <img src={selectedContent.thumbnail} alt={selectedContent.title} className="w-16 h-16 rounded-lg object-cover"  />
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">{selectedContent.title}</h4>
                  <p className="text-sm text-gray-500">{selectedContent.type}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (FIC)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Enter a description for this paylink"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiration</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option>No expiration</option>
                    <option>1 day</option>
                    <option>1 week</option>
                    <option>1 month</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowPaylinkModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast(`Paylink for "${selectedContent.title}" has been created!`, "success");
                  setShowPaylinkModal(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Paylink
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonetizationPage;
