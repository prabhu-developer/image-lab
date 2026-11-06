import { MAX_DIMENSION_PX, MIN_DIMENSION_PX } from '../constants';
import { ProcessingResult, ResizeOptions, WorkspaceImage } from '../types';
import { generateOutputFilename } from '../utils/format-utils';
import { createSourceDrawable, renderToBlob } from './canvas-processor';

export async function resizeImage(
  image: WorkspaceImage,
  options: ResizeOptions
): Promise<ProcessingResult> {
  const startTime = performance.now();

  const targetWidth = Math.round(options.width);
  const targetHeight = Math.round(options.height);

  if (targetWidth < MIN_DIMENSION_PX || targetHeight < MIN_DIMENSION_PX) {
    throw new Error('Image dimensions must be at least 1 pixel.');
  }

  if (targetWidth > MAX_DIMENSION_PX || targetHeight > MAX_DIMENSION_PX) {
    throw new Error(
      `Image dimensions (${targetWidth} × ${targetHeight}px) exceed the maximum supported limit of ${MAX_DIMENSION_PX}px.`
    );
  }

  // Check upscaling restriction
  if (!options.allowUpscaling) {
    if (targetWidth > image.width || targetHeight > image.height) {
      throw new Error(
        `Upscaling is disabled. Target size (${targetWidth} × ${targetHeight}px) is larger than original (${image.width} × ${image.height}px). Enable "Allow upscaling" to proceed.`
      );
    }
  }

  const { source, cleanup } = await createSourceDrawable(image.file);

  try {
    const blob = await renderToBlob({
      sourceImage: source,
      targetWidth,
      targetHeight,
      targetMime: options.format,
      quality: options.quality,
      flattenBackground: options.flattenBackground,
    });

    const durationMs = performance.now() - startTime;
    const outputUrl = URL.createObjectURL(blob);
    const savedBytes = image.size - blob.size;
    const savedPercentage = ((image.size - blob.size) / image.size) * 100;
    const filename = generateOutputFilename(image.name, 'resized', options.format);

    return {
      id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      sourceImageId: image.id,
      blob,
      url: outputUrl,
      name: filename,
      width: targetWidth,
      height: targetHeight,
      size: blob.size,
      type: options.format,
      durationMs,
      savedBytes,
      savedPercentage,
      operation: 'resize',
      processedAt: Date.now(),
    };
  } finally {
    cleanup();
  }
}
