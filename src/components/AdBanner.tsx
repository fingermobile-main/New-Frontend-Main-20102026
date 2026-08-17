import React, {} from 'react';
import { Megaphone, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdBannerProps {
  adSlot?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  onClose?: () => void;
  variant?: "small" | "medium" | "large";
}

const AdBanner: React.FC<AdBannerProps> = ({
  title = "Special Offer",
  description = "Check out our latest deals and promotions!",
  imageUrl,
  ctaText = "Learn More",
  onCtaClick,
  onClose,
  variant = "medium"
}) => {
  const sizeClasses = {
    small: "h-16 px-4",
    medium: "h-24 px-6",
    large: "h-32 px-8"
  };

  return (
    <div className={`relative w-full bg-gradient-to-r from-blue-50 to-purple-50 border rounded-lg overflow-hidden ${sizeClasses[variant]}`}>
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
      <div className="flex items-center gap-4 h-full">
        {imageUrl && (
          <div className={`${variant === 'small' ? 'h-12 w-12' : variant === 'medium' ? 'h-16 w-16' : 'h-24 w-24'} flex-shrink-0`}>
            <img src={imageUrl} alt={title} className="w-full h-full object-cover rounded"  />
          </div>
        )}
        {!imageUrl && (
          <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
            <Megaphone className={`${variant === 'small' ? 'h-5 w-5' : variant === 'medium' ? 'h-6 w-6' : 'h-8 w-8'} text-primary`} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold truncate ${variant === 'small' ? 'text-sm' : 'text-base'}`}>
            {title}
          </h3>
          {variant !== 'small' && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
          )}
        </div>
        <Button size={variant === 'small' ? 'sm' : 'default'} onClick={onCtaClick}>
          {ctaText}
        </Button>
      </div>
    </div>
  );
};

export default AdBanner;
