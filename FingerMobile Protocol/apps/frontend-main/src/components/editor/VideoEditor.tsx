import React, { useState } from 'react';
import { Video, Scissors, Type, Music, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface VideoEditorProps {
  videoUrl?: string;
  onSave?: (editedVideo: Blob) => void;
}

const VideoEditor: React.FC<VideoEditorProps> = ({ videoUrl, onSave }) => {
  const [selectedTool, setSelectedTool] = React.useState<string>('trim');
  const [isPreviewing, setIsPreviewing] = React.useState<boolean>(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePreview = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPreviewing(true);
      } else {
        videoRef.current.pause();
        setIsPreviewing(false);
      }
    } else {
      setIsPreviewing(prev => !prev);
    }
  };

  const tools = [
    { id: 'trim', label: 'Trim', icon: <Scissors className="h-5 w-5" /> },
    { id: 'text', label: 'Add Text', icon: <Type className="h-5 w-5" /> },
    { id: 'music', label: 'Add Music', icon: <Music className="h-5 w-5" /> },
    { id: 'effects', label: 'Effects', icon: <Wand2 className="h-5 w-5" /> }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Video Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Preview */}
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              onPlay={() => setIsPreviewing(true)}
              onPause={() => setIsPreviewing(false)}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-center text-slate-700 dark:text-slate-300 font-medium">
              <Video className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>No video loaded</p>
            </div>
          )}
        </div>

        {/* Tools */}
        <div className="flex gap-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTool(tool.id)}
              className="flex-1"
            >
              {tool.icon}
              <span className="ml-2">{tool.label}</span>
            </Button>
          ))}
        </div>

        {/* Timeline Placeholder */}
        <div className="border rounded-lg p-4">
          <div className="h-16 bg-muted/30 rounded flex items-center justify-center text-sm font-semibold text-slate-800 dark:text-slate-200">
            Timeline - Drag clips to edit
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            aria-label="Preview video"
            onClick={togglePreview}
            className="flex-1 font-bold text-xs"
          >
            {isPreviewing ? 'Pause Preview' : 'Play Preview'}
          </Button>
          <Button
            type="button"
            aria-label="Export video"
            className="flex-1 font-bold text-xs"
            onClick={() => onSave?.(new Blob())}
          >
            Export Video
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoEditor;
