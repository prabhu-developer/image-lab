import { useState, useCallback, useEffect, useRef } from 'react';
import { WorkspaceImage } from '../types';
import { loadWorkspaceImage } from '../services/image-loader';

export interface UseWorkspaceImagesReturn {
  images: WorkspaceImage[];
  activeImage: WorkspaceImage | null;
  activeImageId: string | null;
  isUploading: boolean;
  uploadErrors: string[];
  addFiles: (files: FileList | File[]) => Promise<void>;
  selectImage: (id: string) => void;
  removeImage: (id: string) => void;
  clearWorkspace: () => void;
  clearErrors: () => void;
}

export function useWorkspaceImages(): UseWorkspaceImagesReturn {
  const [images, setImages] = useState<WorkspaceImage[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  // Ref to track object URLs for cleanup on unmount
  const imagesRef = useRef<WorkspaceImage[]>(images);
  imagesRef.current = images;

  useEffect(() => {
    return () => {
      // Cleanup all object URLs when hook unmounts
      imagesRef.current.forEach((img) => {
        try {
          URL.revokeObjectURL(img.previewUrl);
        } catch {
          // Ignore
        }
      });
    };
  }, []);

  const addFiles = useCallback(async (incomingFiles: FileList | File[]) => {
    const fileArray = Array.from(incomingFiles);
    if (fileArray.length === 0) return;

    setIsUploading(true);
    const errors: string[] = [];
    const loadedImages: WorkspaceImage[] = [];

    for (const file of fileArray) {
      try {
        const loaded = await loadWorkspaceImage(file);
        loadedImages.push(loaded);
      } catch (err) {
        errors.push(`${file.name}: ${err instanceof Error ? err.message : 'Failed to load'}`);
      }
    }

    if (errors.length > 0) {
      setUploadErrors((prev) => [...prev, ...errors]);
    }

    if (loadedImages.length > 0) {
      setImages((prev) => {
        const next = [...prev, ...loadedImages];
        return next;
      });

      // Automatically select the first newly added image if none is currently selected
      setActiveImageId((current) => current || loadedImages[0].id);
    }

    setIsUploading(false);
  }, []);

  const selectImage = useCallback((id: string) => {
    setActiveImageId(id);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) {
        try {
          URL.revokeObjectURL(target.previewUrl);
        } catch {
          // Ignore
        }
      }

      const next = prev.filter((img) => img.id !== id);

      // Adjust active image selection
      setActiveImageId((currentActive) => {
        if (currentActive === id) {
          return next.length > 0 ? next[0].id : null;
        }
        return currentActive;
      });

      return next;
    });
  }, []);

  const clearWorkspace = useCallback(() => {
    images.forEach((img) => {
      try {
        URL.revokeObjectURL(img.previewUrl);
      } catch {
        // Ignore
      }
    });
    setImages([]);
    setActiveImageId(null);
    setUploadErrors([]);
  }, [images]);

  const clearErrors = useCallback(() => {
    setUploadErrors([]);
  }, []);

  const activeImage = images.find((img) => img.id === activeImageId) || null;

  return {
    images,
    activeImage,
    activeImageId,
    isUploading,
    uploadErrors,
    addFiles,
    selectImage,
    removeImage,
    clearWorkspace,
    clearErrors,
  };
}
