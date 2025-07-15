// src/types/transportRoute.ts
import type { ItemDto } from './itemDto';
import type { CartAllocationDto } from './cartAllocation';

/**
 * Mirrors com.satisfactory.blueprint.dto.TransportRouteDto
 */
export interface TransportRouteDto {
  id: number;
  planId: number;
  stationName: string;
  vehicleType: string; // enum VehicleType as string
  capacity: number;
  assignedItem: ItemDto;
  loadQuantity: number;
  cartCapacities: number[];
  cartAllocations: CartAllocationDto[];
}
