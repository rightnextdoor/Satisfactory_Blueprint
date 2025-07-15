// src/services/transportService.ts
import api from './api';
import type {
  TransportPlanDto,
  TransportRouteDto,
  CreateTransportPlanRequest,
  UpdateTransportPlanRequest,
  CreateTransportRouteRequest,
  UpdateTransportRouteRequest,
} from '../types';
import type { IdRequest } from '../types';

const BASE = '/transport-plans';

export const transportService = {
  /** GET  /api/transport-plans/list */
  async listPlans(): Promise<TransportPlanDto[]> {
    const res = await api.get<TransportPlanDto[]>(`${BASE}/list`);
    return res.data;
  },

  /** POST /api/transport-plans/get */
  async getPlan(id: number): Promise<TransportPlanDto> {
    const res = await api.post<TransportPlanDto>(`${BASE}/get`, {
      id,
    } as IdRequest);
    return res.data;
  },

  /** POST /api/transport-plans/create */
  async createPlan(req: CreateTransportPlanRequest): Promise<TransportPlanDto> {
    const res = await api.post<TransportPlanDto>(`${BASE}/create`, req);
    return res.data;
  },

  /** PUT  /api/transport-plans/update */
  async updatePlan(req: UpdateTransportPlanRequest): Promise<TransportPlanDto> {
    const res = await api.put<TransportPlanDto>(`${BASE}/update`, req);
    return res.data;
  },

  /** DELETE /api/transport-plans/delete */
  async deletePlan(id: number): Promise<void> {
    await api.delete<void>(`${BASE}/delete`, { data: { id } as IdRequest });
  },

  /** POST /api/transport-plans/routes/list */
  async listRoutes(planId: number): Promise<TransportRouteDto[]> {
    const res = await api.post<TransportRouteDto[]>(`${BASE}/routes/list`, {
      id: planId,
    } as IdRequest);
    return res.data;
  },

  /** POST /api/transport-plans/routes/create */
  async createRoute(
    req: CreateTransportRouteRequest
  ): Promise<TransportPlanDto> {
    const res = await api.post<TransportPlanDto>(`${BASE}/routes/create`, req);
    return res.data;
  },

  /** PUT  /api/transport-plans/routes/update */
  async updateRoute(
    req: UpdateTransportRouteRequest
  ): Promise<TransportPlanDto> {
    const res = await api.put<TransportPlanDto>(`${BASE}/routes/update`, req);
    return res.data;
  },

  /** DELETE /api/transport-plans/routes/delete */
  async deleteRoute(id: number): Promise<TransportPlanDto> {
    const res = await api.delete<TransportPlanDto>(`${BASE}/routes/delete`, {
      data: { id } as IdRequest,
    });
    return res.data;
  },
};
