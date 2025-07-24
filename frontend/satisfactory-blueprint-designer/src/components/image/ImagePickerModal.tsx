// src/components/image/ImagePickerModal.tsx
import React, { useState, useEffect } from 'react';
import { imageService } from '../../services/imageService';
import type { ImageDto } from '../../types/image';
import Button from '../common/Button';

interface ImagePickerModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** UUID of the image currently selected (if any) */
  initialSelectedId?: string;
  /** Called with the chosen image ID (or null) when user clicks Save */
  onSave: (imageId: string | null) => void;
  /** Called when user clicks Cancel or closes the modal */
  onCancel: () => void;
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  initialSelectedId,
  onSave,
  onCancel,
}) => {
  const [images, setImages] = useState<ImageDto[]>([]);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId ?? null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load list of images when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    imageService
      .list()
      .then((list) => {
        setImages(list);
        setSelectedId(initialSelectedId ?? null);
        return Promise.all(
          list.map((img) =>
            imageService.get(img.id).then((full) => ({
              id: img.id,
              url: `data:${full.contentType};base64,${full.data}`,
            }))
          )
        );
      })
      .then((thumbs) => {
        const map: Record<string, string> = {};
        thumbs.forEach((t) => (map[t.id] = t.url));
        setThumbnails(map);
      })
      .catch(() => {
        setError('Failed to load images');
      })
      .finally(() => setLoading(false));
  }, [isOpen, initialSelectedId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded shadow-lg w-11/12 max-w-2xl max-h-[90vh] flex flex-col p-6">
        <h2 className="text-xl font-semibold mb-4 flex-shrink-0">
          Select Existing Image
        </h2>

        {/* Scrollable list area */}
        <div className="flex-grow overflow-y-auto mb-4">
          {loading && <p>Loading images…</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <div className="grid grid-cols-3 gap-4">
              {images.length > 0 ? (
                images.map((img) => (
                  <label
                    key={img.id}
                    className={`
                    border rounded p-2 cursor-pointer flex flex-col items-center
                    ${
                      selectedId === img.id
                        ? 'border-blue-500'
                        : 'border-gray-200'
                    }
                  `}
                  >
                    <input
                      type="radio"
                      name="pickedImage"
                      value={img.id}
                      checked={selectedId === img.id}
                      onChange={() => setSelectedId(img.id)}
                      className="mb-2"
                    />
                    {thumbnails[img.id] ? (
                      <img
                        src={thumbnails[img.id]}
                        alt={`Image ${img.id}`}
                        className="w-24 h-24 object-contain"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 flex items-center justify-center">
                        <span className="text-sm text-gray-500">Preview…</span>
                      </div>
                    )}
                  </label>
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-500">
                  No images available
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action buttons always visible */}
        <div className="flex-shrink-0 flex justify-end space-x-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onSave(selectedId)}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImagePickerModal;
