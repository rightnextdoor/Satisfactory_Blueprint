// src/services/plannerService.ts

import api from './api';
import type {
  PlannerDto,
  EntryRecipeRequest,
  ManualAllocationRequest,
  ManualAllocationDeleteRequest,
  EntryDeleteRequest,
  PlannerRequestDto,
} from '../types/planner';
import type { IdRequest } from '../types';

const BASE = '/planners';

export const plannerService = {
  /** GET /api/planners/list */
  async listAll(): Promise<PlannerDto[]> {
    const resp = await api.get<PlannerDto[]>(`${BASE}/list`);
    return resp.data;
  },

  /** POST /api/planners/get */
  async getById(id: number): Promise<PlannerDto> {
    const resp = await api.post<PlannerDto>(`${BASE}/get`, { id } as IdRequest);
    return resp.data;
  },

  /** POST /api/planners/create */
  async create(dto: PlannerRequestDto): Promise<PlannerDto> {
    const resp = await api.post<PlannerDto>(`${BASE}/create`, dto);
    return resp.data;
  },

  /** PUT /api/planners/settings */
  async updateSettings(dto: PlannerRequestDto): Promise<PlannerDto> {
    const resp = await api.put<PlannerDto>(`${BASE}/settings`, dto);
    return resp.data;
  },

  /** DELETE /api/planners/delete */
  async deletePlanner(id: number): Promise<void> {
    await api.delete<void>(`${BASE}/delete`, { data: { id } as IdRequest });
  },

  /** PUT /api/planners/entry/recipe */
  async updateEntryRecipe(req: EntryRecipeRequest): Promise<PlannerDto> {
    const resp = await api.put<PlannerDto>(`${BASE}/entry/recipe`, req);
    return resp.data;
  },

  /** PUT /api/planners/entry/manual */
  async updateEntryManual(req: ManualAllocationRequest): Promise<PlannerDto> {
    const resp = await api.put<PlannerDto>(`${BASE}/entry/manual`, req);
    return resp.data;
  },

  /** DELETE /api/planners/entry/manual/delete */
  async deleteEntryManual(
    req: ManualAllocationDeleteRequest
  ): Promise<PlannerDto> {
    const resp = await api.delete<PlannerDto>(`${BASE}/entry/manual/delete`, {
      data: req,
    });
    return resp.data;
  },

  /** DELETE /api/planners/entry/delete */
  async deleteEntry(req: EntryDeleteRequest): Promise<PlannerDto> {
    const resp = await api.delete<PlannerDto>(`${BASE}/entry/delete`, {
      data: req,
    });
    return resp.data;
  },
};
