import React, { useEffect, useState } from 'react';
import FingerMobileEmojiPicker from './common/FingerMobileEmojiPicker';
import FingerMobileEmojiImage from './common/FingerMobileEmojiImage';
import { emojiPackService, FingerMobileEmojiItem } from '../services/emojiPackService';

interface LiveChatProps {
  roomId?: string;
  userId?: string;
  userName?: string;
  onSendMessage?: (message: string) => void;
}

const renderMessageWithBrandEmojis = (text: string) => {
  const parts = text.split(/(:[a-z0-9-]+:)/g);
  return parts.map((part, index) => {
    if (part.startsWith(':') && part.endsWith(':')) {
      const slug = part.slice(1, -1);
      const isKnown = emojiPackService.getAllEmojis().some((e) => e.slug === slug);
      if (isKnown) {
        return (
          <span key={index} className="inline-flex align-middle mx-0.5">
            <FingerMobileEmojiImage slug={slug} size="sm" showTooltip />
          </span>
        );
      }
    }
    return <span key={index}>{part}</span>;
  });
};

const LiveChat: React.FC<LiveChatProps> = ({
  roomId = 'general',
  userId = 'user123',
  userName = 'User',
  onSendMessage
}) => {
  const [messages, setMessages] = useState<any[]>([
    { id: 1, user: 'Alice', text: 'Hey everyone! :thumbs-up:', timestamp: new Date(Date.now() - 300000), color: '#FF6B6B' },
    { id: 2, user: 'Bob', text: 'Hi Alice! How are you enjoying FingerMobile?', timestamp: new Date(Date.now() - 240000), color: '#4ECDC4' },
    { id: 3, user: 'Charlie', text: 'Great living room stream today! :headphones-music:', timestamp: new Date(Date.now() - 180000), color: '#95E1D3' },
    { id: 4, user: 'Diana', text: 'Celebrated with gems! :star-eyes:', timestamp: new Date(Date.now() - 120000), color: '#F38181' },
    { id: 5, user: 'Eve', text: 'Love the 5D mint brand vibes! :crown-royalty:', timestamp: new Date(Date.now() - 60000), color: '#AA96DA' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      user: userName,
      text: newMessage,
      timestamp: new Date(),
      color: '#667eea'
    };

    setMessages(prev => [...prev, message]);

    if (onSendMessage) {
      onSendMessage(newMessage);
    }

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectBrandEmoji = (emoji: FingerMobileEmojiItem) => {
    setNewMessage(prev => (prev ? `${prev} :${emoji.slug}: ` : `:${emoji.slug}: `));
    setIsEmojiPickerOpen(false);
  };


  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const scrollToBottom = () => {
    // Auto-scroll to bottom when new messages arrive
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="bg-white border border-slate-300 rounded-lg overflow-hidden flex flex-col h-full max-h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white text-xl">💬</span>
          <h3 className="font-semibold text-white">Live Chat</h3>
          <span className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs text-slate-700">
            {messages.length} online
          </span>
        </div>
        <button type="button" aria-label="Chat settings" onClick={() => setShowSettings(!showSettings)} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
          ⚙️
        </button>
      </div>

      {/* Messages Area */}
      <div
        id="chat-messages"
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
        style={{ maxHeight: '400px' }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-2 animate-fade-in">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: msg.color }}
            >
              {msg.user.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm" style={{ color: msg.color }}>
                  {msg.user}
                </span>
                <span className="text-xs text-slate-700">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="text-sm text-slate-900 break-words flex flex-wrap items-center gap-1 font-medium">
                {renderMessageWithBrandEmojis(msg.text)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Official FingerMobile 5D Emoji Picker Popover */}
      {isEmojiPickerOpen && (
        <div className="p-2 bg-emerald-50/50 border-t border-emerald-300 flex justify-center">
          <FingerMobileEmojiPicker
            isOpen={isEmojiPickerOpen}
            onClose={() => setIsEmojiPickerOpen(false)}
            onSelectEmoji={handleSelectBrandEmoji}
            title="FingerMobile™ Chat Emojis"
          />
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-slate-300 p-3 bg-white">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            title="Insert FingerMobile 5D Brand Emoji"
            className="p-1.5 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-300 flex items-center justify-center cursor-pointer active:scale-95"
          >
            <FingerMobileEmojiImage slug="thumbs-up" size="md" />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message or use FingerMobile 5D emojis..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
          />

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
