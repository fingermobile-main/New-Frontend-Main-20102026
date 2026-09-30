import React, {} from 'react';

interface AnimatedAvatarProps {
  src?: string;
  staticUrl?: string;
  animatedUrl?: string;
  alt?: string;
  altText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animateOnHover?: boolean;
  className?: string;
}

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({
  src,
  staticUrl,
  animatedUrl,
  alt = 'Avatar',
  altText,
  size = 'md',
  animateOnHover = true,
  className = ''
}) => {
  const finalSrc = src || staticUrl || animatedUrl;
  const finalAlt = altText || alt;
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const animationClass = animateOnHover ? 'transition-transform duration-300 hover:scale-105' : '';

  return (
    <div className={`${sizeClasses[size]} ${animationClass} ${className}`}>
      {finalSrc ? (
        <img
          src={finalSrc}
          alt={finalAlt}
          className="w-full h-full rounded-full object-cover border-2 border-transparent"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-fm-orange to-fm-gray-300 flex items-center justify-center text-white font-bold border-2 border-transparent">
          {finalAlt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default AnimatedAvatar;
