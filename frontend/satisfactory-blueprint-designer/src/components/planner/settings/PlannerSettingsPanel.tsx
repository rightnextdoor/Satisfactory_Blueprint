/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/planner/settings/PlannerSettingsPanel.tsx

import React, { useState, useEffect, useRef } from 'react';
import type { PlannerDto, PlannerRequestDto } from '../../../types/planner';
import type { PlannerMode, PlannerTargetType } from '../../../types/enums';
import { plannerService } from '../../../services/plannerService';
import ViewHeader from './ViewHeader';
import GeneratorSection from '../view/GeneratorSection';
import Button from '../../common/Button';
import '../../../styles/planner/ViewPlanner.css';

interface PlannerSettingsPanelProps {
  initialPlanner: PlannerDto;
  onDeleteSuccess: () => void;
}

const PlannerSettingsPanel: React.FC<PlannerSettingsPanelProps> = ({
  initialPlanner,
  onDeleteSuccess,
}) => {
  const [planner, setPlanner] = useState<PlannerDto>(initialPlanner);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPlanner(initialPlanner);
    setErrorSummary(null);
    setFieldErrors({});
  }, [initialPlanner]);

  async function updateSettings(patch: Partial<PlannerRequestDto>) {
    setErrorSummary(null);
    setFieldErrors({});

    // Compute final values for all required fields
    const finalId = planner.id!;
    const finalName = patch.name ?? planner.name;
    const finalMode = planner.mode as PlannerMode;
    const finalGenerator = patch.generator ?? planner.generator!;
    const finalTargetType =
      patch.targetType ?? (planner.targetType as PlannerTargetType);
    const finalTargetAmount = patch.targetAmount ?? planner.targetAmount!;

    const payload: PlannerRequestDto = {
      id: finalId,
      name: finalName,
      mode: finalMode,
      generator: finalGenerator,
      targetType: finalTargetType,
      targetAmount: finalTargetAmount,
    };

    try {
      const updated = await plannerService.updateSettings(payload);
      setPlanner(updated);
    } catch (err: any) {
      const message = err.response?.data?.message ?? err.message;
      setErrorSummary(message);
      if (err.response?.data?.fieldErrors) {
        setFieldErrors(err.response.data.fieldErrors);
      }
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const confirmDelete = () => setDeleteModalOpen(true);

  async function handleDelete() {
    setErrorSummary(null);
    setFieldErrors({});
    setIsDeleting(true);

    try {
      await plannerService.deletePlanner(planner.id!);
      setDeleteModalOpen(false);
      onDeleteSuccess();
    } catch (err: any) {
      const message = err.response?.data?.message ?? err.message;
      setErrorSummary(message);
      if (err.response?.data?.fieldErrors) {
        setFieldErrors(err.response.data.fieldErrors);
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="planner-view" ref={formRef}>
      {errorSummary && (
        <div className="planner-form__error-summary mb-4">{errorSummary}</div>
      )}

      {/* Header + Delete Button */}
      <div className="planner-view__header-row mb-6">
        <div className="planner-view__toolbar">
          <Button
            variant="secondary"
            className="bg-red-600 hover:bg-red-700"
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
        <ViewHeader
          name={planner.name}
          onChange={(name) => setPlanner({ ...planner, name })}
          onSave={() => updateSettings({ name: planner.name })}
          error={fieldErrors.name}
        />
      </div>

      {/* ONLY show generator settings when in FUEL mode */}
      {planner.mode === 'FUEL' && (
        <GeneratorSection
          planner={planner}
          onUpdate={updateSettings}
          fieldErrors={fieldErrors}
        />
      )}

      {/* Confirm Delete Modal */}
      {isDeleteModalOpen && (
        <div className="planner-modal-overlay">
          <div className="planner-modal-content">
            <h3 className="text-xl font-semibold mb-4">Delete this planner?</h3>
            <p className="mb-6">
              Are you sure you want to delete “{planner.name}”? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="secondary"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlannerSettingsPanel;
