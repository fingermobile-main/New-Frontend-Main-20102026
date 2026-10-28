import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Gift, Link2, Home } from 'lucide-react';

import { useAppContext } from '../contexts/AppContext';
import { logError } from '../utils/errorLogger';
import GiftModal from '../components/GiftModal';
import CreatePaylinkModal from '../components/CreatePaylinkModal';
import { GiftIcon, LinkIcon, InformationCircleIcon } from '../icons';
import MainLayout from '../components/layout/MainLayout';

import { sendGift, createPaylink } from '../services/api';

const AboutUsPage: React.FC = () => {
  const navigate = useNavigate();
  const { ficBalance, showToast } = useAppContext();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [giftAmount, setGiftAmount] = useState('');
  const [paylinkAmount, setPaylinkAmount] = useState('');
  const [paylinkDescription, setPaylinkDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const onOpenGiftModal = () => {
    if (ficBalance <= 0) {
      showToast(
        'Your FIC balance is 0. Please fund your wallet to send a gift.',
        'error',
      );
      return;
    }

    setShowGiftModal(true);
  };

  const onOpenPaylinkModal = () => {
    if (ficBalance <= 0) {
      showToast(
        'Your FIC balance is 0. Please fund your wallet to create a paylink.',
        'error',
      );
      return;
    }

    setShowPaylinkModal(true);
  };

  const handleSendGift = async () => {
    if (!giftAmount || parseFloat(giftAmount) <= 0) {
      showToast('Please enter a valid gift amount.', 'error');
      return;
    }

    if (parseFloat(giftAmount) > ficBalance) {
      showToast('Insufficient FIC balance to send this gift.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      if (sendGift) {
        await sendGift({ amount: parseFloat(giftAmount) });
      }
      showToast(`Successfully sent a gift of ${giftAmount} FIC!`, 'success');
      setGiftAmount('');
      setShowGiftModal(false);
    } catch (error) {
      logError(error as unknown, { context: 'AboutUsPage - Sending gift' });
      showToast('Failed to send gift. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreatePaylink = async () => {
    if (!paylinkAmount || parseFloat(paylinkAmount) <= 0) {
      showToast('Please enter a valid paylink amount.', 'error');
      return;
    }

    if (parseFloat(paylinkAmount) > ficBalance) {
      showToast('Insufficient FIC balance to create this paylink.', 'error');
      return;
    }

    if (!paylinkDescription.trim()) {
      showToast('Please add a description for the paylink.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      if (createPaylink) {
        await createPaylink({
          amount: parseFloat(paylinkAmount),
          description: paylinkDescription
        });
      }
      showToast(
        `Successfully created a paylink for ${paylinkAmount} FIC!`,
        'success',
      );
      setPaylinkAmount('');
      setPaylinkDescription('');
      setShowPaylinkModal(false);
    } catch (error) {
      logError(error as unknown, { context: 'AboutUsPage - Creating paylink' });
      showToast('Failed to create paylink. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout pageTitle="About Us">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-xs">
              <InformationCircleIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                About Us
              </h1>
              <p className="text-slate-700 font-medium text-sm sm:text-base mt-1">
                Learn more about our platform and mission
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-slate-300">
              <div className="prose max-w-none text-slate-800">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">Our Story</h2>
                <p className="text-slate-700 font-medium leading-relaxed mb-6">
                  The FingerMobile Protocol is a revolutionary platform that combines social networking, commerce, and entertainment.
                  We've built a comprehensive ecosystem that empowers individuals and businesses to connect, create, and transact
                  seamlessly across multiple domains.
                </p>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
                <p className="text-slate-700 font-medium leading-relaxed mb-6">
                  To create an inclusive digital ecosystem that enables seamless interactions between people, businesses,
                  and technology. We believe in fostering genuine connections while providing powerful tools for economic empowerment.
                </p>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">Core Values</h3>
                <ul className="list-disc pl-6 text-slate-700 font-medium mb-6 space-y-2">
                  <li><strong className="text-slate-900 font-bold">Inclusivity:</strong> Making our platform accessible to all, regardless of economic background</li>
                  <li><strong className="text-slate-900 font-bold">Innovation:</strong> Constantly evolving to meet the changing needs of our users</li>
                  <li><strong className="text-slate-900 font-bold">Security:</strong> Providing robust security measures to protect user data and assets</li>
                  <li><strong className="text-slate-900 font-bold">Community:</strong> Building meaningful relationships and connections</li>
                  <li><strong className="text-slate-900 font-bold">Empowerment:</strong> Giving users the tools they need to succeed</li>
                </ul>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">What Makes Us Different</h3>
                <p className="text-slate-700 font-medium leading-relaxed mb-6">
                  Unlike traditional platforms, FingerMobile Protocol integrates multiple services under one roof. From social networking
                  to e-commerce, gaming to education, financial services to content creation, our platform offers a holistic digital experience.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onOpenGiftModal}
                  className="min-h-[44px] flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer text-sm"
                >
                  <GiftIcon className="w-5 h-5" />
                  Send Gift
                </button>
                <button
                  type="button"
                  onClick={onOpenPaylinkModal}
                  className="min-h-[44px] flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm cursor-pointer text-sm"
                >
                  <LinkIcon className="w-5 h-5" />
                  Create Paylink
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-xs">
              <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4 flex items-center">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900 font-mono">{ficBalance.toFixed(2)} FIC</span>
                <Link
                  to="/wallet"
                  className="min-h-[44px] inline-flex items-center text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  Add Funds
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-300">
              <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4">Platform Actions</h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200 cursor-pointer min-h-[44px] font-bold text-slate-800 text-sm"
                >
                  <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span>Company Overview</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('FingerMobile executive and core contributor directory', 'info')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200 cursor-pointer min-h-[44px] font-bold text-slate-800 text-sm"
                >
                  <span className="ml-1">Leadership Team</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('FingerMobile brand assets and media kit prepared', 'success')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200 cursor-pointer min-h-[44px] font-bold text-slate-800 text-sm"
                >
                  <span className="ml-1">Press Kit</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-xs">
              <h3 className="font-black text-slate-900 mb-2">Company Facts</h3>
              <ul className="space-y-2 text-sm text-slate-800 font-medium">
                <li className="flex items-start">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  <span>Founded in 2023</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  <span>Global presence</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  <span>Multi-service platform</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <GiftModal
        isOpen={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        onSendGift={handleSendGift}
        giftAmount={giftAmount}
        setGiftAmount={setGiftAmount}
        ficBalance={ficBalance}
        isProcessing={isProcessing}
      />
      <CreatePaylinkModal
        isOpen={showPaylinkModal}
        onClose={() => setShowPaylinkModal(false)}
        onCreatePaylink={handleCreatePaylink}
        paylinkAmount={paylinkAmount}
        setPaylinkAmount={setPaylinkAmount}
        paylinkDescription={paylinkDescription}
        setPaylinkDescription={setPaylinkDescription}
        ficBalance={ficBalance}
        isProcessing={isProcessing}
      />

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-4 md:hidden shadow-lg safe-area-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-blue-600 font-bold"
            aria-label="Story Section"
          >
            <Sparkles className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Story</span>
          </button>
          <button
            onClick={onOpenGiftModal}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Send Gift"
          >
            <Gift className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Gift</span>
          </button>
          <button
            onClick={onOpenPaylinkModal}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Create Paylink"
          >
            <Link2 className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Paylink</span>
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

export default AboutUsPage;
