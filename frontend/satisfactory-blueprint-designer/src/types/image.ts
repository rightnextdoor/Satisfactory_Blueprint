// src/types/image.ts

/**
 * Mirrors com.satisfactory.blueprint.entity.Image
 * (returned by POST /upload as JSON)
 */
export interface ImageDto {
  // NOTE: adjust/add fields if your entity has more (e.g. id, createdAt)
  key: string;
  contentType: string;
  data: string; // base64‐encoded string
}
