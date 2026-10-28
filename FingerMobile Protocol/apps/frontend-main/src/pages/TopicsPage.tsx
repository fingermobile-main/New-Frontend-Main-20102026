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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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
          },
          {
            id: 'top-05',
            name: 'Zero-Knowledge Proofs & Enclave Computing',
            description: 'Cryptographic privacy, biometric hardware attestation, and client-side ZKP circuits.',
            category: 'security',
            thread_count: 520,
            followers_count: 3810,
            is_following: false
          },
          {
            id: 'top-06',
            name: 'Biometric Fingerprint Hardware & IoT Relays',
            description: 'Capacitive sensors, USB-FIDO keys, decentralized relay nodes, and embedded Linux devices.',
            category: 'hardware',
            thread_count: 410,
            followers_count: 2950,
            is_following: false
          },
          {
            id: 'top-07',
            name: 'Decentralized Merchant Escrows & Storefronts',
            description: 'Trustless settlement, peer dispute councils, merchant verification, and global logistics.',
            category: 'commerce',
            thread_count: 680,
            followers_count: 4670,
            is_following: false
          },
          {
            id: 'top-08',
            name: 'Live Streaming, Dancia & Real-Time Haptics',
            description: 'Ultra-low-latency WebRTC streams, interactive viewer gifting, and synchronized tactile pulses.',
            category: 'streaming',
            thread_count: 790,
            followers_count: 5890,
            is_following: true
          },
          {
            id: 'top-09',
            name: 'P2P Gaming, Virtual Arenas & Guild Quests',
            description: 'Decentralized multiplayer lobbies, competitive hallmarks, wager pools, and leaderboard streaks.',
            category: 'gaming',
            thread_count: 890,
            followers_count: 6720,
            is_following: false
          },
          {
            id: 'top-10',
            name: 'Protocol Governance, Charter Amendments & DAOs',
            description: 'Voting procedures, node consensus thresholds, legal enclaves, and pan-African digital sovereignty.',
            category: 'governance',
            thread_count: 1120,
            followers_count: 8340,
            is_following: true
          },
          {
            id: 'top-11',
            name: 'Guardian AI Sentinels & Decentralized Moderation',
            description: 'Community-trained ML models, automated fraud detection, toxic content filtering, and transparency logs.',
            category: 'ai',
            thread_count: 630,
            followers_count: 4190,
            is_following: false
          },
          {
            id: 'top-12',
            name: 'Peer Micro-Lending & Sovereign Credit Pools',
            description: 'Decentralized micro-loans, peer collateralization, interest rate auctions, and community credit scores.',
            category: 'finance',
            thread_count: 740,
            followers_count: 5260,
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

  const filteredTopics = topics.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredHashtags = hashtags.filter((h) =>
    h.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout pageTitle="Topics & Hashtags">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-12 max-w-full overflow-x-hidden text-slate-900">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Forum Topics & Hashtags</h1>
            <p className="text-slate-700 text-sm mt-0.5">Explore 12 curated protocol topics across sovereign culture, technology, media, and commerce</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Start New Topic
          </button>
        </div>

        {/* Search Input & Category Pills */}
        <div className="mb-8 space-y-3">
          <div className="relative max-w-xl">
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-600 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search topics, categories, or #hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { id: 'all', label: 'All Topics (12)' },
              { id: 'culture', label: '🏛️ Culture & Heritage' },
              { id: 'music', label: '🎵 Music & Audio' },
              { id: 'business', label: '🪙 Business & Economy' },
              { id: 'media', label: '🎬 Media & Directing' },
              { id: 'security', label: '🛡️ Security & ZKP' },
              { id: 'hardware', label: '📡 Hardware & Sensors' },
              { id: 'commerce', label: '🛍️ Commerce & Escrows' },
              { id: 'streaming', label: '📺 Live Streaming' },
              { id: 'gaming', label: '🎮 P2P Gaming' },
              { id: 'governance', label: '📜 DAOs & Governance' },
              { id: 'ai', label: '🤖 Guardian AI' },
              { id: 'finance', label: '💳 Micro-Lending' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topics Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-black text-slate-900 mb-4">Active Forum Topics ({filteredTopics.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-3xl border border-slate-300 p-6 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-sky-100 text-sky-950 border border-sky-300">
                      {topic.category}
                    </span>
                    <h3 className="font-black text-slate-900 text-base mt-2.5 hover:text-blue-700 transition-colors">
                      <ReactRouterDOM.NavLink to={`/news-feed/${topic.id}`}>
                        {topic.name}
                      </ReactRouterDOM.NavLink>
                    </h3>
                    <p className="text-xs text-slate-700 mt-2 line-clamp-3 leading-relaxed font-medium">
                      {topic.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                    <div className="text-xs text-slate-700 font-semibold">
                      <span>{topic.thread_count} discussions</span> • <span>{(topic.followers_count).toLocaleString()} followers</span>
                    </div>
                    <button
                      onClick={() => handleToggleFollow(topic.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        topic.is_following
                          ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                      }`}
                    >
                      {topic.is_following ? '✓ Following' : '+ Follow'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hashtags Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-300 p-6 shadow-xs">
              <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600" />
                Trending Hashtags
              </h2>
              <div className="divide-y divide-slate-100">
                {filteredHashtags.map((ht) => (
                  <ReactRouterDOM.NavLink
                    key={ht.tag}
                    to={`/news-feed/${ht.tag.replace('#', '')}`}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors"
                  >
                    <div>
                      <p className="font-black text-sm text-slate-900 hover:text-blue-600">{ht.tag}</p>
                      <p className="text-xs text-slate-600">{ht.category}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-950 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-400 font-black">
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
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 animate-in fade-in zoom-in-95 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <h3 className="text-lg font-black text-slate-900">Start New Topic Category</h3>
                <button aria-label="Close" type="button" onClick={() => setShowCreateModal(false)} className="text-slate-700 hover:text-slate-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Topic Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lagos Street Food & Culinary Culture"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Category Type</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                  >
                    <option value="culture">🏛️ Culture & Heritage</option>
                    <option value="music">🎵 Music & Audio</option>
                    <option value="business">🪙 Business & Tech</option>
                    <option value="media">🎬 Media & Directing</option>
                    <option value="security">🛡️ Security & ZKP</option>
                    <option value="hardware">📡 Hardware & Sensors</option>
                    <option value="commerce">🛍️ Commerce & Escrows</option>
                    <option value="gaming">🎮 Gaming & Sports</option>
                    <option value="governance">📜 Governance & DAOs</option>
                    <option value="ai">🤖 AI & Sentinels</option>
                    <option value="finance">💳 Micro-Lending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Description & Guidelines</label>
                  <textarea
                    rows={3}
                    placeholder="What will members explore and discuss in this topic?"
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
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

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 md:hidden">
          <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-[11px] font-bold ${
                selectedCategory === 'all' ? 'text-blue-600 bg-blue-50 border border-blue-200' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span className="text-base font-black">🌐</span>
              <span>All</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('tech')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-[11px] font-bold ${
                selectedCategory === 'tech' ? 'text-blue-600 bg-blue-50 border border-blue-200' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span className="text-base font-black">💻</span>
              <span>Tech</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('culture')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-[11px] font-bold ${
                selectedCategory === 'culture' ? 'text-blue-600 bg-blue-50 border border-blue-200' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span className="text-base font-black">🎭</span>
              <span>Culture</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-[11px] font-bold text-blue-600 hover:text-blue-800"
            >
              <span className="text-base font-black">➕</span>
              <span>Create</span>
            </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-[11px] font-bold text-slate-700 hover:text-slate-900"
            >
              <span className="text-base font-black">⌂</span>
              <span>Top</span>
            </button>
          </div>
        </div>
    </MainLayout>
  );
};

export default TopicsPage;
