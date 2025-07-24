/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/items/update/UpdateItem.tsx
import React, { useState, useEffect } from 'react';
import ItemForm, { type ItemFormData } from '../ItemForm';
import type { ItemDto } from '../../../types/itemDto';
import type { ImageDto } from '../../../types/image';
import type { ImageUploadRequest } from '../../../types/imageUploadRequest';
import type { OwnerType } from '../../../types/enums';
import { itemService } from '../../../services/itemService';
import { imageService } from '../../../services/imageService';

interface UpdateItemProps {
  itemId: number | null;
  onDone: () => void;
}

const UpdateItem: React.FC<UpdateItemProps> = ({ itemId, onDone }) => {
  const [initial, setInitial] = useState<ItemDto | null>(null);

  // Load the existing item and seed the form
  useEffect(() => {
    if (itemId == null) return void setInitial(null);
    let cancelled = false;

    itemService
      .getById(itemId)
      .then((item) => {
        if (!cancelled) setInitial(item);
      })
      .catch(() => !cancelled && onDone());

    return () => {
      cancelled = true;
    };
  }, [itemId, onDone]);

  if (itemId == null) return <p>Please select an item to update.</p>;
  if (!initial) return <p>Loading…</p>;

  const handleSubmit = async (data: ItemFormData) => {
    // 1) If they removed the original
    if (data.removeImage && initial?.image?.id) {
      // delete the original image that was there when the form loaded
      await imageService.remove(initial.image.id, 'ITEM' as OwnerType, itemId);
    }

    let finalImage: ImageDto | undefined;

    // 2) New file upload wins
    if (data.file) {
      // convert File → base64
      const toBase64 = (f: File) =>
        new Promise<string>((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res((reader.result as string).split(',')[1]);
          reader.onerror = rej;
          reader.readAsDataURL(f);
        });
      const base64 = await toBase64(data.file);

      const req: ImageUploadRequest = {
        ownerType: 'ITEM',
        ownerId: itemId,
        contentType: data.file.type,
        data: base64,
        oldImageId: initial.image?.id,
      };
      finalImage = await imageService.upload(req);
    }
    // 3) Else if they kept an existing image
    else if (!data.removeImage && data.imageId) {
      const req: ImageUploadRequest = {
        id: data.imageId,
        data: undefined,
        contentType: undefined,
        oldImageId: initial.image?.id,
        ownerType: 'ITEM' as OwnerType,
        ownerId: itemId,
      };
      finalImage = await imageService.upload(req);
    }
    // 4) else no image

    // 5) Build the full ItemDto
    const payload: ItemDto = {
      id: initial.id,
      name: data.name.trim(),
      resource: data.resource,
      ...(finalImage ? { image: finalImage } : {}),
    };

    await itemService.update(payload);
    onDone();
  };

  const handleDelete = async () => {
    if (initial.image) {
      await imageService.remove(initial.image.id, 'ITEM' as OwnerType, itemId);
    }
    await itemService.delete(itemId);
    onDone();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Update Item</h1>
      <ItemForm
        initial={{
          name: initial.name,
          resource: initial.resource,
          image: initial.image ?? undefined,
        }}
        onSubmit={handleSubmit}
        onCancel={onDone}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UpdateItem;
