// src/types/imageUploadRequest.ts

import { type OwnerType } from './enums';

/**
 * Mirrors com.satisfactory.blueprint.dto.ImageUploadRequest
 */
export interface ImageUploadRequest {
  /** UUID of the image to reuse; omit or null when uploading a new file */
  id?: string;
  /** UUID of the previous image to unlink (if any) */
  oldImageId?: string;
  /** Which entity this image belongs to */
  ownerType: OwnerType;
  /** Primary key of that entity */
  ownerId: number;
  /** MIME type of the new image (required when `data` is provided) */
  contentType?: string;
  /** Base64-encoded image data for uploads; omit when reusing an existing image */
  data?: string;
}
