// src/components/recipes/view/ViewRecipes.tsx

import React, { useState, useEffect, useRef } from 'react';
import SectionTitle from '../../common/SectionTitle';
import { SearchAutocomplete } from '../../common/SearchAutocomplete';
import { recipeService } from '../../../services/recipeService';
import { buildingService } from '../../../services/buildingService';
import { imageService } from '../../../services/imageService';
import { useSort } from '../../../hooks/useSort';
import RecipeTable from './RecipeTable';
import type { RecipeDto } from '../../../types/recipe';
import '../../../styles/recipe/Recipe.css';

type RecipeSearchItem = RecipeDto & {
  outputName: string;
  tierString: string;
};

interface ViewRecipesProps {
  selectedRecipeId: number | null;
  onSelect: (id: number | null) => void;
  refreshKey: number;
}

const ViewRecipes: React.FC<ViewRecipesProps> = ({
  selectedRecipeId,
  onSelect,
  refreshKey,
}) => {
  const [allRecipes, setAllRecipes] = useState<RecipeSearchItem[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeSearchItem[]>(
    []
  );
  const [icons, setIcons] = useState<Record<string, string>>({});
  const didAutoSelect = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const iconMap: Record<string, string> = {};

    // Load recipes
    recipeService
      .listAll()
      .then((recipes) => {
        if (cancelled) return;

        const searchItems: RecipeSearchItem[] = recipes.map((r) => ({
          ...r,
          outputName: r.itemToBuild.item.name,
          tierString: r.tier.toString(),
        }));

        setAllRecipes(searchItems);
        setFilteredRecipes(searchItems);

        // Preload output‐item images
        searchItems.forEach((item) => {
          const imgId = item.itemToBuild.item.image?.id;
          if (!imgId) return;
          imageService
            .get(imgId)
            .then((dto) => {
              if (cancelled || !dto.data) return;
              iconMap[
                `${item.id}-out`
              ] = `data:${dto.contentType};base64,${dto.data}`;
              setIcons({ ...iconMap });
            })
            .catch(() => {});
        });

        // Preload building images
        buildingService
          .listAll()
          .then((buildings) => {
            const bmap = new Map<string, string>();
            buildings.forEach((b) => {
              if (b.image?.id != null) bmap.set(b.type, b.image.id);
            });
            searchItems.forEach((item) => {
              const bldId = bmap.get(item.building);
              if (!bldId) return;
              imageService
                .get(bldId)
                .then((dto) => {
                  if (cancelled || !dto.data) return;
                  iconMap[
                    `${item.id}-bld`
                  ] = `data:${dto.contentType};base64,${dto.data}`;
                  setIcons({ ...iconMap });
                })
                .catch(() => {});
            });
          })
          .catch(console.error);
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const {
    sorted: sortedRecipes,
    sortField,
    sortOrder,
    toggleSort,
  } = useSort<RecipeSearchItem>({
    items: filteredRecipes,
    initialField: 'tier',
  });

  useEffect(() => {
    if (!didAutoSelect.current && sortedRecipes.length > 0) {
      onSelect(sortedRecipes[0].id);
      didAutoSelect.current = true;
    }
  }, [sortedRecipes, onSelect]);

  return (
    <div className="recipe-page__card">
      <SectionTitle
        text="View Recipes"
        className="recipe-page__section-title"
      />

      <SearchAutocomplete<RecipeSearchItem>
        className="recipe-page__search mb-4 w-1/6"
        items={allRecipes}
        fields={['outputName', 'building', 'tierString']}
        placeholder="Search by output, building or tier…"
        onFilter={setFilteredRecipes}
        onSelect={(item) => onSelect(item.id)}
      />

      <div className="recipe-page__table-wrapper">
        <RecipeTable
          recipes={sortedRecipes}
          icons={icons}
          selectedRecipeId={selectedRecipeId}
          onSelect={onSelect}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={toggleSort}
        />
      </div>
    </div>
  );
};

export default ViewRecipes;
