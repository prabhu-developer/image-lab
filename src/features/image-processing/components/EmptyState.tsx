import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';

interface EmptyStateProps {
  onFilesSelected: (files: FileList | File[]) => void;
  isUploading: boolean;
  errors?: string[];
  onDismissError?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onFilesSelected,
  isUploading,
  errors = [],
  onDismissError,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      // Reset input value so re-selecting same file triggers change
      e.target.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full group cursor-pointer border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-border hover:border-primary/50 bg-surface hover:bg-surface-subtle/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center">
          <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <h2 className="text-lg font-semibold text-foreground tracking-tight">
            Drop your images here
          </h2>
          <p className="text-xs text-foreground-muted mt-1.5 max-w-sm">
            Drag and drop JPEG, PNG, or WebP files, or browse from your computer.
          </p>

          <div className="mt-5">
            <Button
              type="button"
              variant="primary"
              size="md"
              isLoading={isUploading}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <ImageIcon className="w-4 h-4 mr-1.5" />
              Browse Files
            </Button>
          </div>

          {/* Formats and Limit info */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 pt-6 border-t border-border-subtle w-full max-w-md text-xs text-foreground-muted">
            <span>Supported:</span>
            <Badge variant="neutral" size="sm">JPEG</Badge>
            <Badge variant="neutral" size="sm">PNG</Badge>
            <Badge variant="neutral" size="sm">WebP</Badge>
            <span className="text-border mx-1">•</span>
            <span>Max size: <strong>20 MB</strong></span>
          </div>
        </div>
      </div>

      {/* Error Notices */}
      {errors.length > 0 && (
        <div className="mt-4 w-full p-3.5 bg-error-subtle dark:bg-error/10 border border-error/20 rounded-lg text-xs text-error space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              File validation notice
            </span>
            {onDismissError && (
              <button
                onClick={onDismissError}
                className="underline hover:opacity-80 text-[11px]"
              >
                Dismiss
              </button>
            )}
          </div>
          <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Privacy Message Card */}
      <div className="mt-8 flex items-start gap-3 p-3.5 bg-surface border border-border rounded-lg text-xs text-foreground-muted max-w-md w-full">
        <ShieldCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
        <div>
          <span className="font-medium text-foreground block">
            Guaranteed Local Processing
          </span>
          <span>
            Your files remain 100% on this computer. No images are sent to any remote server or cloud API.
          </span>
        </div>
      </div>
    </div>
  );
};
