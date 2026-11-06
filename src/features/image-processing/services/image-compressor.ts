import { CompressOptions, ProcessingResult, WorkspaceImage } from '../types';
import { generateOutputFilename } from '../utils/format-utils';
import { createSourceDrawable, renderToBlob } from './canvas-processor';

export async function compressImage(
  image: WorkspaceImage,
  options: CompressOptions
): Promise<ProcessingResult> {
  const startTime = performance.now();

  const { source, cleanup } = await createSourceDrawable(image.file);

  try {
    const blob = await renderToBlob({
      sourceImage: source,
      targetWidth: image.width,
      targetHeight: image.height,
      targetMime: options.format,
      quality: options.quality,
      flattenBackground: options.flattenBackground,
    });

    const durationMs = performance.now() - startTime;
    const outputUrl = URL.createObjectURL(blob);
    const savedBytes = image.size - blob.size;
    const savedPercentage = ((image.size - blob.size) / image.size) * 100;
    const filename = generateOutputFilename(image.name, 'compressed', options.format);

    return {
      id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      sourceImageId: image.id,
      blob,
      url: outputUrl,
      name: filename,
      width: image.width,
      height: image.height,
      size: blob.size,
      type: options.format,
      durationMs,
      savedBytes,
      savedPercentage,
      operation: 'compress',
      processedAt: Date.now(),
    };
  } finally {
    cleanup();
  }
}
