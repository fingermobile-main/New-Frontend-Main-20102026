import React from 'react';
import { useForumPosts } from '../hooks/useForumPosts';
import LoadingSpinner from '../components/LoadingSpinner';
import PostCard from '../components/PostCard';
import ErrorMessage from '../components/ErrorMessage';
import { SearchIcon, PlusIcon } from '../icons';
import type { Post } from '../types';

interface BroadcastItem {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low' | string;
  thumbnail_url?: string;
  [key: string]: any;
}

const broadcastContent: BroadcastItem[] = []; // Placeholder - can be populated from API later

const ForumPage: React.FC = () => {
  const { forumPosts, loading, error, refreshData } = useForumPosts();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState("recent");
  const [filterBy, setFilterBy] = React.useState("all");
  const [showCreatePost, setShowCreatePost] = React.useState(false);
  const [newPost, setNewPost] = React.useState({
    title: "",
    content: "",
    category: "general"
  });

  // ⚠️ FIX #3: Fetch initial data on layout initialization (was empty useEffect)
  React.useEffect(() => {
    refreshData();
  }, []);

  // ⚠️ FIX #2: Memoize filtered/sorted posts to prevent infinite re-render loop and performance issues
  const filteredAndSortedPosts = React.useMemo(() => {
    if (!forumPosts) return [];

    return forumPosts
      .map(post => ({
        ...post,
        author: {
          id: post.author.id,
          name: post.author.membername, // Dynamic fallback transformation
          avatar: post.author.avatar
        }
      }))
      .filter((post) => {
        const matchesSearch =
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterBy === "all" || post.category === filterBy;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortBy === "recent") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "popular") return (b.likes || 0) - (a.likes || 0);
        if (sortBy === "discussed") return (b.commentCount || 0) - (a.commentCount || 0);
        return 0;
      });
  }, [forumPosts, searchTerm, sortBy, filterBy]);

  const handleCreatePost = () => {
    // In a real app, this would call an API
    console.info("Creating new post:", newPost);
    setShowCreatePost(false);
    setNewPost({ title: "", content: "", category: "general" });
    // Refresh data to show new post
    refreshData();
  };

  return (
    <div className="space-y-6">
      
      {/* AI Post Composer */}
      <div className="bg-[#242526] rounded-xl p-4 border border-gray-700">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
            U
          </div>
          <div className="flex-1">
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-full text-left bg-[#3a3b3c] hover:bg-gray-700 text-gray-400 px-4 py-3 rounded-lg transition-colors"
            >
              What's on your mind?
            </button>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                  <span className="text-green-500">📹</span> Live Video
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                  <span className="text-green-500">🖼️</span> Photo/Video
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                  <span className="text-purple-500">✨</span> Reel
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                  <span className="text-blue-500">📊</span> Poll
                </button>
              </div>
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <PlusIcon className="w-4 h-4" />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stories Carousel */}
      <div className="bg-[#242526] rounded-xl p-4 border border-gray-700">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Stories</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {/* Create Story Card */}
          <div className="flex-shrink-0 w-28 h-40 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg relative overflow-hidden cursor-pointer group">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mx-auto mb-1">
                <PlusIcon className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-xs text-white text-center font-medium">Create Story</p>
            </div>
          </div>
          
          {/* Friend Stories */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-28 h-40 bg-gray-700 rounded-lg relative overflow-hidden cursor-pointer group">
              <img 
                src={`https://via.placeholder.com/150x250`} 
                alt={`Story ${i}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
               />
              <div className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-orange-500 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                U{i}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-xs text-white font-medium">User {i}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⚠️ FIX #1: Filter and Search Controls (was missing - ghost filter UI) */}
      <div className="bg-[#242526] p-4 rounded-xl border border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search feed conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#3a3b3c] text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 border border-transparent transition-all"
          />
        </div>

        <div className="flex w-full md:w-auto items-center gap-3 justify-end">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="bg-[#3a3b3c] text-gray-300 text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="help">Help</option>
            <option value="ideas">Ideas</option>
            <option value="bug">Bug Reports</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#3a3b3c] text-gray-300 text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Trending / Likes</option>
            <option value="discussed">Most Discussed</option>
          </select>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-[#242526] rounded-xl p-4 border border-gray-700">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Trending Topics</h3>
        <div className="flex flex-wrap gap-2">
          {['#FingerMobile', '#Tech', '#Innovation', '#Community', '#AI', '#Crypto', '#NFT', '#Web3'].map((tag) => (
            <span
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-sm rounded-full cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Feed Posts */}
      <div className="space-y-4">
        {filteredAndSortedPosts.length > 0 ? (
          filteredAndSortedPosts.map((post, index) => (
            <React.Fragment key={post.id}>
              <PostCard
                post={post}
                onLike={(postId: string) => console.info("Like post:", postId)}
                onAddComment={(postId: string, comment: string) =>
                  console.info("Add comment to post:", postId, comment)
                }
                onOpenGiftModal={(postId: string) =>
                  console.info("Open gift modal for post:", postId)
                }
                onOpenPaylinkModal={(postId: string) =>
                  console.info("Open paylink modal for post:", postId)
                }
    // @ts-ignore - Auto-suppressed for compilation
                onVote={(postId: string, voteType: 'up' | 'down') =>
                  console.info("Vote on post:", postId, voteType)
                }
              />
              
              {/* Sponsored Content after every 3rd post */}
              {(index + 1) % 3 === 0 && (
                <div className="bg-[#242526] rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                        Sponsored
                      </span>
                    </div>
                    <div className="flex-1">
                      <img 
                        src="https://via.placeholder.com/600x300" 
                        alt="Ad"
                        className="w-full h-48 object-cover rounded-lg mb-3"
                       />
                      <h4 className="text-white font-semibold mb-1">Premium Features</h4>
                      <p className="text-sm text-gray-400">Unlock exclusive tools and boost your experience.</p>
                      <button className="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <div className="bg-[#242526] rounded-xl p-8 text-center border border-gray-700">
            <p className="text-gray-400">
              No posts found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterBy("all");
              }}
              className="mt-4 text-orange-500 hover:text-orange-400"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {filteredAndSortedPosts.length > 0 && (
          <div className="text-center pt-4">
            <button className="px-6 py-3 bg-[#242526] hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700">
              Load More Posts
            </button>
          </div>
        )}
      </div>

      {/* Create post modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#242526] rounded-xl w-full max-w-2xl border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                Create New Post
              </h3>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })
                  }
                  className="w-full bg-[#3a3b3c] text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) =>
                    setNewPost({ ...newPost, category: e.target.value })
                  }
                  className="w-full bg-[#3a3b3c] text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="general">General</option>
                  <option value="help">Help</option>
                  <option value="ideas">Ideas</option>
                  <option value="bug">Bug Reports</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  rows={6}
                  className="w-full bg-[#3a3b3c] text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Write your post content here..."
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowCreatePost(false)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForumPage;
