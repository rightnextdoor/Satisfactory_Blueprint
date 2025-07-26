// src/components/recipes/form/RecipeForm.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import '../../../styles/recipe/RecipeForm.css';
import Button from '../../common/Button';
import RecipeBasicFields from './RecipeBasicFields';
import RecipeBuildingSection from './RecipeBuildingSection';
import RecipeItemDataSection, {
  type EditableItemData,
} from './RecipeItemDataSection';
import { buildingService } from '../../../services/buildingService';
import type { RecipeDto } from '../../../types/recipe';
import type { BuildingDto } from '../../../types/building';

export interface RecipeFormProps {
  initialRecipe?: RecipeDto;
  onSave: (dto: RecipeDto) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
  isSaving: boolean;
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  initialRecipe,
  onSave,
  onCancel,
  onDelete,
  isSaving,
}) => {
  const blankItem: EditableItemData = { item: null, amount: 0 };

  const [alternate, setAlternate] = useState(initialRecipe?.alternate ?? false);
  const [spaceElevator, setSpaceElevator] = useState(
    initialRecipe?.spaceElevator ?? false
  );
  const [fuel, setFuel] = useState(initialRecipe?.fuel ?? false);
  const [weaponOrTool, setWeaponOrTool] = useState(
    initialRecipe?.weaponOrTool ?? false
  );
  const [tier, setTier] = useState(initialRecipe?.tier.toString() ?? '');
  const [building, setBuilding] = useState<BuildingDto | null>(null);

  const [output, setOutput] = useState<EditableItemData>(
    initialRecipe
      ? {
          item: initialRecipe.itemToBuild.item,
          amount: initialRecipe.itemToBuild.amount,
        }
      : blankItem
  );
  const [inputs, setInputs] = useState<EditableItemData[]>(
    initialRecipe?.items.map((i) => ({ item: i.item, amount: i.amount })) ?? [
      blankItem,
    ]
  );
  const [hasByProduct, setHasByProduct] = useState(
    initialRecipe?.hasByProduct ?? false
  );
  const [byProduct, setByProduct] = useState<EditableItemData>(
    initialRecipe?.byProduct
      ? {
          item: initialRecipe.byProduct.item,
          amount: initialRecipe.byProduct.amount,
        }
      : blankItem
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    buildingService
      .listAll()
      .then((list) => {
        if (initialRecipe) {
          const found = list.find((b) => b.type === initialRecipe.building);
          setBuilding(found ?? null);
        }
      })
      .catch(console.error);
  }, [initialRecipe]);

  useEffect(() => {
    setAlternate(initialRecipe?.alternate ?? false);
    setSpaceElevator(initialRecipe?.spaceElevator ?? false);
    setFuel(initialRecipe?.fuel ?? false);
    setWeaponOrTool(initialRecipe?.weaponOrTool ?? false);
    setTier(initialRecipe?.tier.toString() ?? '');
    setBuilding(null);
    setOutput(
      initialRecipe
        ? {
            item: initialRecipe.itemToBuild.item,
            amount: initialRecipe.itemToBuild.amount,
          }
        : blankItem
    );
    setInputs(
      initialRecipe?.items.map((i) => ({ item: i.item, amount: i.amount })) ?? [
        blankItem,
      ]
    );
    setHasByProduct(initialRecipe?.hasByProduct ?? false);
    setByProduct(
      initialRecipe?.byProduct
        ? {
            item: initialRecipe.byProduct.item,
            amount: initialRecipe.byProduct.amount,
          }
        : blankItem
    );
    setErrorMsg(null);
    setShowErrors(false);
  }, [initialRecipe]);

  const validate = (): boolean => {
    if (!tier || isNaN(Number(tier)) || Number(tier) < 1) {
      setErrorMsg('Tier must be a number ≥ 1.');
      return false;
    }
    if (!building) {
      setErrorMsg('Building is required.');
      return false;
    }
    if (!output.item) {
      setErrorMsg('Output item is required.');
      return false;
    }
    if (output.amount < 1) {
      setErrorMsg('Output amount must be ≥ 1.');
      return false;
    }
    if (inputs.length === 0) {
      setErrorMsg('At least one ingredient is required.');
      return false;
    }
    for (const i of inputs) {
      if (!i.item) {
        setErrorMsg('All ingredients must have an item selected.');
        return false;
      }
      if (i.amount < 1) {
        setErrorMsg('All ingredient amounts must be ≥ 1.');
        return false;
      }
    }
    if (hasByProduct) {
      if (!byProduct.item) {
        setErrorMsg('By-product item is required.');
        return false;
      }
      if (byProduct.amount < 1) {
        setErrorMsg('By-product amount must be ≥ 1.');
        return false;
      }
    }
    setErrorMsg(null);
    return true;
  };

  const handleSave = async () => {
    setShowErrors(true);
    if (!validate()) {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setShowErrors(false);
    const dto: RecipeDto = {
      id: initialRecipe?.id ?? 0,
      alternate,
      spaceElevator,
      fuel,
      weaponOrTool,
      hasByProduct,
      tier: Number(tier),
      building: building!.type,
      itemToBuild: { item: output.item!, amount: output.amount },
      items: inputs.map((i) => ({ item: i.item!, amount: i.amount })),
      ...(hasByProduct && {
        byProduct: { item: byProduct.item!, amount: byProduct.amount },
      }),
    };
    try {
      await onSave(dto);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        'Save failed.';
      setErrorMsg(msg);
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="recipe-form" ref={formRef}>
      {errorMsg && <div className="recipe-form__error-banner">{errorMsg}</div>}

      <RecipeBasicFields
        alternate={alternate}
        spaceElevator={spaceElevator}
        fuel={fuel}
        weaponOrTool={weaponOrTool}
        tier={tier}
        onChangeAlternate={setAlternate}
        onChangeSpaceElevator={setSpaceElevator}
        onChangeFuel={setFuel}
        onChangeWeaponOrTool={setWeaponOrTool}
        onChangeTier={setTier}
        error={
          showErrors && (!tier || isNaN(Number(tier)) || Number(tier) < 1)
            ? 'Tier must be a number ≥ 1.'
            : undefined
        }
      />

      <RecipeBuildingSection
        building={building}
        onBuildingChange={setBuilding}
        error={showErrors && !building}
      />

      <RecipeItemDataSection
        sectionHeader="Item to build"
        items={[output]}
        onItemsChange={(arr) => setOutput(arr[0])}
        maxItems={1}
        showErrors={showErrors}
      />

      <RecipeItemDataSection
        sectionHeader="By-product"
        items={[byProduct]}
        onItemsChange={(arr) => setByProduct(arr[0])}
        maxItems={1}
        allowToggle
        toggleValue={hasByProduct}
        toggleLabel="Include by-product"
        onToggleChange={(val) => {
          setHasByProduct(val);
          if (!val) setByProduct(blankItem);
        }}
        showErrors={showErrors && hasByProduct}
      />

      <RecipeItemDataSection
        sectionHeader="Ingredients"
        items={inputs}
        onItemsChange={setInputs}
        maxItems={4}
        showErrors={showErrors}
      />

      <div className="recipe-form__actions">
        {initialRecipe && onDelete && (
          <Button variant="secondary" onClick={onDelete}>
            Delete
          </Button>
        )}
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default RecipeForm;
