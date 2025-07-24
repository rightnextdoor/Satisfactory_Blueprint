// src/components/generators/GeneratorItemDataSection.tsx
import React, { useState, useEffect } from 'react';
import '../../styles/generator/GeneratorForm.css';
import { SearchAutocomplete } from '../common/SearchAutocomplete';
import Button from '../common/Button';
import { itemService } from '../../services/itemService';
import type { ItemDto } from '../../types/itemDto';
import type { ItemDataDto } from '../../types/itemDataDto';

export interface GeneratorItemDataSectionProps {
  hasByProduct: boolean;
  onHasByProductChange: (has: boolean) => void;
  byProduct?: ItemDataDto;
  onByProductChange: (data?: ItemDataDto) => void;
  fuelItems: ItemDataDto[];
  onFuelItemsChange: (items: ItemDataDto[]) => void;
}

const GeneratorItemDataSection: React.FC<GeneratorItemDataSectionProps> = ({
  hasByProduct,
  onHasByProductChange,
  byProduct,
  onByProductChange,
  fuelItems,
  onFuelItemsChange,
}) => {
  const [allItems, setAllItems] = useState<ItemDto[]>([]);
  const [byProdSearchKey, setByProdSearchKey] = useState(0);
  const [fuelSearchKeys, setFuelSearchKeys] = useState<number[]>([]);

  useEffect(() => {
    itemService.listAll().then(setAllItems).catch(console.error);
  }, []);

  useEffect(() => {
    setFuelSearchKeys(fuelItems.map(() => 0));
  }, [fuelItems.length]);

  // validation
  const byProdMissingItem = hasByProduct && !byProduct?.item;
  const byProdInvalidAmt =
    hasByProduct && (!byProduct?.amount || byProduct.amount <= 0);
  const fuelErrors = fuelItems.map(
    (f) => !f.item || !f.amount || f.amount <= 0
  );

  // by-product handlers
  const handleByProductSelect = (item: ItemDto) => {
    onByProductChange({ item, amount: byProduct?.amount ?? 0 });
    setByProdSearchKey((k) => k + 1);
  };
  const handleByProductAmt = (amt: string) => {
    const num = Number(amt);
    onByProductChange(byProduct ? { ...byProduct, amount: num } : undefined);
  };

  // fuel-items handlers
  const updateFuelItem = (i: number, item: ItemDto) => {
    const copy = [...fuelItems];
    copy[i] = { item, amount: copy[i].amount };
    onFuelItemsChange(copy);
    setFuelSearchKeys((keys) => keys.map((k, idx) => (idx === i ? k + 1 : k)));
  };
  const updateFuelAmt = (i: number, amt: string) => {
    const num = Number(amt);
    const copy = [...fuelItems];
    copy[i] = { item: copy[i].item, amount: num };
    onFuelItemsChange(copy);
  };
  const addFuel = () =>
    onFuelItemsChange([...fuelItems, { item: allItems[0], amount: 0 }]);
  const removeFuel = (i: number) =>
    onFuelItemsChange(fuelItems.filter((_, idx) => idx !== i));

  return (
    <div className="generator-form__group space-y-8">
      {/* By-Product */}
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          className="generator-form__checkbox"
          checked={hasByProduct}
          onChange={(e) => onHasByProductChange(e.target.checked)}
        />
        <label className="generator-form__label mb-0">Has By-Product</label>
      </div>

      {hasByProduct && (
        <div className="space-y-4">
          {/* Search */}
          <SearchAutocomplete<ItemDto>
            key={byProdSearchKey}
            items={allItems}
            fields={['name']}
            placeholder="Search by-product item…"
            onFilter={() => {}}
            onSelect={handleByProductSelect}
            renderItem={(it) => it.name}
            className={byProdMissingItem ? 'border-red-500' : ''}
          />
          {byProdMissingItem && (
            <div className="text-red-600 text-sm">Item is required</div>
          )}

          {/* Details + Amount */}
          <div className="flex items-start gap-6">
            <div className="flex-1 bg-gray-100 border border-gray-300 rounded p-3 space-y-2">
              {byProduct ? (
                <>
                  <div className="flex gap-4">
                    <div>
                      <strong>ID:</strong> {byProduct.item.id}
                    </div>
                    <div>
                      <strong>Name:</strong> {byProduct.item.name}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <strong>Image ID:</strong>{' '}
                      {byProduct.item.image?.id || '-'}
                    </div>
                    <div>
                      <strong>Resource:</strong>{' '}
                      {String(byProduct.item.resource)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-500">No item selected</div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="generator-form__label block">
                By-Product Amount
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  className={`generator-form__input w-24 ${
                    byProdInvalidAmt ? 'border-red-500' : ''
                  }`}
                  value={
                    byProduct?.amount != null ? String(byProduct.amount) : ''
                  }
                  onChange={(e) => handleByProductAmt(e.target.value)}
                />
              </div>
              {byProdInvalidAmt && (
                <div className="text-red-600 text-sm">
                  Amount &gt; 0 required
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fuel Items */}
      <h2 className="generator-form__section-header">Fuel Items List</h2>
      {fuelItems.map((row, idx) => (
        <div key={idx} className="space-y-4">
          {/* Search */}
          <SearchAutocomplete<ItemDto>
            key={fuelSearchKeys[idx]}
            items={allItems}
            fields={['name']}
            placeholder="Search fuel item…"
            onFilter={() => {}}
            onSelect={(it) => updateFuelItem(idx, it)}
            renderItem={(it) => it.name}
            className={fuelErrors[idx] && !row.item ? 'border-red-500' : ''}
          />
          {fuelErrors[idx] && !row.item && (
            <div className="text-red-600 text-sm">Item is required</div>
          )}

          {/* Details + Amount + Remove */}
          <div className="flex items-start gap-6 mb-4">
            <div className="flex-1 bg-gray-100 border border-gray-300 rounded p-3 space-y-2">
              {row.item ? (
                <>
                  <div className="flex gap-4">
                    <div>
                      <strong>ID:</strong> {row.item.id}
                    </div>
                    <div>
                      <strong>Name:</strong> {row.item.name}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <strong>Image ID:</strong> {row.item.image?.id || '-'}
                    </div>
                    <div>
                      <strong>Resource:</strong> {String(row.item.resource)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-500">No item selected</div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="generator-form__label block">Item Amount</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  className={`generator-form__input w-24 ${
                    fuelErrors[idx] && (!row.amount || row.amount <= 0)
                      ? 'border-red-500'
                      : ''
                  }`}
                  value={row.amount != null ? String(row.amount) : ''}
                  onChange={(e) => updateFuelAmt(idx, e.target.value)}
                />
                {fuelItems.length > 1 && (
                  <Button variant="secondary" onClick={() => removeFuel(idx)}>
                    Remove
                  </Button>
                )}
              </div>
              {fuelErrors[idx] && (!row.amount || row.amount <= 0) && (
                <div className="text-red-600 text-sm">
                  Amount &gt; 0 required
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <Button variant="primary" onClick={addFuel} className="mt-2">
        + Add Fuel Item
      </Button>
    </div>
  );
};

export default GeneratorItemDataSection;
