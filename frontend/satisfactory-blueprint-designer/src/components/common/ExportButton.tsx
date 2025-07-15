// src/components/common/ExportButton.tsx
import React from 'react';

const ExportButton: React.FC = () => (
  <button
    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
    onClick={() => {
      // fire a custom event that RecentPlanners will catch
      window.dispatchEvent(new CustomEvent('export-recent-planners'));
    }}
  >
    Export
  </button>
);

export default ExportButton;
