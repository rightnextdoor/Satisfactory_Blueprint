import React, { useState, useEffect, type KeyboardEvent } from 'react';
import type { PlannerDto } from '../../../types';
import type { PlannerRequestDto } from '../../../types/planner';
import { generatorService } from '../../../services/generatorService';
import { SearchAutocomplete } from '../../common/SearchAutocomplete';
import type { GeneratorDto } from '../../../types/generator';
import { OverclockControl } from '../OverclockControl';
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
  const [tempGenCount, setTempGenCount] = useState(
    planner.generatorBuildingCount?.toString() ?? ''
  );
  const [tempOverclock, setTempOverclock] = useState(
    planner.overclockGenerator?.toString() ?? '100'
  );

  // fetch generators once
  useEffect(() => {
    generatorService.listAll().then(setAllGens).catch(console.error);
  }, []);

  // log whenever backend planner data arrives
  useEffect(() => {
    console.log('GeneratorSection: planner updated from backend:', planner);
  }, [planner]);

  // sync temps when planner changes
  useEffect(() => {
    setTempFuelRate(planner.targetAmount?.toString() ?? '');
    setTempGenCount(planner.generatorBuildingCount?.toString() ?? '');
    setTempOverclock(planner.overclockGenerator?.toString() ?? '100');
  }, [
    planner.targetAmount,
    planner.generatorBuildingCount,
    planner.overclockGenerator,
  ]);

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>, fn: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fn();
    }
  };

  // Overclock handlers
  const handleOverclockCommit = (pct: number) => {
    onUpdate({ overclockGenerator: pct });
  };

  const fmt = (n: number) => (Number.isInteger(n) ? n : n.toFixed(2));
  const genCount = planner.generatorBuildingCount;

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
        {/* Generator Type */}
        <div className="font-medium">Generator Type:</div>
        <div>{planner.generator.name}</div>

        {/* Fuel Type */}
        <div className="font-medium">Fuel Type:</div>
        <div>
          <SearchAutocomplete<GeneratorDto>
            items={allGens}
            fields={['fuelType']}
            renderItem={(g) => g.fuelType}
            placeholder="Search by fuel type…"
            onSelect={(gen) => {
              if (gen.id !== planner.generator.id) {
                onUpdate({ generator: gen });
              }
            }}
            onFilter={() => {}}
            className={fieldErrors.generator ? 'border-red-500' : ''}
          />
        </div>

        {/* Target Item */}
        <div className="font-medium">Target Item:</div>
        <div>{planner.targetItem.item.name}</div>

        {/* Burn Rate */}
        <div className="font-medium">Burn Rate (per unit):</div>
        <div>{fmt(planner.burnTime)}</div>

        {/* Total Fuel Rate */}
        <div className="font-medium">Total Fuel Rate /min:</div>
        <div>
          <input
            type="number"
            value={tempFuelRate}
            onChange={(e) => setTempFuelRate(e.target.value)}
            onBlur={() => {
              const v = Number(tempFuelRate);
              if (v !== planner.targetAmount) {
                onUpdate({ targetType: 'FUEL', targetAmount: v });
              }
            }}
            onKeyDown={(e) =>
              handleEnter(e, () => {
                const v = Number(tempFuelRate);
                if (v !== planner.targetAmount) {
                  onUpdate({ targetType: 'FUEL', targetAmount: v });
                }
              })
            }
            onFocus={(e) => e.currentTarget.select()}
            className={fieldErrors.targetAmount ? 'border-red-500' : ''}
          />
        </div>

        {/* Overclock */}
        <div className="font-medium">Overclock %:</div>
        <div className="flex items-center">
          <OverclockControl
            className="overclock-control--horizontal overclock-control--no-label"
            key={planner.overclockGenerator ?? 100}
            value={Number(tempOverclock)}
            onCommit={handleOverclockCommit}
            disabled={false}
          />
        </div>

        {/* Generator Count */}
        <div className="font-medium">Generator Count:</div>
        <div>
          <input
            type="number"
            value={tempGenCount}
            onChange={(e) => setTempGenCount(e.target.value)}
            onBlur={() => {
              const v = Number(tempGenCount);
              if (v !== planner.generatorBuildingCount) {
                onUpdate({ targetType: 'GENERATOR', targetAmount: v });
              }
            }}
            onKeyDown={(e) =>
              handleEnter(e, () => {
                const v = Number(tempGenCount);
                if (v !== planner.generatorBuildingCount) {
                  onUpdate({ targetType: 'GENERATOR', targetAmount: v });
                }
              })
            }
            onFocus={(e) => e.currentTarget.select()}
            className={
              fieldErrors.generatorBuildingCount ? 'border-red-500' : ''
            }
          />
        </div>

        {/* Calculated Outputs */}
        <div className="font-medium">Total Power Output (MW):</div>
        <div>{planner.totalGeneratorPower}</div>
        <div className="font-medium">Water / min (m³):</div>
        <div>{fmt(waterPerMin)}</div>
        <div className="font-medium">Waste / min:</div>
        <div>{fmt(wastePerMin)}</div>
      </div>
    </div>
  );
};

export default GeneratorSection;
