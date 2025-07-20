// src/components/image/ImageCropper.tsx
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropUtils';
import Button from '../common/Button';
import '../../styles/item/ItemForm.css';

interface ImageCropperProps {
  src: string;
  aspect?: number;
  onCropComplete: (file: File) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  src,
  aspect = 1,
  onCropComplete,
  onCancel,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);

  const onComplete = useCallback((_: Area, pixels: Area) => {
    setAreaPixels(pixels);
  }, []);

  const handleCrop = useCallback(async () => {
    if (!areaPixels) return;
    const blob = await getCroppedImg(src, areaPixels);
    onCropComplete(new File([blob], 'cropped.png', { type: blob.type }));
  }, [areaPixels, onCropComplete, src]);

  return (
    <div className="item-form__group">
      <div className="relative w-full h-96 bg-black/10">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onComplete}
        />
      </div>
      {/* Zoom slider BELOW the crop viewport */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Zoom</label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full"
        />
      </div>
      {/* Action buttons with spacing */}
      <div className="item-form__actions">
        <Button onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button onClick={handleCrop} variant="primary">
          Crop
        </Button>
      </div>
    </div>
  );
};

export default ImageCropper;
