import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Send, Sparkles, Home } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { GiftIcon } from '../icons';
import AdvancedGiftingEngine from '../components/gifting/AdvancedGiftingEngine';
import MainLayout from '../components/layout/MainLayout';

const AdvancedGiftingPage: React.FC = () => {
  const navigate = useNavigate();
  const { ficBalance } = useAppContext();

  return (
    <MainLayout pageTitle="Advanced Gifting">
      <div className="max-w-[1536px] 2xl:max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3.5 rounded-2xl shadow-md">
              <GiftIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Advanced Gifting &amp; Creator Tips
              </h1>
              <p className="text-slate-700 font-medium text-sm sm:text-base mt-1">
                Send and receive special gifts with dynamic effects, animations, on-chain hallmarks, and sovereign FIC rewards
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <AdvancedGiftingEngine />
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 shadow-xs">
              <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4 flex items-center">
                <GiftIcon className="h-5 w-5 text-purple-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900 font-mono">{ficBalance.toFixed(2)} FIC</span>
                <button
                  onClick={() => navigate('/wallet')}
                  className="min-h-[44px] inline-flex items-center text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 font-bold shadow-sm cursor-pointer"
                >
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-300">
              <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4">Gifting Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-purple-50 rounded-xl transition-colors flex items-center font-bold text-slate-800 border border-slate-200 cursor-pointer min-h-[44px] text-sm"
                >
                  <GiftIcon className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0" />
                  <span>Send Virtual Gift</span>
                </button>
                <button
                  onClick={() => navigate('/members')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-purple-50 rounded-xl transition-colors flex items-center font-bold text-slate-800 border border-slate-200 cursor-pointer min-h-[44px] text-sm"
                >
                  <Send className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" />
                  <span>Direct FIC Transfer</span>
                </button>
                <button
                  onClick={() => navigate('/lush-pressies')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-purple-50 rounded-xl transition-colors flex items-center font-bold text-slate-800 border border-slate-200 cursor-pointer min-h-[44px] text-sm"
                >
                  <Sparkles className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" />
                  <span>Lush Escrow Pressies</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-xs">
              <h3 className="font-black text-slate-900 mb-2">Gifting Tips</h3>
              <ul className="space-y-2 text-sm text-slate-800 font-medium">
                <li className="flex items-start">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  <span>Customize your gifts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  <span>Send anonymous gifts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  <span>Track gift status</span>
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
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-purple-600 font-bold"
            aria-label="Send Gift"
          >
            <Gift className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Send</span>
          </button>
          <button
            onClick={() => navigate('/members')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Transfer FIC"
          >
            <Send className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Transfer</span>
          </button>
          <button
            onClick={() => navigate('/lush-pressies')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Lush Pressies"
          >
            <Sparkles className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Pressies</span>
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

export default AdvancedGiftingPage;
