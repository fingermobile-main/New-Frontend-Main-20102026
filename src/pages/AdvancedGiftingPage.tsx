import React, {} from 'react';
import { useAppContext } from '../contexts/AppContext';
import { GiftIcon } from '../icons';
import AdvancedGiftingEngine from '../components/gifting/AdvancedGiftingEngine';
import MainLayout from '../components/layout/MainLayout';

const AdvancedGiftingPage: React.FC = () => {
  const { ficBalance } = useAppContext();

  return (
    <MainLayout pageTitle="Advanced Gifting">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
              <GiftIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Advanced Gifting Engine
              </h1>
              <p className="text-gray-600 mt-1">
                Send and receive special gifts with effects, animations, and rewards
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <AdvancedGiftingEngine />
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <GiftIcon className="h-5 w-5 text-purple-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button
                  onClick={() => window.location.href = '/wallet'}
                  className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold"
                >
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Gifting Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-pink-50 transition-colors flex items-center font-medium text-gray-800"
                >
                  <GiftIcon className="h-5 w-5 text-purple-600 mr-3" />
                  Send Virtual Gift
                </button>
                <button
                  onClick={() => window.location.href = '/members'}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-pink-50 transition-colors flex items-center font-medium text-gray-800"
                >
                  Direct FIC Transfer
                </button>
                <button
                  onClick={() => window.location.href = '/lush-pressies'}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-pink-50 transition-colors flex items-center font-medium text-gray-800"
                >
                  Lush Escrow Pressies
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Gifting Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Customize your gifts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Send anonymous gifts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Track gift status</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdvancedGiftingPage;
