import React from 'react';

// ==========================================
// 1. Core Users & Sub-Profiles
// ==========================================

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  GUEST = 'guest'
}

export enum ThemeOption {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export enum VisibilityOption {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS_ONLY = 'friends_only'
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms?: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  profileVisibility: VisibilityOption;
  showEmail: boolean;
  allowMessaging: boolean;
}

export interface UserPreferences {
  theme: ThemeOption;
  language: string;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
}

export interface SubProfile {
  id: string;
  memberId: string;
  name: string;
  avatar?: string;
  avatarUrl?: string;
  animatedAvatarUrl?: string;
  type?: string;
  createdAt: string;
  isDefault: boolean;
  blockedContentIds: string[];
  [key: string]: any;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  role: UserRole;
  preferences?: UserPreferences;
  subProfiles?: Array<{
    id: string;
    name: string;
    avatarUrl?: string;
    animatedAvatarUrl?: string;
    type?: string;
  }>;
}

export interface Member {
  id: string;
  email: string;
  name: string;
  handle: string;
  membername?: string;
  avatar?: string;
  avatarUrl?: string;
  animatedAvatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  isSubscribed: boolean;
  isVerified: boolean;
  role: string;
  permissions: string[];
  loyaltyTier: string;
  subProfiles?: SubProfile[];
  activeSubProfileId?: string | null;
  phoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  multiFactorEnabled?: boolean;
  biometricEnrolled?: boolean;
  loyaltyPoints?: number;
  currentPlan?: string;
  subscriptionExpiryDate?: Date;
  following?: string[];
  faceIdEnabled?: boolean;
  fingerprintEnabled?: boolean;
  walletAddress?: string;
  location?: {
    country: string;
    region?: string;
  };
  preferences?: {
    interests: string[];
    genres: string[];
    values: string[];
  };
  engagementRate?: number;
  followerCount?: number;
  followingCount?: number;
  posts?: number;
  status?: 'active' | 'suspended' | 'pending' | 'inactive';
  lastActive?: string;
  joinDate?: string;
  phoneNumber?: string;
  twoFactorMethods?: string[];
  mfaMethods?: string[];
  backupCodes?: string[];
  metadata?: Record<string, unknown>;
}

export interface ManagedMember {
  id: string;
  userId: string;
  managerId: string;
  permissions: string[];
  assignedAt: Date;
}

// ==========================================
// 2. E-Commerce & Inventory
// ==========================================

export enum CurrencyCode {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  CNY = 'CNY',
  INR = 'INR',
  NGN = 'NGN',
  CAD = 'CAD',
  AUD = 'AUD',
  CHF = 'CHF',
  MXN = 'MXN',
  BRL = 'BRL'
}

export enum ProductCondition {
  NEW = 'new',
  LIKE_NEW = 'like_new',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended'
}

export interface MediaAsset {
  id: string;
  url: string;
  type: string;
  thumbnailUrl?: string;
}

export interface RatingInfo {
  average: number;
  count: number;
  distribution: Record<number, number>;
}

export interface ShippingMethod {
  id: string;
  name: string;
  cost: number;
  estimatedDelivery: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ReturnPolicy {
  period: number; // in days
  conditions: string;
  refundMethod: string;
}

export interface Warranty {
  duration: string;
  coverage: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: Record<string, string>;
  price: number;
  stock: number;
}

export interface BundleItem {
  productId: string;
  quantity: number;
  name: string;
}

export interface SeoMeta {
  title: string;
  description?: string;
  keywords: string[];
  ogImage?: string;
}

export interface Inventory {
  quantity: number;
  reserved: number;
  available: number;
  minThreshold: number;
}

export interface ProductStatus {
  active: boolean;
  listed: boolean;
  verified: boolean;
}

export interface Review {
  id: string;
  productId: string;
  memberId: string;
  rating: number;
  title?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  helpful?: number;
  verified?: boolean;
  [key: string]: any;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: CurrencyCode;
  category: string;
  tags: string[];
  images: MediaAsset[];
  rating: RatingInfo;
  createdAt: Date;
  updatedAt: Date;
  inStock: boolean;
  shippingMethods: ShippingMethod[];
  storeId: string;
  sellerId: string;
  specs: Record<string, unknown>;
  reviews: Review[];
  discountPercentage?: number;
  featuredImage?: string;
  status: ProductStatus;
  inventory: Inventory;
  seoMeta?: SeoMeta;
  variants?: ProductVariant[];
  brand?: string;
  weight?: number;
  dimensions?: Dimensions;
  handlingTime?: string;
  returnPolicy?: ReturnPolicy;
  warranty?: Warranty;
  customAttributes?: Record<string, unknown>;
  salesCount?: number;
  viewsCount?: number;
  favoritesCount?: number;
  availabilityDate?: Date;
  isTaxable?: boolean;
  bundleItems?: BundleItem[];
  metadata?: Record<string, unknown>;
}

export interface ProductInterface {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
  reviewCount?: number;
  rating?: number;
  platform?: string;
  popularity?: number;
  sellerId?: string;
  seller?: {
    id: string;
    name: string;
  };
  salesCount?: number;
  ownitExclusive?: boolean;
  isLiked: boolean;
  likesCount?: number;
  tags?: string[];
  [key: string]: any;
}

export interface MarketplaceProductStats {
  views: number;
  favorites: number;
  orders: number;
  reviews: number;
  avgRating: number;
}

export interface MarketplaceProduct {
  id: string;
  sellerId: string;
  name: string;
  description?: string;
  price: number;
  currency: CurrencyCode;
  category: string;
  subcategory?: string;
  condition: ProductCondition;
  images: MediaAsset[];
  video?: MediaAsset;
  stockQuantity: number;
  reservedQuantity: number;
  soldQuantity: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  attributes: Record<string, string>;
  shippingOptions: ShippingMethod[];
  returnPolicy: string;
  warranty?: string;
  brand?: string;
  model?: string;
  specs?: Record<string, string>;
  isActive: boolean;
  isListed: boolean;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  stats: MarketplaceProductStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  product: ProductInterface;
  quantity: number;
  price: number;
  variant?: string;
  options?: Record<string, string>;
  addedAt?: string;
  orderId?: string;
  [key: string]: any;
}

export interface WishlistItem {
  id: string;
  memberId: string;
  productId: string;
  addedAt: string;
  [key: string]: any;
}

// ==========================================
// 3. Orders & Billing
// ==========================================

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CASH_ON_DELIVERY = 'cash_on_delivery'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface WithAuthor {
  authorId: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations?: Record<string, unknown>;
}

export interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  contactName?: string;
  phone?: string;
}

export interface Order extends Timestamps, WithAuthor {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  currency: CurrencyCode;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod?: string;
  paymentStatus?: string;
  notes?: string;
  trackingNumber?: string;
}

export interface OrderWithCartItemsFields {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  paymentStatus?: string;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreOrder {
  id: string;
  userId: string;
  items: any[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  amount: number;
  currency: CurrencyCode;
  processedAt?: Date;
}

export interface Wallet {
  id: string;
  memberId: string;
  balance: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface BillingHistory {
  id: string;
  userId: string;
  amount: number;
  service: string;
  date: Date;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl?: string;
}

export interface Earning {
  id: string;
  userId: string;
  amount: number;
  source: string;
  date: Date;
  status: 'pending' | 'paid' | 'cancelled';
}

export interface PayoutRequest {
  id: string;
  userId: string;
  amount: number;
  method: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: Date;
  processedAt?: Date;
}

export interface GiftCard {
  id: string;
  code: string;
  balance: number;
  currency: string;
  issuedTo: string;
  issuedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface Paylink {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  description?: string;
  url: string;
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrderAmount?: number;
  expirationDate: Date;
  isActive: boolean;
}

// ==========================================
// 4. Social & Publishing Content
// ==========================================

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

export enum PostType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  LINK = 'link',
  LIVE_STREAM = 'live_stream'
}

export enum PostPrivacy {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  PRIVATE = 'private',
  CUSTOM = 'custom'
}

export enum PostVisibility {
  SHOW = 'show',
  HIDE = 'hide',
  DELETE = 'delete'
}

export interface PostMetadata {
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  readingTime?: number;
}

export interface ContentItem {
  id: string;
  type: string;
  title: string;
  content: string;
  authorId: string;
  timestamp: string;
  createdAt: Date;
  likesCount: number;
  repliesCount: number;
  repostsCount: number;
  bookmarksCount: number;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isReposted: boolean;
  tags: string[];
  author?: User;
}

export interface Post extends ContentItem {
  id: string;
  content: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  gallery?: string[];
  category: string;
  readTime?: number;
  status: ContentStatus;
  publishedAt?: Date;
  views?: number;
  likes: number; // legacy prop
  dislikesCount?: number;
  shares: number;
  commentsEnabled?: boolean;
  featured?: boolean;
  relatedPosts?: string[];
  metadata?: Record<string, unknown>;
  author?: User;
  isLiked: boolean;
  isDisliked?: boolean;
  censorship?: unknown;
}

export interface SocialMediaPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  authorId: string;
  createdAt: Date;
  updatedAt?: Date;
  status: ContentStatus;
  tags?: string[];
  category?: string;
  featuredImage?: string;
  metadata?: PostMetadata;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  author?: User;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies?: Comment[];
  author?: User;
}

export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  title: string;
  [key: string]: any;
}

export interface MediaTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  thumbnailUrl: string;
  previewUrl: string;
  downloadUrl?: string;
  fileSize?: number;
  fileType?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isPublic: boolean;
  usageCount: number;
  ratings: number;
  licenseType: string;
}

export interface PhotoCredit {
  id: string;
  uploaderId: string;
  imageUrl: string;
  title: string;
  description?: string;
  uploadDate: Date;
  license: string;
}

export interface PhotoCreditItem {
  id: string;
  uploader: Member;
  image: string;
  videoUrl?: string;
  title: string;
  description?: string;
  stats: {
    upvotes: number;
    downvotes: number;
    shares: number;
    downloads: number;
  };
  orientation: 'portrait' | 'landscape' | 'square';
  color?: string;
  [key: string]: any;
}

// ==========================================
// 5. Communications, System Status, & Security
// ==========================================

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  [key: string]: any;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
  [key: string]: any;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}

