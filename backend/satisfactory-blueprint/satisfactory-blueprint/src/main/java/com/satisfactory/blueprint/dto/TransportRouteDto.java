package com.satisfactory.blueprint.dto;

import com.satisfactory.blueprint.entity.enums.VehicleType;
import com.satisfactory.blueprint.entity.enums.FuelType;
import lombok.Data;
import java.util.List;

@Data
public class TransportRouteDto {
    private Long id;
    private VehicleType vehicleType;
    private FuelType fuelType;
    private String destinationLabel;
    private int vehicleCount;
    private int carsPerVehicle;
    private List<TransportItemDto> items;
}
