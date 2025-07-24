/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/buildings/BuildingForm.tsx
import React, { useState, useEffect } from 'react';
import '../../styles/building/BuildingForm.css';
import IconSection from '../image/IconSection';
import Button from '../common/Button';
import { BuildingTypes } from '../../types/enums';
import type { BuildingType } from '../../types/enums';

/** What the parent onSubmit will receive */
export interface BuildingFormData {
  type: BuildingType;
  sortOrder: number;
  powerUsage: number;
  /** ID of an existing image to keep (or `null` to unlink) */
  selectedImageId?: string | null;
  /** New file to upload */
  file?: File | null;
  /** Whether to remove the existing image */
  removed: boolean;
}

interface BuildingFormProps {
  /** If provided, this is an edit; initial.imageId is the ID of the existing icon */
  initial?: {
    type: BuildingType;
    sortOrder: number;
    powerUsage: number;
    imageId?: string;
  };
  onSubmit: (data: BuildingFormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
}

const BuildingForm: React.FC<BuildingFormProps> = ({
  initial,
  onSubmit,
  onCancel,
  onDelete,
}) => {
  const [type, setType] = useState<BuildingType>(
    initial?.type ?? BuildingTypes[0]
  );
  const [sortOrder, setSortOrder] = useState<string>(
    initial?.sortOrder != null ? String(initial.sortOrder) : ''
  );
  const [powerUsage, setPowerUsage] = useState<string>(
    initial?.powerUsage != null ? String(initial.powerUsage) : ''
  );

  // New image state
  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    initial?.imageId ?? null
  );
  const [file, setFile] = useState<File | null>(null);
  const [removed, setRemoved] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imageHasError, setImageHasError] = useState<boolean>(false);

  // Reset when initial changes
  useEffect(() => {
    setRemoved(false);
    setSelectedImageId(initial?.imageId ?? null);
    setFile(null);
  }, [initial]);

  const handleSave = async () => {
    setErrorMsg(null);
    const so = Number(sortOrder);
    const pu = Number(powerUsage);

    if (!BuildingTypes.includes(type)) {
      setErrorMsg('Please select a valid building type.');
      return;
    }
    if (sortOrder.trim() === '' || isNaN(so) || so < 0) {
      setErrorMsg('Sort order must be a non-negative number.');
      return;
    }
    if (powerUsage.trim() === '' || isNaN(pu) || pu < 0) {
      setErrorMsg('Power usage must be a non-negative number.');
      return;
    }
    if (imageHasError) {
      setErrorMsg('Please fix image errors before saving.');
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit({
        type,
        sortOrder: so,
        powerUsage: pu,
        selectedImageId: removed ? null : selectedImageId,
        file: file ?? null,
        removed,
      });
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message;
      setErrorMsg(serverMsg || 'Failed to save building.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="building-form">
      {errorMsg && <div className="building-form__error">{errorMsg}</div>}

      <div className="building-form__group">
        <label className="building-form__label">Building Type</label>
        <select
          className="building-form__input"
          value={type}
          onChange={(e) => setType(e.target.value as BuildingType)}
        >
          {BuildingTypes.map((bt) => (
            <option key={bt} value={bt}>
              {bt
                .toLowerCase()
                .split('_')
                .map((w) => w[0].toUpperCase() + w.slice(1))
                .join(' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="building-form__group">
        <label className="building-form__label">Sort Order</label>
        <input
          type="number"
          min="0"
          className="building-form__input"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
      </div>

      <div className="building-form__group">
        <label className="building-form__label">Power Usage</label>
        <input
          type="number"
          min="0"
          className="building-form__input"
          value={powerUsage}
          onChange={(e) => setPowerUsage(e.target.value)}
        />
      </div>

      <div className="building-form__group">
        <IconSection
          initialImageId={initial?.imageId}
          file={file}
          selectedImageId={selectedImageId}
          removed={removed}
          onFileChange={(f) => {
            setFile(f);
            setRemoved(false);
          }}
          onSelectExisting={(id) => {
            setSelectedImageId(id);
            setRemoved(false);
          }}
          onRemoveOriginal={() => {
            setRemoved(true);
            setFile(null);
            setSelectedImageId(null);
          }}
          onDiscardUpload={() => setFile(null)}
          onDiscardExisting={() => setSelectedImageId(null)}
          onCrop={(f) => {
            setFile(f);
            setRemoved(false);
          }}
          onValidationChange={setImageHasError}
        />
      </div>

      <div className="building-form__actions">
        {onDelete && (
          <Button
            variant="secondary"
            className="building-form__button--delete"
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
        <div className="flex space-x-2">
          <Button
            variant="primary"
            className="building-form__button--cancel"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="building-form__button--save"
            onClick={handleSave}
          >
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuildingForm;
