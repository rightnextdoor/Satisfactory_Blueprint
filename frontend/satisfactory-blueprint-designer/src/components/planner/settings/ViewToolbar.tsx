// src/components/planner/view/ViewToolbar.tsx
import React from 'react';

interface ViewToolbarProps {
  onDelete: () => void;
}

const ViewToolbar: React.FC<ViewToolbarProps> = ({ onDelete }) => (
  <div className="planner-view__toolbar p-4 border-b flex justify-end">
    <button
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      onClick={onDelete}
    >
      Delete Planner
    </button>
  </div>
);

export default ViewToolbar;
