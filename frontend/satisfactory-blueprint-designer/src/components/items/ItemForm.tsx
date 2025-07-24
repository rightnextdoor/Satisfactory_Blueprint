/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/items/ItemForm.tsx
import React, { useState, useEffect } from 'react';
import '../../styles/item/ItemForm.css';
import IconSection from '../image/IconSection';
import Button from '../common/Button';
import type { ImageDto } from '../../types/image';

export interface ItemFormData {
  name: string;
  resource: boolean;
  imageId?: string | null;
  file?: File | null;
  removeImage: boolean;
}

interface ItemFormProps {
  initial?: {
    id?: number;
    name: string;
    resource: boolean;
    image?: ImageDto;
  };
  onSubmit: (data: ItemFormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({
  initial,
  onSubmit,
  onCancel,
  onDelete,
}) => {
  const [name, setName] = useState(initial?.name || '');
  const [resource, setResource] = useState(initial?.resource || false);

  // image state
  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    initial?.image?.id ?? null
  );
  const [file, setFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imageHasError, setImageHasError] = useState(false);

  useEffect(() => {
    // Only clear removeImage if the user actively re-selects the original image
    if (selectedImageId === initial?.image?.id) {
      setRemoveImage(false);
    }
  }, [selectedImageId, initial]);

  const handleSave = async () => {
    setErrorMsg(null);
    if (!name.trim()) {
      setErrorMsg('Name is required.');
      return;
    }
    if (imageHasError) {
      setErrorMsg('Please fix image errors before saving.');
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        resource,
        imageId: selectedImageId,
        file,
        removeImage,
      });
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to save. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="item-form">
      {errorMsg && (
        <div className="item-form__error text-red-600 mb-4">{errorMsg}</div>
      )}

      <div className="item-form__group">
        <label className="item-form__label">Name</label>
        <input
          type="text"
          className="item-form__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="item-form__group flex items-center">
        <input
          id="resource"
          type="checkbox"
          checked={resource}
          onChange={(e) => setResource(e.target.checked)}
          className="item-form__checkbox"
        />
        <label htmlFor="resource" className="item-form__label ml-2">
          Resource
        </label>
      </div>

      <div className="item-form__group">
        <IconSection
          initialImageId={initial?.image?.id}
          file={file}
          selectedImageId={selectedImageId}
          removed={removeImage}
          onFileChange={(f) => {
            setFile(f);
            setRemoveImage(false);
          }}
          onSelectExisting={(id) => {
            setSelectedImageId(id);
            setRemoveImage(!id && !!initial?.image);
            setFile(null);
          }}
          onRemoveOriginal={() => {
            setFile(null);
            setSelectedImageId(null);
            setRemoveImage(true);
          }}
          onDiscardUpload={() => setFile(null)}
          onDiscardExisting={() => setSelectedImageId(null)}
          onCrop={(f) => {
            setFile(f);
            setRemoveImage(false);
          }}
          onValidationChange={setImageHasError}
        />
      </div>

      <div className="item-form__actions flex justify-end space-x-2 mt-6">
        {onDelete && (
          <Button
            variant="secondary"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default ItemForm;
