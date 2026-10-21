/**
 * LushChatPanel
 * In-App Real-Time Chat System for Lush Pressies.
 * Displays active conversations and message thread with optimistic updates,
 * rate limit enforcement (3 first messages in 72h), typing indicators, and media sharing.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useLushChat } from '../hooks/useLushChat';
import {
  MessageSquare,
  Send,
  Image as ImageIcon,
  ShieldCheck,
  Lock,
  Clock,
  User,
  Sparkles,
  AlertCircle,
  MoreVertical,
  CheckCheck,
  Check,
  Search
} from 'lucide-react';

interface LushChatPanelProps {
  initialConversationId?: string;
  onClose?: () => void;
}

export const LushChatPanel: React.FC<LushChatPanelProps> = ({
  initialConversationId,
  onClose
}) => {
  const {
    conversations,
    activeConversation,
    messages,
    loadingConversations,
    loadingMessages,
    typingUsers,
    selectConversation,
    sendMessage,
    sendTyping
  } = useLushChat(initialConversationId);

  const [inputBody, setInputBody] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputBody.trim() && !mediaUrlInput.trim()) return;

    const mediaUrls = mediaUrlInput.trim() ? [mediaUrlInput.trim()] : undefined;
    const body = inputBody;

    setInputBody('');
    setMediaUrlInput('');
    setShowMediaModal(false);

    await sendMessage(body, mediaUrls);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputBody(e.target.value);
    sendTyping(e.target.value.length > 0);
  };

  const filteredConversations = conversations.filter(c =>
    c.partner_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row bg-white rounded-2xl border border-emerald-100 shadow-xl overflow-hidden h-[650px] w-full">
      {/* Left Sidebar: Conversations List */}
      <div className={`w-full lg:w-80 border-r border-emerald-100 flex flex-col bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/20 ${activeConversation ? 'hidden lg:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Lush Conversations</h3>
              <p className="text-[10px] text-emerald-700 font-semibold">Matched & Verified Connections</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-slate-700 hover:text-gray-600 text-xs font-bold px-2 py-1 rounded-lg hover:bg-gray-100">
              ✕
            </button>
          )}
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-700 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search matches..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 font-bold border-slate-300 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-emerald-50">
          {loadingConversations ? (
            <div className="p-8 text-center text-xs text-slate-700 animate-pulse">Loading matches...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-700">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-emerald-400 opacity-60" />
              No active conversations yet. Match with someone to start chatting!
            </div>
          ) : (
            filteredConversations.map(c => {
              const isSelected = activeConversation?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => selectConversation(c.id)}
                  className={`w-full p-3 flex items-center gap-3 text-left transition-colors ${
                    isSelected ? 'bg-emerald-100/70 border-l-4 border-emerald-600' : 'hover:bg-emerald-50/60'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={c.partner_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={c.partner_name}
                      className="w-10 h-10 rounded-full object-cover border border-emerald-200"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 truncate flex items-center gap-1">
                        {c.partner_name}
                        <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                      </span>
                      {c.last_message_at && (
                        <span className="text-[10px] text-slate-700">
                          {new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium truncate mt-0.5">
                      {c.last_message || 'PIN Exchanged! Say hello...'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Thread Area */}
      <div className={`flex-1 flex flex-col bg-gray-50/50 ${!activeConversation ? 'hidden lg:flex' : 'flex'}`}>
        {activeConversation ? (
          <>
            {/* Thread Header */}
            <div className="p-3 bg-white border-b border-emerald-100 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => selectConversation('')}
                  className="lg:hidden p-1 text-slate-700 hover:text-emerald-700"
                >
                  ←
                </button>
                <img
                  src={activeConversation.partner_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={activeConversation.partner_name}
                  className="w-9 h-9 rounded-full object-cover border border-emerald-300"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    {activeConversation.partner_name}
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold text-[9px] font-semibold font-black">
                      PIN Verified
                    </span>
                  </h4>
                  <p className="text-[10px] text-slate-700">
                    {typingUsers[activeConversation.id] ? (
                      <span className="text-emerald-600 font-medium italic animate-pulse">Typing...</span>
                    ) : (
                      'Active now'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-400 text-amber-950 text-[10px] font-medium   font-black">
                  <Clock className="w-3 h-3 text-amber-600" />
                  72h Rate Limit Protected
                </div>
              </div>
            </div>

            {/* Messages Scroll View */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {loadingMessages ? (
                <div className="text-center py-12 text-xs text-slate-700">Loading conversation history...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold mx-auto flex items-center justify-center font-black">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-gray-800">Start the conversation</p>
                  <p className="text-[11px] text-slate-700 max-w-xs mx-auto">
                    You matched and verified PIN exchange! Send a friendlylapidaire or a compliment.
                  </p>
                </div>
              ) : (
                messages.map(m => {
                  const isMe = m.sender_id === activeConversation.my_user_id;

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-2xs ${
                          isMe
                            ? 'bg-emerald-600 text-white rounded-br-none'
                            : 'bg-white text-gray-900 border border-emerald-100 rounded-bl-none'
                        }`}
                      >
                        {/* Media attachments */}
                        {m.media_urls && m.media_urls.length > 0 && (
                          <div className="mb-2 rounded-lg overflow-hidden border border-black/10">
                            {m.media_urls.map((url, idx) => (
                              <img key={idx} src={url} alt="Attachment" className="max-h-48 w-full object-cover" />
                            ))}
                          </div>
                        )}
                        <p className="leading-relaxed whitespace-pre-wrap">{m.body}</p>

                        <div className={`flex items-center gap-1 justify-end text-[9px] mt-1 ${isMe ? 'text-emerald-200' : 'text-slate-600 font-medium'}`}>
                          <span>
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && (
                            m.is_read ? <CheckCheck className="w-3 h-3 text-emerald-200" /> : <Check className="w-3 h-3 opacity-70" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Media URL Input Modal */}
            {showMediaModal && (
              <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <input
                  type="url"
                  placeholder="Paste image/media URL..."
                  value={mediaUrlInput}
                  onChange={e => setMediaUrlInput(e.target.value)}
                  className="flex-1 px-3 py-1 text-xs rounded-lg border border-emerald-300 bg-white text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowMediaModal(false)}
                  className="text-xs text-slate-700 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-emerald-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMediaModal(!showMediaModal)}
                className={`p-2 rounded-xl text-slate-700 hover:bg-emerald-50 transition-colors ${
                  showMediaModal || mediaUrlInput ? 'text-emerald-600 bg-emerald-100' : ''
                }`}
                title="Attach image/media"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder="Type a message..."
                value={inputBody}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 text-xs rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900 font-bold border-slate-300 placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={!inputBody.trim() && !mediaUrlInput.trim()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-medium shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-700 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold flex items-center justify-center font-black">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-800">Select a Conversation</h4>
              <p className="text-xs text-slate-700 mt-1 max-w-sm">
                Choose a matched connection from the left list to send messages, exchangelapidaires, or send gifts.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LushChatPanel;
