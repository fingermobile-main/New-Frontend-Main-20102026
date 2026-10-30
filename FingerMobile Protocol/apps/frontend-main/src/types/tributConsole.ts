/**
 * Tribut Master Management Console Types
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 */

export interface TributConsolePin {
  id: string;
  user_id: string;
  title: string;
  caption?: string;
  image_url: string;
  thumbnail_url?: string;
  cover_image_url?: string;
  category: string;
  aspect_ratio: string;
  dimensions?: { width: number; height: number };
  camera_model?: string;
  device_type?: string;
  device_platform?: string;
  hardware_metadata?: Record<string, unknown>;
  media_type: 'image' | 'video' | 'collage';
  multi_media_urls?: string[];
  video_url?: string;
  video_urls?: string[];
  additional_images?: string[];
  color_palette?: string[];
  prompt_recipe?: string;
  shopping_metadata?: {
    isShoppable?: boolean;
    productName?: string;
    priceNgn?: number;
    priceFic?: number;
    merchantName?: string;
    inStock?: boolean;
    buyAndShareCommissionPercent?: number;
  };
  is_pinned_to_gallery: boolean;
  is_pinned_to_tribut: boolean;
  board_name: string;
  priority: 'high' | 'medium' | 'normal' | 'low';
  uploader_name: string;
  uploader_handle: string;
  guardian_quality_score: number;
  status: 'published' | 'frozen' | 'censored' | 'suspended' | 'deleted' | 'archived';
  is_censored: boolean;
  comments_paused: boolean;
  display_order: number;
  report_count: number;
  moderation_notes?: string;
  tags?: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface TributConsoleOverview {
  summary: {
    total_pins: string | number;
    active_pins: string | number;
    frozen_pins: string | number;
    censored_pins: string | number;
    suspended_pins: string | number;
    comments_paused_pins: string | number;
    pinned_pins: string | number;
  };
  categories: {
    category: string;
    count: string | number;
  }[];
  totalUploads: number;
  totalBoards: number;
  engine: string;
  timestamp: string;
}

export interface TributMediaUploadItem {
  id: string;
  user_id: string;
  device_id?: string;
  device_name?: string;
  device_type?: string;
  device_platform?: string;
  browser_client?: string;
  file_name: string;
  original_name: string;
  file_path: string;
  file_url: string;
  mime_type: string;
  file_size_bytes: number;
  media_type: string;
  status: string;
  is_pinned_to_tribut: boolean;
  created_at: string;
}

export interface CreateTributPinPayload {
  title: string;
  description?: string;
  category: string;
  boardName: string;
  aspectRatio?: string;
  mediaType?: 'image' | 'video' | 'collage';
  mediaUrl: string;
  coverImageUrl?: string;
  multiMediaUrls?: string[];
  videoUrl?: string;
  colorPalette?: string[];
  priority?: 'high' | 'medium' | 'low';
  shoppingMetadata?: Record<string, unknown>;
  deviceType?: string;
  devicePlatform?: string;
  isPinnedToTribut?: boolean;
  tags?: string[];
  uploaderName?: string;
  uploaderHandle?: string;
}

export interface TributProjectBoardItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  cover_image?: string;
  privacy: string;
  pin_count: number;
  collaborator_count: number;
  moderation_status: string;
  created_at: string;
}
