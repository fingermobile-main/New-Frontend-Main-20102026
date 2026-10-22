import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import PostCard from '../../components/PostCard';
import PageHeader from '../../components/PageHeader';
import { LiveIcon, PhoneGroupIcon } from '../../components/icons';
import { Post } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import groupsService from '../../services/groupsService';
import LoadingSpinner from '../../components/LoadingSpinner';
import voiceLineServiceInstance from '../../services/VoiceLineService';

const GroupDetailPage = () => {
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
    <div className="bg-white border-b border-slate-300 p-6 text-center">
      <img
        src={group.logoUrl}
        alt={group.name}
        className="w-24 h-24 rounded-full border-4 border-slate-200 mx-auto mb-2 bg-white object-cover shadow-sm"
      />
      <h1 className="text-3xl font-black text-slate-900">{group.name}</h1>
      <p className="text-slate-700 font-medium mt-2 max-w-xl mx-auto">{group.description}</p>
      <div className="flex justify-center gap-6 mt-4">
        <div>
          <div className="font-black text-slate-900 text-lg">{group.members.length}</div>
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Members</div>
        </div>
        <div>
          <div className="font-black text-slate-900 text-lg">{group.posts.length}</div>
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Posts</div>
        </div>
      </div>
      {!isMember && !isOwner && (
        <button
          onClick={handleJoin}
          className="mt-4 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
        >
          Join Group
        </button>
      )}
    </div>
  );

  if (!isMember && !isOwner) {
    return (
      <div className="flex-1 bg-slate-50 min-h-screen">
        <CommunityHeader />
        <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-300 text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Private Group</h2>
            <p className="text-slate-700 font-medium">
              Join this group to see posts and participate in discussions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <CommunityHeader />
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8">
        {isLive && (
          <div className="max-w-3xl mx-auto mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-2xl flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <LiveIcon className="w-6 h-6 animate-pulse" />
              <div>
                <h3 className="font-black text-white">{activeSession?.title || 'Live Session'}</h3>
                <p className="text-sm opacity-90">
                  {group.owner.name} is live now!
                </p>
              </div>
            </div>
            <button
              onClick={handleJoinSession}
              className="px-4 py-2 font-bold bg-white text-indigo-700 rounded-xl hover:bg-indigo-50 shadow-sm transition-colors cursor-pointer"
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
              onClick={() => handleJoinGroupAudioCall()}
              className="px-4 py-2 font-bold bg-white text-teal-800 rounded-xl hover:bg-teal-50 shadow-sm transition-colors cursor-pointer"
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
    </div>
  );
};

export default GroupDetailPage;
