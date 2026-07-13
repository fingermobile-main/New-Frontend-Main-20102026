import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChatBubbleLeftIcon as FiMessageSquare,
  UsersIcon as FiUsers,
  MagnifyingGlassIcon as FiSearch,
  PaperClipIcon as FiPaperclip,
  MicrophoneIcon as FiMic,
  PaperAirplaneIcon as FiSend,
  XMarkIcon as FiX,
  PhoneIcon as FiPhone,
  VideoCameraIcon as FiVideo,
  InformationCircleIcon as FiInfo,
  GiftIcon as FiGift,
  LockClosedIcon as FiLock,
  ClockIcon as FiClock,
  PhotoIcon as FiImage
} from '@heroicons/react/24/solid';
// Replaced react-icons with local icons for consistency
import { SmileIcon as FaRegSmile, CoinIcon as FaCoins, CloseIcon as IoMdClose } from '../../components/icons';
import EmojiPicker from 'emoji-picker-react';

// Types for messaging system
interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  isPremium?: boolean;
}

interface EncryptedMessageContent {
  encryptedData: string;
  iv: string;
  authTag?: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string | EncryptedMessageContent;
  timestamp: Date;
  read: boolean;
  delivered: boolean;
  encrypted: boolean;
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'gift' | 'paylink' | 'token';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  isDisappearing?: boolean;
  expirationTime?: Date;
  readReceipts?: MessageReceipt[];
}

interface MessageReceipt {
  messageId: string;
  status: 'delivered' | 'read';
  timestamp: Date;
  receiverId: string;
}

interface WebSocketMessage {
  type: 'MESSAGE' | 'TYPING' | 'READ_RECEIPT' | 'DELIVERY_CONFIRMATION' | 'ENCRYPTION_KEY_EXCHANGE';
  payload: unknown;
}

interface EncryptionKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

interface ConversationSecuritySettings {
  isEncrypted: boolean;
  encryptionAlgorithm: 'AES-GCM' | 'RSA-OAEP';
  keyExchangeCompleted: boolean;
  symmetricKey?: CryptoKey;
}

interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  createdAt: Date;
  isEncrypted: boolean;
  isDisappearing: boolean;
  disappearingDuration: number;
  isMuted: boolean;
  securitySettings: ConversationSecuritySettings;
}

