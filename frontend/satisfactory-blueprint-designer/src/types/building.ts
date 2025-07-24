// src/types/building.ts

import { type BuildingType } from './enums';
import { type ImageDto } from './image';

/** Matches com.satisfactory.blueprint.dto.BuildingDto */
export interface BuildingDto {
  id: number;
  type: BuildingType;
  sortOrder: number;
  powerUsage: number;
  /** The associated image, if any */
  image?: ImageDto;
}
