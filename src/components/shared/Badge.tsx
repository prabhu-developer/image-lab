import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    default:
      'bg-[#F0F0ED] text-[#202124] border border-[#E7E7E3] dark:bg-[#222226] dark:text-[#ECECEE] dark:border-[#2E2E33]',
    primary:
      'bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] dark:bg-[#1E1B4B] dark:text-[#A5B4FC] dark:border-[#3730A3]',
    success:
      'bg-[#ECFDF5] text-[#25845A] border border-[#A7F3D0] dark:bg-[#064E3B]/40 dark:text-[#34D399] dark:border-[#065F46]',
    warning:
      'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] dark:bg-[#78350F]/40 dark:text-[#FBBF24] dark:border-[#92400E]',
    error:
      'bg-[#FEF2F2] text-[#D94B4B] border border-[#FECACA] dark:bg-[#7F1D1D]/40 dark:text-[#F87171] dark:border-[#991B1B]',
    neutral:
      'bg-[#F7F7F5] text-[#777777] border border-[#E7E7E3] dark:bg-[#1B1B1E] dark:text-[#98989F] dark:border-[#2C2C32]',
  };

  const sizes = {
    sm: 'text-[11px] px-1.5 py-0.5 font-medium tracking-tight rounded',
    md: 'text-xs px-2 py-0.5 font-medium rounded-md',
  };

  return (
    <span
      className={cn('inline-flex items-center gap-1 font-mono select-none', variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};
