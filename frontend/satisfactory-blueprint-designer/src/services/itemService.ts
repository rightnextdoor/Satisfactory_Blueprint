// src/services/itemService.ts
import api from './api';
import type { ItemDto, IdRequest } from '../types';
import type { ItemCreateRequest } from '../types/itemCreateRequest';

const BASE = '/items';

export const itemService = {
  /** GET  /api/items/list → List all items */
  async listAll(): Promise<ItemDto[]> {
    const res = await api.get<ItemDto[]>(`${BASE}/list`);
    return res.data;
  },

  /** POST /api/items/get → Get one by ID */
  async getById(id: number): Promise<ItemDto> {
    const res = await api.post<ItemDto>(`${BASE}/get`, { id } as IdRequest);
    return res.data;
  },

  /** POST /api/items/create → Create new item */
  async create(req: ItemCreateRequest): Promise<ItemDto> {
    const res = await api.post<ItemDto>(`${BASE}/create`, req);
    return res.data;
  },

  /** PUT  /api/items/update → Update existing */
  async update(dto: ItemDto): Promise<ItemDto> {
    const res = await api.put<ItemDto>(`${BASE}/update`, dto);
    return res.data;
  },

  /** DELETE /api/items/delete → Remove by ID */
  async delete(id: number): Promise<void> {
    await api.delete<void>(`${BASE}/delete`, { data: { id } as IdRequest });
  },
};
