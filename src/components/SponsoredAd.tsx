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
      <div className="relative w-full bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary p-4 rounded-r-lg border-y border-r border-slate-200">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 text-slate-700 hover:text-slate-900"
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
              <Badge variant="outline" className="text-xs border-primary/40 text-primary font-bold">
                Sponsored
              </Badge>
              <h3 className="font-bold text-slate-900">{title}</h3>
            </div>
            <p className="text-sm text-slate-700 font-medium">{description}</p>
          </div>
          <Button onClick={onCtaClick}>{ctaText}</Button>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="relative bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 z-10 text-slate-700 hover:text-slate-900"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {imageUrl && (
          <div className="aspect-video bg-slate-100 border-b border-slate-200 relative">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-2 left-2 bg-slate-900 text-white font-semibold">Sponsored</Badge>
          </div>
        )}
        <div className="p-4 space-y-3">
          <h3 className="font-bold text-lg text-slate-900">{title}</h3>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">{description}</p>
          <Button className="w-full" onClick={onCtaClick}>
            {ctaText}
          </Button>
        </div>
      </div>
    );
  }

  // inline variant
  return (
    <div className="relative flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-5 w-5 text-slate-700 hover:text-slate-900"
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
          <Badge variant="outline" className="text-[10px] px-1 py-0 border-slate-300 text-slate-800 font-bold">
            Ad
          </Badge>
          <span className="text-sm font-semibold text-slate-900 truncate">{title}</span>
        </div>
        <p className="text-xs text-slate-700 font-medium line-clamp-2">{description}</p>
      </div>
      <Button size="sm" variant="outline" onClick={onCtaClick} className="border-slate-300 text-slate-800 font-semibold">
        {ctaText}
      </Button>
    </div>
  );
};

export default SponsoredAd;
