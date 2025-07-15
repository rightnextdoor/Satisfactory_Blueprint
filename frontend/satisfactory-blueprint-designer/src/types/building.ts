// src/types/building.ts

/** Matches com.satisfactory.blueprint.dto.BuildingDto */
export interface BuildingDto {
  id: number;
  type: string; // FIXME: replace `string` with specific BuildingType union if available
  sortOrder: number;
  powerUsage: number;
  iconKey?: string; // nullable in the backend
}
