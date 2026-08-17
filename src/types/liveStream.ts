import { Member } from './models';

export interface CreateLiveStreamData {
  title: string;
  description?: string; category: string;
  tags?: string[];
  affiliatePartnerType: string;
  maxDuration?: number;
  scheduledStartTime?: string;
}

export interface LiveStreamSession {id: string; userId: string; title: string;
  description?: string;
  thumbnailUrl?: string;
  thumbnail?: string; // Alias for thumbnail, streamUrl: string;
  streamKey?: string; viewerCount: number;
  viewers?: number; // Alias for viewerCount, status: "scheduled" | "live" | "ended";
  category: string; affiliatePartnerType: string;
  startTime?: string;
  endTime?: string;
  tags?: string[];
  isFeatured?: boolean; creator: Member;
}

export interface LiveStreamResponse {message: string; streamKey: string; streamUrl: string; liveStream: LiveStreamSession;
}

export interface ActiveStream {id: string; userId: string; title: string;
  description?: string;
  thumbnailUrl?: string; viewerCount: number;
  startTime?: Date; category: string; affiliatePartnerType: string;
}

export interface ActiveStreamsResponse {
  streams: ActiveStream[]; totalCount: number;
}

export interface ViewerCountUpdate {streamId: string; viewerCount: number; timestamp: string;
}