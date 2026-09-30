import React, {} from 'react';
import { Play, Heart, MessageCircle, Share2, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

interface VideoPost {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  thumbnail: string;
  title: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
}

interface VideoFeedProps {
  videos?: VideoPost[];
  onVideoClick?: (videoId: string) => void;
  onLike?: (videoId: string) => void;
  onComment?: (videoId: string) => void;
  onShare?: (videoId: string) => void;
}

const VideoFeed: React.FC<VideoFeedProps> = ({
  videos: propVideos,
  onVideoClick,
  onLike,
  onComment,
  onShare
}) => {
  const defaultVideos: VideoPost[] = [
    {
      id: '1',
      userId: 'user1',
      username: 'Creator One',
      thumbnail: '/api/placeholder/400/300',
      title: 'Amazing Tutorial Video',
      duration: '5:23',
      views: 1234,
      likes: 89,
      comments: 12
    },
    {
      id: '2',
      userId: 'user2',
      username: 'Creator Two',
      thumbnail: '/api/placeholder/400/300',
      title: 'Quick Tips & Tricks',
      duration: '3:45',
      views: 5678,
      likes: 234,
      comments: 45
    }
  ];

  const videos = propVideos || defaultVideos;

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {/* Video Thumbnail */}
          <div
            className="relative aspect-video bg-muted cursor-pointer"
            onClick={() => onVideoClick?.(video.id)} role="button" tabIndex={0}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="bg-white/90 rounded-full p-3">
                <Play className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          </div>

          <CardContent className="p-4">
            {/* Video Info */}
            <div className="flex gap-3">
              <Avatar
                src={video.userAvatar}
                alt={video.username}
                fallback={video.username.charAt(0)}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                <p className="text-sm text-muted-foreground">@{video.username}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatViews(video.views)} views
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike?.(video.id)}
                className="gap-1"
              >
                <Heart className="h-4 w-4" />
                <span className="text-xs">{video.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onComment?.(video.id)}
                className="gap-1"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{video.comments}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare?.(video.id)}
                className="gap-1"
              >
                <Share2 className="h-4 w-4" />
                <span className="text-xs">Share</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VideoFeed;
