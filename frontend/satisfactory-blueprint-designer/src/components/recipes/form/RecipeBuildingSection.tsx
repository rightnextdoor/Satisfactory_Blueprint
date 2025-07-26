// src/components/recipes/form/RecipeBuildingSection.tsx

import React, { useState, useEffect } from 'react';
import '../../../styles/recipe/RecipeForm.css';
import { SearchAutocomplete } from '../../common/SearchAutocomplete';
import { buildingService } from '../../../services/buildingService';
import { imageService } from '../../../services/imageService';
import type { BuildingDto } from '../../../types/building';
import type { ImageDto } from '../../../types/image';

export interface RecipeBuildingSectionProps {
  building: BuildingDto | null;
  onBuildingChange: (b: BuildingDto) => void;
  /** Show inline validation error */
  error?: boolean;
}

const RecipeBuildingSection: React.FC<RecipeBuildingSectionProps> = ({
  building,
  onBuildingChange,
  error = false,
}) => {
  const [allBuildings, setAllBuildings] = useState<BuildingDto[]>([]);
  const [searchKey, setSearchKey] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // load all buildings for autocomplete
  useEffect(() => {
    buildingService.listAll().then(setAllBuildings).catch(console.error);
  }, []);

  // fetch selected building's image
  useEffect(() => {
    if (building?.image?.id) {
      imageService
        .get(building.image.id)
        .then((dto: ImageDto) => {
          setImageUrl(`data:${dto.contentType};base64,${dto.data}`);
        })
        .catch(console.error);
    } else {
      setImageUrl(null);
    }
  }, [building]);

  const handleSelect = (b: BuildingDto) => {
    onBuildingChange(b);
    setSearchKey((k) => k + 1);
  };

  return (
    <div className="recipe-form__section">
      <h2 className="recipe-form__section-header">Building</h2>

      <div className="recipe-form__group--building">
        {/* Search + label */}
        <div>
          <label className="recipe-form__label">Building</label>
          <SearchAutocomplete<BuildingDto>
            key={searchKey}
            items={allBuildings}
            fields={['type']}
            renderItem={(b) => String(b.type).replace(/_/g, ' ')}
            placeholder="Search building…"
            onFilter={() => {}}
            onSelect={handleSelect}
            className={error ? 'border-red-500' : undefined}
          />
          {error && (
            <div className="text-red-600 text-sm mt-1">
              Building is required.
            </div>
          )}
        </div>

        {/* Details panel */}
        <div className="recipe-form__info-panel">
          {building ? (
            <>
              <div>
                <strong>ID:</strong> {building.id}
              </div>
              <div>
                <strong>Type:</strong> {building.type}
              </div>
              <div>
                <strong>Sort order:</strong> {building.sortOrder}
              </div>
              <div>
                <strong>Power usage:</strong> {building.powerUsage}
              </div>
              <div>
                <strong>Image:</strong>
                <br />
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={String(building.type)}
                    className="w-32 h-32 object-cover rounded"
                  />
                ) : building.image?.id ? (
                  <span className="text-gray-500">Loading…</span>
                ) : (
                  <span className="text-gray-500">No image</span>
                )}
              </div>
            </>
          ) : (
            <div className="text-gray-500">No building selected</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeBuildingSection;
