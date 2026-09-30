import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { CHAT_CONTACTS } from '../../../constants';
import type { ChatContact } from '../../../types';
import AnimatedAvatar from '../../../components/AnimatedAvatar';
import messageService, { Message as BackendMessage } from '../../../services/MessageService';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface DisplayMessage {
  id: string;
  sender: 'me' | 'other';
  text: string;
  timestamp?: string;
  isRead?: boolean;
}

const InboxPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [contacts, setContacts] = useState<ChatContact[]>(CHAT_CONTACTS as ChatContact[]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [activeMessages, setActiveMessages] = useState<DisplayMessage[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New message modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newRecipientId, setNewRecipientId] = useState('');
  const [newRecipientMessage, setNewRecipientMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      setLoadingContacts(true);
      const res = await messageService.getConversations();
      const raw = Array.isArray(res) ? res : (res?.data || []);
      if (raw.length > 0) {
        const liveContacts: ChatContact[] = raw.map((c: any) => {
          const participant = c.participants?.[0] || { name: `User ${c.id}`, username: `User ${c.id}` };
          return {
            id: String(c.id),
            name: c.name || participant.name || participant.username || `User ${c.id}`,
            avatarUrl: c.avatarUrl || participant.avatar || `https://picsum.photos/seed/user${c.id}/100/100`,
            lastMessage: c.lastMessage || 'Direct channel opened',
            lastMessageTime: c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now',
            unreadCount: c.unreadCount || 0,
            isOnline: true
          };
        });
        setContacts(liveContacts);
        if (!selectedContact && liveContacts.length > 0) {
          selectContact(liveContacts[0]);
        }
      } else if (!selectedContact && CHAT_CONTACTS.length > 0) {
        setSelectedContact(CHAT_CONTACTS[0] as ChatContact);
      }
    } catch (err) {
      console.warn('Failed to load conversations from backend, using default contacts:', err);
      if (!selectedContact && CHAT_CONTACTS.length > 0) {
        setSelectedContact(CHAT_CONTACTS[0] as ChatContact);
      }
    } finally {
      setLoadingContacts(false);
    }
  };

  const selectContact = async (contact: ChatContact) => {
    setSelectedContact(contact);
    try {
      setLoadingMessages(true);
      const res = await messageService.getMessages(contact.id);
      const rawMsgs = Array.isArray(res) ? res : (res?.data || []);
      const mapped: DisplayMessage[] = rawMsgs.map((m: BackendMessage) => ({
        id: String(m.id),
        sender: String(m.sender_id) === String(contact.id) ? 'other' : 'me',
        text: m.content,
        timestamp: m.sent_at ? new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        isRead: m.is_read
      }));
      setActiveMessages(mapped);
      messageService.markAsRead(contact.id).catch(() => {});
      setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, unreadCount: 0 } : c));
    } catch (err) {
      console.warn('Failed to fetch messages for contact:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact || sending) return;

    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const res = await messageService.sendMessage({
        recipient_id: selectedContact.id,
        content
      });

      if (res.success && res.data) {
        const sentMsg: DisplayMessage = {
          id: String(res.data.id || Date.now()),
          sender: 'me',
          text: content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false
        };
        setActiveMessages(prev => [...prev, sentMsg]);
        setContacts(prev => prev.map(c => c.id === selectedContact.id ? { ...c, lastMessage: content } : c));
      } else {
        showToast('Failed to deliver message', 'error');
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

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ChatBubble: React.FC<{ message: DisplayMessage }> = ({ message }) => (
    <div
      className={`flex items-end gap-2 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
    >
      {message.sender === 'other' && selectedContact && (
        <AnimatedAvatar
          staticUrl={selectedContact.avatarUrl}
          animatedUrl={selectedContact.animatedAvatarUrl}
          altText={selectedContact.name}
          className="w-8 h-8 rounded-full border border-gray-200"
        />
      )}
      <div
        className={`max-w-md p-3.5 rounded-2xl shadow-sm text-sm ${
          message.sender === 'me'
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="break-words">{message.text}</p>
        {message.timestamp && (
          <p className={`text-[10px] mt-1 text-right ${message.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
            {message.timestamp}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
            Engagement Inbox
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage all incoming member messages, creator inquiries, and support threads.</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
        >
          + New Message
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex h-[calc(100vh-230px)] overflow-hidden">
        {/* Contact List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50/50">
          <div className="p-3 border-b border-gray-200 bg-white">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingContacts ? (
              <div className="p-8 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => selectContact(contact)}
                  className={`w-full text-left flex items-center gap-3 p-3.5 border-b border-gray-100 transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-blue-50/80 border-l-4 border-l-blue-600' : 'hover:bg-gray-100/60'
                  }`}
                >
                  <AnimatedAvatar
                    staticUrl={contact.avatarUrl}
                    animatedUrl={contact.animatedAvatarUrl}
                    altText={contact.name}
                    className="w-10 h-10 rounded-full border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className="font-semibold text-sm text-gray-900 truncate">
                        {contact.name}
                      </p>
                      <span className="text-[10px] text-gray-400">
                        {contact.lastMessageTime || ''}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {contact.lastMessage || 'Conversation thread'}
                    </p>
                  </div>
                  {Number(contact.unreadCount) > 0 && (
                    <span className="ml-2 flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {contact.unreadCount}
                    </span>
                  )}
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No matching conversations found.
              </div>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="w-2/3 flex flex-col bg-white">
          {selectedContact ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <AnimatedAvatar
                    staticUrl={selectedContact.avatarUrl}
                    animatedUrl={selectedContact.animatedAvatarUrl}
                    altText={selectedContact.name}
                    className="w-10 h-10 rounded-full border border-gray-200"
                  />
                  <div>
                    <h2 className="font-bold text-gray-900 sm:text-base lg:text-lg">
                      {selectedContact.name}
                    </h2>
                    <p className="text-xs text-gray-400">
                      Member ID: {selectedContact.id} • Live Connection Active
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50/50">
                {loadingMessages ? (
                  <div className="h-full flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : activeMessages.length > 0 ? (
                  activeMessages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                    <p>No messages exchanged with {selectedContact.name} yet.</p>
                    <p className="text-xs mt-1">Send a reply below to start the conversation.</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSend} className="relative flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors"
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a conversation to view messages.
            </div>
          )}
        </div>
      </div>

      {/* Modal for new message */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Start Member Message</h3>
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">Message Content</label>
                <textarea
                  required
                  rows={3}
                  value={newRecipientMessage}
                  onChange={(e) => setNewRecipientMessage(e.target.value)}
                  placeholder="Type message content..."
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
  );
};

export default InboxPage;
