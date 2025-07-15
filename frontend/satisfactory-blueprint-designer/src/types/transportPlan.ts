// src/types/transportPlan.ts
import type { TransportItemDto } from './transportItem';
import type { TransportRouteDto } from './transportRoute';

/**
 * Mirrors com.satisfactory.blueprint.dto.TransportPlanDto
 */
export interface TransportPlanDto {
  id: number;
  name: string;
  plannerId: number;
  transportItems: TransportItemDto[];
  routes: TransportRouteDto[];
}
