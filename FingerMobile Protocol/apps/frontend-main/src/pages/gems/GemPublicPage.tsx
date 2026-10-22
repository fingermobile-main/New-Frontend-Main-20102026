import { useParams, useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';

import { useGem } from '../../contexts/GemContext';
import { PostContext } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';
import PostCard from '../../components/PostCard';
import PageHeader from '../../components/PageHeader';
import { VoiceFeedContext } from '../../contexts/VoiceFeedContext';
import { LiveIcon } from '../../components/icons';
import type { Post, Gem, Member } from '../../types';

const GemPublicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { member } = useAuth();
  const { gems, handleJoinGem } = useGem();
  const { openModal, ficBalance, handleAiAssist, showToast, triggerSpecialEffect, activeSubProfile } = useAppContext();

  const gem = gems.find((g: Gem) => g.slug === slug || g.id === slug);

  // Get context with fallbacks for undefined
  const postContext = useContext(PostContext);
  const voiceContext = useContext(VoiceFeedContext);

  const allPosts = postContext?.posts ?? [];
  const handleLikePostFn = postContext?.handleLikePost;
  const handleAddNewCommentFn = postContext?.handleAddNewComment;
  const handleVoteFn = postContext?.handleVote;
  const handleDeletePostFn = postContext?.handleDeletePost;
  const handleTokenizePostFn = postContext?.handleTokenizePost;

  if (!gem) {
    return <PageHeader title="Not Found" description="This Gem community does not exist." />;
  }

  // Fix property access issues
  const gemOwner = typeof gem.owner === 'string' ? { id: gem.owner, name: 'Unknown', membername: 'unknown' } : gem.owner;
  const isLive = voiceContext?.state.isPlaying || false;
  const isMember = member ? (gem.members || []).includes(member.id) : false;
  const isOwner = member?.id === (typeof gem.owner === 'string' ? gem.owner : gem.owner?.id);
  const canAffordJoinFee = (gem.settings?.joinFee || 0) > 0 ? ficBalance >= (gem.settings?.joinFee || 0) : true;

  let featuredPosts = allPosts.filter((p: Post) => gem.posts?.includes(p.id));

  // Apply content blocking from active sub-profile
  if (activeSubProfile && (activeSubProfile as any).blockedContentIds?.length > 0) {
    const blockedIds = new Set((activeSubProfile as any).blockedContentIds);
    featuredPosts = featuredPosts.filter((post: Post) => !blockedIds.has(post.id));
  }

  const handleJoinCommunity = () => {
    if (!member) {
      navigate('/login');
      return;
    }

    if (canAffordJoinFee && handleJoinGem) {
      handleJoinGem(gem.id);
    } else {
      showToast('Insufficient FIC to join this Gem.');
    }
  };

  const CommunityHeader = () => (
    <div className="bg-white border-b border-slate-300 p-6 text-center">
      <img src={gem.logoUrl || ''} alt={gem.name || 'Gem'} className="w-24 h-24 rounded-full border-4 border-slate-200 mx-auto mb-2 bg-white object-cover shadow-sm"  />
      <h1 className="text-3xl font-black text-slate-900">{gem.name || 'Unnamed Gem'}</h1>
      <p className="text-sm font-semibold text-slate-700">Created by @{typeof gem.owner === 'string' ? 'unknown' : gem.owner?.membername || 'unknown'}</p>
    </div>
  );

  if (!isMember && !isOwner) {
    return (
      <div className="flex-1 bg-slate-50 min-h-screen">
        <CommunityHeader />
        <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-300 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900">{gem.name || 'Gem'}</h2>
            <p className="text-slate-700 font-medium my-4">{gem.rules || 'No rules defined.'}</p>
            <button onClick={handleJoinCommunity} disabled={!canAffordJoinFee} className="w-full py-3 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors disabled:bg-slate-400 cursor-pointer">
              {(gem.settings?.joinFee || 0) > 0 ? `Join for ${gem.settings?.joinFee} FIC` : 'Join for Free'}
            </button>
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
                <h3 className="font-black text-white">Voice Session Live</h3>
                <p className="text-sm opacity-90">{typeof gem.owner === 'object' && gem.owner?.name ? `${gem.owner.name} is live now!` : 'Someone is live now!'}</p>
              </div>
            </div>
          </div>
        )}
        <div className="max-w-3xl mx-auto space-y-6">
          {featuredPosts.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GemPublicPage;
