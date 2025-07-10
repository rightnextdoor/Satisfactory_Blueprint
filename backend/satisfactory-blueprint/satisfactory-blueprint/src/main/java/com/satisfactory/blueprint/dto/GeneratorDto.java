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
    private ItemDataDto byProduct;
    private double powerOutput;
    private double burnTime;
    private List<ItemDataDto> fuelItems;
    private String iconKey;
}
