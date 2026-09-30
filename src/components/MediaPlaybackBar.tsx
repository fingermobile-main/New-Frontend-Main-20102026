import React, {} from 'react';
import { Image, Video, Music, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  filename: string;
  url: string;
  thumbnail?: string;
  size: number;
  uploadedAt: string;
}

interface MediaPlaybackBarProps {
  currentMedia?: MediaItem;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  progress?: number;
  duration?: number;
  onSeek?: (time: number) => void;
}

const MediaPlaybackBar: React.FC<MediaPlaybackBarProps> = ({
  currentMedia,
  isPlaying = false,
  onPlayPause,
  onNext,
  onPrevious,
  progress = 0,
  duration = 0,
  onSeek
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${bytes} B`;
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
    case 'image':
      return <Image className="h-5 w-5" />;
    case 'video':
      return <Video className="h-5 w-5" />;
    case 'audio':
      return <Music className="h-5 w-5" />;
    case 'document':
      return <FileText className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
    }
  };

  if (!currentMedia) {
    return (
      <Card className="w-full">
        <CardContent className="p-4 text-center text-muted-foreground">
          <p>No media selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full sticky bottom-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {getMediaIcon(currentMedia.type)}
            <span className="truncate">{currentMedia.filename}</span>
          </CardTitle>
          <Badge variant="secondary">{formatSize(currentMedia.size)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Preview */}
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          {currentMedia.type === 'image' && (
            <img src={currentMedia.url} alt={currentMedia.filename} className="w-full h-full object-contain"  />
          )}
          {currentMedia.type === 'video' && (
            <video src={currentMedia.url} controls className="w-full h-full" />
          )}
          {currentMedia.type === 'audio' && (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="h-16 w-16 text-muted-foreground opacity-20" />
            </div>
          )}
          {currentMedia.type === 'document' && (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="h-16 w-16 text-muted-foreground opacity-20" />
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {(currentMedia.type === 'video' || currentMedia.type === 'audio') && (
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={progress}
              onChange={(e) => onSeek?.(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Controls */}
        {(currentMedia.type === 'video' || currentMedia.type === 'audio') && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="icon" onClick={onPrevious}>
              Previous
            </Button>
            <Button size="sm" onClick={onPlayPause}>
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button variant="ghost" size="icon" onClick={onNext}>
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MediaPlaybackBar;
