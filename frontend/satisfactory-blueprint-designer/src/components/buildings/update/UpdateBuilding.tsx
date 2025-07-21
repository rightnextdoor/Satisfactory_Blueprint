// src/components/buildings/update/UpdateBuilding.tsx
import React, { useState, useEffect } from 'react';
import BuildingForm, { type BuildingFormData } from '../BuildingForm';
import type { BuildingDto } from '../../../types';
import { buildingService } from '../../../services/buildingService';
import { syncImageField } from '../../../services/imageField';
import type { BuildingType } from '../../../types/enums';

interface InitialData {
  type: BuildingType;
  sortOrder: number;
  powerUsage: number;
  iconKey?: string;
}

interface UpdateBuildingProps {
  /** ID of the building to update */
  buildingId: number | null;
  /** Called after update/delete/cancel to go back to View */
  onDone: () => void;
}

const UpdateBuilding: React.FC<UpdateBuildingProps> = ({
  buildingId,
  onDone,
}) => {
  const [initial, setInitial] = useState<InitialData | null>(null);

  // load existing building data
  useEffect(() => {
    setInitial(null);
    if (buildingId == null) return;

    let cancelled = false;
    (async () => {
      try {
        const b = await buildingService.getById(buildingId);
        if (!cancelled) {
          setInitial({
            // cast to BuildingType so TS knows it's valid
            type: b.type as BuildingType,
            sortOrder: b.sortOrder,
            powerUsage: b.powerUsage,
            iconKey: b.iconKey ?? undefined,
          });
        }
      } catch {
        if (!cancelled) onDone();
      }
    })();

    return () => {
      cancelled = true;
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
    // 1) sync icon (upload/new/delete)
    const finalKey = await syncImageField(
      initial.iconKey ?? '',
      data.iconKey ?? '',
      data.file
    );

    // 2) construct payload
    const payload: BuildingDto = {
      id: buildingId,
      type: data.type,
      sortOrder: data.sortOrder,
      powerUsage: data.powerUsage,
      iconKey: finalKey,
    };

    // 3) send update
    await buildingService.update(payload);
    onDone();
  };

  const handleCancel = () => {
    onDone();
  };

  const handleDelete = async () => {
    if (initial.iconKey) {
      await syncImageField(initial.iconKey, '', undefined);
    }
    await buildingService.delete(buildingId);
    onDone();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Update Building</h1>
      <BuildingForm
        initial={initial}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UpdateBuilding;
