import React, { useState } from 'react';
import { Sun, Moon, Laptop, ShieldCheck, Layers } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';

export const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-subtle">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-base tracking-tight text-foreground">
                ImageLab
              </span>
              <span className="hidden sm:inline-block text-xs text-foreground-muted font-normal">
                Your images. Your control. Perfectly optimized.
              </span>
            </div>
          </div>

          {/* Actions: Privacy Info & Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-surface-subtle border border-border-subtle rounded-md transition-colors"
              title="Privacy guarantee and technical overview"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-success" />
              <span className="hidden xs:inline">100% Local & Private</span>
            </button>

            <div className="h-4 w-px bg-border mx-1" />

            <Button
              variant="ghost"
              size="icon"
              onClick={cycleTheme}
              aria-label={`Current theme: ${theme}. Click to change.`}
              title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
              className="h-8 w-8 text-foreground-muted hover:text-foreground"
            >
              {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
              {theme === 'dark' && <Moon className="w-4 h-4 text-indigo-400" />}
              {theme === 'system' && <Laptop className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Privacy Guarantee Modal */}
      <Modal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        title="Privacy & Architecture Overview"
        description="How ImageLab processes your images securely inside your browser."
      >
        <div className="space-y-4 text-xs leading-relaxed text-foreground-muted">
          <div className="p-3 bg-surface-subtle border border-border-subtle rounded-md text-foreground flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-xs text-foreground">Zero Cloud Storage or Uploads</p>
              <p className="text-[11px] text-foreground-muted mt-0.5">
                Every compression, resize, and format conversion runs exclusively in your device's memory via the HTML Canvas and ImageBitmap APIs. No image bytes ever leave your machine.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-foreground text-xs">Technical Safeguards</h4>
            <ul className="list-disc pl-4 space-y-1.5">
              <li>
                <strong className="text-foreground">In-Memory Pipeline:</strong> Images are processed into raw pixel canvases and converted directly to Blobs.
              </li>
              <li>
                <strong className="text-foreground">Strict Validation:</strong> Corrupt files, oversized payloads (&gt;20MB), and dimensions exceeding 10,000px are rejected safely.
              </li>
              <li>
                <strong className="text-foreground">Automatic Garbage Collection:</strong> Temporary object URLs are revoked immediately after use to prevent memory leaks.
              </li>
              <li>
                <strong className="text-foreground">No Metadata Leakage:</strong> Re-encoded canvas outputs omit private EXIF geolocations and camera serials.
              </li>
            </ul>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPrivacyOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
