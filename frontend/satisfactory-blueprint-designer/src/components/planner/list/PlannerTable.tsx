// src/components/planner/list/PlannerTable.tsx

import React from 'react';
import type { PlannerDto } from '../../../types';
import type { SortOrder } from '../../../hooks/useSort';
import { formatDate } from '../../../utils/dateUtils';

export type SortField =
  | 'id'
  | 'name'
  | 'mode'
  | 'targetType'
  | 'generator'
  | 'fuelType'
  | 'targetAmount'
  | 'createdAt'
  | 'updatedAt';

export interface PlannerTableProps {
  planners: PlannerDto[];
  selectedPlannerId: number | null;
  onSelect: (id: number) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

const PlannerTable: React.FC<PlannerTableProps> = ({
  planners,
  selectedPlannerId,
  onSelect,
  sortField,
  sortOrder,
  onSort,
}) => (
  <table className="planner-page__table">
    <thead className="planner-page__thead">
      <tr>
        <th className="planner-page__th" />

        <th className="planner-page__th" onClick={() => onSort('id')}>
          <div className="planner-page__th-content">
            <span>#</span>
            {sortField === 'id' && (
              <span className="planner-page__sort-icon">
                {sortOrder === 1 ? '▲' : '▼'}
              </span>
            )}
          </div>
        </th>

        <th className="planner-page__th" onClick={() => onSort('name')}>
          <div className="planner-page__th-content">
            <span>Name</span>
            {sortField === 'name' && (
              <span className="planner-page__sort-icon">
                {sortOrder === 1 ? '▲' : '▼'}
              </span>
            )}
          </div>
        </th>

        <th className="planner-page__th" onClick={() => onSort('mode')}>
          <div className="planner-page__th-content">
            <span>Mode</span>
            {sortField === 'mode' && (
              <span className="planner-page__sort-icon">
                {sortOrder === 1 ? '▲' : '▼'}
              </span>
            )}
          </div>
        </th>

        <th className="planner-page__th" onClick={() => onSort('targetType')}>
          <div className="planner-page__th-content">
            <span>Target Type</span>
            {sortField === 'targetType' && (
              <span className="planner-page__sort-icon">
                {sortOrder === 1 ? '▲' : '▼'}
              </span>
            )}
          </div>
        </th>

        <th className="planner-page__th" onClick={() => onSort('generator')}>
          <div className="planner-page__th-content">
            <span>Generator</span>
            {sortField === 'generator' && (
              <span className="planner-page__sort-icon">
                {sortOrder === 1 ? '▲' : '▼'}
              </span>
            )}
          </div>
        </th>

        <th className="planner-page__th" onClick={() => onSort('fuelType')}>
          <div className="planner-page__th-content">
            <span>Fuel Type</span>
            {sortField === 'fuelType' && (
              <span className="planner-page__sort-icon">
                {sortOrder === 1 ? '▲' : '▼'}
              </span>
            )}
          </div>
        </th>

        <th className="planner-page__th" onClick={() => onSort('targetAmount')}>
          <div className="planner-page__th-content">
            <span>Target Amt</span>
            {sortField === 'targetAmount' && (
              <span className="planner-page__sort-icon">
                {sortOrder === 1 ? '▲' : '▼'}
              </span>
            )}
          </div>
        </th>

        <th className="planner-page__th" onClick={() => onSort('createdAt')}>
          <div className="planner-page__th-content">
            <span>Created</span>
            {sortField === 'createdAt' && (
              <span className="planner-page__sort-icon">
                {sortOrder === 1 ? '▲' : '▼'}
              </span>
            )}
          </div>
        </th>

        <th className="planner-page__th" onClick={() => onSort('updatedAt')}>
          <div className="planner-page__th-content">
            <span>Updated</span>
            {sortField === 'updatedAt' && (
              <span className="planner-page__sort-icon">
                {sortOrder === 1 ? '▲' : '▼'}
              </span>
            )}
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      {planners.map((p, idx) => (
        <tr
          key={p.id}
          className={
            idx % 2 === 0 ? 'planner-page__row--even' : 'planner-page__row--odd'
          }
        >
          <td className="planner-page__td text-center">
            <input
              type="radio"
              name="selectedPlanner"
              checked={selectedPlannerId === p.id}
              onChange={() => onSelect(p.id!)}
            />
          </td>
          <td className="planner-page__td text-center">{idx + 1}</td>
          <td className="planner-page__td">{p.name}</td>
          <td className="planner-page__td">{p.mode}</td>
          <td className="planner-page__td">{p.targetType}</td>
          <td className="planner-page__td">{p.generator?.name || ''}</td>
          <td className="planner-page__td">{p.generator?.fuelType || ''}</td>
          <td className="planner-page__td">{p.targetAmount}</td>
          <td className="planner-page__td">{formatDate(p.createdAt)}</td>
          <td className="planner-page__td">{formatDate(p.updatedAt)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default PlannerTable;
