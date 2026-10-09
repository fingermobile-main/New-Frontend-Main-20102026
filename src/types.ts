// ==========================================
// 1. Core Profile & User Types
// ==========================================

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
  permissions?: string[];
  isKid?: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  avatarUrl?: string;
  animatedAvatarUrl?: string;
  role?: string;
  isActive?: boolean;
  isSubscribed?: boolean;
  currentPlan?: string;
  isVerified?: boolean;
  verificationTier?: string;
  loyaltyTier?: string;
  loyaltyPoints?: number;
  following?: number | string[];
  followingIds?: string[];
  followers?: number;
  createdAt?: string;
  updatedAt?: string;
  subscriptionExpiryDate?: string | Date;
  permissions?: string[];
  subProfiles?: SubProfile[];
  phoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  multiFactorEnabled?: boolean;
  biometricEnrolled?: boolean;
  joinDate?: string;
  posts?: number;
  isOnline?: boolean;
  handlename?: string;
  membername?: string;
  handle?: string;
  location?: {
    country: string;
    region: string;
    city?: string;
  };
  preferences?: {
    interests?: string[];
    genres?: string[];
    values?: string[];
    notifications?: boolean;
    privacy?: 'public' | 'private';
  };
  lastActive?: string;
  engagementRate?: number;
  profileViews?: number;
  postsCount?: number;
  bookmarks?: string[];
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
}

export interface SimpleAuthor {
  id: string;
  name?: string;
  username?: string;
  avatar?: string;
}

export interface Member {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  loyaltyTier?: string;
  name?: string;
  membername?: string;
  handle?: string;
  avatarUrl?: string;
  animatedAvatarUrl?: string;
  isVerified?: boolean;
  followerCount?: number;
  isSubscribed?: boolean;
  bio?: string;
  location?: {
    country: string;
    region: string;
    city?: string;
  };
  preferences?: {
    interests?: string[];
    genres?: string[];
    values?: string[];
    notifications?: boolean;
    privacy?: 'public' | 'private';
  };
  lastActive?: string;
  engagementRate?: number;
  following?: string[];
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  profileViews?: number;
  postsCount?: number;
  bookmarks?: string[];
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
  phoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  multiFactorEnabled?: boolean;
  biometricEnrolled?: boolean;
  joinDate?: string;
  posts?: number;
  followingIds?: string[];
  isOnline?: boolean;
  handlename?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  currentPlan?: string;
  verificationTier?: string;
  loyaltyPoints?: number;
  subscriptionExpiryDate?: string | Date;
  subProfiles?: SubProfile[];
  enrolledCount?: number;
  isCreator?: boolean;
  displayName?: string;
  joinedAt?: string;
  status?: string;
}

export interface SuggestedMember {
  id: string;
  memberId: string;
  member: Member;
  reason: string;
  score: number;
  lastInteractionDate?: string;
  relationshipType: string;
  isFollowing: boolean;
  mutualConnections: number;
  commonInterests: string[];
}

export interface DiscoverableMember {
  id: string;
  email: string;
  name: string;
  handle: string;
  createdAt: string;
  updatedAt: string;
  following: never[];
  location: {
    country: string;
    region: string;
    city: string;
  };
  bio: string;
  followerCount: number;
  posts: number;
  role: string;
  username: string;
  permissions: string[];
}

// ==========================================
// 2. Content, Social & Notifications
// ==========================================

export interface Post {
  id: string;
  authorId?: string;
  author?: any;
  title?: string;
  content: string;
  body?: string;
  excerpt?: string;
  type?: string;
  media?: any[];
  mediaUrl?: string;
  mediaAlt?: string;
  likesCount?: number;
  likes?: number;
  shares?: number;
  sharesCount?: number;
  repostsCount?: number;
  comments?: any;
  commentsCount?: number;
  repliesCount?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  dislikesCount?: number;
  createdAt: string;
  timestamp?: string;
  tags?: any;
  category?: string;
  imageUrl?: string;
  videoUrl?: string;
  location?: string;
  severity?: string;
  status?: string;
  monetization?: { enabled: boolean; price?: number };
  engagement?: { likes: number; comments: number; shares: number };
  visibility?: string;
  pollOptions?: Array<{ id: string; text: string; votes: number }>;
  tokenized?: boolean;
  bookmarksCount?: number;
  viewsCount?: number;
  isPinned?: boolean;
  categoryColor?: string;
  isReposted?: boolean;
  isReported?: boolean;
  reportReasons?: string[];
  updatedAt?: string;
}

export interface Notification {
  id: string;
  type: string;
  read: boolean;
  isRead?: boolean;
  member?: string;
  memberAvatar?: string;
  action?: string;
  timestamp?: string;
  content?: string;
}

// ==========================================
// 3. Marketplace, Cart & Orders
// ==========================================

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  images?: string[];
  category: string;
  stock?: number;
  sellerId?: string;
  seller?: any;
  brand?: string;
  condition?: string;
  quantity?: number;
  thumbnail?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
  rating?: number;
  reviewCount?: number;
  reviews?: any[];
  tags?: any;
  salesCount?: number;
  ownitExclusive?: boolean;
  popularity?: number;
  createdAt?: string;
  updatedAt?: string;
  platform?: string;
  inWishlist?: boolean;
  inCart?: boolean;
  compliance?: {
    ageRestricted: boolean;
    geoRestricted: boolean;
    contentRating: string;
  };
  isLiked?: boolean;
  likesCount?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  currency: string;
  name?: string;
  image?: string;
  addedAt?: string;
}

