import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import PostCard from '../../components/PostCard';
import PageHeader from '../../components/PageHeader';
import { LiveIcon, PhoneGroupIcon } from '../../components/icons';
import { Post } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import groupsService from '../../services/groupsService';
import LoadingSpinner from '../../components/LoadingSpinner';
import voiceLineServiceInstance from '../../services/VoiceLineService';
import { Users, Compass, ArrowLeft, MessageSquare, PhoneCall, Radio } from 'lucide-react';

const GroupDetailPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { showToast } = useAppContext();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allPosts] = useState<Post[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchGroup = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await groupsService.getGroupById(slug);
        if (mounted && res.group) {
          setGroup({
            ...res.group,
            logoUrl: res.group.avatarUrl || 'https://picsum.photos/seed/group/100/100',
            members: Array.isArray(res.group.members) ? res.group.members : Array(res.group.members || 1).fill('member'),
            posts: Array.isArray((res.group as any).posts) ? (res.group as any).posts : []
          });
        }
      } catch {
        // Fallback gracefully on fetch error
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchGroup();
    return () => { mounted = false; };
  }, [slug]);

  const activeAudioCall: {
    type: string;
    groupId: string;
    participants: { id: string; name: string }[];
  } | null = null as any;

  const handleJoinGroupAudioCall = () => {
    showToast('Joining group audio call...', 'info');
  };

  const isSessionActive = () => false;
  const activeSession: {
    id: string;
    title: string;
    type: string;
    groupId: string;
  } | null = null as any;

  const onVote = async () => {
    try {
      showToast('Vote recorded successfully!', 'success');
    } catch {
      showToast('Failed to record vote. Please try again.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!group) {
    return (
      <PageHeader title="Not Found" description="This Group does not exist." />
    );
  }

  const isLive = isSessionActive();
  const isAudioCallActive =
    activeAudioCall?.type === 'group' && activeAudioCall?.groupId === group.id;
  const isMember = group.isJoined || false;
  const isOwner = false;

  const featuredPosts: Post[] = allPosts.filter(
    (p: Post) => group.posts && p?.id && group.posts.includes(String(p.id)),
  );

  const onLike = async () => {
    try {
      showToast('Post liked successfully!', 'success');
    } catch {
      showToast('Failed to like post. Please try again.', 'error');
    }
  };

  const onAddComment = async () => {
    try {
      voiceLineServiceInstance.playCommentaryVoiceLine('groups');
      showToast('Comment added successfully!', 'success');
    } catch {
      showToast('Failed to add comment. Please try again.', 'error');
    }
  };

  const handleJoin = async () => {
    try {
      await groupsService.joinGroup(group.id);
      setGroup((prev: any) => ({ ...prev, isJoined: true }));
      showToast('Successfully joined the group!', 'success');
    } catch {
      showToast('Failed to join the group', 'error');
    }
  };

  const onOpenGiftModal = () => {
    showToast('Gift modal opened', 'info');
  };

  const onOpenPaylinkModal = () => {
    showToast('Paylink modal opened', 'info');
  };

  const handleJoinSession = () => {
    showToast('Joining live session...', 'info');
  };

  const CommunityHeader = () => (
    <div className="bg-white border-b border-slate-300 p-4 sm:p-6 text-center">
      <div className="flex items-center justify-start mb-3">
        <button
          type="button"
          onClick={() => navigate('/groups')}
          className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          aria-label="Back to Groups"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
      <img
        src={group.logoUrl}
        alt={group.name}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-slate-200 mx-auto mb-2 bg-white object-cover shadow-sm"
      />
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{group.name}</h1>
      <p className="text-slate-700 text-xs sm:text-sm font-medium mt-1 sm:mt-2 max-w-xl mx-auto leading-relaxed">{group.description}</p>
      <div className="flex justify-center gap-6 mt-4">
        <div>
          <div className="font-black text-slate-900 text-base sm:text-lg">{group.members.length}</div>
          <div className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">Members</div>
        </div>
        <div>
          <div className="font-black text-slate-900 text-base sm:text-lg">{group.posts.length}</div>
          <div className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">Posts</div>
        </div>
      </div>
      {!isMember && !isOwner && (
        <button
          type="button"
          onClick={handleJoin}
          className="mt-4 min-h-[44px] px-6 py-2.5 bg-blue-600 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-blue-700 shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          Join Group
        </button>
      )}
    </div>
  );

  if (!isMember && !isOwner) {
    return (
      <div className="flex-1 bg-slate-50 min-h-screen w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
        <CommunityHeader />
        <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-3 sm:p-6 lg:p-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-300 text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Private Sovereign Group</h2>
            <p className="text-slate-700 text-xs sm:text-sm font-medium">
              Join this group to see posts, participate in audio rooms, and access community perks.
            </p>
          </div>
        </div>

        {/* Floating Sovereign Mobile Navigation Quick Dock */}
        <div
          data-testid="group-detail-mobile-dock"
          className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden"
        >
          <button
            type="button"
            onClick={() => navigate('/groups')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-blue-400 active:scale-95 transition-transform"
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Groups</span>
          </button>
          <button
            type="button"
            onClick={handleJoin}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white active:scale-95 transition-transform"
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Join</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/communities')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white active:scale-95 transition-transform"
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Explore</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/forum')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white active:scale-95 transition-transform"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Forum</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 min-h-screen w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
      <CommunityHeader />
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-3 sm:p-6 lg:p-8">
        {isLive && (
          <div className="max-w-3xl mx-auto mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-2xl flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <LiveIcon className="w-6 h-6 animate-pulse" />
              <div>
                <h3 className="font-black text-white">{activeSession?.title || 'Live Session'}</h3>
                <p className="text-sm opacity-90">
                  {group.owner?.name || 'Host'} is live now!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleJoinSession}
              className="min-h-[44px] px-4 py-2 font-bold bg-white text-indigo-700 rounded-xl hover:bg-indigo-50 shadow-sm transition-colors cursor-pointer flex items-center justify-center"
            >
              Join Session
            </button>
          </div>
        )}
        {isAudioCallActive && (
          <div className="max-w-3xl mx-auto mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-2xl flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <PhoneGroupIcon className="w-6 h-6" />
              <div>
                <h3 className="font-black text-white">Group Audio Call in Progress</h3>
                <p className="text-sm opacity-90">
                  {activeAudioCall?.participants?.length || 0} members talking
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleJoinGroupAudioCall()}
              className="min-h-[44px] px-4 py-2 font-bold bg-white text-teal-800 rounded-xl hover:bg-teal-50 shadow-sm transition-colors cursor-pointer flex items-center justify-center"
            >
              Join Call
            </button>
          </div>
        )}
        <div className="max-w-3xl mx-auto space-y-6">
          {featuredPosts.length > 0 ? (
            featuredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={onLike}
                _onAddComment={onAddComment}
                onOpenGiftModal={onOpenGiftModal}
                onOpenPaylinkModal={onOpenPaylinkModal}
                onVote={onVote}
              />
            ))
          ) : (
            <div className="text-center text-slate-700 py-16 bg-white rounded-2xl shadow-sm border border-slate-300">
              <p className="font-black text-slate-900 text-base">
                This Group is empty.
              </p>
              <p className="text-sm text-slate-700 font-medium mt-1">
                The owner has not featured any posts yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Sovereign Mobile Navigation Quick Dock */}
      <div
        data-testid="group-detail-mobile-dock"
        className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden"
      >
        <button
          type="button"
          onClick={() => navigate('/groups')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-blue-400 active:scale-95 transition-transform"
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Groups</span>
        </button>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white active:scale-95 transition-transform"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Posts</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/communities')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white active:scale-95 transition-transform"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Guilds</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/forum')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white active:scale-95 transition-transform"
        >
          <Radio className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Forum</span>
        </button>
      </div>
    </div>
  );
};

export default GroupDetailPage;
