import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/planner/ViewPlanner.css';

interface OverclockControlProps {
  /** The current overclock percent from backend */
  value: number;
  /** Called when user commits a new percent */
  onCommit: (newValue: number) => void;
  /** Disable interactions if true */
  disabled?: boolean;
  /** Additional CSS class to override layout */
  className?: string;
}

export const OverclockControl: React.FC<OverclockControlProps> = ({
  value,
  onCommit,
  disabled = false,
  className = '',
}) => {
  // Manual input state for one-time entries
  const [inputValue, setInputValue] = useState<string>('');

  // Clear input when backend value changes
  useEffect(() => {
    setInputValue('');
  }, [value]);

  // Clamp helper
  const parseClamp = (str: string): number => {
    const n = parseFloat(str);
    if (isNaN(n)) return value;
    return Math.min(250, Math.max(1, n));
  };

  // Commit manual input on blur or Enter
  const commitInput = useCallback(() => {
    if (!inputValue) return;
    const clamped = parseClamp(inputValue);
    if (clamped !== value) {
      console.log('OverclockControl: commit input', clamped);
      onCommit(clamped);
    }
    setInputValue('');
  }, [inputValue, onCommit, value]);

  return (
    <div className={`overclock-control ${className}`.trim()}>
      {/* One-time entry input */}
      <input
        type="text"
        className="overclock-control__input"
        placeholder={'1 - 250%'}
        value={inputValue}
        disabled={disabled}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={commitInput}
        onKeyDown={(e) => e.key === 'Enter' && commitInput()}
        inputMode="decimal"
        pattern="^\d+(?:\.\d{1,4})?$"
        title="Enter a number between 1 and 250"
      />

      {/* Display area (always-visible backend value) */}
      <div className="overclock-control__display">{value}%</div>
    </div>
  );
};
