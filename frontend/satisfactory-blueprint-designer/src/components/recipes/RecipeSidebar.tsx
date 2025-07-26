import React from 'react';

export type RecipeTab = 'view' | 'create' | 'update';

export interface RecipeSidebarProps {
  selected: RecipeTab;
  onSelect: (tab: RecipeTab) => void;
}

const RecipeSidebar: React.FC<RecipeSidebarProps> = ({
  selected,
  onSelect,
}) => (
  <aside className="recipe-page__sidebar">
    <div className="recipe-page__sidebar-title">Recipes</div>

    <button
      onClick={() => onSelect('view')}
      className={`recipe-page__tab ${
        selected === 'view' ? 'recipe-page__tab--active' : ''
      }`}
    >
      View
    </button>

    <button
      onClick={() => onSelect('create')}
      className={`recipe-page__tab ${
        selected === 'create' ? 'recipe-page__tab--active' : ''
      }`}
    >
      Create
    </button>

    <button
      onClick={() => onSelect('update')}
      className={`recipe-page__tab ${
        selected === 'update' ? 'recipe-page__tab--active' : ''
      }`}
    >
      Update
    </button>
  </aside>
);

export default RecipeSidebar;
