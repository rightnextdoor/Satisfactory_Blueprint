/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useSort.ts
import { useState, useMemo } from 'react';

export type SortOrder = 0 | 1 | -1;

export function useSort<T extends Record<string, any>>(options: {
  items: T[];
  /** field key to sort by; use 'default' for unsorted */
  initialField: keyof T | 'default';
  /** initial order: 0 = unsorted, 1 = asc, -1 = desc */
  initialOrder?: SortOrder;
}) {
  const { items, initialField, initialOrder = 0 } = options;
  const [sortField, setSortField] = useState<string | 'default'>(
    initialField as string
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialOrder);

  const sorted = useMemo(() => {
    if (sortField === 'default' || sortOrder === 0) return items;
    return [...items].sort((a, b) => {
      const aVal = String(a[sortField] ?? '');
      const bVal = String(b[sortField] ?? '');
      if (aVal < bVal) return -1 * sortOrder;
      if (aVal > bVal) return 1 * sortOrder;
      return 0;
    });
  }, [items, sortField, sortOrder]);

  function toggleSort(field: string) {
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
  }

  return { sorted, sortField, sortOrder, toggleSort };
}
