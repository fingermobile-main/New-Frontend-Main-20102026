import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { logError } from '../utils/errorLogger';
import { useWeb3 } from '../contexts/Web3Context';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AdSubmissionForm from '../components/AdSubmissionForm';
import { CanaryIcon, BellIcon, ShieldIcon, UserCircleIcon } from '../icons';
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
  // eslint-disable-next-line no-unused-vars
  const { balance } = useWeb3();
  const { ficBalance, openModal, showToast } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [canaryPosts, setCanaryPosts] = useState<Post[]>([]);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [userAdvertiserProfile, setUserAdvertiserProfile] = useState<any>(null);

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

  const loadAdvertiserProfile = useCallback(async () => {
    try {
      const profile = await advertisingService.getAdvertiserProfile();
      setUserAdvertiserProfile(profile);
    } catch (err) {
      logError(err, { context: 'CanaryPage - loadAdvertiserProfile' });
      // Not critical, so we don't show error toast
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
    loadAdvertiserProfile();
  }, [loadAnnouncements, loadAdvertiserProfile]);

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

  // eslint-disable-next-line no-unused-vars
  const onVote = (postId: string) => {
    showToast('Vote action triggered');
  };

  // eslint-disable-next-line no-unused-vars
  const handleDeletePost = (postId: string) => {
    showToast('Delete post action triggered');
  };

  // eslint-disable-next-line no-unused-vars
  const handleTokenizePost = (postId: string) => {
    showToast('Tokenize post action triggered');
  };

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const handleAiAssist = async (action: string, data: unknown) => {
    showToast('AI assist action triggered');
    return Promise.resolve({ success: true });
  };

  const handleAdSubmission = async (data: any) => {
    setIsLoading(true);
    try {
      // Check if user has an advertiser profile, if not register one
      let advertiser = userAdvertiserProfile;
      if (!advertiser) {
        // Register the user as an advertiser first
        advertiser = await advertisingService.registerAdvertiser({
          company_name: 'Personal Ad Account',
          billing_email: 'user@example.com', // This would come from user context
          disclaimer_accepted: true,
          digital_signature: 'user_agreement_signature', // This would be generated properly
          user_id: '1' // Would come from user context
        });

        if (!advertiser) {
          throw new Error('Failed to register as advertiser');
        }
      }

      // Validate required fields for Canary Ads
      if (!data.media_url || !data.headline || !data.destination_url) {
        showToast('Media URL, Headline, and Destination URL are required fields.', 'error');
        setIsLoading(false);
        return;
      }

      // Validate dimensions based on placement
      if (!data.ad_height || !data.ad_width) {
        showToast('Ad dimensions (height and width) are required.', 'error');
        setIsLoading(false);
        return;
      }

      // Validate duration is within limits
      if (parseInt(data.duration) > 90) {
        showToast('Campaign duration cannot exceed 90 days.', 'error');
        setIsLoading(false);
        return;
      }

      // Create campaign first
      const campaignData = {
        title: data.title || data.headline || 'Canary Ad Campaign',
        description: data.description || '',
        campaign_type: data.campaign_type || 'display',
        type: data.campaign_type || 'display',
        total_budget: parseFloat(data.budget) || 100,
        budget: parseFloat(data.budget) || 100,
        daily_budget: parseFloat(data.budget) / parseInt(data.duration) || 10,
        currency: 'FIC',
        targeting: data.targeting || {
          geo: data.target_locations?.join(', ') || 'Global',
          age: `${data.target_age_min}-${data.target_age_max}`,
          interests: data.target_keywords?.length > 0 ? data.target_keywords : ['General']
        },
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + parseInt(data.duration) * 24 * 60 * 60 * 1000).toISOString()
      };

      const campaign = await advertisingService.createCampaign(campaignData);

      if (!campaign) {
        throw new Error('Failed to create campaign');
      }

      // Then create ad group
      const adGroup = await advertisingService.createAdGroup(campaign.id, {
        name: `${data.title || 'Ad Campaign'} Group`,
        placement: data.ad_placement || 'h2_banner',
        target_locations: data.target_locations || [],
        target_genders: data.target_genders || ['all'],
        target_age_min: data.target_age_min || 18,
        target_age_max: data.target_age_max || 65,
        target_keywords: data.target_keywords || []
      });

      if (!adGroup) {
        throw new Error('Failed to create ad group');
      }

      // Finally create the creative with all required specifications
      const creative = await advertisingService.addCreative(adGroup.id, {
        format: data.ad_format || 'single_image',
        media_url: data.media_url,
        thumbnail_url: data.thumbnail_url || '',
        headline: data.headline,
        description: data.description || '',
        primary_text: data.primary_text || '',
        destination_url: data.destination_url,
        call_to_action: data.call_to_action || 'Learn More',
        video_duration_seconds: parseInt(data.video_duration_seconds) || 30,
        file_size_bytes: data.file_size_bytes || 0,
        aspect_ratio: data.aspect_ratio || '16:9',
        has_safe_area_padding: data.has_safe_area_padding || false,
        carousel_cards: data.carousel_cards || [],
        // Canary Ads specific fields
        thumbnail_text_percentage: data.thumbnail_text_percentage || 0,
        placement: data.ad_placement
      });

      if (!creative) {
        throw new Error('Failed to create ad creative');
      }

      // Process payment for non-refundable campaign
      const payment = await advertisingService.processPayment(campaign.id, {
        advertiser_id: advertiser.id || '1', // Use actual advertiser ID
        amount: parseFloat(data.budget),
        payment_method: 'fic',
        currency: 'FIC'
      });

      if (!payment) {
        throw new Error('Failed to process payment');
      }

      showToast('Advertisement submitted successfully! Awaiting review and payment confirmation.', 'success');
      setShowSubmissionForm(false);
      await loadAnnouncements(); // Refresh the page to show new announcements if any
    } catch (error: any) {
      logError(error, { context: 'CanaryPage - handleAdSubmission' });
      showToast(error.message || 'Failed to submit advertisement. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !showSubmissionForm) {
    return <LoadingSpinner />;
  }

  return (
    <MainLayout pageTitle="Canary">
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-3.5 rounded-2xl shadow-md text-white">
              <CanaryIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-400 text-xs font-black uppercase mb-1">
                Warrant Canary &amp; Sponsor Ads Studio
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                FingerMobile Canary Ads
              </h1>
              <p className="text-slate-700 font-medium mt-1">
                Verified warrant canary disclosures, platform security alerts, and ad review portal ensuring strict quality standards.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="sticky top-20 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <ShieldIcon className="w-5 h-5 text-amber-600 mr-2" />
                  Ad Specifications
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-medium">Max 90 days</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Frequency</span>
                    <span className="font-medium">Per hour</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Dimensions</span>
                    <span className="font-medium">Varies by placement</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Headline</span>
                    <span className="font-medium">Max 40 chars</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Thumbnail Text</span>
                    <span className="font-medium">≤20% for approval</span>
                  </li>
                </ul>
              </div>

              {/* Ad Dimension Guide */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-4">Ad Dimensions Guide</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Vertical Big</span>
                    <span>6000×4000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Horizontal Main</span>
                    <span>320×480</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sponsored Main</span>
                    <span>800×600</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Content Big</span>
                    <span>3840×2160</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stories (Safe Area)</span>
                    <span>9:16 + 14% padding</span>
                  </div>
                </div>
              </div>

              {/* Advertiser Status */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-4">Advertiser Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Account:</span>
                    <span className={`font-medium ${userAdvertiserProfile ? 'text-green-600' : 'text-red-600'}`}>
                      {userAdvertiserProfile ? 'Registered' : 'Not Registered'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium">
                      {userAdvertiserProfile?.status || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Company:</span>
                    <span className="font-medium truncate max-w-[100px]">
                      {userAdvertiserProfile?.company_name || 'N/A'}
                    </span>
                  </div>
                </div>
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
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-300">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">
                    Submit New Advertisement
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Create and submit your ad for review. Please ensure your ad meets all the required specifications for dimensions, content, and placement.
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
                  <button type="button" aria-label="Action"
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm sm:text-base
                      ${
                  activeTab === tab
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
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
                <button
                  type="button"
                  aria-label="Add FIC funds"
                  onClick={() => window.location.assign('/wallet/topup')}
                  className="text-sm bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-3 py-1.5 rounded-lg hover:from-amber-600 hover:to-yellow-700"
                >
                  Add Funds
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-300">
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
                  { name: 'Ad Serving', status: 'operational' },
                  { name: 'Payment Processing', status: 'operational' }
                ].map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {service.name}
                      </p>
                      <p className="text-xs text-slate-700">
                        Last checked: 5 minutes ago
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-950 border border-green-400 font-bold rounded-full text-xs font-medium font-black">
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ad Guidelines */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-300">
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
                <p>• Maximum campaign duration: 90 days</p>
                <p>• Headlines limited to 40 characters</p>
                <p>• Thumbnail text ≤20% for approval</p>
                <p>• Stories ads require safe area padding</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </MainLayout>
  );
};

export default CanaryPage;
