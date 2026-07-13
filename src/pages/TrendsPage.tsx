import React from 'react';
import { logError } from '../utils/errorLogger';
import PostCard from '../components/PostCard';
import { 
  FireIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  FilmIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  GiftIcon,
  ChevronDownIcon,
  ShareIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon
} from '../icons';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from "../contexts/AppContext";
import { useCommunityPosts } from '../hooks/useCommunityPosts';
import LoadingSpinner from '../components/LoadingSpinner';
import { useState, useEffect } from "react";

interface TrendingPost {
  id: string;
  title: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: string;
  likesCount: number;
  repliesCount: number;
  repostsCount: number;
  viewsCount: number;
  category: string;
  categoryColor: string;
  isPinned?: boolean;
  tags?: string[];
  mediaUrl?: string;
}

interface TrendingCategory {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TrendsPage: React.FC = () => {
  const { ficBalance, openModal, showToast, handleAiAssist } = useAppContext();
  const { posts, loading, error, refreshPosts } = useCommunityPosts();
  const [activeTab, setActiveTab] = useState("trending");
  const [timeRange, setTimeRange] = useState("today");
  const [sortBy, setSortBy] = useState("popular");
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<TrendingPost[]>([]);

  const categories: TrendingCategory[] = [
    { id: "trending", label: "Trending", icon: FireIcon },
    { id: "charts", label: "Charts", icon: ChartBarIcon },
    { id: "rising", label: "Rising", icon: ArrowTrendingUpIcon },
    { id: "videos", label: "Videos", icon: VideoCameraIcon },
    { id: "music", label: "Music", icon: MusicalNoteIcon },
    { id: "movies", label: "Movies", icon: FilmIcon },
    { id: "communities", label: "Communities", icon: UserGroupIcon }
  ];

  const categoryColors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-red-100 text-red-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-gray-100 text-gray-800"
  ];

  // Initialize trending posts
  useEffect(() => {
    if (!loading && posts.length > 0) {
      // Convert posts to trending posts format
      const convertedPosts: TrendingPost[] = posts.map(post => ({
        id: post.id,
        title: post.title || "Untitled Post",
        content: post.content || "No content available",
        author: typeof post.author === 'string' ? post.author : (post.author as any)?.name || "Anonymous", // Ensure author is a string
        avatar: typeof post.author !== 'string' ? (post.author as any)?.avatar || "https://via.placeholder.com/40" : "https://via.placeholder.com/40",
        timestamp: post.timestamp || "Just now",
        likesCount: post.likesCount || 0,
        repliesCount: post.repliesCount || 0,
        repostsCount: post.repostsCount || 0,
        viewsCount: Math.floor(Math.random() * 1000),
        category: post.category || "General",
        categoryColor: categoryColors[Math.floor(Math.random() * categoryColors.length)],
        isPinned: false,
        tags: post.tags || [],
        mediaUrl: post.imageUrl || post.videoUrl || undefined
      }));
      
      setTrendingPosts(convertedPosts);
      setFilteredPosts(convertedPosts);
    }
  }, [posts, loading]);

  // Apply filters when timeRange or sortBy changes
  useEffect(() => {
    let result = [...trendingPosts];
    
    // Apply time range filter
    switch(timeRange) {
      case "today":
        result = result.filter(post => post.timestamp.includes("hour") || post.timestamp.includes("minute"));
        break;
      case "week":
        result = result.filter(post => post.timestamp.includes("day") || post.timestamp.includes("hour"));
        break;
      case "month":
        result = result.filter(post => post.timestamp.includes("week") || post.timestamp.includes("day"));
        break;
      case "year":
        result = result.filter(post => post.timestamp.includes("month") || post.timestamp.includes("year"));
        break;
    }
    
    // Apply sorting
    switch(sortBy) {
      case "popular":
        result.sort((a, b) => b.likesCount - a.likesCount);
        break;
      case "newest":
        // Assuming timestamp can be parsed for comparison
        result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case "comments":
        result.sort((a, b) => b.repliesCount - a.repliesCount);
        break;
      case "reposts":
        result.sort((a, b) => b.repostsCount - a.repostsCount);
        break;
      case "views":
        result.sort((a, b) => b.viewsCount - a.viewsCount);
        break;
      default:
        break;
    }
    
    setFilteredPosts(result);
  }, [timeRange, sortBy, trendingPosts]);

  if (loading) {
    return (
      <MainLayout pageTitle="Trends">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout pageTitle="Trends">
        <div className="p-4 sm:p-6 lg:p-8 text-center text-red-500">
          Error loading trends: {error}{" "}
          <button
            onClick={refreshPosts}
            className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </MainLayout>
    );
  }

  // Handle like action
  const onLike = async (postId: string) => {
    try {
      // In a real app, this would call the backend API
      const updatedPosts = trendingPosts.map(post => 
        post.id === postId ? { ...post, likesCount: post.likesCount + 1 } : post
      );
      setTrendingPosts(updatedPosts);
      setFilteredPosts(updatedPosts.filter(post => {
        if (timeRange === "today") return post.timestamp.includes("hour") || post.timestamp.includes("minute");
        if (timeRange === "week") return post.timestamp.includes("day") || post.timestamp.includes("hour");
        if (timeRange === "month") return post.timestamp.includes("week") || post.timestamp.includes("day");
        if (timeRange === "year") return post.timestamp.includes("month") || post.timestamp.includes("year");
        return true;
      }).sort((a, b) => {
        if (sortBy === "popular") return b.likesCount - a.likesCount;
        if (sortBy === "newest") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        if (sortBy === "comments") return b.repliesCount - a.repliesCount;
        if (sortBy === "reposts") return b.repostsCount - a.repostsCount;
        if (sortBy === "views") return b.viewsCount - a.viewsCount;
        return 0;
      }));
      
      showToast("Post liked successfully!");
    } catch (error) {
      console.error("Error liking post:", error);
      showToast("Failed to like post. Please try again.");
    }
  };

