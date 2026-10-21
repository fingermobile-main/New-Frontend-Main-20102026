import React from 'react';
import { emojiPackService, FingerMobileEmojiItem } from '../../services/emojiPackService';

interface FingerMobileEmojiImageProps {
  slug?: string;
  emoji?: FingerMobileEmojiItem;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showTooltip?: boolean;
}

const SIZE_MAP: Record<string, string> = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
  xl: 'w-9 h-9',
  '2xl': 'w-12 h-12'
};

/**
 * FingerMobileEmojiImage
 * Enforces FingerMobile's brand requirement that only the official 5D mint-green
 * glass emoji pack (#defaf2) is rendered across the platform.
 */
export const FingerMobileEmojiImage: React.FC<FingerMobileEmojiImageProps> = ({
  slug,
  emoji,
  size = 'md',
  className = '',
  showTooltip = false
}) => {
  const resolvedEmoji: FingerMobileEmojiItem = emoji || (slug ? emojiPackService.getEmojiBySlug(slug) : emojiPackService.getEmojiBySlug('thumbs-up'));
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <img
      src={resolvedEmoji.imageUrl}
      alt={resolvedEmoji.altText || resolvedEmoji.name}
      title={showTooltip ? resolvedEmoji.name : undefined}
      className={`inline-block object-contain rounded-full border border-emerald-400/40 bg-[#defaf2]/20 flex-shrink-0 transition-transform duration-200 hover:scale-110 ${sizeClass} ${className}`}
      loading="lazy"
      onError={(e) => {
        // Fallback to primary thumbs-up mint emoji if individual asset fails to load
        (e.target as HTMLImageElement).src = '/assets/emojis/thumbs_up_wink.png';
      }}
    />
  );
};

export default FingerMobileEmojiImage;
