import React, {} from 'react';
import { Megaphone, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface SponsoredAdProps {
  title: string;
  description?: string;
  imageUrl?: string;
  ctaText: string;
  onCtaClick?: () => void;
  onClose?: () => void;
  variant?: 'banner' | 'card' | 'inline';
}

const SponsoredAd: React.FC<SponsoredAdProps> = ({
  title,
  description,
  imageUrl,
  ctaText,
  onCtaClick,
  onClose,
  variant = 'banner'
}) => {
  if (variant === 'banner') {
    return (
      <div className="relative w-full bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary p-4 rounded-r-lg">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Megaphone className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                Sponsored
              </Badge>
              <h3 className="font-semibold">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Button onClick={onCtaClick}>{ctaText}</Button>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="relative bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 z-10"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {imageUrl && (
          <div className="aspect-video bg-muted relative">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-2 left-2">Sponsored</Badge>
          </div>
        )}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          <Button className="w-full" onClick={onCtaClick}>
            {ctaText}
          </Button>
        </div>
      </div>
    );
  }

  // inline variant
  return (
    <div className="relative flex items-start gap-3 p-3 bg-muted/30 rounded-lg border">
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-5 w-5"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      <div className="p-1.5 bg-primary/20 rounded">
        <Megaphone className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-[10px] px-1 py-0">
            Ad
          </Badge>
          <span className="text-sm font-medium truncate">{title}</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
      </div>
      <Button size="sm" variant="outline" onClick={onCtaClick}>
        {ctaText}
      </Button>
    </div>
  );
};

export default SponsoredAd;
