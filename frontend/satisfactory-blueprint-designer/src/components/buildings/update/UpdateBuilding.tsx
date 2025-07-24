// src/components/buildings/update/UpdateBuilding.tsx
import React, { useState, useEffect } from 'react';
import BuildingForm, { type BuildingFormData } from '../BuildingForm';
import type { BuildingDto } from '../../../types/building';
import type { ImageDto } from '../../../types/image';
import { buildingService } from '../../../services/buildingService';
import { imageService } from '../../../services/imageService';
import type { OwnerType, BuildingType } from '../../../types/enums';
import type { ImageUploadRequest } from '../../../types/imageUploadRequest';

interface InitialData {
  type: BuildingType;
  sortOrder: number;
  powerUsage: number;
  /** The full DTO so we can re‐use on no‐change */
  image?: ImageDto;
}

interface UpdateBuildingProps {
  buildingId: number | null;
  onDone: () => void;
}

const UpdateBuilding: React.FC<UpdateBuildingProps> = ({
  buildingId,
  onDone,
}) => {
  const [initial, setInitial] = useState<InitialData | null>(null);

  // helper to convert File -> base64 payload
  const toBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => res((reader.result as string).split(',')[1]);
      reader.onerror = rej;
    });

  // load existing building + its full ImageDto
  useEffect(() => {
    setInitial(null);
    if (buildingId == null) return;

    let cancel = false;
    (async () => {
      try {
        const b = await buildingService.getById(buildingId);
        if (cancel) return;
        setInitial({
          type: b.type,
          sortOrder: b.sortOrder,
          powerUsage: b.powerUsage,
          image: b.image, // full ImageDto or undefined
        });
      } catch {
        if (!cancel) onDone();
      }
    })();
    return () => {
      cancel = true;
    };
  }, [buildingId, onDone]);

  if (buildingId == null) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Update Building</h1>
        <p>Please select a building in the View tab.</p>
      </div>
    );
  }

  if (!initial) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Update Building</h1>
        <p>Loading…</p>
      </div>
    );
  }

  const handleSubmit = async (data: BuildingFormData) => {
    let finalImage: ImageDto | undefined = initial.image;

    // 1) user removed
    if (data.removed && initial.image) {
      await imageService.remove(
        initial.image.id,
        'BUILDING' as OwnerType,
        buildingId
      );
      finalImage = undefined;
    }

    // 2) user uploaded new file
    if (data.file) {
      const base64 = await toBase64(data.file);
      const req: ImageUploadRequest = {
        ownerType: 'BUILDING',
        ownerId: buildingId,
        contentType: data.file.type,
        data: base64,
        oldImageId: initial.image?.id,
      };
      finalImage = await imageService.upload(req);
    }
    // 3) user kept or picked an existing id → run assign
    else if (!data.removed && data.selectedImageId) {
      if (initial.image?.id === data.selectedImageId) {
        // no change: keep the same DTO
        finalImage = initial.image;
      } else {
        const req: ImageUploadRequest = {
          id: data.selectedImageId,
          data: undefined,
          contentType: undefined,
          oldImageId: initial.image?.id,
          ownerType: 'BUILDING' as OwnerType,
          ownerId: buildingId,
        };
        finalImage = await imageService.upload(req);
      }
    }

    // build and send payload
    const payload: BuildingDto = {
      id: buildingId,
      type: data.type,
      sortOrder: data.sortOrder,
      powerUsage: data.powerUsage,
      ...(finalImage ? { image: finalImage } : {}),
    };

    await buildingService.update(payload);
    onDone();
  };

  const handleCancel = () => onDone();

  const handleDelete = async () => {
    if (initial.image) {
      await imageService.remove(
        initial.image.id,
        'BUILDING' as OwnerType,
        buildingId
      );
    }
    await buildingService.delete(buildingId);
    onDone();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Update Building</h1>
      <BuildingForm
        initial={{
          type: initial.type,
          sortOrder: initial.sortOrder,
          powerUsage: initial.powerUsage,
          imageId: initial.image?.id,
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UpdateBuilding;
