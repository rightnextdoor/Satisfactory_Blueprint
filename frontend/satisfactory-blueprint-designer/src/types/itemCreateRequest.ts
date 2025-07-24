import type { ImageDto } from './image';

// src/types/itemCreateRequest.ts
export interface ItemCreateRequest {
  name: string;
  resource: boolean;
  image?: ImageDto;
}
