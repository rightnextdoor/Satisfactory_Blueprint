/* src/components/planner/PlannerSidebar.tsx */
import React from 'react';

export type PlannerTab = 'list' | 'create' | 'view';

export interface PlannerSidebarProps {
  selected: PlannerTab;
  onSelect: (tab: PlannerTab) => void;
  onAddRecipe: () => void;
  onRemoveRecipe: () => void;
}

const PlannerSidebar: React.FC<PlannerSidebarProps> = ({
  selected,
  onSelect,
  onAddRecipe,
  onRemoveRecipe,
}) => (
  <aside className="planner-page__sidebar">
    <div className="planner-page__sidebar-title">Planner</div>

    <button
      onClick={() => onSelect('list')}
      className={`planner-page__tab ${
        selected === 'list' ? 'planner-page__tab--active' : ''
      }`}
    >
      List
    </button>

    <button
      onClick={() => onSelect('create')}
      className={`planner-page__tab ${
        selected === 'create' ? 'planner-page__tab--active' : ''
      }`}
    >
      Create
    </button>

    <button
      onClick={() => onSelect('view')}
      className={`planner-page__tab ${
        selected === 'view' ? 'planner-page__tab--active' : ''
      }`}
    >
      View
    </button>

    {selected === 'view' && (
      <div className="planner-page__view-actions">
        <button onClick={onAddRecipe} className="planner-page__tab">
          Add Recipe
        </button>
        <button onClick={onRemoveRecipe} className="planner-page__tab mt-2">
          Remove Recipe
        </button>
      </div>
    )}
  </aside>
);

export default PlannerSidebar;
