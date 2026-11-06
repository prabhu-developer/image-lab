import React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  onChange: (value: number) => void;
  className?: string;
  helperText?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  disabled = false,
  onChange,
  className,
  helperText,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between text-xs">
        <label className="font-medium text-[#202124] dark:text-[#ECECEE]">{label}</label>
        <span className="font-mono text-xs font-semibold text-[#4F46E5] dark:text-[#6366F1] bg-[#EEF2FF] dark:bg-[#1E1B4B] px-1.5 py-0.5 rounded">
          {value}
          {unit}
        </span>
      </div>

      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-[#E7E7E3] dark:bg-[#2C2C32] rounded-lg appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed accent-[#4F46E5] dark:accent-[#6366F1] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          style={{
            background: `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${percentage}%, var(--color-border) ${percentage}%, var(--color-border) 100%)`,
          }}
        />
      </div>

      {helperText && (
        <p className="text-[11px] text-[#777777] dark:text-[#98989F]">{helperText}</p>
      )}
    </div>
  );
};
