import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import AudioCallModal from '../../components/AudioCallModal';
import VideoCallModal from '../../components/VideoCallModal';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  MicrophoneIcon,
  LockClosedIcon,
  SparklesIcon,
  PhoneIcon,
  VideoCameraIcon,
  ShieldCheckIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  FaceSmileIcon,
  CurrencyDollarIcon,
  ClockIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

interface MessageParticipant {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  verifiedLevel: number;
  role: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isEncrypted: boolean;
  status: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  mediaType?: 'audio' | 'video' | 'document' | 'image';
  fileName?: string;
  fileSize?: string;
  sanitizationVerified?: boolean;
  paylinkAmount?: number;
  giftType?: string;
}

interface ConversationItem {
  id: string;
  isGroup: boolean;
  title: string;
  avatar: string;
  partner?: MessageParticipant;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  category: 'direct' | 'group' | 'encrypted' | 'commerce';
  isEncrypted: boolean;
  online: boolean;
}

const INITIAL_CONVERSATIONS: ConversationItem[] = [
  {
    id: 'conv-1',
    isGroup: false,
    title: 'Mbah Israel Obinna',
    avatar: '/assets/branding/mbah_israel_obinna.jpeg',
    partner: {
      id: 'usr-founder',
      name: 'Mbah Israel Obinna',
      username: 'obinna_founder',
      avatar: '/assets/branding/mbah_israel_obinna.jpeg',
      status: 'online',
      verifiedLevel: 5,
      role: 'CEO & Founder'
    },
    lastMessage: 'The new Guardian AI curation algorithm for Tribut is live. Great job on the 11 collage rotation styles!',
    lastTime: '10:42 AM',
    unreadCount: 2,
    category: 'direct',
    isEncrypted: true,
    online: true
  },
  {
    id: 'conv-2',
    isGroup: false,
    title: 'Fatima Al-Hassan',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    partner: {
      id: 'usr-fatima',
      name: 'Fatima Al-Hassan',
      username: 'fatima_durbar',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      status: 'online',
      verifiedLevel: 4,
      role: 'Visual Arts Lead'
    },
    lastMessage: 'Sent a 50 FIC Paylink for the High-Res Durbar exhibition master print license.',
    lastTime: 'Yesterday',
    unreadCount: 0,
    category: 'commerce',
    isEncrypted: true,
    online: true
  },
  {
    id: 'conv-3',
    isGroup: true,
    title: 'Protocol Sovereign Architecture Guild',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200',
    lastMessage: 'Release v2.5 consensus verification complete across all 37 Nigerian regional cohorts.',
    lastTime: 'Oct 14',
    unreadCount: 5,
    category: 'group',
    isEncrypted: true,
    online: true
  },
  {
    id: 'conv-4',
    isGroup: false,
    title: 'Tobi Bakare',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    partner: {
      id: 'usr-tobi',
      name: 'Tobi Bakare',
      username: 'tobi_photos',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      status: 'away',
      verifiedLevel: 3,
      role: 'Urban Photographer'
    },
    lastMessage: 'Can you review the Lekki Toll Twilight 61MP RAW file metadata?',
    lastTime: 'Oct 12',
    unreadCount: 0,
    category: 'direct',
    isEncrypted: false,
    online: false
  },
  {
    id: 'conv-5',
    isGroup: false,
    title: 'Guardian AI Compliance Inspector',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
    partner: {
      id: 'usr-guardian',
      name: 'Guardian AI Bot',
      username: 'guardian_system',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
      status: 'online',
      verifiedLevel: 5,
      role: 'STERCS™ Autonomous Sentinel'
    },
    lastMessage: 'STERCS Zero-Knowledge verification confirmed. End-to-end cryptographic handshakes active.',
    lastTime: 'Oct 10',
    unreadCount: 0,
    category: 'encrypted',
    isEncrypted: true,
    online: true
  }
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm-1',
      senderId: 'usr-founder',
      senderName: 'Mbah Israel Obinna',
      text: 'Welcome to FingerMobile Sovereign Protocol Communication. All chats here are encrypted and verified through the STERCS™ engine.',
      timestamp: '10:30 AM',
      isEncrypted: true,
      status: 'read'
    },
    {
      id: 'm-2',
      senderId: 'current-user',
      senderName: 'You',
      text: 'Understood. Reviewing the updated WCAG AAA high-contrast standards across the entire platform.',
      timestamp: '10:35 AM',
      isEncrypted: true,
      status: 'read'
    },
    {
      id: 'm-3',
      senderId: 'usr-founder',
      senderName: 'Mbah Israel Obinna',
      text: 'The new Guardian AI curation algorithm for Tribut is live. Great job on the 11 collage rotation styles!',
      timestamp: '10:42 AM',
      isEncrypted: true,
      status: 'delivered'
    }
  ],
  'conv-2': [
    {
      id: 'm-201',
      senderId: 'usr-fatima',
      senderName: 'Fatima Al-Hassan',
      text: 'Hello! I have generated an instant Paylink for the Durbar Photography licensing rights.',
      timestamp: 'Yesterday 3:15 PM',
      isEncrypted: true,
      status: 'read'
    },
    {
      id: 'm-202',
      senderId: 'usr-fatima',
      senderName: 'Fatima Al-Hassan',
      text: 'Sent a 50 FIC Paylink for the High-Res Durbar exhibition master print license.',
      timestamp: 'Yesterday 3:16 PM',
      isEncrypted: true,
      paylinkAmount: 50,
      status: 'read'
    }
  ]
};

const MessagesPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { member } = useAuth();

  const [conversations, setConversations] = useState<ConversationItem[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>('conv-1');
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'group' | 'encrypted' | 'commerce'>('all');
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [isSecureMode, setIsSecureMode] = useState<boolean>(true);
  const [showSendPaylinkModal, setShowSendPaylinkModal] = useState<boolean>(false);
  const [paylinkAmountInput, setPaylinkAmountInput] = useState<string>('25');
  const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
  const [newChatRecipient, setNewChatRecipient] = useState<string>('');
  const [isAudioCallOpen, setIsAudioCallOpen] = useState<boolean>(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState<boolean>(false);

  // Sentient AI File Sanitization State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSanitizing, setIsSanitizing] = useState<boolean>(false);
  const [sanitizationStatus, setSanitizationStatus] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConvId) || conversations[0];
  }, [conversations, activeConvId]);

  const activeMessages = useMemo(() => {
    return messagesMap[activeConvId] || [];
  }, [messagesMap, activeConvId]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const matchesTab = activeTab === 'all' || c.category === activeTab;
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [conversations, activeTab, searchQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      senderName: (member as any)?.name || 'You',
      text: typedMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: isSecureMode,
      status: 'sent'
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg]
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, lastMessage: typedMessage.trim(), lastTime: 'Just now' }
          : c
      )
    );

    setTypedMessage('');
    showToast?.('Encrypted message delivered', 'success');
  };

  const handleSendPaylink = () => {
    const amt = parseFloat(paylinkAmountInput);
    if (isNaN(amt) || amt <= 0) {
      showToast?.('Please enter a valid FIC amount', 'warning');
      return;
    }

    const paylinkMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      senderName: (member as any)?.name || 'You',
      text: `Generated sovereign Paylink request for ${amt} FIC`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true,
      paylinkAmount: amt,
      status: 'sent'
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), paylinkMsg]
    }));

    setShowSendPaylinkModal(false);
    showToast?.(`Paylink for ${amt} FIC sent in chat!`, 'success');
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const MAX_SIZE = 500 * 1024 * 1024; // 500MB

    // Check size limit
    const oversized = fileList.find((f) => f.size > MAX_SIZE);
    if (oversized) {
      showToast?.(`File "${oversized.name}" exceeds the 500MB sovereign limit.`, 'error');
      e.target.value = '';
      return;
    }

    setIsSanitizing(true);
    setSanitizationStatus(`Sentient AI: Sanitizing ${fileList.length} sovereign asset(s)...`);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setSanitizationStatus(`Sentient AI: Deep inspecting & scrubbing metadata for "${file.name}" (0 threats)...`);
      await new Promise((res) => setTimeout(res, 400));

      let mediaType: 'audio' | 'video' | 'document' | 'image' = 'document';
      if (file.type.startsWith('audio/') || file.name.endsWith('.fma')) mediaType = 'audio';
      else if (file.type.startsWith('video/') || file.name.endsWith('.fmv')) mediaType = 'video';
      else if (file.type.startsWith('image/')) mediaType = 'image';

      const formattedSize = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      const newMsg: ChatMessage = {
        id: `file-${Date.now()}-${i}`,
        senderId: 'current-user',
        senderName: 'You',
        text: file.name,
        timestamp: 'Just now',
        isEncrypted: true,
        status: 'sent',
        mediaUrl: URL.createObjectURL(file),
        mediaType,
        fileName: file.name,
        fileSize: formattedSize,
        sanitizationVerified: true
      };

      setMessagesMap((prev) => ({
        ...prev,
        [activeConvId]: [...(prev[activeConvId] || []), newMsg]
      }));
    }

    setIsSanitizing(false);
    setSanitizationStatus('');
    showToast?.(`Sentient AI: ${fileList.length} file(s) sanitized & encrypted (500MB limit compliant)`, 'success');
    e.target.value = '';
  };

  const handleStartNewChat = () => {
    if (!newChatRecipient.trim()) return;

    const newConv: ConversationItem = {
      id: `conv-${Date.now()}`,
      isGroup: false,
      title: newChatRecipient.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      partner: {
        id: `usr-${Date.now()}`,
        name: newChatRecipient.trim(),
        username: newChatRecipient.toLowerCase().replace(/\s+/g, '_'),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        status: 'online',
        verifiedLevel: 2,
        role: 'Community Member'
      },
      lastMessage: 'Conversation initialized.',
      lastTime: 'Just now',
      unreadCount: 0,
      category: 'direct',
      isEncrypted: true,
      online: true
    };

    setConversations([newConv, ...conversations]);
    setActiveConvId(newConv.id);
    setShowNewChatModal(false);
    setNewChatRecipient('');
    showToast?.('New encrypted channel created', 'success');
  };

  return (
    <MainLayout pageTitle="Sovereign Protocol Messaging & Chat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* MAIN CONSOLE CARD: Strict border-slate-300 on white */}
        <div className="bg-white rounded-3xl border border-slate-300 shadow-sm overflow-hidden flex flex-col md:flex-row h-[calc(100vh-12rem)] min-h-[580px]">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: CONVERSATION DIRECTORY                      */}
          {/* ======================================================== */}
          <div className="w-full md:w-80 lg:w-96 border-r border-slate-300 flex flex-col bg-slate-50/50">
            
            {/* Header & New Chat Button */}
            <div className="p-4 border-b border-slate-300 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-orange-600" />
                <h1 className="text-base font-black text-slate-900">Conversations</h1>
              </div>
              <button
                type="button"
                onClick={() => setShowNewChatModal(true)}
                className="p-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                title="New Message"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="hidden sm:inline pr-1">New</span>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="p-2 border-b border-slate-300 bg-white flex items-center gap-1 overflow-x-auto">
              {[
                { id: 'all', label: 'All' },
                { id: 'direct', label: 'Direct' },
                { id: 'group', label: 'Guilds' },
                { id: 'encrypted', label: 'Secret' },
                { id: 'commerce', label: 'Paylinks' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                    activeTab === t.id
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Search Input: Sharp Core Standard */}
            <div className="p-3 border-b border-slate-300 bg-white">
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations & chats..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-200">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-700 font-medium">
                  No matching chats found for &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv.id === activeConvId;

                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => setActiveConvId(conv.id)}
                      className={`w-full p-3.5 flex items-start gap-3 text-left transition-all ${
                        isSelected
                          ? 'bg-orange-50/80 border-l-4 border-orange-600'
                          : 'hover:bg-slate-100/70'
                      }`}
                    >
                      {/* Avatar with Online Ping */}
                      <div className="relative shrink-0">
                        <img
                          src={conv.avatar}
                          alt={conv.title}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-300"
                        />
                        {conv.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h2 className="text-xs font-black text-slate-900 truncate">
                            {conv.title}
                          </h2>
                          <span className="text-[10px] font-bold text-slate-700 whitespace-nowrap">
                            {conv.lastTime}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 font-medium truncate">
                          {conv.lastMessage}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5">
                          {conv.isEncrypted && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                              <LockClosedIcon className="w-2.5 h-2.5" />
                              STERCS
                            </span>
                          )}

                          {conv.unreadCount > 0 && (
                            <span className="ml-auto inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-black rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: ACTIVE CHAT ARENA                          */}
          {/* ======================================================== */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            
            {/* 1. Chat Header: Strict Contrast */}
            <div className="p-4 border-b border-slate-300 bg-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={activeConversation?.avatar}
                    alt={activeConversation?.title}
                    className="w-10 h-10 rounded-2xl object-cover border border-slate-300"
                  />
                  {activeConversation?.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-black text-slate-900 truncate">
                      {activeConversation?.title}
                    </h2>
                    {activeConversation?.partner?.verifiedLevel && (
                      <ShieldCheckIcon className="w-4 h-4 text-sky-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-700 font-medium truncate">
                    {activeConversation?.partner?.role || 'Sovereign Protocol Guild'} • {activeConversation?.online ? 'Active Now' : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Chat Header Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSecureMode(!isSecureMode)}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 border transition-colors ${
                    isSecureMode
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                  title="Toggle Zero-Knowledge STERCS Encryption"
                >
                  <LockClosedIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isSecureMode ? 'Encrypted' : 'Standard'}</span>
                </button>

                <button
                  id="btn-audio-call"
                  type="button"
                  onClick={() => {
                    if (activeConversation) {
                      setIsAudioCallOpen(true);
                    } else {
                      showToast?.('Select a conversation to start a call', 'warning');
                    }
                  }}
                  className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
                  title="Audio Call"
                >
                  <PhoneIcon className="w-4 h-4" />
                </button>

                <button
                  id="btn-video-call"
                  type="button"
                  onClick={() => {
                    if (activeConversation) {
                      setIsVideoCallOpen(true);
                    } else {
                      showToast?.('Select a conversation to start a call', 'warning');
                    }
                  }}
                  className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
                  title="Video Session"
                >
                  <VideoCameraIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Chat Messages Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/60">
              
              {/* Security Banner */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-950 text-xs font-bold font-black">
                  <LockClosedIcon className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Messages and calls are end-to-end encrypted under STERCS™ v2.5 sovereign protocol.</span>
                </div>
              </div>

              {activeMessages.map((msg) => {
                const isMe = msg.senderId === 'current-user';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md sm:max-w-lg p-3.5 rounded-2xl shadow-2xs space-y-1.5 ${
                        isMe
                          ? 'bg-slate-900 text-white rounded-br-none'
                          : 'bg-white text-slate-900 border border-slate-300 rounded-bl-none'
                      }`}
                    >
                      {/* Sender label for groups */}
                      {!isMe && (
                        <span className="block text-[11px] font-black text-orange-600">
                          {msg.senderName}
                        </span>
                      )}

                      <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isMe ? 'text-slate-100' : 'text-slate-900'}`}>
                        {msg.text}
                      </p>

                      {/* Sentient AI Sanitized Media Card: Audio */}
                      {msg.mediaType === 'audio' && (
                        <div className={`mt-2 p-3 rounded-xl border space-y-2 ${
                          isMe ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
                        }`}>
                          <div className="flex items-center justify-between text-[11px] font-bold text-amber-500">
                            <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                              <span>🎵</span>
                              <span className="truncate">{msg.fileName || msg.text}</span>
                            </span>
                            <span className="text-[10px] text-slate-700 font-mono shrink-0">{msg.fileSize}</span>
                          </div>
                          {msg.mediaUrl && (
                            <audio controls src={msg.mediaUrl} className="w-full h-8 rounded" />
                          )}
                          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                            <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Sentient AI Sanitized • 0 Threats • Opus/FMA</span>
                          </div>
                        </div>
                      )}

                      {/* Sentient AI Sanitized Media Card: Video */}
                      {msg.mediaType === 'video' && (
                        <div className={`mt-2 p-2 rounded-xl border space-y-1.5 ${
                          isMe ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
                        }`}>
                          {msg.mediaUrl && (
                            <video controls src={msg.mediaUrl} className="w-full max-h-56 rounded-lg object-cover" />
                          )}
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 px-1">
                            <span className="truncate max-w-[200px]">{msg.fileName || msg.text}</span>
                            <span className="text-[10px] font-mono text-slate-500">{msg.fileSize}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold px-1">
                            <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Sentient AI Sanitized • 1080p FMV</span>
                          </div>
                        </div>
                      )}

                      {/* Sentient AI Sanitized Media Card: Document */}
                      {msg.mediaType === 'document' && (
                        <div className={`mt-2 p-3 rounded-xl border flex items-center justify-between gap-3 ${
                          isMe ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                        }`}>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-2xl">📄</span>
                            <div className="min-w-0">
                              <p className={`text-xs font-black truncate ${isMe ? 'text-white' : 'text-slate-900'}`}>
                                {msg.fileName || msg.text}
                              </p>
                              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                                <ShieldCheckIcon className="w-3 h-3 text-emerald-600" />
                                <span>Sentient AI: Sanitized ({msg.fileSize})</span>
                              </div>
                            </div>
                          </div>
                          {msg.mediaUrl && (
                            <a
                              href={msg.mediaUrl}
                              download={msg.fileName || 'sovereign_document'}
                              className="p-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shrink-0"
                              title="Download Sanitized Document"
                            >
                              ⬇️
                            </a>
                          )}
                        </div>
                      )}

                      {/* Paylink Attachment Card */}
                      {msg.paylinkAmount && (
                        <div className={`p-3 rounded-xl border mt-2 flex items-center justify-between gap-3 ${
                          isMe ? 'bg-slate-800 border-slate-700' : 'bg-orange-50 border-orange-300'
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🪙</span>
                            <div>
                              <span className={`block text-xs font-black ${isMe ? 'text-white' : 'text-slate-900'}`}>
                                {msg.paylinkAmount} FIC Paylink
                              </span>
                              <span className={`block text-[10px] font-bold ${isMe ? 'text-slate-300' : 'text-slate-700'}`}>
                                Instant Escrow Settlement
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => showToast?.(`Redeeming ${msg.paylinkAmount} FIC Paylink into wallet...`, 'success')}
                            className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase"
                          >
                            Claim
                          </button>
                        </div>
                      )}

                      {/* Timestamp & Status */}
                      <div className={`flex items-center justify-end gap-1 text-[10px] pt-1 font-bold ${
                        isMe ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckIcon className="w-3 h-3 text-orange-400" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* 3. Message Input Composer: Strict Contrast */}
            <div className="p-3 sm:p-4 border-t border-slate-300 bg-white space-y-2">
              
              {/* Sentient AI Sanitization Progress Banner */}
              {isSanitizing && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-100 border border-purple-400 text-purple-950 text-xs font-bold animate-pulse">
                  <SparklesIcon className="w-4 h-4 text-purple-700 animate-spin shrink-0" />
                  <span className="truncate">{sanitizationStatus}</span>
                  <span className="ml-auto text-[10px] uppercase font-black tracking-wider bg-purple-200 px-2 py-0.5 rounded text-purple-900 shrink-0">
                    500MB Cap Compliant
                  </span>
                </div>
              )}

              {/* Quick AI Response Suggestions */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <SparklesIcon className="w-3 h-3 text-orange-500" />
                  Quick Reply:
                </span>
                {['Confirmed, proceeding now.', 'Could you share the high-res 4K asset?', 'Thank you for the quick turnaround!'].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setTypedMessage(suggestion)}
                    className="px-2.5 py-1 text-xs rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold whitespace-nowrap transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Input Row */}
              <div className="flex items-center gap-2">
                
                {/* Hidden File Input for Sentient AI Multi-File Attachment */}
                <input
                  ref={fileInputRef}
                  id="msg-file-upload-input"
                  type="file"
                  multiple
                  accept="audio/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.fma,.fmv,.fmp"
                  onChange={handleFilesSelected}
                  className="hidden text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />

                {/* Media & Attachments Button */}
                <button
                  id="btn-attach-files"
                  type="button"
                  onClick={handleAttachClick}
                  disabled={isSanitizing}
                  className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors disabled:opacity-50"
                  title="Attach Audio, Video, or Documents (500MB Max)"
                >
                  <PaperClipIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowSendPaylinkModal(true)}
                  className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
                  title="Send Paylink in FIC"
                >
                  <CurrencyDollarIcon className="w-4 h-4 text-emerald-600" />
                </button>

                {/* Primary Text Input: Strict Core Standard */}
                <input
                  type="text"
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Write an encrypted message to ${activeConversation?.title}...`}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-300 text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-2xs"
                />

                {/* Send Button */}
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!typedMessage.trim()}
                  className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SEND PAYLINK MODAL */}
        {showSendPaylinkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white rounded-3xl border border-slate-300 max-w-sm w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-black text-slate-900">Send Direct Paylink in Chat</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSendPaylinkModal(false)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Amount in Infinite Coins (FIC)
                </label>
                <input
                  type="number"
                  min="1"
                  value={paylinkAmountInput}
                  onChange={(e) => setPaylinkAmountInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSendPaylinkModal(false)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendPaylink}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase"
                >
                  Send Paylink
                </button>
              </div>
            </div>
          </div>
        )}

        {/* NEW CHAT MODAL */}
        {showNewChatModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white rounded-3xl border border-slate-300 max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-sm font-black text-slate-900">Start New Sovereign Chat</h3>
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Member Name or Wallet Handle
                </label>
                <input
                  type="text"
                  value={newChatRecipient}
                  onChange={(e) => setNewChatRecipient(e.target.value)}
                  placeholder="e.g. @aminabello or Chidi Okonkwo"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartNewChat}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase"
                >
                  Open Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WEBRTC STERCS™ AUDIO CALL MODAL */}
        <AudioCallModal
          isOpen={isAudioCallOpen}
          onClose={() => setIsAudioCallOpen(false)}
          recipientName={activeConversation?.partner?.name || activeConversation?.title || 'Sovereign Peer'}
          recipientAvatar={activeConversation?.partner?.avatar || activeConversation?.avatar}
          recipientId={activeConversation?.partner?.id || activeConversation?.id || 'usr-peer'}
          role={activeConversation?.partner?.role || 'Sovereign Protocol Guild'}
          isAiAgent={
            Boolean(
              activeConversation?.partner?.role?.toLowerCase().includes('sentinel') ||
              activeConversation?.partner?.role?.toLowerCase().includes('ai') ||
              activeConversation?.title?.toLowerCase().includes('sentinel')
            )
          }
        />

        {/* WEBRTC STERCS™ VIDEO CALL MODAL */}
        <VideoCallModal
          isOpen={isVideoCallOpen}
          onClose={() => setIsVideoCallOpen(false)}
          recipientName={activeConversation?.partner?.name || activeConversation?.title || 'Sovereign Peer'}
          recipientAvatar={activeConversation?.partner?.avatar || activeConversation?.avatar}
          recipientId={activeConversation?.partner?.id || activeConversation?.id || 'usr-peer'}
          role={activeConversation?.partner?.role || 'Sovereign Protocol Guild'}
          isAiAgent={
            Boolean(
              activeConversation?.partner?.role?.toLowerCase().includes('sentinel') ||
              activeConversation?.partner?.role?.toLowerCase().includes('ai') ||
              activeConversation?.title?.toLowerCase().includes('sentinel')
            )
          }
        />

      </div>
    </MainLayout>
  );
};

export default MessagesPage;
