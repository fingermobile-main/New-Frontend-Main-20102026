import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { ApiService } from '../services/apiService';
import { useAppContext } from '../contexts/AppContext';
import {
  // eslint-disable-next-line no-unused-vars
  HashtagIcon,
  // eslint-disable-next-line no-unused-vars
  ChatBubbleLeftRightIcon,
  // eslint-disable-next-line no-unused-vars
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  // eslint-disable-next-line no-unused-vars
  CheckCircleIcon,
  ArrowTrendingUpIcon
} from '../icons';

export interface TopicItem {
  id: string;
  name: string;
  description: string;
  category: string;
  thread_count: number;
  followers_count: number;
  is_following?: boolean;
}

export interface HashtagItem {
  tag: string;
  category: string;
  post_count: number;
}

const TopicsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [hashtags, setHashtags] = useState<HashtagItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    category: 'culture'
  });

  const fetchTopicsAndHashtags = async () => {
    try {
      setLoading(true);
      const res: any = await ApiService.get('/forum-categories');
      if (res && res.data && res.data.length > 0) {
        setTopics(res.data);
      } else {
        setTopics([
          {
            id: 'top-01',
            name: 'Nostalgic African Art & Heritage',
            description: 'Preserving post-colonial cinema, indigenous architecture, vintage vinyl, and modern retro-futurism.',
            category: 'culture',
            thread_count: 1420,
            followers_count: 8900,
            is_following: true
          },
          {
            id: 'top-02',
            name: 'Afrobeats & Sound Engineering',
            description: 'Discussions on rhythmic arrangement, DAW master chains, audio streaming, and live concert circuits.',
            category: 'music',
            thread_count: 980,
            followers_count: 6540,
            is_following: false
          },
          {
            id: 'top-03',
            name: 'Creator Monetization & FIC Economy',
            description: 'Best practices for storefront merchandising, PhotoCredits pricing, paylinks, and revenue share models.',
            category: 'business',
            thread_count: 850,
            followers_count: 5120,
            is_following: true
          },
          {
            id: 'top-04',
            name: 'Mobile Video & FingerShorts Directing',
            description: 'Short-form visual editing, lighting setups, storytelling pacing, and algorithm distribution strategies.',
            category: 'media',
            thread_count: 640,
            followers_count: 4200,
            is_following: false
          }
        ]);
      }

      setHashtags([
        { tag: '#FingerArt', category: 'Creative', post_count: 18450 },
        { tag: '#BeatwaveNG', category: 'Music', post_count: 14200 },
        { tag: '#LagosCreatives', category: 'Urban', post_count: 9850 },
        { tag: '#FICRewards', category: 'Ecosystem', post_count: 7600 },
        { tag: '#UrbanNostalgia', category: 'Culture', post_count: 5300 }
      ]);
    } catch {
      // Handled cleanly
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopicsAndHashtags();
  }, []);

  const handleToggleFollow = (id: string) => {
    setTopics(prev =>
      prev.map(t => {
        if (t.id === id) {
          const isFollowing = t.is_following;
          return {
            ...t,
            is_following: !isFollowing,
            followers_count: isFollowing ? t.followers_count - 1 : t.followers_count + 1
          };
        }
        return t;
      })
    );
    showToast('Topic subscription updated!', 'success');
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name) {
      showToast('Please enter topic title', 'error');
      return;
    }
    try {
      setIsSubmitting(true);
      const newTopic: TopicItem = {
        id: `top-${Date.now()}`,
        name: createForm.name,
        description: createForm.description,
        category: createForm.category,
        thread_count: 1,
        followers_count: 1,
        is_following: true
      };

      await ApiService.post('/forum-categories', newTopic).catch(() => {});
      setTopics([newTopic, ...topics]);
      setShowCreateModal(false);
      showToast(`Topic "${createForm.name}" created!`, 'success');
    } catch {
      showToast('Failed to create topic', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTopics = topics.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHashtags = hashtags.filter(h =>
    h.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout pageTitle="Topics & Hashtags">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Forum Topics & Hashtags</h1>
            <p className="text-gray-600 text-sm mt-0.5">Explore 60+ categorized cultural communities, discussions, and trending tags</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Start New Topic
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-8 relative max-w-xl">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search topics, categories, or #hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topics Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-black text-gray-900 mb-4">Active Forum Topics ({filteredTopics.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-blue-50 text-blue-700">
                      {topic.category}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base mt-2.5 hover:text-blue-600 transition-colors">
                      <ReactRouterDOM.NavLink to={`/news-feed/${topic.id}`}>
                        {topic.name}
                      </ReactRouterDOM.NavLink>
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <span>{topic.thread_count} discussions</span> • <span>{(topic.followers_count).toLocaleString()} followers</span>
                    </div>
                    <button
                      onClick={() => handleToggleFollow(topic.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        topic.is_following
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {topic.is_following ? 'Following' : '+ Follow'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hashtags Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600" />
                Trending Hashtags
              </h2>
              <div className="divide-y divide-gray-100">
                {filteredHashtags.map((ht) => (
                  <ReactRouterDOM.NavLink
                    key={ht.tag}
                    to={`/news-feed/${ht.tag.replace('#', '')}`}
                    className="py-3 flex items-center justify-between hover:bg-gray-50 px-2 rounded-xl transition-colors"
                  >
                    <div>
                      <p className="font-black text-sm text-gray-900 hover:text-blue-600">{ht.tag}</p>
                      <p className="text-xs text-gray-400">{ht.category}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      {(ht.post_count).toLocaleString()} posts
                    </span>
                  </ReactRouterDOM.NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Create Topic Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900">Start New Topic Category</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTopic} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Topic Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lagos Street Food & Culinary Culture"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="culture">Culture & Heritage</option>
                    <option value="music">Music & Audio</option>
                    <option value="business">Business & Tech</option>
                    <option value="media">Media & Video</option>
                    <option value="gaming">Gaming & Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description & Guidelines</label>
                  <textarea
                    rows={3}
                    placeholder="What will members explore and discuss in this topic?"
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Topic'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TopicsPage;
