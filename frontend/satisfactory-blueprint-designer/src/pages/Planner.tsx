// src/pages/Planner.tsx

import React, { useState, useCallback } from 'react';
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
  const [selectedTab, setSelectedTab] = useState<PlannerTab>('list');
  const [currentPlan, setCurrentPlan] = useState<PlannerDto | null>(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);

  const handleAdd = useCallback(() => setAddModalOpen(true), []);
  const handleRemove = useCallback(() => setRemoveModalOpen(true), []);
  const closeAdd = useCallback(() => setAddModalOpen(false), []);
  const closeRemove = useCallback(() => setRemoveModalOpen(false), []);

  const paneClasses = (tab: PlannerTab) =>
    `absolute inset-0 overflow-y-auto p-6 ${
      selectedTab === tab ? 'visible' : 'invisible pointer-events-none'
    }`;

  const handleListSelect = (plan: PlannerDto) => {
    setCurrentPlan(plan);
  };

  const handleCreateDone = (plan: PlannerDto) => {
    setCurrentPlan(plan);
    setSelectedTab('view');
  };

  const handleCreateCancel = () => {
    setSelectedTab('list');
  };

  // newly added: clear selection & switch back to list on delete
  const handleDeletePlanner = useCallback(() => {
    setSelectedTab('list');
    setCurrentPlan(null);
  }, []);

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
            <ViewPlanner planner={currentPlan} onDelete={handleDeletePlanner} />
          </div>
        </main>
      </div>

      <AddRecipeModal isOpen={isAddModalOpen} onClose={closeAdd} />
      <RemoveRecipeModal isOpen={isRemoveModalOpen} onClose={closeRemove} />
    </div>
  );
};

export default Planner;
