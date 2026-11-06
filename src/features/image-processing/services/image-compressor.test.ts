import { describe, it, expect, vi } from 'vitest';
import { compressImage } from './image-compressor';
import { WorkspaceImage } from '../types';
import * as canvasProcessor from './canvas-processor';

describe('image-compressor service', () => {
  const mockImage: WorkspaceImage = {
    id: 'test_compress_1',
    file: new File(['raw'], 'landscape.jpg', { type: 'image/jpeg' }),
    name: 'landscape.jpg',
    size: 1000000, // 1MB
    type: 'image/jpeg',
    width: 1920,
    height: 1080,
    aspectRatio: 1920 / 1080,
    previewUrl: 'blob:mock-url',
    hasTransparency: false,
    createdAt: Date.now(),
  };

  it('compresses image and calculates accurate savings percentage', async () => {
    const mockBlob = new Blob(['compressed-data'], { type: 'image/jpeg' });
    Object.defineProperty(mockBlob, 'size', { value: 400000 }); // 400KB (60% saved)

    vi.spyOn(canvasProcessor, 'createSourceDrawable').mockResolvedValue({
      source: {} as ImageBitmap,
      cleanup: vi.fn(),
    });

    vi.spyOn(canvasProcessor, 'renderToBlob').mockResolvedValue(mockBlob);

    const result = await compressImage(mockImage, {
      format: 'image/jpeg',
      quality: 0.75,
      flattenBackground: '#FFFFFF',
    });

    expect(result.size).toBe(400000);
    expect(result.savedBytes).toBe(600000);
    expect(result.savedPercentage).toBe(60);
    expect(result.name).toBe('landscape-compressed.jpg');
    expect(result.operation).toBe('compress');
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });
});