export interface Notification {
  id: string | number;
  userId?: string;
  member?: string;
  memberAvatar?: string;
  action?: string;
  message?: string;
  content?: string;
  type: string;
  read?: boolean;
  isRead?: boolean;
  createdAt?: string;
  timestamp?: string;
  [key: string]: any;
}

export interface FlaggedContent {
  id: string;
  contentId: string;
  reporterId: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'removed' | 'dismissed';
  flaggedAt: Date;
  reviewedAt?: Date;
  reviewerId?: string;
}

export interface MemberPolicy {
  id: string;
  memberId: string;
  policyType: string;
  policyValue: string;
  effectiveDate: Date;
  expiryDate?: Date;
}

export interface LinkedAccount {
  id: string;
  memberId: string;
  provider: string;
  providerId: string;
  connectedAt: Date;
  isActive: boolean;
}

export interface SessionInfo {
  id: string;
  userId: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  startedAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface BehavioralAnalysis {
  id: string;
  userId: string;
  activityPattern: string;
  riskScore: number;
  analysisDate: Date;
  recommendations: string[];
}

export interface GuardianSystemStatus {
  id: string;
  systemName: string;
  status: 'operational' | 'degraded' | 'down';
  lastChecked: Date;
  incidentReport?: string;
}

export interface GuardianAlert {
  id: string;
  userId: string;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  triggeredAt: Date;
  resolvedAt?: Date;
  isResolved: boolean;
}

export interface SystemStatus {
  id: string;
  service: string;
  status: 'operational' | 'degraded' | 'outage';
  lastUpdated: Date;
  message?: string;
}

export interface FeatureToggle {
  id: string;
  featureName: string;
  isEnabled: boolean;
  rolloutPercentage?: number;
  targetedUsers?: string[];
}

// ==========================================
// 6. Navigation, Discovery, & Gamification
// ==========================================

export interface Trend {
  id: string;
  title: string;
  description?: string;
  category: string;
  postsCount: number;
  isTrending: boolean;
  priority: number;
}

export interface SuggestedMember {
  id: string;
  name: string;
  username: string;
  avatar: string;
  mutualConnections: number;
  commonInterests: string[];
  isFollowing: boolean;
  reason: string;
  member: string;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  isTrending: boolean;
  coverImageUrl: string;
  postsCount: number;
  followers: number;
  isFollowing: boolean;
  icon: string;
}

export interface Hashtag {
  id: string;
  name: string;
  isTrending: boolean;
  category: string;
  frequency: number;
}

export interface NavigationSection {
  id: string;
  title: string;
  icon: string;
  route?: string;
  links: Array<{
    name: string;
    path: string;
    icon: string;
  }>;
  badge?: number;
}

export interface ForumCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  postCount: number;
  rank: number;
  headerType: string;
  headerImage: string;
  headerTitle: string;
  headerTextColor: {
    color: string;
    opacity: number;
  };
  headerBackgroundColor: {
    color: string;
    opacity: number;
  };
  headerImageOverlayColor: {
    color: string;
    opacity: number;
  };
  pageUrl: string;
  parentId: string;
  postViewCount: number;
  priority: number;
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  reward: number;
  status: 'pending' | 'completed';
  referredAt: Date;
}

