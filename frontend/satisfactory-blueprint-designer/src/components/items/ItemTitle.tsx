// src/components/items/ItemTitle.tsx
import React from 'react';

interface ItemTitleProps {
  title?: string;
}

const ItemTitle: React.FC<ItemTitleProps> = ({ title = 'Item Page' }) => (
  <header className="item-page__topbar">
    <h1 className="item-page__title">{title}</h1>
  </header>
);

export default ItemTitle;
