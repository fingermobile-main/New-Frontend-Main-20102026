import React, {} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-blue-400 bg-blue-100 text-blue-950 hover:bg-blue-200',
        secondary: 'border-slate-300 bg-slate-100 text-slate-900 hover:bg-slate-200',
        destructive: 'border-red-400 bg-red-100 text-red-950 hover:bg-red-200',
        outline: 'border-slate-300 text-slate-800 font-bold bg-slate-50',
        success: 'border-emerald-400 bg-emerald-100 text-emerald-950 hover:bg-emerald-200'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
};

export { Badge, badgeVariants };
