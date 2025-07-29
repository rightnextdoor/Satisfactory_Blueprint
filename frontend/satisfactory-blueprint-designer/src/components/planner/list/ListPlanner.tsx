// src/components/planner/list/ListPlanner.tsx

import React, { useState, useEffect } from 'react';
import type { PlannerDto } from '../../../types';
import { plannerService } from '../../../services/plannerService';
import { SearchAutocomplete } from '../../common/SearchAutocomplete';
import { useSort } from '../../../hooks/useSort';
import PlannerTable, { type SortField } from './PlannerTable';
import '../../../styles/planner/Planner.css';

interface ListPlannerProps {
  onSelect: (plan: PlannerDto) => void;
  active: boolean;
}

export type SearchPlanner = PlannerDto & { fuelType: string };

const ListPlanner: React.FC<ListPlannerProps> = ({ onSelect, active }) => {
  const [allPlanners, setAllPlanners] = useState<SearchPlanner[]>([]);
  const [filteredPlanners, setFilteredPlanners] = useState<SearchPlanner[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { sorted, sortField, sortOrder, toggleSort } = useSort<SearchPlanner>({
    items: filteredPlanners,
    initialField: 'name',
  });

  useEffect(() => {
    if (!active) return;
    plannerService
      .listAll()
      .then((data) => {
        const mapped = data.map((p) => ({
          ...p,
          fuelType: p.generator?.fuelType ?? '',
        }));
        setAllPlanners(mapped);
        setFilteredPlanners(mapped);
      })
      .catch(console.error);
  }, [active]);

  const handleSelect = (plan: SearchPlanner) => {
    setSelectedId(plan.id!);
    onSelect(plan);
  };

  return (
    <div className="planner-page__card">
      <h2 className="planner-page__section-title">Planner List</h2>

      <SearchAutocomplete<SearchPlanner>
        className="planner-page__search mb-4 w-1/3"
        items={allPlanners}
        fields={['name', 'fuelType']}
        placeholder="Search by name or fuel type…"
        onFilter={setFilteredPlanners}
        onSelect={handleSelect}
      />

      <div className="planner-page__table-wrapper">
        <PlannerTable
          planners={sorted}
          selectedPlannerId={selectedId}
          onSelect={(id) => {
            const plan = allPlanners.find((p) => p.id === id);
            if (plan) handleSelect(plan);
          }}
          sortField={sortField as SortField}
          sortOrder={sortOrder}
          onSort={toggleSort}
        />
      </div>
    </div>
  );
};

export default ListPlanner;
