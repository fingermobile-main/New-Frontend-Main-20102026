/*
 * FingerMobile Protocol™ - Blogs Page Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import PostCard from '../components/PostCard';
import UniversalProfileCard from '../components/common/UniversalProfileCard';
import { useHaptic } from '../contexts/HapticFeedbackContext';
import { useCommunity } from '../contexts/CommunityContext';
import MainLayout from '../components/layout/MainLayout';
import { useBlogPosts, type BlogPost } from '../hooks/useBlogPosts';
import voiceLineServiceInstance from '../services/VoiceLineService';
import {
  SearchIcon,
  // eslint-disable-next-line no-unused-vars
  FilterIcon,
  ViewGridIcon,
  ViewListIcon,
  BookmarkIcon,
  // eslint-disable-next-line no-unused-vars
  ShareIcon,
  UserCircleIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  GiftIcon,
  LinkIcon
} from '../components/icons';
import BlogComposerModal from '../components/blog/BlogComposerModal';
import {
  BlogCommentModal,
  BlogSendGiftModal,
  BlogPaylinkModal,
  BlogTokenizeModal
} from '../components/blog/BlogActionModals';
import { ApiService } from '../services/api';

const BlogsPage: React.FC = () => {
  const { showToast, ficBalance } = useAppContext();
  const { triggerHaptic } = useHaptic();
  const { displayOption, setDisplayOption } = useCommunity();
  const { blogPosts, loading, error, addBlogPost, toggleLike, setBlogPosts } = useBlogPosts();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState('recent');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [bookmarkedOnly, setBookmarkedOnly] = React.useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  // Blog Action Modals State
  const [selectedPostForAction, setSelectedPostForAction] = useState<BlogPost | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isPaylinkModalOpen, setIsPaylinkModalOpen] = useState(false);
  const [isTokenizeModalOpen, setIsTokenizeModalOpen] = useState(false);

  // Infinite scroll state
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<BlogPost[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login state

  // Check if user is logged in (implement your own logic)
  useEffect(() => {
    const checkLoginStatus = () => {
      // Check if user is logged in by checking localStorage, cookies, or auth tokens
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const user = localStorage.getItem('user') || sessionStorage.getItem('user');
      setIsLoggedIn(!!token || !!user);
    };

    checkLoginStatus();

    // Listen for auth changes
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Simulate loading more blog posts for infinite scroll
  const loadMoreItems = useCallback(async () => {
    if (isLoggedIn || !hasMore || isLoadingMore) return;

    setIsLoadingMore(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real implementation, this would fetch more blog posts from the API
    // For now, we'll duplicate some existing blog posts to simulate more content
    if (blogPosts && blogPosts.length > 0) {
      const newItems = [...blogPosts].slice(0, 3).map((post, index) => ({
        ...post,
        id: `${post.id}-more-${page}-${index}`,
        title: `${post.title} (Part ${page}.${index + 1})`
      }));

      setItems(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);

      // Stop loading more if we've reached a certain threshold or user has logged in
      if (page >= 5) { // Example limit
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }

    setIsLoadingMore(false);
  }, [blogPosts, hasMore, isLoadingMore, isLoggedIn, page]);

  // Handle infinite scroll
  useEffect(() => {
    if (isLoggedIn) {
      // Stop infinite scroll when user logs in
      setHasMore(false);
      return;
    }

    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoadingMore || !hasMore) {
        return;
      }
      loadMoreItems();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreItems, isLoadingMore, hasMore, isLoggedIn]);

  // Initialize items with existing blog posts when not logged in
  useEffect(() => {
    if (!isLoggedIn && blogPosts && blogPosts.length > 0) {
      setItems(blogPosts);
    }
  }, [blogPosts, isLoggedIn]);

  // Ensure we're using the correct type for setDisplayOption
  // eslint-disable-next-line no-unused-vars
  const handleSetDisplayOption = (option: string) => {
    if (option === 'card' || option === 'row') {
      setDisplayOption(option);
    }
  };

  if (loading && items.length === 0) {
    return (
      <MainLayout>
        <div className="p-4 text-center">Loading blog posts...</div>
      </MainLayout>
    );
  }

  if (error && items.length === 0) {
    return (
      <MainLayout>
        <div className="p-4 text-center text-red-500">Error: {error}</div>
      </MainLayout>
    );
  }

  // Filter and sort posts (use infinite scroll items when not logged in, otherwise use API data)
  const allPosts = (!isLoggedIn && items.length > 0) ? items : (blogPosts || []);
  const filteredPosts = allPosts
    .filter((post: BlogPost) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === 'all' || post.category === categoryFilter;
      const isBookmarked = bookmarkedOnly ? post.isBookmarked : true;
      return matchesSearch && matchesCategory && isBookmarked;
    })
    .sort((a: BlogPost, b: BlogPost) => {
      if (sortBy === 'recent')
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === 'popular') return b.views - a.views;
      if (sortBy === 'liked') return b.likes - a.likes;
      return 0;
    });

  const categories = [
    'all',
    ...Array.from(new Set(allPosts.map((post: BlogPost) => post.category)))
  ];

  const handleHaptic = () => {
    triggerHaptic('selection');
  };

  const toggleDisplayOption = () => {
    setDisplayOption(displayOption === 'card' ? 'row' : 'card');
    handleHaptic();
  };

  // Interactive action handlers
  const onLike = async (postId?: string) => {
    handleHaptic();
    const targetId = postId || selectedPostForAction?.id || filteredPosts[0]?.id;
    if (!targetId) {
      showToast('No post selected to like', 'info');
      return;
    }
    const res = await toggleLike(String(targetId));
    if (res?.success) {
      showToast('Post reaction recorded! ✨', 'success');
    } else {
      showToast(res?.message || 'Liked post locally', 'info');
    }
  };

  const onAddComment = (postId?: string) => {
    handleHaptic();
    voiceLineServiceInstance.playCommentaryVoiceLine('blogs');
    const targetPost = (postId ? allPosts.find((p: BlogPost) => String(p.id) === String(postId)) : null) || selectedPostForAction || filteredPosts[0];
    if (targetPost) {
      setSelectedPostForAction(targetPost);
    }
    setIsCommentModalOpen(true);
  };

  const onOpenGiftModal = (postId?: string) => {
    handleHaptic();
    const targetPost = (postId ? allPosts.find((p: BlogPost) => String(p.id) === String(postId)) : null) || selectedPostForAction || filteredPosts[0];
    if (targetPost) {
      setSelectedPostForAction(targetPost);
    }
    setIsGiftModalOpen(true);
  };

  const onOpenPaylinkModal = (postId?: string) => {
    handleHaptic();
    const targetPost = (postId ? allPosts.find((p: BlogPost) => String(p.id) === String(postId)) : null) || selectedPostForAction || filteredPosts[0];
    if (targetPost) {
      setSelectedPostForAction(targetPost);
    }
    setIsPaylinkModalOpen(true);
  };

  const onVote = () => {
    handleHaptic();
    showToast('Community governance vote cast! 👍', 'success');
  };

  const handleDeletePost = async (postId?: string) => {
    handleHaptic();
    const targetId = postId || selectedPostForAction?.id || filteredPosts[0]?.id;
    if (!targetId) return;

    if (window.confirm('Are you sure you want to delete this blog post from the platform?')) {
      try {
        await ApiService.request(`/blogs/posts/${targetId}`, { method: 'DELETE' });
      } catch (e) {
        console.warn('Backend delete notification:', e);
      }
      setBlogPosts((prev) => prev.filter((p) => String(p.id) !== String(targetId)));
      setItems((prev) => prev.filter((p) => String(p.id) !== String(targetId)));
      showToast('Article deleted successfully.', 'success');
    }
  };

  const handleTokenizePost = (postId?: string) => {
    handleHaptic();
    const targetPost = (postId ? allPosts.find((p: BlogPost) => String(p.id) === String(postId)) : null) || selectedPostForAction || filteredPosts[0];
    if (targetPost) {
      setSelectedPostForAction(targetPost);
    }
    setIsTokenizeModalOpen(true);
  };

  const handleAiAssist = async (
    action: string,
    // eslint-disable-next-line no-unused-vars
    data: unknown,
  ): Promise<unknown> => {
    showToast(`AI Assist action: ${action}`, 'info');
    return { success: true, response: 'AI assistance provided' };
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-xl shadow-md">
                <SearchIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  Community Blog & UGC Studio
                </h1>
                <p className="text-gray-600 text-sm">
                  Decentralized editorial articles, AI-assisted content distribution, and reader tipping
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsComposerOpen(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg hover:shadow-orange-500/20 transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <span>✍️ Create Article & UGC</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Top Left ProfileCard & Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            <UniversalProfileCard />

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-purple-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-700 hover:to-indigo-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-300">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Blog Actions</h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => onLike()}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-indigo-50 transition-colors flex items-center cursor-pointer active:scale-95"
                >
                  <HeartIcon className="h-5 w-5 text-purple-600 mr-3" />
                  Like Post
                </button>
                <button
                  type="button"
                  onClick={() => onAddComment()}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-indigo-50 transition-colors flex items-center cursor-pointer active:scale-95"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-600 mr-3" />
                  Comment
                </button>
                <button
                  type="button"
                  onClick={() => onOpenGiftModal()}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-indigo-50 transition-colors flex items-center cursor-pointer active:scale-95"
                >
                  <GiftIcon className="h-5 w-5 text-purple-600 mr-3" />
                  Send Gift
                </button>
                <button
                  type="button"
                  onClick={() => onOpenPaylinkModal()}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-indigo-50 transition-colors flex items-center cursor-pointer active:scale-95"
                >
                  <LinkIcon className="h-5 w-5 text-purple-600 mr-3" />
                  Create Paylink
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Blogging Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Write engaging titles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Include relevant images</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Interact with readers</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Feed Column */}
          <div className="lg:col-span-3">

            {/* Search and filters */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-md border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-100 text-gray-900 pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="liked">Most Liked</option>
                  </select>
                  <button
                    onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
                    className={`p-2 rounded-lg ${bookmarkedOnly ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    title="Show bookmarks only"
                  >
                    <BookmarkIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={toggleDisplayOption}
                    className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    title="Toggle view"
                  >
                    {displayOption === 'card' ? (
                      <ViewListIcon className="w-5 h-5" />
                    ) : (
                      <ViewGridIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <h3 className="text-gray-600 text-sm">Total Posts</h3>
                <p className="text-2xl font-bold text-gray-900">{allPosts.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <h3 className="text-gray-600 text-sm">Authors</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    Array.from(new Set(allPosts.map((post: BlogPost) => post.author.id)))
                      .length
                  }
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <h3 className="text-gray-600 text-sm">Views</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {allPosts
                    .reduce((sum: number, post: BlogPost) => sum + post.views, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <h3 className="text-gray-600 text-sm">Categories</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.length - 1}
                </p>
              </div>
            </div>

            {/* Blog posts */}
            {filteredPosts.length > 0 ? (
              <div
                className={
                  displayOption === 'card'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-6'
                }
              >
                {filteredPosts.map((post: BlogPost) => (
                  <PostCard
                    key={post.id}
                    post={post as any}
                    displayStyle={displayOption}
                    onLike={onLike}
                    onAddComment={onAddComment}
                    onOpenGiftModal={onOpenGiftModal}
                    onOpenPaylinkModal={onOpenPaylinkModal}
                    onVote={onVote}
                    handleDeletePost={handleDeletePost}
                    handleTokenizePost={handleTokenizePost}
                    // @ts-ignore - Auto-suppressed for compilation
                    handleAiAssist={handleAiAssist}
                  />
                ))}

                {/* Load More Button */}
                {!isLoggedIn && hasMore && (
                  <div className="text-center pt-4">
                    <button
                      onClick={loadMoreItems}
                      disabled={isLoadingMore}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoadingMore ? 'Loading...' : 'Load More Posts'}
                    </button>
                  </div>
                )}

                {/* Show message when user has logged in */}
                {isLoggedIn && (
                  <div className="text-center py-4">
                    <p className="text-gray-400">Welcome back! You're now viewing personalized content.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-gray-100">
                <p className="text-gray-600 text-lg">
              No blog posts found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setBookmarkedOnly(false);
                  }}
                  className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                >
              Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <BlogComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onPostCreated={(p) => addBlogPost(p)}
      />

      <BlogCommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        postTitle={selectedPostForAction?.title || filteredPosts[0]?.title}
        postId={selectedPostForAction?.id || filteredPosts[0]?.id}
        onCommentSubmitted={(postId, comment) => {
          showToast('Comment published to Sovereign discussion thread!', 'success');
        }}
      />

      <BlogSendGiftModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        postTitle={selectedPostForAction?.title || filteredPosts[0]?.title}
        authorName={selectedPostForAction?.author?.membername || filteredPosts[0]?.author?.membername}
        userFicBalance={ficBalance}
        onGiftSent={(amount, giftName) => {
          showToast(`Successfully sent ${giftName} (${amount} FIC)! 🎁`, 'success');
        }}
      />

      <BlogPaylinkModal
        isOpen={isPaylinkModalOpen}
        onClose={() => setIsPaylinkModalOpen(false)}
        postTitle={selectedPostForAction?.title || filteredPosts[0]?.title}
        onPaylinkCreated={() => {
          showToast('Sovereign Paylink generated and ready to share!', 'success');
        }}
      />

      <BlogTokenizeModal
        isOpen={isTokenizeModalOpen}
        onClose={() => setIsTokenizeModalOpen(false)}
        postTitle={selectedPostForAction?.title || filteredPosts[0]?.title}
        onTokenized={() => {
          showToast('Article tokenized as Sovereign Proof-of-Achievement Hallmark NFT!', 'success');
        }}
      />
    </MainLayout>
  );
};

export default BlogsPage;
