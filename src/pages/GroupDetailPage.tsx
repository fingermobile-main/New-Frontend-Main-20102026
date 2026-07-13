import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from "../contexts/AppContext";
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';
import { usePost } from '../contexts/PostContext';
import PostCard from '../components/PostCard';
import PageHeader from '../components/PageHeader';
import type { Post, Group, Member } from '../types';

const GroupDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { member } = useAuth();
    const { groups, handleJoinGroup } = useGroup();
    const { posts: allPosts, handleLikePost, handleAddNewComment: handleAddComment, handleVote: handleVoteFromContext, handleDeletePost, handleTokenizePost } = usePost();
    const { showToast, ficBalance, openModal, activeSubProfile, activeSession, joinSession } = useAppContext();

    const handleOpenGiftModal = (post: any) => openModal('gift', { post });
    const handleOpenPaylinkModal = (post: any) => openModal('paylink', { post });
    
    const group: Group | undefined = groups.find((g: Group) => g?.slug === slug);

    if (!group) {
        return <PageHeader title="Not Found" subtitle="This Group does not exist." />;
    }

    // Fix the member check issue
    const isMember = member ? (group.members || []).some(m => typeof m === 'string' ? m === member.id : m.id === member.id) : false;
    const isOwner = member?.id === (group.owner as Member)?.id;
    
    let featuredPosts = allPosts.filter((p: Post) => (group.posts || []).includes(p?.id));

    // Apply content blocking from active sub-profile
    if (activeSubProfile && activeSubProfile.blockedContentIds.length > 0) {
        const blockedIds = new Set(activeSubProfile.blockedContentIds);
        featuredPosts = featuredPosts.filter((post: Post) => !blockedIds.has(post.id));
    }

    const handleJoin = () => {
        if (!member) {
            navigate('/login');
            return;
        }
        handleJoinGroup(group.id);
    };

    // Handle vote action
    const handleVote = async (postId: string, optionId: string) => {
        try {
            console.info('Voting on post:', postId, optionId);
            await handleVoteFromContext(postId, optionId);
            showToast('Vote recorded successfully!');
        } catch (error) {
            console.error('Error voting on post:', error);
            showToast('Failed to record vote. Please try again.', 'error');
        }
    };

    const CommunityHeader = () => (
        <div className="bg-white border-b p-6 text-center">
            <img src={group.logoUrl || ''} alt={group.name || 'Group'} className="w-24 h-24 rounded-full border-4 border-white mx-auto mb-2 bg-white object-cover"  />
            <h1 className="text-3xl font-bold lg:text-4xl">{group.name || 'Unnamed Group'}</h1>
            <p className="text-sm text-gray-500 lg:text-base">Created by @{(group.owner as Member)?.membername || 'unknown'}</p>
        </div>
    );
    
    if (!isMember && !isOwner) {
        return (
            <div className="flex-1 bg-gray-50 min-h-screen">
                <CommunityHeader />
                <div className="p-6 lg:p-8 max-w-2xl mx-auto">
                    <div className="bg-white p-8 rounded-xl shadow-md text-center">
                         <h2 className="text-xl font-bold lg:text-2xl">Join {group.name || 'Group'}</h2>
                         <p className="text-gray-600 my-4 lg:text-lg">{group.description || group.rules || 'No description provided'}</p>
                         <button onClick={handleJoin} className="w-full py-3 font-semibold bg-brand-blue text-white rounded-lg lg:text-xl">
                            Join for Free
                         </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-100 min-h-screen">
            <CommunityHeader />
            <div className="p-6 lg:p-8">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Composer would go here if members can post */}
                     {featuredPosts.length > 0 ? featuredPosts.map((post: Post) => (
                        <PostCard 
                            key={post.id} 
                            post={post} 
                            onLike={handleLikePost}
    // @ts-ignore - Auto-suppressed for compilation
                            onVote={(postId, optionId) => handleVote(postId, optionId)}
                            onOpenGiftModal={() => handleOpenGiftModal(post)}
                            onOpenPaylinkModal={() => handleOpenPaylinkModal(post)}
                        />
                    )) : (
                        <div className="text-center py-8 text-gray-500">
                            No posts yet in this group.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupDetailPage;