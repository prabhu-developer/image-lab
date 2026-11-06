import { describe, it, expect } from 'vitest';
import {
  calculateAspectRatio,
  calculateLockedHeight,
  calculateLockedWidth,
  clampDimension,
  calculateScaleDimensions,
  formatAspectRatioString,
} from './dimension-utils';

describe('dimension-utils', () => {
  describe('calculateAspectRatio', () => {
    it('calculates aspect ratio for standard dimensions', () => {
      expect(calculateAspectRatio(1920, 1080)).toBeCloseTo(1.7777, 3);
      expect(calculateAspectRatio(1000, 1000)).toBe(1);
      expect(calculateAspectRatio(800, 600)).toBeCloseTo(1.3333, 3);
    });

    it('handles zero or negative heights safely', () => {
      expect(calculateAspectRatio(100, 0)).toBe(1);
      expect(calculateAspectRatio(100, -10)).toBe(1);
    });
  });

  describe('calculateLockedHeight and calculateLockedWidth', () => {
    it('calculates locked height preserving aspect ratio', () => {
      const ratio = 1920 / 1080;
      expect(calculateLockedHeight(960, ratio)).toBe(540);
      expect(calculateLockedHeight(1280, ratio)).toBe(720);
    });

    it('calculates locked width preserving aspect ratio', () => {
      const ratio = 1920 / 1080;
      expect(calculateLockedWidth(540, ratio)).toBe(960);
      expect(calculateLockedWidth(720, ratio)).toBe(1280);
    });

    it('never returns below minimum dimension of 1px', () => {
      expect(calculateLockedHeight(0, 1.5)).toBe(1);
      expect(calculateLockedWidth(0, 1.5)).toBe(1);
    });
  });

  describe('clampDimension', () => {
    it('clamps values within bounds', () => {
      expect(clampDimension(500)).toBe(500);
      expect(clampDimension(-50)).toBe(1);
      expect(clampDimension(15000)).toBe(10000);
      expect(clampDimension(NaN)).toBe(1);
    });
  });

  describe('calculateScaleDimensions', () => {
    it('scales dimensions by percentage accurately', () => {
      const result = calculateScaleDimensions(1920, 1080, 50);
      expect(result.width).toBe(960);
      expect(result.height).toBe(540);
    });

    it('scales 200% correctly', () => {
      const result = calculateScaleDimensions(500, 400, 200);
      expect(result.width).toBe(1000);
      expect(result.height).toBe(800);
    });
  });

  describe('formatAspectRatioString', () => {
    it('formats 16:9, 4:3, 1:1 properly', () => {
      expect(formatAspectRatioString(1920, 1080)).toBe('16:9');
      expect(formatAspectRatioString(1000, 1000)).toBe('1:1');
      expect(formatAspectRatioString(800, 600)).toBe('4:3');
    });
  });
});