export interface LoyaltyReward {
  id: string;
  userId: string;
  points: number;
  rewardType: string;
  redeemedAt: Date;
}

// ==========================================
// 7. Interactive Features & Custom Systems
// ==========================================

export interface LiveStream {
  id: string;
  title: string;
  description?: string;
  streamerId: string;
  viewerCount: number;
  thumbnailUrl: string;
  isLive: boolean;
  startTime: string;
  scheduledEndTime?: string;
  category: string;
  tags: string[];
  viewers: string[];
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface VoiceLine {
  id: string;
  text: string;
  audioUrl: string;
  category: string;
  tags?: string[];
  keywords?: string[];
  emotion?: 'happy' | 'sad' | 'angry' | 'excited' | 'neutral';
  language?: string;
  duration?: number;
  isPremium?: boolean;
  downloadCount?: number;
  playCount?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export type VoiceLineCategory = string;

export interface VoiceTrigger {
  id: string;
  eventId: string;
  voiceLineId: string;
  conditions?: Record<string, unknown>;
  priority: number;
  [key: string]: any;
}

export interface VoicePack {
  id: string;
  name: string;
  description?: string;
  voiceLines: VoiceLine[];
  createdBy: string;
  isPremium: boolean;
  price?: number;
  currency?: string;
  [key: string]: any;
}

export interface Game {
  id: string;
  title: string;
  description?: string;
  genre: string;
  platform: string[];
  releaseDate: string;
  developer: string;
  publisher: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  price: number;
  currency: string;
  [key: string]: any;
}

export interface GameSession {
  id: string;
  gameId: string;
  hostId: string;
  players: string[];
  startTime: string;
  endTime?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  score?: number;
  winnerId?: string;
  [key: string]: any;
}

export interface PlayerStats {
  id: string;
  memberId: string;
  gameId: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  kills?: number;
  deaths?: number;
  score: number;
  lastPlayed: string;
  [key: string]: any;
}

export interface FlamingoSubmission {
  id: string;
  memberId: string;
  title: string;
  description?: string;
  mediaUrl: string;
  content?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  [key: string]: any;
}

export interface Enrollment {
  id: string;
  courseId: string;
  memberId: string;
  enrollmentDate: string;
  completionDate?: string;
  enrolledAt?: string;
  completedAt?: string;
  progress: number;
  status: 'enrolled' | 'completed' | 'dropped';
  certificateUrl?: string;
  [key: string]: any;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  ticketPrice: number;
  organizerId: string;
  maxAttendees: number;
  availableSeats: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface SupportTicket {
  id: string;
  memberId: string;
  subject: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  [key: string]: any;
}

export interface AdCampaign {
  id: string;
  name: string;
  description?: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'paused' | 'completed';
  targeting: Record<string, unknown>;
}

export interface Advertisement {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  targetUrl: string;
  priority: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface CollaborationInvite {
  id: string;
  senderId: string;
  recipientId: string;
  projectId: string;
  status: 'pending' | 'accepted' | 'rejected';
  sentAt: Date;
  expiresAt: Date;
}

export interface SeadsInitiative {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  participants: string[];
}

export interface FingerWarChallenge {
  id: string;
  challengeName: string;
  description?: string;
  participants: string[];
  status: 'pending' | 'active' | 'completed';
  createdAt: Date;
  endsAt: Date;
}

export interface AIGovernanceEvent {
  id: string;
  eventType: string;
  description?: string;
  timestamp: Date;
  aiModelVersion: string;
  decision: string;
}

export interface AIGovernanceDecision {
  id: string;
  decisionType: string;
  description?: string;
  timestamp: Date;
  approvalStatus: 'approved' | 'rejected' | 'pending';
  reviewedBy?: string;
}

export interface TicketSubmissionData {
  id: string;
  ticketId: string;
  submitterId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  submittedAt: Date;
  resolvedAt?: Date;
}

export interface Program {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  category: string;
  isLive: boolean;
  viewCount: number;
  duration: string;
}

export interface SalesAnalyticsData {
  id: string;
  period: string;
  revenue: number;
  orders: number;
  customers: number;
  conversionRate: number;
  date: Date;
}

export interface Domain {
  id: string;
  name: string;
  provider: string;
  registrationDate: Date;
  expiryDate: Date;
  isPrimary: boolean;
  status: 'active' | 'expired' | 'suspended';
}

// ==========================================
// 8. Auth Payload Shells & Global States
// ==========================================

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    avatar: string;
    isVerified: boolean;
    role: UserRole;
    permissions: string[];
    settings: Record<string, unknown>;
  };
}

export interface LoginResponseExtended extends LoginResponse {
  refreshToken: string;
  permissions?: string[];
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  language: string;
  [key: string]: any;
}

export interface Analytics {
  views: number;
  likes: number;
  shares: number;
  timestamp: string;
  [key: string]: any;
}

export interface MemberRole {
  id: string;
  name: string;
  permissions: string[];
  [key: string]: any;
}

export interface Uploader extends Omit<Member, 'handle' | 'email' | 'isSubscribed' | 'loyaltyTier' | 'subProfiles' | 'activeSubProfileId' | 'phoneVerified' | 'twoFactorEnabled' | 'multiFactorEnabled' | 'biometricEnrolled' | 'loyaltyPoints' | 'currentPlan' | 'subscriptionExpiryDate' | 'following' | 'faceIdEnabled' | 'fingerprintEnabled' | 'walletAddress' | 'location' | 'preferences' | 'engagementRate' | 'followerCount' | 'followingCount' | 'posts' | 'status' | 'lastActive' | 'joinDate' | 'phoneNumber' | 'twoFactorMethods' | 'mfaMethods' | 'backupCodes'> {
  id: string;
  membername: string;
}

export interface Stats {
  upvotes: number;
  downvotes: number;
  shares: number;
  downloads: number;
  [key: string]: any;
}
