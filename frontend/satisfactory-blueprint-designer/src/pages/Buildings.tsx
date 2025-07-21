// src/pages/Buildings.tsx
import React, { useState, useCallback } from 'react';
import BuildingSidebar from '../components/buildings/BuildingSidebar';
import type { BuildingTab } from '../components/buildings/BuildingSidebar';
import ViewBuildings from '../components/buildings/view/ViewBuildings';
import CreateBuilding from '../components/buildings/create/CreateBuilding';
import UpdateBuilding from '../components/buildings/update/UpdateBuilding';
import '../styles/building/Building.css';

const Buildings: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<BuildingTab>('view');
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState(0);

  // after creating or updating, go back to view and refresh list
  const handleDone = useCallback(() => {
    setSelectedTab('view');
    setRefreshKey((k) => k + 1);
  }, []);

  // same pattern as Items: always mount each pane, hide/show via CSS
  const paneClasses = (tab: BuildingTab) =>
    `absolute inset-0 overflow-y-auto p-6 ${
      selectedTab === tab ? 'visible' : 'invisible pointer-events-none'
    }`;

  return (
    <div className="building-page">
      <BuildingSidebar selected={selectedTab} onSelect={setSelectedTab} />

      <div className="flex-1 flex flex-col">
        <div className="building-page__topbar">
          <h1 className="building-page__title">Buildings</h1>
        </div>

        <main className="building-page__content">
          {/* View pane: always mounted so search state persists */}
          <div className={paneClasses('view')}>
            <ViewBuildings
              selectedBuildingId={selectedBuildingId}
              onSelect={setSelectedBuildingId}
              refreshKey={refreshKey}
            />
          </div>

          {/* Create pane: only mounted on create */}
          {selectedTab === 'create' && (
            <div className={paneClasses('create')}>
              <CreateBuilding onDone={handleDone} />
            </div>
          )}

          {/* Update pane: always mounted so you can cancel back to view without losing state */}
          <div className={paneClasses('update')}>
            <UpdateBuilding
              buildingId={selectedBuildingId}
              onDone={handleDone}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Buildings;
