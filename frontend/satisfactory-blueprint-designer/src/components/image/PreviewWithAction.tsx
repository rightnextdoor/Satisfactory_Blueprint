// src/components/image/PreviewWithAction.tsx
import React, { useState, useEffect, useRef } from 'react';
import Button from '../common/Button';
import ImageCropper from './ImageCropper';
import { imageService } from '../../services/imageService';

interface PreviewWithActionProps {
  /** Newly uploaded or cropped file */
  file: File | null;
  /** ID chosen from existing images */
  selectedImageId: string | null;
  /** Original image ID from props */
  initialImageId?: string;
  /** Flag that the original has been removed */
  removed: boolean;
  onRemove: () => void;
  /** Discards *only* the file or selectedImageId */
  onDiscard: () => void;
  onCrop: (file: File) => void;
}

const PreviewWithAction: React.FC<PreviewWithActionProps> = ({
  file,
  selectedImageId,
  initialImageId,
  removed,
  onRemove,
  onDiscard,
  onCrop,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const objectUrlRef = useRef<string | undefined>(undefined);
  const [cropping, setCropping] = useState(false);

  // 1) Build preview URL in correct priority
  useEffect(() => {
    let active = true;
    (async () => {
      // revoke any old blob URL
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = undefined;
      }

      let url: string | undefined;
      if (file) {
        objectUrlRef.current = URL.createObjectURL(file);
        url = objectUrlRef.current;
      } else if (selectedImageId) {
        const img = await imageService.get(selectedImageId);
        if (!active) return;
        url = `data:${img.contentType};base64,${img.data}`;
      } else if (initialImageId && !removed) {
        const img = await imageService.get(initialImageId);
        if (!active) return;
        url = `data:${img.contentType};base64,${img.data}`;
      }
      if (active) setPreviewUrl(url);
    })();

    return () => {
      active = false;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, [file, selectedImageId, initialImageId, removed]);

  // 2) Determine which button (if any) to show
  const hasUpload = Boolean(file);
  const hasExisting = Boolean(selectedImageId);
  const madeChange = hasUpload || hasExisting;
  const showOriginal = !madeChange && Boolean(initialImageId && !removed);

  let actionLabel: string | null = null;
  if (madeChange) actionLabel = 'Discard Change';
  else if (showOriginal) actionLabel = 'Remove Image';

  const handleAction = () => {
    if (madeChange) {
      onDiscard();
    } else if (showOriginal) {
      onRemove();
    }
  };

  return (
    <>
      <div className="flex items-center space-x-4 mt-4">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Icon preview"
            className="h-40 w-40 object-contain border"
          />
        ) : (
          <div className="h-40 w-40 bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
            No image
          </div>
        )}

        {actionLabel && (
          <Button variant="secondary" onClick={handleAction}>
            {actionLabel}
          </Button>
        )}

        {previewUrl && <Button onClick={() => setCropping(true)}>Crop</Button>}
      </div>

      {cropping && previewUrl && (
        <ImageCropper
          src={previewUrl}
          onCropComplete={(file) => {
            onCrop(file);
            setCropping(false);
          }}
          onCancel={() => setCropping(false)}
        />
      )}
    </>
  );
};

export default PreviewWithAction;
