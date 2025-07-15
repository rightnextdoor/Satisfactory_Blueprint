// src/types/generator.ts

import type { ItemDataDto } from './itemDataDto';

/**
 * Mirrors com.satisfactory.blueprint.dto.GeneratorDto
 */
export interface GeneratorDto {
  id: number;
  name: string; // Backend uses enum GeneratorType; we treat as string here
  fuelType: string; // Backend uses enum FuelType
  hasByProduct: boolean;
  byProduct?: ItemDataDto; // nullable if hasByProduct=false
  powerOutput: number;
  burnTime: number;
  fuelItems: ItemDataDto[];
  iconKey?: string;
}
