// src/types/imageUploadRequest.ts

/**
 * Mirrors com.satisfactory.blueprint.dto.ImageUploadRequest
 */
export interface ImageUploadRequest {
  key: string;
  contentType: string;
  data: string; // base64‐encoded image data
}
