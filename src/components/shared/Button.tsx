import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none rounded-md';

    const variants = {
      primary:
        'bg-[#4F46E5] text-white hover:bg-[#4338CA] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] shadow-subtle',
      secondary:
        'bg-[#F0F0ED] text-[#202124] hover:bg-[#E7E7E3] dark:bg-[#25252A] dark:text-[#ECECEE] dark:hover:bg-[#2D2D33]',
      outline:
        'border border-[#E7E7E3] bg-white text-[#202124] hover:bg-[#F7F7F5] dark:border-[#2E2E33] dark:bg-[#1B1B1E] dark:text-[#ECECEE] dark:hover:bg-[#222226]',
      ghost:
        'text-[#777777] hover:text-[#202124] hover:bg-[#F2F2EF] dark:text-[#98989F] dark:hover:text-[#ECECEE] dark:hover:bg-[#222226]',
      danger:
        'bg-[#D94B4B] text-white hover:bg-[#C23C3C] dark:bg-[#D94B4B] dark:hover:bg-[#B83838]',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-9 px-4 text-sm gap-2',
      lg: 'h-11 px-5 text-sm font-medium gap-2.5',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
