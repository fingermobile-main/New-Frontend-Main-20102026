import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog';

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

const BlockModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you absolutely sure?',
  description = 'This action cannot be undone. This will permanently delete the item.'
}: BlockModalProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);

  useEffect(() => {
    setInternalIsOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setInternalIsOpen(false);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <Dialog open={internalIsOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-md" 
        onKeyDown={handleKeyDown}
        role="dialog"
        tabIndex={-1}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="py-2">
            {description.replace(/'/g, "'")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            className="w-full"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleConfirm}
            className="w-full"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { BlockModal };