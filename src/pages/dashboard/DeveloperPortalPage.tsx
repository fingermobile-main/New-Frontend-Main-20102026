import React, { useEffect, useState } from 'react';
import { DocumentTextIcon, CodeBracketIcon, ArrowDownTrayIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const DeveloperPortalPage: React.FC = () => {
  const [stats, setStats] = useState<any>({
    total_endpoints: 128,
    documented_endpoints: 128,
    last_updated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/developer/stats');
      if (response.data?.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.warn('Developer stats backend fallback active:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadSDK = async (language: string) => {
    try {
      const response = await api.get(`/developer/sdk/${language}`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = language === 'javascript' ? 'fingermobile-sdk.js' : 'fingermobile_sdk.py';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download SDK:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Developer Portal</h1>
          <p className="text-lg opacity-90">Complete API documentation, SDKs, and integration guides</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <CodeBracketIcon className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600">Total Endpoints</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total_endpoints}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <BookOpenIcon className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-sm text-gray-600">Documented</p>
              <p className="text-3xl font-bold text-gray-900">{stats.documented_endpoints}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <ArrowDownTrayIcon className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(stats.last_updated).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Documentation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <DocumentTextIcon className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">API Documentation</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Browse our comprehensive OpenAPI specification with interactive examples
            </p>
            <div className="space-y-3">
              <a
                href="/api-docs"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-lg transition-colors text-center"
              >
                View Swagger UI →
              </a>
              <a
                href="/api/developer/openapi.json"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors text-center"
              >
                Download OpenAPI JSON
              </a>
            </div>
          </div>

          {/* SDK Downloads */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <CodeBracketIcon className="w-6 h-6 text-purple-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">SDK Downloads</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Official client libraries for quick integration
            </p>
            <div className="space-y-3">
              <button
                onClick={() => downloadSDK('javascript')}
                className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <span className="mr-2">📦</span>
                JavaScript/TypeScript SDK
              </button>
              <button
                onClick={() => downloadSDK('python')}
                className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <span className="mr-2">🐍</span>
                Python SDK
              </button>
            </div>
          </div>

          {/* Code Examples */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">💻</span>
              <h2 className="text-xl font-bold text-gray-900">Code Examples</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Ready-to-use cURL examples for all endpoints
            </p>
            <a
              href="/api/developer/examples/curl"
              download="curl-examples.sh"
              className="block w-full bg-green-50 hover:bg-green-100 text-green-700 font-medium py-3 px-4 rounded-lg transition-colors text-center"
            >
              Download cURL Examples
            </a>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <BookOpenIcon className="w-6 h-6 text-orange-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Quick Start</h2>
            </div>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre>{`// JavaScript Example
import FingerMobileSDK from 'fingermobile-sdk';

const sdk = new FingerMobileSDK('YOUR_API_KEY');

// Get courses
const courses = await sdk.getCourses({ limit: 10 });

// Enroll in course
await sdk.enrollInCourse(123);

// Get analytics dashboard
const dashboard = await sdk.getDashboardData('monthly');`}</pre>
            </div>
          </div>
        </div>

        {/* API Categories */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">API Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Authentication', icon: '🔐', count: 5 },
              { name: 'Course Content', icon: '🎓', count: 14 },
              { name: 'Analytics', icon: '📊', count: 6 },
              { name: 'Analytics Enhanced', icon: '📈', count: 7 },
              { name: 'Sentient AI', icon: '🤖', count: 4 },
              { name: 'PROMPTS', icon: '🛡️', count: 4 },
              { name: 'Wallet', icon: '💰', count: 8 },
              { name: 'Payments', icon: '💳', count: 6 },
              { name: 'Staking', icon: '⚡', count: 5 }
            ].map((category, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl mr-2">{category.icon}</span>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  </div>
                  <span className="text-sm text-gray-500">{category.count} endpoints</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPortalPage;
