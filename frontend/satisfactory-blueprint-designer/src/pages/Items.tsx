// src/pages/Items.tsx
import React, { useState, useEffect } from 'react';
import ItemSidebar from '../components/items/ItemSidebar';
import type { ItemTab } from '../components/items/ItemSidebar';
import ItemTitle from '../components/items/ItemTitle';
import ViewItems from '../components/items/view/ViewItems';
import CreateItem from '../components/items/create/CreateItem';
import UpdateItem from '../components/items/update/UpdateItem';

const Items: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<ItemTab>('view');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Log when entering update tab
  useEffect(() => {
    if (selectedTab === 'update') {
      console.log('Update tab selected. Item ID:', selectedItemId);
    }
  }, [selectedTab, selectedItemId]);

  // Helper to build pane classes
  const paneClasses = (tab: ItemTab) =>
    `absolute inset-0 overflow-y-auto p-6 ${
      selectedTab === tab ? 'visible' : 'invisible pointer-events-none'
    }`;

  // Called after create or update to refresh list and go back to view
  const handleDone = () => {
    setSelectedTab('view');
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="item-page">
      <ItemSidebar selected={selectedTab} onSelect={setSelectedTab} />

      <div className="flex-1 flex flex-col">
        <ItemTitle />

        <main className="item-page__content">
          <div className={paneClasses('view')}>
            <ViewItems
              selectedItemId={selectedItemId}
              onSelect={setSelectedItemId}
              refreshKey={refreshKey}
            />
          </div>

          {selectedTab === 'create' && (
            <div className={paneClasses('create')}>
              <CreateItem onDone={handleDone} />
            </div>
          )}

          <div className={paneClasses('update')}>
            <UpdateItem itemId={selectedItemId} onDone={handleDone} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Items;
