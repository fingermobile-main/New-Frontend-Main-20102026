import React, { useState, useEffect } from 'react';
import { Music, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/Dialog';

interface Track {
  id: string;
  title: string;
  artist: string;
  lyrics?: string;
}

interface LyricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  track?: Track;
  onSave?: (trackId: string, lyrics: string) => void;
  isEditable?: boolean;
}

const LyricsModal: React.FC<LyricsModalProps> = ({
  isOpen,
  onClose,
  track,
  onSave,
  isEditable = false
}) => {
  const [lyrics, setLyrics] = React.useState(track?.lyrics || '');

  React.useEffect(() => {
    if (track) {
      setLyrics(track.lyrics || '');
    }
  }, [track]);

  const handleSave = () => {
    if (track && isEditable) {
      onSave?.(track.id, lyrics);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            {track?.title} - Lyrics
          </DialogTitle>
          <DialogDescription>
            by {track?.artist}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex-1 overflow-y-auto">
          {isEditable ? (
            <Textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Enter lyrics here..."
              className="min-h-[400px] font-mono text-sm leading-relaxed"
            />
          ) : (
            <div className="bg-muted/30 p-6 rounded-lg min-h-[400px]">
              {lyrics ? (
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {lyrics}
                </pre>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No lyrics available for this track</p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {isEditable && (
            <Button onClick={handleSave}>
              Save Lyrics
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LyricsModal;
