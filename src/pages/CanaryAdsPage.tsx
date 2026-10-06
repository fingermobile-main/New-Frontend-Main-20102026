import { useNavigate, NavLink } from 'react-router-dom';
import React, { useState } from 'react';


import { useAppContext } from '../contexts/AppContext';

import type { AdSubmissionData } from '../types';
import {
  SparklesIcon,
  FilmIcon,
  PhotoIcon,
  DocumentTextIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  PlayCircleIcon
} from '../icons';
import MainLayout from '../components/layout/MainLayout';
import { useAds } from '../hooks/useAds';
import LoadingSpinner from '../components/LoadingSpinner';

// Define ad placement types based on the documentation
const adPlacements = [
  {
    id: 'feed-video',
    name: 'Feed Video Ads',
    description:
      'Videos that appear in the newsfeed alongside posts from friends and brands',
    specs:
      'Aspect ratio: 9:16 to 16:9, Max length: 2 minutes, File size: Up to 100MB',
    icon: FilmIcon
  },
  {
    id: '360-video',
    name: '360 Video Ads',
    description: 'Immersive 360-degree video experiences',
    specs: 'Resolution: 4096x2048, Aspect ratio: 2:1, Max length: 2 minutes',
    icon: ArrowsPointingOutIcon
  },
  {
    id: 'carousel-video',
    name: 'Carousel Video Ads',
    description: 'Multiple videos or images in a single ad',
    specs: '2-10 cards, Each video up to 2 minutes, Aspect ratio: 1:1',
    icon: PhotoIcon
  },
  {
    id: 'instant-articles',
    name: 'Instant Articles Ads',
    description: 'Ads within fast-loading mobile-optimized articles',
    specs: 'Aspect ratio: 9:16 to 16:9, Max length: 2 minutes',
    icon: DocumentTextIcon
  },
  {
    id: 'in-stream',
    name: 'In-stream Video Ads',
    description: 'Videos placed before or during other popular videos',
    specs:
      'Aspect ratio: 9:16 to 16:9, Length: 5s-10min (mobile), 5-16s (desktop)',
    icon: PlayCircleIcon
  },
  {
    id: 'marketplace',
    name: 'Marketplace Ads',
    description: 'Video ads in the FingerMobile Marketplace',
    specs: 'Aspect ratio: 9:16 to 16:9, Max length: 2 minutes',
    icon: PhotoIcon
  },
  {
    id: 'stories',
    name: 'Stories Video Ads',
    description: 'Full-screen vertical ads between Stories',
    specs: 'Aspect ratio: 1:91 to 9:16, Max duration: 2 minutes',
    icon: ArrowsPointingInIcon
  },
  {
    id: 'search-results',
    name: 'Search Results Video Ads',
    description: 'Ads in search results pages',
    specs: 'Aspect ratio: 1:1 (recommended), Max length: 241 minutes',
    icon: PlayCircleIcon
  }
];

