// src/components/generators/GeneratorSidebar.tsx
import React from 'react';

export type GeneratorTab = 'view' | 'create' | 'update';

export interface GeneratorSidebarProps {
  selected: GeneratorTab;
  onSelect: (tab: GeneratorTab) => void;
}

const GeneratorSidebar: React.FC<GeneratorSidebarProps> = ({
  selected,
  onSelect,
}) => (
  <aside className="generator-page__sidebar">
    <div className="generator-page__sidebar-title">Generators</div>

    <button
      onClick={() => onSelect('view')}
      className={`generator-page__tab ${
        selected === 'view' ? 'generator-page__tab--active' : ''
      }`}
    >
      View
    </button>

    <button
      onClick={() => onSelect('create')}
      className={`generator-page__tab ${
        selected === 'create' ? 'generator-page__tab--active' : ''
      }`}
    >
      Create
    </button>

    <button
      onClick={() => onSelect('update')}
      className={`generator-page__tab ${
        selected === 'update' ? 'generator-page__tab--active' : ''
      }`}
    >
      Update
    </button>
  </aside>
);

export default GeneratorSidebar;
