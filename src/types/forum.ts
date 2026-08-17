import React, {} from 'react';
// Renamed to ForumCategoryDetail to avoid duplicate export conflict with models.ts
export interface ForumCategoryDetail {id: string;
  name: string;
  description?: string;
  slug: string;
  postCount: number;
  rank: number;
  headerType: "IMAGE" | "COLOR";
  headerImage: string;
  headerTitle: string;
  headerTextColor: {color: string;
  opacity: number };
headerBackgroundColor: {color: string;
  opacity: number };
headerImageOverlayColor: {color: string;
  opacity: number };
pageUrl: string;
parentId: string;
postViewCount: number;
  priority?: number;
  icon?: React.FC<{ className?: string }>;
}
