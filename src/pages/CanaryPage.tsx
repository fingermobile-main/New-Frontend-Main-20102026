import React, { useState } from 'react';
import { useAppContext } from "../contexts/AppContext";
import { logError } from '../utils/errorLogger';
import { useWeb3 } from '../contexts/Web3Context';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AdSubmissionForm from '../components/AdSubmissionForm';
import { CanaryIcon, BellIcon, ShieldIcon, UserCircleIcon, CheckCircleIcon, ClockIcon } from '../icons';
import MainLayout from '../components/layout/MainLayout';
import type { Post } from '../types';

// Mock canary data
const mockCanaryPosts: Post[] = [
  {
    id: "1",
    type: "canary" as any,
    author: {
      id: "101",
      name: "Security Team",
      membername: "security",
      avatarUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      isVerified: true
    },
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    title: "Security Alert",
    content:
      "Important security update regarding recent platform changes. Please review and update your settings.",
    category: "security",
    status: "active",
    likesCount: 245,
    repliesCount: 32,
    repostsCount: 18,
    isLiked: false
  },
  {
    id: "2",
    type: "canary" as any,
    author: {
      id: "102",
      name: "System Updates",
      membername: "system",
      avatarUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      isVerified: true
    },
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    title: "System Maintenance",
    content:
      "Scheduled maintenance window for platform upgrades. Expected downtime: 2 hours.",
    category: "maintenance",
    status: "scheduled",
    likesCount: 178,
    repliesCount: 42,
    repostsCount: 9,
    isLiked: true
  },
  {
    id: "3",
    type: "canary" as any,
    author: {
      id: "103",
      name: "Platform Announcements",
      membername: "announcements",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      isVerified: true
    },
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    title: "New Feature Launch",
    content:
      "We are excited to announce the launch of our new video calling feature. Available now for all premium members.",
    category: "features",
    status: "active",
    likesCount: 312,
    repliesCount: 28,
    repostsCount: 15,
    isLiked: false
  }
];

const CanaryPage: React.FC = () => {
  const { balance } = useWeb3();
  const { ficBalance, openModal, showToast } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [canaryPosts, setCanaryPosts] = useState(mockCanaryPosts);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  // Required functions
  const onLike = async (postId: string) => {
    try {
      showToast("Like action triggered");
      // Update the like status in the UI
      setCanaryPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likesCount: post.isLiked
                  ? (post.likesCount || 0) - 1
                  : (post.likesCount || 0) + 1
              }
            : post,
        ),
      );
    } catch (error) {
      logError(error, { context: "CanaryPage - Liking post" });
      showToast("Failed to like post");
    }
  };

  const onAddComment = (postId: string) => {
    showToast("Add comment action triggered");
    openModal("comment", { postId });
  };

  const onOpenGiftModal = (postId: string) => {
    showToast("Gift modal opened");
    openModal("gift", { postId });
  };

  const onOpenPaylinkModal = (postId: string) => {
    showToast("Paylink modal opened");
    openModal("createPaylink", { postId });
  };

  const onVote = (postId: string) => {
    showToast("Vote action triggered");
  };

  const handleDeletePost = (postId: string) => {
    showToast("Delete post action triggered");
  };

  const handleTokenizePost = (postId: string) => {
    showToast("Tokenize post action triggered");
  };

  const handleAiAssist = async (action: string, data: unknown) => {
    showToast("AI assist action triggered");
    return Promise.resolve({ success: true });
  };

  const handleAdSubmission = async (data: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.info("Ad submission data:", data);
      showToast("Ad submitted successfully! It will be reviewed shortly.");
      setShowSubmissionForm(false);
    } catch (error) {
      showToast("Failed to submit ad. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !showSubmissionForm) {
    return <LoadingSpinner />;
  }

  return (
    <MainLayout>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Ad Submission Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowSubmissionForm(!showSubmissionForm)}
                className="px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg hover:from-yellow-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                {showSubmissionForm ? "Cancel Submission" : "Submit New Ad"}
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
                {["active", "resolved", "all"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm sm:text-base
                      ${
                        activeTab === tab
                          ? "border-yellow-500 text-yellow-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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

          <div className="space-y-6">
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
                  { name: "Web Application", status: "operational" },
                  { name: "Database", status: "operational" },
                  { name: "Storage", status: "operational" },
                  { name: "Authentication", status: "operational" }
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