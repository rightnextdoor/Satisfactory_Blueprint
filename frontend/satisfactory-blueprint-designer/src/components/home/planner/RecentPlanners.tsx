/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/home/RecentPlanners.tsx
import React, { useState, useEffect } from 'react';
import type { PlannerDto } from '../../../types';
import { plannerService } from '../../../services/plannerService';
import SectionTitle from '../planner/SectionTitle';
import { SearchAutocomplete } from '../../common/SearchAutocomplete';
import PlannerTable from '../planner/PlannerTable';
import { useSort } from '../../../hooks/useSort';
import '../../../styles/home/RecentPlanners.css';
import type { SortField } from '../planner/PlannerTable';

const RecentPlanners: React.FC = () => {
  const [planners, setPlanners] = useState<PlannerDto[]>([]);
  const [filteredPlanners, setFilteredPlanners] = useState<PlannerDto[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // sorting hook
  const { sorted, sortField, sortOrder, toggleSort } = useSort<PlannerDto>({
    items: filteredPlanners,
    initialField: 'default',
  });

  // fetch data
  useEffect(() => {
    setLoading(true);
    plannerService
      .listAll()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as any).planners;
        setPlanners(list);
        setFilteredPlanners(list);
      })
      .catch((e: any) => {
        const msg = e?.response?.data?.message ?? e.message ?? 'Error';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  // export handler
  useEffect(() => {
    const h = () => {
      console.log('Export planners:', Array.from(selectedIds));
      setSelectedIds(new Set());
    };
    window.addEventListener('export-recent-planners', h);
    return () => window.removeEventListener('export-recent-planners', h);
  }, [selectedIds]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUpdate = (p: PlannerDto) => {
    console.log('Update planner', p);
  };

  if (loading) return <div>Loading planners…</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <section className="recent-planners">
      <div className="recent-planners__card">
        <SectionTitle
          title="Factory Plans"
          className="recent-planners__title"
        />

        <SearchAutocomplete<PlannerDto>
          className="recent-planners__search mx-auto mb-6 w-full sm:w-1/2 md:w-1/3"
          items={planners}
          fields={['name', 'createdAt', 'updatedAt']}
          placeholder="Search by name or date…"
          onFilter={setFilteredPlanners}
          onSelect={(item) => {
            console.log('Selected:', item);
          }}
        />

        {/* Sorting is now in the table headers */}
        <PlannerTable
          tableClassName="recent-planners__table"
          theadClassName="recent-planners__thead"
          thClassName="recent-planners__th"
          tdClassName="recent-planners__td"
          rowOddClassName="recent-planners__row--odd"
          rowEvenClassName="recent-planners__row--even"
          updateBtnClassName="recent-planners__update-btn"
          planners={sorted}
          selectedIds={selectedIds}
          onToggle={toggleSelect}
          onUpdate={handleUpdate}
          sortField={sortField as SortField}
          sortOrder={sortOrder}
          onSort={toggleSort}
        />
      </div>
    </section>
  );
};

export default RecentPlanners;
