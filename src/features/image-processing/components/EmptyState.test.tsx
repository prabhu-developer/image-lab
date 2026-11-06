import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState Component', () => {
  it('renders upload instructions, supported formats and privacy note', () => {
    const handleFilesSelected = vi.fn();
    render(
      <EmptyState
        onFilesSelected={handleFilesSelected}
        isUploading={false}
      />
    );

    expect(screen.getByText('Drop your images here')).toBeInTheDocument();
    expect(screen.getByText('Browse Files')).toBeInTheDocument();
    expect(screen.getByText('JPEG')).toBeInTheDocument();
    expect(screen.getByText('PNG')).toBeInTheDocument();
    expect(screen.getByText('WebP')).toBeInTheDocument();
    expect(screen.getByText(/20 MB/i)).toBeInTheDocument();
    expect(screen.getByText('Guaranteed Local Processing')).toBeInTheDocument();
  });

  it('renders error notice when errors are passed', () => {
    render(
      <EmptyState
        onFilesSelected={vi.fn()}
        isUploading={false}
        errors={['File is too large (25.0 MB). Maximum allowed size is 20 MB.']}
      />
    );

    expect(screen.getByText(/File is too large/i)).toBeInTheDocument();
  });
});
