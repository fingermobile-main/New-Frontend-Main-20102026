import React, {} from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children?: React.ReactNode;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  fallback,
  className = '',
  size = 'md',
  children
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  // If children are provided, use them (for compound component pattern)
  if (children) {
    return (
      <div
        className={`relative flex items-center justify-center rounded-full bg-gray-200 overflow-hidden ${sizeClasses[size]} ${className}`}
      >
        {children}
      </div>
    );
  }

  // Otherwise use simple pattern with src/fallback props
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gray-200 overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-medium text-gray-700">
          {fallback || (alt ? alt.charAt(0).toUpperCase() : '?')}
        </span>
      )}
    </div>
  );
};

const AvatarImage: React.FC<{ src?: string; alt?: string; className?: string }> = ({ src, alt, className }) => (
  src ? <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`}  /> : null
);

const AvatarFallback: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span className={`font-medium text-gray-700 ${className}`}>{children}</span>
);

export { Avatar, AvatarImage, AvatarFallback };
export default Avatar;
