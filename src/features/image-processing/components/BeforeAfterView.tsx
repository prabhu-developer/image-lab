import React, { useState } from 'react';
import { Columns, Eye, Download, RotateCcw } from 'lucide-react';
import { ProcessingResult, WorkspaceImage } from '../types';
import { formatBytes, getMimeLabel } from '../utils/format-utils';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';

interface BeforeAfterViewProps {
  originalImage: WorkspaceImage;
  result: ProcessingResult | null;
  onDownload: () => void;
  onReset: () => void;
}

export const BeforeAfterView: React.FC<BeforeAfterViewProps> = ({
  originalImage,
  result,
  onDownload,
  onReset,
}) => {
  const [viewMode, setViewMode] = useState<'sideBySide' | 'toggle'>('sideBySide');
  const [toggleActiveView, setToggleActiveView] = useState<'original' | 'processed'>('processed');

  // If no result yet, display single original preview
  if (!result) {
    return (
      <div className="flex flex-col h-full">
        {/* Preview Container */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[420px] rounded-lg border border-border bg-surface flex items-center justify-center p-4 overflow-hidden bg-transparency-grid">
          <img
            src={originalImage.previewUrl}
            alt={originalImage.name}
            className="max-h-[500px] max-w-full object-contain rounded shadow-subtle"
          />

          {/* Floating metadata badge */}
          <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-md border border-border rounded-md px-3 py-1.5 flex items-center gap-2 shadow-subtle text-xs">
            <span className="font-medium text-foreground truncate max-w-[180px]">
              {originalImage.name}
            </span>
            <span className="text-border">•</span>
            <span className="font-mono text-foreground-muted">
              {originalImage.width} × {originalImage.height}
            </span>
            <span className="text-border">•</span>
            <Badge variant="neutral" size="sm">
              {getMimeLabel(originalImage.type)}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* View Mode Toolbar */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-foreground">
            Comparison
          </span>
          <Badge
            variant={result.savedBytes > 0 ? 'success' : result.savedBytes < 0 ? 'warning' : 'neutral'}
            size="sm"
          >
            {result.savedBytes > 0
              ? `${Math.abs(result.savedPercentage).toFixed(1)}% smaller`
              : result.savedBytes < 0
              ? `${Math.abs(result.savedPercentage).toFixed(1)}% larger`
              : 'Same size'}
          </Badge>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-surface-subtle p-0.5 rounded-md border border-border-subtle">
          <button
            type="button"
            onClick={() => setViewMode('sideBySide')}
            className={`hidden md:flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
              viewMode === 'sideBySide'
                ? 'bg-surface text-foreground shadow-subtle'
                : 'text-foreground-muted hover:text-foreground'
            }`}
            title="Side-by-side view"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('toggle')}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
              viewMode === 'toggle' || window.innerWidth < 768
                ? 'bg-surface text-foreground shadow-subtle'
                : 'text-foreground-muted hover:text-foreground'
            }`}
            title="Toggle between original and processed"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Toggle</span>
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      {viewMode === 'sideBySide' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-h-[360px]">
          {/* Original View Card */}
          <div className="relative rounded-lg border border-border bg-surface p-3 flex flex-col items-center justify-center bg-transparency-grid overflow-hidden">
            <span className="absolute top-2.5 left-2.5 z-10 text-[10px] uppercase font-mono font-semibold tracking-wider px-2 py-0.5 rounded bg-surface/90 border border-border text-foreground">
              Original
            </span>
            <img
              src={originalImage.previewUrl}
              alt="Original"
              className="max-h-[360px] max-w-full object-contain rounded shadow-subtle"
            />
            <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between px-2.5 py-1 bg-surface/90 backdrop-blur-sm border border-border rounded text-[11px] font-mono text-foreground-muted">
              <span>{originalImage.width} × {originalImage.height}</span>
              <span>{formatBytes(originalImage.size)}</span>
            </div>
          </div>

          {/* Processed View Card */}
          <div className="relative rounded-lg border border-primary/40 bg-surface p-3 flex flex-col items-center justify-center bg-transparency-grid overflow-hidden ring-1 ring-primary/20">
            <span className="absolute top-2.5 left-2.5 z-10 text-[10px] uppercase font-mono font-semibold tracking-wider px-2 py-0.5 rounded bg-primary text-white shadow-subtle">
              Processed
            </span>
            <img
              src={result.url}
              alt="Processed"
              className="max-h-[360px] max-w-full object-contain rounded shadow-subtle"
            />
            <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between px-2.5 py-1 bg-surface/90 backdrop-blur-sm border border-border rounded text-[11px] font-mono text-foreground-muted">
              <span className="text-foreground font-medium">{result.width} × {result.height}</span>
              <span className="text-primary font-medium">{formatBytes(result.size)}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Mobile / Toggle View */
        <div className="flex flex-col flex-1 min-h-[360px] space-y-2">
          {/* Selector Tabs */}
          <div className="flex rounded-md p-1 bg-surface-subtle border border-border-subtle">
            <button
              type="button"
              onClick={() => setToggleActiveView('original')}
              className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                toggleActiveView === 'original'
                  ? 'bg-surface text-foreground shadow-subtle'
                  : 'text-foreground-muted'
              }`}
            >
              Original ({formatBytes(originalImage.size)})
            </button>
            <button
              type="button"
              onClick={() => setToggleActiveView('processed')}
              className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                toggleActiveView === 'processed'
                  ? 'bg-primary text-white shadow-subtle'
                  : 'text-foreground-muted'
              }`}
            >
              Processed ({formatBytes(result.size)})
            </button>
          </div>

          {/* Preview Image */}
          <div className="relative flex-1 rounded-lg border border-border bg-surface p-3 flex items-center justify-center bg-transparency-grid overflow-hidden min-h-[300px]">
            <img
              src={toggleActiveView === 'original' ? originalImage.previewUrl : result.url}
              alt={toggleActiveView === 'original' ? 'Original' : 'Processed'}
              className="max-h-[360px] max-w-full object-contain rounded shadow-subtle"
            />
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="text-xs text-foreground-muted hover:text-foreground"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Adjust Settings
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onDownload}
          className="text-xs"
        >
          <Download className="w-4 h-4 mr-1.5" />
          Download
        </Button>
      </div>
    </div>
  );
};
