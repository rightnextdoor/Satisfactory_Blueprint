// src/components/planner/view/ViewPlanner.tsx

import React from 'react';
import type { PlannerDto } from '../../../types/planner';
import PlannerSettingsPanel from '../settings/PlannerSettingsPanel';
import ResourceSection from './ResourceSection';
import RecipeSection from './RecipeSection';
import SpaceElevatorSection from './SpaceElevatorSection';
import WeaponsToolsSection from './WeaponsToolsSection';
import '../../../styles/planner/ViewPlanner.css';

interface ViewPlannerProps {
  planner: PlannerDto | null;
  onDelete: () => void;
}

const ViewPlanner: React.FC<ViewPlannerProps> = ({ planner, onDelete }) => {
  if (!planner) {
    return <div className="p-4">No plan selected.</div>;
  }

  return (
    <div className="planner-view">
      <PlannerSettingsPanel
        initialPlanner={planner}
        onDeleteSuccess={onDelete}
      />

      <ResourceSection />
      <RecipeSection />
      <SpaceElevatorSection />
      <WeaponsToolsSection />
    </div>
  );
};

export default ViewPlanner;
