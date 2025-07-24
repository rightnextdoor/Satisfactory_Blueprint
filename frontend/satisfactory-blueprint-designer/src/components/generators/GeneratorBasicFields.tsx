// src/components/generators/GeneratorBasicFields.tsx
import React from 'react';
import '../../styles/generator/GeneratorForm.css';
import { GeneratorTypes, FuelTypes } from '../../types/enums';
import type { GeneratorType, FuelType } from '../../types/enums';

export interface GeneratorBasicFieldsProps {
  /** Generator type enum value */
  type: GeneratorType;
  onTypeChange: (type: GeneratorType) => void;
  /** Fuel type enum value */
  fuelType: FuelType;
  onFuelTypeChange: (fuelType: FuelType) => void;
  /** Power output as string (number input) */
  powerOutput: string;
  onPowerOutputChange: (value: string) => void;
  /** Burn time as string (number input) */
  burnTime: string;
  onBurnTimeChange: (value: string) => void;
}

/**
 * Renders the basic generator fields:
 * - Generator Type dropdown
 * - Fuel Type dropdown
 * - Power Output input
 * - Burn Time input
 */
const GeneratorBasicFields: React.FC<GeneratorBasicFieldsProps> = ({
  type,
  onTypeChange,
  fuelType,
  onFuelTypeChange,
  powerOutput,
  onPowerOutputChange,
  burnTime,
  onBurnTimeChange,
}) => (
  <div className="generator-form__group space-y-6">
    {/* Generator Type */}
    <div>
      <label className="generator-form__label" htmlFor="gen-type">
        Generator Type
      </label>
      <select
        id="gen-type"
        className="generator-form__select"
        value={type}
        onChange={(e) => onTypeChange(e.target.value as GeneratorType)}
      >
        {GeneratorTypes.map((t) => (
          <option key={t} value={t}>
            {t.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
    </div>

    {/* Fuel Type */}
    <div>
      <label className="generator-form__label" htmlFor="fuel-type">
        Fuel Type
      </label>
      <select
        id="fuel-type"
        className="generator-form__select"
        value={fuelType}
        onChange={(e) => onFuelTypeChange(e.target.value as FuelType)}
      >
        {FuelTypes.map((f) => (
          <option key={f} value={f}>
            {f.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
    </div>

    {/* Power Output */}
    <div>
      <label className="generator-form__label" htmlFor="power-output">
        Power Output
      </label>
      <input
        id="power-output"
        type="number"
        min="0"
        className="generator-form__input"
        value={powerOutput}
        onChange={(e) => onPowerOutputChange(e.target.value)}
      />
    </div>

    {/* Burn Time */}
    <div>
      <label className="generator-form__label" htmlFor="burn-time">
        Burn Time
      </label>
      <input
        id="burn-time"
        type="number"
        min="0"
        className="generator-form__input"
        value={burnTime}
        onChange={(e) => onBurnTimeChange(e.target.value)}
      />
    </div>
  </div>
);

export default GeneratorBasicFields;
