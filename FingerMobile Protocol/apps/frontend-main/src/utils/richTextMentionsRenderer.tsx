import React from 'react';
import { FINGERMOBILE_EMOJI_REGISTRY, FingerMobileEmojiItem } from '../services/emojiPackService';

export interface RenderMentionsOptions {
  onMentionClick?: (handle: string, isGlobal: boolean) => void;
  onHashtagClick?: (tag: string) => void;
  emojiClassName?: string;
}

const GLOBAL_MENTIONS = ['all', 'everyone', 'members', 'channel'];

/**
 * Universal Parser & Renderer for:
 * 1. 5D Mint-Green FingerMobile Brand Emojis ([emoji:slug] or :slug:)
 * 2. Group Mentions (@all, @everyone, @members, @channel)
 * 3. Sovereign Member User Mentions (@username)
 * 4. Inverted-Indexed Hashtags (#topic, #coding, #web3)
 *
 * Adheres strictly to WCAG AAA high-contrast standards.
 */
export const renderContentWithMentionsAndEmojis = (
  content: string,
  options: RenderMentionsOptions = {}
): React.ReactNode => {
  if (!content || typeof content !== 'string') return content;

  const {
    onMentionClick,
    onHashtagClick,
    emojiClassName = 'inline-block w-6 h-6 object-contain align-middle mx-0.5 rounded-lg transform hover:scale-125 transition-transform'
  } = options;

  // Unified Regex Pattern:
  // Match 1: Emojis: \[emoji:([a-zA-Z0-9_-]+)\] or :([a-zA-Z0-9_-]+):
  // Match 2: Mentions: @([a-zA-Z0-9_]+)
  // Match 3: Hashtags: #([a-zA-Z0-9_]+)
  const tokenRegex = /\[emoji:([a-zA-Z0-9_-]+)\]|:([a-zA-Z0-9_-]+):|@([a-zA-Z0-9_]+)|#([a-zA-Z0-9_]+)/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(content)) !== null) {
    const startIndex = match.index;

    // Push plain text prior to this token
    if (startIndex > lastIndex) {
      elements.push(content.substring(lastIndex, startIndex));
    }

    const emojiSlug = match[1] || match[2];
    const mentionHandle = match[3];
    const hashtagText = match[4];

    if (emojiSlug) {
      // 1. Emoji Token
      const emojiMatch: FingerMobileEmojiItem | undefined = FINGERMOBILE_EMOJI_REGISTRY.find(
        (e) => e.slug.toLowerCase() === emojiSlug.toLowerCase() || e.id.toLowerCase() === emojiSlug.toLowerCase()
      );

      if (emojiMatch) {
        elements.push(
          <span
            key={`emoji-${startIndex}`}
            className="inline-flex items-center align-middle mx-0.5 p-0.5 rounded-md bg-[#defaf2]/60 border border-emerald-300/60 shadow-2xs"
            title={emojiMatch.name}
          >
            <img
              src={emojiMatch.imageUrl}
              alt={emojiMatch.altText || emojiMatch.name}
              className={emojiClassName}
              loading="lazy"
            />
          </span>
        );
      } else {
        elements.push(match[0]);
      }
    } else if (mentionHandle) {
      // 2. Mention Token
      const cleanHandle = mentionHandle.toLowerCase();
      const isGlobal = GLOBAL_MENTIONS.includes(cleanHandle);

      if (isGlobal) {
        // Global mass ping (@all, @everyone, @members)
        elements.push(
          <span
            key={`mention-${startIndex}`}
            onClick={(e) => {
              if (onMentionClick) {
                e.stopPropagation();
                onMentionClick(mentionHandle, true);
              }
            }}
            className={`inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md text-xs font-black bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs ${
              onMentionClick ? 'cursor-pointer hover:bg-amber-200 transition' : ''
            }`}
            title={`Channel Broadcast (@${mentionHandle})`}
          >
            @{mentionHandle}
          </span>
        );
      } else {
        // Individual user mention (@username)
        elements.push(
          <a
            key={`mention-${startIndex}`}
            href={`/profile?username=${mentionHandle}`}
            onClick={(e) => {
              if (onMentionClick) {
                e.preventDefault();
                e.stopPropagation();
                onMentionClick(mentionHandle, false);
              }
            }}
            className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-950 border border-indigo-200 hover:bg-indigo-100 hover:text-indigo-900 transition cursor-pointer shadow-2xs"
            title={`View profile for @${mentionHandle}`}
          >
            @{mentionHandle}
          </a>
        );
      }
    } else if (hashtagText) {
      // 3. Hashtag Token
      elements.push(
        <a
          key={`hashtag-${startIndex}`}
          href={`/discover?tag=${hashtagText}`}
          onClick={(e) => {
            if (onHashtagClick) {
              e.preventDefault();
              e.stopPropagation();
              onHashtagClick(hashtagText);
            }
          }}
          className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-950 border border-emerald-300 hover:bg-emerald-100 hover:text-emerald-900 transition cursor-pointer shadow-2xs"
          title={`Discover #${hashtagText} posts & trends`}
        >
          #{hashtagText}
        </a>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  // Push remaining plain text
  if (lastIndex < content.length) {
    elements.push(content.substring(lastIndex));
  }

  return <>{elements}</>;
};

export default renderContentWithMentionsAndEmojis;

