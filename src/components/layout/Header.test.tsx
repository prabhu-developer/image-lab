import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { ThemeProvider } from '@/app/providers/theme-provider';

describe('Header Component', () => {
  it('renders ImageLab wordmark and tagline', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );

    expect(screen.getByText('ImageLab')).toBeInTheDocument();
    expect(
      screen.getByText('Your images. Your control. Perfectly optimized.')
    ).toBeInTheDocument();
  });

  it('opens privacy overview modal when privacy badge is clicked', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );

    const privacyBtn = screen.getByRole('button', { name: /100% Local & Private/i });
    expect(privacyBtn).toBeInTheDocument();

    fireEvent.click(privacyBtn);

    expect(screen.getByText('Privacy & Architecture Overview')).toBeInTheDocument();
    expect(screen.getByText('Zero Cloud Storage or Uploads')).toBeInTheDocument();
  });
});
