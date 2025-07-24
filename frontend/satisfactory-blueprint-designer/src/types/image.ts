// src/types/image.ts

/**
 * Mirrors com.satisfactory.blueprint.dto.ImageDto
 * (returned by POST /api/images/upload and GET /api/images/{id})
 */
export interface ImageDto {
  /** The UUID primary key of the image */
  id: string;

  /** The MIME type, e.g. "image/png" */
  contentType: string;

  /**
   * Base64-encoded image data.
   * May be null when listing all images (to avoid large payloads).
   */
  data: string | null;
}
