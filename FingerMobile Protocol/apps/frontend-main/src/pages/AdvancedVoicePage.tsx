import React, {} from 'react';
import { useAppContext } from '../contexts/AppContext';
import AdvancedVoiceEngine from '../components/voice/AdvancedVoiceEngine';
import { MicrophoneIcon } from '../icons';
import MainLayout from '../components/layout/MainLayout';

const AdvancedVoicePage: React.FC = () => {
  const { ficBalance } = useAppContext();

  return (
    <MainLayout pageTitle="Advanced Voice">
      <div className="max-w-[1536px] 2xl:max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-3 rounded-xl">
              <MicrophoneIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Advanced Voice Engine
              </h1>
              <p className="text-gray-600 mt-1">
                Professional-grade voice communication with effects and advanced controls
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <AdvancedVoiceEngine />
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MicrophoneIcon className="h-5 w-5 text-blue-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-blue-600 to-teal-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-teal-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-300">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Voice Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-teal-50 transition-colors flex items-center">
                  <MicrophoneIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Start Recording
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-teal-50 transition-colors flex items-center">
                  Apply Effects
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-teal-50 transition-colors flex items-center">
                  Share Recording
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Voice Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Use a quiet environment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Maintain good microphone distance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Apply effects to enhance audio</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdvancedVoicePage;
