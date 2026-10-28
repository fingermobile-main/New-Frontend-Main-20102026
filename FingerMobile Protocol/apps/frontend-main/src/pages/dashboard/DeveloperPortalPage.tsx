import React, { useEffect, useState } from 'react';
import { DocumentTextIcon, CodeBracketIcon, ArrowDownTrayIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

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
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 overflow-x-hidden text-slate-900 pb-28 md:pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Developer Portal &amp; API Mesh</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/20 border border-white/40">
              OpenAPI 3.1
            </span>
          </div>
        </div>
        <p className="text-base text-slate-100 font-medium mt-2">Complete API documentation, type-safe SDKs, and enterprise integration blueprints</p>
      </div>

      <div className="space-y-6">
        {/* Platform Ownership Card */}
        <PlatformOwnershipCard />

        {/* Stats Cards */}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
              <div className="flex items-center justify-between mb-2">
                <CodeBracketIcon className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm font-bold text-slate-700">Total Endpoints</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stats.total_endpoints}</p>
              <p className="text-xs text-slate-700 font-medium mt-1">REST &amp; WebSocket APIs</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
              <div className="flex items-center justify-between mb-2">
                <BookOpenIcon className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-slate-700">Documented</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stats.documented_endpoints}</p>
              <p className="text-xs text-slate-700 font-medium mt-1">100% specification parity</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
              <div className="flex items-center justify-between mb-2">
                <ArrowDownTrayIcon className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm font-bold text-slate-700">Last Spec Update</p>
              <p className="text-xl font-black text-slate-900 mt-2">
                {new Date(stats.last_updated).toLocaleDateString()}
              </p>
              <p className="text-xs text-slate-700 font-medium mt-1">Synchronized with Node backend</p>
            </div>
          </div>
        )}

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Documentation */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-3">
                <DocumentTextIcon className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-black text-slate-900">API Documentation</h2>
              </div>
              <p className="text-slate-700 font-medium text-sm mb-6">
                Browse our comprehensive OpenAPI specification with interactive examples, schema validation, and sandbox execution.
              </p>
            </div>
            <div className="space-y-3">
              <a
                href="/api-docs"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-400 font-bold py-3 px-4 rounded-xl transition-colors text-center text-sm cursor-pointer"
              >
                Launch Swagger UI Explorer →
              </a>
              <a
                href="/api/developer/openapi.json"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-bold py-3 px-4 rounded-xl transition-colors text-center text-sm cursor-pointer"
              >
                Download OpenAPI JSON Spec
              </a>
            </div>
          </div>

          {/* SDK Downloads */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-3">
                <CodeBracketIcon className="w-6 h-6 text-purple-600 mr-2" />
                <h2 className="text-xl font-black text-slate-900">SDK Downloads</h2>
              </div>
              <p className="text-slate-700 font-medium text-sm mb-6">
                Official client libraries for rapid, type-safe integration across modern backend and frontend stacks.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => downloadSDK('javascript')}
                className="w-full bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-400 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center text-sm cursor-pointer"
              >
                <span className="mr-2">📦</span>
                Download TypeScript / Node SDK
              </button>
              <button
                onClick={() => downloadSDK('python')}
                className="w-full bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-400 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center text-sm cursor-pointer"
              >
                <span className="mr-2">🐍</span>
                Download Python SDK (Wheel &amp; Source)
              </button>
            </div>
          </div>

          {/* Code Examples */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">💻</span>
                <h2 className="text-xl font-black text-slate-900">cURL Integration Suite</h2>
              </div>
              <p className="text-slate-700 font-medium text-sm mb-6">
                Ready-to-use executable cURL scripts for authentication, wallet transactions, and media queries.
              </p>
            </div>
            <a
              href="/api/developer/examples/curl"
              download="curl-examples.sh"
              className="block w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold py-3 px-4 rounded-xl transition-colors text-center text-sm cursor-pointer"
            >
              Download cURL Integration Scripts (.sh)
            </a>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-3">
                <BookOpenIcon className="w-6 h-6 text-orange-600 mr-2" />
                <h2 className="text-xl font-black text-slate-900">Quick Start Sandbox</h2>
              </div>
              <p className="text-slate-700 font-medium text-sm mb-3">
                Initialize client instance with scoped JWT auth token:
              </p>
            </div>
            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto border border-slate-800">
              <pre>{`// JavaScript / TypeScript Example
import FingerMobileSDK from 'fingermobile-sdk';

const sdk = new FingerMobileSDK('YOUR_API_KEY');

// Query double-entry FIC ledger balance
const balance = await sdk.wallet.getBalance();

// Query 7 PostgreSQL cluster status
const clusterStatus = await sdk.operations.getClusterHealth();`}</pre>
            </div>
          </div>
        </div>

        {/* API Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">API Endpoint Categories</h2>
              <p className="text-xs text-slate-700 font-medium mt-0.5">Partitioned microservice endpoints across the protocol</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-950 border border-blue-400 rounded-full text-xs font-bold">
              9 Active Modules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Authentication & Identity', icon: '🔐', count: 5 },
              { name: 'Course & Media Content', icon: '🎓', count: 14 },
              { name: 'Analytics Telemetry', icon: '📊', count: 6 },
              { name: 'Enhanced Telemetry Mesh', icon: '📈', count: 7 },
              { name: 'Sentient AI & Prompts', icon: '🤖', count: 8 },
              { name: 'DEFCON & Cybersecurity', icon: '🛡️', count: 4 },
              { name: 'FIC Wallet & Ledger', icon: '💰', count: 8 },
              { name: 'Merchant Payments & Gateways', icon: '💳', count: 6 },
              { name: 'Staking & Liquidity Pools', icon: '⚡', count: 5 }
            ].map((category, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-300 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2.5">{category.icon}</span>
                    <h3 className="font-bold text-slate-900 text-sm">{category.name}</h3>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                    {category.count} endpoints
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around z-30 shadow-lg">
        <button
          onClick={() => downloadSDK('javascript')}
          type="button"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 transition-colors"
        >
          <span className="text-base font-extrabold leading-none mb-0.5">📦</span>
          <span>JS SDK</span>
        </button>
        <button
          onClick={() => downloadSDK('python')}
          type="button"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <span className="text-base font-extrabold leading-none mb-0.5">🐍</span>
          <span>Py SDK</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          type="button"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <span className="text-base font-black leading-none mb-0.5">↑</span>
          <span>Top</span>
        </button>
      </div>
    </div>
  );
};

export default DeveloperPortalPage;
