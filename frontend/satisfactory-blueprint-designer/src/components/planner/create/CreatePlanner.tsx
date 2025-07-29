/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/planner/create/CreatePlanner.tsx

import React, { useState } from 'react';
import type { PlannerDto, PlannerRequestDto } from '../../../types';
import PlannerForm from '../form/PlannerForm';
import { plannerService } from '../../../services/plannerService';
import type { PlannerMode, PlannerTargetType } from '../../../types/enums';

interface CreatePlannerProps {
  onDone: (plan: PlannerDto) => void;
  onCancel: () => void;
}

const CreatePlanner: React.FC<CreatePlannerProps> = ({ onDone, onCancel }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (dto: PlannerRequestDto) => {
    setIsSaving(true);
    try {
      const req: PlannerRequestDto = {
        // omit id on create
        name: dto.name,
        mode: dto.mode as PlannerMode,
        generator: dto.generator,
        targetType: dto.targetType as PlannerTargetType,
        targetAmount: dto.targetAmount ?? 0,
      };

      const created = await plannerService.create(req);
      onDone(created);
    } catch (error: any) {
      console.error('Create failed:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PlannerForm onSave={handleSave} onCancel={onCancel} isSaving={isSaving} />
  );
};

export default CreatePlanner;
