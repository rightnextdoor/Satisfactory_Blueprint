/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/recipes/create/CreateRecipe.tsx

import React, { useState } from 'react';
import '../../../styles/recipe/RecipeForm.css';
import RecipeForm from '../form/RecipeForm';
import { recipeService } from '../../../services/recipeService';
import type { RecipeDto } from '../../../types/recipe';

interface CreateRecipeProps {
  onDone: () => void;
}

const CreateRecipe: React.FC<CreateRecipeProps> = ({ onDone }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (dto: RecipeDto) => {
    setErrorMsg(null);
    setIsSaving(true);
    try {
      await recipeService.create(dto);
      onDone();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        'Failed to create recipe.';
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onDone();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Create Recipe</h2>
      {errorMsg && (
        <div className="recipe-form__error-banner mb-4">{errorMsg}</div>
      )}

      <RecipeForm
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
      />
    </div>
  );
};

export default CreateRecipe;
