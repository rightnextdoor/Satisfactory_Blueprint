// src/components/buildings/view/BuildingTable.tsx
import React from 'react';
import type { BuildingDto } from '../../../types';
import type { SortOrder } from '../../../hooks/useSort';

export interface BuildingTableProps {
  buildings: BuildingDto[];
  icons: Record<number, string>;
  selectedBuildingId: number | null;
  onSelect: (id: number) => void;
  sortField: string;
  sortOrder: SortOrder;
  onSort: (field: string) => void;
}

const BuildingTable: React.FC<BuildingTableProps> = ({
  buildings,
  icons,
  selectedBuildingId,
  onSelect,
  sortField,
  sortOrder,
  onSort,
}) => (
  <table className="building-page__table">
    <thead className="building-page__thead">
      <tr>
        <th className="building-page__th text-center">Select</th>
        <th
          className="building-page__th cursor-pointer"
          onClick={() => onSort('id')}
        >
          # {sortField === 'id' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        <th className="building-page__th">Icon</th>
        <th
          className="building-page__th cursor-pointer"
          onClick={() => onSort('type')}
        >
          Building Type {sortField === 'type' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        <th
          className="building-page__th cursor-pointer"
          onClick={() => onSort('sortOrder')}
        >
          Sort Order{' '}
          {sortField === 'sortOrder' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        <th
          className="building-page__th cursor-pointer"
          onClick={() => onSort('powerUsage')}
        >
          Power Usage{' '}
          {sortField === 'powerUsage' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
      </tr>
    </thead>
    <tbody>
      {buildings.map((b, idx) => (
        <tr
          key={b.id}
          className={
            idx % 2 === 0
              ? 'building-page__row--even'
              : 'building-page__row--odd'
          }
        >
          <td className="building-page__td text-center">
            <input
              type="radio"
              name="selectedBuilding"
              value={b.id}
              checked={selectedBuildingId === b.id}
              onChange={() => onSelect(b.id)}
            />
          </td>
          <td className="building-page__td">{idx + 1}</td>
          <td className="building-page__td">
            {icons[b.id] && (
              <img
                src={icons[b.id]}
                alt={b.type}
                className="w-6 h-6 object-contain"
              />
            )}
          </td>
          <td className="building-page__td">{b.type}</td>
          <td className="building-page__td">{b.sortOrder}</td>
          <td className="building-page__td">{b.powerUsage}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default BuildingTable;
