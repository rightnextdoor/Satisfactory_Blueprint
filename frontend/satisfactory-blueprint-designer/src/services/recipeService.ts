// src/services/recipeService.ts
import api from './api';
import type { RecipeDto, IdRequest, NameRequest } from '../types';

const BASE = '/recipes';

export const recipeService = {
  /** GET  /api/recipes/list → all recipes */
  async listAll(): Promise<RecipeDto[]> {
    const res = await api.get<RecipeDto[]>(`${BASE}/list`);
    return res.data;
  },

  /** POST /api/recipes/get → find by ID */
  async getById(id: number): Promise<RecipeDto> {
    const res = await api.post<RecipeDto>(`${BASE}/get`, { id } as IdRequest);
    return res.data;
  },

  /** POST /api/recipes/by-item → recipes that produce the given item */
  async getByItem(name: string): Promise<RecipeDto[]> {
    const res = await api.post<RecipeDto[]>(`${BASE}/by-item`, {
      name,
    } as NameRequest);
    return res.data;
  },

  /** POST /api/recipes/default → default (non-alternate) recipe for item */
  async getDefault(name: string): Promise<RecipeDto> {
    const res = await api.post<RecipeDto>(`${BASE}/default`, {
      name,
    } as NameRequest);
    return res.data;
  },

  /** POST /api/recipes/create → create a new recipe */
  async create(dto: RecipeDto): Promise<RecipeDto> {
    const res = await api.post<RecipeDto>(`${BASE}/create`, dto);
    return res.data;
  },

  /** PUT  /api/recipes/update → update an existing recipe */
  async update(dto: RecipeDto): Promise<RecipeDto> {
    const res = await api.put<RecipeDto>(`${BASE}/update`, dto);
    return res.data;
  },

  /** DELETE /api/recipes/delete → delete by ID */
  async delete(id: number): Promise<void> {
    await api.delete<void>(`${BASE}/delete`, { data: { id } as IdRequest });
  },
};