  // Handle add comment action
  const onAddComment = (postId: string) => {
    try {
      // In a real app, this would call the backend API
      const updatedPosts = trendingPosts.map(post => 
        post.id === postId ? { ...post, repliesCount: post.repliesCount + 1 } : post
      );
      setTrendingPosts(updatedPosts);
      setFilteredPosts(updatedPosts.filter(post => {
        if (timeRange === "today") return post.timestamp.includes("hour") || post.timestamp.includes("minute");
        if (timeRange === "week") return post.timestamp.includes("day") || post.timestamp.includes("hour");
        if (timeRange === "month") return post.timestamp.includes("week") || post.timestamp.includes("day");
        if (timeRange === "year") return post.timestamp.includes("month") || post.timestamp.includes("year");
        return true;
      }).sort((a, b) => {
        if (sortBy === "popular") return b.likesCount - a.likesCount;
        if (sortBy === "newest") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        if (sortBy === "comments") return b.repliesCount - a.repliesCount;
        if (sortBy === "reposts") return b.repostsCount - a.repostsCount;
        if (sortBy === "views") return b.viewsCount - a.viewsCount;
        return 0;
      }));
      
      showToast("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment to post:", error);
      showToast("Failed to add comment. Please try again.");
    }
  };

  // Handle opening gift modal
  const onOpenGiftModal = (postId: string) => {
    openModal("gift", { postId });
    showToast("Gift modal opened!");
  };

  // Handle opening paylink modal
  const onOpenPaylinkModal = (postId: string) => {
    openModal("createPaylink", { postId });
    showToast("Paylink modal opened!");
  };

  // Handle vote action
  const onVote = (postId: string) => {
    try {
      // In a real app, this would call the backend API
      showToast("Vote recorded successfully!");
    } catch (error) {
      console.error("Error voting on post:", error);
      showToast("Failed to record vote. Please try again.");
    }
  };

  // Handle post deletion
  const handleDeletePost = (postId: string) => {
    try {
      // In a real app, this would call the backend API
      const updatedPosts = trendingPosts.filter(post => post.id !== postId);
      setTrendingPosts(updatedPosts);
      setFilteredPosts(updatedPosts.filter(post => {
        if (timeRange === "today") return post.timestamp.includes("hour") || post.timestamp.includes("minute");
        if (timeRange === "week") return post.timestamp.includes("day") || post.timestamp.includes("hour");
        if (timeRange === "month") return post.timestamp.includes("week") || post.timestamp.includes("day");
        if (timeRange === "year") return post.timestamp.includes("month") || post.timestamp.includes("year");
        return true;
      }).sort((a, b) => {
        if (sortBy === "popular") return b.likesCount - a.likesCount;
        if (sortBy === "newest") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        if (sortBy === "comments") return b.repliesCount - a.repliesCount;
        if (sortBy === "reposts") return b.repostsCount - a.repostsCount;
        if (sortBy === "views") return b.viewsCount - a.viewsCount;
        return 0;
      }));
      
      showToast("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      showToast("Failed to delete post. Please try again.", "error");
    }
  };

  // Handle post tokenization
  const handleTokenizePost = (postId: string) => {
    try {
      // In a real app, this would call the backend API
      showToast("Post tokenized successfully!");
    } catch (error) {
      console.error("Error tokenizing post:", error);
      showToast("Failed to tokenize post. Please try again.", "error");
    }
  };

  return (
    <MainLayout pageTitle="Trends">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg">
              <FireIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">Trending</h1>
              <p className="text-gray-600">Discover what's trending right now</p>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            {["today", "week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="comments">Most Comments</option>
              <option value="reposts">Most Reposts</option>
              <option value="views">Most Views</option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-6">
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {categories.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trending Posts */}
        <div className="space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <img 
                    className="h-12 w-12 rounded-full" 
                    src={post.avatar} 
                    alt={`${post.author} avatar`} 
                   />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{post.author}</h3>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-xl font-semibold text-gray-900">{post.title}</h4>
                  <p className="mt-2 text-gray-600 line-clamp-3">{post.content}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-gray-500">
                  <button className="flex items-center hover:text-red-500">
                    <HeartIcon className="h-5 w-5 mr-1" />
                    {post.likesCount}
                  </button>
                  <button className="flex items-center hover:text-blue-500">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-1" />
                    {post.repliesCount}
                  </button>
                  <button className="flex items-center hover:text-green-500">
                    <ShareIcon className="h-5 w-5 mr-1" />
                    {post.repostsCount}
                  </button>
                  <span className="flex items-center">
                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {post.viewsCount}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <FireIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No trending posts</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === "trending" 
                  ? "There are currently no trending posts to display." 
                  : `No ${activeTab} posts found.`}
              </p>
              <div className="mt-6">
                <button
                  onClick={refreshPosts}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Refresh
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FIC Balance Card */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Your FIC Balance</h3>
              <p className="text-2xl font-bold">{ficBalance.toFixed(2)} FIC</p>
            </div>
            <CurrencyDollarIcon className="h-12 w-12 opacity-80" />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => openModal("gift", {})}
              className="flex-1 bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <GiftIcon className="h-5 w-5 mr-2" />
              Send Gift
            </button>
            <button
              onClick={() => openModal("createPaylink", {})}
              className="flex-1 bg-white bg-opacity-20 text-white py-2 rounded-lg font-semibold hover:bg-opacity-30 transition-colors flex items-center justify-center"
            >
              <CurrencyDollarIcon className="h-5 w-5 mr-2" />
              Paylink
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TrendsPage;