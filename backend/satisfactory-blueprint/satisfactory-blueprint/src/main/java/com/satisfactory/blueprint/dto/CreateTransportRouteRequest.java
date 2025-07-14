package com.satisfactory.blueprint.dto;

import com.satisfactory.blueprint.entity.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransportRouteRequest {
    private Long planId;
    private String stationName;
    private VehicleType vehicleType;
    private Double capacity;
    private Long assignedItemId;
    private List<Double> cartCapacities;
}
