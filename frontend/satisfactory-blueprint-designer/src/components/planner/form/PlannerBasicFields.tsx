// src/components/planner/form/PlannerBasicFields.tsx
import React from 'react';
import type { PlannerMode } from '../../../types/enums';
import '../../../styles/planner/PlannerForm.css';

interface PlannerBasicFieldsProps {
  name: string;
  mode: PlannerMode;
  modes: PlannerMode[];
  onNameChange: (v: string) => void;
  onModeChange: (v: PlannerMode) => void;
  error?: string;
}

const PlannerBasicFields: React.FC<PlannerBasicFieldsProps> = ({
  name,
  mode,
  modes,
  onNameChange,
  onModeChange,
  error,
}) => (
  <div className="planner-form__section">
    <label className="planner-form__label" htmlFor="planner-name">
      Name
    </label>
    <input
      id="planner-name"
      type="text"
      className="planner-form__input"
      value={name}
      onChange={(e) => onNameChange(e.target.value)}
    />
    {error && <div className="planner-form__error">{error}</div>}

    <label className="planner-form__label mt-4" htmlFor="planner-mode">
      Mode
    </label>
    <select
      id="planner-mode"
      className="planner-form__select"
      value={mode}
      onChange={(e) => onModeChange(e.target.value as PlannerMode)}
    >
      {modes.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>
  </div>
);

export default PlannerBasicFields;
