import React, { useState } from 'react';
import { useAppContext } from "../contexts/AppContext";
import type { Member, Post, Group } from '../types';
import { useCommunityMembers } from '../hooks/useCommunityMembers';
import { useCommunityPosts } from '../hooks/useCommunityPosts';
import { useCommunityGroups } from '../hooks/useCommunityGroups';

interface CommunityFilters {
  query: string;
  sortBy: "newest" | "popular" | "active";
  contentType: "all" | "posts" | "groups" | "members";
  tags: string[];
}

const CommunityPageEnhanced: React.FC = () => {
  const { showToast } = useAppContext();
  const {
    members,
    loading: membersLoading,
    error: membersError
  } = useCommunityMembers();
  const {
    posts,
    loading: postsLoading,
    error: postsError
  } = useCommunityPosts();
  const {
    groups,
    loading: groupsLoading,
    error: groupsError
  } = useCommunityGroups();

  const [filters, setFilters] = useState<CommunityFilters>({
    query: "",
    sortBy: "popular",
    contentType: "all",
    tags: []
  });

  const allLoading = membersLoading || postsLoading || groupsLoading;
  const anyError = membersError || postsError || groupsError;

  // Helper function to get author display name
  const getAuthorName = (author: any): string => {
    if ('name' in author && author.name) return author.name;
    if ('username' in author && author.username) return author.username;
    if ('firstName' in author || 'lastName' in author) {
      const firstName = author.firstName || '';
      const lastName = author.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim();
      return fullName || 'Unknown User';
    }
    return 'Unknown User';
  };

  if (allLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading community data...
      </div>
    );
  }

  if (anyError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">
        Error: {anyError}
      </div>
    );
  }

  const allTags = [
    ...new Set([
      ...posts.flatMap((p) => p.tags || []),
      ...groups.map((g) => g.name.toLowerCase())
    ])
  ];

  const toggleTagFilter = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSortChange = (sortBy: "newest" | "popular" | "active") => {
    setFilters((prev) => ({
      ...prev,
      sortBy
    }));
  };

  const handleContentTypeChange = (
    contentType: "all" | "posts" | "groups" | "members",
  ) => {
    setFilters((prev) => ({
      ...prev,
      contentType
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Community
          </h1>
          <p className="text-gray-600 sm:text-lg lg:text-xl">
            Connect with creators and explore content
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search community..."
                value={filters.query}
                onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-base lg:text-lg"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  handleSortChange(
                    e.target.value as "newest" | "popular" | "active",
                  )
                }
                className="p-3 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-base lg:text-lg"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="active">Most Active</option>
              </select>
              <select
                value={filters.contentType}
                onChange={(e) =>
                  handleContentTypeChange(
                    e.target.value as "all" | "posts" | "groups" | "members",
                  )
                }
                className="p-3 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-base lg:text-lg"
              >
                <option value="all">All Content</option>
                <option value="posts">Posts</option>
                <option value="groups">Groups</option>
                <option value="members">Members</option>
              </select>
            </div>
          </div>

          {/* Tag Filters */}
          <div>
            <h3 className="font-semibold mb-3 sm:text-lg lg:text-xl">
              Filter by Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  className={`px-3 py-1 rounded-full text-sm sm:text-base lg:text-lg ${
                    filters.tags.includes(tag)
                      ? "bg-brand-blue text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Display */}
        <div>
          {filters.contentType === "all" || filters.contentType === "posts" ? (
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
                Posts
              </h2>
              <div className="space-y-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-xl shadow-sm p-6"
                  >
                    <div className="flex items-start">
                      <img
                        src={post.author.avatar || '/default-avatar.png'}
                        alt={getAuthorName(post.author)}
                        className="w-12 h-12 rounded-full mr-4"
                       />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-bold sm:text-lg lg:text-xl">
                            {getAuthorName(post.author)}
                          </h3>
                          <span className="text-gray-500 text-sm sm:text-base lg:text-lg ml-2">
                            {post.timestamp || post.createdAt ? new Date(post.timestamp || post.createdAt).toLocaleDateString() : 'Unknown date'}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-700 sm:text-base lg:text-lg">
                          {post.content}
                        </p>
                        {post.tags && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs sm:text-sm lg:text-base rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center mt-4 text-gray-500 sm:text-base lg:text-lg">
                          <button className="flex items-center mr-4" aria-label="Button"><svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                              />
                            </svg>
                            {post.likesCount}
                          </button>
                          <button className="flex items-center mr-4" aria-label="Button"><svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9 8s9 3.582 9 8z"
                              />
                            </svg>
                            {post.repliesCount}
                          </button>
                          <button className="flex items-center" aria-label="Button"><svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                              />
                            </svg>
                            {post.sharesCount}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {filters.contentType === "all" || filters.contentType === "groups" ? (
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
                Groups
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <img
                      src={(group as any).coverImageUrl || "https://via.placeholder.com/400x128"}
                      alt={group.name}
                      className="w-full h-32 object-cover"
                     />
                    <div className="p-4">
                      <div className="flex items-center">
                        <img
                          src={(group as any).avatarUrl || "https://via.placeholder.com/48"}
                          alt={group.name}
                          className="w-12 h-12 rounded-full -mt-8 border-2 border-white"
                         />
                        <div className="ml-3">
                          <h3 className="font-bold sm:text-lg lg:text-xl">
                            {group.name}
                          </h3>
                          <p className="text-sm text-gray-500 sm:text-base lg:text-lg">
                            {group.memberCount} members
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-600 text-sm sm:text-base lg:text-lg">
                        {group.description}
                      </p>
                      <button className="w-full mt-4 py-2 bg-brand-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors sm:text-base lg:text-lg">
                        Join Group
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {filters.contentType === "all" ||
          filters.contentType === "members" ? (
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
                Members
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-xl shadow-sm p-6 flex items-center"
                  >
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-16 h-16 rounded-full"
                     />
                    <div className="ml-4">
                      <h3 className="font-bold sm:text-lg lg:text-xl">
                        {member.name}
                      </h3>
                      <p className="text-gray-600 sm:text-base lg:text-lg">
                        @{member.name}
                      </p>
                      <div className="mt-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs sm:text-sm lg:text-base ${
                            member.role === "Creator Pro"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.role}
                        </span>
                      </div>
                      <button className="mt-3 px-4 py-1 bg-brand-blue text-white rounded-lg text-sm sm:text-base lg:text-lg font-semibold hover:bg-blue-700 transition-colors">
                        Follow
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CommunityPageEnhanced;