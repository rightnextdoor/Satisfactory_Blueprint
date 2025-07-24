// src/components/image/IconSection.tsx
import React, { useState } from 'react';
import ModeSelector from './ModeSelector';
import UploadPanel from './UploadPanel';
import ExistingPanel from './ExistingPanel';
import '../../styles/image/IconSection.css';

export interface IconSectionProps {
  initialImageId?: string;
  file: File | null;
  selectedImageId: string | null;
  /** Parent‐controlled “original removed” for submission */
  removed: boolean;
  onFileChange: (file: File | null) => void;
  onSelectExisting: (imageId: string | null) => void;
  /** Notify parent to mark original removed */
  onRemoveOriginal: () => void;
  onDiscardUpload: () => void;
  onDiscardExisting: () => void;
  onCrop: (file: File) => void;
  onValidationChange?: (hasError: boolean) => void;
}

const IconSection: React.FC<IconSectionProps> = ({
  initialImageId,
  file,
  selectedImageId,
  removed,
  onFileChange,
  onSelectExisting,
  onRemoveOriginal,
  onDiscardUpload,
  onDiscardExisting,
  onCrop,
}) => {
  const [mode, setMode] = useState<'upload' | 'existing'>('upload');

  // Panel‐only flag: once user removes original, keep it hidden
  const [panelRemoved, setPanelRemoved] = useState(false);

  // Combined removal for display logic
  const displayRemoved = removed || panelRemoved;

  const handlePanelRemoveOriginal = () => {
    setPanelRemoved(true);
    onRemoveOriginal();
  };

  return (
    <div className="icon-section space-y-4">
      <label className="block font-medium">Icon</label>
      <ModeSelector mode={mode} onChange={setMode} />

      {mode === 'upload' && (
        <UploadPanel
          initialImageId={initialImageId}
          removed={displayRemoved}
          file={file}
          onFileChange={onFileChange}
          onRemoveOriginal={handlePanelRemoveOriginal}
          onDiscard={onDiscardUpload}
          onCrop={onCrop}
        />
      )}

      {mode === 'existing' && (
        <ExistingPanel
          initialImageId={initialImageId}
          removed={displayRemoved}
          selectedImageId={selectedImageId}
          onPick={onSelectExisting}
          onRemoveOriginal={handlePanelRemoveOriginal}
          onDiscard={onDiscardExisting}
          onCrop={onCrop}
        />
      )}
    </div>
  );
};

export default IconSection;
