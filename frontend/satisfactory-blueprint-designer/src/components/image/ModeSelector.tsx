// src/components/image/ModeSelector.tsx
import React from 'react';

interface ModeSelectorProps {
  mode: 'upload' | 'existing';
  onChange: (mode: 'upload' | 'existing') => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onChange }) => (
  <div className="flex items-center space-x-4">
    <label className="inline-flex items-center space-x-1">
      <input
        type="radio"
        name="iconMode"
        value="upload"
        checked={mode === 'upload'}
        onChange={() => onChange('upload')}
      />
      <span>Upload New</span>
    </label>
    <label className="inline-flex items-center space-x-1">
      <input
        type="radio"
        name="iconMode"
        value="existing"
        checked={mode === 'existing'}
        onChange={() => onChange('existing')}
      />
      <span>Use Existing</span>
    </label>
  </div>
);

export default ModeSelector;
