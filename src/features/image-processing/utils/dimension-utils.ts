import { MAX_DIMENSION_PX, MIN_DIMENSION_PX } from '../constants';

export function calculateAspectRatio(width: number, height: number): number {
  if (height <= 0) return 1;
  return width / height;
}

export function calculateLockedHeight(width: number, aspectRatio: number): number {
  if (aspectRatio <= 0) return width;
  return Math.max(MIN_DIMENSION_PX, Math.round(width / aspectRatio));
}

export function calculateLockedWidth(height: number, aspectRatio: number): number {
  if (aspectRatio <= 0) return height;
  return Math.max(MIN_DIMENSION_PX, Math.round(height * aspectRatio));
}

export function clampDimension(
  value: number,
  min = MIN_DIMENSION_PX,
  max = MAX_DIMENSION_PX
): number {
  if (isNaN(value)) return min;
  return Math.min(Math.max(Math.round(value), min), max);
}

export function calculateScaleDimensions(
  originalWidth: number,
  originalHeight: number,
  percentage: number
): { width: number; height: number } {
  const scale = percentage / 100;
  return {
    width: clampDimension(originalWidth * scale),
    height: clampDimension(originalHeight * scale),
  };
}

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function formatAspectRatioString(width: number, height: number): string {
  if (width <= 0 || height <= 0) return '1:1';
  const divisor = gcd(Math.round(width), Math.round(height));
  const wRatio = Math.round(width / divisor);
  const hRatio = Math.round(height / divisor);
  
  // If ratio numbers are too big, fallback to decimal ratio like 16:9 or 4:3 approximation
  if (wRatio > 50 || hRatio > 50) {
    const dec = (width / height).toFixed(2);
    return `${dec}:1`;
  }
  return `${wRatio}:${hRatio}`;
}
