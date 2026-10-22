import React, { useState, useEffect, useRef } from 'react';
import VoiceLineService from '../../../src/services/VoiceLineService';
import { VoiceLineCategory } from '../../../src/services/VoiceLineService';

// Missing interfaces that need to be added
interface MiiMedia {
  id: string;
  owner_id: string;
  folder_id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  duration?: number; // For videos
  upload_date: Date;
  expiry_date: Date;
  caption?: string;
  reactions: number;
  views: number;
  is_public: boolean;
  pricing_model: {
    type: 'free' | 'subscription' | 'pay-per-view' | 'one-time';
    amount: number;
    currency: string;
  };
  can_download: boolean;
  purchase_status: 'public' | 'purchased' | 'not_purchased';
  is_censored: boolean;
  // AI-enhanced properties
  ai_analysis: {
    content_tags: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
    auto_censorship_risk: number; // 1-100 scale
    recommendation_score: number; // 1-100 scale
  };
  content_moderation: AIContentModeration[];
}

interface MiiReply {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Date;
  reactions: { [emoji: string]: string[] }; // emoji -> list of member IDs who reacted
}

interface MonetizedFolder {
  id: string;
  owner_id: string;
  name: string;
  type: 'image' | 'video' | 'audio';
  privacy: 'private' | 'public';
  pricing_model: {
    type: 'free' | 'subscription' | 'pay-per-view' | 'one-time';
    amount: number;
    currency: string;
  };
  monetization_type: 'subscription' | 'pay-per-view' | 'one-time';
  timer: 'once' | '6hrs' | '12hrs' | '24hrs' | '48hrs';
  can_download: boolean;
  total_views: number;
  total_reactions: number;
  earnings: number;
  is_tokenized: boolean;
  requires_pin: boolean;
}

interface MCPGroup {
  id: string;
  name: string;
  type: 'group' | 'channel';
  members: string[]; // member IDs
  createdAt: Date;
  description?: string;
}

// AI Content Moderation interface
interface AIContentModeration {
  id: string;
  content_type: 'image' | 'video' | 'text' | 'audio';
  content_url: string;
  detected_objects: string[];
  flagged_content: boolean;
  confidence_score: number;
  moderation_timestamp: Date;
  category: 'violence' | 'nudity' | 'hate_symbols' | 'spam' | 'other';
  auto_action_taken: 'none' | 'blur' | 'censor' | 'remove';
}

// AI-Enhanced Mii Update interface
interface AIEnhcancedMiiUpdate {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  media: MiiMedia[];
  caption: string;
  timestamp: Date;
  reactions: { [emoji: string]: string[] }; // emoji to member IDs
  replies: MiiReply[];
  mentions: string[]; // member IDs mentioned
  privacySettings: {
    visibility: 'public' | 'contacts' | 'custom';
    excludedContacts: string[];
    includedContacts: string[];
  };
  isViewed: boolean;
  isDisappearing: boolean; // Whether the update disappears after being viewed once
  // AI-Enhanced properties
  ai_analysis: {
    sentiment: 'positive' | 'negative' | 'neutral';
    keywords: string[];
    content_tags: string[];
    engagement_prediction: number; // 0-100 percentage
    auto_categorization: 'personal' | 'promotional' | 'news' | 'entertainment' | 'educational';
  };
  content_moderation: AIContentModeration[];
}

// Enhanced Mii Media with AI features
interface EnhancedMiiMedia {
  id: string;
  owner_id: string;
  folder_id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  duration?: number; // in seconds
  upload_date: Date;
  expiry_date: Date; // 48 hours from upload
  caption?: string;
  reactions: number;
  views: number;
  is_public: boolean;
  pricing_model: {
    type: 'free' | 'subscription' | 'pay-per-view' | 'one-time';
    amount: number;
    currency: string;
  };
  can_download: boolean;
  purchase_status?: 'completed' | 'not_purchased' | 'public';
  is_censored?: boolean; // For disappearing media with "Censored" tag
  // AI-enhanced properties
  ai_analysis: {
    content_tags: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
    auto_censorship_risk: number; // 0-100 percentage
    recommendation_score: number; // How likely to be engaging
  };
  content_moderation: AIContentModeration[];
}

// Enhanced Mii Contact with security features
interface EnhancedMiiContact {
  id: string;
  name: string;
  avatar: string;
  isFollowing: boolean;
  hasMiiAccess: boolean; // whether they have exchanged pins
  lastSeen: Date | null;
  currentlyListening?: string;
  currentlyWatching?: string;
  trustedFollower: boolean; // For permission matrix
  publicActivityEnabled: boolean; // For permission matrix
  canViewStatus: boolean; // Whether this contact can see my status
  canViewActivity: boolean; // Whether this contact can see my activity
  // Security features
  security_level: 'high' | 'medium' | 'low';
  trusted_since: Date | null;
  // Engagement features
  interaction_frequency: number; // How often member interacts with this contact
  shared_interests: string[];
  last_interacted: Date;
}

// Enhanced Mii Folder with monetization
interface EnhancedMiiFolder {
  id: string;
  name: 'Video' | 'Image';
  type: 'private' | 'public';
  privacy_setting: 'private' | 'public';
  pricing_model: {
    type: 'free' | 'subscription' | 'pay-per-view' | 'one-time';
    amount: number;
    currency: string;
  };
  content: EnhancedMiiMedia[];
  visibilityTimer?: 'once' | '6hrs' | '12hrs' | '24hrs' | '48hrs';
  can_download: boolean;
  is_tokenized: boolean; // Whether content is tokenized
  requires_pin: boolean; // Whether PIN exchange is required to access
  // AI-Enhanced properties
  ai_suggested_members: string[]; // Suggestions for improving engagement
  optimal_posting_members: string[]; // Best times to post content
  audience_demographics: {
    age_groups: { [key: string]: number };
    interests: string[];
    location: string[];
  };
}

// Enhanced Member Profile
interface EnhancedMemberProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  miiUpdates: AIEncancedMiiUpdate[];
  folders: EnhancedMiiFolder[];
  contacts: EnhancedMiiContact[];
  miiPin: string; // The unique pin for Mii access
  hasExchangedPins: boolean;
  monetizedFolders?: MonetizedFolder[];
  trustedContacts: string[]; // IDs of trusted contacts
  onlineStatus: 'online' | 'offline' | 'away';
  canViewMyStatus: boolean; // Whether others can see my status
  canViewMyActivity: boolean; // Whether others can see my activity
  canViewMyMii: boolean; // Whether others can see my Mii
  readReceiptsEnabled: boolean; // Whether read receipts are enabled
  // Security features
  account_security_level: 'high' | 'medium' | 'low';
  two_factor_enabled: boolean;
  last_security_scan: Date;
  // AI-Enhanced features
  ai_insights: {
    best_content_types: string[];
    optimal_posting_times: string[];
    audience_growth_trend: 'increasing' | 'decreasing' | 'stable';
    engagement_rate: number;
  };
}

