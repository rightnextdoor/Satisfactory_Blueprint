// src/types/createTransportRouteRequest.ts
/**
 * Mirrors com.satisfactory.blueprint.dto.CreateTransportRouteRequest
 */
export interface CreateTransportRouteRequest {
  planId: number;
  stationName: string;
  vehicleType: string;
  capacity: number;
  assignedItemId: number;
  cartCapacities: number[];
}
