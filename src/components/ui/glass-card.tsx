import * as React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'music';
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white/10 backdrop-blur-lg border border-white/20',
      gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-500/30',
      music: 'bg-black/40 backdrop-blur-xl border border-purple-500/20 shadow-lg shadow-purple-500/10'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl p-6 transition-all duration-300 hover:shadow-xl',
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard };