// src/types/generator.ts

import type { ItemDataDto } from './itemDataDto';
import type { ImageDto } from './image';
import { GeneratorTypes, FuelTypes } from './enums';

/**
 * Mirrors com.satisfactory.blueprint.dto.GeneratorDto
 */
export interface GeneratorDto {
  id: number;
  /** Generator type (one of GeneratorTypes) */
  name: (typeof GeneratorTypes)[number];
  /** Fuel type (one of FuelTypes) */
  fuelType: (typeof FuelTypes)[number];
  hasByProduct: boolean;
  /** Present only if hasByProduct === true */
  byProduct?: ItemDataDto;
  powerOutput: number;
  burnTime: number;
  fuelItems: ItemDataDto[];
  /** The associated image, if any */
  image?: ImageDto;
}
