// src/components/recipes/view/RecipeTable.tsx

import React from 'react';
import type { RecipeDto } from '../../../types/recipe';
import type { SortOrder } from '../../../hooks/useSort';

export interface RecipeTableProps {
  recipes: RecipeDto[];
  icons: Record<string, string>; // map e.g. `${recipe.id}-out` → URL
  selectedRecipeId: number | null;
  onSelect: (id: number) => void;
  sortField: string;
  sortOrder: SortOrder;
  onSort: (field: string) => void;
}

const RecipeTable: React.FC<RecipeTableProps> = ({
  recipes,
  icons,
  selectedRecipeId,
  onSelect,
  sortField,
  sortOrder,
  onSort,
}) => (
  <table className="recipe-page__table">
    <thead className="recipe-page__thead">
      <tr>
        {/* Sticky select column */}
        <th className="recipe-page__th recipe-page__th--sticky text-center">
          Select
        </th>
        {/* Sticky index column */}
        <th
          className="recipe-page__th recipe-page__th--sticky cursor-pointer text-center"
          onClick={() => onSort('id')}
        >
          # {sortField === 'id' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        {/* Icon */}
        <th className="recipe-page__th text-center">Icon</th>
        {/* Alternate */}
        <th
          className="recipe-page__th cursor-pointer"
          onClick={() => onSort('alternate')}
        >
          Alternate {sortField === 'alternate' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        {/* Item To Build */}
        <th
          className="recipe-page__th cursor-pointer"
          onClick={() => onSort('outputName')}
        >
          Item To Build{' '}
          {sortField === 'outputName' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        {/* Item To Build Amount */}
        <th
          className="recipe-page__th cursor-pointer"
          onClick={() => onSort('itemToBuild.amount')}
        >
          Item To Build Amount{' '}
          {sortField === 'itemToBuild.amount' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        {/* By Product */}
        <th className="recipe-page__th">By Product</th>
        {/* By Product Item */}
        <th className="recipe-page__th">By Product Item</th>
        {/* By Product Amount */}
        <th className="recipe-page__th">By Product Amount</th>
        {/* Ingredients 1-4 */}
        {[0, 1, 2, 3].map((i) => (
          <React.Fragment key={i}>
            <th className="recipe-page__th">Item {i + 1}</th>
            <th className="recipe-page__th">Item {i + 1} Amount</th>
          </React.Fragment>
        ))}
        {/* Space Elevator */}
        <th className="recipe-page__th">Space Elevator</th>
        {/* Fuel */}
        <th className="recipe-page__th">Fuel</th>
        {/* Weapon or Tool */}
        <th className="recipe-page__th">Weapon or Tool</th>
        {/* Tier */}
        <th
          className="recipe-page__th cursor-pointer"
          onClick={() => onSort('tier')}
        >
          Tier {sortField === 'tier' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
        {/* Building Image */}
        <th className="recipe-page__th text-center">Building Image</th>
        {/* Building Type */}
        <th
          className="recipe-page__th cursor-pointer"
          onClick={() => onSort('building')}
        >
          Building Type{' '}
          {sortField === 'building' && (sortOrder === 1 ? '▲' : '▼')}
        </th>
      </tr>
    </thead>

    <tbody>
      {recipes.map((r, idx) => (
        <tr
          key={r.id}
          className={
            idx % 2 === 0 ? 'recipe-page__row--even' : 'recipe-page__row--odd'
          }
        >
          {/* Select */}
          <td className="recipe-page__td recipe-page__td--sticky text-center">
            <input
              type="radio"
              name="selectedRecipe"
              value={r.id}
              checked={selectedRecipeId === r.id}
              onChange={() => onSelect(r.id)}
            />
          </td>
          {/* Index */}
          <td className="recipe-page__td recipe-page__td--sticky text-center">
            {idx + 1}
          </td>
          {/* Icon */}
          <td className="recipe-page__td text-center">
            {icons[`${r.id}-out`] && (
              <img
                src={icons[`${r.id}-out`]}
                alt={r.itemToBuild.item.name}
                className="recipe-page__img"
              />
            )}
          </td>
          {/* Alternate */}
          <td className="recipe-page__td">{r.alternate ? '✔' : ''}</td>
          {/* Item To Build */}
          <td className="recipe-page__td">{r.itemToBuild.item.name}</td>
          {/* Item To Build Amount */}
          <td className="recipe-page__td">{r.itemToBuild.amount}</td>
          {/* By Product */}
          <td className="recipe-page__td">{r.hasByProduct ? '✔' : ''}</td>
          {/* By Product Item */}
          <td className="recipe-page__td">{r.byProduct?.item.name || ''}</td>
          {/* By Product Amount */}
          <td className="recipe-page__td">{r.byProduct?.amount ?? ''}</td>
          {/* Ingredients 1-4 */}
          {[0, 1, 2, 3].map((i) => {
            const ing = r.items[i];
            return (
              <React.Fragment key={i}>
                <td className="recipe-page__td">{ing?.item.name || ''}</td>
                <td className="recipe-page__td">{ing?.amount || ''}</td>
              </React.Fragment>
            );
          })}
          {/* Space Elevator */}
          <td className="recipe-page__td">{r.spaceElevator ? '✔' : ''}</td>
          {/* Fuel */}
          <td className="recipe-page__td">{r.fuel ? '✔' : ''}</td>
          {/* Weapon or Tool */}
          <td className="recipe-page__td">{r.weaponOrTool ? '✔' : ''}</td>
          {/* Tier */}
          <td className="recipe-page__td">{r.tier}</td>
          {/* Building Image */}
          <td className="recipe-page__td text-center">
            {icons[`${r.id}-bld`] && (
              <img
                src={icons[`${r.id}-bld`]}
                alt={r.building}
                className="recipe-page__img"
              />
            )}
          </td>
          {/* Building Type */}
          <td className="recipe-page__td">{r.building}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default RecipeTable;
