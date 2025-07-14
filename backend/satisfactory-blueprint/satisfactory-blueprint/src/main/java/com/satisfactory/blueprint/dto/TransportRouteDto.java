package com.satisfactory.blueprint.dto;

import com.satisfactory.blueprint.entity.enums.VehicleType;
import com.satisfactory.blueprint.entity.enums.FuelType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransportRouteDto {
    private Long id;
    private Long planId;
    private String stationName;
    private VehicleType vehicleType;
    private Double capacity;
    private ItemDto assignedItem;
    private Double loadQuantity;
    private List<Double> cartCapacities;
    private List<CartAllocationDto> cartAllocations;
}
