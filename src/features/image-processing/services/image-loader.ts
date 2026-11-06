import { MAX_DIMENSION_PX } from '../constants';
import { SupportedInputMime, WorkspaceImage } from '../types';
import { validateFileMetadata } from '../utils/file-utils';

/**
 * Checks whether an image has any non-opaque pixels by inspecting an offscreen sample canvas.
 * Samples a maximum 100x100 grid to keep performance extremely fast.
 */
export async function detectTransparency(
  imageSource: ImageBitmap | HTMLImageElement,
  width: number,
  height: number
): Promise<boolean> {
  try {
    const sampleWidth = Math.min(width, 100);
    const sampleHeight = Math.min(height, 100);

    const canvas = document.createElement('canvas');
    canvas.width = sampleWidth;
    canvas.height = sampleHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;

    ctx.drawImage(imageSource, 0, 0, sampleWidth, sampleHeight);
    const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
    const data = imageData.data;

    // Check alpha component of pixels (every 4th byte)
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 250) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Validates and loads a File into a decoded WorkspaceImage.
 * Uses createImageBitmap if supported, falling back to HTMLImageElement.
 */
export async function loadWorkspaceImage(file: File): Promise<WorkspaceImage> {
  // Step 1: Preliminary file metadata check
  const metaValidation = validateFileMetadata(file);
  if (!metaValidation.valid) {
    throw new Error(metaValidation.error || 'Invalid file');
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    let width = 0;
    let height = 0;
    let hasTransparency = false;

    if (typeof createImageBitmap !== 'undefined') {
      try {
        const bitmap = await createImageBitmap(file);
        width = bitmap.width;
        height = bitmap.height;

        if (file.type === 'image/png' || file.type === 'image/webp') {
          hasTransparency = await detectTransparency(bitmap, width, height);
        }

        bitmap.close();
      } catch {
        // Fallback to HTMLImageElement if createImageBitmap fails
        const img = await loadImageElement(objectUrl);
        width = img.naturalWidth;
        height = img.naturalHeight;

        if (file.type === 'image/png' || file.type === 'image/webp') {
          hasTransparency = await detectTransparency(img, width, height);
        }
      }
    } else {
      const img = await loadImageElement(objectUrl);
      width = img.naturalWidth;
      height = img.naturalHeight;

      if (file.type === 'image/png' || file.type === 'image/webp') {
        hasTransparency = await detectTransparency(img, width, height);
      }
    }

    // Step 2: Validate decoded dimensions
    if (width <= 0 || height <= 0) {
      throw new Error('Image could not be decoded. The file appears to be corrupted.');
    }

    if (width > MAX_DIMENSION_PX || height > MAX_DIMENSION_PX) {
      throw new Error(
        `Image dimensions (${width} × ${height}px) exceed the maximum supported limit of ${MAX_DIMENSION_PX}px.`
      );
    }

    const id = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return {
      id,
      file,
      name: file.name,
      size: file.size,
      type: file.type as SupportedInputMime,
      width,
      height,
      aspectRatio: width / height,
      previewUrl: objectUrl,
      hasTransparency,
      createdAt: Date.now(),
    };
  } catch (err) {
    URL.revokeObjectURL(objectUrl);
    throw err instanceof Error ? err : new Error('Failed to load image');
  }
}

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to decode image data. Corrupted or invalid format.'));
    img.src = url;
  });
}
