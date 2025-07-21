import React from 'react';

export type BuildingTab = 'view' | 'create' | 'update';

export interface BuildingSidebarProps {
  selected: BuildingTab;
  onSelect: (tab: BuildingTab) => void;
}

const BuildingSidebar: React.FC<BuildingSidebarProps> = ({
  selected,
  onSelect,
}) => (
  <aside className="building-page__sidebar">
    <div className="building-page__sidebar-title">Buildings</div>

    <button
      onClick={() => onSelect('view')}
      className={`building-page__tab ${
        selected === 'view' ? 'building-page__tab--active' : ''
      }`}
    >
      View
    </button>

    <button
      onClick={() => onSelect('create')}
      className={`building-page__tab ${
        selected === 'create' ? 'building-page__tab--active' : ''
      }`}
    >
      Create
    </button>

    <button
      onClick={() => onSelect('update')}
      className={`building-page__tab ${
        selected === 'update' ? 'building-page__tab--active' : ''
      }`}
    >
      Update
    </button>
  </aside>
);

export default BuildingSidebar;
