/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/items/create/CreateItem.tsx
import React from 'react';
import ItemForm, { type ItemFormData } from '../ItemForm';
import type { ItemDto } from '../../../types';
import { itemService } from '../../../services/itemService';
import { syncImageField } from '../../../services/imageField';

interface CreateItemProps {
  /** Called when form is done (either cancel or successful save) */
  onDone: () => void;
}

const CreateItem: React.FC<CreateItemProps> = ({ onDone }) => {
  const handleSubmit = async (data: ItemFormData) => {
    try {
      // 1) upload/resolve the image (if any) and get back a key
      const finalKey = await syncImageField(
        /* initialKey = */ '',
        data.iconKey ?? '',
        data.file
      );

      // 2) build payload. cast as ItemDto so itemService.create() accepts it
      const payload = {
        name: data.name.trim(),
        resource: data.resource,
        iconKey: finalKey || undefined,
      } as unknown as ItemDto;

      // 3) actually create
      await itemService.create(payload);

      // 4) switch back to “view” and refresh
      onDone();
    } catch (err: any) {
      // bubble up error message so ItemForm will display it
      const msg =
        err?.response?.data?.message || err.message || 'Failed to create item';
      throw new Error(msg);
    }
  };

  const handleCancel = () => {
    onDone();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Create Item</h2>
      <ItemForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default CreateItem;
