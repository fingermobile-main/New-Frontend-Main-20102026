import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { useAppContext } from '../../contexts/AppContext';

interface TopicType {
  id: string;
  name: string;
  title?: string;
  description?: string;
  isTrending: boolean;
  coverImageUrl: string;
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

const SearchPage: React.FC = () => {
  const { topics, hashtags } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'members' | 'topics' | 'hashtags'>('all');

  // Members not available in AppContext, using empty array
  const filteredMembers: any[] = [];

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
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Search</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Find people, topics, and content
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for people, topics, posts..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <svg
            className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
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
        </div>
      </form>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-3 px-6 font-medium text-sm ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('all')}
        >
          All Results
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm ${activeTab === 'members' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('members')}
        >
          People
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm ${activeTab === 'topics' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('topics')}
        >
          Topics
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm ${activeTab === 'hashtags' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('hashtags')}
        >
          Hashtags
        </button>
      </div>

      {activeTab === 'all' && searchTerm && (
        <div className="space-y-6">
          {filteredMembers.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">People</h2>
              <div className="space-y-3">
                {filteredMembers.slice(0, 5).map(member => (
                  <a
                    key={member.id}
                    href={`/profile/${member.id}`}
                    className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <img
                      src={member.avatarUrl || member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">@{member.membername || member.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {filteredTopics.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Topics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredTopics.slice(0, 6).map(topic => (
                  <a
                    key={topic.id}
                    href={`/topics/${topic.id}`}
                    className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white">{topic.name || topic.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{topic.postsCount} posts</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {filteredHashtags.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Hashtags</h2>
              <div className="flex flex-wrap gap-2">
                {filteredHashtags.slice(0, 10).map(hashtag => (
                  <a
                    key={hashtag.id}
                    href={`/hashtag/${hashtag.name || hashtag.tag}`}
                    className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    #{hashtag.name || hashtag.tag}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">People</h2>
          <div className="space-y-3">
            {filteredMembers.length > 0 ? (
              filteredMembers.map(member => (
                <a
                  key={member.id}
                  href={`/profile/${member.id}`}
                  className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <img
                    src={member.avatarUrl || member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">@{member.membername || member.handle}</p>
                  </div>
                </a>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No members found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Topics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTopics.length > 0 ? (
              filteredTopics.map(topic => (
                <a
                  key={topic.id}
                  href={`/topics/${topic.id}`}
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">{topic.name || topic.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{topic.postsCount} posts</p>
                </a>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No topics found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'hashtags' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Hashtags</h2>
          <div className="flex flex-wrap gap-2">
            {filteredHashtags.length > 0 ? (
              filteredHashtags.map(hashtag => (
                <a
                  key={hashtag.id}
                  href={`/hashtag/${hashtag.name || hashtag.tag}`}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  #{hashtag.name || hashtag.tag}
                </a>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No hashtags found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
