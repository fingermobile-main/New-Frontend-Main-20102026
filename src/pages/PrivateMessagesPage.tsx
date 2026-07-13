import React from 'react';
import { useState } from 'react';
import { useAppContext } from "../contexts/AppContext";
import AnimatedAvatar from '../components/AnimatedAvatar';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
  lastMessage: string;
  timestamp: string;
  unread: number;
  privacyLevel: 'strict' | 'standard' | 'open';
}

const PrivateMessagesPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      avatarUrl: '/avatars/alex.jpg',
      isOnline: true,
      lastMessage: 'Can we schedule a call for tomorrow?',
      timestamp: '10:30 AM',
      unread: 2,
      privacyLevel: 'strict'
    },
    {
      id: '2',
      name: 'Sam Taylor',
      avatarUrl: '/avatars/sam.jpg',
      isOnline: false,
      lastMessage: 'Thanks for the update!',
      timestamp: 'Yesterday',
      unread: 0,
      privacyLevel: 'standard'
    },
    {
      id: '3',
      name: 'Jordan Smith',
      avatarUrl: '/avatars/jordan.jpg',
      isOnline: true,
      lastMessage: 'Did you see the latest report?',
      timestamp: '9:15 AM',
      unread: 1,
      privacyLevel: 'open'
    }
  ];

  const messages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        content: 'Hey, I wanted to discuss the new project proposal',
        timestamp: '10:25 AM',
        isOwn: false,
        status: 'read'
      },
      {
        id: '2',
        content: 'Sure, what time works for you?',
        timestamp: '10:26 AM',
        isOwn: true,
        status: 'read'
      },
      {
        id: '3',
        content: 'How about tomorrow at 2 PM?',
        timestamp: '10:27 AM',
        isOwn: false,
        status: 'read'
      }
    ],
    '2': [
      {
        id: '4',
        content: 'The quarterly report is ready',
        timestamp: '09:15 AM',
        isOwn: false,
        status: 'read'
      },
      {
        id: '5',
        content: 'Thanks, I\'ll review it today',
        timestamp: '09:16 AM',
        isOwn: true,
        status: 'read'
      }
    ],
    '3': [
      {
        id: '6',
        content: 'Have you seen the latest market analysis?',
        timestamp: '8:45 AM',
        isOwn: false,
        status: 'delivered'
      }
    ]
  };

  const currentMessages = messages[activeChat || ''] || [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    // Simulate sending message
    showToast('Message sent securely');
    setNewMessage('');
  };

  const getPrivacyLabel = (level: string) => {
    switch(level) {
      case 'strict': return 'High Security';
      case 'standard': return 'Standard';
      case 'open': return 'Open';
      default: return 'Standard';
    }
  };

  const getPrivacyColor = (level: string) => {
    switch(level) {
      case 'strict': return 'bg-red-100 text-red-800';
      case 'standard': return 'bg-yellow-100 text-yellow-800';
      case 'open': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Private Messages</h1>
              <p className="mt-1 text-sm text-gray-500">
                Encrypted conversations with enhanced privacy controls
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                New Message
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row h-[calc(100vh-200px)]">
          {/* Conversations sidebar */}
          <div className="md:w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search private conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    activeChat === conversation.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setActiveChat(conversation.id)}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <AnimatedAvatar
                        staticUrl={conversation.avatarUrl}
                        animatedUrl={conversation.avatarUrl}
                        altText={conversation.name}
                        className="w-12 h-12 rounded-full"
                      />
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPrivacyColor(conversation.privacyLevel)}`}>
                          {getPrivacyLabel(conversation.privacyLevel)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        {conversation.unread > 0 && (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="md:w-2/3 flex flex-col">
            {activeChat ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <AnimatedAvatar
                          staticUrl={conversations.find(c => c.id === activeChat)?.avatarUrl || ''}
                          animatedUrl={conversations.find(c => c.id === activeChat)?.avatarUrl || ''}
                          altText={conversations.find(c => c.id === activeChat)?.name || ''}
                          className="w-10 h-10 rounded-full"
                        />
                        {conversations.find(c => c.id === activeChat)?.isOnline && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          {conversations.find(c => c.id === activeChat)?.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {conversations.find(c => c.id === activeChat)?.isOnline
                            ? 'Online'
                            : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPrivacyColor(conversations.find(c => c.id === activeChat)?.privacyLevel || 'standard')}`}>
                        {getPrivacyLabel(conversations.find(c => c.id === activeChat)?.privacyLevel || 'standard')}
                      </span>
                      <button className="text-gray-500 hover:text-gray-700" aria-label="Button"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  <div className="space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                            message.isOwn
                              ? 'bg-blue-500 text-white'
                              : 'bg-white border border-gray-200 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className={`text-xs ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                              {message.timestamp}
                            </p>
                            
                            {/* Message status indicator */}
                            {message.isOwn && (
                              <div className="ml-2">
                                {message.status === 'sent' && (
                                  <span className="text-xs text-gray-500">✓</span>
                                )}
                                {message.status === 'delivered' && (
                                  <span className="text-xs text-gray-500">✓✓</span>
                                )}
                                {message.status === 'read' && (
                                  <span className="text-xs text-blue-500">✓✓</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a secure message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm lg:text-base"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 sm:text-sm lg:text-base"
                    >
                      Send Securely
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900 sm:text-base lg:text-xl">
                    Enhanced Privacy Messaging
                  </h3>
                  <p className="mt-1 text-gray-500 sm:text-sm lg:text-base">
                    Select a conversation to send a secure, encrypted message
                  </p>
                  <div className="mt-4 flex flex-col items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      <span className="ml-2">End-to-end encrypted</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span>Private conversations</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateMessagesPage;