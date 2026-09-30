import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { logError } from '../utils/errorLogger';
import { useWeb3 } from '../contexts/Web3Context';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AdSubmissionForm from '../components/AdSubmissionForm';
import { CanaryIcon, BellIcon, ShieldIcon, UserCircleIcon, CheckCircleIcon, ClockIcon } from '../icons';
import type { Post } from '../types';
import { advertisingService, CanaryAnnouncement } from '../services/advertisingService';

const mapToPost = (item: CanaryAnnouncement | any): Post => ({
  id: String(item.id),
  type: 'canary' as any,
  author: {
    id: String(item.author?.id || '101'),
    name: item.author?.name || 'FingerMobile Security',
    membername: item.author?.membername || 'security',
    avatarUrl: item.author?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    isVerified: item.author?.isVerified ?? true
  },
  timestamp: item.timestamp || item.createdAt || new Date().toISOString(),
  createdAt: item.createdAt || new Date().toISOString(),
  title: item.title,
  content: item.content,
  category: item.category || 'security',
  status: item.status || 'active',
  likesCount: Number(item.likesCount || 0),
  repliesCount: Number(item.repliesCount || 0),
  repostsCount: Number(item.repostsCount || 0),
  isLiked: Boolean(item.isLiked)
});

const CanaryPage: React.FC = () => {
  const { balance } = useWeb3();
  const { ficBalance, openModal, showToast } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [canaryPosts, setCanaryPosts] = useState<Post[]>([]);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const loadAnnouncements = useCallback(async () => {
    try {
      setIsLoading(true);
      const items = await advertisingService.getAnnouncements(
        undefined,
        activeTab === 'all' ? undefined : activeTab
      );
      setCanaryPosts(items.map(mapToPost));
    } catch (err) {
      logError(err, { context: 'CanaryPage - loadAnnouncements' });
      showToast('Could not load announcements', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, showToast]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  // Required functions
  const onLike = async (postId: string) => {
    try {
      const result = await advertisingService.likeAnnouncement(postId);
      setCanaryPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: result.liked,
                likesCount: result.likesCount
              }
            : post
        )
      );
      showToast(result.liked ? 'Announcement liked!' : 'Like removed', 'success');
    } catch (error) {
      logError(error, { context: 'CanaryPage - Liking post' });
      showToast('Failed to update like status', 'error');
    }
  };

  const onAddComment = (postId: string) => {
    showToast('Add comment action triggered');
    openModal('comment', { postId });
  };

  const onOpenGiftModal = (postId: string) => {
    showToast('Gift modal opened');
    openModal('gift', { postId });
  };

  const onOpenPaylinkModal = (postId: string) => {
    showToast('Paylink modal opened');
    openModal('createPaylink', { postId });
  };

  const onVote = (postId: string) => {
    showToast('Vote action triggered');
  };

  const handleDeletePost = (postId: string) => {
    showToast('Delete post action triggered');
  };

  const handleTokenizePost = (postId: string) => {
    showToast('Tokenize post action triggered');
  };

  const handleAiAssist = async (action: string, data: unknown) => {
    showToast('AI assist action triggered');
    return Promise.resolve({ success: true });
  };

  const handleAdSubmission = async (data: any) => {
    setIsLoading(true);
    try {
      await advertisingService.createAnnouncement({
        title: data.title || data.headline || 'Platform Announcement',
        content: data.content || data.description || '',
        category: data.category || 'security',
        status: 'active'
      });
      showToast('Announcement published successfully!', 'success');
      setShowSubmissionForm(false);
      await loadAnnouncements();
    } catch (error) {
      showToast('Failed to submit announcement. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !showSubmissionForm) {
    return <LoadingSpinner />;
  }

  return (
    <MainLayout pageTitle="Canary">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-3 rounded-xl">
              <CanaryIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                FingerMobile Canary
              </h1>
              <p className="text-gray-600">
                Stay informed about system updates, security advisories, and platform status. Our canary system provides real-time transparency about the state of FingerMobile services.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="sticky top-20 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <ShieldIcon className="w-5 h-5 text-amber-600 mr-2" />
                  Canary Navigation
                </h3>
                <ul className="space-y-3">
                  <li><button className="w-full text-left font-medium text-amber-600 hover:underline">System Status</button></li>
                  <li><button className="w-full text-left text-gray-600 hover:text-amber-600">Active Experiments</button></li>
                  <li><button className="w-full text-left text-gray-600 hover:text-amber-600">Feature Roadmap</button></li>
                </ul>
              </div>

              {/* Beta Program from HTML */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Beta Program</h3>
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-5 text-center text-white mb-4">
                  <h4 className="font-bold text-lg">Join the Beta</h4>
                  <p className="text-sm mt-2 opacity-90">Get early access to new features and shape the platform.</p>
                  <button className="mt-4 w-full px-4 py-2 bg-white text-amber-600 font-bold rounded-md hover:bg-gray-50">
                    Sign Up Now
                  </button>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Benefits</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start"><CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Early access</li>
                  <li className="flex items-start"><CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Influence development</li>
                  <li className="flex items-start"><CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Exclusive access</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6 space-y-6">
            {/* Ad Submission Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowSubmissionForm(!showSubmissionForm)}
                className="px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg hover:from-yellow-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                {showSubmissionForm ? 'Cancel Submission' : 'Submit New Ad'}
              </button>
            </div>

            {/* Ad Submission Form */}
            {showSubmissionForm && (
              <div className="mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">
                    Submit New Advertisement
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Create and submit your ad for review. Our team will review your submission and approve it for display on the platform.
                  </p>
                  <AdSubmissionForm
                    {...({ onSubmit: handleAdSubmission, isLoading } as any)}
                  />
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="flex space-x-8" aria-label="Tabs">
                {['active', 'resolved', 'all'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm sm:text-base
                      ${
                  activeTab === tab
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                    `}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Posts Column */}
            <div className="space-y-6">
              {canaryPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => onLike(post.id)}
                  onAddComment={() => onAddComment(post.id)}
                  onOpenGiftModal={() => onOpenGiftModal(post.id)}
                  onOpenPaylinkModal={() => onOpenPaylinkModal(post.id)}
                  onVote={() => onVote(post.id)}
                  handleDeletePost={() => handleDeletePost(post.id)}
                  handleTokenizePost={() => handleTokenizePost(post.id)}
                  // @ts-ignore - Auto-suppressed for compilation
                  handleAiAssist={handleAiAssist}
                />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-amber-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-3 py-1.5 rounded-lg hover:from-amber-600 hover:to-yellow-700">
                  Add Funds
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <ShieldIcon className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  System Status
                </h2>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Web Application', status: 'operational' },
                  { name: 'Database', status: 'operational' },
                  { name: 'Storage', status: 'operational' },
                  { name: 'Authentication', status: 'operational' }
                ].map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {service.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Last checked: 5 minutes ago
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ad Guidelines */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <BellIcon className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Ad Guidelines
                </h2>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Ads must comply with our community guidelines</p>
                <p>• No misleading or false information</p>
                <p>• Respect member privacy and consent</p>
                <p>• Follow all applicable laws and regulations</p>
                <p>• Review process typically takes 1-2 business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </MainLayout>
  );
};

export default CanaryPage;
