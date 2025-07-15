// src/types/updateTransportPlanRequest.ts
import type { TransportItemRequestDto } from './transportItemRequest';

/**
 * Mirrors com.satisfactory.blueprint.dto.UpdateTransportPlanRequest
 */
export interface UpdateTransportPlanRequest {
  id: number;
  name: string;
  plannerId: number;
  addAllResources: boolean;
  transportItems: TransportItemRequestDto[];
}
