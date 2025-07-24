// src/components/generators/view/GeneratorTable.tsx
import React from 'react';
import type { GeneratorDto } from '../../../types/generator';
import type { SortOrder } from '../../../hooks/useSort';

export interface GeneratorTableProps {
  generators: GeneratorDto[];
  icons: Record<number, string>;
  selectedGeneratorId: number | null;
  onSelect: (id: number) => void;
  sortField: string;
  sortOrder: SortOrder;
  onSort: (field: string) => void;
}

const GeneratorTable: React.FC<GeneratorTableProps> = ({
  generators,
  icons,
  selectedGeneratorId,
  onSelect,
  sortField,
  sortOrder,
  onSort,
}) => (
  <table className="generator-page__table">
    <thead className="generator-page__thead">
      <tr>
        <th className="generator-page__th text-center">Select</th>
        <th
          className="generator-page__th cursor-pointer"
          onClick={() => onSort('id')}
        >
          # {sortField === 'id' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        <th className="generator-page__th">Icon</th>
        <th
          className="generator-page__th cursor-pointer"
          onClick={() => onSort('name')}
        >
          Generator Type {sortField === 'name' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        <th
          className="generator-page__th cursor-pointer"
          onClick={() => onSort('fuelType')}
        >
          Fuel Type {sortField === 'fuelType' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        <th
          className="generator-page__th cursor-pointer"
          onClick={() => onSort('hasByProduct')}
        >
          By-Product{' '}
          {sortField === 'hasByProduct' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        <th
          className="generator-page__th cursor-pointer"
          onClick={() => onSort('byProduct')}
        >
          By-Product Name{' '}
          {sortField === 'byProduct' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        <th
          className="generator-page__th cursor-pointer"
          onClick={() => onSort('powerOutput')}
        >
          Power Output{' '}
          {sortField === 'powerOutput' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        <th
          className="generator-page__th cursor-pointer"
          onClick={() => onSort('burnTime')}
        >
          Burn Time {sortField === 'burnTime' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        <th
          className="generator-page__th cursor-pointer"
          onClick={() => onSort('fuelItems')}
        >
          Fuel Items{' '}
          {sortField === 'fuelItems' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
      </tr>
    </thead>
    <tbody>
      {generators.map((g, idx) => (
        <tr
          key={g.id}
          className={
            idx % 2 === 0
              ? 'generator-page__row--even'
              : 'generator-page__row--odd'
          }
        >
          <td className="generator-page__td text-center">
            <input
              type="radio"
              name="selectedGenerator"
              value={g.id}
              checked={selectedGeneratorId === g.id}
              onChange={() => onSelect(g.id)}
            />
          </td>
          <td className="generator-page__td">{idx + 1}</td>
          <td className="generator-page__td">
            {icons[g.id] && (
              <img
                src={icons[g.id]}
                alt={g.name}
                className="w-6 h-6 object-contain"
              />
            )}
          </td>
          <td className="generator-page__td">{g.name}</td>
          <td className="generator-page__td">{g.fuelType}</td>
          <td className="generator-page__td">{g.hasByProduct.toString()}</td>
          <td className="generator-page__td">
            {g.byProduct?.item.name ?? '-'}
          </td>
          <td className="generator-page__td">{g.powerOutput}</td>
          <td className="generator-page__td">{g.burnTime}</td>
          <td className="generator-page__td">
            {g.fuelItems.map((fi) => fi.item.name).join(', ')}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default GeneratorTable;
