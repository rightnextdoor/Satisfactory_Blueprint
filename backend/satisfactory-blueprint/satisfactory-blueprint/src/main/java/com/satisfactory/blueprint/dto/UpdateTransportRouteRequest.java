package com.satisfactory.blueprint.dto;

import com.satisfactory.blueprint.entity.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTransportRouteRequest {
    private Long id;
    private Long planId;
    private String stationName;
    private Double capacity;
    private Long assignedItemId;
    private List<Double> cartCapacities;
    private List<CartAllocationDto> cartAllocations;
}
