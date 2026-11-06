import React, { useState } from 'react';
import { Download, Check, Sparkles } from 'lucide-react';
import { ProcessingResult, WorkspaceImage } from '../types';
import { formatBytes, formatDuration, getMimeLabel } from '../utils/format-utils';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';

interface ProcessingStatsProps {
  originalImage: WorkspaceImage;
  result: ProcessingResult;
  onDownload: () => void;
  onReset: () => void;
}

export const ProcessingStats: React.FC<ProcessingStatsProps> = ({
  originalImage,
  result,
  onDownload,
  onReset,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadClick = () => {
    onDownload();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const isSavings = result.savedBytes > 0;
  const isExpansion = result.savedBytes < 0;

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-4 shadow-card">
      {/* Header Result status */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground">
              Processing Complete
            </h4>
            <p className="text-[11px] text-foreground-muted">
              Finished in {formatDuration(result.durationMs)}
            </p>
          </div>
        </div>

        <Badge
          variant={isSavings ? 'success' : isExpansion ? 'warning' : 'neutral'}
          size="md"
        >
          {isSavings
            ? `-${Math.abs(result.savedPercentage).toFixed(1)}%`
            : isExpansion
            ? `+${Math.abs(result.savedPercentage).toFixed(1)}%`
            : '0%'}
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Original File */}
        <div className="p-2.5 bg-surface-subtle border border-border-subtle rounded-md space-y-1">
          <span className="text-[10px] text-foreground-muted uppercase tracking-wider block font-mono">
            Original
          </span>
          <div className="font-semibold text-foreground text-sm">
            {formatBytes(originalImage.size)}
          </div>
          <div className="text-[11px] text-foreground-muted font-mono">
            {originalImage.width} × {originalImage.height} • {getMimeLabel(originalImage.type)}
          </div>
        </div>

        {/* Processed File */}
        <div className="p-2.5 bg-surface-subtle border border-border-subtle rounded-md space-y-1">
          <span className="text-[10px] text-foreground-muted uppercase tracking-wider block font-mono">
            Optimized
          </span>
          <div className="font-semibold text-primary text-sm">
            {formatBytes(result.size)}
          </div>
          <div className="text-[11px] text-foreground-muted font-mono">
            {result.width} × {result.height} • {getMimeLabel(result.type)}
          </div>
        </div>
      </div>

      {/* Reduction summary */}
      <div className="text-xs text-foreground-muted px-1">
        {isSavings && (
          <p className="flex items-center gap-1.5 text-success">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>
              Saved <strong>{formatBytes(result.savedBytes)}</strong> ({result.savedPercentage.toFixed(1)}% reduction)
            </span>
          </p>
        )}
        {isExpansion && (
          <p className="text-foreground-muted text-[11px]">
            Output file size increased by {formatBytes(Math.abs(result.savedBytes))}. (Upscaling or re-encoding to higher quality WebP/PNG).
          </p>
        )}
      </div>

      {/* Download Action Button */}
      <div className="pt-1 flex flex-col gap-2">
        <Button
          variant="primary"
          size="lg"
          onClick={handleDownloadClick}
          className="w-full text-xs font-semibold"
        >
          {downloaded ? (
            <>
              <Check className="w-4 h-4 mr-1.5" />
              Downloaded to your device!
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-1.5" />
              Download {result.name}
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="w-full text-xs text-foreground-muted hover:text-foreground"
        >
          Modify settings or re-process
        </Button>
      </div>
    </div>
  );
};
