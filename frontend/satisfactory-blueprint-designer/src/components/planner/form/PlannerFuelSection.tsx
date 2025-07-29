// src/components/planner/form/PlannerFuelSection.tsx
import React from 'react';
import type { PlannerTargetType } from '../../../types/enums';
import { PlannerTargetTypes } from '../../../types/enums';
import '../../../styles/planner/PlannerForm.css';

interface PlannerFuelSectionProps {
  targetType: PlannerTargetType;
  amount?: number;
  onTargetTypeChange: (t: PlannerTargetType) => void;
  onAmountChange: (n: number) => void;
  error?: string;
}

const PlannerFuelSection: React.FC<PlannerFuelSectionProps> = ({
  targetType,
  amount,
  onTargetTypeChange,
  onAmountChange,
  error,
}) => (
  <div className="planner-form__section">
    <label className="planner-form__label" htmlFor="planner-target-type">
      Target Type
    </label>
    <select
      id="planner-target-type"
      className="planner-form__select"
      value={targetType}
      onChange={(e) => onTargetTypeChange(e.target.value as PlannerTargetType)}
    >
      {PlannerTargetTypes.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>

    <label className="planner-form__label mt-4" htmlFor="planner-amount">
      Amount
    </label>
    <input
      id="planner-amount"
      type="number"
      className="planner-form__input"
      value={amount ?? ''}
      onChange={(e) => onAmountChange(Number(e.target.value))}
    />
    {error && <div className="planner-form__error">{error}</div>}
  </div>
);

export default PlannerFuelSection;
