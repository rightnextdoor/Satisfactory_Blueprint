// src/services/imageService.ts
import api from './api';
import type { ImageDto, ImageUploadRequest, ImageKeyRequest } from '../types';

const BASE = '/images';

export const imageService = {
  /** POST /api/images/upload → returns saved Image entity as JSON */
  async upload(req: ImageUploadRequest): Promise<ImageDto> {
    const resp = await api.post<ImageDto>(`${BASE}/upload`, req);
    return resp.data;
  },

  /** POST /api/images/get → returns raw bytes as Blob */
  async get(key: string): Promise<Blob> {
    const resp = await api.post<Blob>(
      `${BASE}/get`,
      { key } as ImageKeyRequest,
      { responseType: 'blob' }
    );
    return resp.data;
  },

  /** DELETE /api/images/delete */
  async delete(key: string): Promise<void> {
    await api.delete<void>(`${BASE}/delete`, {
      data: { key } as ImageKeyRequest,
    });
  },
};
