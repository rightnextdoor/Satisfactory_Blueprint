// src/pages/Planner.tsx

import React, { useState, useEffect, useCallback } from 'react';
import PlannerSidebar, {
  type PlannerTab,
} from '../components/planner/PlannerSidebar';
import ListPlanner from '../components/planner/list/ListPlanner';
import CreatePlanner from '../components/planner/create/CreatePlanner';
import ViewPlanner from '../components/planner/view/ViewPlanner';
import AddRecipeModal from '../components/planner/modals/AddRecipeModal';
import RemoveRecipeModal from '../components/planner/modals/RemoveRecipeModal';
import type { PlannerDto } from '../types';
import '../styles/planner/Planner.css';

const Planner: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<PlannerTab>(() => {
    return (localStorage.getItem('plannerMode') as PlannerTab) ?? 'list';
  });

  const [plannerId, setPlannerId] = useState<number | null>(() => {
    const stored = localStorage.getItem('plannerId');
    return stored ? Number(stored) : null;
  });

  // Persist tab mode
  useEffect(() => {
    localStorage.setItem('plannerMode', selectedTab);
  }, [selectedTab]);

  // Persist planner ID
  useEffect(() => {
    if (plannerId != null) {
      localStorage.setItem('plannerId', plannerId.toString());
    } else {
      localStorage.removeItem('plannerId');
    }
  }, [plannerId]);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);

  const handleAdd = useCallback(() => setAddModalOpen(true), []);
  const handleRemove = useCallback(() => setRemoveModalOpen(true), []);
  const closeAdd = useCallback(() => setAddModalOpen(false), []);
  const closeRemove = useCallback(() => setRemoveModalOpen(false), []);

  // Only set plannerId—do NOT switch tabs here
  const handleListSelect = useCallback((plan: PlannerDto) => {
    setPlannerId(plan.id!);
  }, []);

  const handleCreateDone = useCallback((plan: PlannerDto) => {
    setPlannerId(plan.id!);
    setSelectedTab('view');
  }, []);

  const handleCreateCancel = useCallback(() => {
    setSelectedTab('list');
  }, []);

  const handleDeletePlanner = useCallback(() => {
    setPlannerId(null);
    setSelectedTab('list');
  }, []);

  const paneClasses = (tab: PlannerTab) =>
    `absolute inset-0 overflow-y-auto p-6 ${
      selectedTab === tab ? 'visible' : 'invisible pointer-events-none'
    }`;

  return (
    <div className="planner-page">
      <PlannerSidebar
        selected={selectedTab}
        onSelect={setSelectedTab}
        onAddRecipe={handleAdd}
        onRemoveRecipe={handleRemove}
      />

      <div className="flex-1 flex flex-col">
        <div className="planner-page__topbar">
          <h1 className="planner-page__title">Planner</h1>
        </div>

        <main className="planner-page__content">
          <div className={paneClasses('list')}>
            <ListPlanner
              onSelect={handleListSelect}
              active={selectedTab === 'list'}
            />
          </div>

          <div className={paneClasses('create')}>
            <CreatePlanner
              onDone={handleCreateDone}
              onCancel={handleCreateCancel}
            />
          </div>

          <div className={paneClasses('view')}>
            <ViewPlanner plannerId={plannerId} onDelete={handleDeletePlanner} />
          </div>
        </main>
      </div>

      <AddRecipeModal isOpen={isAddModalOpen} onClose={closeAdd} />
      <RemoveRecipeModal isOpen={isRemoveModalOpen} onClose={closeRemove} />
    </div>
  );
};

export default Planner;
