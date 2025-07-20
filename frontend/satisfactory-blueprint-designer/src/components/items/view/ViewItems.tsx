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
  /** Changing this will re-fetch the list */
  refreshKey: number;
}

const ViewItems: React.FC<ViewItemsProps> = ({
  selectedItemId,
  onSelect,
  refreshKey,
}) => {
  const [items, setItems] = useState<ItemDto[]>([]);
  const [filtered, setFiltered] = useState<ItemDto[]>([]);
  const [icons, setIcons] = useState<Record<number, string>>({});
  const [query, setQuery] = useState('');

  // Fetch items & icons whenever refreshKey changes
  useEffect(() => {
    let cancelled = false;

    itemService
      .listAll()
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        setIcons({});
        data.forEach((it) => {
          const rawKey = it.iconKey;
          const key = rawKey?.trim();
          if (!key) return;
          imageService
            .get(key)
            .then((blob) => {
              if (cancelled) return;
              const url = URL.createObjectURL(blob);
              setIcons((prev) => ({ ...prev, [it.id]: url }));
            })
            .catch((err) => {
              if (
                err?.response?.status !== 404 &&
                err?.response?.status !== 400
              ) {
                console.error(`Error loading icon for item ${it.id}`, err);
              }
            });
        });
      })
      .catch((err) => console.error('Failed to load items', err));

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  // Re-apply filter whenever items list or query changes
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      setFiltered(items.filter((it) => it.name.toLowerCase().includes(q)));
    } else {
      setFiltered(items);
    }
  }, [items, query]);

  // Sorting over filtered data
  const { sorted, sortField, sortOrder, toggleSort } = useSort<ItemDto>({
    items: filtered,
    initialField: 'id',
  });

  return (
    <div className="item-page__card">
      <SectionTitle text="View Items" />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="item-page__search border rounded px-3 py-2 w-full sm:w-1/2"
        />
      </div>

      <ItemTable
        items={sorted}
        icons={icons}
        selectedItemId={selectedItemId}
        onSelect={onSelect}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={toggleSort}
      />
    </div>
  );
};

export default ViewItems;
