// src/types/itemDataDto.ts

import type { ItemDto } from './itemDto';

/**
 * Mirrors com.satisfactory.blueprint.dto.ItemDataDto
 */
export interface ItemDataDto {
  amount: number;
  item: ItemDto;
}
