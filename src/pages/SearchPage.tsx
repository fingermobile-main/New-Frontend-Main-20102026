import React, { useState } from 'react';
import { useAppContext } from "../contexts/AppContext";
import MainLayout from '../components/layout/MainLayout';
import { MagnifyingGlassIcon, UserGroupIcon, HashtagIcon, VideoCameraIcon, GiftIcon } from '../icons';

interface SearchResultMember {
  id: number;
  type: 'member';
  name: string;
  membername: string;
  avatarUrl?: string;
}

interface SearchResultPost {
  id: number;
  type: 'post';
  title: string;
  author: string;
  excerpt: string;
  timestamp: string;
  likes: number;
  comments: number;
  category: string;
}

interface SearchResultCommunity {
  id: number;
  type: 'community';
  name: string;
  description?: string;
  memberCount: number;
  category: string;
}

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<(SearchResultMember | SearchResultPost | SearchResultCommunity)[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'members' | 'posts' | 'communities' | 'hashtags'>('all');
  const { members, showToast } = useAppContext();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Mock search results - in a real app, this would come from an API
    const mockMembers: SearchResultMember[] = members
      .filter((m: any) => 
        m.name.toLowerCase().includes(query.toLowerCase()) || 
        m.membername.toLowerCase().includes(query.toLowerCase())
      )
      .map((m: any) => ({
        id: m.id,
        type: 'member' as const,
        name: m.name,
        membername: m.membername,
        avatarUrl: m.avatarUrl
      }));

    const mockPosts: SearchResultPost[] = [
      {
        id: 1,
        type: 'post',
        title: 'How to create amazing content',
        author: 'Alex Johnson',
        excerpt: 'In this guide, I will show you the secrets to creating viral content...',
        timestamp: '2 hours ago',
        likes: 42,
        comments: 8,
        category: 'Tips & Tricks'
      },
      {
        id: 2,
        type: 'post',
        title: 'The future of social media',
        author: 'Taylor Swift',
        excerpt: 'Exploring the trends that will shape social platforms in the coming years...',
        timestamp: '1 day ago',
        likes: 128,
        comments: 24,
        category: 'Technology'
      }
    ];

    const mockCommunities: SearchResultCommunity[] = [
      {
        id: 1,
        type: 'community',
        name: 'Content Creators Hub',
        description: 'A community for content creators to share tips and collaborate',
        memberCount: 2450,
        category: 'Creativity'
      },
      {
        id: 2,
        type: 'community',
        name: 'Tech Enthusiasts',
        description: 'Discuss the latest technology trends and innovations',
        memberCount: 1870,
        category: 'Technology'
      }
    ];

    // Combine results based on active tab
    const combinedResults: (SearchResultMember | SearchResultPost | SearchResultCommunity)[] = [];
    
    if (activeTab === 'all' || activeTab === 'members') {
      combinedResults.push(...mockMembers);
    }
    if (activeTab === 'all' || activeTab === 'posts') {
      combinedResults.push(...mockPosts);
    }
    if (activeTab === 'all' || activeTab === 'communities') {
      combinedResults.push(...mockCommunities);
    }

    setResults(combinedResults);
  };

  const filteredResults = results.filter(result => {
    if (activeTab === 'all') return true;
    const tabToTypeMap: Record<string, string> = {
      'members': 'member',
      'posts': 'post',
      'communities': 'community'
    };
    return result.type === tabToTypeMap[activeTab];
  });

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
              placeholder="Search for members, communities, or content..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          <div className="mt-6 flex space-x-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All', icon: MagnifyingGlassIcon },
              { id: 'members', label: 'Members', icon: UserGroupIcon },
              { id: 'posts', label: 'Posts', icon: HashtagIcon },
              { id: 'communities', label: 'Communities', icon: UserGroupIcon },
              { id: 'hashtags', label: 'Hashtags', icon: HashtagIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {searchQuery && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {filteredResults.length} {activeTab === 'all' ? 'results' : activeTab} for "{searchQuery}"
              </h2>
              <div className="text-sm text-gray-500">
                Sorted by relevance
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredResults.map((result) => {
                if (result.type === 'member') {
                  return (
                    <div key={`member-${result.id}`} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                        {result.avatarUrl ? (
                          <img src={result.avatarUrl} alt={result.name} className="w-full h-full object-cover"  />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                            {result.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 dark:text-white">{result.name}</div>
                        <div className="text-sm text-gray-500">@{result.membername}</div>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors">
                        View Profile
                      </button>
                    </div>
                  );
                } else if (result.type === 'post') {
                  return (
                    <div key={`post-${result.id}`} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{result.author}</div>
                        <span className="mx-2 text-gray-400">•</span>
                        <div className="text-sm text-gray-500">{result.timestamp}</div>
                        <span className="mx-2 text-gray-400">•</span>
                        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{result.category}</div>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{result.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">{result.excerpt}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="flex items-center mr-4">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {result.likes}
                        </span>
                        <span className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {result.comments}
                        </span>
                      </div>
                    </div>
                  );
                } else if (result.type === 'community') {
                  return (
                    <div key={`community-${result.id}`} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold mr-3">
                          {result.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{result.name}</h3>
                          <div className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full inline-block mt-1">{result.category}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{result.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">{result.memberCount} members</div>
                        <button className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg text-xs font-medium hover:from-green-700 hover:to-teal-700 transition-colors">
                          Join Community
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
            
            {filteredResults.length === 0 && (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No results found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  We couldn't find anything matching "{searchQuery}". Try different keywords.
                </p>
              </div>
            )}
          </div>
        )}

        {!searchQuery && (
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <MagnifyingGlassIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Search Everything</h2>
            <p className="text-gray-500 max-w-sm mx-auto">
              Find people you know, discover new communities, and explore trending content.
            </p>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: 'Trending Topics', icon: HashtagIcon, count: 12 },
                { label: 'Popular Communities', icon: UserGroupIcon, count: 24 },
                { label: 'Top Creators', icon: UserGroupIcon, count: 42 },
                { label: 'Featured Content', icon: VideoCameraIcon, count: 86 }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="mx-auto w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">{item.count}+</div>
                      <div className="text-sm text-gray-500">{item.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchPage;