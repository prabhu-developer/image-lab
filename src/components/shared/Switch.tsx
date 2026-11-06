import React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  id,
  checked,
  onChange,
  disabled = false,
  label,
  description,
  className,
}) => {
  const switchId = id || `switch_${Math.random().toString(36).substring(2, 7)}`;

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      {(label || description) && (
        <label htmlFor={switchId} className="flex-1 cursor-pointer select-none">
          {label && (
            <div className="text-xs font-medium text-[#202124] dark:text-[#ECECEE]">
              {label}
            </div>
          )}
          {description && (
            <div className="text-[11px] text-[#777777] dark:text-[#98989F] leading-snug">
              {description}
            </div>
          )}
        </label>
      )}

      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed',
          checked ? 'bg-[#4F46E5] dark:bg-[#6366F1]' : 'bg-[#D1D1CB] dark:bg-[#3E3E46]'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
};
