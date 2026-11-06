import { useState, useCallback, useEffect, useRef } from 'react';
import {
  CompressOptions,
  ConvertOptions,
  OperationType,
  ProcessingResult,
  ResizeOptions,
  SupportedOutputMime,
  WorkspaceImage,
} from '../types';
import { DEFAULT_FLATTEN_COLOR, DEFAULT_QUALITY } from '../constants';
import { compressImage } from '../services/image-compressor';
import { resizeImage } from '../services/image-resizer';
import { convertImage } from '../services/image-converter';
import { triggerDownload } from '../utils/file-utils';

export interface UseImageProcessingReturn {
  operation: OperationType;
  setOperation: (op: OperationType) => void;
  compressOptions: CompressOptions;
  setCompressOptions: React.Dispatch<React.SetStateAction<CompressOptions>>;
  resizeOptions: ResizeOptions;
  setResizeOptions: React.Dispatch<React.SetStateAction<ResizeOptions>>;
  convertOptions: ConvertOptions;
  setConvertOptions: React.Dispatch<React.SetStateAction<ConvertOptions>>;
  isProcessing: boolean;
  result: ProcessingResult | null;
  error: string | null;
  processImage: () => Promise<void>;
  resetResult: () => void;
  downloadResult: () => void;
}

export function useImageProcessing(activeImage: WorkspaceImage | null): UseImageProcessingReturn {
  const [operation, setOperation] = useState<OperationType>('compress');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Compression options state
  const [compressOptions, setCompressOptions] = useState<CompressOptions>({
    format: 'image/jpeg',
    quality: DEFAULT_QUALITY,
    flattenBackground: DEFAULT_FLATTEN_COLOR,
  });

  // Resize options state
  const [resizeOptions, setResizeOptions] = useState<ResizeOptions>({
    width: activeImage?.width || 1920,
    height: activeImage?.height || 1080,
    maintainAspectRatio: true,
    allowUpscaling: false,
    format: 'image/jpeg',
    quality: DEFAULT_QUALITY,
    flattenBackground: DEFAULT_FLATTEN_COLOR,
  });

  // Convert options state
  const [convertOptions, setConvertOptions] = useState<ConvertOptions>({
    format: 'image/webp',
    quality: DEFAULT_QUALITY,
    flattenBackground: DEFAULT_FLATTEN_COLOR,
  });

  // Ref to track result URL for revocation
  const resultRef = useRef<ProcessingResult | null>(result);
  resultRef.current = result;

  // Track request token to prevent race conditions
  const processingTokenRef = useRef(0);

  // Synchronize resize dimensions and format when active image changes
  useEffect(() => {
    if (activeImage) {
      setResizeOptions((prev) => ({
        ...prev,
        width: activeImage.width,
        height: activeImage.height,
        format: activeImage.type as SupportedOutputMime,
      }));

      // Set intelligent default format for compression
      setCompressOptions((prev) => ({
        ...prev,
        format: activeImage.type as SupportedOutputMime,
      }));

      // Set intelligent default format for conversion (pick different from current)
      setConvertOptions((prev) => ({
        ...prev,
        format: activeImage.type === 'image/webp' ? 'image/jpeg' : 'image/webp',
      }));

      // Reset result when active image switches
      setResult((prevResult) => {
        if (prevResult) {
          try {
            URL.revokeObjectURL(prevResult.url);
          } catch {
            // Ignore
          }
        }
        return null;
      });
      setError(null);
    }
  }, [activeImage]);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (resultRef.current) {
        try {
          URL.revokeObjectURL(resultRef.current.url);
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  const resetResult = useCallback(() => {
    if (result) {
      try {
        URL.revokeObjectURL(result.url);
      } catch {
        // Ignore
      }
      setResult(null);
    }
    setError(null);
  }, [result]);

  const processImage = useCallback(async () => {
    if (!activeImage) return;

    setIsProcessing(true);
    setError(null);

    const token = ++processingTokenRef.current;

    try {
      let processingOutput: ProcessingResult;

      if (operation === 'compress') {
        processingOutput = await compressImage(activeImage, compressOptions);
      } else if (operation === 'resize') {
        processingOutput = await resizeImage(activeImage, resizeOptions);
      } else {
        processingOutput = await convertImage(activeImage, convertOptions);
      }

      // If another request was started while this one was running, discard stale result
      if (token !== processingTokenRef.current) {
        URL.revokeObjectURL(processingOutput.url);
        return;
      }

      // Cleanup prior result
      if (resultRef.current) {
        try {
          URL.revokeObjectURL(resultRef.current.url);
        } catch {
          // Ignore
        }
      }

      setResult(processingOutput);
    } catch (err) {
      if (token === processingTokenRef.current) {
        setError(err instanceof Error ? err.message : 'Processing failed unexpectedly.');
      }
    } finally {
      if (token === processingTokenRef.current) {
        setIsProcessing(false);
      }
    }
  }, [activeImage, operation, compressOptions, resizeOptions, convertOptions]);

  const downloadResult = useCallback(() => {
    if (!result) return;
    triggerDownload(result.blob, result.name);
  }, [result]);

  return {
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
  };
}
