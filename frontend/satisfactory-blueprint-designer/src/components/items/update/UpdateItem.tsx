/* src/components/items/update/UpdateItem.tsx */
import React, { useState, useEffect } from 'react';
import ItemForm, { type ItemFormData } from '../ItemForm';
import type { ItemDto } from '../../../types';
import { itemService } from '../../../services/itemService';
import { syncImageField } from '../../../services/imageField';

interface InitialData {
  name: string;
  resource: boolean;
  iconKey?: string;
}

interface UpdateItemProps {
  /** ID of the item to update */
  itemId: number | null;
  /** Called after update, cancel, or delete to go back to view */
  onDone: () => void;
}

const UpdateItem: React.FC<UpdateItemProps> = ({ itemId, onDone }) => {
  const [initial, setInitial] = useState<InitialData | null>(null);

  // Load existing item data
  useEffect(() => {
    setInitial(null);
    if (itemId == null) return;
    let cancelled = false;

    (async () => {
      try {
        const item = await itemService.getById(itemId);
        if (!cancelled) {
          setInitial({
            name: item.name,
            resource: item.resource,
            iconKey: item.iconKey,
          });
        }
      } catch {
        if (!cancelled) onDone();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [itemId, onDone]);

  if (itemId == null) {
    return <div>Please select an item to update.</div>;
  }
  if (!initial) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (data: ItemFormData) => {
    // 1) upload/resolve image
    const finalKey = await syncImageField(
      initial.iconKey,
      data.iconKey ?? '',
      data.file
    );

    // 2) build update payload
    const payload: ItemDto = {
      id: itemId,
      name: data.name.trim(),
      resource: data.resource,
      iconKey: finalKey,
    };

    // 3) send update
    await itemService.update(payload);
    onDone();
  };

  const handleCancel = () => {
    onDone();
  };

  const handleDelete = async () => {
    // delete image if present
    if (initial.iconKey) {
      await syncImageField(initial.iconKey, '', undefined);
    }
    // delete item record
    await itemService.delete(itemId);
    onDone();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Update Item</h1>
      <ItemForm
        initial={initial}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UpdateItem;
