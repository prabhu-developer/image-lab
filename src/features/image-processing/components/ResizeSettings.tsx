import React from 'react';
import { Lock, Unlock, AlertCircle } from 'lucide-react';
import { ResizeOptions, WorkspaceImage } from '../types';
import { PERCENTAGE_PRESETS, RESIZE_PRESETS } from '../constants';
import {
  calculateLockedHeight,
  calculateLockedWidth,
  calculateScaleDimensions,
  clampDimension,
} from '../utils/dimension-utils';
import { Switch } from '@/components/shared/Switch';

interface ResizeSettingsProps {
  image: WorkspaceImage;
  options: ResizeOptions;
  onChange: React.Dispatch<React.SetStateAction<ResizeOptions>>;
  disabled?: boolean;
}

export const ResizeSettings: React.FC<ResizeSettingsProps> = ({
  image,
  options,
  onChange,
  disabled = false,
}) => {
  const isUpscaling = options.width > image.width || options.height > image.height;

  const handleWidthChange = (valStr: string) => {
    const rawVal = parseInt(valStr, 10);
    const newWidth = isNaN(rawVal) ? 0 : clampDimension(rawVal);

    if (options.maintainAspectRatio && newWidth > 0) {
      const newHeight = calculateLockedHeight(newWidth, image.aspectRatio);
      onChange((prev) => ({
        ...prev,
        width: newWidth,
        height: newHeight,
      }));
    } else {
      onChange((prev) => ({ ...prev, width: newWidth }));
    }
  };

  const handleHeightChange = (valStr: string) => {
    const rawVal = parseInt(valStr, 10);
    const newHeight = isNaN(rawVal) ? 0 : clampDimension(rawVal);

    if (options.maintainAspectRatio && newHeight > 0) {
      const newWidth = calculateLockedWidth(newHeight, image.aspectRatio);
      onChange((prev) => ({
        ...prev,
        width: newWidth,
        height: newHeight,
      }));
    } else {
      onChange((prev) => ({ ...prev, height: newHeight }));
    }
  };

  const toggleAspectRatio = () => {
    onChange((prev) => {
      const willLock = !prev.maintainAspectRatio;
      if (willLock) {
        // Re-lock to image aspect ratio based on current width
        const adjustedHeight = calculateLockedHeight(prev.width, image.aspectRatio);
        return {
          ...prev,
          maintainAspectRatio: willLock,
          height: adjustedHeight,
        };
      }
      return {
        ...prev,
        maintainAspectRatio: willLock,
      };
    });
  };

  const applyPercentage = (percent: number) => {
    const { width, height } = calculateScaleDimensions(
      image.width,
      image.height,
      percent
    );
    onChange((prev) => ({
      ...prev,
      width,
      height,
    }));
  };

  const applyPreset = (presetWidth: number, presetHeight: number) => {
    onChange((prev) => ({
      ...prev,
      width: presetWidth,
      height: presetHeight,
      // Turn off aspect ratio lock if preset doesn't match native ratio
      maintainAspectRatio: false,
    }));
  };

  return (
    <div className="space-y-5">
      {/* Dimension Inputs */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-medium text-foreground">Custom Dimensions (px)</label>
          <span className="text-[11px] text-foreground-muted font-mono">
            Original: {image.width} × {image.height}
          </span>
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
          {/* Width */}
          <div>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={10000}
                value={options.width || ''}
                disabled={disabled}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono bg-surface border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Width"
              />
              <span className="absolute right-2.5 top-1.5 text-[10px] text-foreground-muted pointer-events-none">
                W
              </span>
            </div>
          </div>

          {/* Aspect Ratio Lock Button */}
          <button
            type="button"
            disabled={disabled}
            onClick={toggleAspectRatio}
            className={`p-1.5 rounded-md border transition-colors ${
              options.maintainAspectRatio
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-surface border-border text-foreground-muted hover:text-foreground'
            }`}
            title={
              options.maintainAspectRatio
                ? 'Aspect ratio locked'
                : 'Aspect ratio unlocked'
            }
          >
            {options.maintainAspectRatio ? (
              <Lock className="w-3.5 h-3.5" />
            ) : (
              <Unlock className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Height */}
          <div>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={10000}
                value={options.height || ''}
                disabled={disabled}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono bg-surface border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Height"
              />
              <span className="absolute right-2.5 top-1.5 text-[10px] text-foreground-muted pointer-events-none">
                H
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Percentage Scale Presets */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground block">
          Scale By Percentage
        </label>
        <div className="grid grid-cols-6 gap-1">
          {PERCENTAGE_PRESETS.map((pct) => {
            const isScaleActive =
              Math.round((options.width / image.width) * 100) === pct &&
              Math.round((options.height / image.height) * 100) === pct;

            return (
              <button
                key={pct}
                type="button"
                disabled={disabled}
                onClick={() => applyPercentage(pct)}
                className={`py-1 px-1.5 text-xs font-mono rounded-md border transition-colors ${
                  isScaleActive
                    ? 'bg-primary text-white border-primary shadow-subtle'
                    : 'bg-surface border-border text-foreground hover:bg-surface-subtle'
                } disabled:opacity-50`}
              >
                {pct}%
              </button>
            );
          })}
        </div>
      </div>

      {/* Standard Presets */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground block">
          Dimension Presets
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {RESIZE_PRESETS.map((preset) => {
            const isPresetActive =
              options.width === preset.width && options.height === preset.height;

            return (
              <button
                key={preset.id}
                type="button"
                disabled={disabled}
                onClick={() => applyPreset(preset.width, preset.height)}
                className={`flex items-center justify-between p-2 rounded-md border text-left text-xs transition-colors ${
                  isPresetActive
                    ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary/40'
                    : 'border-border bg-surface hover:bg-surface-subtle text-foreground-muted hover:text-foreground'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-foreground text-[11px]">
                    {preset.name.split(' (')[0]}
                  </span>
                  <span className="text-[10px] font-mono text-foreground-muted">
                    {preset.width} × {preset.height}
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-subtle text-foreground-muted font-mono">
                  {preset.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Allow Upscaling Toggle */}
      <div className="pt-2 border-t border-border-subtle">
        <Switch
          id="allow-upscaling-switch"
          label="Allow Upscaling"
          description="Enables expanding the image larger than its original resolution."
          checked={options.allowUpscaling}
          disabled={disabled}
          onChange={(checked) =>
            onChange((prev) => ({ ...prev, allowUpscaling: checked }))
          }
        />

        {isUpscaling && !options.allowUpscaling && (
          <div className="mt-2.5 p-2 bg-amber-500/10 border border-amber-500/20 rounded-md text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              Target dimensions exceed original size ({image.width} × {image.height}px). Enable upscaling above to permit enlargement.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
