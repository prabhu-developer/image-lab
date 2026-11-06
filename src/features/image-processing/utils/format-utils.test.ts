import { describe, it, expect } from 'vitest';
import {
  formatBytes,
  formatPercentage,
  formatDuration,
  getMimeLabel,
  generateOutputFilename,
} from './format-utils';

describe('format-utils', () => {
  describe('formatBytes', () => {
    it('formats 0 bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 B');
    });

    it('formats bytes, kilobytes, megabytes correctly', () => {
      expect(formatBytes(500)).toBe('500 B');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1536)).toBe('1.5 KB');
      expect(formatBytes(1024 * 1024)).toBe('1 MB');
      expect(formatBytes(2.5 * 1024 * 1024)).toBe('2.5 MB');
    });

    it('handles negative bytes gracefully', () => {
      expect(formatBytes(-1024)).toBe('-1 KB');
    });
  });

  describe('formatPercentage', () => {
    it('formats positive percentages with leading plus', () => {
      expect(formatPercentage(25.43)).toBe('+25.4%');
    });

    it('formats negative percentages with minus', () => {
      expect(formatPercentage(-38.2)).toBe('-38.2%');
    });

    it('formats zero percentage', () => {
      expect(formatPercentage(0)).toBe('0%');
    });
  });

  describe('formatDuration', () => {
    it('formats milliseconds under 1000', () => {
      expect(formatDuration(45.2)).toBe('45 ms');
      expect(formatDuration(500)).toBe('500 ms');
    });

    it('formats durations over 1000ms as seconds', () => {
      expect(formatDuration(1500)).toBe('1.50 s');
      expect(formatDuration(3200)).toBe('3.20 s');
    });
  });

  describe('getMimeLabel', () => {
    it('maps MIME types to friendly labels', () => {
      expect(getMimeLabel('image/jpeg')).toBe('JPEG');
      expect(getMimeLabel('image/png')).toBe('PNG');
      expect(getMimeLabel('image/webp')).toBe('WebP');
    });

    it('handles unknown mime types safely', () => {
      expect(getMimeLabel('image/avif')).toBe('AVIF');
    });
  });

  describe('generateOutputFilename', () => {
    it('generates filename with operation suffix and target extension', () => {
      expect(generateOutputFilename('photo.png', 'compressed', 'image/webp')).toBe('photo-compressed.webp');
      expect(generateOutputFilename('banner.jpg', 'resized', 'image/jpeg')).toBe('banner-resized.jpg');
      expect(generateOutputFilename('avatar.webp', 'converted', 'image/png')).toBe('avatar-converted.png');
    });

    it('sanitizes unsafe characters in filename', () => {
      expect(generateOutputFilename('my photo (1)!.jpg', 'compressed', 'image/jpeg')).toBe('my_photo_1_-compressed.jpg');
    });

    it('handles files without extensions', () => {
      expect(generateOutputFilename('untitled', 'resized', 'image/png')).toBe('untitled-resized.png');
    });
  });
});
