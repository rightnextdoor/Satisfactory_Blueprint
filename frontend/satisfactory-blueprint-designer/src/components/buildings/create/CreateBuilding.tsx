/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/buildings/create/CreateBuilding.tsx
import React from 'react';
import BuildingForm, { type BuildingFormData } from '../BuildingForm';
import type { BuildingDto } from '../../../types/building';
import { buildingService } from '../../../services/buildingService';
import { imageService } from '../../../services/imageService';
import type { ImageUploadRequest } from '../../../types/imageUploadRequest';

interface CreateBuildingProps {
  /** Called when form is done (either cancel or successful save) */
  onDone: () => void;
}

const CreateBuilding: React.FC<CreateBuildingProps> = ({ onDone }) => {
  // helper: convert File -> base64 payload
  const toBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',', 2)[1];
        res(base64);
      };
      reader.onerror = rej;
    });

  const handleSubmit = async (data: BuildingFormData) => {
    try {
      // 1) create the building record (no image yet)
      const createPayload = {
        type: data.type,
        sortOrder: data.sortOrder,
        powerUsage: data.powerUsage,
      } as unknown as BuildingDto;
      const created = await buildingService.create(createPayload);

      // 2) if the user picked a new file, upload & link it
      if (data.file) {
        const base64 = await toBase64(data.file);
        const req: ImageUploadRequest = {
          ownerType: 'BUILDING',
          ownerId: created.id,
          contentType: data.file.type,
          data: base64,
        };
        await imageService.upload(req);
      }
      // 3) else if they selected an existing image, link that
      else if (data.selectedImageId) {
        const req: ImageUploadRequest = {
          id: data.selectedImageId,
          ownerType: 'BUILDING',
          ownerId: created.id,
        };
        await imageService.upload(req);
      }

      onDone();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        'Failed to create building';
      // bubble up to the form for display
      throw new Error(msg);
    }
  };

  const handleCancel = () => {
    onDone();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Create Building</h2>
      <BuildingForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default CreateBuilding;
