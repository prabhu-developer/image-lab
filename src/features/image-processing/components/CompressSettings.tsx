import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { CompressOptions, SupportedOutputMime, WorkspaceImage } from '../types';
import { SUPPORTED_OUTPUT_MIMES } from '../constants';
import { getMimeLabel } from '../utils/format-utils';
import { Slider } from '@/components/shared/Slider';

interface CompressSettingsProps {
  image: WorkspaceImage;
  options: CompressOptions;
  onChange: React.Dispatch<React.SetStateAction<CompressOptions>>;
  disabled?: boolean;
}

export const CompressSettings: React.FC<CompressSettingsProps> = ({
  image,
  options,
  onChange,
  disabled = false,
}) => {
  const isLosslessPng = options.format === 'image/png';
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
      {/* Target Format */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground block">
          Output Format
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {SUPPORTED_OUTPUT_MIMES.map((mime) => {
            const isSelected = options.format === mime;
            return (
              <button
                key={mime}
                type="button"
                disabled={disabled}
                onClick={() => handleFormatChange(mime)}
                className={`py-1.5 px-3 rounded-md text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? 'bg-primary text-white shadow-subtle'
                    : 'bg-surface border border-border text-foreground hover:bg-surface-subtle'
                } disabled:opacity-50`}
              >
                {getMimeLabel(mime)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quality Slider (for JPEG / WebP) */}
      <div className="space-y-2">
        <Slider
          label="Compression Quality"
          value={Math.round(options.quality * 100)}
          min={5}
          max={100}
          step={1}
          unit="%"
          disabled={disabled || isLosslessPng}
          onChange={handleQualityChange}
          helperText={
            isLosslessPng
              ? 'PNG uses lossless compression in browser Canvas. Quality setting is not applicable.'
              : options.quality > 0.85
              ? 'High quality, minimal compression artifacts.'
              : options.quality >= 0.6
              ? 'Balanced compression, ideal for web delivery.'
              : 'Maximum file size reduction with visible compression.'
          }
        />
      </div>

      {/* Lossy PNG Note */}
      {isLosslessPng && (
        <div className="p-2.5 bg-surface-subtle border border-border-subtle rounded-md text-xs text-foreground-muted flex items-start gap-2">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>
            Canvas PNG export is lossless. To reduce PNG file sizes significantly, consider converting to WebP format.
          </span>
        </div>
      )}

      {/* Transparency Warning & Flatten Color (for JPEG) */}
      {isLosingTransparency && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs space-y-2 text-foreground">
          <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Image contains transparent pixels</span>
          </div>
          <p className="text-[11px] text-foreground-muted leading-relaxed">
            JPEG format does not support transparency. Transparent areas will be flattened with the background color chosen below:
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
