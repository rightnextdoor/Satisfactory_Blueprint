// src/services/imageService.ts

import api from './api';
import type { ImageDto } from '../types/image';
import type { ImageUploadRequest } from '../types/imageUploadRequest';
import type { OwnerType } from '../types/enums';

const BASE = '/images';

export const imageService = {
  /**
   * Upload (or reuse) an image, link/unlink owner in one call.
   * POST /api/images/upload
   */
  async upload(req: ImageUploadRequest): Promise<ImageDto> {
    const resp = await api.post<ImageDto>(`${BASE}/upload`, req);
    return resp.data;
  },

  /**
   * List all images (for “use existing” picker).
   * GET /api/images/list
   */
  async list(): Promise<ImageDto[]> {
    const resp = await api.get<ImageDto[]>(`${BASE}/list`);
    return resp.data;
  },

  /**
   * Fetch a single image (including its blob).
   * POST /api/images/get
   */
  async get(id: string): Promise<ImageDto> {
    const resp = await api.post<ImageDto>(`${BASE}/get`, { id });
    return resp.data;
  },

  /**
   * Unlink (and possibly delete) an image from its owner.
   * DELETE /api/images/delete
   */
  async remove(
    id: string,
    ownerType: OwnerType,
    ownerId: number
  ): Promise<void> {
    await api.delete<void>(`${BASE}/delete`, {
      data: { id, ownerType, ownerId } as ImageUploadRequest,
    });
  },
};
