// src/types/recipe.ts

import type { ItemDataDto } from './itemDataDto';

/**
 * Mirrors com.satisfactory.blueprint.dto.RecipeDto
 */
export interface RecipeDto {
  /** Unique recipe ID */
  id: number;
  /** Is this the alternate recipe? */
  alternate: boolean;
  /** Unlocks via Space Elevator? */
  spaceElevator: boolean;
  /** Is this a fuel recipe? */
  fuel: boolean;
  /** Is it a weapon or tool recipe? */
  weaponOrTool: boolean;
  /** Does it produce a by-product? */
  hasByProduct: boolean;
  /** Recipe tier (1-… ) */
  tier: number;
  /** Which building type runs this recipe */
  building: string;
  /** The primary output */
  itemToBuild: ItemDataDto;
  /** Input ingredients */
  items: ItemDataDto[];
  /** Optional by-product output */
  byProduct?: ItemDataDto;
}
