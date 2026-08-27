import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartIcon, ChatBubbleIcon, ShareIcon, HomeIcon, UserIcon } from '../icons';
import { SearchIcon } from '../icons';

const FingerShortsPage: React.FC = () => {
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([]);

  // Mock data for shorts
  const shorts = [
    { id: 1, username: "@user1", caption: "Amazing short video #fyp", likes: 1200, comments: 45, shares: 23, bookmarked: false },
    { id: 2, username: "@creator2", caption: "Check out this dance move 🕺💃", likes: 3400, comments: 89, shares: 120, bookmarked: true },
    { id: 3, username: "@trendsetter", caption: "New trend alert! Try this at home", likes: 5600, comments: 210, shares: 340, bookmarked: false },
  ];

  const toggleLike = (id: number) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter(postId => postId !== id));
    } else {
      setLikedPosts([...likedPosts, id]);
    }
  };

  const toggleBookmark = (id: number) => {
    if (bookmarkedPosts.includes(id)) {
      setBookmarkedPosts(bookmarkedPosts.filter(postId => postId !== id));
    } else {
      setBookmarkedPosts([...bookmarkedPosts, id]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-black bg-opacity-80 backdrop-blur-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HomeIcon className="h-6 w-6" />
          <h1 className="text-xl font-bold">FingerShorts</h1>
        </div>
        <div className="flex items-center space-x-4">
          <SearchIcon className="h-5 w-5 hover:text-orange-500 cursor-pointer" />
          <button onClick={() => navigate('/create-post')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          <UserIcon className="h-6 w-6 hover:text-orange-500 cursor-pointer" />
        </div>
      </div>

      {/* Shorts Feed */}
      <div className="pt-16 pb-20">
        {shorts.map((short) => (
          <div key={short.id} className="relative h-[calc(100vh-4rem)] w-full">
            {/* Video placeholder */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black flex items-center justify-center">
              <div className="bg-gray-800 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                <span className="text-white text-lg">Video Content {short.id}</span>
              </div>
            </div>

            {/* Bottom Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <div className="flex justify-between items-end">
                {/* User Info and Caption */}
                <div className="pb-16">
                  <p className="font-bold text-lg">{short.username}</p>
                  <p className="text-sm">{short.caption}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col items-center space-y-6 pb-16">
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={() => toggleLike(short.id)}
                      className={`${likedPosts.includes(short.id) ? 'text-red-500' : 'text-white'} hover:scale-110 transition-transform`}
                    >
                      <HeartIcon className={`h-8 w-8 ${likedPosts.includes(short.id) ? 'fill-current' : ''}`} />
                    </button>
                    <span className="text-xs">{short.likes.toLocaleString()}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <ChatBubbleIcon className="h-8 w-8 text-white hover:scale-110 transition-transform" />
                    <span className="text-xs">{short.comments}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <ShareIcon className="h-8 w-8 text-white hover:scale-110 transition-transform" />
                    <span className="text-xs">{short.shares}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <button 
                      onClick={() => toggleBookmark(short.id)}
                      className={`${bookmarkedPosts.includes(short.id) ? 'text-yellow-400' : 'text-white'} hover:scale-110 transition-transform`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill={bookmarkedPosts.includes(short.id) ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-3 flex justify-around">
        <button className="flex flex-col items-center text-orange-500">
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button 
          className="flex flex-col items-center text-gray-400"
          onClick={() => navigate('/search')}
        >
          <SearchIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Search</span>
        </button>
        <button 
          className="flex flex-col items-center text-gray-400"
          onClick={() => navigate('/create-post')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 -mt-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <HeartIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Likes</span>
        </button>
        <button 
          className="flex flex-col items-center text-gray-400"
          onClick={() => navigate('/profile')}
        >
          <UserIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default FingerShortsPage;