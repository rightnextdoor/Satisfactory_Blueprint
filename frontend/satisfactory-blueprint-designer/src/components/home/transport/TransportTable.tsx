// src/components/home/transport/TransportTable.tsx
import React from 'react';
import type { TransportPlanDto } from '../../../types/transportPlan';
import TransportTableCard from './TransportTableCard';
import type { SortOrder } from '../../../hooks/useSort';

export type TransportSortField =
  | 'default'
  | 'id'
  | 'name'
  | 'plannerId'
  | 'transportItems'
  | 'routes';

interface TransportTableProps {
  plans: TransportPlanDto[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  onUpdate: (plan: TransportPlanDto) => void;
  sortField: TransportSortField;
  sortOrder: SortOrder;
  onSort: (field: TransportSortField) => void;
  tableClassName?: string;
  theadClassName?: string;
  thClassName?: string;
  tdClassName?: string;
  rowOddClassName?: string;
  rowEvenClassName?: string;
  updateBtnClassName?: string;
}

const TransportTable: React.FC<TransportTableProps> = ({
  plans,
  selectedIds,
  onToggle,
  onUpdate,
  sortField,
  sortOrder,
  onSort,
  tableClassName = '',
  theadClassName = '',
  thClassName = '',
  tdClassName = '',
  rowOddClassName = '',
  rowEvenClassName = '',
  updateBtnClassName = '',
}) => {
  const indicator = (field: TransportSortField) =>
    sortField === field
      ? sortOrder === 1
        ? '↑'
        : sortOrder === -1
        ? '↓'
        : ''
      : '';

  const sortableTh = (field: TransportSortField, label: string) => (
    <th
      className={`${thClassName} cursor-pointer whitespace-nowrap`}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center">
        {label}&nbsp;{indicator(field)}
      </span>
    </th>
  );

  return (
    <TransportTableCard>
      <table className={tableClassName}>
        <thead className={theadClassName}>
          <tr>
            <th className={thClassName}></th>
            {sortableTh('id', '#')}
            {sortableTh('name', 'Name')}
            {sortableTh('plannerId', 'Planner ID')}
            {sortableTh('transportItems', 'Items')}
            {sortableTh('routes', 'Routes')}
            <th className={thClassName}>Action</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan, idx) => {
            const rowClass = idx % 2 === 0 ? rowOddClassName : rowEvenClassName;
            return (
              <tr key={plan.id} className={`${rowClass} hover:bg-blue-50`}>
                <td className={tdClassName}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(plan.id)}
                    onChange={() => onToggle(plan.id)}
                  />
                </td>
                <td className={tdClassName}>{idx + 1}</td>
                <td className={tdClassName}>{plan.name}</td>
                <td className={tdClassName}>{plan.plannerId}</td>
                <td className={tdClassName}>{plan.transportItems.length}</td>
                <td className={tdClassName}>{plan.routes.length}</td>
                <td className={tdClassName}>
                  <button
                    onClick={() => onUpdate(plan)}
                    className={updateBtnClassName}
                  >
                    Update
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TransportTableCard>
  );
};

export default TransportTable;
