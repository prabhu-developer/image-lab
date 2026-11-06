import { describe, it, expect, vi } from 'vitest';
import { convertImage } from './image-converter';
import { WorkspaceImage } from '../types';
import * as canvasProcessor from './canvas-processor';

describe('image-converter service', () => {
  const mockPngImage: WorkspaceImage = {
    id: 'test_convert_1',
    file: new File(['png-data'], 'icon.png', { type: 'image/png' }),
    name: 'icon.png',
    size: 200000,
    type: 'image/png',
    width: 512,
    height: 512,
    aspectRatio: 1,
    previewUrl: 'blob:mock-url',
    hasTransparency: true,
    createdAt: Date.now(),
  };

  it('converts PNG to WebP with correct extension and mime type', async () => {
    const mockBlob = new Blob(['webp-data'], { type: 'image/webp' });
    Object.defineProperty(mockBlob, 'size', { value: 90000 });

    vi.spyOn(canvasProcessor, 'createSourceDrawable').mockResolvedValue({
      source: {} as ImageBitmap,
      cleanup: vi.fn(),
    });

    vi.spyOn(canvasProcessor, 'renderToBlob').mockResolvedValue(mockBlob);

    const result = await convertImage(mockPngImage, {
      format: 'image/webp',
      quality: 0.85,
      flattenBackground: '#FFFFFF',
    });

    expect(result.type).toBe('image/webp');
    expect(result.name).toBe('icon-converted.webp');
    expect(result.operation).toBe('convert');
    expect(result.savedBytes).toBe(110000);
  });
});
