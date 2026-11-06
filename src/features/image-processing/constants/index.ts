import { ResizePreset, SupportedInputMime, SupportedOutputMime } from '../types';

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
export const MAX_DIMENSION_PX = 10000; // 10,000 pixels
export const MIN_DIMENSION_PX = 1;

export const SUPPORTED_INPUT_MIMES: readonly SupportedInputMime[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const SUPPORTED_OUTPUT_MIMES: readonly SupportedOutputMime[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const MIME_TO_EXTENSION: Record<SupportedOutputMime, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export const EXTENSION_TO_MIME: Record<string, SupportedInputMime> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

export const MIME_LABELS: Record<SupportedOutputMime, string> = {
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/webp': 'WebP',
};

export const RESIZE_PRESETS: readonly ResizePreset[] = [
  {
    id: 'fhd',
    name: 'Full HD (1920 × 1080)',
    width: 1920,
    height: 1080,
    category: 'Display',
  },
  {
    id: 'hd',
    name: 'HD (1280 × 720)',
    width: 1280,
    height: 720,
    category: 'Display',
  },
  {
    id: 'ig-square',
    name: 'Instagram Square (1080 × 1080)',
    width: 1080,
    height: 1080,
    category: 'Social',
  },
  {
    id: 'ig-portrait',
    name: 'Instagram Portrait (1080 × 1350)',
    width: 1080,
    height: 1350,
    category: 'Social',
  },
  {
    id: 'story',
    name: 'Story / Reel (1080 × 1920)',
    width: 1080,
    height: 1920,
    category: 'Social',
  },
] as const;

export const PERCENTAGE_PRESETS: readonly number[] = [25, 50, 75, 100, 150, 200] as const;

export const DEFAULT_QUALITY = 0.82;
export const DEFAULT_FLATTEN_COLOR = '#FFFFFF';
