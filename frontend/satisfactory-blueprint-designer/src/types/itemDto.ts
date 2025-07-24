// src/types/itemDto.ts

import type { ImageDto } from './image';

/**
 * Mirrors com.satisfactory.blueprint.dto.ItemDto
 */
export interface ItemDto {
  id: number;
  name: string;
  /** The associated image, if any */
  image?: ImageDto;
  resource: boolean;
}
