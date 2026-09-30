import React, { useState, useEffect } from 'react';
import { ChatBubbleLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface EnhancedMessagingProps {
  userId?: string;
  conversationId?: string;
}

const EnhancedMessaging: React.FC<EnhancedMessagingProps> = ({ userId, conversationId }) => {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [newMessage, setNewMessage] = React.useState('');

  React.useEffect(() => {
    setMessages([
      { id: '1', sender: 'Alice', content: 'Hey! How are you?', timestamp: '10:30 AM', isOwn: false },
      { id: '2', sender: 'You', content: 'I\'m doing great! Working on the new project.', timestamp: '10:32 AM', isOwn: true },
      { id: '3', sender: 'Alice', content: 'That sounds exciting! Need any help?', timestamp: '10:35 AM', isOwn: false },
      { id: '4', sender: 'You', content: 'Actually, yes. Could you review the code?', timestamp: '10:37 AM', isOwn: true }
    ]);
  }, [conversationId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: String(messages.length + 1),
      sender: 'You',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
        <ChatBubbleLeftIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Messages</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
              message.isOwn
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}>
              {!message.isOwn && <p className="text-xs font-medium mb-1 opacity-75">{message.sender}</p>}
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMessaging;
