// src/components/image/UploadPanel.tsx
import React, { useRef } from 'react';
import Button from '../common/Button';
import PreviewWithAction from './PreviewWithAction';

interface UploadPanelProps {
  /** Original image ID from parent */
  initialImageId?: string;
  /** Whether the original has been marked removed */
  removed: boolean;
  /** Currently chosen File (upload) */
  file: File | null;
  /** Callback when user picks or clears a file */
  onFileChange: (file: File | null) => void;
  /** Callback to remove the original image */
  onRemoveOriginal: () => void;
  /** Callback to discard the upload */
  onDiscard: () => void;
  /** Callback when user crops the image */
  onCrop: (file: File) => void;
}

const UploadPanel: React.FC<UploadPanelProps> = ({
  initialImageId,
  removed,
  file,
  onFileChange,
  onRemoveOriginal,
  onDiscard,
  onCrop,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileButton = () => {
    inputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(e.target.files?.[0] ?? null);
  };

  return (
    <div className="upload-panel space-y-4">
      <Button onClick={handleFileButton}>
        {file ? 'Change File' : 'Choose File'}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <PreviewWithAction
        file={file}
        selectedImageId={null}
        initialImageId={initialImageId}
        removed={removed}
        onRemove={onRemoveOriginal}
        onDiscard={onDiscard}
        onCrop={onCrop}
      />
    </div>
  );
};

export default UploadPanel;
