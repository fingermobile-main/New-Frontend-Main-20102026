/**
 * Database and Request Type Definitions
 * Centralized type interfaces for consistent typing across controllers
 */

import { Request } from 'express';

// ============================================================================
// REQUEST TYPES
// ============================================================================

/**
 * Extended Request interface with authenticated user information
 * Use this instead of (req as any) for type-safe user access
 * Note: Extends the global Express.Request which already defines user structure
 */
export type AuthenticatedRequest = Request;

// The user property is already defined in types/express.d.ts with this structure:
// user?: { id: string; email: string; role: string; [key: string]: any; }

// ============================================================================
// DATABASE QUERY RESULT TYPES
// ============================================================================

/**
 * Video row with creator information and engagement metrics
 * Used in FingershortsController queries
 */
export interface VideoWithMetrics {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration: number;
  tags?: string[];
  category?: string;
  visibility: 'public' | 'private' | 'unlisted';
  status: 'pending_review' | 'approved' | 'rejected' | 'deleted';
  is_published: boolean;
  allow_comments: boolean;
  allow_duet: boolean;
  creator_id: string;
  creator_name: string;
  creator_avatar?: string;
  creator_bio?: string;
  followers_count?: number;
  is_verified?: boolean;
  view_count: number;
  engagement_score: number;
  completion_rate: number;
  like_rate: number;
  share_rate: number;
  trending_score?: number;
  is_liked_by_user?: boolean;
  is_following_creator?: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * User row for database queries
 */
export interface UserRow {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  is_verified: boolean;
  followers_count?: number;
  following_count?: number;
  created_at: Date;
}

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// ============================================================================
// ML/AI METADATA TYPES
// ============================================================================

/**
 * View tracking metadata for ML recommendation system
 */
export interface ViewMetadata {
  watch_duration?: number;
  completion_rate?: number;
  device_type?: string;
  network_type?: 'wifi' | 'cellular' | 'unknown';
  timestamp?: Date;
  scroll_speed?: number;
  rewatch_count?: number;
}

/**
 * Engagement features for ML algorithms
 */
export interface EngagementFeatures {
  like_rate: number;
  share_rate: number;
  comment_rate: number;
  completion_rate: number;
  time_of_day: number; // 0-23
  day_of_week: number; // 0-6
  session_length?: number;
  videos_watched_in_session?: number;
}

/**
 * Interaction types for ML tracking
 */
export type InteractionType =
  | 'view'
  | 'like'
  | 'unlike'
  | 'share'
  | 'comment'
  | 'save'
  | 'duet'
  | 'follow';

// ============================================================================
// DYNAMIC QUERY PARAMETER TYPES
// ============================================================================

/**
 * Type-safe parameter array for dynamic SQL queries
 * Replaces `any[]` with specific union type
 */
export type QueryParam = string | number | boolean | null | undefined;
export type QueryParams = Array<QueryParam>;

// ============================================================================
// COMMON RESPONSE TYPES
// ============================================================================

/**
 * Standard API success response
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  message?: string;
  data: T;
  algorithm?: string;
  pagination?: {
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
    itemsPerPage?: number;
    limit?: number;
    offset?: number;
  };
  metadata?: Record<string, unknown>;
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
