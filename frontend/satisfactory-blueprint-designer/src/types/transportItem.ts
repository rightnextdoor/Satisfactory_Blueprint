// src/types/transportItem.ts
import type { ItemDto } from './itemDto';

/**
 * Mirrors com.satisfactory.blueprint.dto.TransportItemDto
 */
export interface TransportItemDto {
  item: ItemDto;
  targetQuantity: number;
  coveredQuantity: number;
  remainingQuantity: number;
}
