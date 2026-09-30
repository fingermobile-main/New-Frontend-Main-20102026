import React, { useState, useEffect, useRef } from 'react';
import messageService, { MessageThread, Message } from '../services/MessageService';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const MessagesPage: React.FC = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Active selected conversation
  const [activeThread, setActiveThread] = useState<MessageThread | null>(null);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  // New Conversation Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newRecipientId, setNewRecipientId] = useState('');
  const [newRecipientMessage, setNewRecipientMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  const fetchConversations = async () => {
    try {
      setError(null);
      const response = await messageService.getConversations();
      if (!isMounted.current) return;
      const list = Array.isArray(response) ? response : (Array.isArray(response?.data) ? response.data : []);
      setThreads(list);
      if (list.length > 0 && !activeThread) {
        selectThread(list[0]);
      }
    } catch (apiError: any) {
      if (!isMounted.current) return;
      console.error('Error fetching conversations:', apiError);
      setError('Unable to load conversations. Please try again.');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const selectThread = async (thread: MessageThread) => {
    setActiveThread(thread);
    try {
      setLoadingMessages(true);
      const res = await messageService.getMessages(thread.id);
      const msgs = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
      setActiveMessages(msgs);
      // Mark as read
      messageService.markAsRead(thread.id).catch(() => {});
      // Decrement unread local count
      setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unreadCount: 0 } : t));
    } catch (err) {
      console.error('Error loading thread messages:', err);
      showToast('Failed to load message history', 'error');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchConversations();
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeThread || sending) return;

    const content = messageText.trim();
    setMessageText('');
    setSending(true);

    try {
      const res = await messageService.sendMessage({
        recipient_id: activeThread.id,
        content
      });

      if (res.success && res.data) {
        setActiveMessages(prev => [...prev, res.data as Message]);
        setThreads(prev => prev.map(t => 
          t.id === activeThread.id 
            ? { ...t, lastMessage: content, updatedAt: new Date().toISOString() } 
            : t
        ));
      } else {
        showToast('Failed to send message', 'error');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      showToast('Error sending message', 'error');
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
        showToast('Message sent successfully!', 'success');
        setShowNewModal(false);
        setNewRecipientId('');
        setNewRecipientMessage('');
        await fetchConversations();
      } else {
        showToast('Failed to start conversation. Check recipient ID.', 'error');
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
      showToast('Error starting conversation', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <MainLayout pageTitle="Messages">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages & Conversations</h1>
            <p className="text-gray-500 mt-1">Direct communication with creators, members, and moderation team.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewModal(true)}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
            >
              + New Message
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={fetchConversations} className="text-sm font-semibold underline">Retry</button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[580px] flex overflow-hidden">
          {/* Thread List Column */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
            <div className="p-3 border-b border-gray-200 bg-white">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Threads ({threads.length})</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : threads.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {threads.map((thread) => {
                    const participant = thread.participants?.[0] || { username: `User ${thread.id}`, name: `User ${thread.id}` };
                    const isSelected = activeThread?.id === thread.id;
                    return (
                      <div
                        key={thread.id}
                        onClick={() => selectThread(thread)}
                        className={`p-4 cursor-pointer flex items-start gap-3 transition-colors ${
                          isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-gray-100/60'
                        }`}
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden border border-gray-200">
                          <img
                            src={thread.avatarUrl || participant.avatar || `https://picsum.photos/seed/user${thread.id}/100/100`}
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {thread.name || participant.name || participant.username || `User ${thread.id}`}
                            </h3>
                            <span className="text-xs text-gray-400">
                              {thread.updatedAt ? new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                          <p className={`text-xs truncate ${thread.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                            {thread.lastMessage || 'No messages yet'}
                          </p>
                        </div>
                        {thread.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">{thread.unreadCount}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <p className="text-sm">No conversations found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Active Chat Panel */}
          <div className="flex-1 flex flex-col bg-white">
            {activeThread ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={activeThread.avatarUrl || activeThread.participants?.[0]?.avatar || `https://picsum.photos/seed/user${activeThread.id}/100/100`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        {activeThread.name || activeThread.participants?.[0]?.name || activeThread.participants?.[0]?.username || `User ${activeThread.id}`}
                      </h2>
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Secure Channel Active
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50/50">
                  {loadingMessages ? (
                    <div className="h-full flex items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  ) : activeMessages.length > 0 ? (
                    activeMessages.map((msg) => {
                      const isMe = String(msg.sender_id || (msg as any).senderId) !== String(activeThread.id);
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[75%] p-3.5 rounded-2xl shadow-sm text-sm ${
                              isMe
                                ? 'bg-blue-600 text-white rounded-br-xs'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-xs'
                            }`}
                          >
                            {msg.subject && (
                              <p className={`text-xs font-semibold mb-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                                {msg.subject}
                              </p>
                            )}
                            <p className="break-words">{msg.content}</p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className={`text-[10px] ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                {msg.sent_at ? new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                              {isMe && (
                                <span className="text-[10px] text-blue-200">
                                  {msg.is_read ? '✓✓' : '✓'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <p className="text-sm">No messages exchanged yet.</p>
                      <p className="text-xs mt-1">Send a message below to start the conversation.</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Write a message..."
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={!messageText.trim() || sending}
                      className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
                    >
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <p className="text-base font-medium text-gray-600">No Conversation Selected</p>
                <p className="text-sm mt-1">Select a conversation from the left to view and send messages.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal for starting new conversation */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Start New Message</h3>
                <button onClick={() => setShowNewModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
              </div>
              <form onSubmit={handleStartNewChat} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Recipient ID or Username</label>
                  <input
                    type="text"
                    required
                    value={newRecipientId}
                    onChange={(e) => setNewRecipientId(e.target.value)}
                    placeholder="Enter user ID (e.g. 1, 4, 5)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Message</label>
                  <textarea
                    required
                    rows={3}
                    value={newRecipientMessage}
                    onChange={(e) => setNewRecipientMessage(e.target.value)}
                    placeholder="Type your message..."
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
                    {sending ? 'Sending...' : 'Send Message'}
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

export default MessagesPage;
