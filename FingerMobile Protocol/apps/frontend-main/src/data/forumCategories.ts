import categoriesJson from './forumCategories.json';

export type AccessLevel = 'PUBLIC' | 'PRIVATE' | 'SUBSCRIPTION' | 'BADGE_ONLY' | 'MODERATOR';

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  accessLevel: AccessLevel;
}

export const forumCategories: ForumCategory[] = categoriesJson as ForumCategory[];
