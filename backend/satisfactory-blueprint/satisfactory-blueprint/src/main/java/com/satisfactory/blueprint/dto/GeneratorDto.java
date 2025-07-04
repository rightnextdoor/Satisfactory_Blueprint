package com.satisfactory.blueprint.dto;

import com.satisfactory.blueprint.entity.enums.GeneratorType;
import com.satisfactory.blueprint.entity.enums.FuelType;
import lombok.Data;

import java.util.List;

@Data
public class GeneratorDto {
    private Long id;
    private GeneratorType name;
    private FuelType fuelType;
    private boolean hasByProduct;
    private ItemDto byProduct;        // nullable
    private double powerOutput;
    private double burnTime;
    private List<ItemDto> fuelItems;  // list of fuel item DTOs
    private String iconKey;           // nullable
}
