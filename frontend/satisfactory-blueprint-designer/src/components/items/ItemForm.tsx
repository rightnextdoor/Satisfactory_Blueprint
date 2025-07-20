/* eslint-disable @typescript-eslint/no-explicit-any */
/* src/components/items/ItemForm.tsx */
import React, { useState, useEffect } from 'react';
import '../../styles/item/ItemForm.css';
import IconSection from '../image/IconSection';
import Button from '../common/Button';

export interface ItemFormData {
  name: string;
  resource: boolean;
  iconKey?: string;
  file?: File;
  deleteIcon: boolean;
}

interface ItemFormProps {
  /** Initial values for pre-filling (update); omit for create */
  initial?: {
    name: string;
    resource: boolean;
    iconKey?: string;
  };
  /** Called to submit the form data */
  onSubmit: (data: ItemFormData) => Promise<void>;
  /** Called when user cancels */
  onCancel: () => void;
  /** Optional: if provided, shows a Delete button */
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
  const [iconKey, setIconKey] = useState(initial?.iconKey || '');
  const [file, setFile] = useState<File>();
  const [deleteIcon, setDeleteIcon] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imageHasError, setImageHasError] = useState(false);

  useEffect(() => {
    // track dirty if needed
  }, [name, resource, iconKey, file, deleteIcon, initial]);

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
        iconKey: iconKey || undefined,
        file,
        deleteIcon,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="item-form">
      {errorMsg && (
        <div className="item-form__error text-red-600 mb-2">{errorMsg}</div>
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
          initialIconKey={initial?.iconKey}
          iconKey={iconKey}
          file={file}
          onIconKeyChange={(k) => {
            setIconKey(k);
            if (!k && initial?.iconKey && !file) {
              setDeleteIcon(true);
            } else {
              setDeleteIcon(false);
            }
          }}
          onFileChange={(f) => {
            setFile(f);
            setDeleteIcon(false);
          }}
          onValidationChange={setImageHasError}
        />
      </div>

      <div className="item-form__actions flex justify-between items-center mt-4">
        {onDelete && (
          <Button
            variant="secondary"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onDelete}
            disabled={isSaving}
          >
            Delete
          </Button>
        )}
        <div className="flex space-x-2">
          <Button variant="primary" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
