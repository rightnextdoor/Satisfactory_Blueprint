// src/components/planner/view/GeneratorSection.tsx

import React, { useState, useEffect, type KeyboardEvent } from 'react';
import type { PlannerDto } from '../../../types';
import type { PlannerRequestDto } from '../../../types/planner';
import { generatorService } from '../../../services/generatorService';
import { SearchAutocomplete } from '../../common/SearchAutocomplete';
import type { GeneratorDto } from '../../../types/generator';
import '../../../styles/planner/ViewPlanner.css';

interface GeneratorSectionProps {
  planner: PlannerDto;
  onUpdate: (patch: Partial<PlannerRequestDto>) => void;
  fieldErrors?: Record<string, string>;
}

const GeneratorSection: React.FC<GeneratorSectionProps> = ({
  planner,
  onUpdate,
  fieldErrors = {},
}) => {
  const [allGens, setAllGens] = useState<GeneratorDto[]>([]);
  const [tempFuelRate, setTempFuelRate] = useState(
    planner.targetAmount?.toString() ?? ''
  );
  const [tempOverclock, setTempOverclock] = useState('');
  const [tempGenCount, setTempGenCount] = useState(
    planner.generatorBuildingCount?.toString() ?? ''
  );

  useEffect(() => {
    generatorService.listAll().then(setAllGens).catch(console.error);
  }, []);

  useEffect(() => {
    setTempFuelRate(planner.targetAmount?.toString() ?? '');
    setTempGenCount(planner.generatorBuildingCount?.toString() ?? '');
  }, [planner.targetAmount, planner.generatorBuildingCount]);

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>, fn: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fn();
    }
  };

  const fmt = (n: number) => (Number.isInteger(n) ? n : n.toFixed(2));

  const fuelRate = planner.targetAmount;
  const genCount = planner.generatorBuildingCount;
  const totalPower =
    Math.round(genCount * planner.generator.powerOutput * 100) / 100;
  const waterPerMin =
    Math.round(
      planner.generator.fuelItems
        .filter((fi) => fi.item.name.toLowerCase() === 'water')
        .reduce((sum, fi) => sum + fi.amount, 0) *
        genCount *
        100
    ) / 100;
  const wastePerMin =
    Math.round((planner.generator.byProduct?.amount ?? 0) * genCount * 100) /
    100;

  return (
    <div className="planner-view__section">
      <h2 className="text-2xl font-semibold mb-4">Generator Summary</h2>
      {fieldErrors.generator && (
        <div className="text-red-600 mb-2">{fieldErrors.generator}</div>
      )}

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-lg">
        <div className="font-medium">Generator Type:</div>
        <div>{planner.generator.name}</div>

        <div className="font-medium">Fuel Type:</div>
        <div>
          <SearchAutocomplete<GeneratorDto>
            items={allGens}
            fields={['fuelType']}
            renderItem={(g) => g.fuelType}
            placeholder="Search by fuel type…"
            onSelect={(gen) => onUpdate({ generator: gen })}
            onFilter={() => {}}
            className={fieldErrors.generator ? 'border-red-500' : ''}
          />
        </div>

        <div className="font-medium">Target Item:</div>
        <div>{planner.targetItem.item.name}</div>

        <div className="font-medium">Burn Rate (per unit):</div>
        <div>{fmt(planner.generator.burnTime)}</div>

        <div className="font-medium">Total Fuel Rate /min:</div>
        <div>
          <input
            type="number"
            value={tempFuelRate}
            onChange={(e) => setTempFuelRate(e.target.value)}
            onBlur={() =>
              onUpdate({
                targetType: 'FUEL',
                targetAmount: Number(tempFuelRate),
              })
            }
            onKeyDown={(e) =>
              handleEnter(e, () =>
                onUpdate({
                  targetType: 'FUEL',
                  targetAmount: Number(tempFuelRate),
                })
              )
            }
            onFocus={(e) => (e.currentTarget as HTMLInputElement).select()}
            className={fieldErrors.targetAmount ? 'border-red-500' : ''}
          />
        </div>

        <div className="font-medium">Overclock %:</div>
        <div>
          <input
            type="number"
            value={tempOverclock}
            onChange={(e) => setTempOverclock(e.target.value)}
            onBlur={() => {
              const pct = Number(tempOverclock);
              const newRate = Math.round(fuelRate * (pct / 100) * 100) / 100;
              onUpdate({ targetType: 'FUEL', targetAmount: newRate });
            }}
            onKeyDown={(e) =>
              handleEnter(e, () => {
                const pct = Number(tempOverclock);
                const newRate = Math.round(fuelRate * (pct / 100) * 100) / 100;
                onUpdate({ targetType: 'FUEL', targetAmount: newRate });
              })
            }
            className={fieldErrors.overclock ? 'border-red-500' : ''}
          />
        </div>

        <div className="font-medium">Generator Count:</div>
        <div>
          <input
            type="number"
            value={tempGenCount}
            onChange={(e) => setTempGenCount(e.target.value)}
            onBlur={() =>
              onUpdate({
                targetType: 'GENERATOR',
                targetAmount: Number(tempGenCount),
              })
            }
            onKeyDown={(e) =>
              handleEnter(e, () =>
                onUpdate({
                  targetType: 'GENERATOR',
                  targetAmount: Number(tempGenCount),
                })
              )
            }
            onFocus={(e) => (e.currentTarget as HTMLInputElement).select()}
            className={
              fieldErrors.generatorBuildingCount ? 'border-red-500' : ''
            }
          />
        </div>

        <div className="font-medium">Total Power Output (MW):</div>
        <div>{fmt(totalPower)}</div>

        <div className="font-medium">Water / min (m³):</div>
        <div>{fmt(waterPerMin)}</div>

        <div className="font-medium">Waste / min:</div>
        <div>{fmt(wastePerMin)}</div>
      </div>
    </div>
  );
};

export default GeneratorSection;
