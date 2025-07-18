// src/components/items/update/UpdateItem.tsx
import React, { useState, useEffect } from 'react';
import type { ItemDto } from '../../../types';
import { itemService } from '../../../services/itemService';

export interface UpdateItemProps {
  itemId: number | null;
}

const UpdateItem: React.FC<UpdateItemProps> = ({ itemId }) => {
  const [item, setItem] = useState<ItemDto | null>(null);

  useEffect(() => {
    if (itemId !== null) {
      itemService
        .getById(itemId)
        .then((data) => {
          console.log('Loaded item for update:', data);
          setItem(data);
        })
        .catch((err) => console.error('Failed to load item:', err));
    }
  }, [itemId]);

  return (
    <div className="item-page__card">
      <h2 className="text-center font-bold text-xl mb-4">Update Item</h2>

      {item ? (
        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {item.id}
          </p>
          <p>
            <strong>Name:</strong> {item.name}
          </p>
          <p>
            <strong>Resource:</strong> {String(item.resource)}
          </p>
          {/* TODO: Add form fields for updating item */}
        </div>
      ) : (
        <p className="text-center text-gray-500">Select an item to update.</p>
      )}
    </div>
  );
};

export default UpdateItem;
