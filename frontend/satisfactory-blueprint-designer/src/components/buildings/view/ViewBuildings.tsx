/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/buildings/view/ViewBuildings.tsx
import React, { useState, useEffect } from 'react';
import type { BuildingDto } from '../../../types';
import { buildingService } from '../../../services/buildingService';
import { imageService } from '../../../services/imageService';
import { useSort } from '../../../hooks/useSort';
import { SearchAutocomplete } from '../../common/SearchAutocomplete';
import SectionTitle from './SectionTitle';
import BuildingTable from './BuildingTable';

interface ViewBuildingsProps {
  selectedBuildingId: number | null;
  onSelect: (id: number | null) => void;
  /** Changing this will re-fetch the list */
  refreshKey: number;
}

const ViewBuildings: React.FC<ViewBuildingsProps> = ({
  selectedBuildingId,
  onSelect,
  refreshKey,
}) => {
  const [buildings, setBuildings] = useState<BuildingDto[]>([]);
  const [filtered, setFiltered] = useState<BuildingDto[]>([]);
  const [icons, setIcons] = useState<Record<number, string>>({});

  // Fetch buildings & icons whenever refreshKey changes
  useEffect(() => {
    let cancelled = false;

    buildingService
      .listAll()
      .then((data) => {
        if (cancelled) return;
        setBuildings(data);
        setFiltered(data);
        setIcons({});

        data.forEach((b) => {
          const imageId = b.image?.id;
          if (!imageId) return;
          imageService
            .get(imageId)
            .then((imgDto) => {
              if (cancelled) return;
              const url = `data:${imgDto.contentType};base64,${imgDto.data}`;
              setIcons((prev) => ({ ...prev, [b.id]: url }));
            })
            .catch((err) => {
              if (
                err?.response?.status !== 400 &&
                err?.response?.status !== 404
              ) {
                console.error(`Error loading image for building ${b.id}`, err);
              }
            });
        });
      })
      .catch((err) => console.error('Failed to load buildings', err));

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  // Sorting over filtered data
  const { sorted, sortField, sortOrder, toggleSort } = useSort<BuildingDto>({
    items: filtered,
    initialField: 'sortOrder',
  });

  // Auto-select first building if none selected yet
  useEffect(() => {
    if (selectedBuildingId == null && sorted.length > 0) {
      onSelect(sorted[0].id);
    }
  }, [selectedBuildingId, sorted, onSelect]);

  return (
    <div className="building-page__card">
      <SectionTitle text="View Buildings" />

      <SearchAutocomplete<BuildingDto>
        className="building-page__search mb-4 w-full sm:w-1/2"
        items={buildings}
        fields={['type']}
        placeholder="Search by building type…"
        onFilter={setFiltered}
        onSelect={(b) => onSelect(b.id)}
        renderItem={(b) => b.type}
      />

      <BuildingTable
        buildings={sorted}
        icons={icons}
        selectedBuildingId={selectedBuildingId}
        onSelect={onSelect}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={toggleSort}
      />
    </div>
  );
};

export default ViewBuildings;
