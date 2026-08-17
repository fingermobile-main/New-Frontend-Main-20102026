import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import SystemOverview from '../components/admin/SystemOverview';
import AdsManager from '../components/admin/AdsManager';
import CampaignAnalytics from '../components/admin/CampaignAnalytics';
import SecurityMonitor from '../components/admin/SecurityMonitor';
import { useAppContext } from "contexts/AppContext";  // Using absolute path from src
import { ShieldCheckIcon, ChartBarIcon, CogIcon, BellAlertIcon, UserCircleIcon } from '../icons';

const AdminDashboardPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<
    "overview" | "ads" | "analytics" | "security"
  >("overview");

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage system, monitor performance, and configure settings</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
              
              <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto px-6 -mb-px">
                  <button
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === "overview"
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    <div className="flex items-center">
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      System Overview
                    </div>
                  </button>
                  <button
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === "ads"
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab("ads")}
                  >
                    <div className="flex items-center">
                      <CogIcon className="h-4 w-4 mr-2" />
                      Ads Management
                    </div>
                  </button>
                  <button
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === "analytics"
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab("analytics")}
                  >
                    <div className="flex items-center">
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      Campaign Analytics
                    </div>
                  </button>
                  <button
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === "security"
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab("security")}
                  >
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-4 w-4 mr-2" />
                      Security Monitor
                    </div>
                  </button>
                </nav>
              </div>

              <div className="p-6">
                <div className="dashboard-content">
                  {activeTab === "overview" && <SystemOverview />}
                  {activeTab === "ads" && <AdsManager />}
                  {activeTab === "analytics" && <CampaignAnalytics />}
                  {activeTab === "security" && <SecurityMonitor />}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-purple-600 mr-2" />
                Admin FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-700 hover:to-indigo-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-indigo-50 transition-colors">
                  View Reports
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-indigo-50 transition-colors">
                  Manage Users
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-indigo-50 transition-colors">
                  System Logs
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Admin Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Regularly review security logs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Monitor system performance metrics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Update ads regularly for optimal performance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;