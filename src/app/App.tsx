import React from 'react';
import { ThemeProvider } from './providers/theme-provider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImageWorkspace } from '@/features/image-processing/components/ImageWorkspace';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
        <Header />
        <div className="flex-1 flex flex-col">
          <ImageWorkspace />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;
