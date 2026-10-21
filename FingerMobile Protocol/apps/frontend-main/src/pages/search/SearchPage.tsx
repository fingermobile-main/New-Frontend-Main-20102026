import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';

interface TopicType {
  id: string;
  name: string;
  title?: string;
  description?: string;
  isTrending: boolean;
  coverImageUrl?: string;
  postsCount?: number;
  [key: string]: any;
}

interface HashtagType {
  id: string;
  name: string;
  tag?: string;
  isTrending: boolean;
  category: string;
  frequency?: number;
  [key: string]: any;
}

interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  created_at?: string;
}

const SearchPage: React.FC = () => {
  const { topics, hashtags } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'topics' | 'hashtags'>('all');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Sync with URL query parameter
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchTerm) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  // Execute live search against backend PostgreSQL
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      apiService.get<any>(`/api/search?q=${encodeURIComponent(searchTerm.trim())}`)
        .then((res) => {
          const results = res.data?.results || res.data?.data || [];
          if (Array.isArray(results)) {
            setSearchResults(results);
          } else {
            setSearchResults([]);
          }
        })
        .catch(() => {
          setSearchResults([]);
        })
        .finally(() => setIsSearching(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredTopics = (topics as TopicType[])?.filter(topic =>
    (topic as any).name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredHashtags = (hashtags as HashtagType[])?.filter(hashtag =>
    (hashtag as any).name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hashtag.tag?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-300 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-950 border border-blue-400 text-xs font-black uppercase mb-3">
          Universal Search Engine &bull; PostgreSQL &amp; Topics Nexus
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Universal Platform Search
        </h1>
        <p className="text-slate-700 font-medium text-base sm:text-lg mt-2">
          Discover sovereign posts, live topics, hashtags, and community discussions across the entire FingerMobile ecosystem.
        </p>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="mt-6">
          <div className="relative max-w-3xl">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts, topics, keywords (#tech, protocol, sovereign)..."
              className="w-full px-5 py-3.5 pl-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 font-bold placeholder:text-slate-400 shadow-sm text-base"
            />
            <svg
              className="absolute left-4 top-4 h-5 w-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex border-b border-slate-300 space-x-2 sm:space-x-4 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Results' },
          { id: 'posts', label: `Posts & Content (${searchResults.length})` },
          { id: 'topics', label: `Topics (${filteredTopics.length})` },
          { id: 'hashtags', label: `Hashtags (${filteredHashtags.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`py-3 px-4 font-bold text-sm sm:text-base border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading state indicator */}
      {isSearching && (
        <div className="text-center py-6">
          <p className="text-slate-700 font-bold">Querying database for "{searchTerm}"...</p>
        </div>
      )}

      {/* All Tab */}
      {activeTab === 'all' && (
        <div className="space-y-8">
          {/* Posts from PostgreSQL */}
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center justify-between">
              <span>Matching Posts &amp; Articles</span>
              <span className="text-sm font-semibold text-slate-600">{searchResults.length} results</span>
            </h2>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map(item => (
                  <div
                    key={item.id}
                    className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-300 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-black uppercase text-blue-700 mb-1">
                        <span>{item.type || 'Post'}</span>
                        {item.created_at && (
                          <span className="text-slate-500 font-medium">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg leading-snug">
                        {item.title || 'Untitled Post'}
                      </h3>
                      {item.description && (
                        <p className="text-slate-700 text-sm font-medium line-clamp-3 mt-1.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="pt-3 border-t border-slate-200">
                      <a
                        href={`/forum`}
                        className="text-sm font-bold text-blue-600 hover:text-blue-800"
                      >
                        View in Forum &rarr;
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="p-8 bg-white rounded-xl border border-slate-300 text-center">
                <p className="text-slate-700 font-medium">No direct database posts matched "{searchTerm}". Check topics or hashtags below.</p>
              </div>
            ) : null}
          </div>

          {/* Topics Section */}
          {filteredTopics.length > 0 && (
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-4">Topics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredTopics.slice(0, 8).map(topic => (
                  <a
                    key={topic.id}
                    href={`/topics/${topic.id}`}
                    className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-300 block space-y-1"
                  >
                    <h3 className="font-bold text-slate-900 text-base">{topic.name || topic.title}</h3>
                    {topic.description && (
                      <p className="text-xs text-slate-700 line-clamp-2">{topic.description}</p>
                    )}
                    <p className="text-xs text-blue-700 font-bold pt-1">{topic.postsCount || 12} posts</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Hashtags Section */}
          {filteredHashtags.length > 0 && (
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-4">Hashtags</h2>
              <div className="flex flex-wrap gap-2.5">
                {filteredHashtags.slice(0, 16).map(hashtag => (
                  <a
                    key={hashtag.id}
                    href={`/hashtag/${hashtag.name || hashtag.tag}`}
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-950 rounded-full text-sm border border-blue-400 font-black transition-colors"
                  >
                    #{hashtag.name || hashtag.tag}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900">Database Search Results</h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map(item => (
                <div
                  key={item.id}
                  className="p-5 bg-white rounded-xl shadow-sm border border-slate-300 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-black uppercase text-blue-700">{item.type || 'Post'}</span>
                    <h3 className="font-bold text-slate-900 text-lg">{item.title || 'Untitled Post'}</h3>
                    {item.description && (
                      <p className="text-slate-700 text-sm font-medium mt-1">{item.description}</p>
                    )}
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <a href={`/forum`} className="text-sm font-bold text-blue-600 hover:text-blue-800">
                      Open Post &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-300">
              <p className="text-slate-700 font-bold">No posts found matching query.</p>
            </div>
          )}
        </div>
      )}

      {/* Topics Tab */}
      {activeTab === 'topics' && (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900">Topics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTopics.length > 0 ? (
              filteredTopics.map(topic => (
                <a
                  key={topic.id}
                  href={`/topics/${topic.id}`}
                  className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-300 block"
                >
                  <h3 className="font-bold text-slate-900 text-base">{topic.name || topic.title}</h3>
                  <p className="text-xs text-slate-700 font-medium mt-1">{topic.postsCount || 12} posts</p>
                </a>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-300">
                <p className="text-slate-700 font-bold">No topics found matching query.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hashtags Tab */}
      {activeTab === 'hashtags' && (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900">Hashtags</h2>
          <div className="flex flex-wrap gap-2.5">
            {filteredHashtags.length > 0 ? (
              filteredHashtags.map(hashtag => (
                <a
                  key={hashtag.id}
                  href={`/hashtag/${hashtag.name || hashtag.tag}`}
                  className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-950 rounded-full text-sm border border-blue-400 font-black transition-colors"
                >
                  #{hashtag.name || hashtag.tag}
                </a>
              ))
            ) : (
              <div className="w-full text-center py-12 bg-white rounded-xl border border-slate-300">
                <p className="text-slate-700 font-bold">No hashtags found matching query.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
