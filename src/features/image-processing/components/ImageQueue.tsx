import React, { useRef } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { WorkspaceImage } from '../types';
import { formatBytes } from '../utils/format-utils';
import { Button } from '@/components/shared/Button';

interface ImageQueueProps {
  images: WorkspaceImage[];
  activeImageId: string | null;
  onSelectImage: (id: string) => void;
  onRemoveImage: (id: string) => void;
  onClearWorkspace: () => void;
  onAddFiles: (files: FileList | File[]) => void;
}

export const ImageQueue: React.FC<ImageQueueProps> = ({
  images,
  activeImageId,
  onSelectImage,
  onRemoveImage,
  onClearWorkspace,
  onAddFiles,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      e.target.value = '';
    }
  };

  if (images.length === 0) return null;

  return (
    <div className="w-full bg-surface border-b border-border py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Horizontal scrollable image list */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-md border border-dashed border-border hover:border-primary text-foreground-muted hover:text-primary hover:bg-surface-subtle transition-colors shrink-0"
            title="Add more images"
            aria-label="Add more images"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-0.5">Add</span>
          </button>

          {images.map((img) => {
            const isActive = img.id === activeImageId;

            return (
              <div
                key={img.id}
                onClick={() => onSelectImage(img.id)}
                className={`group relative flex items-center gap-2.5 px-2 py-1.5 rounded-lg border cursor-pointer select-none transition-all shrink-0 ${
                  isActive
                    ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary/40'
                    : 'border-border bg-surface hover:border-foreground-muted/40 text-foreground-muted hover:text-foreground'
                }`}
              >
                {/* Thumbnail thumbnail */}
                <div className="w-10 h-10 rounded bg-surface-subtle border border-border-subtle overflow-hidden shrink-0 flex items-center justify-center relative bg-transparency-grid">
                  <img
                    src={img.previewUrl}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col text-left max-w-[120px] sm:max-w-[150px]">
                  <span className="text-xs font-medium truncate text-foreground leading-tight">
                    {img.name}
                  </span>
                  <span className="text-[11px] text-foreground-muted font-mono mt-0.5">
                    {img.width}×{img.height} • {formatBytes(img.size, 0)}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveImage(img.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-error-subtle hover:text-error text-foreground-muted transition-opacity ml-1"
                  title="Remove image"
                  aria-label={`Remove ${img.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Workspace controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearWorkspace}
            className="text-xs text-foreground-muted hover:text-error"
            title="Clear all workspace images"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">Clear Workspace</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
