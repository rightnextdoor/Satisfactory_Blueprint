// src/components/recipes/form/RecipeItemDataSection.tsx

import React, { useState, useEffect } from 'react';
import '../../../styles/recipe/RecipeForm.css';
import { SearchAutocomplete } from '../../common/SearchAutocomplete';
import Button from '../../common/Button';
import { itemService } from '../../../services/itemService';
import { imageService } from '../../../services/imageService';
import type { ItemDto } from '../../../types/itemDto';
import type { ImageDto } from '../../../types/image';

export interface EditableItemData {
  item: ItemDto | null;
  amount: number;
}

export interface RecipeItemDataSectionProps {
  sectionHeader: string;
  items: EditableItemData[];
  onItemsChange: (items: EditableItemData[]) => void;
  maxItems: number;
  allowToggle?: boolean;
  toggleValue?: boolean;
  toggleLabel?: string;
  onToggleChange?: (v: boolean) => void;
  /** Whether to show inline validation errors */
  showErrors?: boolean;
}

const RecipeItemDataSection: React.FC<RecipeItemDataSectionProps> = ({
  sectionHeader,
  items,
  onItemsChange,
  maxItems,
  allowToggle = false,
  toggleValue = false,
  toggleLabel,
  onToggleChange,
  showErrors = false,
}) => {
  const [allItems, setAllItems] = useState<ItemDto[]>([]);
  const [searchKeys, setSearchKeys] = useState<number[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});

  useEffect(() => {
    itemService.listAll().then(setAllItems).catch(console.error);
  }, []);

  useEffect(() => {
    setSearchKeys(items.map(() => 0));
  }, [items.length]);

  useEffect(() => {
    let cancelled = false;
    items.forEach((row, idx) => {
      const imageId = row.item?.image?.id;
      if (!imageId) return;
      imageService
        .get(imageId)
        .then((dto: ImageDto) => {
          if (cancelled) return;
          setImageUrls((prev) => ({
            ...prev,
            [idx]: `data:${dto.contentType};base64,${dto.data}`,
          }));
        })
        .catch(console.error);
    });
    return () => {
      cancelled = true;
    };
  }, [items]);

  const addRow = () => {
    if (items.length < maxItems) {
      onItemsChange([...items, { item: null, amount: 0 }]);
    }
  };

  const updateRow = (idx: number, updated: EditableItemData) => {
    const clone = [...items];
    clone[idx] = updated;
    onItemsChange(clone);
  };

  const removeRow = (idx: number) => {
    if (items.length > 1) {
      onItemsChange(items.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="recipe-form__section">
      <h2 className="recipe-form__section-header">{sectionHeader}</h2>

      {allowToggle && toggleLabel && onToggleChange && (
        <div>
          <label className="recipe-form__label">{toggleLabel}</label>
          <input
            type="checkbox"
            checked={toggleValue}
            onChange={(e) => onToggleChange(e.target.checked)}
          />
        </div>
      )}

      {(!allowToggle || toggleValue) && (
        <div className="space-y-6">
          {items.map((row, idx) => {
            const itemError =
              showErrors && !row.item ? 'Item is required.' : undefined;
            const amountError =
              showErrors && (isNaN(row.amount) || row.amount < 1)
                ? 'Amount must be a number ≥ 1.'
                : undefined;

            return (
              <div key={idx} className="flex flex-col gap-2">
                {/* Search box */}
                <div>
                  <label className="recipe-form__label">
                    {items.length > 1 ? `Item #${idx + 1}` : sectionHeader}
                  </label>
                  <SearchAutocomplete<ItemDto>
                    key={searchKeys[idx]}
                    items={allItems}
                    fields={['name']}
                    renderItem={(i) => i.name}
                    placeholder="Search item…"
                    onFilter={() => {}}
                    onSelect={(item) => updateRow(idx, { ...row, item })}
                    className={itemError ? 'border-red-500' : undefined}
                  />
                  {itemError && (
                    <div className="text-red-600 text-sm mt-1">{itemError}</div>
                  )}
                </div>

                {/* Info panel + amount below */}
                <div className="flex items-start gap-4">
                  <div className="recipe-form__info-panel flex-1">
                    {row.item ? (
                      <>
                        <div>
                          <strong>ID:</strong> {row.item.id}
                        </div>
                        <div>
                          <strong>Name:</strong> {row.item.name}
                        </div>
                        <div>
                          <strong>Resource:</strong> {String(row.item.resource)}
                        </div>
                        <div>
                          <strong>Image:</strong>
                          <br />
                          {imageUrls[idx] ? (
                            <img
                              src={imageUrls[idx]}
                              alt={row.item.name}
                              className="w-32 h-32 object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-500">Loading…</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-500">No item selected</div>
                    )}
                  </div>

                  {/* Amount input */}
                  <div className="flex flex-col">
                    <label className="recipe-form__label">Amount</label>
                    <input
                      type="number"
                      className={`recipe-form__input w-24 ${
                        amountError ? 'border-red-500' : ''
                      }`}
                      value={row.amount > 0 ? row.amount : ''}
                      placeholder=""
                      onChange={(e) => {
                        const num = Number(e.target.value);
                        updateRow(idx, {
                          ...row,
                          amount: Number.isNaN(num) ? NaN : num,
                        });
                      }}
                    />
                    {amountError && (
                      <div className="text-red-600 text-sm mt-1">
                        {amountError}
                      </div>
                    )}
                  </div>

                  {items.length > 1 && (
                    <Button
                      variant="secondary"
                      onClick={() => removeRow(idx)}
                      className="self-center"
                    >
                      Remove Item
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {items.length < maxItems && (
            <Button variant="primary" onClick={addRow}>
              Add Item
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeItemDataSection;
