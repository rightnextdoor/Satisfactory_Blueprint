// src/components/items/view/ItemTable.tsx
import React from 'react';
import type { ItemDto } from '../../../types';
import type { SortOrder } from '../../../hooks/useSort';

export interface ItemTableProps {
  items: ItemDto[];
  icons: Record<number, string>;
  selectedItemId: number | null;
  onSelect: (id: number) => void;
  sortField: string;
  sortOrder: SortOrder;
  onSort: (field: string) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({
  items,
  icons,
  selectedItemId,
  onSelect,
  sortField,
  sortOrder,
  onSort,
}) => (
  <table className="item-page__table">
    <thead className="item-page__thead">
      <tr>
        <th className="item-page__th text-center">Select</th>
        <th
          className="item-page__th cursor-pointer"
          onClick={() => onSort('id')}
        >
          # {sortField === 'id' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        <th className="item-page__th">Icon</th>
        <th
          className="item-page__th cursor-pointer"
          onClick={() => onSort('name')}
        >
          Name {sortField === 'name' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        <th
          className="item-page__th cursor-pointer"
          onClick={() => onSort('resource')}
        >
          Resource {sortField === 'resource' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
      </tr>
    </thead>
    <tbody>
      {items.map((item, idx) => (
        <tr
          key={item.id}
          className={
            idx % 2 === 0 ? 'item-page__row--even' : 'item-page__row--odd'
          }
        >
          <td className="item-page__td text-center">
            <input
              type="radio"
              name="selectedItem"
              value={item.id}
              checked={selectedItemId === item.id}
              onChange={() => onSelect(item.id)}
            />
          </td>
          <td className="item-page__td">{idx + 1}</td>
          <td className="item-page__td">
            {icons[item.id] && (
              <img
                src={icons[item.id]}
                alt={item.name}
                className="w-6 h-6 object-contain"
              />
            )}
          </td>
          <td className="item-page__td">{item.name}</td>
          <td className="item-page__td">{String(item.resource)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ItemTable;
