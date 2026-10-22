import React, { type ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost' | 'link' | 'destructive' | 'default';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'default';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';

  const variantClasses = {
    primary: 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700 focus:ring-indigo-500',
    default: 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-gray-200 border-transparent text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 border-transparent text-white hover:bg-red-700 focus:ring-red-500',
    destructive: 'bg-red-600 border-transparent text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 border-transparent text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'bg-transparent border-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    link: 'bg-transparent border-transparent text-indigo-600 underline-offset-4 hover:underline focus:ring-transparent'
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    default: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
    icon: 'p-2 w-9 h-9 flex items-center justify-center'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim();

  return (
    <button type={type} onClick={props.onClick} className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export const buttonVariants = ({ variant = 'primary', size = 'md' }: { variant?: string; size?: string } = {}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  return `${baseClasses} variant-${variant} size-${size}`;
};

export default Button;
