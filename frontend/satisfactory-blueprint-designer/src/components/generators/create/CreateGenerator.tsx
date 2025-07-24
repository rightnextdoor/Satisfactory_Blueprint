// src/components/generators/create/CreateGenerator.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import GeneratorForm from '../GeneratorForm';
import { generatorService } from '../../../services/generatorService';
import { imageService } from '../../../services/imageService';
import { GeneratorTypes, FuelTypes } from '../../../types/enums';
import type { GeneratorType, FuelType } from '../../../types/enums';
import type { ItemDto } from '../../../types/itemDto';
import type { ItemDataDto } from '../../../types/itemDataDto';
import type { GeneratorDto } from '../../../types/generator';
import type { ImageUploadRequest } from '../../../types/imageUploadRequest';

interface CreateGeneratorProps {
  onDone: () => void;
}

const CreateGenerator: React.FC<CreateGeneratorProps> = ({ onDone }) => {
  // --- Basic fields ---
  const [type, setType] = useState<GeneratorType>(GeneratorTypes[0]);
  const [fuelType, setFuelType] = useState<FuelType>(FuelTypes[0]);
  const [powerOutput, setPowerOutput] = useState<string>('');
  const [burnTime, setBurnTime] = useState<string>('');

  // --- By-product & fuel items ---
  const [hasByProduct, setHasByProduct] = useState(false);
  const [byProduct, setByProduct] = useState<ItemDataDto | undefined>(
    undefined
  );
  const [fuelItems, setFuelItems] = useState<ItemDataDto[]>([
    { item: {} as ItemDto, amount: 0 },
  ]);

  // --- Image picker state ---
  const [file, setFile] = useState<File | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [removedImage, setRemovedImage] = useState(false);

  // --- Save state ---
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // helper to convert a File to base64 (no data:… prefix)
  const toBase64 = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve(dataUrl.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  const handleSave = async () => {
    setErrorMsg(null);
    setIsSaving(true);

    try {
      // 1) Create the generator (no image field at all)
      const createPayload: GeneratorDto = {
        id: 0,
        name: type,
        fuelType,
        hasByProduct,
        byProduct: hasByProduct ? byProduct : undefined,
        powerOutput: Number(powerOutput),
        burnTime: Number(burnTime),
        fuelItems,
      };
      const created = await generatorService.create(createPayload);

      // 2) If the user uploaded or picked an image, link it now
      if (!removedImage && selectedImageId) {
        // link existing
        const req: ImageUploadRequest = {
          id: selectedImageId,
          data: undefined,
          contentType: undefined,
          oldImageId: undefined,
          ownerType: 'GENERATOR',
          ownerId: created.id,
        };
        await imageService.upload(req);
      } else if (!removedImage && file) {
        // new upload
        const req: ImageUploadRequest = {
          data: await toBase64(file),
          contentType: file.type,
          oldImageId: undefined,
          ownerType: 'GENERATOR',
          ownerId: created.id,
        };
        await imageService.upload(req);
      }

      onDone();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to create generator.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Create Generator</h2>
      {errorMsg && <div className="generator-form__error mb-4">{errorMsg}</div>}

      <GeneratorForm
        // Basic fields
        type={type}
        onTypeChange={setType}
        fuelType={fuelType}
        onFuelTypeChange={setFuelType}
        powerOutput={powerOutput}
        onPowerOutputChange={setPowerOutput}
        burnTime={burnTime}
        onBurnTimeChange={setBurnTime}
        // By-product / fuel items
        hasByProduct={hasByProduct}
        onHasByProductChange={setHasByProduct}
        byProduct={byProduct}
        onByProductChange={setByProduct}
        fuelItems={fuelItems}
        onFuelItemsChange={setFuelItems}
        // Image picker (no iconKey anywhere)
        initialImageId={undefined}
        file={file}
        selectedImageId={selectedImageId}
        removedImage={removedImage}
        onFileChange={(f) => {
          setFile(f);
          setRemovedImage(false);
        }}
        onSelectExistingImage={(id) => {
          setSelectedImageId(id);
          setRemovedImage(false);
        }}
        onRemoveImage={() => {
          setFile(null);
          setSelectedImageId(null);
          setRemovedImage(true);
        }}
        onValidationChange={() => {}}
        // Actions
        onSave={handleSave}
        onCancel={onDone}
        isSaving={isSaving}
      />
    </div>
  );
};

export default CreateGenerator;
