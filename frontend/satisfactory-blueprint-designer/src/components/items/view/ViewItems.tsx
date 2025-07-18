// src/components/items/view/ViewItems.tsx
import React, { useState, useEffect } from 'react';
import type { ItemDto } from '../../../types';
import { itemService } from '../../../services/itemService';
import { imageService } from '../../../services/imageService';
import { useSort } from '../../../hooks/useSort';
import SectionTitle from './SectionTitle';
import ItemTable from './ItemTable';

interface ViewItemsProps {
  selectedItemId: number | null;
  onSelect: (id: number | null) => void;
}

const ViewItems: React.FC<ViewItemsProps> = ({ selectedItemId, onSelect }) => {
  const [items, setItems] = useState<ItemDto[]>([]);
  const [filtered, setFiltered] = useState<ItemDto[]>([]);
  const [icons, setIcons] = useState<Record<number, string>>({});

  // 1) Fetch items & icons
  useEffect(() => {
    itemService
      .listAll()
      .then((data) => {
        setItems(data);
        setFiltered(data);
        data.forEach((it) => {
          if (it.iconKey) {
            imageService
              .get(it.iconKey)
              .then((blob) => {
                const url = URL.createObjectURL(blob);
                setIcons((prev) => ({ ...prev, [it.id]: url }));
              })
              .catch((err) =>
                console.error('Error loading icon for item', it.id, err)
              );
          }
        });
      })
      .catch((err) => console.error('Failed to load items', err));
  }, []);

  // 2) Search handler
  const handleSearch = (query: string) => {
    const q = query.trim().toLowerCase();
    setFiltered(items.filter((it) => it.name.toLowerCase().includes(q)));
  };

  // 3) Sorting over filtered data
  const { sorted, sortField, sortOrder, toggleSort } = useSort<ItemDto>({
    items: filtered,
    initialField: 'id',
  });

  return (
    <div className="item-page__card">
      {/* Centered, bold section title */}
      <SectionTitle text="View Items" />

      {/* Centered Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name…"
          onChange={(e) => handleSearch(e.target.value)}
          className="item-page__search border rounded px-3 py-2 w-full sm:w-1/2"
        />
      </div>

      {/* Table with in-header sorting */}
      <ItemTable
        items={sorted}
        icons={icons}
        selectedItemId={selectedItemId}
        onSelect={(id: number | null) => onSelect(id)} // allows deselect
        sortField={sortField}
        sortOrder={sortOrder} // already a SortOrder
        onSort={toggleSort}
      />
    </div>
  );
};

export default ViewItems;
