// src/types/createTransportPlanRequest.ts
import type { TransportItemRequestDto } from './transportItemRequest';

/**
 * Mirrors com.satisfactory.blueprint.dto.CreateTransportPlanRequest
 */
export interface CreateTransportPlanRequest {
  name: string;
  plannerId: number;
  addAllResources: boolean;
  transportItems: TransportItemRequestDto[];
}
