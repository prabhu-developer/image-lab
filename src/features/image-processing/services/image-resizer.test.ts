import { describe, it, expect, vi } from 'vitest';
import { resizeImage } from './image-resizer';
import { WorkspaceImage } from '../types';
import * as canvasProcessor from './canvas-processor';

describe('image-resizer service', () => {
  const mockImage: WorkspaceImage = {
    id: 'test_1',
    file: new File(['mock content'], 'test.png', { type: 'image/png' }),
    name: 'test.png',
    size: 500000,
    type: 'image/png',
    width: 1000,
    height: 800,
    aspectRatio: 1000 / 800,
    previewUrl: 'blob:mock-url',
    hasTransparency: false,
    createdAt: Date.now(),
  };

  it('rejects dimensions under 1px', async () => {
    await expect(
      resizeImage(mockImage, {
        width: 0,
        height: 500,
        maintainAspectRatio: false,
        allowUpscaling: false,
        format: 'image/png',
        quality: 0.8,
        flattenBackground: '#FFFFFF',
      })
    ).rejects.toThrow('Image dimensions must be at least 1 pixel');
  });

  it('rejects dimensions over 10000px', async () => {
    await expect(
      resizeImage(mockImage, {
        width: 12000,
        height: 500,
        maintainAspectRatio: false,
        allowUpscaling: true,
        format: 'image/png',
        quality: 0.8,
        flattenBackground: '#FFFFFF',
      })
    ).rejects.toThrow('exceed the maximum supported limit');
  });

  it('rejects upscaling when allowUpscaling is false', async () => {
    await expect(
      resizeImage(mockImage, {
        width: 1500,
        height: 1200,
        maintainAspectRatio: false,
        allowUpscaling: false,
        format: 'image/png',
        quality: 0.8,
        flattenBackground: '#FFFFFF',
      })
    ).rejects.toThrow('Upscaling is disabled');
  });

  it('successfully executes resize when dimensions are valid', async () => {
    const mockBlob = new Blob(['resized-data'], { type: 'image/png' });
    Object.defineProperty(mockBlob, 'size', { value: 250000 });

    vi.spyOn(canvasProcessor, 'createSourceDrawable').mockResolvedValue({
      source: {} as ImageBitmap,
      cleanup: vi.fn(),
    });

    vi.spyOn(canvasProcessor, 'renderToBlob').mockResolvedValue(mockBlob);

    const result = await resizeImage(mockImage, {
      width: 500,
      height: 400,
      maintainAspectRatio: true,
      allowUpscaling: false,
      format: 'image/png',
      quality: 0.8,
      flattenBackground: '#FFFFFF',
    });

    expect(result.width).toBe(500);
    expect(result.height).toBe(400);
    expect(result.size).toBe(250000);
    expect(result.name).toBe('test-resized.png');
    expect(result.savedBytes).toBe(250000);
    expect(result.savedPercentage).toBe(50);
  });
});
