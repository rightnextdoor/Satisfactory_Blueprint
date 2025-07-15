// src/services/generatorService.ts
import api from './api';
import type { GeneratorDto, IdRequest } from '../types';

const BASE = '/generators';

export const generatorService = {
  /** GET /api/generators/list */
  async listAll(): Promise<GeneratorDto[]> {
    const res = await api.get<GeneratorDto[]>(`${BASE}/list`);
    return res.data;
  },

  /** POST /api/generators/get */
  async getById(id: number): Promise<GeneratorDto> {
    const res = await api.post<GeneratorDto>(`${BASE}/get`, {
      id,
    } as IdRequest);
    return res.data;
  },

  /** POST /api/generators/create */
  async create(dto: GeneratorDto): Promise<GeneratorDto> {
    const res = await api.post<GeneratorDto>(`${BASE}/create`, dto);
    return res.data;
  },

  /** PUT /api/generators/update */
  async update(dto: GeneratorDto): Promise<GeneratorDto> {
    const res = await api.put<GeneratorDto>(`${BASE}/update`, dto);
    return res.data;
  },

  /** DELETE /api/generators/delete */
  async delete(id: number): Promise<void> {
    await api.delete<void>(`${BASE}/delete`, { data: { id } as IdRequest });
  },
};
