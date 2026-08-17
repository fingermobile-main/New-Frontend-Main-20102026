import React, { useState } from 'react';


import { useAppContext } from "../contexts/AppContext";
import { logError } from '../utils/errorLogger';
import GiftModal from '../components/GiftModal';
import CreatePaylinkModal from '../components/CreatePaylinkModal';
import { GiftIcon, LinkIcon, InformationCircleIcon } from '../icons';
import MainLayout from '../components/layout/MainLayout';

const AboutUsPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [giftAmount, setGiftAmount] = useState("");
  const [paylinkAmount, setPaylinkAmount] = useState("");
  const [paylinkDescription, setPaylinkDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const onOpenGiftModal = () => {
    if (ficBalance <= 0) {
      showToast(
        "Your FIC balance is 0. Please fund your wallet to send a gift.",
        "error",
      );
      return;
    }

    setShowGiftModal(true);
  };

  const onOpenPaylinkModal = () => {
    if (ficBalance <= 0) {
      showToast(
        "Your FIC balance is 0. Please fund your wallet to create a paylink.",
        "error",
      );
      return;
    }

    setShowPaylinkModal(true);
  };

  const handleSendGift = async () => {
    if (!giftAmount || parseFloat(giftAmount) <= 0) {
      showToast("Please enter a valid gift amount.", "error");
      return;
    }

    if (parseFloat(giftAmount) > ficBalance) {
      showToast("Insufficient FIC balance to send this gift.", "error");
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate gift sending
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showToast(`Successfully sent a gift of ${giftAmount} FIC!`, "success");
      setGiftAmount("");
      setShowGiftModal(false);
      // In a real app, you'd update the ficBalance here after a successful transaction
    } catch (error) {
      logError(error as unknown, { context: "AboutUsPage - Sending gift" });
      showToast("Failed to send gift. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreatePaylink = async () => {
    if (!paylinkAmount || parseFloat(paylinkAmount) <= 0) {
      showToast("Please enter a valid paylink amount.", "error");
      return;
    }

    if (parseFloat(paylinkAmount) > ficBalance) {
      showToast("Insufficient FIC balance to create this paylink.", "error");
      return;
    }

    if (!paylinkDescription.trim()) {
      showToast("Please add a description for the paylink.", "error");
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate paylink creation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showToast(
        `Successfully created a paylink for ${paylinkAmount} FIC!`,
        "success",
      );
      setPaylinkAmount("");
      setPaylinkDescription("");
      setShowPaylinkModal(false);
    } catch (error) {
      logError(error as unknown, { context: "AboutUsPage - Creating paylink" });
      showToast("Failed to create paylink. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout pageTitle="About Us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <InformationCircleIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                About Us
              </h1>
              <p className="text-gray-600 mt-1">
                Learn more about our platform and mission
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
                <p className="text-gray-700 mb-6">
                  The FingerMobile Protocol is a revolutionary platform that combines social networking, commerce, and entertainment. 
                  We've built a comprehensive ecosystem that empowers individuals and businesses to connect, create, and transact 
                  seamlessly across multiple domains.
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                <p className="text-gray-700 mb-6">
                  To create an inclusive digital ecosystem that enables seamless interactions between people, businesses, 
                  and technology. We believe in fostering genuine connections while providing powerful tools for economic empowerment.
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">Core Values</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li><strong>Inclusivity:</strong> Making our platform accessible to all, regardless of economic background</li>
                  <li><strong>Innovation:</strong> Constantly evolving to meet the changing needs of our users</li>
                  <li><strong>Security:</strong> Providing robust security measures to protect user data and assets</li>
                  <li><strong>Community:</strong> Building meaningful relationships and connections</li>
                  <li><strong>Empowerment:</strong> Giving users the tools they need to succeed</li>
                </ul>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">What Makes Us Different</h3>
                <p className="text-gray-700 mb-6">
                  Unlike traditional platforms, FingerMobile Protocol integrates multiple services under one roof. From social networking 
                  to e-commerce, gaming to education, financial services to content creation, our platform offers a holistic digital experience.
                </p>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={onOpenGiftModal}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <GiftIcon className="w-5 h-5" />
                  Send Gift
                </button>
                <button
                  type="button"
                  onClick={onOpenPaylinkModal}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <LinkIcon className="w-5 h-5" />
                  Create Paylink
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button 
                  type="button"
                  className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Platform Actions</h2>
              <div className="space-y-3">
                <button 
                  type="button"
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Company Overview
                </button>
                <button 
                  type="button"
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Leadership Team
                </button>
                <button 
                  type="button"
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Press Kit
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Company Facts</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Founded in 2023</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Global presence</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
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
    </MainLayout>
  );
};

export default AboutUsPage;