const CanaryAdsPage: React.FC = () => {
  const { handleSubmitAdCampaign, showToast } = useAppContext();
  const navigate = useNavigate();
  const { ads, loading, error, refreshAds } = useAds();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('https://fingermobile.org');
  const [adType, setAdType] = useState<'image' | 'video'>('video');
  const [useAiFormat, setUseAiFormat] = useState(false);
  const [pages, setPages] = useState(1);
  const [placements, setPlacements] = useState<string[]>(['feed-video']);
  const [duration, setDuration] = useState(259200); // 3 days in seconds
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cost = pages * (duration / 86400) * 100 + placements.length * 50;

  if (loading) {
    return (
      <MainLayout pageTitle="Canary Ads">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout pageTitle="Canary Ads">
        <div className="p-4 sm:p-6 lg:p-8 text-center text-red-500">
          Error loading ads: {error}{' '}
          <button
            onClick={refreshAds}
            className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </MainLayout>
    );
  }

  const handlePlacementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setPlacements((prev) => [...prev, value]);
    } else {
      setPlacements((prev) => prev.filter((placement) => placement !== value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please provide a campaign title', 'error');
      return;
    }
    if (placements.length === 0) {
      showToast('Please select at least one ad placement', 'error');
      return;
    }

    setIsSubmitting(true);

    const adData: AdSubmissionData = {
      title,
      description,
      destinationUrl,
      adType,
      useAiFormat,
      pages,
      placements,
      exemptions: [],
      frequency: 1,
      duration,
      startDate,
      startTime: '00:00',
      stopTime: '23:59',
      cost
    };

    try {
      await handleSubmitAdCampaign(adData);
      showToast('Ad campaign submitted and activated successfully!', 'success');
      await refreshAds();
      navigate('/campaigns');
    } catch (err: any) {
      showToast(err?.message || 'Failed to submit ad campaign. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout pageTitle="Canary Ads">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center mb-2">
              <SparklesIcon className="h-8 w-8 text-yellow-400 mr-3" />
              <h1 className="text-3xl font-bold text-white">
                Canary Ads Platform
              </h1>
            </div>
            <p className="text-gray-400">
              Create and manage your advertising campaigns on the FingerMobile
              platform
            </p>
          </div>
          <NavLink
            to="/canary-ad-maker"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-semibold rounded-lg shadow-md transition-all text-sm"
          >
            <SparklesIcon className="h-4 w-4" />
            Launch Canary Ad Maker
          </NavLink>
        </div>

        {/* Current Ads */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Current Active Ads</h2>
            <button
              onClick={() => refreshAds()}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Refresh
            </button>
          </div>
          {ads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <div key={ad.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white">{ad.title}</h3>
                    <span className="px-2 py-0.5 text-xs rounded bg-green-900/60 text-green-300 border border-green-700/50">
                      {(ad as any).status || 'Active'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">{ad.description}</p>
                  <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400 grid grid-cols-2 gap-2">
                    <p><span className="text-gray-500">Placement:</span> {ad.placement}</p>
                    <p><span className="text-gray-500">Impressions:</span> {ad.impressions?.toLocaleString()}</p>
                    <p><span className="text-gray-500">Clicks:</span> {ad.clicks?.toLocaleString()}</p>
                    <p><span className="text-gray-500">Spend:</span> {ad.cost} FIC</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/60 rounded-lg p-6 text-center text-gray-400 border border-gray-700/50">
              No active ads running currently. Use the form below to launch your first Canary campaign!
            </div>
          )}
        </div>

        {/* Ad Creation Form */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">
            Create New Ad Campaign
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Campaign Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Protocol Showcase"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Destination URL
                </label>
                <input
                  type="url"
                  placeholder="https://yourbrand.com/landing"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Ad Copy / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter a compelling message for your target audience..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Ad Type Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Ad Type</h3>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="image"
                    checked={adType === 'image'}
                    onChange={(e) =>
                      setAdType(e.target.value as 'image' | 'video')
                    }
                    className="mr-2"
                  />
                  <span className="text-white">Image Ad</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="video"
                    checked={adType === 'video'}
                    onChange={(e) =>
                      setAdType(e.target.value as 'image' | 'video')
                    }
                    className="mr-2"
                  />
                  <span className="text-white">Video Ad</span>
                </label>
              </div>
            </div>

            {/* AI Formatting Option */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={useAiFormat}
                  onChange={(e) => setUseAiFormat(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-white">Use AI Formatting</span>
              </label>
            </div>

            {/* Pages */}
            <div className="mb-6">
              <label className="block text-white mb-2">
                Number of Pages: {pages}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={pages}
                onChange={(e) => setPages(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Placement Options */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Ad Placements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adPlacements.map((placement) => {
                  const Icon = placement.icon;
                  return (
                    <div
                      key={placement.id}
                      className="bg-gray-700 rounded-lg p-4"
                    >
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          value={placement.id}
                          checked={placements.includes(placement.id)}
                          onChange={handlePlacementChange}
                          className="mt-1 mr-3"
                        />
                        <div>
                          <div className="flex items-center mb-1">
                            <Icon className="h-5 w-5 text-blue-400 mr-2" />
                            <span className="font-medium text-white">
                              {placement.name}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">
                            {placement.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {placement.specs}
                          </p>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Duration */}
            <div className="mb-6">
              <label className="block text-white mb-2">
                Campaign Duration (seconds): {duration}
              </label>
              <input
                type="range"
                min="86400" // 1 day
                max="2592000" // 30 days
                step="86400" // 1 day increments
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Start Date */}
            <div className="mb-6">
              <label className="block text-white mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded"
              />
            </div>

            {/* Cost Display */}
            <div className="mb-6 p-4 bg-blue-900 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-white">Estimated Cost:</span>
                <span className="text-2xl font-bold text-yellow-400">
                  {cost.toFixed(2)} FIC
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || placements.length === 0}
              className={`w-full py-3 px-4 rounded-lg font-semibold ${
                isSubmitting || placements.length === 0
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Ad Campaign'}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CanaryAdsPage;
