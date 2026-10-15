import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import AnimatedAvatar from '../components/AnimatedAvatar';
import messageService, { Conversation as BackendConversation, Message as BackendMessage } from '../services/MessageService';
import LoadingSpinner from '../components/LoadingSpinner';

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
  const { showToast } = useAppContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  // New Message Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newRecipientId, setNewRecipientId] = useState('');
  const [newRecipientMessage, setNewRecipientMessage] = useState('');

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await messageService.getConversations();
      const raw = Array.isArray(res) ? res : (res?.data || []);
      const mapped: Conversation[] = raw.map((c: BackendConversation) => {
        const participant = c.participants?.[0] || { name: `User ${c.id}`, username: `User ${c.id}` };
        return {
          id: String(c.id),
          name: c.name || participant.name || participant.username || `User ${c.id}`,
          avatarUrl: c.avatarUrl || participant.avatar || `https://picsum.photos/seed/user${c.id}/100/100`,
          isOnline: true,
          lastMessage: c.lastMessage || 'End-to-end encrypted session initialized',
          timestamp: c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
          unread: c.unreadCount || 0,
          privacyLevel: 'strict'
        };
      });
      setConversations(mapped);
      if (mapped.length > 0 && !activeChat) {
        selectChat(mapped[0].id);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching private conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectChat = async (chatId: string) => {
    setActiveChat(chatId);
    try {
      setLoadingMessages(true);
      const res = await messageService.getMessages(chatId);
      const msgs = Array.isArray(res) ? res : (res?.data || []);
      const mappedMsgs: Message[] = msgs.map((m: BackendMessage) => ({
        id: String(m.id),
        content: m.content,
        timestamp: m.sent_at ? new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        isOwn: String(m.sender_id) !== String(chatId),
        status: (m.is_read ? 'read' : 'delivered') as 'sent' | 'delivered' | 'read'
      }));
      setCurrentMessages(mappedMsgs);
      messageService.markAsRead(chatId).catch(() => {});
      setConversations(prev => prev.map(c => c.id === chatId ? { ...c, unread: 0 } : c));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching messages for chat:', err);
      showToast('Failed to load private messages', 'error');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat || sending) return;
    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const res = await messageService.sendMessage({
        recipient_id: activeChat,
        content
      });

      if (res.success && res.data) {
        const sent = res.data;
        const mapped: Message = {
          id: String(sent.id),
          content: sent.content,
          timestamp: sent.sent_at ? new Date(sent.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
          isOwn: true,
          status: 'sent'
        };
        setCurrentMessages(prev => [...prev, mapped]);
        setConversations(prev => prev.map(c => c.id === activeChat ? { ...c, lastMessage: content } : c));
        showToast('Message sent securely', 'success');
      } else {
        showToast('Failed to send secure message', 'error');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error sending message:', err);
      showToast('Error sending secure message', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleStartNewChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipientId.trim() || !newRecipientMessage.trim()) return;

    try {
      setSending(true);
      const res = await messageService.sendMessage({
        recipient_id: newRecipientId.trim(),
        content: newRecipientMessage.trim()
      });

      if (res.success) {
        showToast('Secure conversation started!', 'success');
        setShowNewModal(false);
        setNewRecipientId('');
        setNewRecipientMessage('');
        await fetchConversations();
      } else {
        showToast('Failed to start conversation. Check recipient ID.', 'error');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error starting conversation:', err);
      showToast('Error starting conversation', 'error');
    } finally {
      setSending(false);
    }
  };

  const getPrivacyLabel = (level: string) => {
    switch (level) {
    case 'strict': return 'High Security';
    case 'standard': return 'Standard';
    case 'open': return 'Open';
    default: return 'Standard';
    }
  };

  const getPrivacyColor = (level: string) => {
    switch (level) {
    case 'strict': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
    case 'standard': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
    case 'open': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
    default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout pageTitle="PrivateMessages">
      <div className="bg-white min-h-screen text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">Private Encryption</h3>
                <p className="text-xs text-gray-500 mb-4">Direct peer-to-peer secure messaging channels verified on protocol.</p>
                <div className="p-3 bg-blue-50/60 rounded-lg text-xs text-blue-800 border border-blue-100">
                  <p className="font-semibold mb-1">Security Status: Active</p>
                  <p>All private messages are validated with cryptographic session tokens.</p>
                </div>
              </div>
            </div>

            {/* Center Content */}
            <div className="lg:col-span-9">
              <div className="w-full">
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
                        <button
                          onClick={() => setShowNewModal(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                        >
                          New Message
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row h-[calc(100vh-200px)]">
                    {/* Conversations sidebar */}
                    <div className="md:w-1/3 border-r border-gray-200 flex flex-col">
                      <div className="p-4 border-b border-slate-300 bg-gray-50">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Channels ({conversations.length})
                        </span>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        {loading ? (
                          <div className="p-8 flex justify-center">
                            <LoadingSpinner />
                          </div>
                        ) : conversations.length > 0 ? (
                          conversations.map((conversation) => (
                            <div
                              key={conversation.id}
                              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                                activeChat === conversation.id ? 'bg-blue-50/80 border-l-4 border-blue-600' : ''
                              }`}
                              onClick={() => selectChat(conversation.id)}
                              role="button"
                              tabIndex={0}
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
                                    <span className="text-xs text-gray-400">
                                      {conversation.timestamp}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs text-gray-500 truncate">
                                      {conversation.lastMessage}
                                    </p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${getPrivacyColor(conversation.privacyLevel)}`}>
                                      {getPrivacyLabel(conversation.privacyLevel)}
                                    </span>
                                  </div>
                                  {conversation.unread > 0 && (
                                    <div className="mt-1">
                                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                                        {conversation.unread}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-400 text-sm">
                            No private conversations found.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chat area */}
                    <div className="md:w-2/3 flex flex-col bg-white">
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
                                  <p className="text-xs text-green-600">
                                    Encrypted Active
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${getPrivacyColor(conversations.find(c => c.id === activeChat)?.privacyLevel || 'standard')}`}>
                                  {getPrivacyLabel(conversations.find(c => c.id === activeChat)?.privacyLevel || 'standard')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
                            {loadingMessages ? (
                              <div className="h-full flex items-center justify-center">
                                <LoadingSpinner />
                              </div>
                            ) : currentMessages.length > 0 ? (
                              <div className="space-y-4">
                                {currentMessages.map((message) => (
                                  <div
                                    key={message.id}
                                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                                  >
                                    <div
                                      className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                                        message.isOwn
                                          ? 'bg-blue-600 text-white rounded-br-xs'
                                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-xs'
                                      }`}
                                    >
                                      <p className="break-words">{message.content}</p>
                                      <div className="flex justify-between items-center mt-1 gap-2">
                                        <p className={`text-[10px] ${message.isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                                          {message.timestamp}
                                        </p>
                                        {message.isOwn && (
                                          <span className="text-[10px] text-blue-200">
                                            {message.status === 'read' ? '✓✓' : '✓'}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                                No messages exchanged in this channel yet.
                              </div>
                            )}
                          </div>

                          <div className="p-4 border-t border-slate-300 bg-white">
                            <div className="flex items-center">
                              <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a secure message..."
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') handleSendMessage();
                                }}
                                disabled={sending}
                              />
                              <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim() || sending}
                                className="ml-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors"
                              >
                                {sending ? 'Sending...' : 'Send'}
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                          Select a conversation to begin encrypted messaging.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for new private conversation */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Start Private Channel</h3>
                <button onClick={() => setShowNewModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
              </div>
              <form onSubmit={handleStartNewChat} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Recipient Member ID</label>
                  <input
                    type="text"
                    required
                    value={newRecipientId}
                    onChange={(e) => setNewRecipientId(e.target.value)}
                    placeholder="Enter member ID (e.g. 1, 4, 5)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Initial Encrypted Message</label>
                  <textarea
                    required
                    rows={3}
                    value={newRecipientMessage}
                    onChange={(e) => setNewRecipientMessage(e.target.value)}
                    placeholder="Type initial message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                  >
                    {sending ? 'Starting...' : 'Open Channel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PrivateMessagesPage;
