// src/components/planner/view/SummarySection.tsx

import React from 'react';
import type { PlannerDto } from '../../../types/planner';
import '../../../styles/planner/SummarySection.css';

interface SummarySectionProps {
  planner: PlannerDto;
}

const SummarySection: React.FC<SummarySectionProps> = ({ planner }) => {
  return (
    <div className="summary-section">
      <h2 className="summary-section__header">Summary</h2>
      <div className="summary-section__grid">
        <div className="summary-section__label">Total Power Consumption:</div>
        <div className="summary-section__value">
          {planner.totalPowerConsumption}
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
