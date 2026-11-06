import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer Component', () => {
  it('renders the exact portfolio attribution and secure link for Prabhu', () => {
    render(<Footer />);

    // Check "Created by" text
    expect(screen.getByText(/Created by/i)).toBeInTheDocument();

    // Check link text and attributes
    const link = screen.getByRole('link', { name: /Prabhu/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://prabhu-coder.netlify.app/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the local privacy assurance', () => {
    render(<Footer />);
    expect(
      screen.getByText(/Private, client-side processing\. Your files never leave this device\./i)
    ).toBeInTheDocument();
  });
});
