// src/components/home/TransportRoutes.tsx
import React, { useState, useEffect } from 'react';
import '../../../styles/home/TransportRoutes.css';
import SectionTitle from '../planner/SectionTitle';
import { SearchAutocomplete } from '../../common/SearchAutocomplete';
import TransportTable, { type TransportSortField } from './TransportTable';
import { useSort } from '../../../hooks/useSort';
import type { TransportPlanDto } from '../../../types';
import { transportService } from '../../../services/transportService';

const TransportRoutes: React.FC = () => {
  const [plans, setPlans] = useState<TransportPlanDto[]>([]);
  const [filtered, setFiltered] = useState<TransportPlanDto[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const { sorted, sortField, sortOrder, toggleSort } =
    useSort<TransportPlanDto>({
      items: filtered,
      initialField: 'default',
    });

  // fetch all transport plans
  useEffect(() => {
    transportService
      .listPlans()
      .then((data) => {
        setPlans(data);
        setFiltered(data);
      })
      .catch(console.error);
  }, []);

  // export handler
  useEffect(() => {
    const onExport = () => {
      console.log('Exporting transport plans:', Array.from(selectedIds));
      setSelectedIds(new Set());
    };
    window.addEventListener('export-transport-plans', onExport);
    return () => window.removeEventListener('export-transport-plans', onExport);
  }, [selectedIds]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUpdate = (plan: TransportPlanDto) => {
    console.log('Updating transport plan:', plan);
  };

  return (
    <section className="transport-routes">
      <div className="transport-routes__card">
        <SectionTitle
          title="Transport Routes"
          className="transport-routes__title"
        />

        <SearchAutocomplete<TransportPlanDto>
          className="transport-routes__search mx-auto mb-6 w-full sm:w-1/2 md:w-1/3"
          items={plans}
          fields={['name', 'plannerId']}
          placeholder="Search by name or planner ID…"
          onFilter={setFiltered}
          onSelect={(item) => {
            console.log('Selected transport plan:', item);
          }}
        />

        <TransportTable
          plans={sorted} /* ← use “plans”, not “routes” */
          selectedIds={selectedIds}
          onToggle={toggleSelect}
          onUpdate={handleUpdate}
          sortField={sortField as TransportSortField} /* cast your sortField */
          sortOrder={sortOrder}
          onSort={toggleSort}
          tableClassName="transport-routes__table"
          theadClassName="transport-routes__thead"
          thClassName="transport-routes__th"
          tdClassName="transport-routes__td"
          rowOddClassName="transport-routes__row--odd"
          rowEvenClassName="transport-routes__row--even"
          updateBtnClassName="transport-routes__update-btn"
        />
      </div>
    </section>
  );
};

export default TransportRoutes;
