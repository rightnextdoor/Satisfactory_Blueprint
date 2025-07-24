// src/components/generators/view/ViewGenerators.tsx
import React, { useState, useEffect, useRef } from 'react';
import type { GeneratorDto } from '../../../types/generator';
import { generatorService } from '../../../services/generatorService';
import { imageService } from '../../../services/imageService';
import { useSort } from '../../../hooks/useSort';
import { SearchAutocomplete } from '../../common/SearchAutocomplete';
import SectionTitle from './SectionTitle';
import GeneratorTable from './GeneratorTable';

type SearchItem = GeneratorDto & {
  byProductName: string;
  fuelItemsNames: string;
};

interface ViewGeneratorsProps {
  selectedGeneratorId: number | null;
  onSelect: (id: number | null) => void;
  refreshKey: number;
}

const ViewGenerators: React.FC<ViewGeneratorsProps> = ({
  selectedGeneratorId,
  onSelect,
  refreshKey,
}) => {
  const [icons, setIcons] = useState<Record<number, string>>({});
  const [searchList, setSearchList] = useState<SearchItem[]>([]);
  const [filtered, setFiltered] = useState<SearchItem[]>([]);
  const didAutoSelect = useRef(false);

  // Load list & icons
  useEffect(() => {
    let cancelled = false;
    generatorService.listAll().then((data) => {
      if (cancelled) return;
      setIcons({});
      data.forEach((g) => {
        if (!g.image?.id) return;
        imageService.get(g.image.id).then((dto) => {
          if (cancelled || !dto.data) return;
          const bin = atob(dto.data);
          const arr = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
          const blob = new Blob([arr], { type: dto.contentType });
          setIcons((prev) => ({ ...prev, [g.id]: URL.createObjectURL(blob) }));
        });
      });
      const flat = data.map((g) => ({
        ...g,
        byProductName: g.byProduct?.item.name ?? '',
        fuelItemsNames: g.fuelItems.map((fi) => fi.item.name).join(', '),
      }));
      setSearchList(flat);
      setFiltered(flat);
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const { sorted, sortField, sortOrder, toggleSort } = useSort<SearchItem>({
    items: filtered,
    initialField: 'name',
  });

  // Auto-select first generator only once
  useEffect(() => {
    if (!didAutoSelect.current && sorted.length > 0) {
      onSelect(sorted[0].id);
      didAutoSelect.current = true;
    }
  }, [sorted, onSelect]);

  return (
    <div className="generator-page__card">
      <SectionTitle text="View Generators" />

      <SearchAutocomplete<SearchItem>
        className="generator-page__search mb-4 w-full sm:w-1/2"
        items={searchList}
        fields={['name', 'fuelType', 'byProductName', 'fuelItemsNames']}
        placeholder="Search generators by type, fuel, by-product or fuel items…"
        onFilter={setFiltered}
        onSelect={(g) => onSelect(g.id)}
      />

      <GeneratorTable
        generators={sorted}
        icons={icons}
        selectedGeneratorId={selectedGeneratorId}
        onSelect={onSelect}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={toggleSort}
      />
    </div>
  );
};

export default ViewGenerators;
