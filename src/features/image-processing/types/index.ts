export type SupportedInputMime = 'image/jpeg' | 'image/png' | 'image/webp';
export type SupportedOutputMime = 'image/jpeg' | 'image/png' | 'image/webp';
export type ImageFormat = 'jpeg' | 'png' | 'webp';

export type OperationType = 'compress' | 'resize' | 'convert';

export interface WorkspaceImage {
  id: string;
  file: File;
  name: string;
  size: number;
  type: SupportedInputMime;
  width: number;
  height: number;
  aspectRatio: number;
  previewUrl: string;
  hasTransparency: boolean;
  createdAt: number;
}

export interface CompressOptions {
  format: SupportedOutputMime;
  quality: number; // 0.05 to 1.00
  flattenBackground: string; // e.g. '#FFFFFF'
}

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  allowUpscaling: boolean;
  format: SupportedOutputMime;
  quality: number;
  flattenBackground: string;
}

export interface ConvertOptions {
  format: SupportedOutputMime;
  quality: number;
  flattenBackground: string;
}

export interface ProcessingResult {
  id: string;
  sourceImageId: string;
  blob: Blob;
  url: string;
  name: string;
  width: number;
  height: number;
  size: number;
  type: SupportedOutputMime;
  durationMs: number;
  savedBytes: number;
  savedPercentage: number;
  operation: OperationType;
  processedAt: number;
}

export interface ResizePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  category: 'Standard' | 'Social' | 'Display';
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  details?: {
    width?: number;
    height?: number;
    type?: string;
    size?: number;
    hasTransparency?: boolean;
  };
}
