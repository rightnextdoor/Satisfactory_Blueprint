// src/components/home/planner/PlannerTable.tsx
import React from 'react';
import type { PlannerDto } from '../../../types';
import PlannerTableCard from './PlannerTableCard';
import { formatDate } from '../../../utils/dateUtils';

export type SortField =
  | 'default'
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
  sortOrder: 0 | 1 | -1;
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
}) => (
  <PlannerTableCard className={cardClassName}>
    <table className={tableClassName}>
      <thead className={theadClassName}>
        <tr>
          {/* Empty header cell instead of select-all checkbox */}
          <th className={thClassName}></th>
          <th className={thClassName}>#</th>
          {(
            [
              'name',
              'mode',
              'targetType',
              'generator',
              'targetAmount',
              'createdAt',
              'updatedAt',
            ] as SortField[]
          ).map((field) => {
            const labels: Record<SortField, string> = {
              default: '',
              name: 'Name',
              mode: 'Mode',
              targetType: 'Target Type',
              generator: 'Generator',
              targetAmount: 'Target Amt',
              createdAt: 'Created',
              updatedAt: 'Updated',
            };
            const indicator =
              sortField === field
                ? sortOrder === 1
                  ? ' ↑'
                  : sortOrder === -1
                  ? ' ↓'
                  : ''
                : '';
            return (
              <th
                key={field}
                className={`${thClassName} cursor-pointer`}
                onClick={() => onSort(field)}
              >
                {labels[field]}
                {indicator}
              </th>
            );
          })}
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

export default PlannerTable;
