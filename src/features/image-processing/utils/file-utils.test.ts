import { describe, it, expect } from 'vitest';
import { isSupportedMime, validateFileMetadata } from './file-utils';

describe('file-utils', () => {
  describe('isSupportedMime', () => {
    it('accepts JPEG, PNG, WebP', () => {
      expect(isSupportedMime('image/jpeg')).toBe(true);
      expect(isSupportedMime('image/png')).toBe(true);
      expect(isSupportedMime('image/webp')).toBe(true);
    });

    it('rejects unsupported types like SVG, GIF, PDF', () => {
      expect(isSupportedMime('image/gif')).toBe(false);
      expect(isSupportedMime('image/svg+xml')).toBe(false);
      expect(isSupportedMime('application/pdf')).toBe(false);
      expect(isSupportedMime('image/bmp')).toBe(false);
    });
  });

  describe('validateFileMetadata', () => {
    it('approves a valid JPEG file under 20MB', () => {
      const file = new File(['mock content'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFileMetadata(file);
      expect(result.valid).toBe(true);
    });

    it('rejects files larger than 20MB', () => {
      // Mock oversized file
      const largeFile = new File([''], 'huge.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 25 * 1024 * 1024 });

      const result = validateFileMetadata(largeFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too large');
    });

    it('rejects unsupported mime types with helpful error', () => {
      const gifFile = new File([''], 'animation.gif', { type: 'image/gif' });
      const result = validateFileMetadata(gifFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported file format');
    });
  });
});
