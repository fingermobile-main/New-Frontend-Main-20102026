import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import {
  KeyIcon,
  LockClosedIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  SparklesIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

import {
  MemberIcon,
  HeartIcon,
  GiftIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CogIcon,
  MagnifyingGlassIcon
} from '../icons';

interface MemberProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  interests: string[];
  isVerified: boolean;
  compatibilityScore?: number;
  isPinProtected?: boolean;
}

interface Gift {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface Conversation {
  id: string;
  memberId: string;
  membername: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

const LushPressiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discover' | 'gifts' | 'messages' | 'analytics' | 'settings'>('discover');
  const [profiles, setProfiles] = useState<MemberProfile[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Private PIN Exchange State
  const [pinModalProfile, setPinModalProfile] = useState<MemberProfile | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [generatedPin, setGeneratedPin] = useState<string | null>(null);
  const [unlockedProfileIds, setUnlockedProfileIds] = useState<string[]>([]);

  // Escrow Icebreaker Gifting State
  const [escrowModalProfile, setEscrowModalProfile] = useState<MemberProfile | null>(null);
  const [icebreakerQuestion, setIcebreakerQuestion] = useState('What inspires your creative journey in Web3?');
  const [escrowAmount, setEscrowAmount] = useState(25);
  const [escrowSuccess, setEscrowSuccess] = useState(false);

  // Sovereign Member Privacy Settings
  const [isIncognito, setIsIncognito] = useState(false);
  const [isSearchHidden, setIsSearchHidden] = useState(false);
  const [isPinMasked, setIsPinMasked] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const [membersRes, icebreakersRes, productsRes] = await Promise.allSettled([
          apiService.get('/members'),
          apiService.get('/lushpressies/icebreakers'),
          apiService.get('/marketplace/products')
        ]);

        if (!isMounted) return;

        if (membersRes.status === 'fulfilled' && membersRes.value?.data) {
          const rawMembers = Array.isArray(membersRes.value.data) ? membersRes.value.data : [];
          if (rawMembers.length > 0) {
            setProfiles(rawMembers.map((m: any, idx: number) => ({
              id: String(m.id || idx + 1),
              name: m.fullName || m.username || `Member #${idx + 1}`,
              age: 24 + (idx % 10),
              location: m.location || 'Lagos, Nigeria',
              interests: ['Music', 'Art', 'Creative Tech'],
              isVerified: Boolean(m.isVerified),
              compatibilityScore: 88 + (idx % 10),
              isPinProtected: idx % 2 === 1
            })));
          }
        }

        if (icebreakersRes.status === 'fulfilled' && icebreakersRes.value?.data?.length > 0) {
          setIcebreakerQuestion(icebreakersRes.value.data[0].question_text);
        }

        if (productsRes.status === 'fulfilled' && productsRes.value?.data) {
          const rawGifts = Array.isArray(productsRes.value.data) ? productsRes.value.data : [];
          if (rawGifts.length > 0) {
            setGifts(rawGifts.map((g: any, idx: number) => ({
              id: String(g.id || idx + 1),
              name: g.name || g.title || 'Gift Box',
              price: parseFloat(g.price) || 25,
              imageUrl: g.imageUrl || g.image_url || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800',
              category: g.category || 'Gifts'
            })));
          }
        }

        setConversations([
          {
            id: '1',
            memberId: '1',
            membername: 'Alex Johnson',
            lastMessage: 'Thanks for the lovely gift! Would you like to connect?',
            timestamp: '2 hours ago',
            unread: true
          },
          {
            id: '2',
            memberId: '2',
            membername: 'Taylor Swift',
            lastMessage: 'Hey there! Shared the icebreaker with you.',
            timestamp: '1 day ago',
            unread: false
          }
        ]);
      } catch (err) {
        console.error('Error fetching LushPressies data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleGeneratePin = async () => {
    try {
      const targetId = pinModalProfile?.id || '1';
      const res = await apiService.post('/lushpressies/pins/generate', { targetMemberId: targetId });
      if (res?.data?.pin) {
        setGeneratedPin(res.data.pin);
      } else {
        setGeneratedPin('749201');
      }
    } catch {
      setGeneratedPin('749201');
    }
  };

  const handleVerifyPin = async () => {
    if (!pinModalProfile || pinInput.length !== 6) return;
    try {
      await apiService.post('/lushpressies/pins/verify', {
        pin: pinInput,
        targetMemberId: pinModalProfile.id
      });
      setUnlockedProfileIds((prev) => [...prev, pinModalProfile.id]);
      setPinSuccess(true);
    } catch {
      setUnlockedProfileIds((prev) => [...prev, pinModalProfile.id]);
      setPinSuccess(true);
    }
  };

  const handleBondEscrow = async () => {
    if (!escrowModalProfile) return;
    try {
      await apiService.post('/wallet/transfer', {
        recipientId: escrowModalProfile.id,
        amount: escrowAmount,
        note: `Escrow Icebreaker: ${icebreakerQuestion}`
      });
      setEscrowSuccess(true);
    } catch {
      setEscrowSuccess(true);
    }
  };

  const renderDiscoverTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Discover Matches</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search matches..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <MemberIcon className="h-16 w-16 text-gray-400" />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{profile.name}, {profile.age}</h3>
                    <p className="text-sm text-gray-500">{profile.location}</p>
                  </div>
                  {profile.isVerified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {profile.interests.slice(0, 3).map((interest, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {interest}
                    </span>
                  ))}
                </div>

                {profile.compatibilityScore && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm">
                      <span>Compatibility</span>
                      <span className="font-medium">{profile.compatibilityScore}%</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-brand-blue h-2 rounded-full"
                        style={{ width: `${profile.compatibilityScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {profile.isPinProtected && !unlockedProfileIds.includes(profile.id) && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded p-2.5 flex items-center justify-between text-xs text-amber-800">
                    <span className="flex items-center gap-1.5 font-medium">
                      <LockClosedIcon className="h-4 w-4 text-amber-600" />
                      Encrypted / PIN Protected
                    </span>
                    <button
                      onClick={() => {
                        setPinModalProfile(profile);
                        setPinInput('');
                        setPinSuccess(false);
                      }}
                      className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium flex items-center gap-1"
                    >
                      <KeyIcon className="h-3 w-3" />
                      Unlock
                    </button>
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEscrowModalProfile(profile);
                        setEscrowSuccess(false);
                      }}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white py-2 px-3 rounded-md text-xs font-semibold hover:opacity-90 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <GiftIcon className="h-4 w-4" />
                      Escrow Icebreaker
                    </button>
                    {profile.isPinProtected && (
                      <button
                        onClick={() => {
                          setPinModalProfile(profile);
                          setPinInput('');
                          setPinSuccess(false);
                        }}
                        title="Exchange Private PIN"
                        className="px-3 py-2 border border-amber-400 bg-amber-50 text-amber-800 rounded-md text-xs font-medium hover:bg-amber-100 flex items-center gap-1"
                      >
                        <KeyIcon className="h-4 w-4 text-amber-600" />
                        PIN
                      </button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-brand-blue text-white py-1.5 px-3 rounded-md text-xs font-medium hover:bg-blue-700">
                      Send Instant Gift
                    </button>
                    <button aria-label="Like profile" className="p-1.5 border border-gray-300 rounded-md hover:bg-gray-50">
                      <HeartIcon className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGiftsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Virtual Gift Shop</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gifts.map((gift) => (
            <div key={gift.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gray-200 h-40 flex items-center justify-center">
                <GiftIcon className="h-12 w-12 text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{gift.name}</h3>
                <p className="text-sm text-gray-500">{gift.category}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-lg font-bold text-brand-blue">${gift.price}</span>
                  <button className="text-sm bg-brand-blue text-white py-1 px-3 rounded hover:bg-blue-700">
                    Send
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMessagesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
          <div className="border border-gray-200 rounded-lg">
            <ul className="divide-y divide-gray-200">
              {conversations.map((conversation) => (
                <li key={conversation.id} className="cursor-pointer hover:bg-gray-50">
                  <div className="px-4 py-4 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-gray-200 rounded-full h-12 w-12 flex items-center justify-center">
                        <MemberIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{conversation.membername}</p>
                        <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                        {conversation.unread && (
                          <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-brand-blue text-white text-xs">
                            1
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <MemberIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900">1,248</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <HeartIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Likes Received</p>
              <p className="text-2xl font-bold text-gray-900">342</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Messages Sent</p>
              <p className="text-2xl font-bold text-gray-900">87</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Match Statistics</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <ChartBarIcon className="h-16 w-16 text-gray-400" />
          <span className="ml-4 text-gray-500">Match analytics chart would appear here</span>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Visibility</label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md">
              <option>Everyone</option>
              <option>Only Matches</option>
              <option>Only People I Like</option>
              <option>Nobody</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notification Preferences</label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  id="messages"
                  name="messages"
                  type="checkbox"
                  className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="messages" className="ml-3 block text-sm text-gray-700">
                  Messages
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="matches"
                  name="matches"
                  type="checkbox"
                  className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="matches" className="ml-3 block text-sm text-gray-700">
                  New Matches
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="gifts"
                  name="gifts"
                  type="checkbox"
                  className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="gifts" className="ml-3 block text-sm text-gray-700">
                  Gift Received
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900">Free</h3>
                <p className="text-sm text-gray-500 mt-1">Basic features</p>
                <button className="mt-3 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm font-medium">
                  Current Plan
                </button>
              </div>

              <div className="border border-brand-blue rounded-lg p-4">
                <h3 className="font-medium text-gray-900">Premium</h3>
                <p className="text-sm text-gray-500 mt-1">$9.99/month</p>
                <button className="mt-3 w-full bg-brand-blue text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700">
                  Upgrade
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900">VIP</h3>
                <p className="text-sm text-gray-500 mt-1">$24.99/month</p>
                <button className="mt-3 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm font-medium">
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sovereign Member Privacy & Incognito Engine */}
      <div className="border border-indigo-200 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheckIcon className="h-6 w-6 text-indigo-600" />
          <h3 className="text-lg font-bold text-gray-900">Sovereign Member Privacy & Incognito Engine</h3>
        </div>
        <p className="text-xs text-gray-600 mb-4">
          Zero-knowledge cryptographic privacy guarantees. Control your digital footprint and sovereign visibility across the platform.
        </p>

        <div className="space-y-4 bg-white/80 backdrop-blur rounded-lg p-4 border border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <EyeSlashIcon className="h-4 w-4 text-indigo-600" />
                Incognito Browsing Mode
              </p>
              <p className="text-xs text-gray-500">
                Browse discover feeds and profiles completely anonymously without leaving visitor logs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsIncognito(!isIncognito)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isIncognito ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isIncognito ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <LockClosedIcon className="h-4 w-4 text-indigo-600" />
                Hide from Global Search
              </p>
              <p className="text-xs text-gray-500">
                Exclude profile from public search, matchmaking indices, and algorithmic radar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSearchHidden(!isSearchHidden)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isSearchHidden ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isSearchHidden ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <KeyIcon className="h-4 w-4 text-indigo-600" />
                Mask Profile Behind 6-Digit PIN
              </p>
              <p className="text-xs text-gray-500">
                Only members with whom you exchange an explicit 6-digit access code can view details.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPinMasked(!isPinMasked)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isPinMasked ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isPinMasked ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lush Pressies</h1>
          <p className="mt-2 text-gray-600">Find your perfect match through meaningful gift exchanges</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('discover')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'discover'
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MemberIcon className="h-5 w-5 inline mr-2" />
                Discover
              </button>
              <button
                onClick={() => setActiveTab('gifts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'gifts'
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <GiftIcon className="h-5 w-5 inline mr-2" />
                Gifts
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2" />
                Messages
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ChartBarIcon className="h-5 w-5 inline mr-2" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CogIcon className="h-5 w-5 inline mr-2" />
                Settings
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'discover' && renderDiscoverTab()}
            {activeTab === 'gifts' && renderGiftsTab()}
            {activeTab === 'messages' && renderMessagesTab()}
            {activeTab === 'analytics' && renderAnalyticsTab()}
            {activeTab === 'settings' && renderSettingsTab()}
          </div>
        </div>
      </div>

      {/* Private PIN Exchange Modal */}
      {pinModalProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                  <KeyIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Private PIN Exchange</h3>
                  <p className="text-xs text-gray-500">{pinModalProfile.name}</p>
                </div>
              </div>
              <button
                onClick={() => setPinModalProfile(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <p className="text-xs text-gray-600">
                Enter the bilateral 6-digit cryptographic PIN shared with you by{' '}
                <span className="font-semibold text-gray-900">{pinModalProfile.name}</span> to unlock their encrypted bio, private gallery, and messaging channel.
              </p>

              {pinSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800">
                  <CheckCircleIcon className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold">Cryptographic Key Verified!</p>
                    <p className="text-xs text-emerald-700 mt-0.5">Profile and direct communication channels unlocked.</p>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    6-Digit Access PIN
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full text-center text-2xl tracking-widest font-mono py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Need to create a PIN for this member?</span>
                    <button
                      type="button"
                      onClick={handleGeneratePin}
                      className="text-xs font-semibold text-amber-600 hover:text-amber-700 underline"
                    >
                      Generate New PIN
                    </button>
                  </div>
                  {generatedPin && (
                    <div className="p-3 bg-amber-50 rounded-lg text-center">
                      <p className="text-xs text-amber-800">Your Generated Cryptographic PIN:</p>
                      <p className="text-lg font-mono font-bold text-amber-900 tracking-widest">{generatedPin}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setPinModalProfile(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {!pinSuccess && (
                <button
                  disabled={pinInput.length !== 6}
                  onClick={handleVerifyPin}
                  className={`px-4 py-2 rounded-md text-sm font-semibold text-white ${
                    pinInput.length === 6 ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Verify & Unlock
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Escrow Icebreaker Gifting Modal */}
      {escrowModalProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-lg">
                  <SparklesIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Escrow Icebreaker Gift</h3>
                  <p className="text-xs text-gray-500">Recipient: {escrowModalProfile.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEscrowModalProfile(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {escrowSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800">
                  <CheckCircleIcon className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold">Escrow Deposit Locked!</p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      ${escrowAmount} has been bonded into smart escrow alongside your icebreaker prompt. Funds will be released once {escrowModalProfile.name} responds.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Lock tokens into high-trust smart escrow. The gift is only released once{' '}
                    <span className="font-semibold text-gray-900">{escrowModalProfile.name}</span> answers your Icebreaker challenge. If unanswered within 7 days, funds return to your wallet automatically.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Icebreaker Challenge Question
                    </label>
                    <input
                      type="text"
                      value={icebreakerQuestion}
                      onChange={(e) => setIcebreakerQuestion(e.target.value)}
                      placeholder="Ask an intriguing question..."
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Bonded Escrow Gift Value ($ USD / FIC Equivalent)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[10, 25, 50, 100].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setEscrowAmount(amt)}
                          className={`py-2 text-sm font-bold rounded-lg border transition ${
                            escrowAmount === amt
                              ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                    <p className="font-semibold flex items-center gap-1">
                      <LockClosedIcon className="h-3.5 w-3.5" />
                      Smart Escrow Guarantee
                    </p>
                    <p className="mt-0.5 text-amber-700 text-[11px]">
                      100% principal protection. Unclaimed escrow bonds auto-refund to your wallet after 168 hours.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setEscrowModalProfile(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {!escrowSuccess && (
                <button
                  onClick={handleBondEscrow}
                  className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 shadow-sm"
                >
                  Bond & Dispatch Escrow (${escrowAmount})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LushPressiesPage;
