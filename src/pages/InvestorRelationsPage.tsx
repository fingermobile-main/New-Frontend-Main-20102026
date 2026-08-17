import React, {} from 'react';
import MainLayout from '../components/layout/MainLayout';
import InvestorRelationsDashboard from '../components/dashboard/InvestorRelationsDashboard';
import { useAppContext } from "../contexts/AppContext";
import { BuildingOfficeIcon, CurrencyDollarIcon, ChartBarIcon, UserCircleIcon } from '../icons';

const InvestorRelationsPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl">
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">Investor Relations</h1>
              <p className="text-gray-600">Access financial reports, investor resources, and company updates</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <InvestorRelationsDashboard />
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1.5 rounded-lg hover:from-green-700 hover:to-emerald-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Investor Resources</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-green-50 hover:to-emerald-50 transition-colors flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-3" />
                  Financial Reports
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-green-50 hover:to-emerald-50 transition-colors flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-green-600 mr-3" />
                  Market Data
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-green-50 hover:to-emerald-50 transition-colors flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 text-green-600 mr-3" />
                  Company Updates
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Investor Benefits</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Exclusive insights into platform growth</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Early access to new features</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Quarterly financial reports</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InvestorRelationsPage;