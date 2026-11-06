import { MAX_FILE_SIZE_BYTES, SUPPORTED_INPUT_MIMES } from '../constants';
import { SupportedInputMime, ValidationResult } from '../types';

export function isSupportedMime(mime: string): mime is SupportedInputMime {
  return SUPPORTED_INPUT_MIMES.includes(mime as SupportedInputMime);
}

export function validateFileMetadata(file: File): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 20 MB.`,
    };
  }

  // Check file MIME type
  if (!isSupportedMime(file.type)) {
    return {
      valid: false,
      error: `Unsupported file format: ${file.type || 'unknown'}. Only JPEG, PNG, and WebP are supported.`,
    };
  }

  return { valid: true };
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();

  // Safely cleanup after microtask
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 100);
}
