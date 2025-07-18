// src/components/home/planner/PlannerTable.tsx
import React from 'react';
import type { PlannerDto } from '../../../types';
import PlannerTableCard from './PlannerTableCard';
import { formatDate } from '../../../utils/dateUtils';
import type { SortOrder } from '../../../hooks/useSort';

export type SortField =
  | 'default'
  | 'id'
  | 'name'
  | 'mode'
  | 'targetType'
  | 'generator'
  | 'targetAmount'
  | 'createdAt'
  | 'updatedAt';

interface PlannerTableProps {
  planners: PlannerDto[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  onUpdate: (planner: PlannerDto) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  cardClassName?: string;
  tableClassName?: string;
  theadClassName?: string;
  thClassName?: string;
  tdClassName?: string;
  rowOddClassName?: string;
  rowEvenClassName?: string;
  updateBtnClassName?: string;
}

const PlannerTable: React.FC<PlannerTableProps> = ({
  planners,
  selectedIds,
  onToggle,
  onUpdate,
  sortField,
  sortOrder,
  onSort,
  cardClassName = '',
  tableClassName = '',
  theadClassName = '',
  thClassName = '',
  tdClassName = '',
  rowOddClassName = '',
  rowEvenClassName = '',
  updateBtnClassName = '',
}) => {
  const indicator = (field: SortField) =>
    sortField === field
      ? sortOrder === 1
        ? '↑'
        : sortOrder === -1
        ? '↓'
        : ''
      : '';

  const sortableTh = (field: SortField, label: string) => (
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
    <PlannerTableCard className={cardClassName}>
      <table className={tableClassName}>
        <thead className={theadClassName}>
          <tr>
            {/* selection checkbox column */}
            <th className={thClassName}></th>

            {/* sortable columns */}
            {sortableTh('id', '#')}
            {sortableTh('name', 'Name')}
            {sortableTh('mode', 'Mode')}
            {sortableTh('targetType', 'Target Type')}
            {sortableTh('generator', 'Generator')}
            {sortableTh('targetAmount', 'Target Amt')}
            {sortableTh('createdAt', 'Created')}
            {sortableTh('updatedAt', 'Updated')}

            {/* action column */}
            <th className={thClassName}>Action</th>
          </tr>
        </thead>
        <tbody>
          {planners.map((p, i) => {
            const rowClass = i % 2 === 0 ? rowOddClassName : rowEvenClassName;
            return (
              <tr key={p.id} className={`${rowClass} hover:bg-blue-50`}>
                <td className={tdClassName}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(p.id!)}
                    onChange={() => onToggle(p.id!)}
                  />
                </td>
                <td className={tdClassName}>{i + 1}</td>
                <td className={tdClassName}>{p.name}</td>
                <td className={tdClassName}>{p.mode}</td>
                <td className={tdClassName}>{p.targetType}</td>
                <td className={tdClassName}>{p.generator?.name}</td>
                <td className={tdClassName}>{p.targetAmount ?? ''}</td>
                <td className={tdClassName}>{formatDate(p.createdAt)}</td>
                <td className={tdClassName}>{formatDate(p.updatedAt)}</td>
                <td className={tdClassName}>
                  <button
                    onClick={() => onUpdate(p)}
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
    </PlannerTableCard>
  );
};

export default PlannerTable;
