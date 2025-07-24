/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/generators/update/UpdateGenerator.tsx
import React, { useState, useEffect } from 'react';
import GeneratorForm from '../GeneratorForm';
import { generatorService } from '../../../services/generatorService';
import { imageService } from '../../../services/imageService';
import type { OwnerType } from '../../../types/enums';
import type { GeneratorDto } from '../../../types/generator';
import type { GeneratorType, FuelType } from '../../../types/enums';
import type { ItemDataDto } from '../../../types/itemDataDto';
import type { ImageUploadRequest } from '../../../types/imageUploadRequest';
import type { ImageDto } from '../../../types';

interface UpdateGeneratorProps {
  generatorId: number | null;
  onDone: () => void;
}

const UpdateGenerator: React.FC<UpdateGeneratorProps> = ({
  generatorId,
  onDone,
}) => {
  const [initial, setInitial] = useState<GeneratorDto | null>(null);

  // form fields
  const [type, setType] = useState<GeneratorType>(undefined as any);
  const [fuelType, setFuelType] = useState<FuelType>(undefined as any);
  const [powerOutput, setPowerOutput] = useState<string>('');
  const [burnTime, setBurnTime] = useState<string>('');
  const [hasByProduct, setHasByProduct] = useState<boolean>(false);
  const [byProductData, setByProductData] = useState<ItemDataDto | undefined>(
    undefined
  );
  const [fuelItemsData, setFuelItemsData] = useState<ItemDataDto[]>([]);

  // image fields
  const [initialImageId, setInitialImageId] = useState<string | undefined>(
    undefined
  );
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [removedImage, setRemovedImage] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);

  // load generator
  useEffect(() => {
    if (generatorId == null) return onDone();
    let cancelled = false;
    generatorService
      .getById(generatorId)
      .then((g) => {
        if (cancelled) return;
        setInitial(g);
        setType(g.name as GeneratorType);
        setFuelType(g.fuelType as FuelType);
        setPowerOutput(String(g.powerOutput));
        setBurnTime(String(g.burnTime));
        setHasByProduct(!!g.hasByProduct);
        setByProductData(g.byProduct ?? undefined);
        setFuelItemsData(g.fuelItems);
        const imgId = g.image?.id;
        setInitialImageId(imgId ?? undefined);
        setSelectedImageId(imgId ?? null);
        setFile(null);
        setRemovedImage(false);
      })
      .catch(() => onDone());
    return () => {
      cancelled = true;
    };
  }, [generatorId, onDone]);

  if (!initial) {
    return (
      <p className="p-4">
        {generatorId == null
          ? 'Please select a generator to update.'
          : 'Loading generator…'}
      </p>
    );
  }

  // helper: File → base64
  const toBase64 = (f: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res((reader.result as string).split(',')[1]);
      reader.onerror = rej;
      reader.readAsDataURL(f);
    });

  // save handler
  const handleSave = async () => {
    setIsSaving(true);

    let finalImage: ImageDto | undefined = initial.image;

    // 1) If they removed the original:
    if (removedImage && initial.image?.id) {
      await imageService.remove(
        initial.image.id,
        'GENERATOR' as OwnerType,
        generatorId!
      );
      finalImage = undefined;
    }

    // 2) If they uploaded a new file, push it through upload
    if (file) {
      const base64 = await toBase64(file);
      const req: ImageUploadRequest = {
        oldImageId: initial.image?.id,
        ownerType: 'GENERATOR',
        ownerId: generatorId!,
        contentType: file.type,
        data: base64,
      };
      finalImage = await imageService.upload(req);
    }
    // 3) Else if they selected an existing (and didn’t remove)
    else if (
      !removedImage &&
      selectedImageId &&
      selectedImageId !== initialImageId
    ) {
      // Re-assign an existing image (runs assignment logic)
      const req: ImageUploadRequest = {
        id: selectedImageId,
        data: undefined,
        contentType: undefined,
        oldImageId: initial.image?.id, // <–– pass the old one so service unassigns it
        ownerType: 'GENERATOR' as OwnerType,
        ownerId: generatorId!,
      };
      finalImage = await imageService.upload(req);
    }
    // 4) Otherwise (no change), finalImage stays as initial.image

    // 5) Build updated DTO
    const payload: GeneratorDto = {
      ...initial,
      name: type,
      fuelType,
      powerOutput: Number(powerOutput),
      burnTime: Number(burnTime),
      hasByProduct,
      byProduct: hasByProduct ? byProductData : undefined,
      fuelItems: fuelItemsData,
      image: finalImage,
    };

    await generatorService.update(payload);
    onDone();
  };

  // delete handler
  const handleDelete = async () => {
    if (initial.image?.id) {
      // unassign only
      await imageService.remove(
        initial.image.id,
        'GENERATOR' as OwnerType,
        generatorId!
      );
    }
    await generatorService.delete(generatorId!);
    onDone();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Update Generator</h1>
      <GeneratorForm
        type={type}
        onTypeChange={setType}
        fuelType={fuelType}
        onFuelTypeChange={setFuelType}
        powerOutput={powerOutput}
        onPowerOutputChange={setPowerOutput}
        burnTime={burnTime}
        onBurnTimeChange={setBurnTime}
        hasByProduct={hasByProduct}
        onHasByProductChange={setHasByProduct}
        byProduct={byProductData}
        onByProductChange={setByProductData}
        fuelItems={fuelItemsData}
        onFuelItemsChange={setFuelItemsData}
        // image props
        initialImageId={initialImageId}
        file={file}
        selectedImageId={selectedImageId}
        removedImage={removedImage}
        onFileChange={(f) => {
          setFile(f);
          setRemovedImage(false);
          setSelectedImageId(null);
        }}
        onSelectExistingImage={(id) => {
          setSelectedImageId(id);
          setRemovedImage(false);
          setFile(null);
        }}
        onRemoveImage={() => {
          setRemovedImage(true);
          setFile(null);
          setSelectedImageId(null);
        }}
        onValidationChange={() => {
          /*optional*/
        }}
        onSave={handleSave}
        onCancel={onDone}
        onDelete={handleDelete}
        isSaving={isSaving}
      />
    </div>
  );
};

export default UpdateGenerator;
