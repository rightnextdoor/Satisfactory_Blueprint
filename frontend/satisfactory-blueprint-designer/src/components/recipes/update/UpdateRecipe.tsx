// src/components/recipes/update/UpdateRecipe.tsx

import React, { useState, useEffect } from 'react';
import RecipeForm from '../form/RecipeForm';
import { recipeService } from '../../../services/recipeService';
import type { RecipeDto } from '../../../types/recipe';

interface UpdateRecipeProps {
  /** The ID of the recipe to edit (or null if none selected) */
  recipeId: number | null;
  /** Called when save/delete/cancel completes to return to the view */
  onDone: () => void;
}

const UpdateRecipe: React.FC<UpdateRecipeProps> = ({ recipeId, onDone }) => {
  const [recipe, setRecipe] = useState<RecipeDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch recipe when ID changes
  useEffect(() => {
    if (recipeId == null) {
      setRecipe(null);
      return;
    }
    setLoading(true);
    recipeService
      .getById(recipeId)
      .then((dto) => setRecipe(dto))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [recipeId]);

  // No selection
  if (recipeId == null) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Update Recipe</h2>
        <p>Please select a recipe in the View tab.</p>
      </div>
    );
  }

  // Still loading
  if (loading || !recipe) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Update Recipe</h2>
        <p>Loading recipe…</p>
      </div>
    );
  }

  // Handlers
  const handleSave = async (updated: RecipeDto) => {
    setSaving(true);
    try {
      await recipeService.update(updated);
      onDone();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await recipeService.delete(recipe.id);
      onDone();
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onDone();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Update Recipe</h2>
      <RecipeForm
        initialRecipe={recipe}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={handleDelete}
        isSaving={saving}
      />
    </div>
  );
};

export default UpdateRecipe;
