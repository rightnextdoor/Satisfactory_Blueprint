/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/items/view/ViewItems.tsx
import React, { useState, useEffect, useRef } from 'react';
import type { ItemDto } from '../../../types';
import { itemService } from '../../../services/itemService';
import { imageService } from '../../../services/imageService';
import { useSort } from '../../../hooks/useSort';
import { SearchAutocomplete } from '../../common/SearchAutocomplete';
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
  const didAutoSelect = useRef(false);

  useEffect(() => {
    let cancelled = false;
    itemService
      .listAll()
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        setFiltered(data);
        setIcons({});
        data.forEach((it) => {
          const imageId = it.image?.id;
          if (!imageId) return;
          imageService
            .get(imageId)
            .then((dto) => {
              if (cancelled) return;
              const url = `data:${dto.contentType};base64,${dto.data}`;
              setIcons((prev) => ({ ...prev, [it.id]: url }));
            })
            .catch(() => {});
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const { sorted, sortField, sortOrder, toggleSort } = useSort<ItemDto>({
    items: filtered,
    initialField: 'id',
  });

  // Auto-select first item only once on load
  useEffect(() => {
    if (!didAutoSelect.current && sorted.length > 0) {
      onSelect(sorted[0].id);
      didAutoSelect.current = true;
    }
  }, [sorted, onSelect]);

  return (
    <div className="item-page__card">
      <SectionTitle text="View Items" />

      <SearchAutocomplete<ItemDto>
        className="item-page__search mb-4 w-full sm:w-1/2"
        items={items}
        fields={['name']}
        placeholder="Search by name…"
        onFilter={setFiltered}
        onSelect={(it) => onSelect(it.id)}
        renderItem={(it) => it.name}
      />

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
