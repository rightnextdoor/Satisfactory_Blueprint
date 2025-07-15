// src/types/updateTransportRouteRequest.ts
import type { CartAllocationDto } from './cartAllocation';

/**
 * Mirrors com.satisfactory.blueprint.dto.UpdateTransportRouteRequest
 */
export interface UpdateTransportRouteRequest {
  id: number;
  planId: number;
  stationName: string;
  capacity: number;
  assignedItemId: number;
  cartCapacities: number[];
  cartAllocations: CartAllocationDto[];
}
