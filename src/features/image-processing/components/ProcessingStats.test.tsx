import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProcessingStats } from './ProcessingStats';
import { ProcessingResult, WorkspaceImage } from '../types';

describe('ProcessingStats Component', () => {
  const mockOriginal: WorkspaceImage = {
    id: 'orig_1',
    file: new File(['mock'], 'photo.jpg', { type: 'image/jpeg' }),
    name: 'photo.jpg',
    size: 1000000,
    type: 'image/jpeg',
    width: 2000,
    height: 1500,
    aspectRatio: 2000 / 1500,
    previewUrl: 'blob:mock-orig',
    hasTransparency: false,
    createdAt: Date.now(),
  };

  const mockResult: ProcessingResult = {
    id: 'res_1',
    sourceImageId: 'orig_1',
    blob: new Blob(['result']),
    url: 'blob:mock-res',
    name: 'photo-compressed.webp',
    width: 2000,
    height: 1500,
    size: 450000,
    type: 'image/webp',
    durationMs: 42,
    savedBytes: 550000,
    savedPercentage: 55,
    operation: 'compress',
    processedAt: Date.now(),
  };

  it('renders processing duration, savings metrics, and download trigger', () => {
    const handleDownload = vi.fn();
    const handleReset = vi.fn();

    render(
      <ProcessingStats
        originalImage={mockOriginal}
        result={mockResult}
        onDownload={handleDownload}
        onReset={handleReset}
      />
    );

    expect(screen.getByText('Processing Complete')).toBeInTheDocument();
    expect(screen.getByText(/Finished in 42 ms/i)).toBeInTheDocument();
    expect(screen.getByText(/-55\.0%/i)).toBeInTheDocument();

    const downloadButton = screen.getByRole('button', { name: /Download photo-compressed\.webp/i });
    expect(downloadButton).toBeInTheDocument();

    fireEvent.click(downloadButton);
    expect(handleDownload).toHaveBeenCalledTimes(1);
  });
});
