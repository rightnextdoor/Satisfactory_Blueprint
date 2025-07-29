// src/components/planner/form/GeneratorSearch.tsx
import React, { useState, useEffect } from 'react';
import { SearchAutocomplete } from '../../common/SearchAutocomplete';
import type { GeneratorDto } from '../../../types';
import { generatorService } from '../../../services/generatorService';
import '../../../styles/planner/PlannerForm.css';

interface GeneratorSearchProps {
  selected: GeneratorDto | null;
  onSelect: (gen: GeneratorDto) => void;
  error?: string;
}

const GeneratorSearch: React.FC<GeneratorSearchProps> = ({
  selected,
  onSelect,
  error,
}) => {
  const [allGens, setAllGens] = useState<GeneratorDto[]>([]);

  useEffect(() => {
    generatorService.listAll().then(setAllGens).catch(console.error);
  }, []);

  return (
    <div className="planner-form__section">
      <label className="planner-form__label">Generator (Fuel Type)</label>

      <SearchAutocomplete<GeneratorDto>
        key={selected?.id ?? 0}
        items={allGens}
        fields={['fuelType']}
        renderItem={(g) => g.fuelType}
        placeholder="Search by fuel type…"
        onFilter={() => {}}
        onSelect={onSelect}
        className={error ? 'border-red-500' : undefined}
      />
      {error && <div className="planner-form__error">{error}</div>}

      {selected && (
        <div className="planner-form__info-panel">
          <div>
            <strong>ID:</strong> {selected.id}
          </div>
          <div>
            <strong>Name:</strong> {selected.name}
          </div>
          <div>
            <strong>Fuel Type:</strong> {selected.fuelType}
          </div>
          <div>
            <strong>By-product:</strong> {selected.byProduct?.item.name || '—'}
          </div>
          <div>
            <strong>Power Output:</strong> {selected.powerOutput}
          </div>
          <div>
            <strong>Burn Time:</strong> {selected.burnTime}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratorSearch;