// AI-Enhanced MCP Message
interface AIEnhcancedMCPMessage {
  id: string;
  senderId: string;
  recipientId?: string;
  groupId?: string;
  channelId?: string;
  content: string;
  timestamp: Date;
  type: 'secure' | 'group' | 'channel' | 'broadcast' | 'disappearing';
  status: 'sent' | 'delivered' | 'read';
  isEncrypted: boolean;
  expiration?: Date; // For disappearing messages
  is_disappearing: boolean; // Whether message disappears after being read
  // AI-Enhanced properties
  sentiment_analysis: {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  smart_reply_suggestions: string[];
  auto_response_enabled: boolean;
}

interface Earnings {
  total_earnings: number;
  total_media_items: number;
  total_views: number;
  total_downloads: number;
  total_purchases: number;
}

interface MediaAnalytic {
  type: 'image' | 'video' | 'audio';
  total_items: number;
  total_views: number;
  total_revenue: number;
}

interface Analytics {
  mediaAnalytics: MediaAnalytic[];
}

interface MediaAccess {
  id: string;
  media_id: string;
  owner_name: string;
  folder_name: string;
  granted_at: Date;
  expiry_date: Date;
}

interface AiInsights {
  content_performance: {
    top_posts: { id: string; title: string; engagement: number }[];
    content_type_performance: {
      image: { avg_engagement: number; avg_shares: number };
      video: { avg_engagement: number; avg_shares: number };
    };
  };
  audience_insights: {
    active_hours: string[];
    member_locations: string[];
    demographics: {
      age_groups: { [key: string]: number };
      interests: string[];
    };
  };
  ai_suggestions: string[];
}

// ... existing interfaces continue ...

const MiiPage: React.FC = () => {
  const [memberProfile, setMemberProfile] = useState<EnhancedMemberProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'updates' | 'folders' | 'contacts' | 'profile' | 'messages' | 'groups' | 'channels' | 'fingerorbit' | 'ai-insights'>('updates');
  const [newUpdate, setNewUpdate] = useState<string>('');

  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [selectedPrivacy, setSelectedPrivacy] = useState<'public' | 'contacts' | 'custom'>('contacts');
  const [excludedContacts, setExcludedContacts] = useState<string[]>([]);
  const [includedContacts, setIncludedContacts] = useState<string[]>([]);
  const [newReply, setNewReply] = useState<{ [updateId: string]: string }>({});
  const [newPin, setNewPin] = useState<string>('');
  const [pinToExchange, setPinToExchange] = useState<string>('');
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [showFolderModal, setShowFolderModal] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<'Video' | 'Image'>('Video');
  const [folderPrivacy, setFolderPrivacy] = useState<'private' | 'public'>('private');
  const [folderTimer, setFolderTimer] = useState<'once' | '6hrs' | '12hrs' | '24hrs' | '48hrs'>('24hrs');
  
  // MCP (Messaging Control Protocol) related states
  const [messages, setMessages] = useState<AIEnhcancedMCPMessage[]>([]);
  const [groups, setGroups] = useState<MCPGroup[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [showGroupModal, setShowGroupModal] = useState<boolean>(false);
  const [newChannelName, setNewChannelName] = useState<string>('');
  const [showChannelModal, setShowChannelModal] = useState<boolean>(false);
  
  // FingerOrbit related states
  const [fingerOrbitContent, setFingerOrbitContent] = useState<EnhancedMiiMedia[]>([]);
  const [monetizedFolders, setMonetizedFolders] = useState<MonetizedFolder[]>([]);
  const [showFingerOrbitModal, setShowFingerOrbitModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [newFolderType, setNewFolderType] = useState<'Video' | 'Image'>('Video');
  const [newFolderPrivacy, setNewFolderPrivacy] = useState<'private' | 'public'>('private');
  const [newFolderPricingType, setNewFolderPricingType] = useState<'free' | 'subscription' | 'pay-per-view' | 'one-time'>('free');
  const [newFolderPricingAmount, setNewFolderPricingAmount] = useState<number>(0);
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [mediaAccessList, setMediaAccessList] = useState<MediaAccess[]>([]);
  
  // Privacy and security settings
  const [privacySettings, setPrivacySettings] = useState({
    canViewMyStatus: true,
    canViewMyActivity: true,
    canViewMyMii: true,
    readReceiptsEnabled: true,
    disappearingMessagesEnabled: true
  });
  
  // AI-Enhanced features states
  const [aiContentModeration, setAiContentModeration] = useState<AIContentModeration[]>([]);
  const [aiInsights, setAiInsights] = useState<AiInsights | null>(null);
  const [aiSmartReplies, setAiSmartReplies] = useState<string[]>([]);
  const [aiAutoModeration, setAiAutoModeration] = useState<boolean>(true);
  const [aiContentSuggestions, setAiContentSuggestions] = useState<string[]>([]);
  
  // Security features
  const [securityAlerts, setSecurityAlerts] = useState<string[]>([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [lastSecurityScan, setLastSecurityScan] = useState<Date | null>(null);
  
  // Engagement features
  const [engagementMetrics, setEngagementMetrics] = useState({
    total_views: 0,
    total_reactions: 0,
    total_replies: 0,
    engagement_rate: 0
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize VoiceLineService
  useEffect(() => {
    const initVoiceService = async () => {
      try {
        await VoiceLineService.initialize();
        console.log('VoiceLineService initialized in MiiPage');
      } catch (error) {
        console.error('Failed to initialize VoiceLineService:', error);
      }
    };

    initVoiceService();
  }, []);

  // Voice line functions
  const playVoiceLine = async (text: string) => {
    try {
      await VoiceLineService.playVoiceLine(text);
    } catch (error) {
      console.error('Error playing voice line:', error);
    }
  };

  const playVoiceLineByCategory = async (category: VoiceLineCategory) => {
    try {
      const voiceLine = VoiceLineService.getRandomVoiceLineByCategory(category);
      if (voiceLine) {
        await VoiceLineService.playVoiceLine(voiceLine.text);
      }
    } catch (error) {
      console.error('Error playing voice line by category:', error);
    }
  };

  // Load member profile on component mount
  useEffect(() => {
    fetchMemberProfile();
    fetchMessages();
    fetchGroups();
    fetchFingerOrbitContent();
    fetchMonetizedFolders();
    fetchEarnings();
    fetchAnalytics();
    fetchMediaAccessList();
    fetchAiInsights();
    runSecurityScan();
  }, []);

  // Play voice line based on specific events
  const triggerVoiceLine = async (eventType: string) => {
    switch (eventType) {
      case 'achievement':
        await playVoiceLineByCategory('achievement');
        break;
      case 'greeting':
        await playVoiceLineByCategory('greeting');
        break;
      case 'success':
        await playVoiceLineByCategory('general');
        break;
      case 'earnings':
        await playVoiceLineByCategory('earnings');
        break;
      case 'combo':
        // Play a random combo voice line
        const comboCategories: VoiceLineCategory[] = ['combo_small', 'combo_large', 'combo_colossal'];
        const randomComboCategory = comboCategories[Math.floor(Math.random() * comboCategories.length)];
        await playVoiceLineByCategory(randomComboCategory);
        break;
      case 'surprise':
        await playVoiceLineByCategory('surprise');
        break;
      case 'request':
        await playVoiceLineByCategory('request');
        break;
      case 'funding':
        await playVoiceLineByCategory('funding');
        break;
      default:
        await playVoiceLineByCategory('general');
    }
  };


  // Missing functions that need to be added
  const fetchGroups = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, we'll create mock groups
      const mockGroups: MCPGroup[] = [
        {
          id: 'group-1',
          name: 'Family Group',
          type: 'group',
          members: ['member-123', 'member-456', 'member-789'],
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          description: 'Family discussions'
        },
        {
          id: 'channel-1',
          name: 'Tech Updates',
          type: 'channel',
          members: ['member-123', 'member-456', 'member-789', 'member-101'],
          createdAt: new Date(Date.now() - 172800000), // 2 days ago
          description: 'Latest tech news'
        }
      ];
      
      setGroups(mockGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchFingerOrbitContent = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, we'll create mock FingerOrbit content
      const mockContent: EnhancedMiiMedia[] = [
        {
          id: 'fob-1',
          owner_id: 'member-456',
          folder_id: 'folder-2',
          type: 'image',
          url: 'https://via.placeholder.com/400x600',
          upload_date: new Date(Date.now() - 3600000),
          expiry_date: new Date(Date.now() + 172800000), // 48 hours from now
          caption: 'Exclusive photo from my trip',
          reactions: 25,
          views: 89,
          is_public: false,
          pricing_model: { type: 'pay-per-view', amount: 1.99, currency: 'USD' },
          can_download: false,
          purchase_status: 'not_purchased',
          is_censored: false,
          // AI-enhanced properties
          ai_analysis: {
            content_tags: ['travel', 'nature', 'adventure'],
            sentiment: 'positive',
            auto_censorship_risk: 5,
            recommendation_score: 92
          },
          content_moderation: [
            {
              id: 'fob-mod-1',
              content_type: 'image',
              content_url: 'https://via.placeholder.com/400x600',
              detected_objects: ['mountains', 'lake', 'trees'],
              flagged_content: false,
              confidence_score: 95,
              moderation_timestamp: new Date(Date.now() - 3600000),
              category: 'other',
              auto_action_taken: 'none'
            }
          ],
          is_tokenized: true,
          requires_pin: true
        }
      ];
      
      setFingerOrbitContent(mockContent);
    } catch (error) {
      console.error('Error fetching FingerOrbit content:', error);
    }
  };

  const fetchMonetizedFolders = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, we'll create mock monetized folders
      const mockFolders: MonetizedFolder[] = [
        {
          id: 'mf-1',
          owner_id: 'member-123',
          name: 'Vacation Photos',
          type: 'image',
          privacy: 'public',
          pricing_model: { type: 'subscription', amount: 4.99, currency: 'USD' },
          monetization_type: 'subscription',
          timer: '24hrs',
          can_download: false,
          total_views: 1200,
          total_reactions: 240,
          earnings: 123.45,
          is_tokenized: true,
          requires_pin: true
        }
      ];
      
      setMonetizedFolders(mockFolders);
    } catch (error) {
      console.error('Error fetching monetized folders:', error);
    }
  };

  const fetchEarnings = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, we'll create mock earnings
      const mockEarnings = {
        total_earnings: 1234.56,
        total_media_items: 45,
        total_views: 12345,
        total_downloads: 678,
        total_purchases: 234
      };
      
      setEarnings(mockEarnings);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, we'll create mock analytics
      const mockAnalytics: Analytics = {
        mediaAnalytics: [
          {
            type: 'image',
            total_items: 30,
            total_views: 8000,
            total_revenue: 500.00
          },
          {
            type: 'video',
            total_items: 15,
            total_views: 4000,
            total_revenue: 700.00
          }
        ]
      };
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchMediaAccessList = async () => {
    try {
      // In a real app, this would fetch from an API
      const mockMediaAccessList: MediaAccess[] = [
        {
          id: 'ma-1',
          media_id: 'media-abc',
          owner_name: 'Alice Johnson',
          folder_name: 'Exclusive Content',
          granted_at: new Date(Date.now() - 86400000), // 1 day ago
          expiry_date: new Date(Date.now() + 86400000 * 7), // 7 days from now
        },
        {
          id: 'ma-2',
          media_id: 'media-xyz',
          owner_name: 'Bob Williams',
          folder_name: 'Premium Videos',
          granted_at: new Date(Date.now() - 172800000), // 2 days ago
          expiry_date: new Date(Date.now() + 86400000 * 3), // 3 days from now
        }
      ];
      setMediaAccessList(mockMediaAccessList);
    } catch (error) {
      console.error('Error fetching media access list:', error);
    }
  };

  const handlePurchase = async (itemId: string, itemType: string, amount: number) => {
    try {
      // Simulate API call for purchase
      console.log(`Purchasing ${itemType} with ID ${itemId} for ${amount}`);
      // In a real app, integrate with payment gateway
      alert(`Successfully purchased ${itemType}!`);
      triggerVoiceLine('earnings'); // Trigger voice line on successful purchase
    } catch (error) {
      console.error('Error during purchase:', error);
    }
  };


  const handleCreateFingerOrbitFolder = () => {
    if (!newFolderName.trim()) {
      alert('FingerOrbit folder name cannot be empty.');
      return;
    }

    if (memberProfile) {
      const newMonetizedFolder: MonetizedFolder = {
        id: `monetized-folder-${Date.now()}`,
        owner_id: memberProfile.id,
        name: newFolderName,
        type: newFolderType,
        privacy: newFolderPrivacy,
        pricing_model: {
          type: newFolderPricingType,
          amount: newFolderPricingAmount,
          currency: 'USD'
        },
        monetization_type: newFolderPricingType === 'subscription' ? 'subscription' : 'one-time', // Simplified
        timer: folderTimer,
        can_download: true,
        total_views: 0,
        total_reactions: 0,
        earnings: 0,
        is_tokenized: true,
        requires_pin: false
      };

      setMonetizedFolders(prevFolders => [...prevFolders, newMonetizedFolder]);
      setNewFolderName('');
      setShowFingerOrbitModal(false);
      triggerVoiceLine('achievement');
            }
          };

          const handleCreateFolder = () => {
    if (!folderName.trim()) {
      alert('Folder name cannot be empty.');
      return;
    }
    if (memberProfile) {
      const newFolder: EnhancedMiiFolder = {
        id: `folder-${Date.now()}`,
        name: folderName,
        type: folderPrivacy,
        privacy_setting: folderPrivacy,
        pricing_model: {
          type: 'free', // Default to free for regular folders
          amount: 0,
          currency: 'USD'
        },
        content: [],
        visibilityTimer: folderTimer,
        can_download: true,
        is_tokenized: false,
        requires_pin: false,
        ai_suggested_members: [],
        optimal_posting_members: [],
        audience_demographics: {
          age_groups: {},
          interests: [],
          location: []
        }
      };
      setMemberProfile(prevProfile => {
        if (!prevProfile) return null;
        return {
          ...prevProfile,
          folders: [...prevProfile.folders, newFolder]
        };
      });
      setFolderName('Video'); // Reset to default
      setFolderPrivacy('private'); // Reset to default
      setFolderTimer('24hrs'); // Reset to default
      setShowFolderModal(false);
      triggerVoiceLine('achievement');
    }
  };

  const handleCreateGroup = async () => {
            if (!newGroupName.trim()) {
              alert('Group name cannot be empty.');
              return;
            }
        
            if (memberProfile) {
              const newGroup: MCPGroup = {
                id: `group-${Date.now()}`,
                name: newGroupName,
                type: 'group',
                members: [memberProfile.id], // Creator is the first member
                createdAt: new Date(),
                description: '', // Can be added later
              };
        
              setGroups(prevGroups => [...prevGroups, newGroup]);
              setNewGroupName('');
              setShowGroupModal(false);
              triggerVoiceLine('achievement'); // Trigger voice line on group creation
            }
          };

          const handleCreateChannel = () => {
            if (!newChannelName.trim()) {
              alert('Channel name cannot be empty.');
              return;
            }
        
            if (memberProfile) {
              const newChannel: MCPGroup = {
                id: `channel-${Date.now()}`,
                name: newChannelName,
                type: 'channel',
                members: [memberProfile.id], // Creator is the first member
                createdAt: new Date(),
                description: '', // Can be added later
              };
        
              setGroups(prevGroups => [...prevGroups, newChannel]);
              setNewChannelName('');
              setShowChannelModal(false);
              triggerVoiceLine('achievement'); // Trigger voice line on channel creation
            }
          };

          const handleReplyToUpdate = (updateId: string, replyContent: string) => {
            if (!replyContent.trim()) {
              alert('Reply cannot be empty.');
              return;
            }

            if (memberProfile) {
              setMemberProfile(prevProfile => {
                if (!prevProfile) return null;

                const updatedMiiUpdates = prevProfile.miiUpdates.map(update => {
                  if (update.id === updateId) {
                    const newReply: MiiReply = {
                      id: `reply-${Date.now()}`,
                      authorId: prevProfile.id,
                      authorName: prevProfile.name,
                      content: replyContent,
                      timestamp: new Date(),
                      reactions: {}
                    };
                    return {
                      ...update,
                      replies: [...update.replies, newReply]
                    };
                  }
                  return update;
                });

                return {
                  ...prevProfile,
                  miiUpdates: updatedMiiUpdates
                };
              });
              setNewReply(prev => ({ ...prev, [updateId]: '' })); // Clear the reply input for this update
              triggerVoiceLine('achievement'); // Trigger voice line on adding a reply
            }
          };

          const handleExchangePin = () => {
            if (!pinToExchange.trim()) {
              alert('PIN cannot be empty.');
              return;
            }

            if (memberProfile) {
              // In a real app, this would involve validating the pin with a backend service
              // and updating the other member's profile as well.
              // For now, we simulate a successful exchange.
              setMemberProfile(prevProfile => {
                if (!prevProfile) return null;
                return {
                  ...prevProfile,
                  hasExchangedPins: true,
                  // Add the exchanged pin's owner to trusted contacts if applicable
                  trustedContacts: [...prevProfile.trustedContacts, `contact-for-${pinToExchange}`]
                };
              });
              setPinToExchange('');
              setShowPinModal(false);
              triggerVoiceLine('achievement'); // Trigger voice line on successful pin exchange
            }
          };


  const fetchMemberProfile = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, we'll create a mock member profile with AI enhancements
      const mockProfile: EnhancedMemberProfile = {
        id: 'member-123',
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/100',
        bio: 'Just sharing my moments!',
        followers: 128,
        following: 89,
        miiUpdates: [
          {
            id: 'update-1',
            authorId: 'member-456',
            authorName: 'Jane Smith',
            authorAvatar: 'https://via.placeholder.com/100',
            media: [
              {
                id: 'media-1',
                owner_id: 'member-456',
                folder_id: 'folder-1',
                type: 'image',
                url: 'https://via.placeholder.com/400x600',
                upload_date: new Date(Date.now() - 3600000),
                expiry_date: new Date(Date.now() + 172800000), // 48 hours from now
                caption: 'Beautiful sunset today!',
                reactions: 45,
                views: 120,
                is_public: true,
                pricing_model: { type: 'free', amount: 0, currency: 'USD' },
                can_download: true,
                purchase_status: 'public',
                is_censored: false,
                // AI-enhanced properties
                ai_analysis: {
                  content_tags: ['sunset', 'nature', 'scenic'],
                  sentiment: 'positive',
                  auto_censorship_risk: 5,
                  recommendation_score: 85
                },
                content_moderation: [
                  {
                    id: 'mod-1',
                    content_type: 'image',
                    content_url: 'https://via.placeholder.com/400x600',
                    detected_objects: ['sunset', 'mountains', 'water'],
                    flagged_content: false,
                    confidence_score: 95,
                    moderation_timestamp: new Date(Date.now() - 3600000),
                    category: 'other',
                    auto_action_taken: 'none'
                  }
                ]
              }
            ],
            caption: 'Enjoying the weekend vibes',
            timestamp: new Date(Date.now() - 3600000),
            reactions: { '👍': ['member-789'], '❤️': ['member-101', 'member-102'] },
            replies: [
              {
                id: 'reply-1',
                authorId: 'member-789',
                authorName: 'Mike Johnson',
                content: 'Looks amazing!',
                timestamp: new Date(Date.now() - 1800000),
                reactions: { '😂': ['member-456'] }
              }
            ],
            mentions: [],
            privacySettings: {
              visibility: 'contacts',
              excludedContacts: [],
              includedContacts: []
            },
            isViewed: false,
            isDisappearing: false,
            // AI-enhanced properties
            ai_analysis: {
              sentiment: 'positive',
              keywords: ['weekend', 'vibes', 'enjoying'],
              content_tags: ['personal', 'leisure'],
              engagement_prediction: 78,
              auto_categorization: 'personal'
            },
            content_moderation: [
              {
                id: 'mod-1',
                content_type: 'text',
                content_url: '',
                detected_objects: [],
                flagged_content: false,
                confidence_score: 98,
                moderation_timestamp: new Date(Date.now() - 3600000),
                category: 'other',
                auto_action_taken: 'none'
              }
            ]
          }
        ],
        folders: [
          {
            id: 'folder-1',
            name: 'Video',
            type: 'public',
            privacy_setting: 'public',
            pricing_model: { type: 'free', amount: 0, currency: 'USD' },
            content: [
              {
                id: 'vid-1',
                owner_id: 'member-123',
                folder_id: 'folder-1',
                type: 'video',
                url: 'https://example.com/video.mp4',
                thumbnail: 'https://via.placeholder.com/400x600',
                duration: 120,
                upload_date: new Date(Date.now() - 7200000),
                expiry_date: new Date(Date.now() + 86400000), // 24 hours from now
                reactions: 5,
                views: 23,
                is_public: true,
                pricing_model: { type: 'pay-per-view', amount: 1.99, currency: 'USD' },
                can_download: false,
                is_tokenized: true,
                requires_pin: true,
                // AI-enhanced properties
                ai_analysis: {
                  content_tags: ['tutorial', 'how-to'],
                  sentiment: 'neutral',
                  auto_censorship_risk: 10,
                  recommendation_score: 75
                },
                content_moderation: [
                  {
                    id: 'mod-2',
                    content_type: 'video',
                    content_url: 'https://example.com/video.mp4',
                    detected_objects: ['person', 'screen'],
                    flagged_content: false,
                    confidence_score: 90,
                    moderation_timestamp: new Date(Date.now() - 7200000),
                    category: 'other',
                    auto_action_taken: 'none'
                  }
                ]
              }
            ],
            visibilityTimer: '24hrs',
            can_download: false,
            is_tokenized: true,
            requires_pin: true,
            // AI-enhanced properties
            ai_suggestions: [
              'Add more descriptive captions',
              'Post during evening hours for higher engagement',
              'Include trending hashtags'
            ],
            optimal_posting_times: ['18:00', '20:00', '22:00'],
            audience_demographics: {
              age_groups: { '18-24': 30, '25-34': 45, '35-44': 20, '45+': 5 },
              interests: ['technology', 'education', 'how-to'],
              location: ['US', 'UK', 'CA']
            }
          }
        ],
        contacts: [
          {
            id: 'contact-1',
            name: 'Alice Johnson',
            avatar: 'https://via.placeholder.com/100',
            isFollowing: true,
            hasMiiAccess: true,
            lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
            currentlyListening: 'Artist - Song Title',
            trustedFollower: true,
            publicActivityEnabled: true,
            canViewStatus: true,
            canViewActivity: true,
            // Security features
            security_level: 'high',
            trusted_since: new Date(Date.now() - 2592000000), // 30 days ago
            // Engagement features
            interaction_frequency: 5,
            shared_interests: ['technology', 'photography', 'travel'],
            last_interacted: new Date(Date.now() - 1800000) // 30 minutes ago
          }
        ],
        miiPin: 'MII-7890',
        hasExchangedPins: true,
        trustedContacts: ['contact-1'],
        onlineStatus: 'online',
        canViewMyStatus: true,
        canViewMyActivity: true,
        canViewMyMii: true,
        readReceiptsEnabled: true,
        monetizedFolders: [
          {
            id: 'folder-1',
            owner_id: 'member-123',
         Memberame: 'Vacation Photos',
            type: 'image',
            privacy: 'public',
            pricing_model: { type: 'subscription', amount: 4.99, currency: 'USD' },
            monetization_type: 'subscription',
            timer: '24hrs',
            can_download: false,
            total_views: 1200,
            total_reactions: 240,
            earnings: 123.45,
            is_tokenized: true,
            requires_pin: true
          }
        ],
        // Security features
        account_security_level: 'high',
        two_factor_enabled: true,
        last_security_scan: new Date(Date.now() - 86400000), // 1 day ago
        // AI-Enhanced features
        ai_insights: {
          best_content_types: ['image', 'video'],
          optimal_posting_times: ['19:00', '21:00'],
          audience_growth_trend: 'increasing',
          engagement_rate: 4.2
        }
      };
      
      setMemberProfile(mockProfile);
      setMemberProfile(mockProfile);
    } catch (error) {
      console.error('Error fetching member profile:', error);
    }
  };

  // ... existing functions continue ...

  const fetchMessages = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, we'll create mock messages with AI enhancements
      const mockMessages: AIEncancedMCPMessage[] = [
        {
          id: 'msg-1',
          senderId: 'member-456',
          recipientId: 'member-123',
          content: 'Hey there! How are you doing?',
          timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
          type: 'secure',
          status: 'read',
          isEncrypted: true,
          is_disappearing: false,
          // AI-enhanced properties
          sentiment_analysis: {
            sentiment: 'positive',
            confidence: 0.95
          },
          smart_reply_suggestions: [
            'I\'m doing great, thanks!',
            'Just working on some new features',
            'How about you?'
          ],
          auto_response_enabled: false
        },
        {
          id: 'msg-2',
          senderId: 'member-123',
          recipientId: 'member-456',
          content: 'I\'m doing great! Just working on some new features',
          timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
          type: 'secure',
          status: 'delivered',
          isEncrypted: true,
          is_disappearing: true,
          // AI-enhanced properties
          sentiment_analysis: {
            sentiment: 'positive',
            confidence: 0.87
          },
          smart_reply_suggestions: [
            'That sounds interesting!',
            'Show me when you\'re done',
            'What kind of features?'
          ],
          auto_response_enabled: false
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // ... existing functions continue ...

  const fetchAiInsights = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, we'll create mock AI insights
      const mockInsights = {
        content_performance: {
          top_posts: [
            { id: 'post-1', title: 'Beautiful sunset', engagement: 92 },
            { id: 'post-2', title: 'Tutorial video', engagement: 87 }
          ],
          content_type_performance: {
            image: { avg_engagement: 78, avg_shares: 12 },
            video: { avg_engagement: 85, avg_shares: 24 }
          }
        },
        audience_insights: {
          active_hours: ['18:00', '19:00', '20:00', '21:00'],
          member_locations: ['US', 'UK', 'CA', 'AU'],
          demographics: {
            age_groups: { '18-24': 30, '25-34': 45, '35-44': 20, '45+': 5 },
            interests: ['technology', 'photography', 'travel', 'food']
          }
        },
        ai_suggestions: [
          'Post more video content for higher engagement',
          'Schedule posts between 6-9 PM for maximum reach',
          'Include more travel-related hashtags'
        ]
      };
      
      setAiInsights(mockInsights);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    }
  };

  const runSecurityScan = () => {
    // Simulate a security scan
    const alerts = [
      'Two-factor authentication recommended',
      'Review contacts with Mii access',
      'Check privacy settings'
    ];
    
    setSecurityAlerts(alerts);
    setLastSecurityScan(new Date());
    
    if (memberProfile) {
      setMemberProfile({
        ...memberProfile,
        last_security_scan: new Date(),
        account_security_level: 'high'
      });
    }
  };

  const handleCreateUpdate = async () => {
    if (!newUpdate.trim() && selectedMedia.length === 0) {
      alert('Please add content to your update');
      return;
    }

    try {
      // In a real app, this would send to the API
      console.log('Creating update:', { newUpdate, selectedMedia, selectedPrivacy });
      
      // Simulate AI content analysis
      const mediaPromises = selectedMedia.map(async (file) => {
        // In a real app, this would send the file to an AI service for analysis
        console.log(`Analyzing media file: ${file.name}`);

        // Add to content moderation queue
        const newModeration: AIContentModeration = {
          id: `mod-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          content_type: file.type.includes('image') ? 'image' :
                        file.type.includes('video') ? 'video' : 'audio',
          content_url: URL.createObjectURL(file),
          detected_objects: ['example', 'content'],
          flagged_content: false,
          confidence_score: 95,
          moderation_timestamp: new Date(),
          category: 'other',
          auto_action_taken: 'none'
        };

        setAiContentModeration(prev => [...prev, newModeration]);

        // Create EnhancedMiiMedia object
        return {
          id: `media-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          owner_id: memberProfile.id,
          folder_id: 'updates', // Updates are not in a specific folder
          type: file.type.includes('image') ? 'image' :
                file.type.includes('video') ? 'video' : 'audio',
          url: URL.createObjectURL(file), // Use object URL for preview
          upload_date: new Date(),
          expiry_date: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from upload
          reactions: 0,
          views: 0,
          is_public: selectedPrivacy === 'public',
          pricing_model: { type: 'free', amount: 0, currency: 'USD' },
          can_download: true,
          ai_analysis: {
            content_tags: ['auto-generated'],
            sentiment: 'neutral',
            auto_censorship_risk: 10,
            recommendation_score: 50
          },
          content_moderation: [newModeration]
        } as EnhancedMiiMedia;
      });

      const newMedia = await Promise.all(mediaPromises);

      const newMiiUpdate: AIEnhcancedMiiUpdate = {
        id: `update-${Date.now()}`,
        authorId: memberProfile.id,
        authorName: memberProfile.name,
        authorAvatar: memberProfile.avatar,
        media: newMedia,
        caption: newUpdate,
        timestamp: new Date(),
        reactions: {},
        replies: [],
        mentions: [],
        privacySettings: {
          visibility: selectedPrivacy,
          excludedContacts: selectedPrivacy === 'custom' ? excludedContacts : [],
          includedContacts: selectedPrivacy === 'custom' ? includedContacts : []
        },
        isViewed: false,
        isDisappearing: false, // Default to not disappearing
        ai_analysis: {
          sentiment: 'neutral', // Placeholder
          keywords: newUpdate.split(' ').filter(word => word.length > 2),
          content_tags: ['member-generated'],
          engagement_prediction: 0,
          auto_categorization: 'personal'
        },
        content_moderation: [], // Will be populated by AI analysis
      };

      setMemberProfile(prevProfile => {
        if (!prevProfile) return null;
        return {
          ...prevProfile,
          miiUpdates: [newMiiUpdate, ...prevProfile.miiUpdates], // Add new update to the beginning
        };
      });
      
      // Reset form
      setNewUpdate('');
      setSelectedMedia([]);
      
      triggerVoiceLine('achievement');
    } catch (error) {
      console.error('Error creating update:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      alert('Please type a message to send.');
      return;
    }

    const messageToSend: AIEnhcancedMCPMessage = {
      id: `msg-${Date.now()}`,
      senderId: memberProfile.id, // Assuming current member is sender
      recipientId: 'member-456', // Placeholder for recipient
      content: newMessage,
      timestamp: new Date(),
      type: 'secure',
      status: 'delivered',
      isEncrypted: true,
      is_disappearing: false, // Default to not disappearing
      sentiment_analysis: { sentiment: 'neutral', confidence: 0.5 }, // Placeholder
      smart_reply_suggestions: [],
      auto_response_enabled: false
    };

    setMessages(prevMessages => [...prevMessages, messageToSend]);
    setNewMessage('');
    triggerVoiceLine('success');
  };

  const handleAddReply = (updateId: string) => {
    if (!newReply[updateId] || !newReply[updateId].trim()) {
      alert('Please type a reply to add.');
      return;
    }

    if (memberProfile) {
      setMemberProfile(prevProfile => {
        if (!prevProfile) return null;

        const updatedMiiUpdates = prevProfile.miiUpdates.map(update => {
          if (update.id === updateId) {
            const reply: MiiReply = {
              id: `reply-${Date.now()}`,
              authorId: prevProfile.id,
              authorName: prevProfile.name,
              content: newReply[updateId],
              timestamp: new Date(),
              reactions: {}
            };
            return {
              ...update,
              replies: [...update.replies, reply]
            };
          }
          return update;
        });

        return {
          ...prevProfile,
          miiUpdates: updatedMiiUpdates
        };
      });
      setNewReply(prev => {
        const newState = { ...prev };
        delete newState[updateId];
        return newState;
      });
      triggerVoiceLine('achievement'); // Trigger voice line on adding a reply
    }
  };

  const handleAIContentModeration = () => {
    // Toggle AI auto moderation
    setAiAutoModeration(!aiAutoModeration);
    alert(`AI Content Moderation ${aiAutoModeration ? 'disabled' : 'enabled'}`);
  };

  const handleGenerateAISuggestion = () => {
    // Generate AI content suggestions
    const suggestions = [
      'Share a behind-the-scenes photo',
      'Post about your weekend plans',
      'Share a tip related to your interests',
      'Post a question to engage your followers'
    ];
    
    setAiContentSuggestions(suggestions);
    alert('AI has generated content suggestions for you!');
  };

  const handleSecurityAlert = (alert: string) => {
    // Handle a security alert
    console.log(`Security alert handled: ${alert}`);
    setSecurityAlerts(prev => prev.filter(a => a !== alert));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedMedia(files);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ... rest of the existing functions continue ...

  if (!memberProfile) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading Mii updates...
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
      }}>
        <h1 style={{ margin: 0 }}>Mii™©®</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setShowPinModal(true)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Exchange PIN
          </button>
          <button 
            onClick={() => setShowFolderModal(true)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create Folder
          </button>
          <button 
            onClick={() => setShowGroupModal(true)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create Group
          </button>
          <button 
            onClick={() => setShowChannelModal(true)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create Channel
          </button>
          <button 
            onClick={() => setShowFingerOrbitModal(true)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#FF5722',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create FingerOrbit
          </button>
          <button 
            onClick={() => setActiveTab('ai-insights')}
            style={{
              padding: '8px 12px',
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            AI Insights
          </button>
        </div>
      </header>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '15px',
          backgroundColor: '#f9f9f9'
        }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <img 
              src={memberProfile.avatar} 
              alt={memberProfile.name} 
              style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
            />
            <textarea
              value={newUpdate}
              onChange={(e) => setNewUpdate(e.target.value)}
              placeholder="Share a Mii update..."
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                resize: 'vertical',
                minHeight: '60px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <input 
              type="file" 
              multiple 
              accept="image/*,video/*,audio/*" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button 
              type="button"
              onClick={triggerFileInput}
              style={{
                padding: '8px 12px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Add Media
            </button>
            {selectedMedia.length > 0 && (
              <div style={{ display: 'inline', fontSize: '14px', color: '#666' }}>
                {selectedMedia.length} file(s) selected
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <label>
                Privacy: 
                <select 
                  value={selectedPrivacy}
                  onChange={(e) => setSelectedPrivacy(e.target.value as any)}
                  style={{ marginLeft: '5px' }}
                >
                  <option value="public">Public</option>
                  <option value="contacts">Contacts</option>
                  <option value="custom">Custom</option>
                </select>
              </label>
              <button
                onClick={handleGenerateAISuggestion}
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#9C27B0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                AI Suggest
              </button>
            </div>
            <button 
              onClick={handleCreateUpdate}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Share Update
            </button>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '20px',
        borderBottom: '1px solid #eee'
      }}>
        <button
          onClick={() => setActiveTab('updates')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'updates' ? '#2196F3' : '#f0f0f0',
            color: activeTab === 'updates' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'updates' ? 'bold' : 'normal'
          }}
        >
          Updates
        </button>
        <button
          onClick={() => setActiveTab('folders')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'folders' ? '#2196F3' : '#f0f0f0',
            color: activeTab === 'folders' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'folders' ? 'bold' : 'normal'
          }}
        >
          Folders
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'contacts' ? '#2196F3' : '#f0f0f0',
            color: activeTab === 'contacts' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'contacts' ? 'bold' : 'normal'
          }}
        >
          Contacts
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'profile' ? '#2196F3' : '#f0f0f0',
            color: activeTab === 'profile' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'profile' ? 'bold' : 'normal'
          }}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'messages' ? '#2196F3' : '#f0f0f0',
            color: activeTab === 'messages' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'messages' ? 'bold' : 'normal'
          }}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'groups' ? '#2196F3' : '#f0f0f0',
            color: activeTab === 'groups' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'groups' ? 'bold' : 'normal'
          }}
        >
          Groups & Channels
        </button>
        <button
          onClick={() => setActiveTab('fingerorbit')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'fingerorbit' ? '#2196F3' : '#f0f0f0',
            color: activeTab === 'fingerorbit' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'fingerorbit' ? 'bold' : 'normal'
          }}
        >
          FingerOrbit™©®
        </button>
        <button
          onClick={() => setActiveTab('ai-insights')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'ai-insights' ? '#9C27B0' : '#f0f0f0',
            color: activeTab === 'ai-insights' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'ai-insights' ? 'bold' : 'normal'
          }}
        >
          AI Insights
        </button>
      </div>

      {activeTab === 'updates' && (
        <div>
          <h2>Recent Mii Updates</h2>
          {memberProfile.miiUpdates.map(update => (
            <div 
              key={update.id} 
              style={{ 
                border: '1px solid #eee', 
                borderRadius: '8px', 
                padding: '15px', 
                marginBottom: '15px',
                backgroundColor: update.isViewed ? '#f9f9f9' : 'white',
                borderLeft: update.isDisappearing ? '4px solid #ff5722' : '4px solid transparent'
              }}
            >
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <img 
                  src={update.authorAvatar} 
                  alt={update.authorName} 
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
                />
                <div>
                  <div><strong>{update.authorName}</strong></div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    {update.timestamp.toLocaleString()}
                  </div>
                  {/* AI Insights for this update */}
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                    <span>AI: {update.ai_analysis.sentiment} sentiment • </span>
                    <span>Engagement prediction: {update.ai_analysis.engagement_prediction}% • </span>
                    <span>Category: {update.ai_analysis.auto_categorization}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                {update.caption}
              </div>
              
              {update.media.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  {update.media.map(media => (
                    <div key={media.id} style={{ marginBottom: '10px' }}>
                      {media.type === 'image' ? (
                        <img 
                          src={media.url} 
                          alt="Mii media" 
                          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '4px' }} 
                        />
                      ) : media.type === 'video' ? (
                        <video 
                          src={media.url} 
                          controls 
                          style={{ width: '100%', maxHeight: '400px', borderRadius: '4px' }} 
                        />
                      ) : (
                        <audio src={media.url} controls style={{ width: '100%' }} />
                      )}
                      {media.is_censored && (
                        <div style={{ 
                          position: 'absolute', 
                          top: '10px', 
                          left: '10px', 
                          backgroundColor: 'red', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          CENSORED
                        </div>
                      )}
                      {media.pricing_model.type !== 'free' && (
                        <div style={{ 
                          marginTop: '5px', 
                          padding: '5px', 
                          backgroundColor: '#fff3cd', 
                          borderRadius: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span>{media.pricing_model.amount} {media.pricing_model.currency} to access</span>
                          {!media.can_download && (
                            <button 
                              onClick={() => handlePurchaseContent(media.id, media.pricing_model.amount)}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              Buy Access
                            </button>
                          )}
                        </div>
                      )}
                      {/* AI Analysis for media */}
                      <div style={{ 
                        marginTop: '5px', 
                        padding: '5px', 
                        backgroundColor: '#e3f2fd', 
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        <div>AI Tags: {media.ai_analysis.content_tags.join(', ')}</div>
                        <div>Recommendation Score: {media.ai_analysis.recommendation_score}/100</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                {Object.entries(update.reactions).map(([emoji, members]) => (
                  <span key={emoji} style={{ cursor: 'pointer' }}>
                    {emoji} {members.length}
                  </span>
                ))}
                <span style={{ color: '#888' }}>|</span>
                <span style={{ cursor: 'pointer' }}>
                  {update.replies.length} replies
                </span>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                {update.replies.map(reply => (
                  <div key={reply.id} style={{ 
                    padding: '8px', 
                    backgroundColor: '#f0f8ff', 
                    borderRadius: '4px',
                    marginBottom: '5px'
                  }}>
                    <strong>{reply.authorName}</strong>: {reply.content}
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {reply.timestamp.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={newReply[update.id] || ''}
                  onChange={(e) => setNewReply(prev => ({ ...prev, [update.id]: e.target.value }))}
                  placeholder="Add a reply..."
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                <button 
                  onClick={() => handleAddReply(update.id)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ... other tabs remain the same ... */}

      {activeTab === 'ai-insights' && (
        <div>
          <h2>AI Insights & Analytics</h2>
          
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
            <h3>Content Performance</h3>
            {aiInsights ? (
              <div>
                <h4>Top Performing Posts:</h4>
                <ul>
                  {aiInsights.content_performance.top_posts.map((post: { id: string; title: string; engagement: number }) => (
                    <li key={post.id}>{post.title} - {post.engagement}% engagement</li>
                  ))}
                </ul>
                
                <h4>Content Type Performance:</h4>
                <div>
                  <p>Images: Avg. {aiInsights.content_performance.content_type_performance.image.avg_engagement}% engagement</p>
                  <p>Videos: Avg. {aiInsights.content_performance.content_type_performance.video.avg_engagement}% engagement</p>
                </div>
              </div>
            ) : (
              <p>Loading insights...</p>
            )}
          </div>
          
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h3>Audience Insights</h3>
            {aiInsights ? (
              <div>
                <h4>Active Hours:</h4>
                <p>{aiInsights.audience_insights.active_hours.join(', ')}</p>
                
                <h4>Top Locations:</h4>
                <p>{aiInsights.audience_insights.top_locations.join(', ')}</p>
                
                <h4>Demographics:</h4>
                <p>Age Groups: {Object.entries(aiInsights.audience_insights.demographics.age_groups)
                  .map(([group, percentage]) => `${group} (${percentage}%)`)
                  .join(', ')}</p>
                <p>Interests: {aiInsights.audience_insights.demographics.interests.join(', ')}</p>
              </div>
            ) : (
              <p>Loading insights...</p>
            )}
          </div>
          
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
            <h3>AI Suggestions</h3>
            {aiInsights ? (
              <ul>
                {aiInsights.ai_suggestions.map((suggestion: string, index: number) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            ) : (
              <p>Loading suggestions...</p>
            )}
          </div>
          
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
            <h3>AI Content Moderation</h3>
            <div style={{ marginBottom: '10px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={aiAutoModeration}
                  onChange={handleAIContentModeration}
                /> Enable AI Content Moderation
              </label>
            </div>
            
            <h4>Recent Moderation Actions:</h4>
            <ul>
              {aiContentModeration.slice(0, 5).map(moderation => (
                <li key={moderation.id}>
                  {moderation.content_type} content • 
                  Flagged: {moderation.flagged_content ? 'Yes' : 'No'} • 
                  Category: {moderation.category}
                </li>
              ))}
            </ul>
          </div>
          
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#ffebee', borderRadius: '8px' }}>
            <h3>Security Alerts</h3>
            <ul>
              {securityAlerts.map((alert, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>
                  {alert}
                  <button 
                    onClick={() => handleSecurityAlert(alert)}
                    style={{
                      marginLeft: '10px',
                      padding: '2px 6px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '10px'
                    }}
                  >
                    Resolve
                  </button>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={runSecurityScan}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Run Security Scan
            </button>
          </div>
          
          <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
            <h3>Content Suggestions</h3>
            <div style={{ marginBottom: '10px' }}>
              {aiContentSuggestions.length > 0 ? (
                <ul>
                  {aiContentSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              ) : (
                <p>No suggestions available. Click the button below to generate.</p>
              )}
            </div>
            
            <button 
              onClick={handleGenerateAISuggestion}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Generate Content Suggestions
            </button>
          </div>
        </div>
      )}

      {/* ... rest of the component ... */}
      
      {/* PIN Exchange Modal */}
      {showPinModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3>Exchange Mii PIN</h3>
            <p>Enter the Mii PIN of the contact you want to connect with:</p>
            <input
              type="text"
              value={pinToExchange}
              onChange={(e) => setPinToExchange(e.target.value)}
              placeholder="Enter Mii PIN (e.g. MII-1234)"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '15px'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => {
                  setShowPinModal(false);
                  setPinToExchange('');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handlePinExchange}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Exchange PIN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showFolderModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3>Create New Folder</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Folder Type: </label>
              <select
                value={folderName}
                onChange={(e) => setFolderName(e.target.value as 'Video' | 'Image')}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="Video">Video Folder</option>
                <option value="Image">Image Folder</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Privacy: </label>
              <select
                value={folderPrivacy}
                onChange={(e) => setFolderPrivacy(e.target.value as 'private' | 'public')}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Visibility Timer: </label>
              <select
                value={folderTimer}
                onChange={(e) => setFolderTimer(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="once">View Once</option>
                <option value="6hrs">6 Hours</option>
                <option value="12hrs">12 Hours</option>
                <option value="24hrs">24 Hours</option>
                <option value="48hrs">48 Hours</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => {
                  setShowFolderModal(false);
                  setFolderName('Video');
                  setFolderPrivacy('private');
                  setFolderTimer('24hrs');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateFolder}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showGroupModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3>Create New Group</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Group Name: </label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => {
                  setShowGroupModal(false);
                  setNewGroupName('');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateGroup}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Channel Modal */}
      {showChannelModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3>Create New Channel</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Channel Name: </label>
              <input
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="Enter channel name"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => {
                  setShowChannelModal(false);
                  setNewChannelName('');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateChannel}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#9C27B0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Channel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create FingerOrbit Modal */}
      {showFingerOrbitModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3>Create New FingerOrbit Folder</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Folder Name: </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Folder Type: </label>
              <select
                value={newFolderType}
                onChange={(e) => setNewFolderType(e.target.value as 'Video' | 'Image')}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="Video">Video Folder</option>
                <option value="Image">Image Folder</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Privacy: </label>
              <select
                value={newFolderPrivacy}
                onChange={(e) => setNewFolderPrivacy(e.target.value as 'private' | 'public')}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Pricing Model: </label>
              <select
                value={newFolderPricingType}
                onChange={(e) => setNewFolderPricingType(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="free">Free</option>
                <option value="subscription">Subscription</option>
                <option value="pay-per-view">Pay-per-View</option>
                <option value="one-time">One-time Purchase</option>
              </select>
            </div>
            
            {newFolderPricingType !== 'free' && (
              <div style={{ marginBottom: '15px' }}>
                <label>Price (USD): </label>
                <input
                  type="number"
                  value={newFolderPricingAmount}
                  onChange={(e) => setNewFolderPricingAmount(parseFloat(e.target.value) || 0)}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => {
                  setShowFingerOrbitModal(false);
                  setNewFolderName('');
                  setNewFolderType('Video');
                  setNewFolderPrivacy('private');
                  setNewFolderPricingType('free');
                  setNewFolderPricingAmount(0);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateFingerOrbitFolder}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#FF5722',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create FingerOrbit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showFolderModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3>Create New Folder</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Folder Type: </label>
              <select
                value={folderName}
                onChange={(e) => setFolderName(e.target.value as 'Video' | 'Image')}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="Video">Video Folder</option>
                <option value="Image">Image Folder</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Privacy: </label>
              <select
                value={folderPrivacy}
                onChange={(e) => setFolderPrivacy(e.target.value as 'private' | 'public')}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Visibility Timer: </label>
              <select
                value={folderTimer}
                onChange={(e) => setFolderTimer(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="once">View Once</option>
                <option value="6hrs">6 Hours</option>
                <option value="12hrs">12 Hours</option>
                <option value="24hrs">24 Hours</option>
                <option value="48hrs">48 Hours</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => {
                  setShowFolderModal(false);
                  setFolderName('Video');
                  setFolderPrivacy('private');
                  setFolderTimer('24hrs');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateFolder}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showGroupModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3>Create New Group</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Group Name: </label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => {
                  setShowGroupModal(false);
                  setNewGroupName('');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateGroup}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Channel Modal */}
      {showChannelModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3>Create New Channel</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Channel Name: </label>
              <input
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="Enter channel name"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => {
                  setShowChannelModal(false);
                  setNewChannelName('');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateChannel}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#9C27B0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Channel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create FingerOrbit Modal */}
      {showFingerOrbitModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3>Create New FingerOrbit Folder</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Folder Name: </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Folder Type: </label>
              <select
                value={newFolderType}
                onChange={(e) => setNewFolderType(e.target.value as 'Video' | 'Image')}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="Video">Video Folder</option>
                <option value="Image">Image Folder</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Privacy: </label>
              <select
                value={newFolderPrivacy}
                onChange={(e) => setNewFolderPrivacy(e.target.value as 'private' | 'public')}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Pricing Model: </label>
              <select
                value={newFolderPricingType}
                onChange={(e) => setNewFolderPricingType(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="free">Free</option>
                <option value="subscription">Subscription</option>
                <option value="pay-per-view">Pay-per-View</option>
                <option value="one-time">One-time Purchase</option>
              </select>
            </div>
            
            {newFolderPricingType !== 'free' && (
              <div style={{ marginBottom: '15px' }}>
                <label>Price (USD): </label>
                <input
                  type="number"
                  value={newFolderPricingAmount}
                  onChange={(e) => setNewFolderPricingAmount(parseFloat(e.target.value) || 0)}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => {
                  setShowFingerOrbitModal(false);
                  setNewFolderName('');
                  setNewFolderType('Video');
                  setNewFolderPrivacy('private');
                  setNewFolderPricingType('free');
                  setNewFolderPricingAmount(0);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateFingerOrbitFolder}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#FF5722',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create FingerOrbit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiiPage;