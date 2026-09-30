import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import apiService from '../services/apiService';
import UserService from '../services/UserService';
import { Member } from '../types';
import { Button } from '../components/ui/Button';
import AnimatedAvatar from '../components/AnimatedAvatar';
import memberDiscoveryService from '../services/memberDiscoveryService';
import MemberDiscoverySettings from '../components/MemberDiscoverySettings';
import DiscoveredMembers from '../components/DiscoveredMembers';
import useMemberDiscovery from '../hooks/useMemberDiscovery';

import MainLayout from '../components/layout/MainLayout';
import {
  GiftIcon,
  LinkIcon,
  CheckBadgeIcon as VerificationBadgeIcon,
  UserCircleIcon,
  HeartIcon,
  UsersIcon,
  ArrowRightIcon
} from '../icons';

const MembersPage: React.FC = () => {
  const { member } = useAuth();
  const { showToast, ficBalance } = useAppContext();

  const [members, setMembers] = useState<Member[]>([]);
  const [followed, setFollowed] = useState<string[]>([]);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [giftAmount, setGiftAmount] = useState('');
  const [paylinkAmount, setPaylinkAmount] = useState('');
  const [paylinkDescription, setPaylinkDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const { member: currentMember } = useAuth();

  useEffect(() => {
    const fetchDirectory = async () => {
      try {
        const res = await apiService.get('/users');
        const userList = res.data?.users || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        if (Array.isArray(userList) && userList.length > 0) {
          const mapped: Member[] = userList.map((u: any) => ({
            id: String(u.id),
            name: u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : (u.username || 'Member'),
            username: u.username || `user${u.id}`,
            email: u.email || `${u.username}@fingermobile.io`,
            role: u.role || 'member',
            permissions: Array.isArray(u.permissions) ? u.permissions : [],
            loyaltyTier: u.loyalty_tier || 'standard',
            bio: u.bio || 'Active member of FingerMobile protocol network',
            avatarUrl: u.avatar_url || u.avatar || '',
            isVerified: !!u.is_verified,
            followerCount: u.followers_count || 0,
            followers: u.followers_count || 0,
            following: []
          }));
          setMembers(mapped);
        }
      } catch (err) {
        console.warn('Could not fetch public members list', err);
      }
    };
    fetchDirectory();
  }, []);

  // State for member discovery
  const {
    discoveredMembers,
    isLoading: discoveryLoading,
    error: discoveryError,
    updatePreferences,
    provideFeedback,
    discoverMembers,
    preferences: discoveryPreferences
  } = useMemberDiscovery({
    memberId: member?.id,
    enabled: !!member
  });

  const handleMemberClick = (memberId: string) => {
    console.info(`Navigate to member ${memberId} profile`);
  };

  const handleMemberFeedback = (
    memberId: string,
    feedback: 'positive' | 'negative',
  ) => {
    provideFeedback({
      targetMemberId: memberId,
      action: feedback
    });
  };

  const handleRefreshDiscovery = () => {
    discoverMembers(discoveryPreferences);
  };

  const handleFollow = async (memberId: string) => {
    try {
      const memberToToggle = members.find(m => m.id === memberId) || discoveredMembers.find(m => m.id === memberId);
      if (!memberToToggle) return;

      if (currentMember?.id === memberId) {
        // Can't follow yourself
        return;
      }

      const isCurrentlyFollowing = followed.includes(memberId);

      if (isCurrentlyFollowing) {
        await UserService.unfollowUser(memberId);
        setMembers(prev => prev.map(m =>
          m.id === memberId
            ? {...m, following: m.following?.filter(id => id !== currentMember?.id) || []}
            : m
        ));
        setFollowed(prev => prev.filter(id => id !== memberId));
        showToast('Unfollowed user', 'info');
      } else {
        await UserService.followUser(memberId);
        setMembers(prev => prev.map(m =>
          m.id === memberId
            ? {...m, following: [...(m.following || []), currentMember?.id || '']}
            : m
        ));
        setFollowed(prev => [...prev, memberId]);
        showToast('Following user', 'success');
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  const handleFollowToggle = async (memberId: string) => {
    return handleFollow(memberId);
  };

  const onLike = async (memberId: string) => {
    try {
      console.info('Liking member:', memberId);
      showToast('Member liked successfully');
    } catch (error) {
      console.error('Error liking member:', error);
      showToast('Failed to like member', 'error');
    }
  };

  const onOpenGiftModal = (member: Member) => {
    if (ficBalance <= 0) {
      showToast('Insufficient FIC balance', 'error');
      return;
    }
    setSelectedMember(member);
    setShowGiftModal(true);
  };

  const onOpenPaylinkModal = (member: Member) => {
    if (ficBalance <= 0) {
      showToast('Insufficient FIC balance', 'error');
      return;
    }
    setSelectedMember(member);
    setShowPaylinkModal(true);
  };

  const handleSendGift = async () => {
    if (!selectedMember) return;
    const amount = parseFloat(giftAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (amount > ficBalance) {
      showToast('Insufficient FIC balance', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.post('/wallet/transfer', {
        recipientId: selectedMember.id,
        amount,
        currency: 'FIC',
        note: `Gift sent from ${member?.username || 'member'}`
      });
      showToast('Gift sent successfully', 'success');
      setGiftAmount('');
      setShowGiftModal(false);
      setSelectedMember(null);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to send gift';
      showToast(msg, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreatePaylink = async () => {
    if (!selectedMember) return;
    const amount = parseFloat(paylinkAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.post('/paylinks', {
        memberId: selectedMember.id,
        amount,
        title: `Paylink for ${selectedMember.name || selectedMember.username}`
      });
      showToast('Paylink created successfully', 'success');
      setPaylinkAmount('');
      setShowPaylinkModal(false);
      setSelectedMember(null);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to create paylink';
      showToast(msg, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const onVote = async (memberId: string, voteType: 'up' | 'down') => {
    try {
      console.info('Voting on member:', memberId, voteType);
      showToast('Vote recorded successfully');
    } catch (error) {
      console.error('Error voting on member:', error);
      showToast('Failed to record vote', 'error');
    }
  };

  const handleTokenizeProfile = async (memberId: string) => {
    try {
      console.info('Tokenizing profile:', memberId);
      showToast('Profile tokenized successfully');
    } catch (error) {
      console.error('Error tokenizing profile:', error);
      showToast('Failed to tokenize profile', 'error');
    }
  };

  const handleAiAssist = async (memberId: string) => {
    try {
      console.info('AI assisting profile:', memberId);
      showToast('AI assistance applied successfully');
    } catch (error) {
      console.error('Error applying AI assistance:', error);
      showToast('Failed to apply AI assistance', 'error');
    }
  };

  const MemberCard: React.FC<{ member: Member }> = ({ member }) => {
    const { member: currentMember } = useAuth(); // Get current member from auth context
    const isFollowing = followed.includes(String(member.id)); // Ensure ID is string
    const isSelf = member?.id === currentMember?.id; // Compare with current member

    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden text-center p-6 flex flex-col items-center border border-gray-100">
        <NavLink to={`/profile/${member.handlename || member.handle || `user-${member.id}`}`}> {/* Handle potentially missing handlename */}
          <AnimatedAvatar
            staticUrl={member.avatarUrl}
            animatedUrl={member.animatedAvatarUrl}
            altText={member.name || 'User'}
            className="w-20 h-20 mx-auto"
          />
        </NavLink>

        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-lg lg:text-xl">{member.name}</h3>
          {member.isVerified && (
            <VerificationBadgeIcon className="w-5 h-5 text-blue-500" />
          )}
        </div>

        <p className="text-gray-600 text-sm mb-2 lg:text-base">
          @{member.handlename || member.handle || member.username || `user${member.id}`} {/* Handle potentially missing handlename */}
        </p>
        <p className="text-gray-500 text-sm mb-4 lg:text-base">{member.bio}</p>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => onLike(String(member.id))} // Ensure ID is string
            className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <HeartIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onOpenGiftModal(member)}
            className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200"
            title="Send gift"
          >
            <GiftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onOpenPaylinkModal(member)}
            className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200"
            title="Create paylink"
          >
            <LinkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => onVote(String(member.id), 'up')} // Ensure ID is string
            className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            👍
          </button>
          <button
            onClick={() => onVote(String(member.id), 'down')} // Ensure ID is string
            className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            👎
          </button>
          <button
            onClick={() => handleTokenizeProfile(String(member.id))} // Ensure ID is string
            className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            🪙
          </button>
          <button
            onClick={() => handleAiAssist(String(member.id))} // Ensure ID is string
            className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            🤖
          </button>
        </div>

        {!isSelf && (
          <button
            onClick={() => handleFollow(String(member.id))} // Ensure ID is string
            className={`w-full py-3 px-4 rounded-lg transition-colors ${
              isFollowing
                ? 'bg-white text-blue-600 border border-blue-600'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">Community Members</h1>
              <p className="text-gray-600">Connect with creators, innovators and enthusiasts in the FingerMobile ecosystem</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="mb-6 bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">
                    Discover People & Communities
                  </h2>
                  <button
                    onClick={handleRefreshDiscovery}
                    disabled={discoveryLoading}
                    className="ml-3 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 disabled:opacity-50"
                    aria-label="Refresh discovery"><svg
                      className={`h-5 w-5 ${discoveryLoading ? 'animate-spin' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(discoveredMembers.length > 0 ? discoveredMembers : members).map((m) => (
                <MemberCard key={m.id} member={m} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-indigo-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Member Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  <UserCircleIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Invite Friends
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  <GiftIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Send Gift
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  <LinkIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Create Paylink
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Community Benefits</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Connect with like-minded creators</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Collaborate on projects</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Discover new opportunities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Gift Modal */}
      {showGiftModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              Send Gift to {selectedMember.name}
            </h3>
            <p className="text-gray-600 mb-4">
              Your Balance: {ficBalance.toLocaleString()} FIC
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (FIC)
                </label>
                <input
                  type="number"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowGiftModal(false);
                    setSelectedMember(null);
                    setGiftAmount('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-lg"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendGift}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Send Gift'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paylink Modal */}
      {showPaylinkModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              Create Paylink for {selectedMember.name}
            </h3>
            <p className="text-gray-600 mb-4">
              Your Balance: {ficBalance.toLocaleString()} FIC
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (FIC)
                </label>
                <input
                  type="number"
                  value={paylinkAmount}
                  onChange={(e) => setPaylinkAmount(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>
              <input
                type="text"
                placeholder="Enter paylink description"
                value={paylinkDescription}
                onChange={(e) => setPaylinkDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowPaylinkModal(false);
                    setSelectedMember(null);
                    setPaylinkAmount('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-lg"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePaylink}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Create Paylink'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default MembersPage;
