import React from 'react';
import { AlertCircle, Play } from 'lucide-react';
import { useWorkspaceImages } from '../hooks/useWorkspaceImages';
import { useImageProcessing } from '../hooks/useImageProcessing';
import { EmptyState } from './EmptyState';
import { ImageQueue } from './ImageQueue';
import { BeforeAfterView } from './BeforeAfterView';
import { OperationSelector } from './OperationSelector';
import { CompressSettings } from './CompressSettings';
import { ResizeSettings } from './ResizeSettings';
import { ConvertSettings } from './ConvertSettings';
import { ProcessingStats } from './ProcessingStats';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';

export const ImageWorkspace: React.FC = () => {
  const {
    images,
    activeImage,
    activeImageId,
    isUploading,
    uploadErrors,
    addFiles,
    selectImage,
    removeImage,
    clearWorkspace,
    clearErrors,
  } = useWorkspaceImages();

  const {
    operation,
    setOperation,
    compressOptions,
    setCompressOptions,
    resizeOptions,
    setResizeOptions,
    convertOptions,
    setConvertOptions,
    isProcessing,
    result,
    error,
    processImage,
    resetResult,
    downloadResult,
  } = useImageProcessing(activeImage);

  if (images.length === 0) {
    return (
      <EmptyState
        onFilesSelected={addFiles}
        isUploading={isUploading}
        errors={uploadErrors}
        onDismissError={clearErrors}
      />
    );
  }

  const getActionButtonLabel = () => {
    switch (operation) {
      case 'compress':
        return 'Compress Image';
      case 'resize':
        return 'Resize Image';
      case 'convert':
        return 'Convert Image';
    }
  };

  return (
    <div className="w-full flex flex-col flex-1">
      {/* Workspace Thumbnails Queue */}
      <ImageQueue
        images={images}
        activeImageId={activeImageId}
        onSelectImage={selectImage}
        onRemoveImage={removeImage}
        onClearWorkspace={clearWorkspace}
        onAddFiles={addFiles}
      />

      {/* Main Responsive Workspace */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col">
        {uploadErrors.length > 0 && (
          <div className="mb-4 p-3 bg-error-subtle dark:bg-error/10 border border-error/20 rounded-md text-xs text-error flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadErrors[uploadErrors.length - 1]}</span>
            </div>
            <button
              onClick={clearErrors}
              className="underline text-[11px] hover:opacity-80 ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {activeImage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
            {/* Left Column: Image Preview & Comparison (7 cols) */}
            <div className="lg:col-span-7 flex flex-col h-full">
              <BeforeAfterView
                originalImage={activeImage}
                result={result}
                onDownload={downloadResult}
                onReset={resetResult}
              />
            </div>

            {/* Right Column: Controls & Settings (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="p-5 space-y-5 bg-surface">
                {/* Operation Selector */}
                <div>
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 font-mono">
                    Toolkit Operation
                  </h3>
                  <OperationSelector
                    currentOperation={operation}
                    onSelectOperation={(newOp) => {
                      setOperation(newOp);
                      resetResult();
                    }}
                    disabled={isProcessing}
                  />
                </div>

                <div className="h-px bg-border-subtle" />

                {/* Operation-specific settings panel */}
                <div>
                  {operation === 'compress' && (
                    <CompressSettings
                      image={activeImage}
                      options={compressOptions}
                      onChange={setCompressOptions}
                      disabled={isProcessing}
                    />
                  )}

                  {operation === 'resize' && (
                    <ResizeSettings
                      image={activeImage}
                      options={resizeOptions}
                      onChange={setResizeOptions}
                      disabled={isProcessing}
                    />
                  )}

                  {operation === 'convert' && (
                    <ConvertSettings
                      image={activeImage}
                      options={convertOptions}
                      onChange={setConvertOptions}
                      disabled={isProcessing}
                    />
                  )}
                </div>

                {/* Execution Error display */}
                {error && (
                  <div className="p-3 bg-error-subtle dark:bg-error/10 border border-error/20 rounded-md text-xs text-error flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Primary Process Button */}
                {!result && (
                  <Button
                    variant="primary"
                    size="lg"
                    isLoading={isProcessing}
                    onClick={processImage}
                    className="w-full text-xs font-semibold"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                    {getActionButtonLabel()}
                  </Button>
                )}
              </Card>

              {/* Processed Results & Metrics Card */}
              {result && (
                <ProcessingStats
                  originalImage={activeImage}
                  result={result}
                  onDownload={downloadResult}
                  onReset={resetResult}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
