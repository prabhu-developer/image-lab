import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border bg-surface/60 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-muted">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span>Private, client-side processing. Your files never leave this device.</span>
        </div>

        <div className="flex items-center gap-1.5 font-normal">
          <span>Created by</span>
          <a
            href="https://prabhu-coder.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-primary inline-flex items-center gap-1 underline underline-offset-4 decoration-border hover:decoration-primary transition-colors"
          >
            Prabhu
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>
    </footer>
  );
};
