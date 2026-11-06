import { MIME_LABELS, MIME_TO_EXTENSION } from '../constants';
import { SupportedOutputMime } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  if (bytes < 0) return '-' + formatBytes(Math.abs(bytes), decimals);

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const safeI = Math.min(i, sizes.length - 1);

  return `${parseFloat((bytes / Math.pow(k, safeI)).toFixed(dm))} ${sizes[safeI]}`;
}

export function formatPercentage(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded > 0 ? '+' : ''}${rounded}%`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)} ms`;
  }
  return `${(ms / 1000).toFixed(2)} s`;
}

export function getMimeLabel(mime: string): string {
  return MIME_LABELS[mime as SupportedOutputMime] || mime.replace('image/', '').toUpperCase();
}

/**
 * Generates clean, predictable filenames for processed images
 * e.g., "portrait-compressed.webp", "banner-resized.jpg"
 */
export function generateOutputFilename(
  originalFilename: string,
  operation: string,
  outputMime: SupportedOutputMime
): string {
  // Strip existing extension
  const lastDotIndex = originalFilename.lastIndexOf('.');
  const baseName = lastDotIndex > 0 ? originalFilename.substring(0, lastDotIndex) : originalFilename;
  
  // Clean special characters while preserving readable naming
  const cleanBase = baseName.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_');
  const extension = MIME_TO_EXTENSION[outputMime] || '.jpg';

  return `${cleanBase}-${operation}${extension}`;
}
