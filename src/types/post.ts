import { User } from './user';

export interface Post {
  id: string;
  userId: string;
  user: User;
  content: string;
  title?: string;
  media?: string[];
  tags?: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  visibility: 'public' | 'friends' | 'private';
  groupId?: string;
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  publishedAt?: string;
  parentId?: string; // For replies
  isPinned: boolean;
  location?: string;
  poll?: {
    question: string;
    options: string[];
    votes: Record<string, number>;
    expiresAt?: string;
    votedOption?: string;
  };
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
  privacySettings?: {
    allowComments: boolean;
    allowSharing: boolean;
    allowTagging: boolean;
  };
}
