// src/components/image/ExistingPanel.tsx
import React, { useState } from 'react';
import Button from '../common/Button';
import ImagePickerModal from './ImagePickerModal';
import PreviewWithAction from './PreviewWithAction';

interface ExistingPanelProps {
  /** Original image ID passed from IconSection */
  initialImageId?: string;
  /** Whether the original has been removed */
  removed: boolean;
  /** Currently selected existing image ID */
  selectedImageId: string | null;
  /** Called when user picks or clears an existing image */
  onPick: (id: string | null) => void;
  /** Called when user removes the original */
  onRemoveOriginal: () => void;
  /** Called when user discards their selection */
  onDiscard: () => void;
  /** Called when user crops the image */
  onCrop: (file: File) => void;
}

const ExistingPanel: React.FC<ExistingPanelProps> = ({
  initialImageId,
  removed,
  selectedImageId,
  onPick,
  onRemoveOriginal,
  onDiscard,
  onCrop,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="existing-panel space-y-4">
      <Button onClick={() => setPickerOpen(true)}>
        {selectedImageId ? 'Change Existing…' : 'Select Existing…'}
      </Button>

      <ImagePickerModal
        isOpen={pickerOpen}
        initialSelectedId={selectedImageId ?? undefined}
        onCancel={() => setPickerOpen(false)}
        onSave={(id) => {
          onPick(id);
          setPickerOpen(false);
        }}
      />

      <PreviewWithAction
        file={null}
        selectedImageId={selectedImageId}
        initialImageId={initialImageId}
        removed={removed}
        onRemove={onRemoveOriginal}
        onDiscard={onDiscard}
        onCrop={onCrop}
      />
    </div>
  );
};

export default ExistingPanel;
