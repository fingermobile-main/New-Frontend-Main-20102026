import React from 'react';
import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from "../contexts/AppContext";
import { 
  ChartBarIcon, 
  ArrowsPointingOutIcon,
  Cog6ToothIcon
} from '../icons';

const GrafanaEmbedPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [selectedDashboard, setSelectedDashboard] = useState('fingermobile-overview');
  const [autoRefresh, setAutoRefresh] = useState(30); // seconds
  const [isFullscreen, setIsFullscreen] = useState(false);

  const grafanaDashboards = [
    { id: 'fingermobile-overview', name: 'FingerMobile Overview', url: '/d/fingermobile-overview' },
    { id: 'system-resources', name: 'System Resources', url: '/d/system-resources' },
    { id: 'application-performance', name: 'Application Performance', url: '/d/app-performance' },
    { id: 'database-metrics', name: 'Database Metrics', url: '/d/db-metrics' },
    { id: 'business-analytics', name: 'Business Analytics', url: '/d/business-analytics' }
  ];

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <MainLayout>
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'max-w-7xl mx-auto px-4 py-8'}`}>
        {/* Header */}
        {!isFullscreen && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
                  <ChartBarIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-3xl font-bold text-gray-900">Grafana Dashboards</h1>
                  <p className="text-gray-600">Embedded Grafana dashboards for advanced monitoring</p>
                </div>
              </div>
              <button
                onClick={handleFullscreen}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                <ArrowsPointingOutIcon className="h-5 w-5 mr-2" />
                Fullscreen
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Selector and Controls */}
        {!isFullscreen && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Dashboard
                  </label>
                  <select
                    value={selectedDashboard}
                    onChange={(e) => setSelectedDashboard(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[250px]"
                  >
                    {grafanaDashboards.map((dashboard) => (
                      <option key={dashboard.id} value={dashboard.id}>
                        {dashboard.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto-refresh
                  </label>
                  <select
                    value={autoRefresh}
                    onChange={(e) => setAutoRefresh(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value={0}>Off</option>
                    <option value={5}>5 seconds</option>
                    <option value={10}>10 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={300}>5 minutes</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Cog6ToothIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Refresh: {autoRefresh > 0 ? `${autoRefresh}s` : 'Manual'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Grafana Embed */}
        <div className={`${isFullscreen ? 'h-screen' : 'bg-white rounded-xl shadow-lg overflow-hidden'}`}>
          {isFullscreen && (
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleFullscreen}
                className="px-4 py-2 bg-gray-900 bg-opacity-75 text-white rounded-lg hover:bg-opacity-100 transition-colors"
              >
                Exit Fullscreen
              </button>
            </div>
          )}
          
          <iframe
            src={`http://localhost:3000/d/${selectedDashboard}?orgId=1&refresh=${autoRefresh > 0 ? `${autoRefresh}s` : ''}&kiosk`}
            width="100%"
            height={isFullscreen ? '100%' : '800px'}
            frameBorder="0"
            title={`Grafana Dashboard - ${selectedDashboard}`}
            className="w-full"
            allowFullScreen
          />
        </div>

        {/* Info Panel */}
        {!isFullscreen && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">About Grafana Integration</h3>
            <p className="text-blue-800 mb-4">
              This page embeds Grafana dashboards directly into the FingerMobile platform. 
              Grafana provides powerful visualization and alerting capabilities for your metrics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong className="text-blue-900">Authentication:</strong>
                <p className="text-blue-700 mt-1">Uses Grafana's built-in auth or OAuth integration</p>
              </div>
              <div>
                <strong className="text-blue-900">Data Sources:</strong>
                <p className="text-blue-700 mt-1">Connected to Prometheus, PostgreSQL, and Redis</p>
              </div>
              <div>
                <strong className="text-blue-900">Alerts:</strong>
                <p className="text-blue-700 mt-1">Configured alerts notify via email, Slack, or PagerDuty</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default GrafanaEmbedPage;
