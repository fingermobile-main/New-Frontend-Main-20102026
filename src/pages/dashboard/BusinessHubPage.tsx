import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { BuildingOfficeIcon, SparklesIcon as MagicWandIcon } from '@heroicons/react/24/solid';
import CrmWidget from '../../components/dashboard/crm/CrmWidget';
import ErpFinanceWidget from '../../components/dashboard/erp/ErpFinanceWidget';
import ErpHRWidget from '../../components/dashboard/erp/ErpHRWidget';
import CrmMarketingWidget from '../../components/dashboard/crm/CrmMarketingWidget';
import CrmInvoicingWidget from '../../components/dashboard/crm/CrmInvoicingWidget';
import CrmIntegrationsWidget from '../../components/dashboard/crm/CrmIntegrationsWidget';
import MainLayout from '../../components/layout/MainLayout';

const BusinessHubPage: React.FC = () => {
  const { openModal, ficBalance } = useAppContext();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('Finance');

  const onLike = async (id: string) => {
    // Placeholder for like functionality
    console.info('Like clicked for:', id);
  };

  const onAddComment = async (id: string, comment: string) => {
    // Placeholder for comment functionality
    console.info('Comment added to:', id, comment);
  };

  const onOpenGiftModal = (id: string) => {
    // Placeholder for gift modal
    console.info('Opening gift modal for:', id);
  };

  const onOpenPaylinkModal = (id: string) => {
    // Placeholder for paylink modal
    console.info('Opening paylink modal for:', id);
  };

  const onVote = async (id: string, vote: 'up' | 'down') => {
    // Placeholder for voting functionality
    console.info('Vote:', vote, 'for:', id);
  };

  const handleDeletePost = async (id: string) => {
    // Placeholder for post deletion
    console.info('Deleting post:', id);
  };

  const handleTokenizePost = async (id: string) => {
    // Placeholder for post tokenization
    console.info('Tokenizing post:', id);
  };

  const handleAiAssist = async (id: string) => {
    // Placeholder for AI assistance
    console.info('AI assist for:', id);
  };

  return (
    <MainLayout pageTitle="Business Hub">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Business Hub: {selectedDepartment}
              </h1>
              <p className="text-gray-600 mt-1">
                Your AI-powered business management center
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Business Hub: {selectedDepartment}
                </h1>
                <p className="text-gray-500">
                  Your AI-powered business management center
                </p>
              </div>
              <button
                onClick={() => openModal('aiAssistant')}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors"
              >
                <MagicWandIcon className="w-5 h-5 mr-2" />
                <span>AI Assistant</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {selectedDepartment === 'Finance' && (
                <>
                  <div className="lg:col-span-2">
                    <ErpFinanceWidget />
                  </div>
                  <div className="lg:col-span-1">
                    <CrmInvoicingWidget />
                  </div>
                </>
              )}
              {selectedDepartment === 'HR' && (
                <>
                  <div className="lg:col-span-3">
                    <ErpHRWidget />
                  </div>
                </>
              )}
              {selectedDepartment === 'Marketing' && (
                <>
                  <div className="lg:col-span-1">
                    <CrmIntegrationsWidget />
                  </div>
                  <div className="lg:col-span-2">
                    <CrmMarketingWidget />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 text-blue-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-indigo-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Business Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Manage CRM
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  Financial Reports
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  HR Management
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Business Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Automate routine tasks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Track key metrics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Integrate systems</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BusinessHubPage;
