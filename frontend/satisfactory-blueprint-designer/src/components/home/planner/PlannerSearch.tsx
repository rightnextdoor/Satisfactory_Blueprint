// src/components/home/planner/PlannerSearch.tsx
import React from 'react';

interface PlannerSearchProps {
  query: string;
  onChange: (newQuery: string) => void;
  className?: string;
}

const PlannerSearch: React.FC<PlannerSearchProps> = ({
  query,
  onChange,
  className = '',
}) => (
  <input
    type="text"
    value={query}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Search planners…"
    className={className}
  />
);

export default PlannerSearch;
