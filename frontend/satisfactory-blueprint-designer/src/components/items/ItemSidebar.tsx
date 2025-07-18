// src/components/items/ItemSidebar.tsx
import React from 'react';

export type ItemTab = 'view' | 'create' | 'update';

export interface ItemSidebarProps {
  selected: ItemTab;
  onSelect: (tab: ItemTab) => void;
}

const ItemSidebar: React.FC<ItemSidebarProps> = ({ selected, onSelect }) => (
  <aside className="item-page__sidebar">
    <div className="item-page__sidebar-title">Items</div>

    <button
      onClick={() => onSelect('view')}
      className={`item-page__tab ${
        selected === 'view' ? 'item-page__tab--active' : ''
      }`}
    >
      View
    </button>

    <button
      onClick={() => onSelect('create')}
      className={`item-page__tab ${
        selected === 'create' ? 'item-page__tab--active' : ''
      }`}
    >
      Create
    </button>

    <button
      onClick={() => onSelect('update')}
      className={`item-page__tab ${
        selected === 'update' ? 'item-page__tab--active' : ''
      }`}
    >
      Update
    </button>
  </aside>
);

export default ItemSidebar;
