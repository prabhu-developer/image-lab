import { SupportedOutputMime } from '../types';

export interface RenderCanvasOptions {
  sourceImage: ImageBitmap | HTMLImageElement;
  targetWidth: number;
  targetHeight: number;
  targetMime: SupportedOutputMime;
  quality?: number; // 0.05 to 1.00
  flattenBackground?: string; // Hex color e.g. '#FFFFFF'
}

/**
 * Renders an image source to an HTML5 canvas and converts it to a Blob
 * with optional background flattening for transparent surfaces.
 */
export async function renderToBlob(options: RenderCanvasOptions): Promise<Blob> {
  const {
    sourceImage,
    targetWidth,
    targetHeight,
    targetMime,
    quality = 0.85,
    flattenBackground,
  } = options;

  if (targetWidth <= 0 || targetHeight <= 0) {
    throw new Error(`Invalid dimensions for canvas rendering: ${targetWidth} × ${targetHeight}`);
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(targetWidth);
  canvas.height = Math.round(targetHeight);

  const ctx = canvas.getContext('2d', { alpha: targetMime !== 'image/jpeg' });
  if (!ctx) {
    throw new Error('Could not obtain 2D canvas context. Hardware acceleration or memory may be restricted.');
  }

  // Set image smoothing quality for optimal resizing output
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // If target format is JPEG or a background color is explicitly provided, fill background
  const shouldFillBackground = targetMime === 'image/jpeg' || !!flattenBackground;
  if (shouldFillBackground) {
    ctx.fillStyle = flattenBackground || '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw the image scaled to the target dimensions
  ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);

  // PNG does not accept quality parameter in canvas.toBlob (lossless)
  const exportQuality = targetMime === 'image/png' ? undefined : Math.min(Math.max(quality, 0.05), 1);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        // Clean up canvas
        canvas.width = 0;
        canvas.height = 0;

        if (!blob) {
          reject(new Error('Canvas export failed to produce a valid image blob.'));
          return;
        }

        // Check if browser actually supported the requested MIME type
        // e.g. Some environments fallback to image/png when WebP encoding is unsupported
        if (targetMime === 'image/webp' && blob.type !== 'image/webp') {
          // Browser does not support WebP encoding
          reject(
            new Error(
              'Your browser does not support encoding images to WebP format. Please choose JPEG or PNG.'
            )
          );
          return;
        }

        resolve(blob);
      },
      targetMime,
      exportQuality
    );
  });
}

/**
 * Loads an image from a URL or File into an HTMLImageElement or ImageBitmap
 */
export async function createSourceDrawable(
  fileOrUrl: File | string
): Promise<{ source: ImageBitmap | HTMLImageElement; cleanup: () => void }> {
  if (typeof createImageBitmap !== 'undefined' && fileOrUrl instanceof File) {
    try {
      const bitmap = await createImageBitmap(fileOrUrl);
      return {
        source: bitmap,
        cleanup: () => bitmap.close(),
      };
    } catch {
      // Fallback to HTMLImageElement
    }
  }

  const url = typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl);
  const createdOurOwnUrl = typeof fileOrUrl !== 'string';

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resolve({
        source: img,
        cleanup: () => {
          if (createdOurOwnUrl) {
            URL.revokeObjectURL(url);
          }
        },
      });
    };
    img.onerror = () => {
      if (createdOurOwnUrl) {
        URL.revokeObjectURL(url);
      }
      reject(new Error('Failed to load image source for rendering.'));
    };
    img.src = url;
  });
}
