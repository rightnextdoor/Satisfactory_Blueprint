// src/components/common/SortControl.tsx
import React from 'react';
import type { SortOrder } from '../../hooks/useSort';

export interface SortOption {
  label: string;
  field: string;
}

interface SortControlProps {
  options: SortOption[];
  sortField: string;
  sortOrder: SortOrder;
  onToggle: (field: string) => void;
  className?: string;
  buttonClassName?: string;
}

export const SortControl: React.FC<SortControlProps> = ({
  options,
  sortField,
  sortOrder,
  onToggle,
  className = '',
  buttonClassName = '',
}) => (
  <div className={className}>
    {options.map(({ label, field }) => {
      const indicator =
        sortField === field
          ? sortOrder === 1
            ? ' ↑'
            : sortOrder === -1
            ? ' ↓'
            : ''
          : '';
      return (
        <button
          key={field}
          onClick={() => onToggle(field)}
          className={buttonClassName}
        >
          {label}
          {indicator}
        </button>
      );
    })}
  </div>
);
