import React, {} from 'react';
import { parse } from "papaparse";

// Define TypeScript interfaces for our data models
export interface Member {loginEmail: string;
  privacyStatus: string;
  id: string;
  creationDate: string;
  aboutPlainText: string;
  profilePhoto: string;
  checkInId: string;
  aboutRichText: string;
  lastUpdated: string;
  slug: string;
  lastName: string;
  firstName: string;
  birthdate: string;
  activityStatus: string;
  lastLoginDate: string;
  position: string;
  status: string;
  contactId: string;
  coverPhoto: string;
  verifiedMemberPin: string;
  company: string;
  phone: string;
  nickname: string;
}

export interface Post {bestAnswerCommentId: string;
  categoryId: string;
  viewCount: string;
  editedDate: string;
  id: string;
  pageUrl: string;
  createdDate: string;
  ownerId: string;
  slug: string;
  plainContent: string;
  commentingDisabled: string;
  lastActivityDate: string;
  commentCount: string;
  pinned: string;
  title: string;
  commentInteraction: string;
  likeCount: string;
}

export interface Comment {downvoteCount: string;
  editedDate: string;
  id: string;
  replyCount: string;
  pageUrl: string;
  createdDate: string;
  ownerId: string;
  score: string;
  plainContent: string;
  lastActivityDate: string;
  upvoteCount: string;
  postId: string;
  parentId: string;
  likeCount: string;
}

export interface BlogCategory {postCount: string;
  categoryPageUrl: string;
  posts: string;
  description: string;
  id: string;
  label: string;
  translationId: string;
  slug: string;
  categoryPageSlug: string;
  coverImage: string;
  language: string;
}

export interface ForumCategory {writeProtected: string;
  postCount: number;
  headerTextColor: {
  color: string;
  opacity: number;
  };
name: string;
description?: string;
headerType: string;
id: string;
pageUrl: string;
rank: number;
headerBackgroundColor: {color: string;
  opacity: number;
  };
slug: string;
postViewCount: number;
headerImage: string;
headerTitle: string;
parentId: string;
headerImageOverlayColor: string;
}

// Function to parse CSV data into typed objects
export const parseCSVData = <T>(
  csvText: string,
transformFunction: (
  data: Record<string, unknown>[]) => T[],
): T[] => {
  const parsed = parse(csvText, {header: true,
  skipEmptyLines: true,
  transform: (
  value: string) => value.trim()
  });

  // Ensure we're working with the correct data type
  const dataArray = Array.isArray(parsed.data) ? parsed.data : [];
  return transformFunction(dataArray as Record<string, unknown>[]);
};

// Transform functions for each data type
export const transformMembers = (
  data: Record<string, unknown>[]): Member[] => {
  return data.map((row) => ({loginEmail: String(row["Login Email"] || ""),
  privacyStatus: String(row["Privacy Status"] || ""),
  id: String(row["ID"] || ""),
  creationDate: String(row["Creation Date"] || ""),
  aboutPlainText: String(row["About (Plain Text)"] || ""),
  profilePhoto: String(row["Profile Photo"] || ""),
  checkInId: String(row["checkInId"] || ""),
  aboutRichText: String(row["About (Rich Text)"] || ""),
  lastUpdated: String(row["Last Updated"] || ""),
  slug: String(row["Slug"] || ""),
  lastName: String(row["Last Name"] || ""),
  firstName: String(row["First Name"] || ""),
  birthdate: String(row["Birthdate"] || ""),
  activityStatus: String(row["Activity Status"] || ""),
  lastLoginDate: String(row["Last Login Date"] || ""),
  position: String(row["Position"] || ""),
  status: String(row["Status"] || ""),
  contactId: String(row["Contact Id"] || ""),
  coverPhoto: String(row["Cover Photo"] || ""),
  verifiedMemberPin: String(row["Verified Member Pin"] || ""),
  company: String(row["Company"] || ""),
  phone: String(row["Phone"] || ""),
  nickname: String(row["Nickname"] || "")
  }));
};

export const transformPosts = (
  data: Record<string, unknown>[]): Post[] => {
  return data.map((row) => ({bestAnswerCommentId: String(row["Best Answer Comment ID"] || ""),
  categoryId: String(row["Category ID"] || ""),
  viewCount: String(row["View Count"] || ""),
  editedDate: String(row["Edited Date"] || ""),
  id: String(row["ID"] || ""),
  pageUrl: String(row["Page URL"] || ""),
  createdDate: String(row["Created date"] || ""),
  ownerId: String(row["Owner ID"] || ""),
  slug: String(row["Slug"] || ""),
  plainContent: String(row["Plain Content"] || ""),
  commentingDisabled: String(row["Commenting Disabled"] || ""),
  lastActivityDate: String(row["Last Activity Date"] || ""),
  commentCount: String(row["Comment Count"] || ""),
  pinned: String(row["Pinned"] || ""),
  title: String(row["Title"] || ""),
  commentInteraction: String(row["Comment Interaction"] || ""),
  likeCount: String(row["Like Count"] || "")
  }));
};

export const transformComments = (
  data: Record<string, unknown>[],
): Comment[] => {
  return data.map((row) => ({downvoteCount: String(row["Downvote Count"] || ""),
  editedDate: String(row["Edited Date"] || ""),
  id: String(row["ID"] || ""),
  replyCount: String(row["Reply Count"] || ""),
  pageUrl: String(row["Page URL"] || ""),
  createdDate: String(row["Created date"] || ""),
  ownerId: String(row["Owner ID"] || ""),
  score: String(row["Score"] || ""),
  plainContent: String(row["Plain Content"] || ""),
  lastActivityDate: String(row["Last Activity Date"] || ""),
  upvoteCount: String(row["Upvote Count"] || ""),
  postId: String(row["Post ID"] || ""),
  parentId: String(row["Parent ID"] || ""),
  likeCount: String(row["Like Count"] || "")
  }));
};

export const transformBlogCategories = (
  data: Record<string, unknown>[],
): BlogCategory[] => {
  return data.map((row) => ({postCount: String(row["Post Count"] || ""),
  categoryPageUrl: String(row["Category Page URL"] || ""),
  posts: String(row["Posts"] || ""),
  description: String(row["Description"] || ""),
  id: String(row["ID"] || ""),
  label: String(row["Label"] || ""),
  translationId: String(row["Translation ID"] || ""),
  slug: String(row["Slug"] || ""),
  categoryPageSlug: String(row["Category Page Slug"] || ""),
  coverImage: String(row["Cover Image"] || ""),
  language: String(row["Language"] || "")
  }));
};

export const transformForumCategories = (
  data: Record<string, unknown>[],
): ForumCategory[] => {
  return data.map((row) => ({writeProtected: String(row["Write Protected"] || ""),
  postCount: Number(row["Post Count"] || 0),
  headerTextColor: {
  color: String(row["Header Text Color"] || ""),
  opacity: 1
    },
  name: String(row["Name"] || ""),
  description: String(row["Description"] || ""),
  headerType: String(row["Header Type"] || ""),
  id: String(row["ID"] || ""),
  pageUrl: String(row["Page URL"] || ""),
  rank: Number(row["Rank"] || 0),
  headerBackgroundColor: {color: String(row["Header Background Color"] || ""),
  opacity: 1
    },
  slug: String(row["Slug"] || ""),
postViewCount: Number(row["Post View Count"] || 0),
headerImage: String(row["Header Image"] || ""),
headerTitle: String(row["Header Title"] || ""),
parentId: String(row["Parent ID"] || ""),
headerImageOverlayColor: String(row["Header Image Overlay Color"] || "")
  }));
};
