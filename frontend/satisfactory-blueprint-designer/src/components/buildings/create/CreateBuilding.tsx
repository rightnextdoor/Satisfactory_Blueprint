/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/buildings/create/CreateBuilding.tsx
import React from 'react';
import BuildingForm, { type BuildingFormData } from '../BuildingForm';
import type { BuildingDto } from '../../../types';
import { buildingService } from '../../../services/buildingService';
import { syncImageField } from '../../../services/imageField';

interface CreateBuildingProps {
  /** Called when form is done (either cancel or successful save) */
  onDone: () => void;
}

const CreateBuilding: React.FC<CreateBuildingProps> = ({ onDone }) => {
  const handleSubmit = async (data: BuildingFormData) => {
    try {
      // 1) upload/resolve the icon and get back the final key
      const finalKey = await syncImageField(
        /* initialKey = */ '',
        data.iconKey ?? '',
        data.file
      );

      // 2) build payload
      const payload = {
        type: data.type,
        sortOrder: data.sortOrder,
        powerUsage: data.powerUsage,
        iconKey: finalKey || undefined,
      } as unknown as BuildingDto;

      // 3) create building
      await buildingService.create(payload);

      // 4) back to view + refresh
      onDone();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        'Failed to create building';
      // bubble up to form
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
