// src/components/home/planner/PlannerSort.tsx
import React from 'react';

type SortField = 'default' | 'name' | 'createdAt' | 'updatedAt';

interface PlannerSortProps {
  field: SortField;
  order: 0 | 1 | -1;
  onToggle: (field: SortField) => void;
  className?: string;
  buttonClassName?: string;
}

const labels: Record<SortField, string> = {
  default: 'Sort',
  name: 'Name',
  createdAt: 'Created',
  updatedAt: 'Updated',
};

const PlannerSort: React.FC<PlannerSortProps> = ({
  field,
  order,
  onToggle,
  className = '',
  buttonClassName = '',
}) => (
  <div className={className}>
    {(['name', 'createdAt', 'updatedAt'] as SortField[]).map((f) => {
      const indicator =
        field === f ? (order === 1 ? '↑' : order === -1 ? '↓' : '') : '';
      return (
        <button key={f} onClick={() => onToggle(f)} className={buttonClassName}>
          {labels[f]} {indicator}
        </button>
      );
    })}
  </div>
);

export default PlannerSort;
