import React, {} from 'react';

import { cn } from '@/lib/utils';

export interface BlockQuoteProps extends React.BlockquoteHTMLAttributes<HTMLQuoteElement> {
  cite?: string;
}

const BlockQuote = React.forwardRef<HTMLQuoteElement, BlockQuoteProps>(
  ({ className, cite, children, ...props }, ref) => {
    return (
      <blockquote
        ref={ref}
        className={cn(
          'border-l-4 border-primary pl-4 italic text-slate-700 dark:text-slate-300 font-medium',
          className
        )}
        cite={cite}
        {...props}
      >
        {children}
      </blockquote>
    );
  }
);
BlockQuote.displayName = 'BlockQuote';

export { BlockQuote };