export interface Order {
  id: string;
  memberId?: string;
  customerId?: string;
  owner_id?: string;
  items: CartItem[];
  totalAmount: number;
  currency: string;
  status: string;
  paymentStatus: string;
  placedAt: string;
  orderNumber?: string;
}

// ==========================================
// 4. Learning, Courses & Camus
// ==========================================

export interface Course {
  id: string;
  title: string;
  description?: string;
  category?: string;
  subcategory?: string;
  instructor?: string | { id?: string; name?: string; avatarUrl?: string; [key: string]: any };
  duration?: string | number;
  modules?: any[];
  previewVideoUrl?: string;
  tags?: any[];
  totalRatings?: number;
  curriculum?: any[];
  prerequisites?: any[];
  learningOutcomes?: any[];
  price?: number;
  rating?: number;
  level?: string;
  thumbnail?: string;
  enrolledCount?: number;
  enrollmentCount?: number;
  completionCount?: number;
  language?: string;
  certificateAvailable?: boolean;
  subtitlesAvailable?: boolean;
  quizCount?: number;
  assignmentCount?: number;
  forumEnabled?: boolean;
  supportAvailable?: boolean;
  isPublished?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}


export interface Enrollment {
  id: string | number;
  courseId: string | number;
  memberId: string | number;
  completedLessons: any[];
  progress: number;
}

export interface FeatureToggle {
  id: string;
  name?: string;
  enabled?: boolean;
  specialDays?: string[];
  description?: string;
  [key: string]: unknown;
}

export interface FlamingoSubmission {
  id: string;
  status?: string;
  product: {
    imageUrl: string;
    name: string;
    [key: string]: unknown;
  };
  submittedBy: {
    name: string;
    [key: string]: unknown;
  };
  submissionDate?: string;
}

export interface FlaggedContent {
  id: string;
  reason?: string;
  flaggedBy?: string;
  contentPreview?: string;
  post: {
    author: {
      name?: string;
    };
    timestamp?: string;
  };
}

export interface Domain {
  id: string;
  name?: string;
  status?: string;
  isPrimary?: boolean;
}

export interface CamusEnrollment {
  id: string;
  memberId: string;
  courseId: string;
  enrolledAt: Date;
  progress: number;
  completedAt: Date | null;
}

export interface CamusNotification {
  id: string;
  memberId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface CamusQuizAttempt {
  id: string;
  memberId: string;
  quizId: string;
  courseId: string;
  startedAt: Date;
  completedAt: Date | null;
  score: number;
  answers: Record<string, any>;
}

// ==========================================
// 5. Initiatives & Miscellaneous System Controls
// ==========================================

export interface SeadsInitiative {
  id: string | number;
  title: string;
  description?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  impactMetrics?: any;
  location?: string;
  progress?: number;
  members?: any[];
  objectives?: any[];
  outcomes?: any[];
  target?: number;
  imageUrl?: string;
  organizer?: string;
}

export interface EditorComponent {
  id: any;
  type: any;
  props: Record<string, any>;
  [key: string]: any;
}

// ==========================================
// 6. Generic Type Aliases
// ==========================================

export type Video = any;
export type Advertisement = any;
export type NavigationSection = any;
export type Trend = any;
export type Group = any;
export type Topic = any;
export type Hashtag = any;
export type Event = any;
export type Hallmark = any;
export type Gem = any;
export type LiveStream = any;
export type MusicTrack = any;
export type PayoutRequest = any;
export type ChatMessage = any;
export type Message = any;
export type Module = any;
export type SupportTicket = any;
export type PhotoCredit = any;
export type Profile = any;
export type AIGovernanceConfig = any;
export type ForumCategory = any;
export type SubProfileType = any;
export type Preferences = any;
export type AdSubmissionData = any;
export type WishlistItem = any;
export type Review = any;
export type Paylink = any;
export type Program = any;
export type AgenticAiResponse = any;
export type GuardianSystemStatus = any;
export type GuardianAlert = any;
export type ThreadedComment = any;
export type MediaTemplate = any;
export type HallmarkApplication = any;
export type ChatContact = any;
export type Contact = any;
export type Franchise = any;
export type PayoutData = any;
export type MemberPolicy = any;
export type SystemStatus = any;
export type Coupon = any;
export type AdCampaign = any;
export type StoreOrder = any;
export type CampaignAnalytics = any;
export type Campaign = any;
export type CommunitySummary = any;
export type GiftCard = any;
export type LoyaltyReward = any;
export type LoyaltyTier = any;
export type Transaction = any;
export type BookingCategory = any;
export type FingerWarChallenge = any;
export type VoiceLine = any;
export type Game = any;
export type LoanSqrProduct = any;
export type LoanSqrProject = any;
export type LoansqrProject = LoanSqrProject;
export type DownloadedItem = any;
export type VideoContent = any;
export type HallmarkApplicationType = any;
