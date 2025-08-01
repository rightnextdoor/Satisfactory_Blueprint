// src/components/planner/view/ViewPlanner.tsx

import React, { useState, useEffect } from 'react';
import type { PlannerDto } from '../../../types/planner';
import { plannerService } from '../../../services/plannerService';
import PlannerSettingsPanel from '../settings/PlannerSettingsPanel';
import SummarySection from './SummarySection';
import ResourceSection from './ResourceSection';
import RecipeSection from './RecipeSection';
import SpaceElevatorSection from './SpaceElevatorSection';
import WeaponsToolsSection from './WeaponsToolsSection';
import '../../../styles/planner/ViewPlanner.css';

interface ViewPlannerProps {
  plannerId: number | null;
  onDelete: () => void;
}

const ViewPlanner: React.FC<ViewPlannerProps> = ({ plannerId, onDelete }) => {
  const [planner, setPlanner] = useState<PlannerDto | null>(null);

  useEffect(() => {
    if (plannerId == null) {
      setPlanner(null);
      return;
    }
    plannerService
      .getById(plannerId)
      .then((data) => setPlanner(data))
      .catch((err) => {
        console.error('Failed to load planner', err);
        setPlanner(null);
      });
  }, [plannerId]);

  if (!planner) {
    return <div className="p-4">No plan selected.</div>;
  }

  return (
    <div className="planner-view">
      <PlannerSettingsPanel
        initialPlanner={planner}
        onDeleteSuccess={onDelete}
      />
      <SummarySection planner={planner} />
      <ResourceSection planner={planner} />
      <RecipeSection />
      <SpaceElevatorSection />
      <WeaponsToolsSection />
    </div>
  );
};

export default ViewPlanner;
