import React from 'react';
import { FINGERMOBILE_EMOJI_REGISTRY, FingerMobileEmojiItem } from '../services/emojiPackService';

/**
 * Parses and renders text containing FingerMobile brand emoji tags like [emoji:thumbs-up] or :thumbs-up:
 * into inline, high-fidelity 5D mint-green image elements.
 */
export const renderContentWithFingerMobileEmojis = (
  content: string,
  imageClassName = 'inline-block w-6 h-6 object-contain align-middle mx-0.5 rounded-lg transform hover:scale-125 transition-transform'
): React.ReactNode => {
  if (!content) return content;

  // Pattern matches [emoji:slug] or :slug:
  const emojiPattern = /\[emoji:([a-zA-Z0-9_-]+)\]|:([a-zA-Z0-9_-]+):/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = emojiPattern.exec(content)) !== null) {
    const slug = match[1] || match[2];
    const startIndex = match.index;

    // Push text preceding the emoji
    if (startIndex > lastIndex) {
      parts.push(content.substring(lastIndex, startIndex));
    }

    // Find matching FingerMobile 5D Mint-Green emoji
    const emojiMatch: FingerMobileEmojiItem | undefined = FINGERMOBILE_EMOJI_REGISTRY.find(
      (e) => e.slug.toLowerCase() === slug.toLowerCase() || e.id.toLowerCase() === slug.toLowerCase()
    );

    if (emojiMatch) {
      parts.push(
        <span
          key={`emoji-${startIndex}`}
          className="inline-flex items-center align-middle mx-0.5 p-0.5 rounded-md bg-[#defaf2]/60 border border-emerald-300/60 shadow-2xs"
          title={emojiMatch.name}
        >
          <img
            src={emojiMatch.imageUrl}
            alt={emojiMatch.altText || emojiMatch.name}
            className={imageClassName}
            loading="lazy"
          />
        </span>
      );
    } else {
      // If not recognized, leave original text intact
      parts.push(match[0]);
    }

    lastIndex = emojiPattern.lastIndex;
  }

  // Push remaining text
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return <>{parts}</>;
};

export default renderContentWithFingerMobileEmojis;
