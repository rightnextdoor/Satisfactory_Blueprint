// src/services/buildingService.ts
import api from './api';
import type { BuildingDto, IdRequest } from '../types';

const BASE = '/buildings';

export const buildingService = {
  /** GET /api/buildings/list */
  async listAll(): Promise<BuildingDto[]> {
    const resp = await api.get<BuildingDto[]>(`${BASE}/list`);
    return resp.data;
  },

  /** POST /api/buildings/get */
  async getById(id: number): Promise<BuildingDto> {
    const resp = await api.post<BuildingDto>(`${BASE}/get`, {
      id,
    } as IdRequest);
    return resp.data;
  },

  /** POST /api/buildings/create */
  async create(dto: BuildingDto): Promise<BuildingDto> {
    const resp = await api.post<BuildingDto>(`${BASE}/create`, dto);
    return resp.data;
  },

  /** PUT /api/buildings/update */
  async update(dto: BuildingDto): Promise<BuildingDto> {
    const resp = await api.put<BuildingDto>(`${BASE}/update`, dto);
    return resp.data;
  },

  /** DELETE /api/buildings/delete */
  async delete(id: number): Promise<void> {
    await api.delete<void>(`${BASE}/delete`, { data: { id } as IdRequest });
  },
};
