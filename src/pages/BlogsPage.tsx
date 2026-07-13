import React from 'react';
import { useAppContext } from "../contexts/AppContext";
import PostCard from '../components/PostCard';
import type { AiAssistData, AiAssistResponse } from '../components/PostCard';
import { useHaptic } from '../contexts/HapticFeedbackContext';
import { useCommunity } from '../contexts/CommunityContext';
import MainLayout from '../components/layout/MainLayout';
import type { Post, Member } from '../types';
import { useBlogPosts, type BlogPost } from '../hooks/useBlogPosts';
import {
  SearchIcon,
  FilterIcon,
  ViewGridIcon,
  ViewListIcon,
  BookmarkIcon,
  ShareIcon,
  UserCircleIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  GiftIcon,
  LinkIcon
} from '../icons';

const BlogsPage: React.FC = () => {
  const { showToast, ficBalance } = useAppContext();
  const { triggerHaptic } = useHaptic();
  const { displayOption, setDisplayOption } = useCommunity();
  const { blogPosts, loading, error } = useBlogPosts();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState("recent");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [bookmarkedOnly, setBookmarkedOnly] = React.useState(false);

  // Ensure we're using the correct type for setDisplayOption
  const handleSetDisplayOption = (option: string) => {
    if (option === "card" || option === "row") {
      setDisplayOption(option);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-4 text-center">Loading blog posts...</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-4 text-center text-red-500">Error: {error}</div>
      </MainLayout>
    );
  }

  if (!blogPosts || blogPosts.length === 0) {
    return (
      <MainLayout>
        <div className="p-4 text-center">No blog posts found.</div>
      </MainLayout>
    );
  }

  // Filter and sort posts
  const filteredPosts = blogPosts
    .filter((post: BlogPost) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || post.category === categoryFilter;
      const isBookmarked = bookmarkedOnly ? post.isBookmarked : true;
      return matchesSearch && matchesCategory && isBookmarked;
    })
    .sort((a: BlogPost, b: BlogPost) => {
      if (sortBy === "recent")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "popular") return b.views - a.views;
      if (sortBy === "liked") return b.likes - a.likes;
      return 0;
    });

  const categories = [
    "all",
    ...Array.from(new Set(blogPosts.map((post: BlogPost) => post.category)))
  ];

  const handleHaptic = () => {
    triggerHaptic("selection");
  };

  const toggleDisplayOption = () => {
    setDisplayOption(displayOption === "card" ? "row" : "card");
    handleHaptic();
  };

  // Placeholder functions
  const onLike = () => {
    showToast("Like action triggered", "info");
  };

  const onAddComment = () => {
    showToast("Add comment action triggered", "info");
  };

  const onOpenGiftModal = () => {
    showToast("Gift modal opened", "info");
  };

  const onOpenPaylinkModal = () => {
    showToast("Paylink modal opened", "info");
  };

  const onVote = () => {
    showToast("Vote action triggered", "info");
  };

  const handleDeletePost = () => {
    showToast("Delete post action triggered", "info");
  };

  const handleTokenizePost = () => {
    showToast("Tokenize post action triggered", "info");
  };

  const handleAiAssist = async (
    action: string,
    data: unknown,
  ): Promise<unknown> => {
    showToast(`AI Assist action: ${action}`, "info");
    return { success: true, response: "AI assistance provided" };
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl">
              <SearchIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Community Blog
              </h1>
              <p className="text-gray-600">
                Discover stories, tutorials, and updates from our community
              </p>
            </div>
          </div>
        </div>
    
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">

        {/* Search and filters */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-md border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                className={`p-2 rounded-lg ${bookmarkedOnly ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700"}`}
                title="Show bookmarks only"
              >
                <BookmarkIcon className="w-5 h-5" />
              </button>
              <button
                onClick={toggleDisplayOption}
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                title="Toggle view"
              >
                {displayOption === "card" ? (
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
            <p className="text-2xl font-bold text-gray-900">{blogPosts.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <h3 className="text-gray-600 text-sm">Authors</h3>
            <p className="text-2xl font-bold text-gray-900">
              {
                Array.from(new Set(blogPosts.map((post: BlogPost) => post.author.id)))
                  .length
              }
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <h3 className="text-gray-600 text-sm">Views</h3>
            <p className="text-2xl font-bold text-gray-900">
              {blogPosts
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
              displayOption === "card"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
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
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-gray-100">
            <p className="text-gray-600 text-lg">
              No blog posts found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setBookmarkedOnly(false);
              }}
              className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
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

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Blog Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-indigo-50 transition-colors flex items-center">
              <HeartIcon className="h-5 w-5 text-purple-600 mr-3" />
              Like Post
            </button>
            <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-indigo-50 transition-colors flex items-center">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-600 mr-3" />
              Comment
            </button>
            <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-indigo-50 transition-colors flex items-center">
              <GiftIcon className="h-5 w-5 text-purple-600 mr-3" />
              Send Gift
            </button>
            <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-indigo-50 transition-colors flex items-center">
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
    </div>
  </div>
</MainLayout>
);
};

export default BlogsPage;
