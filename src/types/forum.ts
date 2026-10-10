import { User } from './user';

export interface ForumCategory {
  id: string;
  name: string;
  slug?: string;
  description: string;
  icon?: string;
  color?: string;
  parentCategoryId?: string;
  childCategories?: ForumCategory[];
  threadsCount: number;
  postsCount: number;
  latestPost?: ForumPost;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ForumThread {
  id: string;
  categoryId: string;
  category: ForumCategory;
  title: string;
  content: string;
  author: User;
  authorId: string;
  tags: string[];
  viewsCount: number;
  repliesCount: number;
  posts: ForumPost[];
  isSticky: boolean;
  isLocked: boolean;
  isPinned: boolean;
  isArchived: boolean;
  hasPoll?: boolean;
  poll?: {
    question: string;
    options: string[];
    votes: Record<string, number>;
    expiresAt?: string;
    votedOption?: string;
  };
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  lastPost?: ForumPost;
  subscribersCount: number;
  isSubscribed: boolean;
  attachments?: string[];
  location?: string;
  privacy: 'public' | 'members' | 'moderators';
}

export interface ForumPost {
  id: string;
  threadId: string;
  thread: ForumThread;
  author: User;
  authorId: string;
  content: string;
  parentPostId?: string;
  parentPost?: ForumPost;
  likesCount: number;
  dislikesCount: number;
  isLiked: boolean;
  isDisliked: boolean;
  isBookmarked: boolean;
  isReported: boolean;
  isDeleted: boolean;
  isEdited: boolean;
  editReason?: string;
  replies: ForumPost[];
  replyCount: number;
  tags: string[];
  attachments?: string[];
  location?: string;
  ipHash?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
  deletedAt?: string;
  reportedAt?: string;
  reportedReason?: string;
  reportedBy?: User;
  reportedById?: string;
  isApproved: boolean;
  approvedBy?: User;
  approvedById?: string;
  approvedAt?: string;
  spamScore?: number;
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
}

