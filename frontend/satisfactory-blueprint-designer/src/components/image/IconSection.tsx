// src/components/image/IconSection.tsx
import React, { useState, useEffect, useRef } from 'react';
import { imageService } from '../../services/imageService';
import ImageCropper from './ImageCropper';
import Button from '../common/Button';
import '../../styles/image/IconSection.css';

type KeyStatus = 'unknown' | 'checking' | 'available' | 'invalid';

interface IconSectionProps {
  /** The original key loaded for this entity (if any) */
  initialIconKey?: string;
  /** The current icon key string */
  iconKey: string;
  /** A locally selected file, if any */
  file?: File;
  /** Called when the icon key changes */
  onIconKeyChange: (newKey: string) => void;
  /** Called when the file changes */
  onFileChange: (file?: File) => void;
  /** Notifies parent about validity: true if there's an error */
  onValidationChange?: (hasError: boolean) => void;
}

const IconSection: React.FC<IconSectionProps> = ({
  initialIconKey,
  iconKey,
  file,
  onIconKeyChange,
  onFileChange,
  onValidationChange,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [keyStatus, setKeyStatus] = useState<KeyStatus>('unknown');
  const [showCropper, setShowCropper] = useState(false);
  const [validationError, setValidationError] = useState<string>();
  const [removed, setRemoved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset removed flag when file or initial key returns
  useEffect(() => {
    if (file || iconKey === initialIconKey) setRemoved(false);
  }, [file, iconKey, initialIconKey]);

  // Preview logic: file > initial (if not removed) > none
  useEffect(() => {
    let url: string | undefined;
    if (file) {
      url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else if (!removed && initialIconKey) {
      imageService
        .get(initialIconKey)
        .then((blob) => {
          const objectUrl = URL.createObjectURL(blob);
          url = objectUrl;
          setPreviewUrl(objectUrl);
        })
        .catch(() => setPreviewUrl(undefined));
    } else {
      setPreviewUrl(undefined);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [file, initialIconKey, removed]);

  // Validation: require key when image exists, and image when key exists
  useEffect(() => {
    let error: string | undefined;
    if ((file || previewUrl) && !iconKey.trim() && !removed) {
      error = 'Icon key cannot be blank when an image is present.';
    } else if (file && !iconKey.trim()) {
      error = 'Icon key is required when uploading an image.';
    } else if (iconKey.trim() && !file && !previewUrl) {
      error = 'Image file is required when specifying an icon key.';
    }
    setValidationError(error);
    onValidationChange?.(!!error);
  }, [file, iconKey, previewUrl, removed, onValidationChange]);

  // Check if a new key has an existing image
  const checkKey = () => {
    if (!iconKey.trim() || iconKey === initialIconKey) {
      setKeyStatus('unknown');
      return;
    }
    setKeyStatus('checking');
    imageService
      .exists(iconKey)
      .then((exists) => {
        if (exists) {
          setKeyStatus('unknown');
        } else {
          setKeyStatus('available');
        }
      })
      .catch(() => {
        setKeyStatus('invalid');
      });
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyStatus('unknown');
    onIconKeyChange(e.target.value);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    onFileChange(f);
    setKeyStatus('unknown');
    // if (f) setShowCropper(true); //uncommit if want to have cropper show up when file is uploaded
  };

  // Remove/discard: file takes priority, otherwise remove original
  const removeImage = () => {
    if (file) {
      onFileChange(undefined);
    } else {
      setRemoved(true);
      onIconKeyChange('');
    }
    setKeyStatus('unknown');
  };

  const handleCropComplete = (croppedFile: File) => {
    onFileChange(croppedFile);
    setShowCropper(false);
  };

  const keyOutlineClass = {
    unknown: 'border-gray-300',
    checking: 'border-yellow-500',
    available: 'border-green-500',
    invalid: 'border-red-500',
  }[keyStatus];

  return (
    <div className="space-y-4">
      {/* Icon Key */}
      <div>
        <label className="block font-medium">Icon Key</label>
        <input
          type="text"
          value={iconKey}
          onChange={handleKeyChange}
          onBlur={checkKey}
          className={`mt-1 block w-full px-2 py-1 border rounded ${keyOutlineClass}`}
        />
        {keyStatus === 'checking' && (
          <p className="text-sm text-gray-500">Checking key…</p>
        )}
        {keyStatus === 'available' && (
          <p className="text-sm text-green-600">✓ Key is available</p>
        )}
        {validationError && previewUrl && !iconKey.trim() && (
          <p className="text-sm text-red-600 mt-1">{validationError}</p>
        )}
      </div>

      {/* File Picker */}
      <div>
        <label className="block font-medium">Upload Image</label>
        <div className="flex items-center space-x-4 mt-1">
          <Button onClick={() => fileInputRef.current?.click()}>
            {file ? 'Change File' : 'Choose File'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {validationError && iconKey.trim() && !file && !previewUrl && (
          <p className="text-sm text-red-600 mt-1">{validationError}</p>
        )}
      </div>

      {/* Preview & Actions */}
      {previewUrl && !showCropper && (
        <div className="flex items-center space-x-4">
          <img src={previewUrl} alt="Preview" className="icon-preview" />
          <div className="flex space-x-2">
            <Button onClick={() => setShowCropper(true)}>Crop Image</Button>
            <Button variant="secondary" onClick={removeImage}>
              {file ? 'Discard New Image' : 'Remove Image'}
            </Button>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {showCropper && previewUrl && (
        <ImageCropper
          src={previewUrl}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
        />
      )}
    </div>
  );
};

export default IconSection;
