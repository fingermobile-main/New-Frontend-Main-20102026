import React, { useState, useEffect } from 'react';
import { HeartIcon, ChatBubbleIcon, ShareIcon, HomeIcon, UserIcon, PaperAirplaneIcon } from '../icons';
import { SearchIcon } from '../icons';

const LiveStreamingPage: React.FC = () => {
  const [chats, setChats] = useState([
    { id: 1, user: 'Alice', message: 'Great stream!', timestamp: '2s ago' },
    { id: 2, user: 'Bob', message: 'Love this content', timestamp: '5s ago' },
    { id: 3, user: 'Charlie', message: 'Can you show us more?', timestamp: '8s ago' },
  ]);
  const [newChat, setNewChat] = useState('');
  const [liveStreams, setLiveStreams] = useState([
    { id: 1, title: 'Gaming Session', viewers: 1200, category: 'Gaming', host: 'GamerPro' },
    { id: 2, title: 'Cooking Tutorial', viewers: 850, category: 'Food', host: 'ChefMaster' },
    { id: 3, title: 'Music Performance', viewers: 3200, category: 'Music', host: 'IndieBand' },
    { id: 4, title: 'Tech Talk', viewers: 560, category: 'Technology', host: 'TechGuru' },
  ]);

  const [activeTab, setActiveTab] = useState<'following' | 'recommended'>('following');
  const [selectedStream, setSelectedStream] = useState<any>(null);

  useEffect(() => {
    // Simulate incoming chat messages
    const interval = setInterval(() => {
      const users = ['Viewer1', 'Viewer2', 'NewUser', 'Fan123'];
      const messages = [
        'Amazing stream!',
        'Can you show us more?',
        'Love the content!',
        'Keep it up!',
        'So informative!'
      ];
      
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      const newMessage = {
        id: chats.length + 1,
        user: randomUser,
        message: randomMessage,
        timestamp: 'just now'
      };
      
      setChats(prev => [...prev.slice(-4), newMessage]);
    }, 5000);

    return () => clearInterval(interval);
  }, [chats.length]);

  const handleSendChat = () => {
    if (newChat.trim() === '') return;
    
    const message = {
      id: chats.length + 1,
      user: 'Me',
      message: newChat,
      timestamp: 'just now'
    };
    
    setChats([...chats, message]);
    setNewChat('');
  };

  if (selectedStream) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Stream Header */}
        <div className="fixed top-0 left-0 right-0 z-10 bg-black bg-opacity-80 backdrop-blur-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-500 text-sm">LIVE</span>
            <h1 className="text-lg font-bold truncate max-w-[50%]">{selectedStream.title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setSelectedStream(null)} className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stream Content */}
        <div className="pt-16 pb-20 flex flex-col md:flex-row">
          <div className="md:w-2/3">
            <div className="relative pt-[56.25%] bg-gray-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-gray-800 border-2 border-dashed rounded-xl w-full h-64 md:h-96 flex items-center justify-center">
                    <span className="text-white text-lg">Live Stream Content</span>
                  </div>
                  <p className="mt-2 text-gray-400">{selectedStream.viewers.toLocaleString()} viewers</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">{selectedStream.title}</h2>
                  <p className="text-gray-400">Hosted by {selectedStream.host}</p>
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Follow
                </button>
              </div>
              
              <p className="text-gray-300">Join in on this amazing live session. Interact with the host and other viewers!</p>
            </div>
          </div>

          {/* Chat Section */}
          <div className="md:w-1/3 p-4 bg-gray-900">
            <h3 className="font-bold mb-3">Live Chat</h3>
            
            <div className="bg-gray-800 rounded-lg p-3 h-96 overflow-y-auto mb-3">
              {chats.map(chat => (
                <div key={chat.id} className="mb-2">
                  <span className="text-orange-500 font-medium">{chat.user}</span>: 
                  <span className="ml-2">{chat.message}</span>
                  <span className="text-gray-500 text-xs float-right">{chat.timestamp}</span>
                </div>
              ))}
            </div>
            
            <div className="flex">
              <input
                type="text"
                value={newChat}
                onChange={(e) => setNewChat(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 text-white rounded-l-lg px-3 py-2 focus:outline-none"
              />
              <button 
                onClick={handleSendChat}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-lg"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900 bg-opacity-90 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Live Streams</h1>
          <div className="flex space-x-2">
            <button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search streams..."
            className="w-full bg-gray-800 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mx-4">
        <button 
          className={`flex-1 py-3 font-medium text-center ${activeTab === 'following' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('following')}
        >
          Following
        </button>
        <button 
          className={`flex-1 py-3 font-medium text-center ${activeTab === 'recommended' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('recommended')}
        >
          Recommended
        </button>
      </div>

      {/* Live Streams */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {liveStreams.map(stream => (
            <div 
              key={stream.id} 
              className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-700 transition-all"
              onClick={() => setSelectedStream(stream)}
            >
              <div className="relative">
                <div className="bg-gray-700 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold mb-2">
                      <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                      LIVE
                    </div>
                    <div className="bg-gray-600 border-2 border-dashed rounded-xl w-full h-32 flex items-center justify-center">
                      <span className="text-gray-400">Stream Preview</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                  {stream.viewers.toLocaleString()}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold truncate">{stream.title}</h3>
                <p className="text-gray-400 text-sm truncate">{stream.host}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-orange-500 text-xs bg-orange-500/10 px-2 py-1 rounded">{stream.category}</span>
                  <div className="flex items-center text-gray-400 text-xs">
                    <HeartIcon className="h-4 w-4 mr-1" />
                    {Math.floor(stream.viewers / 10).toLocaleString()}+
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveStreamingPage;