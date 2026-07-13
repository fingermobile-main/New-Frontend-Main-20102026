import React from 'react';
import { useState, useEffect } from 'react';
import { useAppContext } from "../contexts/AppContext";
import { usePostContext } from '../contexts/PostContext';
import PostCard from '../components/PostCard';
import { Post } from '../types';
import { 
  UserIcon, 
  CameraIcon, 
  PencilIcon, 
  CurrencyDollarIcon, 
  LinkIcon, 
  MailIcon, 
  LocationMarkerIcon,
  CalendarIcon,
  HeartIcon,
  ShareIcon,
  ChatIcon,
  GiftIcon,
  CogIcon
} from '../icons';

const ProfilePage: React.FC = () => {
  const { member, ficBalance, openModal, showToast } = useAppContext();
  const { posts, handleLike } = usePostContext();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'media' | 'reels'>('posts');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch the user's posts specifically
    // For now, we'll just filter the available posts by the current member
    if (member) {
      const filteredPosts = posts.filter(post => 
        post.authorId === member.id || 
        (post.author && post.author.id === member.id)
      );
      setUserPosts(filteredPosts);
    }
    setLoading(false);
  }, [posts, member]);

  const handleLikeClick = async (postId: string) => {
    if (handleLike) {
      await handleLike(postId);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    showToast('Entering edit mode', 'info');
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    showToast('Profile updated successfully', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
          <p className="text-gray-700 dark:text-gray-300">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative">
              <img 
                src={member.avatarUrl || member.avatar || "https://via.placeholder.com/150"} 
                alt={member.name} 
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
               />
              <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-2">
                <CameraIcon className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 md:ml-8 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold">{member.name}</h1>
                    {member.isVerified && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-white text-opacity-90">@{member.membername || member.handle}</p>
                </div>
                
                <div className="mt-2 md:mt-0 flex justify-center">
                  <button 
                    onClick={handleEditProfile}
                    className="flex items-center py-2 px-4 bg-white bg-opacity-20 text-white rounded-lg font-semibold hover:bg-opacity-30 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit Profile
                  </button>
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold">{userPosts.length}</p>
                  <p className="text-sm text-white text-opacity-80">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{member.followingCount || 128}</p>
                  <p className="text-sm text-white text-opacity-80">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{member.followerCount || 342}</p>
                  <p className="text-sm text-white text-opacity-80">Followers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="text-gray-700 mb-3">
              {member.bio || "Member hasn't added a bio yet. This is where you can share information about yourself."}
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <div className="flex items-center">
                <MailIcon className="h-4 w-4 mr-1" />
                {member.email || "email@example.com"}
              </div>
              <div className="flex items-center">
                <LocationMarkerIcon className="h-4 w-4 mr-1" />
                {member.location || "Location not set"}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Joined {member.joinDate || "Jan 2023"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <button 
          onClick={() => openModal('sendFic')}
          className="flex flex-col items-center py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <CurrencyDollarIcon className="h-5 w-5 mb-1" />
          <span>Send FIC</span>
        </button>
        <button 
          onClick={() => openModal('createPaylink')}
          className="flex flex-col items-center py-3 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          <LinkIcon className="h-5 w-5 mb-1" />
          <span>Create Paylink</span>
        </button>
        <button 
          onClick={() => openModal('gift')}
          className="flex flex-col items-center py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          <GiftIcon className="h-5 w-5 mb-1" />
          <span>Send Gift</span>
        </button>
        <button 
          onClick={() => openModal('settings')}
          className="flex flex-col items-center py-3 px-4 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          <CogIcon className="h-5 w-5 mb-1" />
          <span>Settings</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {['posts', 'media', 'reels', 'likes'].map((tab) => (
            <button
              key={tab}
              className={`py-4 px-6 font-medium text-sm whitespace-nowrap ${
                activeTab === tab 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts/Likes/Media/Reels Content */}
      <div className="bg-white rounded-b-xl rounded-t-xl">
        {activeTab === 'posts' && (
          <div className="p-4">
            {userPosts.length > 0 ? (
              <div className="space-y-6">
                {userPosts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onLike={() => handleLikeClick(post.id)} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mt-4">No posts yet</p>
                <p className="text-gray-400 text-sm mt-1">Share your first post to get started</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'media' && (
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div key={idx} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Media {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'reels' && (
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Reel {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'likes' && (
          <div className="p-4">
            <div className="text-center py-12">
              <div className="mx-auto bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <HeartIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mt-4">No liked posts yet</p>
              <p className="text-gray-400 text-sm mt-1">Posts you like will appear here</p>
            </div>
          </div>
        )}
      </div>
      
      {/* FIC Balance Card */}
      <div className="mt-6 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Your FIC Balance</h3>
            <p className="text-2xl font-bold">{ficBalance.toFixed(2)} FIC</p>
          </div>
          <CurrencyDollarIcon className="h-12 w-12 opacity-80" />
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => openModal("sendFic", {})}
            className="flex-1 bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <CurrencyDollarIcon className="h-4 w-4 mr-1" />
            Send
          </button>
          <button
            onClick={() => openModal("createPaylink", {})}
            className="flex-1 bg-white bg-opacity-20 text-white py-2 rounded-lg font-semibold hover:bg-opacity-30 transition-colors flex items-center justify-center"
          >
            <LinkIcon className="h-4 w-4 mr-1" />
            Paylink
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;