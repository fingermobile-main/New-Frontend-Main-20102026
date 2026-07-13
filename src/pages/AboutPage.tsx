import React from 'react';
/*
 * FingerMobile Protocol™ - About Page Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import { useState } from 'react';
import GiftModal from '../components/GiftModal';
import CreatePaylinkModal from '../components/CreatePaylinkModal';
import { useAppContext } from "../contexts/AppContext";
import { 
  LightBulbIcon, 
  InformationCircleIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  GiftIcon,
  LinkIcon
} from '../icons';
import MainLayout from '../layouts/MainLayout';
import apiService from '../services/api.service';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Statistic {
  value: string;
  label: string;
  icon: JSX.Element;
}

const AboutPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [giftAmount, setGiftAmount] = useState("");
  const [paylinkAmount, setPaylinkAmount] = useState("");
  const [paylinkDescription, setPaylinkDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const features: Feature[] = [
    {
      title: "Nostalgic Art Appeal",
      description: "Our platform celebrates cultural heritage and traditional art forms with a modern twist.",
      icon: <LightBulbIcon className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Entertainment Hub",
      description: "Access news, dramas, documentaries, and educational content tailored to your interests.",
      icon: <InformationCircleIcon className="w-8 h-8 text-green-500" />
    },
    {
      title: "Creator Empowerment",
      description: "Tools and resources designed specifically for influencers, vloggers, and content creators.",
      icon: <UserGroupIcon className="w-8 h-8 text-purple-500" />
    },
    {
      title: "Economic Opportunities",
      description: "Generate income through various monetization options and platform partnerships.",
      icon: <ChartBarIcon className="w-8 h-8 text-yellow-500" />
    }
  ];

  const statistics: Statistic[] = [
    { value: "10M+", label: "Active Users", icon: <UserGroupIcon className="w-5 h-5 text-white" /> },
    { value: "500+", label: "Countries", icon: <InformationCircleIcon className="w-5 h-5 text-white" /> },
    { value: "24/7", label: "Support", icon: <GiftIcon className="w-5 h-5 text-white" /> },
    { value: "99.9%", label: "Uptime", icon: <ChartBarIcon className="w-5 h-5 text-white" /> }
  ];

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
      // Assuming there's a sendGift function in the apiService
      await apiService.sendGift({ amount: parseFloat(giftAmount) });
      showToast(`Successfully sent a gift of ${giftAmount} FIC!`, "success");
      setGiftAmount("");
      setShowGiftModal(false);
      // In a real app, you'd update the ficBalance here after a successful transaction
    } catch (error: any) {
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
      // Assuming there's a createPaylink function in the apiService
      await apiService.createPaylink({
        amount: parseFloat(paylinkAmount),
        description: paylinkDescription
      });
      showToast(
        `Successfully created a paylink for ${paylinkAmount} FIC!`,
        "success",
      );
      setPaylinkAmount("");
      setPaylinkDescription("");
      setShowPaylinkModal(false);
    } catch (error: any) {
      showToast("Failed to create paylink. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">About FingerMobile</h2>
              <p className="mb-4">
                FingerMobile Protocol™©® is a Decentralized Trendy Urban Social Media Platform that engages and enables 
                the efficient use of cultural and indigenous assets to generate direct income for artisans, 
                individuals, and SMEs by linking cultural heritage to newly acquired skill sets.
              </p>
              <p>
                Our platform provides individuals and businesses with enough ownership-right to choose how 
                their personal skills, assets, and contents are shared, used, distributed, and monetized.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <p className="mt-2 text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 mb-4">
                FingerMobile™©® is purely intended and solely specialized in helping individuals and 
                Small to Medium-Sized Enterprises (SME's) make and earn additional livelihoods and 
                spark new careers.
              </p>
              <p className="text-gray-700">
                We blend social technology, cultural heritage, and inclusive economic empowerment 
                to create a truly world-class, multi-role, multi-functional social platform with 
                enterprise-grade governance, monetization, and creativity at its core.
              </p>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Our Team</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Visionary & Founder</h3>
              <div className="flex items-center space-x-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div>
                  <p className="font-medium">Mbah Israel Obinna</p>
                  <p className="text-gray-600">Senior Data Analyst, Intellectual Property Owner, Social Media Ideologist</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700">
                As the visionary behind FingerMobile, Mbah Israel Obinna specializes in customer behavior analysis 
                and retention, and is the pioneer of the platform's unique approach to cultural heritage integration 
                with modern technology.
              </p>
            </div>
          </div>
        );
      case 'values':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-gray-900">Empowerment</h3>
                <p className="mt-2 text-gray-600">
                  We believe in empowering individuals and SMEs to create new economic opportunities 
                  through cultural heritage and technology.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-gray-900">Innovation</h3>
                <p className="mt-2 text-gray-600">
                  We continuously innovate to blend traditional values with cutting-edge technology 
                  solutions.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold text-gray-900">Inclusion</h3>
                <p className="mt-2 text-gray-600">
                  We are committed to creating an inclusive platform that serves diverse communities 
                  worldwide.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <h3 className="text-lg font-semibold text-gray-900">Integrity</h3>
                <p className="mt-2 text-gray-600">
                  We operate with the highest standards of integrity, respecting intellectual property 
                  rights and user privacy.
                </p>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-gray-600">info@fingerprotocol.com</p>
                  <p className="text-gray-600">fingerprotocolmobile@gmail.com</p>
                </div>
                <div>
                  <p className="font-medium">Phone:</p>
                  <p className="text-gray-600">+2348182227289, +2348088855752</p>
                </div>
                <div>
                  <p className="font-medium">Address:</p>
                  <p className="text-gray-600">7307 Brandford Park Lane, Richmond, TX 77407</p>
                </div>
                <div>
                  <p className="font-medium">Website:</p>
                  <p className="text-gray-600">https://fingerprotocol</p>
                  <p className="text-gray-600">https://www.fingermobileprotocol.com</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About FingerMobile</h1>
        
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'team', 'values', 'contact'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow text-center">
              <div className="flex justify-center mb-2">
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
        
        {/* Dynamic Content */}
        {renderContent()}
        
        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onOpenGiftModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <GiftIcon className="w-5 h-5" />
            Send Gift
          </button>
          <button
            onClick={onOpenPaylinkModal}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <LinkIcon className="w-5 h-5" />
            Create Paylink
          </button>
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

export default AboutPage;