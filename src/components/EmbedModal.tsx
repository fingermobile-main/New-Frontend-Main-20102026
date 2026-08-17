import React, {} from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import { RoseIcon } from './icons/core/ui';

interface EmbedModalProps {
  url: string;
  setUrl: (url: string) => void;
  embedCode: string;
  onEmbed: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const EmbedModal: React.FC<EmbedModalProps> = ({
  url,
  setUrl,
  embedCode,
  onEmbed,
  isOpen,
  setIsOpen
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Embed Content</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              id="embed-link"
              value={embedCode || url}
              onChange={(e) => setUrl(e.target.value)}
              readOnly={!!embedCode} // Make input read-only if embedCode is provided
            />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={onEmbed}>
            <RoseIcon className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmbedModal;