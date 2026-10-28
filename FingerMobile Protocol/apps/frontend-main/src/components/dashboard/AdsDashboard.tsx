import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  EyeIcon,
  ArrowTrendingUpIcon
} from '../icons';
import adsService from '../../services/adsService';

const AdsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [timeRange, setTimeRange] = React.useState('7d');
  const [adsMetrics, setAdsMetrics] = React.useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = React.useState<any[]>([]);
  const [demographics, setDemographics] = React.useState<any[]>([]);
  const [topInterests, setTopInterests] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, [timeRange, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const metrics = await adsService.getMetrics(timeRange);
        setAdsMetrics(metrics);
      } else if (activeTab === 'performance') {
        const metrics = await adsService.getPerformanceMetrics();
        setPerformanceMetrics(metrics);
      } else if (activeTab === 'audience') {
        const demoData = await adsService.getDemographics();
        const interestsData = await adsService.getInterests();

        setDemographics(demoData);
        setTopInterests(interestsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-white rounded-xl border border-gray-700 overflow-hidden p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden pb-28 md:pb-12 bg-gray-900 text-white rounded-xl border border-gray-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-gray-700 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Ads Dashboard</h2>
          <p className="text-gray-300 font-medium mt-1">
            Track and manage your advertising campaigns
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <select
            className="min-h-[44px] bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            aria-label="Select Time Range"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 px-4 sm:px-6 overflow-x-auto">
        <button
          className={`min-h-[44px] py-3 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors flex items-center justify-center ${activeTab === 'overview' ? 'border-blue-500 text-white' : 'border-transparent text-gray-300 hover:text-white'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`min-h-[44px] py-3 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors flex items-center justify-center ${activeTab === 'performance' ? 'border-blue-500 text-white' : 'border-transparent text-gray-300 hover:text-white'}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
        <button
          className={`min-h-[44px] py-3 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors flex items-center justify-center ${activeTab === 'audience' ? 'border-blue-500 text-white' : 'border-transparent text-gray-300 hover:text-white'}`}
          onClick={() => setActiveTab('audience')}
        >
          Audience
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adsMetrics.map((metric, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-xl border border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    {metric.label === 'Total Spend' && (
                      <CurrencyDollarIcon className="w-6 h-6 text-blue-400" />
                    )}
                    {metric.label === 'Impressions' && (
                      <EyeIcon className="w-6 h-6 text-purple-400" />
                    )}
                    {metric.label === 'Clicks' && (
                      <ChartBarIcon className="w-6 h-6 text-green-400" />
                    )}
                    {metric.label === 'Conversions' && (
                      <ArrowTrendingUpIcon className="w-6 h-6 text-yellow-400" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${metric.change >= 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {metric.change >= 0 ? '+' : ''}
                    {metric.change}%
                  </span>
                </div>
                <h3 className="text-gray-200 text-sm font-semibold">
                  {metric.label}
                </h3>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-bold mb-4">Campaign Performance</h3>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{metric.name}</p>
                    <p className="text-sm text-gray-300 font-medium">{metric.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{metric.value}</p>
                    <p
                      className={`text-sm ${metric.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {metric.trend >= 0 ? '+' : ''}
                      {metric.trend}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audience' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-bold mb-4">Demographics</h3>
              <div className="space-y-4">
                {demographics.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.ageRange}</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-bold mb-4">Top Interests</h3>
              <div className="flex flex-wrap gap-2">
                {topInterests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                  >
                    {interest.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
        <button
          onClick={() => setActiveTab('overview')}
          aria-label="Overview Tab"
          className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
            activeTab === 'overview' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
          }`}
        >
          <span className="text-base">📊</span>
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          aria-label="Performance Tab"
          className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
            activeTab === 'performance' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
          }`}
        >
          <span className="text-base">📈</span>
          <span>Perform</span>
        </button>
        <button
          onClick={() => setActiveTab('audience')}
          aria-label="Audience Tab"
          className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
            activeTab === 'audience' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
          }`}
        >
          <span className="text-base">👥</span>
          <span>Audience</span>
        </button>
        <button
          onClick={fetchData}
          aria-label="Refresh Ads"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">🔄</span>
          <span>Refresh</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to Top"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">⬆️</span>
          <span>Top</span>
        </button>
      </div>
    </div>
  );
};

export default AdsDashboard;
