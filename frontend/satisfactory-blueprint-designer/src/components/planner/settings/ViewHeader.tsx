// src/components/planner/view/ViewHeader.tsx

import React, { type KeyboardEvent } from 'react';

interface ViewHeaderProps {
  name: string;
  onChange: (newName: string) => void;
  onSave: () => void;
  error?: string;
}

const ViewHeader: React.FC<ViewHeaderProps> = ({
  name,
  onChange,
  onSave,
  error,
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSave();
    }
  };

  return (
    <div className="planner-view__header p-4 border-b">
      <input
        type="text"
        value={name}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSave}
        onKeyDown={handleKeyDown}
        className={`text-3xl font-bold bg-transparent w-full border-b-2 focus:outline-none ${
          error ? 'border-red-500' : 'border-transparent focus:border-blue-500'
        }`}
      />
      {error && <p className="text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default ViewHeader;
