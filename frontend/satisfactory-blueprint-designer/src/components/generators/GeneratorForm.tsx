/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/generators/GeneratorForm.tsx
import React, { useState } from 'react';
import '../../styles/generator/GeneratorForm.css';
import IconSection from '../image/IconSection';
import Button from '../common/Button';
import GeneratorBasicFields from './GeneratorBasicFields';
import GeneratorItemDataSection from './GeneratorItemDataSection';
import type { GeneratorType, FuelType } from '../../types/enums';
import type { ItemDataDto } from '../../types/itemDataDto';

export interface GeneratorFormProps {
  // Basic generator fields
  type: GeneratorType;
  onTypeChange: (type: GeneratorType) => void;
  fuelType: FuelType;
  onFuelTypeChange: (fuelType: FuelType) => void;
  powerOutput: string;
  onPowerOutputChange: (value: string) => void;
  burnTime: string;
  onBurnTimeChange: (value: string) => void;

  // Item data fields
  hasByProduct: boolean;
  onHasByProductChange: (has: boolean) => void;
  byProduct?: ItemDataDto;
  onByProductChange: (data?: ItemDataDto) => void;
  fuelItems: ItemDataDto[];
  onFuelItemsChange: (items: ItemDataDto[]) => void;

  // Icon section props
  initialImageId?: string;
  file: File | null;
  selectedImageId: string | null;
  removedImage: boolean;
  onFileChange: (file: File | null) => void;
  onSelectExistingImage: (imageId: string | null) => void;
  onRemoveImage: () => void;
  onValidationChange?: (hasError: boolean) => void;

  // Action handlers
  onSave: () => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
  isSaving: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({
  type,
  onTypeChange,
  fuelType,
  onFuelTypeChange,
  powerOutput,
  onPowerOutputChange,
  burnTime,
  onBurnTimeChange,

  hasByProduct,
  onHasByProductChange,
  byProduct,
  onByProductChange,
  fuelItems,
  onFuelItemsChange,

  initialImageId,
  file,
  selectedImageId,
  removedImage,
  onFileChange,
  onSelectExistingImage,
  onRemoveImage,
  onValidationChange,

  onSave,
  onCancel,
  onDelete,
  isSaving,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSaveClick = async () => {
    setErrorMsg(null);
    try {
      await onSave();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        'Save failed.';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="generator-form">
      {errorMsg && <div className="generator-form__error">{errorMsg}</div>}

      {/* Basic generator fields */}
      <GeneratorBasicFields
        type={type}
        onTypeChange={onTypeChange}
        fuelType={fuelType}
        onFuelTypeChange={onFuelTypeChange}
        powerOutput={powerOutput}
        onPowerOutputChange={onPowerOutputChange}
        burnTime={burnTime}
        onBurnTimeChange={onBurnTimeChange}
      />

      {/* By-product and fuel items section */}
      <GeneratorItemDataSection
        hasByProduct={hasByProduct}
        onHasByProductChange={onHasByProductChange}
        byProduct={byProduct}
        onByProductChange={onByProductChange}
        fuelItems={fuelItems}
        onFuelItemsChange={onFuelItemsChange}
      />

      {/* Icon upload / picker */}
      <div className="generator-form__group">
        <label className="generator-form__label">Icon</label>
        <IconSection
          initialImageId={initialImageId}
          file={file}
          selectedImageId={selectedImageId}
          removed={removedImage}
          onFileChange={onFileChange}
          onSelectExisting={onSelectExistingImage}
          onRemoveOriginal={onRemoveImage}
          onDiscardUpload={() => onFileChange(null)}
          onDiscardExisting={() => onSelectExistingImage(null)}
          onCrop={(f) => onFileChange(f)}
          onValidationChange={onValidationChange}
        />
      </div>

      {/* Action buttons */}
      <div className="generator-form__actions">
        {onDelete && (
          <Button
            variant="secondary"
            className="generator-form__button--delete"
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
        <Button
          variant="primary"
          className="generator-form__button--cancel"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="generator-form__button--save"
          onClick={handleSaveClick}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default GeneratorForm;
