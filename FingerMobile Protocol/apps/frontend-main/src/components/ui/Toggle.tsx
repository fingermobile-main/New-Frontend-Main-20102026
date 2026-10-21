import React, {} from 'react';

interface ToggleProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Toggle: React.FC<ToggleProps> = ({
  pressed,
  onPressedChange,
  children,
  className = '',
  disabled = false,
  variant = 'default',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-8 px-2',
    md: 'h-9 px-3',
    lg: 'h-10 px-4'
  };

  const variantClasses = variant === 'outline'
    ? 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground'
    : 'hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground';

  const handleClick = () => {
    if (!disabled) {
      onPressedChange(!pressed);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-pressed={pressed}
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${sizeClasses[size]} ${variantClasses} ${pressed ? 'bg-accent text-accent-foreground' : 'bg-transparent'} ${className}`}
    >
      {children}
    </button>
  );
};

export { Toggle };
