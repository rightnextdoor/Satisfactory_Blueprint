// src/types/planner.ts

import type { GeneratorDto } from './generator';
import type { ItemDto } from '../types/itemDto';
import type { RecipeDto } from './recipe';
import type { ItemDataDto } from './itemDataDto';
import type { PlannerTargetType } from './enums';

/**
 * Mirrors com.satisfactory.blueprint.dto.PlannerDto
 */
export interface PlannerDto {
  id?: number; // null on create :contentReference[oaicite:17]{index=17}
  name: string;
  mode: string; // PlannerMode enum as string :contentReference[oaicite:18]{index=18}
  targetType: string; // PlannerTargetType enum as string :contentReference[oaicite:19]{index=19}
  generator: GeneratorDto;
  targetAmount: number; // serialized via CustomDoubleSerializer :contentReference[oaicite:20]{index=20}
  targetItem: ItemDataDto;
  burnTime: number;
  generatorBuildingCount: number;
  overclockGenerator: number;
  totalPowerConsumption: number;
  totalGeneratorPower: number;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  entries: PlannerEntryDto[]; // embedded tree of entries :contentReference[oaicite:21]{index=21}
  resources: ResourcesDto[]; // raw-resource totals :contentReference[oaicite:22]{index=22}
}

export interface PlannerRequestDto {
  id?: number;
  name: string;
  generator: GeneratorDto;
  targetType: PlannerTargetType;
  targetAmount: number;
  overclockGenerator?: number;
}

/**
 * Mirrors com.satisfactory.blueprint.dto.PlannerEntryDto
 */
export interface PlannerEntryDto {
  id: number;
  recipe: RecipeDto;
  targetItem: ItemDto;
  buildingCount: number; // CustomDoubleSerializer :contentReference[oaicite:23]{index=23}
  buildingOverride: boolean;
  overclockBuilding: number;
  powerConsumption: number;
  outgoingAmount: number; // CustomDoubleSerializer :contentReference[oaicite:24]{index=24}
  recipeAllocations: PlannerAllocationDto[];
  manualAllocations: PlannerAllocationDto[];
  ingredientAllocations: PlannerAllocationDto[];
}

/**
 * Mirrors com.satisfactory.blueprint.dto.PlannerAllocationDto
 */
export interface PlannerAllocationDto {
  item: ItemDto;
  label: string;
  amount: number; // CustomDoubleSerializer :contentReference[oaicite:25]{index=25}
  buildingCount: number; // CustomDoubleSerializer :contentReference[oaicite:26]{index=26}
}

/**
 * Mirrors com.satisfactory.blueprint.dto.ResourcesDto
 */
export interface ResourcesDto {
  item: ItemDto;
  amount: number; // CustomDoubleSerializer :contentReference[oaicite:27]{index=27}
}

/** Mirrors com.satisfactory.blueprint.dto.EntryDeleteRequest */
export interface EntryDeleteRequest {
  plannerId: number;
  entryId: number;
}

/** Mirrors com.satisfactory.blueprint.dto.EntryRecipeRequest */
export interface EntryRecipeRequest {
  plannerId: number;
  entryDto: PlannerEntryDto;
}

/** Mirrors com.satisfactory.blueprint.dto.ManualAllocationRequest */
export interface ManualAllocationRequest {
  plannerId: number;
  entryId: number;
  manualAllocationDto: PlannerAllocationDto;
}

/** Mirrors com.satisfactory.blueprint.dto.ManualAllocationDeleteRequest */
export interface ManualAllocationDeleteRequest {
  plannerId: number;
  entryId: number;
  label: string;
}
