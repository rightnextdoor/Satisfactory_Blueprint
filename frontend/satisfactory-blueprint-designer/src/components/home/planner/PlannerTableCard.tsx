// src/components/home/planner/PlannerTableCard.tsx
import React from 'react';

interface PlannerTableCardProps {
  children: React.ReactNode;
  className?: string;
}

const PlannerTableCard: React.FC<PlannerTableCardProps> = ({
  children,
  className = '',
}) => <div className={`recent-planners__card ${className}`}>{children}</div>;

export default PlannerTableCard;
