import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { ConvertOptions, SupportedOutputMime, WorkspaceImage } from '../types';
import { SUPPORTED_OUTPUT_MIMES } from '../constants';
import { getMimeLabel } from '../utils/format-utils';
import { Slider } from '@/components/shared/Slider';

interface ConvertSettingsProps {
  image: WorkspaceImage;
  options: ConvertOptions;
  onChange: React.Dispatch<React.SetStateAction<ConvertOptions>>;
  disabled?: boolean;
}

export const ConvertSettings: React.FC<ConvertSettingsProps> = ({
  image,
  options,
  onChange,
  disabled = false,
}) => {
  const isTargetLosslessPng = options.format === 'image/png';
  const isInputLossy = image.type === 'image/jpeg';
  const isLosingTransparency = image.hasTransparency && options.format === 'image/jpeg';

  const handleFormatChange = (format: SupportedOutputMime) => {
    onChange((prev) => ({ ...prev, format }));
  };

  const handleQualityChange = (qualityPercent: number) => {
    onChange((prev) => ({ ...prev, quality: qualityPercent / 100 }));
  };

  const handleBackgroundColorChange = (color: string) => {
    onChange((prev) => ({ ...prev, flattenBackground: color }));
  };

  return (
    <div className="space-y-5">
      {/* Target Format Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground block">
          Convert Target Format
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {SUPPORTED_OUTPUT_MIMES.map((mime) => {
            const isSelected = options.format === mime;
            const isCurrentFormat = image.type === mime;

            return (
              <button
                key={mime}
                type="button"
                disabled={disabled}
                onClick={() => handleFormatChange(mime)}
                className={`py-2 px-3 rounded-md text-xs font-mono font-medium transition-all relative ${
                  isSelected
                    ? 'bg-primary text-white shadow-subtle'
                    : 'bg-surface border border-border text-foreground hover:bg-surface-subtle'
                } disabled:opacity-50`}
              >
                <span>{getMimeLabel(mime)}</span>
                {isCurrentFormat && (
                  <span className="block text-[9px] opacity-75 font-sans mt-0.5">
                    (Current)
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quality Slider for JPEG / WebP */}
      <div className="space-y-2">
        <Slider
          label="Output Quality"
          value={Math.round(options.quality * 100)}
          min={5}
          max={100}
          step={1}
          unit="%"
          disabled={disabled || isTargetLosslessPng}
          onChange={handleQualityChange}
          helperText={
            isTargetLosslessPng
              ? 'PNG format is lossless; quality setting is ignored.'
              : options.format === 'image/webp'
              ? 'WebP offers modern compression with smaller file sizes and alpha transparency.'
              : 'Standard JPEG compression.'
          }
        />
      </div>

      {/* Lossy -> Lossless conversion note */}
      {isInputLossy && isTargetLosslessPng && (
        <div className="p-2.5 bg-surface-subtle border border-border-subtle rounded-md text-xs text-foreground-muted flex items-start gap-2">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>
            Converting a JPEG image to PNG will not restore lost details or eliminate compression artifacts.
          </span>
        </div>
      )}

      {/* Transparency Warning for JPEG */}
      {isLosingTransparency && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs space-y-2 text-foreground">
          <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Alpha transparency cannot be stored in JPEG</span>
          </div>
          <p className="text-[11px] text-foreground-muted leading-relaxed">
            Choose a solid background color to replace transparent sections:
          </p>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-medium text-foreground-muted">Flatten color:</span>
            <div className="flex items-center gap-1.5">
              {[
                { label: 'White', color: '#FFFFFF' },
                { label: 'Black', color: '#000000' },
                { label: 'Neutral', color: '#F7F7F5' },
              ].map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => handleBackgroundColorChange(c.color)}
                  className={`w-6 h-6 rounded-md border flex items-center justify-center transition-transform ${
                    options.flattenBackground.toUpperCase() === c.color.toUpperCase()
                      ? 'ring-2 ring-primary ring-offset-1 scale-105'
                      : 'border-border'
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={`Use ${c.label}`}
                />
              ))}

              <input
                type="color"
                value={options.flattenBackground}
                onChange={(e) => handleBackgroundColorChange(e.target.value)}
                className="w-6 h-6 p-0 border border-border rounded cursor-pointer bg-transparent"
                title="Custom color"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
