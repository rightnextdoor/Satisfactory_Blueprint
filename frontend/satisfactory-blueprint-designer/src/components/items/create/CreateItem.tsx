/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/items/create/CreateItem.tsx
import React from 'react';
import ItemForm, { type ItemFormData } from '../ItemForm';
import type { ItemDto } from '../../../types/itemDto';
import type { ImageDto } from '../../../types/image';
import type { ImageUploadRequest } from '../../../types/imageUploadRequest';
import type { OwnerType } from '../../../types/enums';
import { itemService } from '../../../services/itemService';
import { imageService } from '../../../services/imageService';

interface CreateItemProps {
  /** Called when form is done (either cancel or successful save) */
  onDone: () => void;
}

const CreateItem: React.FC<CreateItemProps> = ({ onDone }) => {
  const handleSubmit = async (data: ItemFormData) => {
    try {
      // 1) Create the Item without any image
      const created: ItemDto = await itemService.create({
        name: data.name.trim(),
        resource: data.resource,
      });

      let finalImage: ImageDto | undefined;

      // Helper to convert a File to base64 string
      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

      // 2) If user uploaded a new file, upload + assign it
      if (data.file) {
        const base64 = await toBase64(data.file);
        const req: ImageUploadRequest = {
          ownerType: 'ITEM' as OwnerType,
          ownerId: created.id,
          contentType: data.file.type,
          data: base64,
        };
        finalImage = await imageService.upload(req);
      }
      // 3) Otherwise if they chose an existing image, assign it
      else if (data.imageId) {
        const req: ImageUploadRequest = {
          id: data.imageId,
          data: undefined,
          contentType: undefined,
          oldImageId: undefined,
          ownerType: 'ITEM' as OwnerType,
          ownerId: created.id,
        };
        finalImage = await imageService.upload(req);
      }

      // 4) If we got an image back, update the Item to link it
      if (finalImage) {
        const updated: ItemDto = {
          id: created.id,
          name: created.name,
          resource: created.resource,
          image: finalImage,
        };
        await itemService.update(updated);
      }

      // 5) Done—go back to view
      onDone();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || 'Failed to create item';
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
