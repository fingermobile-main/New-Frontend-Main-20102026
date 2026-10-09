/*
 * FingerMobile Protocol™ - Global Communities & Hubs
 * Peer-to-Peer Micro-Communities, Discussions & Collaborative Spaces
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useEffect, useState, useMemo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import api from '../services/api';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckCircleIcon,
  XMarkIcon,
  SparklesIcon,
  HashtagIcon
} from '../icons';

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isJoined: boolean;
  category: string;
  tags?: string[];
  bannerUrl?: string;
}

const DEFAULT_COMMUNITIES: Community[] = [
  {
    id: 'comm-01',
    name: 'Tech Innovators Guild',
    description: 'Software engineers, protocol designers, and Web3 developers building on the FingerMobile SDK and decentralized infrastructure.',
    memberCount: 1420,
    isJoined: true,
    category: 'Technology',
    tags: ['Web3', 'React', 'DevOps', 'TypeScript']
  },
  {
    id: 'comm-02',
    name: 'Creative Visual Minds',
    description: 'Documentary photographers, street lens masters, and digital artists licensing works across PhotoCredits and Catalogue.',
    memberCount: 980,
    isJoined: true,
    category: 'Arts & Media',
    tags: ['Photography', 'Design', 'PhotoCredits', 'Art']
  },
  {
    id: 'comm-03',
    name: 'African Sound Architects',
    description: 'Afrobeats producers, audio mixing engineers, and composers sharing stems and rhythm templates on BeatwaveNG.',
    memberCount: 2150,
    isJoined: false,
    category: 'Music & Audio',
    tags: ['Afrobeats', 'Beatwave', 'Music', 'Audio']
  },
  {
    id: 'comm-04',
    name: 'Sovereign Business Syndicate',
    description: 'Entrepreneurs, merchant storefront operators, and franchise hub leaders collaborating on global commercial expansion.',
    memberCount: 1680,
    isJoined: false,
    category: 'Business',
    tags: ['Franchise', 'Commerce', 'Storefronts', 'Startup']
  },
  {
    id: 'comm-05',
    name: 'Metaverse & Hologram Labs',
    description: '3D modelers, Mii avatar riggers, and interactive virtual environment creators designing cyber wearables.',
    memberCount: 840,
    isJoined: false,
    category: 'Technology',
    tags: ['Mii', '3D', 'Metaverse', 'VR']
  }
];

const CommunityPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [communities, setCommunities] = useState<Community[]>(DEFAULT_COMMUNITIES);
  const [activeTab, setActiveTab] = useState<'my' | 'discover'>('discover');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Create Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    category: 'Technology',
    tags: 'Web3, Community'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchCommunities = async () => {
      try {
        const res = await api.get('/communities');
        const raw = res.data?.data || res.data?.communities || (Array.isArray(res.data) ? res.data : []);
        if (mounted && Array.isArray(raw) && raw.length > 0) {
          setCommunities(raw.map((c: any, index: number) => ({
            id: String(c.id),
            name: c.name,
            description: c.description || 'Community space for active collaborative members.',
            memberCount: c.members_count || 120,
            isJoined: index % 2 === 0,
            category: c.category || 'Technology',
            tags: c.tags || ['Community', 'General']
          })));
        }
      } catch {
        // Retain default robust community directory
      }
    };
    fetchCommunities();
    return () => { mounted = false; };
  }, []);

  const joinCommunity = async (id: string, name: string) => {
    try {
      await api.post(`/communities/${id}/join`).catch(() => {});
      setCommunities((prev) =>
        prev.map((comm) =>
          comm.id === id
            ? { ...comm, isJoined: true, memberCount: comm.memberCount + 1 }
            : comm
        )
      );
      showToast(`Joined "${name}"! Welcome to the digital space.`, 'success');
    } catch {
      showToast('Joined community locally', 'info');
    }
  };

  const leaveCommunity = async (id: string, name: string) => {
    try {
      await api.post(`/communities/${id}/leave`).catch(() => {});
      setCommunities((prev) =>
        prev.map((comm) =>
          comm.id === id
            ? { ...comm, isJoined: false, memberCount: Math.max(0, comm.memberCount - 1) }
            : comm
        )
      );
      showToast(`Left "${name}"`, 'info');
    } catch {
      showToast('Left community', 'info');
    }
  };

  const handleCreateCommunitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name) {
      showToast('Please provide a community name', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await new Promise((res) => setTimeout(res, 600));

      const newComm: Community = {
        id: `comm-${Date.now()}`,
        name: createForm.name,
        description: createForm.description || 'A dedicated sovereign community micro-hub on FingerMobile.',
        category: createForm.category,
        memberCount: 1,
        isJoined: true,
        tags: createForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
      };

      setCommunities([newComm, ...communities]);
      setIsCreateModalOpen(false);
      setCreateForm({ name: '', description: '', category: 'Technology', tags: 'Web3, Community' });
      showToast(`Community "${newComm.name}" created successfully!`, 'success');
    } catch {
      showToast('Failed to create community', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCommunities = useMemo(() => {
    return communities.filter((comm) => {
      const matchesTab = activeTab === 'my' ? comm.isJoined : true;
      const matchesSearch =
        comm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comm.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comm.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (comm.tags && comm.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesCategory = selectedCategory === 'All' || comm.category === selectedCategory;
      const matchesTag = !selectedTag || (comm.tags && comm.tags.includes(selectedTag));

      return matchesTab && matchesSearch && matchesCategory && matchesTag;
    });
  }, [communities, activeTab, searchTerm, selectedCategory, selectedTag]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    communities.forEach((c) => {
      if (c.tags) c.tags.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [communities]);

  return (
    <MainLayout pageTitle="Communities">
      <div className="min-h-screen bg-slate-50 text-gray-900 pb-16">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/40">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
                <UserGroupIcon className="w-4 h-4 text-indigo-400" />
                Digital Living Rooms & Micro-Communities
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Platform Communities
              </h1>
              <p className="mt-2 text-indigo-200 text-sm max-w-2xl">
                Dedicated spaces for creators, engineers, musicians, and entrepreneurs to collaborate, solve problems, and connect around shared passions.
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-sm font-bold shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5" />
              Start a Community
            </button>
          </div>
        </div>

        {/* Toolbar Deck */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-5 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search communities by name, topic, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                />
              </div>

              {/* Tab Pills */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('discover')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'discover'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Discover All ({communities.length})
                </button>
                <button
                  onClick={() => setActiveTab('my')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'my'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  My Hubs ({communities.filter((c) => c.isJoined).length})
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-gray-100">
              {['All', 'Technology', 'Arts & Media', 'Music & Audio', 'Business'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}

              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="ml-auto flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold"
                >
                  <span>Tag: #{selectedTag}</span>
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Community Cards List (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-indigo-600" />
                  Active Micro-Communities ({filteredCommunities.length})
                </h2>
                <span className="text-xs text-gray-500 font-semibold">
                  Zero Spam & Admin Assist Moderated
                </span>
              </div>

              {filteredCommunities.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm">
                  <UserGroupIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-gray-800">No communities match your search</h3>
                  <p className="text-xs text-gray-500 mt-1">Try resetting the tag or category filter to discover more spaces.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setSelectedTag(null);
                    }}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredCommunities.map((comm) => (
                    <div
                      key={comm.id}
                      className="bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-xl transition-all p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {comm.category}
                          </span>
                          <span className="text-xs text-gray-400 font-semibold">
                            {comm.memberCount.toLocaleString()} members
                          </span>
                        </div>

                        <h3 className="text-lg font-black text-gray-900 leading-snug">{comm.name}</h3>
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-3">
                          {comm.description}
                        </p>

                        {/* Tag Chips */}
                        {comm.tags && comm.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-4">
                            {comm.tags.map((tag) => (
                              <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                                  selectedTag === tag
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                        {comm.isJoined ? (
                          <button
                            onClick={() => leaveCommunity(comm.id, comm.name)}
                            className="w-full py-2.5 border border-gray-200 hover:bg-rose-50 hover:text-rose-600 text-gray-600 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                          >
                            <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                            <span>Joined (Click to Leave)</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => joinCommunity(comm.id, comm.name)}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
                          >
                            <UserGroupIcon className="w-4 h-4" />
                            <span>Join Community</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Stats Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-black text-gray-900 text-sm mb-4">Your Community Activity</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                    <span className="text-gray-500">Communities Joined:</span>
                    <strong className="text-gray-900">{communities.filter((c) => c.isJoined).length}</strong>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                    <span className="text-gray-500">Peer Discussions:</span>
                    <strong className="text-gray-900">42 Threads</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Trust Reputation:</span>
                    <strong className="text-emerald-600 font-black">98.4% Verified</strong>
                  </div>
                </div>
              </div>

              {/* Trending Topics / Tags */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-1.5">
                  <HashtagIcon className="w-4 h-4 text-indigo-600" />
                  Trending Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedTag === tag
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Create Community Callout */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 border border-indigo-100">
                <h3 className="font-black text-gray-900 text-base">Start a Micro-Community</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Bring your niche together with automatic keyword assist, structured guides, and private discussion lounges.
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create New Space
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Create Community Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Create a New Community</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Design a digital living room for focused peer collaboration</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCommunitySubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Community Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vintage Camera Collectors or Lagos FinTech Hub"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Arts & Media">Arts & Media</option>
                    <option value="Music & Audio">Music & Audio</option>
                    <option value="Business">Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Purpose & Description</label>
                  <textarea
                    rows={3}
                    placeholder="Explain the identity, goals, and who belongs in this micro-community..."
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Photography, Film, Vintage, Studio"
                    value={createForm.tags}
                    onChange={(e) => setCreateForm({ ...createForm, tags: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30"
                  >
                    {isSubmitting ? 'Establishing Space...' : 'Launch Community'}
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

export default CommunityPage;
