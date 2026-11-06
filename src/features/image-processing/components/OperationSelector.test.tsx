import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OperationSelector } from './OperationSelector';

describe('OperationSelector Component', () => {
  it('renders all three core operations: Compress, Resize, Convert', () => {
    const onSelect = vi.fn();
    render(<OperationSelector currentOperation="compress" onSelectOperation={onSelect} />);

    expect(screen.getByRole('button', { name: /Compress/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Resize/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Convert/i })).toBeInTheDocument();
  });

  it('triggers onSelectOperation callback on click', () => {
    const onSelect = vi.fn();
    render(<OperationSelector currentOperation="compress" onSelectOperation={onSelect} />);

    const resizeButton = screen.getByRole('button', { name: /Resize/i });
    fireEvent.click(resizeButton);

    expect(onSelect).toHaveBeenCalledWith('resize');
  });
});
