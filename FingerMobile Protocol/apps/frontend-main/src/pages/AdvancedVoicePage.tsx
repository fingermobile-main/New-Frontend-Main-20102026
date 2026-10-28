import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mic, Sliders, Share2, Home } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import AdvancedVoiceEngine from '../components/voice/AdvancedVoiceEngine';
import { MicrophoneIcon } from '../icons';
import MainLayout from '../components/layout/MainLayout';

const AdvancedVoicePage: React.FC = () => {
  const navigate = useNavigate();
  const { ficBalance, showToast } = useAppContext();

  return (
    <MainLayout pageTitle="Advanced Voice">
      <div className="max-w-[1536px] 2xl:max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-3 rounded-xl shadow-xs">
              <MicrophoneIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Advanced Voice Engine
              </h1>
              <p className="text-slate-700 font-medium text-sm sm:text-base mt-1">
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
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-200 shadow-xs">
              <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4 flex items-center">
                <MicrophoneIcon className="h-5 w-5 text-blue-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900 font-mono">{ficBalance.toFixed(2)} FIC</span>
                <Link
                  to="/wallet"
                  className="min-h-[44px] inline-flex items-center text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm"
                >
                  Add Funds
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-300">
              <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4">Voice Actions</h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => showToast('Recording initiated in audio engine', 'info')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center border border-slate-200 cursor-pointer min-h-[44px] font-bold text-slate-800 text-sm"
                >
                  <MicrophoneIcon className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span>Start Recording</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Voice effects panel active', 'info')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center border border-slate-200 cursor-pointer min-h-[44px] font-bold text-slate-800 text-sm"
                >
                  <Sliders className="h-5 w-5 text-teal-600 mr-3 flex-shrink-0" />
                  <span>Apply Effects</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Audio recording export link ready', 'success')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center border border-slate-200 cursor-pointer min-h-[44px] font-bold text-slate-800 text-sm"
                >
                  <Share2 className="h-5 w-5 text-slate-700 mr-3 flex-shrink-0" />
                  <span>Share Recording</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-xs">
              <h3 className="font-black text-slate-900 mb-2">Voice Tips</h3>
              <ul className="space-y-2 text-sm text-slate-800 font-medium">
                <li className="flex items-start">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  <span>Use a quiet environment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  <span>Maintain good microphone distance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  <span>Apply effects to enhance audio</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-4 md:hidden shadow-lg safe-area-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => showToast('Recording initiated in audio engine', 'info')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-blue-600 font-bold"
            aria-label="Start Voice Recording"
          >
            <Mic className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Record</span>
          </button>
          <button
            onClick={() => showToast('Voice effects panel active', 'info')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Voice Effects"
          >
            <Sliders className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Effects</span>
          </button>
          <button
            onClick={() => showToast('Audio recording export link ready', 'success')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Share Audio"
          >
            <Share2 className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Share</span>
          </button>
          <button
            onClick={() => navigate('/forum')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Back to Forum"
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Forum</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdvancedVoicePage;
