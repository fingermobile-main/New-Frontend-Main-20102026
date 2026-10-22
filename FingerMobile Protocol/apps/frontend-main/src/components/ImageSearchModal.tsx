import React, { useState } from 'react';
import { Search, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/Dialog';

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect?: (imageUrl: string) => void;
}

const ImageSearchModal: React.FC<ImageSearchModalProps> = ({
  isOpen,
  onClose,
  onImageSelect
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [images, setImages] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    // Simulate API call - replace with actual image search API
    setTimeout(() => {
      const mockImages = Array.from({ length: 12 }, (_, i) =>
        `https://picsum.photos/400/300?random=${Date.now()}-${i}`
      );
      setImages(mockImages);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900 font-bold">
            <Image className="h-5 w-5 text-slate-700" />
            Search Images
          </DialogTitle>
          <DialogDescription className="text-slate-700">
            Find and select images for your content
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Search for images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 text-slate-900 font-medium border-slate-300"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto mt-4">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-slate-100 border border-slate-200 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {images.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg border border-slate-200 hover:border-primary transition-colors"
                  onClick={() => {
                    onImageSelect?.(imageUrl);
                    onClose();
                  }}
                  role="button" tabIndex={0}
                >
                  <img
                    src={imageUrl}
                    alt={`Search result ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button type="button" size="sm" aria-label={`Select image ${index + 1}`} onClick={() => onImageSelect?.(imageUrl)}>Select</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-700">
              <Image className="h-16 w-16 mx-auto mb-4 text-slate-500 opacity-40" />
              <p className="text-slate-700 font-medium">Search for images to get started</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageSearchModal;
