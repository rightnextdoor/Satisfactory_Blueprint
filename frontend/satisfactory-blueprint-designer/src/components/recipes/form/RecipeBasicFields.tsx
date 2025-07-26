// src/components/recipes/form/RecipeBasicFields.tsx

import React from 'react';

export interface RecipeBasicFieldsProps {
  alternate: boolean;
  spaceElevator: boolean;
  fuel: boolean;
  weaponOrTool: boolean;
  tier: string;
  onChangeAlternate: (v: boolean) => void;
  onChangeSpaceElevator: (v: boolean) => void;
  onChangeFuel: (v: boolean) => void;
  onChangeWeaponOrTool: (v: boolean) => void;
  onChangeTier: (v: string) => void;
  /** Optional inline error for tier */
  error?: string;
}

const RecipeBasicFields: React.FC<RecipeBasicFieldsProps> = ({
  alternate,
  spaceElevator,
  fuel,
  weaponOrTool,
  tier,
  onChangeAlternate,
  onChangeSpaceElevator,
  onChangeFuel,
  onChangeWeaponOrTool,
  onChangeTier,
  error,
}) => (
  <div className="recipe-form__section">
    <h2 className="recipe-form__section-header">Recipe Settings</h2>

    <div className="recipe-form__group">
      {/* Alternate */}
      <div>
        <label className="recipe-form__label">Alternate</label>
        <input
          type="checkbox"
          checked={alternate}
          onChange={(e) => onChangeAlternate(e.target.checked)}
        />
      </div>

      {/* Space elevator */}
      <div>
        <label className="recipe-form__label">Space elevator</label>
        <input
          type="checkbox"
          checked={spaceElevator}
          onChange={(e) => onChangeSpaceElevator(e.target.checked)}
        />
      </div>

      {/* Fuel */}
      <div>
        <label className="recipe-form__label">Fuel</label>
        <input
          type="checkbox"
          checked={fuel}
          onChange={(e) => onChangeFuel(e.target.checked)}
        />
      </div>

      {/* Weapon/Tool */}
      <div>
        <label className="recipe-form__label">Weapon/Tool</label>
        <input
          type="checkbox"
          checked={weaponOrTool}
          onChange={(e) => onChangeWeaponOrTool(e.target.checked)}
        />
      </div>

      {/* Tier */}
      <div>
        <label className="recipe-form__label">Tier</label>
        <input
          type="number"
          className={`recipe-form__input ${error ? 'border-red-500' : ''}`}
          value={tier}
          placeholder=""
          onChange={(e) => onChangeTier(e.target.value)}
          min="1"
        />
        {error && (
          <div className="text-red-600 text-sm mt-1">
            {error.startsWith('Tier') ? error : 'Tier must be a number ≥ 1.'}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default RecipeBasicFields;