const MessagesPage: React.FC = () => {
  const _navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupMembers, setGroupMembers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [isDisappearingMode, setIsDisappearingMode] = useState(false);
  const [_disappearingDuration, _setDisappearingDuration] = useState(60); 
  const [showSecureOptions, setShowSecureOptions] = useState(false);
  const [showDisappearingOptions, setShowDisappearingOptions] = useState(false);
  const [_isTyping, _setIsTyping] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [_encryptionKeys, _setEncryptionKeys] = useState<EncryptionKeyPair | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Keep active conversation reference fresh for WebSocket callbacks
  const activeConversationRef = useRef<Conversation | null>(null);
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // Byte conversion helper for cryptographic operations
  const bufToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const hexToBuf = (hex: string): Uint8Array => {
    const matches = hex.match(/.{1,2}/g);
    if (!matches) return new Uint8Array(0);
    return new Uint8Array(matches.map(byte => parseInt(byte, 16)));
  };

  const initializeEncryption = async () => {
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
      );
      _setEncryptionKeys(keyPair);
    } catch (error) {
      // Silently handle encryption key generation errors in production
    }
  };

  const encryptMessage = async (content: string): Promise<EncryptedMessageContent> => {
    if (!activeConversationRef.current?.securitySettings.symmetricKey) {
      throw new Error("Symmetric key not available for encryption");
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
      activeConversationRef.current.securitySettings.symmetricKey,
      data
    );

    return {
      encryptedData: bufToHex(encryptedData),
      iv: bufToHex(iv.buffer)
    };
  };

  const decryptMessage = async (encryptedContent: EncryptedMessageContent): Promise<string> => {
    if (!activeConversationRef.current?.securitySettings.symmetricKey) {
      throw new Error("Symmetric key not available for decryption");
    }
    const decoder = new TextDecoder();
    const iv = hexToBuf(encryptedContent.iv);
    const encryptedData = hexToBuf(encryptedContent.encryptedData);

    const decryptedData = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
      activeConversationRef.current.securitySettings.symmetricKey,
      encryptedData.buffer as ArrayBuffer
    );

    return decoder.decode(decryptedData);
  };

  const handleIncomingMessage = useCallback(async (messageData: Message & { conversationId: string }) => {
    let content = messageData.content;
    if (messageData.encrypted && typeof messageData.content === 'object') {
      try {
        content = await decryptMessage(messageData.content);
      } catch (error) {
        // Handle decryption failure gracefully
        content = '[Encrypted message could not be decrypted]';
      }
    }
    
    const incoming: Message = {
      ...messageData,
      content,
      timestamp: new Date(messageData.timestamp)
    };
    
    setMessages(prev => [...prev, incoming]);
    
    if (activeConversationRef.current && activeConversationRef.current.id === messageData.conversationId) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === messageData.conversationId 
            ? { ...conv, lastMessage: incoming, unreadCount: conv.unreadCount + 1 } 
            : conv
        )
      );
    }
  }, [decryptMessage]);

  const handleKeyExchange = useCallback(async (keyData: { conversationId: string; publicKey: string }) => {
    const symmetricKey = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    
    setConversations(prev => 
      prev.map(conv => 
        conv.id === keyData.conversationId 
          ? { 
              ...conv, 
              securitySettings: { 
                ...conv.securitySettings, 
                keyExchangeCompleted: true,
                symmetricKey
              } 
            } 
          : conv
      )
    );
  }, []);

  const initWebSocket = useCallback(() => {
    const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:3001'}/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsWsConnected(true);
      ws.send(JSON.stringify({ type: 'AUTH', payload: { userId: 'user1' } }));
    };

    ws.onmessage = async (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      switch (data.type) {
        case 'MESSAGE':
          if (typeof data.payload === 'object' && data.payload !== null) {
            await handleIncomingMessage(data.payload as Message & { conversationId: string });
          }
          break;
        case 'TYPING':
          if (typeof data.payload === 'object' && data.payload !== null && 'isTyping' in data.payload) {
            _setIsTyping((data.payload as { isTyping: boolean }).isTyping);
          }
          break;
        case 'ENCRYPTION_KEY_EXCHANGE':
          if (typeof data.payload === 'object' && data.payload !== null && 'conversationId' in data.payload && 'publicKey' in data.payload) {
            await handleKeyExchange(data.payload as { conversationId: string; publicKey: string });
          }
          break;
        default:
          // Silently ignore unhandled WebSocket message types
          break;
      }
    };

    ws.onclose = () => setIsWsConnected(false);
    ws.onerror = () => setIsWsConnected(false);
  }, [handleIncomingMessage, handleKeyExchange]);

  const apiService = {
    getConversations: async (): Promise<Conversation[]> => {
      return [
        {
          id: 'conv1',
          participants: [
            { id: 'user1', name: 'Alex Johnson', avatar: '/avatars/alex.jpg', status: 'online', isPremium: true },
            { id: 'user2', name: 'Sam Wilson', avatar: '/avatars/sam.jpg', status: 'away', lastSeen: '2 hours ago', isPremium: false }
          ],
          lastMessage: {
            id: 'msg1',
            senderId: 'user2',
            receiverId: 'user1',
            content: 'Hey, are we still meeting tomorrow?',
            timestamp: new Date(Date.now() - 3600000),
            read: true,
            delivered: true,
            encrypted: false,
            type: 'text',
            status: 'read'
          },
          unreadCount: 0,
          isGroup: false,
          createdAt: new Date(Date.now() - 86400000),
          isEncrypted: false,
          isDisappearing: false,
          disappearingDuration: 0,
          isMuted: false,
          securitySettings: {
            isEncrypted: false,
            encryptionAlgorithm: 'AES-GCM',
            keyExchangeCompleted: false
          }
        }
      ];
    },
    getMessages: async (_conversationId: string): Promise<Message[]> => {
      return [
        {
          id: 'msg1',
          senderId: 'user2',
          receiverId: 'user1',
          content: 'Hey, are we still meeting tomorrow?',
          timestamp: new Date(Date.now() - 3600000),
          read: true,
          delivered: true,
          encrypted: false,
          type: 'text',
          status: 'read'
        }
      ];
    },
    sendMessage: async (message: Omit<Message, 'id' | 'timestamp' | 'status' | 'delivered'>): Promise<Message> => {
      return {
        ...message,
        id: `msg${Date.now()}`,
        timestamp: new Date(),
        status: 'sent',
        delivered: true
      };
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      const convs = await apiService.getConversations();
      setConversations(convs);
      if (convs.length > 0) {
        setActiveConversation(convs[0]);
        const msgs = await apiService.getMessages(convs[0].id);
        setMessages(msgs);
      }
      await initializeEncryption();
      initWebSocket();
    };

    bootstrap();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [initWebSocket, apiService]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAiSuggestions = (text: string) => {
    let suggestions: string[] = [];
    if (text.toLowerCase().includes('how are you')) {
      suggestions = ['Good, thanks!', 'Doing well, how about you?'];
    } else if (text.toLowerCase().includes('meeting')) {
      suggestions = ["Yes, I'm looking forward to it", 'I will be there'];
    }
    setAiSuggestions(suggestions);
    setShowAiSuggestions(suggestions.length > 0);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    let content: string | EncryptedMessageContent = newMessage;
    const shouldEncrypt = isSecureMode || activeConversation.isEncrypted;

    if (shouldEncrypt) {
      try {
        content = await encryptMessage(newMessage);
      } catch (error) {
        // Handle encryption failure gracefully
        return;
      }
    }

    const messagePayload: Message = {
      id: `local${Date.now()}`,
      senderId: 'user1',
      receiverId: activeConversation.participants.find(p => p.id !== 'user1')?.id || '',
      content,
      timestamp: new Date(),
      read: false,
      delivered: false,
      encrypted: shouldEncrypt,
      type: 'text',
      status: 'sending',
      isDisappearing: isDisappearingMode || activeConversation.isDisappearing
    };

    setMessages(prev => [...prev, messagePayload]);
    const memoMessage = newMessage;
    setNewMessage('');
    setShowAiSuggestions(false);

    try {
      if (wsRef.current && isWsConnected) {
        wsRef.current.send(JSON.stringify({ type: 'MESSAGE', payload: { ...messagePayload, conversationId: activeConversation.id } }));
      }

      const { conversationId: _conversationId, ...messageWithoutConvId } = { ...messagePayload, conversationId: activeConversation.id };
      const savedMessage = await apiService.sendMessage(messageWithoutConvId);

      setMessages(prev => prev.map(m => m.id === messagePayload.id ? savedMessage : m));
      setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, lastMessage: savedMessage } : c));
      generateAiSuggestions(memoMessage);
    } catch (error) {
      setMessages(prev => prev.map(m => m.id === messagePayload.id ? { ...m, status: 'error' as const } : m));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      // Typing indicator timeout - no action needed
    }, 2000);
  };

  const handleAddToGroup = (user: User) => {
    if (!groupMembers.some(m => m.id === user.id)) {
      setGroupMembers([...groupMembers, user]);
    }
  };

  const handleRemoveFromGroup = (userId: string) => {
    setGroupMembers(groupMembers.filter(m => m.id !== userId));
  };

  const handleCreateGroupSubmit = () => {
    if (!groupName.trim() || groupMembers.length < 2) return;

    const newGroupConv: Conversation = {
      id: `group${Date.now()}`,
      participants: [{ id: 'user1', name: 'Alex Johnson', avatar: '/avatars/alex.jpg', status: 'online' }, ...groupMembers],
      unreadCount: 0,
      isGroup: true,
      groupName,
      createdAt: new Date(),
      isEncrypted: false,
      isDisappearing: isDisappearingMode,
      disappearingDuration: _disappearingDuration,
      isMuted: false,
      securitySettings: { isEncrypted: false, encryptionAlgorithm: 'AES-GCM', keyExchangeCompleted: false }
    };

    setConversations([newGroupConv, ...conversations]);
    setActiveConversation(newGroupConv);
    setMessages([]);
    setIsCreatingGroup(false);
    setGroupName('');
    setGroupMembers([]);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Conversations List */}
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <FiMessageSquare className="mr-2 text-blue-500" /> Messages
          </h1>
          <div className="flex space-x-2">
            <button onClick={() => setActiveConversation(null)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
              <FiMessageSquare className="w-[18px] h-[18px]" />
            </button>
            <button onClick={() => setIsCreatingGroup(true)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
              <FiUsers className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations
            .filter(conv => conv.isGroup ? conv.groupName?.toLowerCase().includes(searchQuery.toLowerCase()) : conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())))
            .map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${activeConversation?.id === conversation.id ? 'bg-blue-50' : ''}`}
                onClick={() => {
                  setActiveConversation(conversation);
                  setMessages([]);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveConversation(conversation);
                    setMessages([]);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center">
                  {conversation.isGroup ? (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                      {conversation.groupName?.charAt(0)}
                    </div>
                  ) : (
                    <img
                      src={conversation.participants.find(p => p.id !== 'user1')?.avatar || '/avatars/default.jpg'}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.isGroup ? conversation.groupName : conversation.participants.find(p => p.id !== 'user1')?.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {typeof conversation.lastMessage?.content === 'string' ? conversation.lastMessage.content : '[Message]'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Desktop / Primary View Chat Workspace */}
      <div className="flex flex-1 flex-col h-full">
        {activeConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">
                  {activeConversation.isGroup ? activeConversation.groupName : activeConversation.participants.find(p => p.id !== 'user1')?.name}
                </h2>
              </div>
              <div className="flex space-x-3 text-gray-500">
                <button onClick={() => { setIsSecureMode(!isSecureMode); setShowSecureOptions(true); }} className={isSecureMode ? "text-green-600" : ""}>
                  <FiLock className="w-5 h-5" />
                </button>
                <button onClick={() => { setIsDisappearingMode(!isDisappearingMode); setShowDisappearingOptions(true); }} className={isDisappearingMode ? "text-purple-600" : ""}>
                  <FiClock className="w-5 h-5" />
                </button>
                <FiPhone className="w-5 h-5 cursor-pointer" />
                <FiVideo className="w-5 h-5 cursor-pointer" />
                <FiInfo className="w-5 h-5 cursor-pointer" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 relative">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.senderId === 'user1' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.senderId === 'user1' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border'}`}>
                      <p>{typeof message.content === 'string' ? message.content : '[Encrypted Content]'}</p>
                      <span className="text-[10px] block text-right opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {showAiSuggestions && aiSuggestions.length > 0 && (
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {aiSuggestions.map((s, i) => (
                    <button key={i} onClick={() => { setNewMessage(s); setShowAiSuggestions(false); }} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs hover:bg-blue-200">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t">
              {showSecureOptions && isSecureMode && (
                <div className="mb-2 p-2 bg-blue-50 text-blue-800 rounded text-xs flex justify-between">
                  <span>End-to-End Encryption Armed</span>
                  <button onClick={() => setShowSecureOptions(false)} className="cursor-pointer">
                    <FiX />
                  </button>
                </div>
              )}

              {showDisappearingOptions && isDisappearingMode && (
                <div className="mb-2 p-2 bg-purple-50 text-purple-800 rounded text-xs flex justify-between">
                  <span>Disappearing Mode active ({_disappearingDuration}m)</span>
                  <button onClick={() => setShowDisappearingOptions(false)} className="cursor-pointer">
                    <FiX />
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-gray-500">
                  <FaRegSmile className="w-5 h-5" />
                </button>
                <button onClick={() => setShowAttachmentMenu(!showAttachmentMenu)} className="text-gray-500">
                  <FiPaperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
                  onKeyPress={handleKeyPress}
                  className="flex-1 p-2 bg-gray-100 rounded-lg focus:outline-none"
                />
                <button onClick={handleSendMessage} className="p-2 bg-blue-500 text-white rounded-full">
                  <FiSend className="w-[18px] h-[18px]" />
                </button>
              </div>

              {showEmojiPicker && (
                <div className="absolute bottom-20 z-50">
                  <EmojiPicker onEmojiClick={(emoji) => setNewMessage(p => p + emoji.emoji)} />
                </div>
              )}

              {showAttachmentMenu && (
                <div className="absolute bottom-20 bg-white border shadow rounded p-2 flex space-x-4">
                  <FiMic className="w-5 h-5 text-gray-600 cursor-pointer" />
                  <FaCoins className="w-[18px] h-[18px] text-yellow-500 cursor-pointer" />
                  <FiImage className="w-5 h-5 text-gray-600 cursor-pointer" />
                  <FaCoins className="w-[18px] h-[18px] text-yellow-500 cursor-pointer" />
                  <FiGift className="w-5 h-5 text-pink-500 cursor-pointer" />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">Select a room to begin messaging</div>
        )}
      </div>

      {/* Global Group Creation Modal */}
      {isCreatingGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-4 flex flex-col">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-lg font-semibold">Create New Group</h3>
              <button onClick={() => setIsCreatingGroup(false)}>
                <IoMdClose className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="groupName" className="text-xs font-medium text-gray-500">Group Designation</label>
                <input
                  id="groupName"
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full p-2 border rounded mt-1 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Selected Members ({groupMembers.length})</label>
                <div className="flex flex-wrap gap-1 mt-1" role="list" aria-label="Selected group members">
                  {groupMembers.map(m => (
                    <span key={m.id} className="bg-gray-100 text-xs px-2 py-1 rounded flex items-center space-x-1" role="listitem">
                      <span>{m.name}</span>
                      <button
                        onClick={() => handleRemoveFromGroup(m.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleRemoveFromGroup(m.id);
                          }
                        }}
                        className="cursor-pointer text-red-500 bg-transparent border-none p-0"
                        aria-label={`Remove ${m.name} from group`}
                        type="button"
                      >
                        <FiX />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="availableContacts" className="text-xs font-medium text-gray-500">Available Roster Contacts</label>
                <div id="availableContacts" className="border rounded max-h-32 overflow-y-auto divide-y mt-1" role="listbox" aria-label="Available contacts">
                  {conversations.filter(c => !c.isGroup).map(c => {
                    const candidate = c.participants.find(p => p.id !== 'user1');
                    if (!candidate) return null;
                    return (
                      <div
                        key={candidate.id}
                        onClick={() => handleAddToGroup(candidate)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleAddToGroup(candidate);
                          }
                        }}
                        role="option"
                        aria-selected={groupMembers.some(m => m.id === candidate.id)}
                        tabIndex={0}
                        className="p-2 text-sm hover:bg-gray-50 cursor-pointer"
                      >
                        {candidate.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button onClick={() => setIsCreatingGroup(false)} className="px-3 py-1.5 border rounded text-sm text-gray-600">Cancel</button>
              <button
                onClick={handleCreateGroupSubmit}
                disabled={!groupName.trim() || groupMembers.length < 2}
                className="px-3 py-1.5 bg-blue-500 disabled:bg-gray-200 text-white rounded text-sm"
              >
                Assemble Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
