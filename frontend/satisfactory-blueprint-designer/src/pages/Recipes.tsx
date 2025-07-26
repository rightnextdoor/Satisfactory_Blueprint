import React, { useState, useCallback } from 'react';
import RecipeSidebar, {
  type RecipeTab,
} from '../components/recipes/RecipeSidebar';
import ViewRecipes from '../components/recipes/view/ViewRecipes';
import CreateRecipe from '../components/recipes/create/CreateRecipe';
import UpdateRecipe from '../components/recipes/update/UpdateRecipe';
import '../styles/recipe/Recipe.css';

const Recipes: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<RecipeTab>('view');
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDone = useCallback(() => {
    setSelectedTab('view');
    setRefreshKey((k) => k + 1);
  }, []);

  const paneClasses = (tab: RecipeTab) =>
    `absolute inset-0 overflow-y-auto p-6 ${
      selectedTab === tab ? 'visible' : 'invisible pointer-events-none'
    }`;

  return (
    <div className="recipe-page">
      <RecipeSidebar selected={selectedTab} onSelect={setSelectedTab} />

      <div className="flex-1 flex flex-col">
        <div className="recipe-page__topbar">
          <h1 className="recipe-page__title">Recipes</h1>
        </div>

        <main className="recipe-page__content">
          {/* View pane */}
          <div className={paneClasses('view')}>
            <ViewRecipes
              selectedRecipeId={selectedRecipeId}
              onSelect={setSelectedRecipeId}
              refreshKey={refreshKey}
            />
          </div>

          {/* Create pane */}
          {selectedTab === 'create' && (
            <div className={paneClasses('create')}>
              <CreateRecipe onDone={handleDone} />
            </div>
          )}

          {/* Update pane */}
          <div className={paneClasses('update')}>
            <UpdateRecipe recipeId={selectedRecipeId} onDone={handleDone} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Recipes;
