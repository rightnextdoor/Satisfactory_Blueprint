/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/home/RecentPlanners.tsx
import React, { useState, useEffect, useMemo } from 'react';
import type { PlannerDto } from '../../../types';
import { plannerService } from '../../../services/plannerService';
import SectionTitle from '../planner/SectionTitle';
import PlannerSearch from '../planner/PlannerSearch';
import PlannerTable from '../planner/PlannerTable';
import type { SortField } from '../planner/PlannerTable';

const RecentPlanners: React.FC = () => {
  const [planners, setPlanners] = useState<PlannerDto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('default');
  const [sortOrder, setSortOrder] = useState<0 | 1 | -1>(0);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived lists
  const baseList = planners;
  const filtered = useMemo(
    () =>
      baseList.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.createdAt?.includes(searchQuery) ||
          p.updatedAt?.includes(searchQuery)
      ),
    [baseList, searchQuery]
  );
  const sorted = useMemo(() => {
    if (sortField === 'default' || sortOrder === 0) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = (a[sortField] ?? '').toString();
      const bVal = (b[sortField] ?? '').toString();
      if (aVal < bVal) return -1 * sortOrder;
      if (aVal > bVal) return 1 * sortOrder;
      return 0;
    });
  }, [filtered, sortField, sortOrder]);

  // Handlers
  const toggleSort = (field: SortField) => {
    if (sortField !== field) {
      setSortField(field);
      setSortOrder(1);
    } else if (sortOrder === 1) {
      setSortOrder(-1);
    } else if (sortOrder === -1) {
      setSortField('default');
      setSortOrder(0);
    } else {
      setSortOrder(1);
    }
  };

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

  // Data fetch
  useEffect(() => {
    setLoading(true);
    setError(null);

    plannerService
      .listAll()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as any).planners;
        if (!Array.isArray(list)) {
          throw new Error('Unexpected response shape');
        }
        setPlanners(list);
      })
      .catch((e: any) => {
        console.error(e);
        const backendMsg = e?.response?.data?.message;
        setError(
          typeof backendMsg === 'string'
            ? backendMsg
            : e instanceof Error
            ? e.message
            : 'Failed to load planners.'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handler = () => {
      console.log('Export planners:', Array.from(selectedIds));
      // clear all checkboxes
      setSelectedIds(new Set());
    };

    window.addEventListener('export-recent-planners', handler);
    return () => {
      window.removeEventListener('export-recent-planners', handler);
    };
  }, [selectedIds]);

  if (loading) return <div>Loading planners…</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <section className="recent-planners">
      {/* OUTER CARD WRAPPER: now encloses title, search, and table */}
      <div className="recent-planners__card">
        <SectionTitle
          title="Factory Plans"
          className="recent-planners__title"
        />

        <PlannerSearch
          className="recent-planners__search"
          query={searchQuery}
          onChange={setSearchQuery}
        />

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
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={toggleSort}
        />
      </div>
    </section>
  );
};

export default RecentPlanners;
